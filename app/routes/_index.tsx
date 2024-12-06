import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import { supabase } from "../utils/supabase.server";

export async function loader() {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('text')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching message:', error);
      return json({ 
        message: 'Hello World',
        error: error.message,
        details: error.details
      });
    }

    if (!data) {
      return json({ 
        message: 'Hello World',
        error: null 
      });
    }

    return json({ 
      message: data.text || 'Hello World',
      error: null 
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return json({ 
      message: 'Hello World',
      error: err instanceof Error ? err.message : 'Unknown error',
      details: err
    });
  }
}

export default function Index() {
  const { message, error, details } = useLoaderData<typeof loader>();

  if (error) {
    return (
      <div style={{ 
        fontFamily: "system-ui, sans-serif", 
        lineHeight: "1.4",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "2rem"
      }}>
        <h1>Error: {error}</h1>
        {details && (
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(details, null, 2)}
          </pre>
        )}
      </div>
    );
  }

  return (
    <div style={{ 
      fontFamily: "system-ui, sans-serif", 
      lineHeight: "1.4",
      maxWidth: "800px",
      margin: "0 auto",
      padding: "2rem"
    }}>
      <h1>{message}</h1>
    </div>
  );
} 