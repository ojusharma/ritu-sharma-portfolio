import { MessageCircle } from 'lucide-react';
import { CONTACT_INFO, SITE_CONFIG } from '../constants';

export default function WhatsAppButton() {
  if (!SITE_CONFIG.features.showWhatsAppButton) return null;

  const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(
    CONTACT_INFO.whatsappMessage
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3 md:px-5 md:py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={24} className="fill-current" />
      <span className="hidden sm:inline font-medium">Chat with me</span>
    </a>
  );
}
