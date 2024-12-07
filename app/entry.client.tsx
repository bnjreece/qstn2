import { RemixBrowser } from "@remix-run/react";
import React, { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

const logWithTimestamp = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  const logData = data ? ` | Data: ${JSON.stringify(data, null, 2)}` : '';
  console.log(`[${timestamp}] 🔄 Client: ${message}${logData}`);
};

logWithTimestamp('Starting client initialization', {
  environment: process.env.NODE_ENV,
  url: window.location.href,
});

startTransition(() => {
  logWithTimestamp('Beginning hydration process');
  
  try {
    hydrateRoot(
      document,
      <StrictMode>
        <RemixBrowser />
      </StrictMode>
    );
    logWithTimestamp('Hydration root created successfully');
  } catch (error) {
    console.error('[Hydration Error]:', error);
  }
});

logWithTimestamp('Client bootstrap complete');