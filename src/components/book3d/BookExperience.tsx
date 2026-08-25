import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import type { Ref, RefObject } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  ToneMapping,
} from '@react-three/postprocessing';
import {
  BlendFunction,
  ToneMappingMode,
  type BloomEffect,
  type ChromaticAberrationEffect,
  type ToneMappingEffect,
} from 'postprocessing';

import BookScene, { type SceneHandles } from './BookScene';
import type { CoverSnapshot } from './coverSnapshot';

/**
 * `@react-three/postprocessing` types its `forwardRef` against the effect *class*
 * rather than the instance, so a correctly-typed instance ref is rejected at the JSX
 * site even though the instance is what gets attached at runtime.
 */
const asEffectRef = <T,>(ref: RefObject<T>) => ref as unknown as Ref<never>;

interface BookExperienceProps {
  snapshot: CoverSnapshot;
  coverImage: string;
  /** False while the chunk and texture are still loading -- canvas stays invisible. */
  running: boolean;
  rewinding: boolean;
  onReady: () => void;
  onFinished: () => void;
  onDismiss: () => void;
}

export default function BookExperience({
  snapshot,
  coverImage,
  running,
  rewinding,
  onReady,
  onFinished,
  onDismiss,
}: BookExperienceProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<BloomEffect>(null);
  const chromaticRef = useRef<ChromaticAberrationEffect>(null);
  const toneMappingRef = useRef<ToneMappingEffect>(null);

  const handles: SceneHandles = useMemo(
    () => ({
      bloom: bloomRef,
      chromatic: chromaticRef,
      toneMapping: toneMappingRef,
      backdrop: backdropRef,
    }),
    []
  );

  const zeroOffset = useMemo(() => new THREE.Vector2(0, 0), []);

  // ToneMappingEffect blends at full opacity by default. The scene only starts driving
  // this value once the clock runs, so zero it here or frame one is tone mapped -- the
  // exact discrepancy `flat` was set to avoid. Parent layout effects run after the
  // composer's children have mounted, so the ref is populated by now.
  useLayoutEffect(() => {
    if (toneMappingRef.current) toneMappingRef.current.blendMode.opacity.value = 0;
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDismiss();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onDismiss]);

  // A real resize invalidates the measured rect, so the book would no longer land where
  // it started. Rewind rather than finish on a stale target.
  //
  // Mobile browsers, though, fire `resize` when the URL bar slides in or out, which
  // would abort the sequence for no reason. Only react to changes big enough to be an
  // actual window or orientation change.
  useEffect(() => {
    const initialWidth = window.innerWidth;
    const initialHeight = window.innerHeight;

    const onResize = () => {
      const widthChanged = window.innerWidth !== initialWidth;
      const heightJumped = Math.abs(window.innerHeight - initialHeight) > 150;
      if (widthChanged || heightJumped) onDismiss();
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-[100]"
      // Swallows input from the moment it mounts, including while still loading.
      // iOS Safari does not reliably honour `overflow: hidden` on the body, and a
      // stray swipe during preload would scroll the page out from under the rect we
      // just measured -- so the covering layer has to refuse the gesture itself.
      style={{ touchAction: 'none', overscrollBehavior: 'none' }}
      onPointerDown={() => {
        if (running) onDismiss();
      }}
      aria-hidden="true"
    >
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-primary-dark/50 backdrop-blur-xl"
        style={{ opacity: 0 }}
      />

      {/* Held at zero opacity until the scene reports a painted first frame, so the
          three.js download and texture decode never show as a hole in the page. */}
      <div className="absolute inset-0" style={{ opacity: running ? 1 : 0 }}>
        <Canvas
          // `flat` disables R3F's default ACES tone mapping. Without it the cover
          // renders visibly duller than the DOM image and the handoff gives itself away.
          flat
          gl={{ antialias: false, alpha: true }}
          // Capped at 1.5 rather than the display's full ratio. Bloom's mipmap chain
          // is the only expensive thing in this scene and its cost scales with the
          // square of this number, so 2 -> 1.5 removes ~44% of the GPU work while
          // staying sharp enough for a 5-second flourish.
          dpr={[1, 1.5]}
          camera={{ fov: 45, position: [0, 0, 8] }}
        >
          <ambientLight intensity={0.85} />
          <directionalLight position={[3, 4, 6]} intensity={2.4} />
          <directionalLight position={[-5, 2, -3]} intensity={1.3} color="#8BAE66" />

          <BookScene
            snapshot={snapshot}
            coverImage={coverImage}
            handles={handles}
            running={running}
            rewinding={rewinding}
            onReady={onReady}
            onFinished={onFinished}
          />

          {/* EffectComposer renders offscreen, where the context's MSAA does nothing --
              hence antialias:false above and multisampling here. Kept at 2 rather than
              dropped: the book is a high-contrast silhouette turning slowly against a
              blurred backdrop, which is the worst case for visible stair-stepping. */}
          <EffectComposer multisampling={2}>
            <Bloom
              ref={asEffectRef(bloomRef)}
              mipmapBlur
              luminanceThreshold={0.9}
              intensity={0}
            />
            <ChromaticAberration
              ref={asEffectRef(chromaticRef)}
              offset={zeroOffset}
              radialModulation={false}
              modulationOffset={0}
            />
            {/* Last in the chain, and blended in only during the wild middle beats so
                the LIFT and RETURN frames stay an exact sRGB match for the DOM image. */}
            <ToneMapping
              ref={asEffectRef(toneMappingRef)}
              mode={ToneMappingMode.ACES_FILMIC}
              blendFunction={BlendFunction.NORMAL}
            />
          </EffectComposer>
        </Canvas>
      </div>
    </div>
  );
}
