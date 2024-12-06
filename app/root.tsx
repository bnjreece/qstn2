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
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

export function loader() {
  return json({
    ENV: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    },
  });
}

export const links = () => [
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/@radix-ui/themes@latest/styles.css",
  },
];

export default function App(): JSX.Element {
  const data = useLoaderData<typeof loader>();
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body style={{ margin: 0, backgroundColor: 'var(--gray-1)' }}>
        <Theme appearance="light" accentColor="blue" grayColor="slate" radius="medium" scaling="100%">
          <Outlet />
        </Theme>
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

// Injects ENV variables into window.env
export function ErrorBoundary({ error }: { error: Error | undefined }) {
  console.error(error);
  return (
    <html>
      <head>
        <title>Error</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div>
          <h1>Error</h1>
          <p>{error?.message || 'An unexpected error occurred'}</p>
        </div>
        <Scripts />
      </body>
    </html>
  );
} 