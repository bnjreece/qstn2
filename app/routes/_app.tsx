import { json } from "@remix-run/node";
import type { DataFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { requireUserId } from "~/utils/auth.server";

export async function loader({ request }: DataFunctionArgs) {
  // Ensure user is authenticated
  await requireUserId(request);
  return json({});
}

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
} 