/**
 * The whole 3D book sequence, as pure math. No three.js, no React -- every value the
 * scene animates is a function of elapsed time, so the sequence can be retimed here
 * without touching scene code.
 *
 * Because every curve is continuous in `t`, running the clock backwards produces a
 * graceful rewind. That is how early aborts (Escape / click) are handled: reverse the
 * clock rather than cutting to the RETURN beat, which would pop.
 */

const TAU = Math.PI * 2;

export const TOTAL_DURATION = 4.95;

/** Beat boundaries, in seconds. */
const BEAT = {
  liftStart: 0.0,
  spinStart: 0.4,
  spinEnd: 1.6,
  openStart: 1.6,
  openEnd: 2.6,
  vortexStart: 2.4,
  vortexEnd: 3.2,
  snapStart: 3.2,
  snapEnd: 4.05,
  returnStart: 4.05,
} as const;

/** How far the book opens at full bloom, in radians (~150 degrees). */
const COVER_OPEN_ANGLE = 2.62;

/** Number of loose page planes fanned out of the block during OPEN. */
export const PAGE_COUNT = 6;

// --- easing -----------------------------------------------------------------

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

/** Normalised 0..1 progress through a time window. */
export const phase = (t: number, start: number, end: number) =>
  clamp01((t - start) / (end - start));

export const lerp = (a: number, b: number, x: number) => a + (b - a) * x;

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInCubic = (x: number) => x * x * x;
const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

const easeOutBack = (x: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

const easeOutElastic = (x: number) => {
  const c4 = TAU / 3;
  if (x === 0) return 0;
  if (x === 1) return 1;
  return Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
};

// --- sampled state ----------------------------------------------------------

export interface TimelineState {
  /** 0 = parked on the DOM image, 1 = centred at full size. */
  travel: number;
  /** Push toward the camera, in world units. */
  depth: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  /** Front cover hinge angle, radians. */
  coverOpen: number;
  /** 0..1 fan spread of the loose pages. */
  pageFan: number;
  /** 1 = unlit texture (matches the DOM image exactly), 0 = fully lit. */
  emissive: number;
  /** Scales every effect so frame one and the final frame are pristine. */
  envelope: number;
  bloom: number;
  chromatic: number;
  /** Blend weight for ACES tone mapping -- 0 while fidelity matters. */
  toneMapping: number;
  sparkles: number;
  /** Warm light leaking from the gutter as the cover opens. */
  gutterGlow: number;
  /** Opacity of the blurred page backdrop. */
  backdrop: number;
}

/**
 * @param t elapsed seconds
 * @param startRotation the cover image's live CSS rotation, radians (three.js sign)
 */
export function sampleTimeline(t: number, startRotation: number): TimelineState {
  // Symmetric enter/exit so the book leaves and returns along the same path.
  const enter = easeOutBack(phase(t, BEAT.liftStart, 1.1));
  const exit = easeInOutCubic(phase(t, BEAT.returnStart, TOTAL_DURATION));
  const travel = clamp01(enter) * (1 - exit);

  // Keeps effects at exactly zero on the first and last frames.
  const envelope =
    easeOutCubic(phase(t, 0.1, 0.6)) * (1 - easeInCubic(phase(t, 4.2, TOTAL_DURATION)));

  // Three full turns total, so the book lands back at rest with no correction.
  const rotationY =
    TAU *
    (easeInOutCubic(phase(t, BEAT.spinStart, BEAT.spinEnd)) +
      easeInOutCubic(phase(t, BEAT.vortexStart, BEAT.vortexEnd)) +
      easeOutCubic(phase(t, BEAT.snapStart, BEAT.snapEnd)));

  const opened = easeOutCubic(phase(t, BEAT.openStart, BEAT.openEnd));
  // Elastic overshoot past shut reads as a slam; allow a little compression.
  const slam = easeOutElastic(phase(t, BEAT.snapStart, BEAT.snapEnd));
  const coverOpen = Math.max(COVER_OPEN_ANGLE * opened * (1 - slam), -0.06);

  const vortex =
    easeInOutCubic(phase(t, 2.2, 3.0)) * (1 - easeInOutCubic(phase(t, 3.2, 3.9)));

  return {
    travel,
    depth: travel * 2.0,
    // Wobble is scaled by travel, so it is zero while parked on the image.
    rotationX: (0.28 * Math.sin(t * 2.1) + 0.22 * vortex * Math.sin(t * 5.3)) * travel,
    rotationY,
    rotationZ: startRotation * (1 - travel) + 0.26 * vortex * Math.sin(t * 1.7),
    coverOpen,
    pageFan: opened * (1 - slam),
    emissive:
      1 -
      easeOutCubic(phase(t, 0.05, 0.5)) * (1 - easeInCubic(phase(t, 4.35, TOTAL_DURATION))),
    envelope,
    bloom: envelope * (0.25 + 1.5 * easeInOutCubic(phase(t, 1.2, 2.8)) + 2.2 * slam * (1 - easeInCubic(phase(t, 3.6, 4.1)))),
    chromatic: envelope * 0.0045 * vortex,
    toneMapping: envelope,
    sparkles: easeOutCubic(phase(t, 1.6, 2.2)) * (1 - easeInCubic(phase(t, 3.0, 3.8))),
    gutterGlow: opened * (1 - slam),
    backdrop:
      easeOutCubic(phase(t, 0, 0.5)) *
      (1 - easeInOutCubic(phase(t, 4.2, TOTAL_DURATION))),
  };
}
