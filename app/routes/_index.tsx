import { redirect } from "@remix-run/node";
import type { DataFunctionArgs } from "@remix-run/node";
import { getUserSession } from "../utils/auth.server";

export async function loader({ request }: DataFunctionArgs) {
  const { userId } = await getUserSession(request);
  
  // If user is authenticated, redirect to app
  if (userId) {
    return redirect("/app");
  }
  
  // Otherwise redirect to login
  return redirect("/login");
} 