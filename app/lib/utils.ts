import { redirect } from '@remix-run/node';
import { supabase } from './supabase';

export async function requireAuth(request: Request) {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw redirect('/auth/login');
  }
  
  return session;
}

export function getDomainUrl(request: Request) {
  const host = request.headers.get('X-Forwarded-Host') ?? request.headers.get('host');
  if (!host) {
    throw new Error('Could not determine domain URL.');
  }
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

export function isFormData(value: unknown): value is FormData {
  return value instanceof FormData;
}

export function getFormData<T extends Record<string, string>>(form: FormData): T {
  const values: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === 'string') {
      values[key] = value;
    }
  }
  return values as T;
} 