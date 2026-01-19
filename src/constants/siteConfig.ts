/**
 * ==============================================
 * SITE CONFIGURATION
 * ==============================================
 * Edit this file to update site-wide settings
 */

export const SITE_CONFIG = {
  // Site name and branding
  name: "Ritu Sharma",
  title: "Nutritionist",
  logo: null, // Add logo URL here, e.g., "/logo.png" - null shows text logo

  // Navigation items (id must match section id in components)
  navigation: [
    { id: "hero", label: "Home" },
    { id: "certifications", label: "Certifications" },
    { id: "fees", label: "Fees" },
    { id: "faq", label: "FAQ" },
  ],

  // Feature flags
  features: {
    showTestimonials: false, // Set to true to show testimonials section
    showWhatsAppButton: true,
  },
};

export const CONTACT_INFO = {
  phone: "+91 99872 05388",
  whatsapp: "919987205388",
  email: "ritugov49@gmail.com",
  city: "Mumbai",
  address: "Mumbai, Maharashtra, India", // Full address placeholder
  instagram: "https://instagram.com/thinkfit.india",
  facebook: "", // Add Facebook URL if needed
  linkedin: "", // Add LinkedIn URL if needed
  
  // WhatsApp pre-filled message
  whatsappMessage: "Hi Ritu! I'd like to know more about your nutrition consultation services.",
};

export const COLORS = {
  primary: {
    dark: "#1B211A",
    default: "#628141",
    light: "#8BAE66",
  },
  accent: "#EBD5AB",
};
