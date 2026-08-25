import { useEffect, useRef, useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

interface TestimonialData {
  id: number;
  name: string;
  role: string;
  outcome: string;
  rating: number;
  text: string;
}

export default function Testimonials() {
  const { siteConfig, testimonialsContent } = useContent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);

  // Don't render if testimonials are disabled
  if (!siteConfig.features.showTestimonials) return null;

  const testimonials = testimonialsContent.testimonials;

  const goTo = (index: number, behavior: ScrollBehavior = 'smooth') => {
    const wrapped = (index + testimonials.length) % testimonials.length;
    setCurrentIndex(wrapped);

    const track = trackRef.current;
    const card = track?.children[wrapped] as HTMLElement | undefined;
    if (track && card) {
      isProgrammaticScroll.current = true;
      track.scrollTo({ left: card.offsetLeft, behavior });
      window.setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 500);
    }
  };

  // Step to the next/previous testimonial, skipping indices whose scroll
  // target is clamped to the same position as the current one (happens near
  // the ends of the track once there's no more room left to scroll), so a
  // single click always moves to a visibly different card.
  const step = (direction: 1 | -1) => {
    const track = trackRef.current;
    const count = testimonials.length;
    if (!track || count === 0) {
      goTo(currentIndex + direction);
      return;
    }

    if (direction === 1 && currentIndex === count - 1) {
      goTo(0);
      return;
    }
    if (direction === -1 && currentIndex === 0) {
      goTo(count - 1);
      return;
    }

    const maxScrollLeft = Math.max(0, track.scrollWidth - track.clientWidth);
    const targetFor = (i: number) => {
      const card = track.children[i] as HTMLElement | undefined;
      return card ? Math.min(card.offsetLeft, maxScrollLeft) : 0;
    };
    const currentTarget = targetFor(currentIndex);

    let next = currentIndex;
    for (
      let i = currentIndex + direction;
      direction === 1 ? i <= count - 1 : i >= 0;
      i += direction
    ) {
      next = i;
      if (Math.abs(targetFor(i) - currentTarget) > 2) break;
    }

    goTo(next);
  };

  // Sync currentIndex when the user swipes/scrolls the track directly
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;
        const visible = entries.find((entry) => entry.isIntersecting);
        if (!visible) return;
        const index = Array.from(track.children).indexOf(visible.target);
        if (index !== -1) setCurrentIndex(index);
      },
      { root: track, threshold: 0.6 }
    );

    Array.from(track.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [testimonials.length]);

  return (
    <section id="testimonials" className="py-14 md:py-28 bg-cream/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-primary-dark">
            {testimonialsContent.sectionTitle}
          </h2>
          <p className="hidden sm:block mt-2 sm:mt-4 text-sm sm:text-lg text-gray-600">
            {testimonialsContent.sectionSubtitle}
          </p>
        </div>

        {/* Peek carousel: same pattern on mobile and desktop, card size scales up */}
        <div
          ref={trackRef}
          className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-8 px-8 md:scroll-px-[10%] md:px-[10%] -mx-4 sm:-mx-6 lg:-mx-8 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="snap-center shrink-0 w-[82%] sm:w-[60%] md:w-[44%] lg:w-[36%]"
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>

        {/* Progress + controls */}
        <div className="flex items-center justify-center gap-4 mt-6 md:mt-10">
          <button
            onClick={() => step(-1)}
            className="p-2 md:p-2.5 rounded-full bg-primary/10 hover:bg-primary hover:text-white text-primary transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-1.5">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentIndex ? 'bg-primary w-6' : 'bg-primary/25 w-1.5'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => step(1)}
            className="p-2 md:p-2.5 rounded-full bg-primary/10 hover:bg-primary hover:text-white text-primary transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: TestimonialData }) {
  return (
    <div className="relative h-full bg-white rounded-2xl border border-primary/10 shadow-sm p-7 sm:p-8 md:p-9">
      {/* Oversized typographic quote mark */}
      <span
        aria-hidden="true"
        className="relative block font-display leading-none text-primary/15 select-none text-4xl md:text-6xl -mb-1 md:-mb-2"
      >
        &ldquo;
      </span>

      <div className="relative flex flex-wrap items-center gap-2 mb-3">
        <span className="inline-flex items-center rounded-full bg-accent/40 text-primary-dark font-semibold text-xs md:text-sm px-2.5 py-1 md:px-3.5 md:py-1.5">
          {testimonial.outcome}
        </span>
      </div>

      <p className="relative text-gray-700 leading-relaxed text-sm md:text-base line-clamp-6 md:line-clamp-[8]">
        {testimonial.text}
      </p>

      <div className="relative flex items-center justify-between mt-4 md:mt-6">
        <div>
          <p className="font-display font-semibold text-primary-dark text-sm md:text-base">
            {testimonial.name}
          </p>
          <p className="text-xs text-gray-500 tracking-wide">{testimonial.role}</p>
        </div>
        <div className="flex gap-0.5" aria-label={`${testimonial.rating} out of 5 stars`}>
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} size={12} className="text-accent fill-current" />
          ))}
        </div>
      </div>
    </div>
  );
}
