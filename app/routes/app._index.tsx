import { json } from "@remix-run/node";
import type { DataFunctionArgs } from "@remix-run/node";
import { useRouteError, isRouteErrorResponse, useOutletContext } from "@remix-run/react";
import type { AuthLoaderData } from "~/types/auth";

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

export default function App() {
  const { user } = useOutletContext<AuthLoaderData>();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-900">Welcome to QSTN</h1>
      <p className="mt-2 text-gray-600">You are logged in as {user.email}</p>
    </div>
  );
} 