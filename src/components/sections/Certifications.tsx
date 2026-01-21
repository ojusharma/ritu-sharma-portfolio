import { useState } from 'react';
import { useContent } from '../../context/ContentContext';

export default function Certifications() {
  const { certificationsContent } = useContent();
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <section id="certifications" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-primary-dark">
            {certificationsContent.sectionTitle}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {certificationsContent.sectionSubtitle}
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {certificationsContent.certifications.map((cert) => {
            const isExpanded = expandedIds.includes(cert.id);
            return (
              <div
                key={cert.id}
                className="group relative bg-gradient-to-br from-cream/30 to-white p-6 sm:p-8 rounded-2xl border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
              >
                {/* Mobile: Collapsible header */}
                <div
                  className="md:hidden cursor-pointer flex items-start justify-between gap-3"
                  onClick={() => toggleExpand(cert.id)}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-primary-dark">
                      {cert.title}
                    </h3>
                    <p className="mt-2 text-sm font-medium text-primary">
                      {cert.institution}
                    </p>
                  </div>
                  <svg
                    className={`w-5 h-5 text-primary-dark flex-shrink-0 mt-1 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {/* Mobile: Expandable description */}
                <div
                  className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-gray-600 leading-relaxed">
                    {cert.description}
                  </p>
                </div>

                {/* Desktop: Always visible content */}
                <div className="hidden md:block">
                  <h3 className="text-xl font-semibold text-primary-dark">
                    {cert.title}
                  </h3>
                  <p className="mt-2 text-base font-medium text-primary">
                    {cert.institution}
                  </p>
                  <p className="mt-3 text-gray-600 leading-relaxed">
                    {cert.description}
                  </p>
                </div>

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
