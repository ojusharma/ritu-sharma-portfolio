import { Heart, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { SITE_CONFIG, CONTACT_INFO } from '../constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-primary-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-semibold">
              {SITE_CONFIG.name}
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Certified Nutritionist helping you build a healthier relationship
              with food. Choose Strong over Skinny!
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {SITE_CONFIG.navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-white/70 hover:text-white transition-colors text-sm text-left w-fit"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contact</h4>
            <div className="flex flex-col gap-3">
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="flex items-center gap-3 text-white/70 hover:text-white transition-colors text-sm"
              >
                <Phone size={16} />
                {CONTACT_INFO.phone}
              </a>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center gap-3 text-white/70 hover:text-white transition-colors text-sm"
              >
                <Mail size={16} />
                {CONTACT_INFO.email}
              </a>
              <div className="flex items-center gap-3 text-white/70 text-sm">
                <MapPin size={16} />
                {CONTACT_INFO.city}
              </div>
              {CONTACT_INFO.instagram && (
                <a
                  href={CONTACT_INFO.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors text-sm"
                >
                  <Instagram size={16} />
                  Follow on Instagram
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm text-center md:text-left">
            © {currentYear} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-white/50 text-sm">
            Made with <Heart size={14} className="text-red-400 fill-current" /> in {CONTACT_INFO.city}
          </p>
        </div>
      </div>
    </footer>
  );
}
