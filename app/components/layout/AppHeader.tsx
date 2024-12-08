import { Form, Link } from "@remix-run/react";
import type { User } from '@supabase/supabase-js';

interface AppHeaderProps {
  user: User;
}

export function AppHeader({ user }: AppHeaderProps) {
  return (
    <nav className="bg-secondary border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex items-center">
            <Link to="/app" className="flex items-center">
              <img 
                src="/images/qstn-logo.png" 
                alt="QSTN" 
                className="h-6 w-auto" 
              />
            </Link>
          </div>

          <div className="flex items-center">
            <Form action="/auth/logout" method="post">
              <button
                type="submit"
                className="p-2 rounded-md text-primary hover:bg-primary/10"
                title="Logout"
              >
                <span className="sr-only">Logout</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </Form>
          </div>
        </div>
      </div>
    </nav>
  );
} 