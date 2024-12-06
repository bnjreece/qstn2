import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import styles from "./styles/tailwind.css";

export const loader: LoaderFunction = () => {
  console.log('Server ENV check:', {
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    hasSupabaseAnonKey: !!process.env.SUPABASE_ANON_KEY,
    supabaseUrlLength: process.env.SUPABASE_URL?.length,
  });

  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  };

  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    console.error('Missing required environment variables:', {
      hasSupabaseUrl: !!env.SUPABASE_URL,
      hasSupabaseAnonKey: !!env.SUPABASE_ANON_KEY,
    });
  }

  return json({
    ENV: env,
  });
};

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
  },
];

export default function App(): JSX.Element {
  const data = useLoaderData<typeof loader>();
  
  console.log('Client ENV check:', {
    hasSupabaseUrl: !!data.ENV.SUPABASE_URL,
    hasSupabaseAnonKey: !!data.ENV.SUPABASE_ANON_KEY,
    supabaseUrlLength: data.ENV.SUPABASE_URL?.length,
  });
  
  return (
    <html lang="en" className="h-full bg-gray-100" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full m-0">
        <Outlet />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: { error: Error | undefined }): JSX.Element {
  console.error('App Error:', error);
  return (
    <html lang="en">
      <head>
        <title>Error</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Error</h1>
              <p className="mt-2 text-center text-sm text-gray-600">
                {error?.message || 'An unexpected error occurred'}
              </p>
              {process.env.NODE_ENV === 'development' && error?.stack && (
                <pre className="mt-4 p-4 bg-gray-100 rounded text-xs overflow-auto">
                  {error.stack}
                </pre>
              )}
            </div>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
} 