import { RemixBrowser } from "@remix-run/react";
import React, { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

const logWithTimestamp = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  const logData = data ? ` | Data: ${JSON.stringify(data, null, 2)}` : '';
  console.log(`[${timestamp}] 🔄 Client: ${message}${logData}`);
};

const logError = (error: any) => {
  console.error('[Hydration Error]:', {
    message: error?.message,
    stack: error?.stack,
    timestamp: new Date().toISOString()
  });
};

// Add global error handlers
window.addEventListener('error', (event) => {
  logError(event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  logError(event.reason);
});

// Add test function to window
(window as any).testClientJS = function() {
  console.log('Client-side JavaScript is working!');
  alert('Client-side JavaScript is working!');
};

logWithTimestamp('Starting client initialization', {
  environment: process.env.NODE_ENV,
  url: window.location.href,
  hasDocument: typeof document !== 'undefined',
  hasWindow: typeof window !== 'undefined'
});

function hydrate() {
  startTransition(() => {
    logWithTimestamp('Beginning hydration process');
    
    try {
      const root = hydrateRoot(
        document,
        <StrictMode>
          <RemixBrowser />
        </StrictMode>
      );

      logWithTimestamp('Hydration root created successfully', {
        rootExists: !!root
      });

      // Test that hydration worked
      setTimeout(() => {
        if (typeof (window as any).testClientJS === 'function') {
          console.log('Client-side JavaScript is ready');
        } else {
          console.error('Client-side JavaScript failed to initialize');
        }
      }, 1000);

    } catch (error) {
      logError(error);
    }
  });
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1);
}

logWithTimestamp('Client bootstrap complete');