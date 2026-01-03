import { CERTIFICATIONS_CONTENT } from '../../constants';

export default function Certifications() {
  return (
    <section id="certifications" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-primary-dark">
            {CERTIFICATIONS_CONTENT.sectionTitle}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {CERTIFICATIONS_CONTENT.sectionSubtitle}
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {CERTIFICATIONS_CONTENT.certifications.map((cert) => {
            return (
              <div
                key={cert.id}
                className="group relative bg-gradient-to-br from-cream/30 to-white p-6 sm:p-8 rounded-2xl border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
              >
                {/* Content */}
                <h3 className="text-xl font-bold text-primary-dark">
                  {cert.title}
                </h3>
                <p className="mt-2 text-base font-semibold text-primary">
                  {cert.institution}
                </p>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  {cert.description}
                </p>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 transform rotate-45 translate-x-12 -translate-y-12" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
