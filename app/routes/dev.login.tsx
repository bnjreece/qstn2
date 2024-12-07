import { redirect, type DataFunctionArgs } from "@remix-run/node";
import { supabase } from "~/utils/supabase.server";
import { createUserSession } from "~/utils/auth.server";

// This route is for development only
export async function loader({ request }: DataFunctionArgs) {
  if (process.env.NODE_ENV !== 'development') {
    return redirect('/auth/login');
  }

  try {
    // Sign in with a test email
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'dev@example.com',
      password: 'devpass123'
    });

    if (error) throw error;
    if (!data.session?.user) throw new Error('No user in session');

    // Create server-side session
    return createUserSession(data.session.user.id, "/app");
  } catch (error) {
    console.error('Dev login error:', error);
    return redirect('/auth/login');
  }
} 