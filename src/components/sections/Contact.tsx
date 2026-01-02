import { Phone, Mail, MapPin, Instagram, Clock, Send } from 'lucide-react';
import { CONTACT_CONTENT, CONTACT_INFO } from '../../constants';

export default function Contact() {
  const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(
    CONTACT_INFO.whatsappMessage
  )}`;

  return (
    <section id="contact" className="py-20 md:py-28 bg-gradient-to-br from-cream/50 to-primary-light/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-primary-dark">
            {CONTACT_CONTENT.sectionTitle}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {CONTACT_CONTENT.sectionSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <p className="text-gray-600 text-lg leading-relaxed">
              {CONTACT_CONTENT.message}
            </p>

            {/* Contact Details */}
            <div className="space-y-5">
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Phone size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone / WhatsApp</p>
                  <p className="text-primary-dark font-medium">{CONTACT_INFO.phone}</p>
                </div>
              </a>

              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Mail size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-primary-dark font-medium">{CONTACT_INFO.email}</p>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-xl text-primary">
                  <MapPin size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-primary-dark font-medium">{CONTACT_INFO.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-xl text-primary">
                  <Clock size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Availability</p>
                  <p className="text-primary-dark font-medium">
                    {CONTACT_CONTENT.availability.days}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {CONTACT_CONTENT.availability.hours}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 pt-4">
              {CONTACT_INFO.instagram && (
                <a
                  href={CONTACT_INFO.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram size={22} />
                </a>
              )}
            </div>
          </div>

          {/* CTA Card */}
          <div className="relative">
            <div className="bg-primary-dark rounded-3xl p-8 sm:p-10 text-center lg:text-left">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
              
              <div className="relative">
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
                  Ready to Start Your Health Journey?
                </h3>
                <p className="text-white/70 mb-8 leading-relaxed">
                  Book your consultation today and take the first step towards a healthier, 
                  stronger you. No crash diets, just sustainable nutrition.
                </p>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#25D366]/30"
                >
                  <Send size={20} />
                  {CONTACT_CONTENT.ctaText}
                </a>

                <p className="mt-6 text-white/50 text-sm">
                  {CONTACT_CONTENT.availability.note}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
