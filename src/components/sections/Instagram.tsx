import { Instagram as InstagramIcon } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

export default function Instagram() {
  const { instagramContent } = useContent();

  return (
    <section id="instagram" className="py-14 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-primary-dark">
            {instagramContent.sectionTitle}
          </h2>
          <p className="hidden sm:block mt-2 sm:mt-4 text-sm sm:text-lg text-gray-600">
            {instagramContent.sectionSubtitle}
          </p>
        </div>

        {/* Same widget, sized differently per breakpoint so it reflows its own grid columns.
            snapwidget.js (loaded in index.html) finds .snapwidget-widget iframes and auto-resizes their height. */}
        {instagramContent.embedUrl && (
          <>
            {/* Desktop: wide container -> widget shows more columns */}
            <div className="hidden md:block relative max-w-5xl mx-auto mb-10">
              <iframe
                src={instagramContent.embedUrl}
                className="snapwidget-widget w-full"
                allowTransparency
                frameBorder="0"
                scrolling="no"
                style={{ border: 'none', overflow: 'hidden', width: '100%', pointerEvents: 'none' }}
                title="Posts from Instagram"
              />
              <a
                href={instagramContent.profileLink}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0"
                aria-label={`View ${instagramContent.handle} on Instagram`}
              />
            </div>

            {/* Mobile: narrow container -> widget shows fewer columns */}
            <div className="md:hidden relative max-w-md mx-auto mb-10">
              <iframe
                src={instagramContent.embedUrl}
                className="snapwidget-widget w-full"
                allowTransparency
                frameBorder="0"
                scrolling="no"
                style={{ border: 'none', overflow: 'hidden', width: '100%', pointerEvents: 'none' }}
                title="Posts from Instagram"
              />
              <a
                href={instagramContent.profileLink}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0"
                aria-label={`View ${instagramContent.handle} on Instagram`}
              />
            </div>
          </>
        )}

        {/* Follow CTA */}
        <div className="flex justify-center">
          <a
            href={instagramContent.profileLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-white text-sm font-semibold rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <InstagramIcon size={18} />
            Follow {instagramContent.handle} on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
