import { useContent } from '../../context/ContentContext';

export default function Book() {
  const { bookContent } = useContent();

  const publisherLink = bookContent.buyLinks.find(
    (l) => l.platform === 'Amazon'
  )?.link ?? bookContent.buyLinks[0].link;

  const googlePlayLink = bookContent.buyLinks.find(
    (l) => l.platform === 'Google Play'
  )?.link ?? bookContent.buyLinks[0].link;

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
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-xl blur-2xl scale-105" />
              <img
                src={bookContent.coverImage}
                alt={bookContent.coverAlt}
                className="relative w-52 sm:w-64 md:w-72 rounded-xl shadow-2xl -rotate-2 hover:rotate-0 transition-transform duration-500"
              />
            </div>
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
    </section>
  );
}
