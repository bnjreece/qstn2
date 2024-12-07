import { redirect, type DataFunctionArgs } from "@remix-run/node";
import { createCookieSessionStorage } from "@remix-run/node";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "qstn_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function loader({ request }: DataFunctionArgs) {
  console.log('Attempting dev login at:', request.url);
  
  try {
    // Create a new session directly
    const session = await storage.getSession();
    session.set("userId", "379d1265-0faf-450d-9421-d601474f19cb");
    
    console.log('Created dev session, redirecting to /app');
    
    return redirect("/app", {
      headers: {
        "Set-Cookie": await storage.commitSession(session),
      },
    });
  } catch (error) {
    console.error('Dev login error:', error);
    return redirect('/auth/login');
  }
} 