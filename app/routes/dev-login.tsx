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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Dev Login</h1>
        <Form method="post">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
          >
            Login as Dev User
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