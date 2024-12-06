import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import { supabase } from "../utils/supabase.server";

interface LoaderData {
  message: string;
  error: string | null;
  details?: {
    code?: string;
    hint?: string;
    type?: string;
    stringified?: string;
    stack?: string;
    [key: string]: any;
  };
}

export async function loader() {
  try {
    console.log('Attempting to fetch message from Supabase');

    const { data, error } = await supabase
      .from('messages')
      .select('text')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Supabase query error:', error);
      return json<LoaderData>({ 
        message: 'Hello World',
        error: error.message,
        details: {
          ...error.details,
          code: error.code,
          hint: error.hint
        }
      });
    }

    if (!data) {
      console.log('No data found, returning default message');
      return json<LoaderData>({ 
        message: 'Hello World',
        error: null 
      });
    }

    console.log('Successfully fetched message');
    return json<LoaderData>({ 
      message: data.text || 'Hello World',
      error: null 
    });
  } catch (err) {
    console.error('Unexpected error in loader:', err);
    return json<LoaderData>({ 
      message: 'Hello World',
      error: err instanceof Error ? err.message : 'Unknown error',
      details: {
        type: err?.constructor?.name,
        stringified: JSON.stringify(err),
        stack: err instanceof Error ? err.stack : undefined
      }
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
        padding: "2rem",
        backgroundColor: "#fff1f0",
        border: "1px solid #ff4d4f",
        borderRadius: "4px"
      }}>
        <h1 style={{ color: "#cf1322" }}>Error: {error}</h1>
        {details && (
          <pre style={{ 
            whiteSpace: 'pre-wrap',
            backgroundColor: "#fff",
            padding: "1rem",
            borderRadius: "4px"
          }}>
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