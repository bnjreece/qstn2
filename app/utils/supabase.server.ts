import { createClient } from '@supabase/supabase-js';

// Log environment variable presence (not their values)
console.log('Environment check:', {
  hasSupabaseUrl: !!process.env.SUPABASE_URL,
  hasSupabaseAnonKey: !!process.env.SUPABASE_ANON_KEY,
  supabaseUrlLength: process.env.SUPABASE_URL?.length,
  nodeEnv: process.env.NODE_ENV
});

if (!process.env.SUPABASE_URL) throw new Error('Missing SUPABASE_URL');
if (!process.env.SUPABASE_ANON_KEY) throw new Error('Missing SUPABASE_ANON_KEY');

let supabaseClient;

try {
  supabaseClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    }
  );
} catch (error) {
  console.error('Error creating Supabase client:', error);
  throw error;
}

export const supabase = supabaseClient; 