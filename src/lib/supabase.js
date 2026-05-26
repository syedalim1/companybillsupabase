import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.warn('Warning: NEXT_PUBLIC_SUPABASE_URL is missing. Supabase client will not be initialized.');
}

// Client-safe instance for optional frontend use
export const supabaseClient = supabaseUrl 
  ? createClient(supabaseUrl, supabaseAnonKey || '') 
  : null;

// Admin/Server-safe instance for API routes (bypasses RLS)
export const supabase = supabaseUrl 
  ? createClient(
      supabaseUrl,
      supabaseServiceKey || supabaseAnonKey || '',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    )
  : null;
