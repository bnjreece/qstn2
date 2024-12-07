import { redirect, type DataFunctionArgs } from "@remix-run/node";
import { createUserSession } from "~/utils/auth.server";

// This route is for development only
export async function loader({ request }: DataFunctionArgs) {
  if (process.env.NODE_ENV !== 'development') {
    return redirect('/auth/login');
  }

  try {
    // Your user ID from Supabase (you can get this from the Supabase dashboard)
    const devUserId = '379d1265-0faf-450d-9421-d601474f19cb';

    // Create server-side session directly
    return createUserSession(devUserId, "/app");
  } catch (error) {
    console.error('Dev login error:', error);
    return redirect('/auth/login');
  }
} 