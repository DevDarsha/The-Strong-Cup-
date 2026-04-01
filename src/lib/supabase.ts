import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log warning if Supabase not configured, but allow app to continue
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[v0] Supabase environment variables not configured. The app will work without database features until you set them up. See .env.example for setup instructions.');
}

/**
 * Supabase client instance for frontend use
 * Uses the anonymous key for client-side operations with Row Level Security (RLS)
 * 
 * If environment variables are not set, this creates a dummy client that won't
 * function but allows the app to render and show instructions
 */
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInBrowser: true,
      },
    })
  : createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInBrowser: false,
      },
    });

export type SupabaseClient = typeof supabase;

/**
 * Check if Supabase is configured
 */
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey);
};
