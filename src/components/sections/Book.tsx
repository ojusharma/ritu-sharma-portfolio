import { Suspense, lazy, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useScrollLock } from '../book3d/useScrollLock';
import { captureCover, type CoverSnapshot } from '../book3d/coverSnapshot';
import BookErrorBoundary from '../book3d/BookErrorBoundary';

const BookExperience = lazy(() => import('../book3d/BookExperience'));

/** `idle` -> `preloading` (image still visible) -> `running` (3D has the stage). */
type Phase = 'idle' | 'preloading' | 'running';

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext && canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function Book() {
  const { bookContent } = useContent();

  const publisherLink = bookContent.buyLinks.find(
    (l) => l.platform === 'Amazon'
  )?.link ?? bookContent.buyLinks[0].link;

  const googlePlayLink = bookContent.buyLinks.find(
    (l) => l.platform === 'Google Play'
  )?.link ?? bookContent.buyLinks[0].link;

  const coverRef = useRef<HTMLImageElement>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [snapshot, setSnapshot] = useState<CoverSnapshot | null>(null);
  const [rewinding, setRewinding] = useState(false);

  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const canAnimate = !prefersReducedMotion;

  // Locked before the cover is measured, so removing the scrollbar cannot shift the
  // rect out from under the measurement.
  useScrollLock(phase !== 'idle');

  useLayoutEffect(() => {
    if (phase === 'preloading' && !snapshot && coverRef.current) {
      setSnapshot(captureCover(coverRef.current));
    }
  }, [phase, snapshot]);

  // Warm the chunk on hover so the click usually finds it already resolved. The
  // import promise is cached, so repeated hovers cost nothing.
  const warm = useCallback(() => {
    if (canAnimate) void import('../book3d/BookExperience');
  }, [canAnimate]);

  const launch = useCallback(() => {
    if (!canAnimate || phase !== 'idle' || !supportsWebGL()) return;
    setPhase('preloading');
  }, [canAnimate, phase]);

  const close = useCallback(() => {
    setPhase('idle');
    setSnapshot(null);
    setRewinding(false);
  }, []);

  return (
    <section id="book" className="py-14 md:py-28 bg-gradient-to-br from-cream/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-primary-dark">
            {bookContent.sectionTitle}
          </h2>
          <p className="hidden sm:block mt-2 sm:mt-4 text-sm sm:text-lg text-gray-600">
            {bookContent.sectionSubtitle}
          </p>
        </div>

        {/* Book Card */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-16 max-w-5xl mx-auto">
          {/* Book Cover */}
          <div className="flex-shrink-0 flex justify-center">
            <button
              type="button"
              disabled={!canAnimate}
              onClick={launch}
              onPointerEnter={warm}
              aria-label={canAnimate ? `View ${bookContent.title} in 3D` : undefined}
              // touch-manipulation suppresses the ~300ms tap delay and double-tap zoom,
              // so the sequence starts the instant a finger lands.
              className="relative rounded-xl touch-manipulation enabled:cursor-pointer disabled:cursor-default"
            >
              <div className="absolute inset-0 bg-primary/10 rounded-xl blur-2xl scale-105" />
              <img
                ref={coverRef}
                src={bookContent.coverImage}
                alt={bookContent.coverAlt}
                // Kept in flow at zero opacity rather than removed: unmounting it would
                // reflow the section and move the target the book returns to.
                style={{ opacity: phase === 'running' ? 0 : 1 }}
                className="relative w-52 sm:w-64 md:w-72 rounded-xl shadow-2xl -rotate-2 hover:rotate-0 transition-transform duration-500"
              />
            </button>
          </div>

          {/* Book Details */}
          <div className="flex-1 text-center lg:text-left">
            {/* Title */}
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-primary-dark leading-tight">
              {bookContent.title}
            </h3>

            {/* Description */}
            <p className="mt-4 text-gray-600 leading-relaxed text-sm sm:text-base max-w-xl mx-auto lg:mx-0">
              {bookContent.description}
            </p>

            {/* Primary CTAs */}
            <div className="mt-7 flex flex-row justify-center lg:justify-start gap-3">
              <a
                href={publisherLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-primary hover:bg-primary-light text-white text-sm font-semibold rounded-full transition-all duration-200 shadow-md hover:shadow-lg text-center"
              >
                Order Paperback
              </a>
              <a
                href={googlePlayLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white text-sm font-semibold rounded-full transition-all duration-200 text-center"
              >
                Get E-Book
              </a>
            </div>

            {/* Platform Badges */}
            <div className="mt-6">
              <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider text-center lg:text-left">
                Also available on
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                {bookContent.buyLinks.map((item) => (
                  <a
                    key={item.platform}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-white border border-primary/20 hover:border-primary/50 text-primary-dark text-xs font-medium rounded-lg transition-all duration-200 hover:shadow-sm"
                  >
                    {item.platform}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {snapshot && (
        <BookErrorBoundary onError={close}>
          <Suspense fallback={null}>
            <BookExperience
              snapshot={snapshot}
              coverImage={bookContent.coverImage}
              running={phase === 'running'}
              rewinding={rewinding}
              onReady={() => setPhase('running')}
              onFinished={close}
              onDismiss={() => setRewinding(true)}
            />
          </Suspense>
        </BookErrorBoundary>
      )}
    </section>
  );
}
