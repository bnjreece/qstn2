import { Form, Link, useLocation } from "@remix-run/react";
import type { User } from '@supabase/supabase-js';

interface AppHeaderProps {
  user: User;
}

export function AppHeader({ user }: AppHeaderProps) {
  const location = useLocation();
  const isPersonalPlan = location.pathname === '/app/personal-plan';

  return (
    <nav className="bg-white border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/app" className="h-8">
                <img 
                  src="/images/qstn-logo.png" 
                  alt="QSTN" 
                  className="h-6 w-auto object-contain" 
                />
              </Link>
            </div>
            <div className="ml-8 flex space-x-8">
              <Link
                to="/app/personal-plan"
                className={`inline-flex items-center px-1 pt-1 text-sm font-serif tracking-wide ${
                  isPersonalPlan 
                    ? 'text-primary border-b-2 border-primary font-medium' 
                    : 'text-ui-dark/70 hover:text-primary border-b-2 border-transparent hover:border-primary/30 transition-all'
                }`}
              >
                Personal Plan
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-sm font-serif text-ui-dark/70">{user.email}</span>
            <Form action="/auth/logout" method="post">
              <button
                type="submit"
                className="text-sm font-serif text-ui-dark/70 hover:text-primary transition-colors px-3 py-1 rounded-full hover:bg-primary/5"
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