import { Form } from "@remix-run/react";
import type { User } from '@supabase/supabase-js';

interface AppHeaderProps {
  user: User;
}

export function AppHeader({ user }: AppHeaderProps) {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600">QSTN</span>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-500">{user.email}</span>
            <Form action="/auth/logout" method="post" className="ml-4">
              <button
                type="submit"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </Form>
          </div>
        </div>
      </div>
    </nav>
  );
} 