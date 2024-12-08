import { Outlet } from '@remix-run/react';

export default function PersonalPlan() {
  return (
    <div className="min-h-[calc(100vh-4rem)] w-full max-w-4xl mx-auto px-8 py-12 bg-ui-light">
      <Outlet />
    </div>
  );
} 