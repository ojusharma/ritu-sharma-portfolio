import { createContext, useContext, ReactNode } from 'react';
import {
  SITE_CONFIG,
  CONTACT_INFO,
  HERO_CONTENT,
  CERTIFICATIONS_CONTENT,
  FAQ_CONTENT,
  CONTACT_CONTENT,
  TESTIMONIALS_CONTENT,
  BOOK_CONTENT,
  INSTAGRAM_CONTENT,
} from '../constants';

// Type definitions based on your constants
export interface SiteConfig {
  name: string;
  title: string;
  logo: string | null;
  navigation: { id: string; label: string }[];
  features: {
    showTestimonials: boolean;
    showWhatsAppButton: boolean;
  };
}

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  address: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  whatsappMessage: string;
}

export interface HeroContent {
  headline: string;
  tagline: string;
  description: string;
  primaryCTA: { text: string; link: string };
  image: string;
  imageAlt: string;
  highlights: { value: string; label: string }[];
}

export interface Certification {
  id: number;
  title: string;
  institution: string;
  description: string;
  icon: string;
}

export interface CertificationsContent {
  sectionTitle: string;
  sectionSubtitle: string;
  certifications: Certification[];
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export interface FAQContent {
  sectionTitle: string;
  sectionSubtitle: string;
  faqs: FAQ[];
}

export interface ContactContent {
  sectionTitle: string;
  sectionSubtitle: string;
  message: string;
  ctaText: string;
  availability: {
    days: string;
    hours: string;
    note: string;
  };
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  rating: number;
  text: string;
}

export interface TestimonialsContent {
  sectionTitle: string;
  sectionSubtitle: string;
  testimonials: Testimonial[];
}

export interface BookBuyLink {
  platform: string;
  link: string;
}

export interface BookContent {
  sectionTitle: string;
  sectionSubtitle: string;
  title: string;
  description: string;
  publisher: string;
  isbn: string;
  pages: number;
  language: string;
  category: string;
  coverImage: string;
  coverAlt: string;
  paperbackPrice: string;
  ebookPrice: string;
  buyLinks: BookBuyLink[];
}

export interface InstagramContent {
  sectionTitle: string;
  sectionSubtitle: string;
  handle: string;
  profileLink: string;
  embedUrl: string;
}

export interface ContentState {
  siteConfig: SiteConfig;
  contactInfo: ContactInfo;
  heroContent: HeroContent;
  certificationsContent: CertificationsContent;
  faqContent: FAQContent;
  contactContent: ContactContent;
  testimonialsContent: TestimonialsContent;
  bookContent: BookContent;
  instagramContent: InstagramContent;
}

const content: ContentState = {
  siteConfig: SITE_CONFIG,
  contactInfo: CONTACT_INFO,
  heroContent: HERO_CONTENT,
  certificationsContent: CERTIFICATIONS_CONTENT,
  faqContent: FAQ_CONTENT,
  contactContent: CONTACT_CONTENT,
  testimonialsContent: TESTIMONIALS_CONTENT,
  bookContent: BOOK_CONTENT,
  instagramContent: INSTAGRAM_CONTENT,
};

const ContentContext = createContext<ContentState>(content);

export function ContentProvider({ children }: { children: ReactNode }) {
  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
