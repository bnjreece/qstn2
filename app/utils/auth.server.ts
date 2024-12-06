import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { supabase } from "./supabase.server";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "qstn_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
  },
});

function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    // Using HTTPS on Vercel
    return `https://${process.env.VERCEL_URL}`;
  }
  // Fallback to localhost for development
  return process.env.PUBLIC_URL || 'http://localhost:3000';
}

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export async function getUserSession(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  return {
    userId: session.get("userId"),
  };
}

export async function requireUserId(request: Request, redirectTo: string = "/login") {
  const session = await getUserSession(request);
  if (!session.userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return session.userId;
}

export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

export async function sendMagicLink(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${getBaseUrl()}/auth/callback`,
      shouldCreateUser: true
    }
  });
  
  if (error) {
    throw error;
  }
  
  return true;
} 