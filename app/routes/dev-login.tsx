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
    <div className="flex min-h-screen items-center justify-center bg-ui-light">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white/50 backdrop-blur-sm p-8 shadow-lg border border-primary/10">
        <div className="text-center space-y-6">
          <img 
            src="/images/qstn-logo.png" 
            alt="QSTN" 
            className="h-12 w-auto mx-auto" 
          />
          <h2 className="text-4xl font-serif text-text-primary">
            Reveal your story
          </h2>
          <p className="text-text-secondary/60 text-lg font-serif">
            Development login
          </p>
        </div>

        <Form method="post" className="mt-8">
          <button
            type="submit"
            className="w-full flex justify-center rounded-md px-4 py-3 text-base font-serif text-white shadow-sm bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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