import { json, redirect, type DataFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { useState, useEffect } from "react";
import { sendMagicLink, getUserSession, logout } from "~/utils/auth.server";
import { supabase } from "~/utils/supabase.server";

interface SuccessResponse {
  success: true;
  message?: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
  waitTime?: number;
}

type ActionData = SuccessResponse | ErrorResponse;

function isError(data: ActionData): data is ErrorResponse {
  return 'error' in data;
}

function isSuccess(data: ActionData): data is SuccessResponse {
  return 'success' in data;
}

export async function loader({ request }: DataFunctionArgs) {
  console.log('Auth login loader - Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    isDevelopment: process.env.NODE_ENV === 'development'
  });

  try {
    // Check server-side session first
    const { userId } = await getUserSession(request);
    
    // If we have a server-side session, verify Supabase session
    if (userId) {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Only redirect if we have both server-side and Supabase session
      if (session?.user) {
        console.log('Auth login loader - Both sessions valid, redirecting to /app');
        return redirect("/app");
      }
      
      // If server session exists but no Supabase session, clear server session
      console.log('Auth login loader - Server session exists but no Supabase session, clearing session');
      return logout(request);
    }

    // In development, redirect to dev login
    if (process.env.NODE_ENV === 'development') {
      console.log('Auth login loader - Development mode, redirecting to /dev-login');
      return redirect('/dev-login');
    }

    return json({});
  } catch (error) {
    console.error('Auth login loader error:', error);
    return json({});
  }
}

export async function action({ request }: DataFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const action = formData.get("_action");

  // Handle clear session action (development only)
  if (action === "clearSession" && process.env.NODE_ENV === "development") {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return json<ActionData>({ 
        error: "Failed to clear session",
        details: error.message
      });
    }
    return json<ActionData>({ 
      success: true,
      message: "Session cleared successfully"
    });
  }

  if (!email || typeof email !== "string") {
    return json<ActionData>({ error: "Please provide a valid email address" });
  }

  try {
    // Check for existing session first
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session check error:", sessionError);
    } else if (session?.user) {
      console.log("Found existing session, redirecting to app");
      return redirect("/_app");
    }

    // If no session, try to send magic link
    console.log("Attempting to send magic link to:", email);
    await sendMagicLink(email);
    return json<ActionData>({ 
      success: true,
      message: "Check your email for a login link!"
    });
  } catch (error) {
    console.error("Login error:", error);
    
    if (error instanceof Error) {
      // Handle rate limit errors
      if (error.message.includes('rate limit')) {
        const match = error.message.match(/after (\d+) seconds/);
        const waitTime = match ? parseInt(match[1]) : 30;
        
        return json<ActionData>({ 
          error: "Please wait before requesting another login link",
          details: `For security reasons, you can request another link in ${waitTime} seconds.`,
          waitTime
        });
      }
      
      return json<ActionData>({ 
        error: "Failed to send login link",
        details: error.message
      });
    }
    
    return json<ActionData>({ 
      error: "An unexpected error occurred",
      details: String(error)
    });
  }
}

export default function Login() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData<typeof action>();
  const error = searchParams.get("error");
  const reason = searchParams.get("reason");
  const [cooldown, setCooldown] = useState(0);
  const [sessionInfo, setSessionInfo] = useState<any>(null);

  useEffect(() => {
    // Check session state
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      setSessionInfo({
        hasSession: !!session,
        user: session?.user?.email,
        error: error?.message,
        lastChecked: new Date().toISOString()
      });
    };

    checkSession();

    // Set up session change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      setSessionInfo({
        hasSession: !!session,
        user: session?.user?.email,
        event,
        lastChecked: new Date().toISOString()
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (actionData && isSuccess(actionData)) {
      // Start 30 second cooldown when magic link is sent
      setCooldown(30);
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [actionData]);

  // Map error codes to user-friendly messages
  const getErrorMessage = (error: string, reason?: string | null) => {
    switch (error) {
      case "auth_failed":
        switch (reason) {
          case "verification_failed":
            return "We couldn't verify your login link. Please request a new one.";
          case "verification_error":
            return "There was a problem verifying your login. Please try again.";
          case "session_error":
            return "There was a problem with your session. Please try logging in again.";
          case "no_user":
            return "We couldn't find your account. Please try logging in again.";
          case "no_auth_params":
            return "The authentication link appears to be invalid. Please request a new one.";
          default:
            return "Authentication failed. Please try logging in again.";
        }
      default:
        return "An error occurred. Please try again.";
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        {/* Session Info (Development Only) */}
        {process.env.NODE_ENV === "development" && sessionInfo && (
          <div className="rounded-md bg-blue-50 p-4">
            <h3 className="text-sm font-medium text-blue-800">Current Session State</h3>
            <pre className="mt-2 text-xs text-blue-700 whitespace-pre-wrap">
              {JSON.stringify(sessionInfo, null, 2)}
            </pre>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {getErrorMessage(error, reason)}
                </h3>
              </div>
            </div>
          </div>
        )}

        {actionData && isError(actionData) && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {actionData.error}
                </h3>
                {actionData.details && (
                  <p className="mt-2 text-sm text-red-700">
                    Details: {actionData.details}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {actionData && isSuccess(actionData) && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  {actionData.message || "Check your email for a login link!"}
                </p>
              </div>
            </div>
          </div>
        )}

        <Form method="post" className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={cooldown > 0}
              className={`group relative flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                cooldown > 0 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {cooldown > 0 
                ? `Wait ${cooldown}s before requesting again` 
                : 'Send me a login link'}
            </button>
          </div>
        </Form>

        {/* Development only: Clear Session button */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 border-t pt-4">
            <div className="text-sm text-gray-500 mb-2">Development Tools</div>
            <Form method="post">
              <input type="hidden" name="_action" value="clearSession" />
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear Supabase Session
              </button>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
} 