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
import { useEffect, useRef, useState, useCallback } from "react";
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
    href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;1,400&display=swap",
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
      console.log('[Root] Component mounting');
      mountedRef.current = true;
    }
  }, []);

  return (
    <html lang="en" className="h-full bg-ui-light">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log('[Head Script] Starting...');
              window.addEventListener('DOMContentLoaded', () => {
                console.log('[Head Script] DOM Content Loaded');
              });
              window.addEventListener('load', () => {
                console.log('[Head Script] Window Loaded');
              });
            `,
          }}
        />
      </head>
      <body className="h-full m-0">
        <Outlet />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(data.ENV)};`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log('[Body Script] Starting...');
              
              // Test basic JavaScript functionality
              window.testJS = {
                log: function(message) {
                  console.log('[Test JS]', message);
                },
                alert: function(message) {
                  alert(message);
                },
                click: function(element) {
                  console.log('[Test JS] Clicked:', element);
                  this.alert('Clicked: ' + element);
                }
              };

              // Add click handlers after DOM is ready
              document.addEventListener('DOMContentLoaded', () => {
                console.log('[Body Script] Adding click handlers...');
                
                // Capture phase to log all clicks
                document.addEventListener('click', (e) => {
                  console.log('[Body Script] Click captured:', {
                    target: e.target,
                    defaultPrevented: e.defaultPrevented,
                    phase: 'capture'
                  });
                }, true);

                // Bubble phase to log unhandled clicks
                document.addEventListener('click', (e) => {
                  console.log('[Body Script] Click bubbled:', {
                    target: e.target,
                    defaultPrevented: e.defaultPrevented,
                    phase: 'bubble'
                  });
                }, false);
              });

              console.log('[Body Script] Setup complete');
            `,
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