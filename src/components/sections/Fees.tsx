import { Check, Star } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

export default function Fees() {
  const { feesContent } = useContent();

  return (
    <section id="fees" className="py-20 md:py-28 bg-gradient-to-b from-primary-dark to-[#252d24]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            {feesContent.sectionTitle}
          </h2>
          <p className="mt-4 text-lg text-white/70">
            {feesContent.sectionSubtitle}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-3xl mx-auto">
          {feesContent.services.map((service) => (
            <div
              key={service.id}
              className={`relative flex flex-col p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 ${
                service.popular
                  ? 'bg-primary text-white ring-2 ring-accent shadow-xl shadow-primary/30'
                  : 'bg-white text-primary-dark'
              }`}
            >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 bg-accent text-primary-dark text-xs font-bold rounded-full">
                  <Star size={12} className="fill-current" />
                  RECOMMENDED
                </div>
              )}

              {/* Service Name */}
              <h3 className="text-lg font-bold">{service.name}</h3>
              
              {/* Duration */}
              <p className={`text-sm mt-1 ${service.popular ? 'text-white/70' : 'text-gray-500'}`}>
                {service.duration}
              </p>

              {/* Price */}
              <div className="mt-4 mb-4">
                <span className={`text-sm ${service.popular ? 'text-white/70' : 'text-gray-500'}`}>
                  {feesContent.currency}
                </span>
                <span className="text-3xl sm:text-4xl font-bold ml-1">{service.price}</span>
              </div>

              {/* Description */}
              <p className={`text-sm mb-6 ${service.popular ? 'text-white/80' : 'text-gray-600'}`}>
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 flex-grow">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    <Check
                      size={18}
                      className={`flex-shrink-0 mt-0.5 ${
                        service.popular ? 'text-accent' : 'text-primary'
                      }`}
                    />
                    <span className={service.popular ? 'text-white/90' : 'text-gray-700'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Note */}
        {feesContent.note && (
          <p className="text-center text-white/50 text-sm mt-10">
            {feesContent.note}
          </p>
        )}
      </div>
    </section>
  );
}
