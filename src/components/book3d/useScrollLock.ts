import { useLayoutEffect } from 'react';

/**
 * Locks page scrolling without the layout shift that `overflow: hidden` normally
 * causes. Removing the scrollbar widens the viewport, which nudges every centered
 * container sideways -- fatal here, because the 3D handoff depends on the cover
 * image staying exactly where it was measured. Padding the body by the width the
 * scrollbar occupied keeps the content box identical.
 */
export function useScrollLock(locked: boolean) {
  useLayoutEffect(() => {
    if (!locked) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const basePadding = parseFloat(window.getComputedStyle(body).paddingRight) || 0;

    body.style.overflow = 'hidden';
    body.style.paddingRight = `${basePadding + scrollbarWidth}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [locked]);
}
