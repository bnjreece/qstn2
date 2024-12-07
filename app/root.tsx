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
  useLocation,
  useNavigation,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import styles from "./styles/tailwind.css";

// Server-side logging helper
const logServer = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  const logData = data ? ` | Data: ${JSON.stringify(data, null, 2)}` : '';
  console.log(`[${timestamp}] 🖥️  Server: ${message}${logData}`);
};

// Client-side logging helper
const logClient = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  const logData = data ? ` | Data: ${JSON.stringify(data, null, 2)}` : '';
  console.log(`[${timestamp}] 🌐 Browser: ${message}${logData}`);
};

export const loader: LoaderFunction = () => {
  logServer('Root loader starting');
  
  const envCheck = {
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    hasSupabaseAnonKey: !!process.env.SUPABASE_ANON_KEY,
    nodeEnv: process.env.NODE_ENV,
  };
  
  logServer('Environment check', envCheck);

  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  };

  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    const error = 'Missing required environment variables';
    logServer(error, envCheck);
    console.error(error, envCheck);
  }

  logServer('Root loader completing');
  return json({
    ENV: env,
  });
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
  },
  { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
];

export default function App(): JSX.Element {
  const data = useLoaderData<typeof loader>();
  const location = useLocation();
  const navigation = useNavigation();
  const mountedRef = useRef(false);
  
  useEffect(() => {
    if (!mountedRef.current) {
      logClient('Root component mounted', {
        pathname: location.pathname,
        navigationState: navigation.state,
      });
      
      logClient('Window environment check', {
        hasWindowEnv: !!window.env,
        windowEnvKeys: window.env ? Object.keys(window.env) : [],
        url: window.location.href,
      });
      
      mountedRef.current = true;
    }
  }, [location, navigation.state]);
  
  useEffect(() => {
    logClient('Navigation state change', {
      state: navigation.state,
      location: navigation.location?.pathname,
    });
  }, [navigation.state]);
  
  logClient('Root component rendering', {
    pathname: location.pathname,
    navigationState: navigation.state,
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
  const location = useLocation();
  
  useEffect(() => {
    console.error('[Error Boundary]', {
      timestamp: new Date().toISOString(),
      error: error?.message,
      stack: error?.stack,
      location: location.pathname,
    });
  }, [error, location]);

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