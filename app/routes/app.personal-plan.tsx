import { Outlet } from '@remix-run/react';

export default function PersonalPlan() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ui-light via-ui-light to-primary/5">
      <div className="w-full max-w-4xl mx-auto px-8 py-12">
        <Outlet />
      </div>
    </div>
  );
} 