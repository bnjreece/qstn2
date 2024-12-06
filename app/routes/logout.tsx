import type { DataFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logout } from "../utils/auth.server";
import { supabase } from "../utils/supabase.server";

export async function action({ request }: DataFunctionArgs) {
  try {
    // Sign out from Supabase server-side
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out from Supabase:", error);
    }

    // Clear server-side session
    return logout(request);
  } catch (error) {
    console.error("Error during logout:", error);
    return redirect("/login");
  }
}

// Handle GET requests by redirecting to POST
export async function loader() {
  return redirect("/login");
} 