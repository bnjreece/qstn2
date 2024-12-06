import type { DataFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { supabase } from "../utils/supabase.server";
import { getSupabase } from "../utils/supabase.client";
import { createUserSession } from "../utils/auth.server";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useLocation, useNavigate, useLoaderData } from "@remix-run/react";

// Helper to check if we're in the browser
const isBrowser = typeof window !== "undefined";

function logError(error: unknown, context: string) {
  console.error(`=== Auth Error: ${context} ===`);
  console.error('Time:', new Date().toISOString());
  if (error instanceof Error) {
    console.error('Name:', error.name);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
  } else {
    console.error('Raw error:', error);
  }
  console.error('=================');
}

function logDebug(message: string, data?: any) {
  console.log(`=== Auth Debug: ${message} ===`);
  console.log('Time:', new Date().toISOString());
  if (data) {
    console.log('Data:', data);
  }
  console.log('=================');
}

export async function loader({ request }: DataFunctionArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const code = url.searchParams.get("code");
  const type = url.searchParams.get("type");
  const error = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");

  logDebug('Callback route accessed', {
    url: request.url,
    token: !!token,
    code: !!code,
    type,
    error,
    errorDescription,
    headers: Object.fromEntries(request.headers.entries())
  });

  if (error) {
    logError(new Error(errorDescription || error), 'Auth callback error parameter');
    return redirect(`/auth/login?error=${error}&description=${errorDescription}`);
  }

  // Check for existing session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    logError(sessionError, 'Session check error');
    return redirect("/auth/login?error=auth_failed&reason=session_error");
  }

  if (session?.user) {
    logDebug('Found existing session', {
      userId: session.user.id,
      email: session.user.email,
      sessionData: session
    });
    return createUserSession(session.user.id, "/app");
  }

  // Try to exchange code for session if present
  if (code) {
    try {
      logDebug('Attempting to exchange code for session in loader');
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) {
        logError(exchangeError, 'Code exchange error in loader');
        return redirect("/auth/login?error=auth_failed&reason=code_exchange_error");
      }
      if (data.session) {
        logDebug('Successfully exchanged code for session in loader', {
          userId: data.session.user.id,
          email: data.session.user.email
        });
        return createUserSession(data.session.user.id, "/app");
      }
    } catch (error) {
      logError(error, 'Unexpected error during code exchange in loader');
      return redirect("/auth/login?error=auth_failed&reason=unexpected_error");
    }
  }

  return json({ 
    status: "waiting",
    hasToken: !!token,
    hasCode: !!code,
    tokenType: type,
    error,
    errorDescription
  });
}

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const loaderData = useLoaderData<typeof loader>();
  const [status, setStatus] = useState("initializing");
  const [error, setError] = useState<string | null>(null);
  const [checkCount, setCheckCount] = useState(0);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    let checkInterval: NodeJS.Timeout;

    async function handleAuth() {
      try {
        logDebug('Starting auth process', {
          url: window.location.href,
          hasToken: searchParams.has("token"),
          type: searchParams.get("type"),
          code: searchParams.get("code"), // PKCE code
          error: searchParams.get("error")
        });

        // Initialize Supabase client
        const supabase = getSupabase();
        
        // Check for existing session first
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        if (session?.user) {
          logDebug('Found existing session', {
            userId: session.user.id,
            email: session.user.email
          });
          setStatus("authenticated");
          navigate("/app", { replace: true });
          return;
        }

        // Handle PKCE code exchange if present
        const code = searchParams.get("code");
        if (code) {
          logDebug('Exchanging PKCE code');
          try {
            const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            if (exchangeError) {
              throw exchangeError;
            }
            if (data.session) {
              logDebug('Successfully exchanged code for session');
              setStatus("authenticated");
              navigate("/app", { replace: true });
              return;
            }
          } catch (exchangeError) {
            console.error('Code exchange error:', exchangeError);
            throw exchangeError;
          }
        }

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          logDebug('Auth state changed', { event, user: session?.user?.email });
          
          if (!mounted.current) return;

          if (event === 'SIGNED_IN' && session?.user) {
            logDebug('User signed in', {
              userId: session.user.id,
              email: session.user.email
            });
            setStatus("authenticated");
            navigate("/app", { replace: true });
          }
        });

        // Start polling for session
        setStatus("waiting");
        
        checkInterval = setInterval(async () => {
          if (!mounted.current) return;

          const currentCount = checkCount + 1;
          logDebug('Polling for session', { attempt: currentCount });

          if (currentCount >= 15) {
            logDebug('Session polling timeout');
            clearInterval(checkInterval);
            setStatus("error");
            setError("Authentication timed out. Please try logging in again.");
            navigate("/auth/login", { replace: true });
            return;
          }

          setCheckCount(currentCount);

          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error('Session polling error:', sessionError);
            return;
          }

          if (session?.user) {
            logDebug('Session found', {
              userId: session.user.id,
              email: session.user.email
            });
            clearInterval(checkInterval);
            setStatus("authenticated");
            navigate("/app", { replace: true });
          }
        }, 2000);

        return () => {
          subscription.unsubscribe();
        };

      } catch (error) {
        console.error('Auth process error:', error);
        logError(error, 'Auth process error');
        setError(error instanceof Error ? error.message : "Unknown error");
        setStatus("error");
      }
    }

    handleAuth();

    return () => {
      mounted.current = false;
      if (checkInterval) {
        clearInterval(checkInterval);
      }
    };
  }, [navigate, checkCount, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Verifying Your Login</h1>
        
        {/* Status Display */}
        <div className={`mb-6 p-4 rounded-lg ${
          status === "error" ? "bg-red-50" :
          status === "authenticated" ? "bg-green-50" :
          "bg-yellow-50"
        }`}>
          <h2 className={`font-semibold mb-2 ${
            status === "error" ? "text-red-800" :
            status === "authenticated" ? "text-green-800" :
            "text-yellow-800"
          }`}>
            Status: {status}
          </h2>
          
          <p className={`text-sm ${
            status === "error" ? "text-red-700" :
            status === "authenticated" ? "text-green-700" :
            "text-yellow-700"
          }`}>
            {status === "initializing" && "Starting authentication process..."}
            {status === "checking" && "Checking authentication status..."}
            {status === "verifying" && "Verifying magic link..."}
            {status === "waiting" && `Waiting for authentication to complete (Attempt ${checkCount}/15)...`}
            {status === "authenticated" && "Successfully authenticated! Redirecting..."}
            {status === "error" && (error || "An error occurred during authentication")}
          </p>
        </div>

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="font-semibold mb-2">Debug Information</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Status:</strong> {status}</p>
              <p><strong>Check Count:</strong> {checkCount}/15</p>
              <p><strong>Error:</strong> {error || "None"}</p>
              <p><strong>Has Token:</strong> {loaderData.hasToken ? "Yes" : "No"}</p>
              <p><strong>Token Type:</strong> {loaderData.tokenType || "None"}</p>
              <p><strong>Error from URL:</strong> {loaderData.error || "None"}</p>
              <p><strong>Error Description:</strong> {loaderData.errorDescription || "None"}</p>
              <p><strong>URL:</strong> <br/>
                <span className="break-all">{isBrowser ? window.location.href : location.pathname + location.search}</span>
              </p>
              <p><strong>Search Params:</strong> <br/>
                <span className="break-all">{location.search}</span>
              </p>
              <p><strong>Hash:</strong> <br/>
                <span className="break-all">{location.hash}</span>
              </p>
              {isBrowser && (
                <p><strong>Window ENV:</strong> <br/>
                  <span className="break-all">
                    {JSON.stringify({
                      hasSupabaseUrl: !!window.env?.SUPABASE_URL,
                      hasSupabaseAnonKey: !!window.env?.SUPABASE_ANON_KEY,
                      supabaseUrlLength: window.env?.SUPABASE_URL?.length
                    }, null, 2)}
                  </span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {["initializing", "checking", "verifying", "waiting"].includes(status) && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 text-center">
          {status === "error" ? (
            <a 
              href="/auth/login" 
              className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Return to Login
            </a>
          ) : (
            <p className="text-sm text-gray-500">
              If you're not redirected automatically,{' '}
              <a href="/auth/login" className="text-indigo-600 hover:text-indigo-500">
                click here
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 