import { Phone, Mail, MapPin, Instagram, Clock } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

export default function Contact() {
  const { contactContent, contactInfo } = useContent();
  
  const whatsappUrl = `https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(
    contactInfo.whatsappMessage
  )}`;

  return (
    <section id="contact" className="py-20 md:py-28 bg-gradient-to-br from-cream/50 to-primary-light/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-primary-dark">
            {contactContent.sectionTitle}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {contactContent.sectionSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Info */}
          <div className="space-y-8 order-2 lg:order-1">
            <p className="text-gray-600 text-lg leading-relaxed">
              {contactContent.message}
            </p>

            {/* Contact Details */}
            <div className="space-y-5">
              <a
                href={`tel:${contactInfo.phone}`}
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Phone size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone / WhatsApp</p>
                  <p className="text-primary-dark font-medium">{contactInfo.phone}</p>
                </div>
              </a>

              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Mail size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-primary-dark font-medium">{contactInfo.email}</p>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-xl text-primary">
                  <MapPin size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-primary-dark font-medium">{contactInfo.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-xl text-primary">
                  <Clock size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Availability</p>
                  <p className="text-primary-dark font-medium">
                    {contactContent.availability.days}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {contactContent.availability.hours}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            {contactInfo.instagram && (
              <a
                href={contactInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white rounded-xl group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                  <Instagram size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Instagram</p>
                  <p className="text-primary-dark font-medium">@thinkfit.india</p>
                </div>
              </a>
            )}
          </div>

          {/* CTA Card */}
          <div className="relative order-1 lg:order-2">
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {contactContent.ctaText}
                </a>

                <p className="mt-6 text-white/50 text-sm">
                  {contactContent.availability.note}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
