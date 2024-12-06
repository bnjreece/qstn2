import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { supabase } from "../utils/supabase.server";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

function logAuthEvent(message: string, data?: any) {
  console.log('\n=== Auth Server Event ===');
  console.log('Time:', new Date().toISOString());
  console.log('Message:', message);
  console.log('Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
    PORT: process.env.PORT
  });
  if (data) {
    console.log('Data:', JSON.stringify(data, null, 2));
  }
  console.log('=================\n');
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
  const vercelUrl = process.env.VERCEL_URL;
  const nodeEnv = process.env.NODE_ENV;
  const productionUrl = 'qstn2.vercel.app'; // Your main production URL
  
  // Log all relevant environment variables
  console.log('\n=== URL Configuration ===');
  console.log({
    VERCEL_URL: vercelUrl,
    NODE_ENV: nodeEnv,
    IS_PRODUCTION: nodeEnv === 'production',
    USING_PRODUCTION_URL: !vercelUrl && nodeEnv === 'production'
  });
  console.log('=================\n');

  // In production, use VERCEL_URL or fallback to production URL
  if (nodeEnv === 'production') {
    // Ensure we're using the full URL with https protocol
    const domain = vercelUrl || productionUrl;
    // If the URL already includes the protocol, use it as is
    if (domain.startsWith('http')) {
      return domain;
    }
    return `https://${domain}`;
  }

  // Fallback to localhost for development
  const port = process.env.PORT || 3000;
  return `http://localhost:${port}`;
}

export async function createUserSession(userId: string, redirectTo: string) {
  logAuthEvent('Creating user session', { userId, redirectTo });
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export async function getUserSession(request: Request) {
  logAuthEvent('Getting user session from request');
  const session = await storage.getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  logAuthEvent('User session result', { hasUserId: !!userId });
  return { userId };
}

export async function requireUserId(request: Request, redirectTo: string = "/auth/login") {
  logAuthEvent('Requiring user ID', { redirectTo });
  const session = await getUserSession(request);
  if (!session.userId) {
    logAuthEvent('No user ID found, redirecting to login');
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/auth/login?${searchParams}`);
  }
  logAuthEvent('User ID found', { userId: session.userId });
  return session.userId;
}

export async function logout(request: Request) {
  logAuthEvent('Logging out user');
  const session = await storage.getSession(request.headers.get("Cookie"));
  await supabase.auth.signOut();
  logAuthEvent('User logged out');
  return redirect("/auth/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

export async function sendMagicLink(email: string) {
  logAuthEvent('Sending magic link', { email });
  
  // Use environment variables for the redirect URL
  const productionUrl = process.env.VERCEL_URL || 'qstn.co';
  // Ensure the URL has the protocol and callback path
  const redirectTo = productionUrl.startsWith('http') 
    ? `${productionUrl}/auth/callback`
    : `https://${productionUrl}/auth/callback`;
  
  // Log URL configuration for debugging
  console.log('\n=== Magic Link Configuration ===');
  console.log({
    VERCEL_URL: process.env.VERCEL_URL,
    NODE_ENV: process.env.NODE_ENV,
    productionUrl,
    redirectTo
  });
  console.log('=================\n');
  
  logAuthEvent('Configured redirect URL', { redirectTo });
  
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: true,
        data: {
          redirectUrl: redirectTo,
          flow: "magiclink"
        }
      }
    });
    
    if (error) {
      logAuthEvent('Magic link error', { error });
      throw error;
    }
    
    logAuthEvent('Magic link sent successfully', { data });
    return true;
  } catch (error) {
    logAuthEvent('Error sending magic link', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
} 