import { Form, Link, useLocation } from "@remix-run/react";
import type { User } from '@supabase/supabase-js';

interface AppHeaderProps {
  user: User;
}

export function AppHeader({ user }: AppHeaderProps) {
  const location = useLocation();
  const isPersonalPlan = location.pathname === '/app/personal-plan';

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/app" className="text-xl font-bold text-indigo-600">
                QSTN
              </Link>
            </div>
            <div className="ml-6 flex space-x-8">
              <Link
                to="/app/personal-plan"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300"
              >
                Personal Plan
              </Link>
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