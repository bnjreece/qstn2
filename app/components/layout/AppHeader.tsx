import { Form, Link, useLocation } from "@remix-run/react";
import type { User } from '@supabase/supabase-js';
import { useState } from 'react';

interface AppHeaderProps {
  user: User;
}

export function AppHeader({ user }: AppHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

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

          {/* Hamburger button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md text-primary hover:bg-primary/10"
          >
            <span className="sr-only">Open menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="border-b border-primary/10 shadow-lg">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link
              to="/app/personal-plan"
              className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-primary/10"
            >
              Personal Plan
            </Link>
            <div className="px-3 py-2 text-sm font-medium text-primary/70">
              {user.email}
            </div>
            <Form action="/auth/logout" method="post">
              <button
                type="submit"
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-primary/10"
              >
                Logout
              </button>
            </Form>
          </div>
        </div>
      )}
    </nav>
  );
} 