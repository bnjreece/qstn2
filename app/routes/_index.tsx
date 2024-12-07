import { redirect } from "@remix-run/node";
import type { DataFunctionArgs } from "@remix-run/node";
import { getUserSession } from "../utils/auth.server";

export async function loader({ request }: DataFunctionArgs) {
  // In development, always redirect to dev login first
  if (process.env.NODE_ENV === 'development') {
    console.log('Root loader - Development mode, redirecting to /dev-login');
    return redirect("/dev-login");
  }

  // For production, check session and redirect accordingly
  const { userId } = await getUserSession(request);
  console.log('Root loader - User session:', { userId });
  
  if (userId) {
    console.log('Root loader - User authenticated, redirecting to /app');
    return redirect("/app");
  }
  
  console.log('Root loader - No user, redirecting to /auth/login');
  return redirect("/auth/login");
} 