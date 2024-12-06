import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import { supabase } from "../utils/supabase.server";

export async function loader() {
  const { data, error } = await supabase
    .from('messages')
    .select('text')
    .single();

  if (error) {
    console.error('Error fetching message:', error);
    return json({ message: 'Hello World' }); // Fallback message
  }

  return json({ message: data?.text || 'Hello World' });
}

export default function Index() {
  const { message } = useLoaderData<typeof loader>();

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