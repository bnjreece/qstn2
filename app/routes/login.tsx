import React, { useEffect, useState } from 'react';
import { json, redirect } from "@remix-run/node";
import type { DataFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useSearchParams, useNavigate } from "@remix-run/react";
import { getUserSession, sendMagicLink } from "../utils/auth.server";
import { supabase as getSupabaseClient } from "../utils/supabase.client";
import { supabase } from "../utils/supabase.server";

type ActionData = 
  | { success: true }
  | { error: string };

function isErrorResponse(data: ActionData): data is { error: string } {
  return 'error' in data;
}

function isSuccessResponse(data: ActionData): data is { success: true } {
  return 'success' in data;
}

export async function loader({ request }: DataFunctionArgs) {
  // Check for server-side session
  const { userId } = await getUserSession(request);
  
  // Check for Supabase session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  // If we have either session, redirect to app
  if (userId || session?.user) {
    return redirect("/app");
  }
  
  return json({});
}

export async function action({ request }: DataFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");

  if (!email || typeof email !== "string") {
    return json<ActionData>({ error: "Email is required" }, { status: 400 });
  }

  try {
    await sendMagicLink(email);
    return json<ActionData>({ success: true });
  } catch (error) {
    return json<ActionData>({ error: "Failed to send magic link" }, { status: 500 });
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const error = searchParams.get("error");
  const navigate = useNavigate();
  const [hashError, setHashError] = useState<string | null>(null);

  // Handle hash parameters from magic link
  useEffect(() => {
    const handleHashParams = async () => {
      if (window.location.hash) {
        console.log("Found hash parameters:", window.location.hash);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        // Check for errors in hash parameters
        const hashError = hashParams.get('error');
        const hashErrorDescription = hashParams.get('error_description');
        
        if (hashError) {
          console.log("Hash error:", { hashError, hashErrorDescription });
          setHashError(hashErrorDescription || hashError);
          // Clear the hash without triggering a reload
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
          return;
        }

        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        console.log("Parsed hash params:", {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          type: hashParams.get('type')
        });
        
        if (accessToken && refreshToken) {
          try {
            console.log("Attempting to set Supabase session");
            const client = getSupabaseClient();
            const { data: { session }, error } = await client.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            // Clear hash parameters
            window.history.replaceState(null, '', window.location.pathname + window.location.search);

            if (error) {
              console.error("Error setting Supabase session:", error);
              return;
            }

            if (session) {
              console.log("Successfully set Supabase session");
              // Get the user from the session
              const { data: { user }, error: userError } = await client.auth.getUser();
              
              if (userError) {
                console.error("Error getting user:", userError);
                return;
              }

              if (user) {
                console.log("Got user from session:", user.id);
                // Create a server-side session and redirect
                try {
                  console.log("Calling auth callback endpoint");
                  const response = await fetch('/auth/callback', {
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${accessToken}`,
                      'X-Refresh-Token': refreshToken
                    }
                  });
                  
                  if (response.ok) {
                    console.log("Auth callback successful, navigating to app");
                    navigate('/app');
                  } else {
                    console.error("Auth callback failed:", {
                      status: response.status,
                      statusText: response.statusText
                    });
                    const text = await response.text();
                    console.error("Response text:", text);
                  }
                } catch (fetchError) {
                  console.error("Error calling auth callback:", fetchError);
                }
              } else {
                console.log("No user found in session");
              }
            } else {
              console.log("No session returned from setSession");
            }
          } catch (error) {
            console.error("Error in hash parameter handling:", error);
            if (error instanceof Error) {
              console.error("Error details:", {
                message: error.message,
                stack: error.stack,
                name: error.name
              });
            }
          }
        }
      }
    };

    handleHashParams();
  }, [navigate]);

  // Helper function to get error message
  const getErrorMessage = (errorCode: string | null) => {
    if (!errorCode) return "An error occurred. Please try again.";
    
    switch (errorCode) {
      case "auth_callback_error":
        return "Authentication failed. Please try again.";
      case "auth_failed":
        return "Unable to complete authentication. Please try logging in again.";
      case "session_error":
        return "Session error. Please try logging in again.";
      default:
        return "An error occurred. Please try again.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-end">
          <form action="/logout" method="post">
            <button
              type="submit"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          </form>
        </div>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        {(error || hashError) && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  {hashError || getErrorMessage(error)}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {actionData && isSuccessResponse(actionData) ? (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Check your email for the magic link!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <Form method="post" className="mt-8 space-y-6">
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
            </div>

            {actionData && isErrorResponse(actionData) && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {actionData.error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Send Magic Link
              </button>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
} 