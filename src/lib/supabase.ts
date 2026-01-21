import { createClient } from '@supabase/supabase-js';

// These will be set via environment variables
// Create a .env file with:
// VITE_SUPABASE_URL=your-project-url
// VITE_SUPABASE_ANON_KEY=your-anon-key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Content keys that map to database rows
// Note: site_config is managed via constants file only, not stored in database
export type ContentKey = 
  | 'contact_info'
  | 'hero'
  | 'certifications'
  | 'fees'
  | 'testimonials'
  | 'faq'
  | 'contact';

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};
