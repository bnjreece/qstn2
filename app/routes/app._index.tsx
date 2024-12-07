import { json } from "@remix-run/node";
import type { DataFunctionArgs } from "@remix-run/node";
import { useRouteError, isRouteErrorResponse, useOutletContext } from "@remix-run/react";
import type { AuthLoaderData } from "~/types/auth";
import { Link } from "@remix-run/react";

export async function loader({ request }: DataFunctionArgs) {
  return json({});
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-red-600">
          {error.status} {error.statusText}
        </h1>
        <p className="mt-2 text-gray-600">{error.data}</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-red-600">Error</h1>
      <p className="mt-2 text-gray-600">An unexpected error occurred.</p>
    </div>
  );
}

export default function AppIndex() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to QSTN
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Create your personal plan and achieve your goals
      </p>
      <Link
        to="/app/personal-plan"
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Get Started with Personal Plan
      </Link>
    </div>
  );
} 