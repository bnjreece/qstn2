import type { User } from '@supabase/supabase-js';

export interface AuthLoaderData {
  user: User;
}

export interface AuthErrorResponse {
  error: string;
  details?: string;
  waitTime?: number;
}

export interface AuthSuccessResponse {
  success: true;
  message?: string;
}

export type AuthActionData = AuthSuccessResponse | AuthErrorResponse;

export function isAuthError(data: AuthActionData): data is AuthErrorResponse {
  return 'error' in data;
}

export function isAuthSuccess(data: AuthActionData): data is AuthSuccessResponse {
  return 'success' in data;
} 