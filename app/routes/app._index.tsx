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
      <div className="bg-white/50 backdrop-blur-sm shadow rounded-lg p-6 border border-primary/10">
        <h1 className="text-2xl font-serif text-red-600">
          {error.status} {error.statusText}
        </h1>
        <p className="mt-2 text-text-secondary">{error.data}</p>
      </div>
    );
  }

  return (
    <div className="bg-white/50 backdrop-blur-sm shadow rounded-lg p-6 border border-primary/10">
      <h1 className="text-2xl font-serif text-red-600">Error</h1>
      <p className="mt-2 text-text-secondary">An unexpected error occurred.</p>
    </div>
  );
}

export default function AppIndex() {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-6">
        <img 
          src="/images/qstn-logo.png" 
          alt="QSTN" 
          className="h-24 w-auto mx-auto" 
        />
        <h1 className="text-5xl font-serif text-text-primary">
          Welcome to QSTN
        </h1>
        <p className="text-2xl font-serif text-text-secondary/60">
          Create your personal plan and achieve your goals
        </p>
      </div>
      <Link
        to="/app/personal-plan"
        className="btn-primary btn-lg"
      >
        Get Started with Personal Plan
      </Link>
    </div>
  );
} 