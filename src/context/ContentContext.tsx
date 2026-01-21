import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  SITE_CONFIG,
  CONTACT_INFO,
  HERO_CONTENT,
  CERTIFICATIONS_CONTENT,
  FEES_CONTENT,
  FAQ_CONTENT,
  CONTACT_CONTENT,
  TESTIMONIALS_CONTENT,
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
  secondaryCTA: { text: string; link: string };
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

export interface Service {
  id: number;
  name: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  popular: boolean;
}

export interface FeesContent {
  sectionTitle: string;
  sectionSubtitle: string;
  currency: string;
  services: Service[];
  note: string;
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

export interface ContentState {
  siteConfig: SiteConfig;
  contactInfo: ContactInfo;
  heroContent: HeroContent;
  certificationsContent: CertificationsContent;
  feesContent: FeesContent;
  faqContent: FAQContent;
  contactContent: ContactContent;
  testimonialsContent: TestimonialsContent;
  isLoading: boolean;
  error: string | null;
}

interface ContentContextValue extends ContentState {
  refreshContent: () => Promise<void>;
  updateContent: (key: string, data: unknown) => Promise<boolean>;
}

const defaultContent: ContentState = {
  siteConfig: SITE_CONFIG,
  contactInfo: CONTACT_INFO,
  heroContent: HERO_CONTENT,
  certificationsContent: CERTIFICATIONS_CONTENT,
  feesContent: FEES_CONTENT,
  faqContent: FAQ_CONTENT,
  contactContent: CONTACT_CONTENT,
  testimonialsContent: TESTIMONIALS_CONTENT,
  isLoading: true,
  error: null,
};

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentState>(defaultContent);

  const fetchContent = async () => {
    // If Supabase isn't configured, use defaults
    if (!isSupabaseConfigured()) {
      setContent((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('key, content');

      if (error) throw error;

      if (data && data.length > 0) {
        const contentMap: Record<string, unknown> = {};
        data.forEach((row) => {
          contentMap[row.key] = row.content;
        });

        setContent({
          siteConfig: SITE_CONFIG, // Always from constants file
          contactInfo: (contentMap['contact_info'] as ContactInfo) || CONTACT_INFO,
          heroContent: (contentMap['hero'] as HeroContent) || HERO_CONTENT,
          certificationsContent: (contentMap['certifications'] as CertificationsContent) || CERTIFICATIONS_CONTENT,
          feesContent: (contentMap['fees'] as FeesContent) || FEES_CONTENT,
          faqContent: (contentMap['faq'] as FAQContent) || FAQ_CONTENT,
          contactContent: (contentMap['contact'] as ContactContent) || CONTACT_CONTENT,
          testimonialsContent: (contentMap['testimonials'] as TestimonialsContent) || TESTIMONIALS_CONTENT,
          isLoading: false,
          error: null,
        });
      } else {
        // No data in database, use defaults
        setContent((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (err) {
      console.error('Error fetching content:', err);
      setContent((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load content from database',
      }));
    }
  };

  const updateContent = async (key: string, data: unknown): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      console.error('Supabase not configured');
      return false;
    }

    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({ key, content: data, updated_at: new Date().toISOString() }, { onConflict: 'key' });

      if (error) throw error;

      // Refresh content after update
      await fetchContent();
      return true;
    } catch (err) {
      console.error('Error updating content:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <ContentContext.Provider
      value={{
        ...content,
        refreshContent: fetchContent,
        updateContent,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
