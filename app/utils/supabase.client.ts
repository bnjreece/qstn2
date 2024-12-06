import { createClient } from '@supabase/supabase-js';

let supabase: ReturnType<typeof createClient>;

function getSupabaseClient() {
  if (supabase) return supabase;

  if (!window.env?.SUPABASE_URL || !window.env?.SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase environment variables');
  }

  supabase = createClient(window.env.SUPABASE_URL, window.env.SUPABASE_ANON_KEY);
  return supabase;
}

export { getSupabaseClient as supabase }; 