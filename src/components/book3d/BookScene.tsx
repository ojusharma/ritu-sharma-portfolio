import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import type { RefObject } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture, Sparkles } from '@react-three/drei';
import type {
  BloomEffect,
  ChromaticAberrationEffect,
  ToneMappingEffect,
} from 'postprocessing';

import type { CoverSnapshot } from './coverSnapshot';
import { PAGE_COUNT, TOTAL_DURATION, lerp, sampleTimeline } from './bookTimeline';
import { createPageTexture } from './pageTexture';

/** Distinct page spreads, cycled across the pages. Three keeps VRAM modest while
 *  still making sure no two adjacent pages are identical. */
const PAGE_VARIANTS = 3;

/** Used only if the artwork cannot be sampled -- the current cover's background. */
const COVER_YELLOW_FALLBACK = '#FFC20E';

/**
 * Reads the cover's background colour out of the artwork itself, so the back and spine
 * wrap in the real printed colour rather than a hand-copied hex that drifts if the
 * cover is ever replaced. Averages a strip inset from the top-left, which is flat
 * background on this cover and on any plausible replacement.
 */
function sampleArtworkColor(image: CanvasImageSource | undefined): string {
  try {
    if (!image) return COVER_YELLOW_FALLBACK;
    const { width, height } = image as { width: number; height: number };
    if (!width || !height) return COVER_YELLOW_FALLBACK;

    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return COVER_YELLOW_FALLBACK;

    // Downsampling the strip to a single pixel averages it for free.
    ctx.drawImage(
      image,
      Math.round(width * 0.02),
      Math.round(height * 0.015),
      Math.round(width * 0.06),
      Math.round(height * 0.02),
      0,
      0,
      1,
      1
    );

    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `rgb(${r}, ${g}, ${b})`;
  } catch {
    // Tainted canvas or an unsupported source type -- the fallback is close enough.
    return COVER_YELLOW_FALLBACK;
  }
}

/** Palette lifted from tailwind.config.js so the 3D book belongs to the same site. */
const COLOR = {
  primaryDark: '#1B211A',
  primary: '#628141',
  cream: '#EBD5AB',
} as const;

/**
 * Handles into the post-processing effects and the CSS backdrop. Everything is driven
 * from this component's single `useFrame` rather than from per-effect frame callbacks,
 * so there is no ambiguity about which values belong to which rendered frame.
 */
export interface SceneHandles {
  bloom: RefObject<BloomEffect>;
  chromatic: RefObject<ChromaticAberrationEffect>;
  toneMapping: RefObject<ToneMappingEffect>;
  backdrop: RefObject<HTMLDivElement>;
}

interface BookSceneProps {
  snapshot: CoverSnapshot;
  coverImage: string;
  handles: SceneHandles;
  /** True once the sequence should start advancing. */
  running: boolean;
  /** When true the clock runs backwards, rewinding the sequence gracefully. */
  rewinding: boolean;
  /** Fired after the very first painted frame -- the cue to hide the DOM image. */
  onReady: () => void;
  onFinished: () => void;
}

export default function BookScene({
  snapshot,
  coverImage,
  handles,
  running,
  rewinding,
  onReady,
  onFinished,
}: BookSceneProps) {
  const { viewport, size, gl } = useThree();

  const texture = useTexture(coverImage);

  // useTexture suspends until decode, so the image is ready by the time this runs.
  const wrapColor = useMemo(
    () => sampleArtworkColor(texture.image as CanvasImageSource | undefined),
    [texture]
  );

  const pageTextures = useMemo(
    () => Array.from({ length: PAGE_VARIANTS }, (_, i) => createPageTexture(i)),
    []
  );

  // Canvas textures are created by hand, so they are not in drei's cache and nothing
  // else will release them.
  useEffect(() => () => pageTextures.forEach((t) => t.dispose()), [pageTextures]);

  const rootRef = useRef<THREE.Group>(null);
  const coverPivotRef = useRef<THREE.Group>(null);
  const coverMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const gutterLightRef = useRef<THREE.PointLight>(null);
  const sparklesRef = useRef<THREE.Points>(null);
  const pageRefs = useRef<THREE.Group[]>([]);

  const clock = useRef(0);
  const finished = useRef(false);

  // Geometry is driven by the measured DOM rect, not the texture's intrinsic size.
  // If CSS ever renders the cover at a different ratio than the file, the rect is what
  // the user actually sees, so the rect is what must match.
  const geo = useMemo(() => {
    const width = snapshot.width / viewport.factor;
    const height = snapshot.height / viewport.factor;

    // Sizing has to satisfy both axes. A height-only budget reads well on a wide
    // laptop but overflows the sides of a tall, narrow phone -- and the cover swinging
    // open reaches well past the closed silhouette, so the width budget has to leave
    // room for that too. Portrait screens also take a smaller share of the height,
    // since the book is pushed toward the camera on top of this.
    const portrait = viewport.width < viewport.height;
    const heightBudget = viewport.height * (portrait ? 0.38 : 0.52);
    const widthBudget = viewport.width * 0.9;
    const OPEN_SWING = 1.45;

    return {
      width,
      height,
      depth: width * 0.15,
      coverThickness: width * 0.018,
      startX: (snapshot.centerX - size.width / 2) / viewport.factor,
      startY: -(snapshot.centerY - size.height / 2) / viewport.factor,
      fullScale: Math.min(
        heightBudget / height,
        widthBudget / (width * OPEN_SWING)
      ),
    };
  }, [snapshot, viewport.factor, viewport.width, viewport.height, size.width, size.height]);

  useLayoutEffect(() => {
    const maxAnisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = maxAnisotropy;
    texture.needsUpdate = true;

    // Fanned pages are seen at steep grazing angles, where anisotropy is the
    // difference between legible body text and a grey smear.
    pageTextures.forEach((t) => {
      t.anisotropy = maxAnisotropy;
      t.needsUpdate = true;
    });

    if (import.meta.env.DEV && texture.image) {
      const fileRatio = texture.image.width / texture.image.height;
      const domRatio = snapshot.width / snapshot.height;
      if (Math.abs(fileRatio - domRatio) > 0.02) {
        console.warn(
          `[book3d] Cover is rendered at ${domRatio.toFixed(3)} but the file is ` +
            `${fileRatio.toFixed(3)} -- CSS is distorting the cover.`
        );
      }
    }
  }, [texture, pageTextures, gl, snapshot.width, snapshot.height]);

  // Park the book on the DOM image and paint one frame before anyone is told we are
  // ready. Two nested rAFs: the first is scheduled before the browser paints this
  // commit, the second fires after it, so by then frame one is genuinely on screen.
  useLayoutEffect(() => {
    applyFrame(0);
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => onReady());
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyFrame(t: number) {
    const s = sampleTimeline(t, snapshot.rotation);

    const root = rootRef.current;
    if (root) {
      root.position.set(
        lerp(geo.startX, 0, s.travel),
        lerp(geo.startY, 0, s.travel),
        s.depth
      );
      const scale = lerp(1, geo.fullScale, s.travel);
      root.scale.setScalar(scale);
      root.rotation.set(s.rotationX, s.rotationY, s.rotationZ);
    }

    if (coverPivotRef.current) {
      coverPivotRef.current.rotation.y = -s.coverOpen;
    }

    // At t=0 the cover is pure unlit texture, pixel-identical to the DOM <img>.
    // Lighting fades in only once it starts moving.
    if (coverMatRef.current) {
      coverMatRef.current.emissiveIntensity = s.emissive;
    }

    if (gutterLightRef.current) {
      gutterLightRef.current.intensity = s.gutterGlow * 3;
    }

    pageRefs.current.forEach((page, i) => {
      if (!page) return;
      const stagger = (i + 1) / PAGE_COUNT;
      const ripple = Math.sin(t * 6 + i * 0.9) * 0.16 * s.pageFan;
      page.rotation.y = -s.coverOpen * stagger * 0.82 + ripple;
    });

    if (sparklesRef.current) {
      sparklesRef.current.visible = s.sparkles > 0.02;
      sparklesRef.current.scale.setScalar(0.6 + s.sparkles * 0.9);
    }

    if (handles.bloom.current) {
      handles.bloom.current.intensity = s.bloom;
    }
    if (handles.chromatic.current) {
      handles.chromatic.current.offset.set(s.chromatic, s.chromatic * 0.6);
    }
    if (handles.toneMapping.current) {
      handles.toneMapping.current.blendMode.opacity.value = s.toneMapping;
    }
    if (handles.backdrop.current) {
      handles.backdrop.current.style.opacity = String(s.backdrop);
    }
  }

  useFrame((_, delta) => {
    if (!running || finished.current) return;

    // Guard against a huge delta after a background-tab stall.
    const step = Math.min(delta, 1 / 30) * (rewinding ? -1 : 1);
    clock.current += step;

    if (clock.current >= TOTAL_DURATION) {
      clock.current = TOTAL_DURATION;
      finished.current = true;
      onFinished();
    } else if (clock.current <= 0) {
      clock.current = 0;
      finished.current = true;
      onFinished();
    }

    applyFrame(clock.current);
  });

  const { width, height, depth, coverThickness } = geo;
  const halfSpine = -width / 2;

  return (
    <group ref={rootRef}>
      {/* Back cover. Sampled from the artwork so it matches the printed front, which
          matters here because the spin shows both within the same second. */}
      <mesh position={[0, 0, -depth / 2]}>
        <boxGeometry args={[width, height, coverThickness]} />
        <meshPhysicalMaterial color={wrapColor} roughness={0.55} clearcoat={0.4} />
      </mesh>

      {/* Spine. Part of the same wrap as the front and back on a real paperback. */}
      <mesh position={[halfSpine, 0, 0]}>
        <boxGeometry args={[coverThickness, height, depth]} />
        <meshPhysicalMaterial color={wrapColor} roughness={0.5} clearcoat={0.5} />
      </mesh>

      {/* Page block. Thinner than the cavity and pushed toward the back cover so the
          loose pages below can sit clear of it -- when the two overlap, every pixel
          where they meet is a coin toss for the depth test and the pages flicker. */}
      <mesh position={[coverThickness, 0, -depth * 0.12]}>
        <boxGeometry args={[width * 0.97, height * 0.96, depth * 0.5]} />
        <meshStandardMaterial color={COLOR.cream} roughness={0.9} />
      </mesh>

      {/* Loose pages, each hinged at the spine so they can fan */}
      {Array.from({ length: PAGE_COUNT }).map((_, i) => (
        <group
          key={i}
          // Stacked in the gap between the block's front face (-depth*0.37 .. depth*0.13)
          // and the front cover (depth*0.5), so nothing ever intersects.
          position={[
            halfSpine,
            0,
            lerp(depth * 0.2, depth * 0.42, i / (PAGE_COUNT - 1)),
          ]}
          ref={(node) => {
            if (node) pageRefs.current[i] = node;
          }}
        >
          <mesh position={[width / 2, 0, 0]}>
            <planeGeometry args={[width * 0.94, height * 0.94]} />
            <meshStandardMaterial
              map={pageTextures[i % PAGE_VARIANTS]}
              roughness={0.95}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}

      {/* Warm light leaking out of the gutter as the book opens */}
      <pointLight
        ref={gutterLightRef}
        position={[halfSpine + width * 0.1, 0, 0]}
        color={COLOR.cream}
        intensity={0}
        // three r165+ dropped legacy lighting, so decay is physical. Softened here
        // because the gutter sits only a fraction of a world unit from the pages.
        decay={1.2}
        distance={width * 4}
      />

      <Sparkles
        ref={sparklesRef}
        count={70}
        scale={Math.max(width, height) * 2.2}
        size={4}
        speed={0.5}
        color={COLOR.cream}
        visible={false}
      />

      {/* Front cover, hinged at the spine edge */}
      <group ref={coverPivotRef} position={[halfSpine, 0, depth / 2]}>
        <mesh position={[width / 2, 0, 0]}>
          <boxGeometry args={[width, height, coverThickness]} />
          <meshPhysicalMaterial
            color={COLOR.primaryDark}
            roughness={0.55}
            clearcoat={0.4}
          />
        </mesh>
        {/* The artwork sits just proud of the cover so it owns its own material. */}
        <mesh position={[width / 2, 0, coverThickness / 2 + 0.0015]}>
          <planeGeometry args={[width, height]} />
          <meshPhysicalMaterial
            ref={coverMatRef}
            map={texture}
            emissive="#ffffff"
            emissiveMap={texture}
            emissiveIntensity={1}
            roughness={0.32}
            clearcoat={1}
            clearcoatRoughness={0.18}
          />
        </mesh>
      </group>
    </group>
  );
}
