import { json, redirect } from "@remix-run/node";
import type { DataFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { requireUserId } from "../utils/auth.server";
import { supabase } from "../utils/supabase.server";
import React from "react";

export async function loader({ request }: DataFunctionArgs) {
  // First check if we have a server-side session
  const userId = await requireUserId(request);
  
  // Then get user details from Supabase session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error("Failed to get Supabase session:", sessionError);
    // If there's an error getting the Supabase session, but we have a server session,
    // still allow access but with limited data
    return json({ user: { email: "User" } });
  }

  // If we have a server session but no Supabase session, still allow access
  if (!session?.user) {
    console.log("No Supabase session found, but server session exists");
    return json({ user: { email: "User" } });
  }

  return json({ user: { email: session.user.email } });
}

export default function AppLayout() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-indigo-600">QSTN</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500">{user.email}</span>
              <form action="/auth/logout" method="post" className="ml-4">
                <button
                  type="submit"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
} 