import { GraduationCap, Award, BookOpen, BadgeCheck } from 'lucide-react';
import { CERTIFICATIONS_CONTENT } from '../../constants';

const iconMap = {
  graduation: GraduationCap,
  award: Award,
  certificate: BadgeCheck,
  book: BookOpen,
};

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
            const IconComponent = iconMap[cert.icon as keyof typeof iconMap] || Award;
            
            return (
              <div
                key={cert.id}
                className="group relative bg-gradient-to-br from-cream/30 to-white p-6 sm:p-8 rounded-2xl border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <IconComponent size={28} />
                </div>

                {/* Content */}
                <h3 className="mt-5 text-xl font-bold text-primary-dark">
                  {cert.title}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                  <span>{cert.institution}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span>{cert.year}</span>
                </div>
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
