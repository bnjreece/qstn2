import { json, redirect } from "@remix-run/node";
import type { DataFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { requireUserId, logout } from "~/utils/auth.server";
import { supabase } from "~/utils/supabase.server";
import { AppHeader } from "~/components/layout/AppHeader";
import type { AuthLoaderData } from "~/types/auth";

export async function loader({ request }: DataFunctionArgs) {
  try {
    // First check if we have a server-side session
    const userId = await requireUserId(request);
    
    // Redirect to personal plan if we're at the root app path
    const url = new URL(request.url);
    if (url.pathname === '/app') {
      return redirect('/app/personal-plan');
    }
    
    // In development, bypass Supabase session check
    if (process.env.NODE_ENV === 'development') {
      return json<AuthLoaderData>({ 
        user: {
          id: userId,
          email: 'ben@qstn.us',
          created_at: new Date().toISOString(),
          aud: 'authenticated',
          app_metadata: {},
          user_metadata: {},
          role: 'authenticated',
          updated_at: new Date().toISOString()
        }
      });
    }

    // In production, verify Supabase session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Failed to get Supabase session:", sessionError);
      return logout(request);
    }

    if (!session?.user) {
      console.log("No Supabase session found");
      return logout(request);
    }

    // Verify the user IDs match
    if (session.user.id !== userId) {
      console.log("Session user ID mismatch");
      return logout(request);
    }

    return json<AuthLoaderData>({ user: session.user });
  } catch (error) {
    console.error("App layout loader error:", error);
    return logout(request);
  }
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="min-h-screen bg-ui-light flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {error.status} {error.statusText}
          </h1>
          <p className="text-gray-600">{error.data}</p>
          <a
            href="/auth/login"
            className="mt-4 inline-block text-indigo-600 hover:text-indigo-500"
          >
            Return to login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ui-light flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Something went wrong
        </h1>
        <p className="text-gray-600">
          An unexpected error occurred. Please try again later.
        </p>
        <a
          href="/auth/login"
          className="mt-4 inline-block text-indigo-600 hover:text-indigo-500"
        >
          Return to login
        </a>
      </div>
    </div>
  );
}

export default function AppLayout() {
  const data = useLoaderData<typeof loader>();

  // Ensure we have user data before rendering
  if (!data?.user) {
    throw new Response("No user data available", { status: 500 });
  }

  return (
    <div className="min-h-screen bg-ui-light">
      <AppHeader user={data.user} />
      <main className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet context={data} />
        </div>
      </main>
    </div>
  );
} 