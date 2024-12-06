import { createClient } from '@supabase/supabase-js';

declare global {
  interface Window {
    env: {
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
    };
  }
}

let supabaseClient: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (typeof window === "undefined") {
    throw new Error("getSupabaseClient should only be called in the browser");
  }

  if (!window.env?.SUPABASE_URL || !window.env?.SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables in window.env:', {
      hasUrl: !!window.env?.SUPABASE_URL,
      hasKey: !!window.env?.SUPABASE_ANON_KEY,
      windowEnv: window.env
    });
    throw new Error('Missing required Supabase configuration');
  }

  if (!supabaseClient) {
    try {
      supabaseClient = createClient(window.env.SUPABASE_URL, window.env.SUPABASE_ANON_KEY, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          flowType: "pkce"
        }
      });
      console.log('Supabase client initialized successfully');
    } catch (error) {
      console.error('Error creating Supabase client:', error);
      throw error;
    }
  }

  return supabaseClient;
}

// Create the client lazily only when in the browser
export const getSupabase = () => {
  if (typeof window === "undefined") {
    throw new Error("getSupabase should only be called in the browser");
  }

  try {
    return getSupabaseClient();
  } catch (error) {
    console.error('Error getting Supabase client:', error);
    throw error;
  }
}; 