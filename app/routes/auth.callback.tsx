import type { DataFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { supabase } from "../utils/supabase.server";
import { createUserSession } from "../utils/auth.server";

export async function loader({ request }: DataFunctionArgs) {
  console.log("\n=== Auth Callback Start ===");
  console.log("Request URL:", request.url);
  console.log("Request headers:", Object.fromEntries(request.headers.entries()));
  
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const type = url.searchParams.get("type");
  const error = url.searchParams.get("error");
  const error_description = url.searchParams.get("error_description");
  const code = url.searchParams.get("code");
  
  console.log("URL Parameters:", {
    token,
    type,
    error,
    error_description,
    code,
    allParams: Object.fromEntries(url.searchParams.entries())
  });

  // If there's an error from Supabase, log it and redirect to login
  if (error || error_description) {
    console.error("Supabase auth error:", { error, error_description });
    return redirect("/login?error=auth_callback_error");
  }

  try {
    // Check for bearer token in Authorization header
    const authHeader = request.headers.get("Authorization");
    const refreshToken = request.headers.get("X-Refresh-Token");
    
    if (authHeader?.startsWith("Bearer ") && refreshToken) {
      const accessToken = authHeader.slice(7);
      console.log("Found bearer token and refresh token, attempting to get user");
      
      // First set the session in Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      
      if (sessionError) {
        console.error("Error setting Supabase session:", sessionError);
        return redirect("/login?error=auth_failed");
      }

      if (session?.user) {
        console.log("Successfully set Supabase session for user:", session.user.id);
        // Create server-side session and redirect to app directly
        return createUserSession(session.user.id, "/app");
      }
    }

    // First try to exchange the code if present
    if (code) {
      console.log("Attempting to exchange code for session");
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        console.error("Code exchange error:", exchangeError);
        return redirect("/login?error=auth_failed");
      }

      if (data?.user) {
        console.log("Successfully exchanged code for user:", data.user.id);
        return createUserSession(data.user.id, "/app");
      }
    }

    // Then try magic link verification if token present
    if (type === 'magiclink' && token) {
      console.log("Attempting to verify magic link token");
      const { data: { user }, error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'magiclink',
      });

      if (verifyError) {
        console.error("Magic link verification error:", verifyError);
        return redirect("/login?error=auth_failed");
      }

      if (user) {
        console.log("Successfully verified user:", user.id);
        return createUserSession(user.id, "/app");
      }
    }

    // Finally check for existing session
    console.log("Checking for existing session");
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session error:", sessionError);
      return redirect("/login?error=session_error");
    }

    if (session?.user) {
      console.log("Found existing session for user:", session.user.id);
      return createUserSession(session.user.id, "/app");
    } else {
      console.log("No existing session found");
    }
  } catch (error) {
    console.error("Auth callback error:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
  }

  console.log("=== Auth Callback End ===\n");
  return redirect("/login?error=auth_failed");
} 