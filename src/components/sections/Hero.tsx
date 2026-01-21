import { ArrowRight, ChevronDown } from 'lucide-react';
import { HERO_CONTENT } from '../../constants';

export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center bg-primary-dark overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-light rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              {HERO_CONTENT.headline}
            </h1>
            
            {/* Tagline */}
            <p className="mt-4 text-xl sm:text-2xl md:text-3xl text-primary-light font-medium">
              {HERO_CONTENT.tagline}
            </p>
            
            {/* Description */}
            <p className="mt-6 text-white/70 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {HERO_CONTENT.description}
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
               <button
                onClick={() => scrollToSection(HERO_CONTENT.secondaryCTA.link)}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 hover:border-white/50 text-white rounded-full font-semibold transition-all duration-300 hover:bg-white/5"
              >
                {HERO_CONTENT.secondaryCTA.text}
              </button>
              <button
                onClick={() => scrollToSection(HERO_CONTENT.primaryCTA.link)}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary-light text-white rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
              >
                {HERO_CONTENT.primaryCTA.text}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
             
            </div>

            {/* Highlights/Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-8">
              {HERO_CONTENT.highlights.map((highlight, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-accent">
                    {highlight.value}
                  </div>
                  <div className="text-xs sm:text-sm text-white/60 mt-1">
                    {highlight.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px]">
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse" />
              <div className="absolute inset-4 rounded-full border-2 border-primary-light/20" />
              
              {/* Image container */}
              <div className="absolute inset-8 rounded-full overflow-hidden bg-primary/20">
                <img
                  src={HERO_CONTENT.image}
                  alt={HERO_CONTENT.imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Accent decoration */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent rounded-full opacity-80" />
              <div className="absolute -top-2 -left-2 w-16 h-16 bg-primary-light rounded-full opacity-60" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollToSection('certifications')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  );
}
