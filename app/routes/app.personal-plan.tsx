import { Outlet } from '@remix-run/react';

export default function PersonalPlan() {
  return (
    <div className="min-h-screen bg-ui-light">
      <div className="w-full max-w-4xl mx-auto px-8 py-2">
        <Outlet />
      </div>
    </div>
  );
} 