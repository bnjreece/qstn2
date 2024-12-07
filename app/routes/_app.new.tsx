import { Outlet } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { DataFunctionArgs } from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server";
import { FormStepper } from "~/components/FormStepper";

export async function loader({ request }: DataFunctionArgs) {
  // Ensure user is authenticated
  await requireUserId(request);
  return json({});
}

export default function NewDocument() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <FormStepper />
        <Outlet />
      </div>
    </div>
  );
} 