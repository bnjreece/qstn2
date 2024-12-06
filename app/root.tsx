import React from 'react';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
} from "@remix-run/react";
import { Theme } from "@radix-ui/themes";
import styles from "@radix-ui/themes/styles.css";
import globalStylesUrl from "./styles/global.css";

export const links = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
  {
    rel: "stylesheet",
    href: globalStylesUrl,
  },
  {
    rel: "icon",
    href: "data:image/x-icon;base64,AA",
    type: "image/x-icon",
  },
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
  },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
];

export default function App(): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Theme accentColor="blue" grayColor="slate" scaling="100%" radius="medium">
          <Outlet />
        </Theme>
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
} 