/**
 * A measurement of the real cover <img> as it sits on the page. The 3D book's first
 * frame is built from this, so the handoff has nothing to give itself away.
 *
 * Pure DOM -- deliberately free of three.js imports so `Book.tsx` can use it without
 * pulling the lazy WebGL chunk into the main bundle.
 */
export interface CoverSnapshot {
  /** Viewport-relative centre, in CSS pixels. */
  centerX: number;
  centerY: number;
  /** Untransformed layout size, in CSS pixels. */
  width: number;
  height: number;
  /** Live CSS rotation converted to three.js Z sign, in radians. */
  rotation: number;
}

export function captureCover(el: HTMLElement): CoverSnapshot {
  const rect = el.getBoundingClientRect();

  // The cover carries a -rotate-2 that animates to 0 on hover, so it may be measured
  // mid-transition. Read the live matrix rather than assuming either end state.
  let rotation = 0;
  const transform = window.getComputedStyle(el).transform;
  if (transform && transform !== 'none' && typeof DOMMatrixReadOnly !== 'undefined') {
    const m = new DOMMatrixReadOnly(transform);
    // CSS rotates clockwise on screen; three.js Z rotates counter-clockwise.
    rotation = -Math.atan2(m.b, m.a);
  }

  return {
    // A centred-origin rotation leaves the centre fixed, so the bounding rect is
    // trustworthy here...
    centerX: rect.left + rect.width / 2,
    centerY: rect.top + rect.height / 2,
    // ...but its width/height describe the *bounding box of the rotated element*,
    // which is larger than the element. offsetWidth/Height give the real layout box.
    width: el.offsetWidth,
    height: el.offsetHeight,
    rotation,
  };
}
