import * as React from "react";
import { Form } from "@remix-run/react";
import { createUserSession } from "~/utils/auth.server";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

// Block access in production
export const loader: LoaderFunction = async () => {
  if (process.env.NODE_ENV === "production") {
    return redirect("/auth/login");
  }
  return null;
};

export default function DevLogin() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-12">
        <div className="text-center space-y-8">
          <img 
            src="/images/qstn-logo.png" 
            alt="QSTN" 
            className="h-24 w-auto mx-auto" 
          />
          <h2 className="text-3xl font-serif text-dark tracking-tight whitespace-nowrap">
            Reveal your story
          </h2>
          <p className="text-xl font-serif text-dark/40">
            Development login
          </p>
        </div>

        <Form method="post">
          <button
            type="submit"
            className="btn-primary btn-lg w-full"
          >
            Continue as dev user
          </button>
        </Form>
      </div>
    </div>
  );
}

export const action: ActionFunction = async () => {
  if (process.env.NODE_ENV === "production") {
    return redirect("/auth/login");
  }
  return createUserSession("379d1265-0faf-450d-9421-d601474f19cb", "/app");
} 