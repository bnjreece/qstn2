import { useMatches } from "@remix-run/react";

interface Step {
  name: string;
  href: string;
  status: 'complete' | 'current' | 'upcoming';
}

export function FormStepper() {
  const matches = useMatches();
  const currentPath = matches[matches.length - 1].pathname;

  const steps: Step[] = [
    { name: 'Document', href: '/app/new', status: 'current' },
    { name: 'Questions', href: '/app/new/questions', status: 'upcoming' },
    { name: 'Review', href: '/app/new/review', status: 'upcoming' },
  ].map(step => ({
    ...step,
    status: currentPath === step.href ? 'current' : 
            currentPath.startsWith(step.href) ? 'complete' : 'upcoming'
  }));

  return (
    <nav aria-label="Progress">
      <ol className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="md:flex-1">
            {step.status === 'complete' ? (
              <div className="group flex flex-col border-l-4 border-indigo-600 py-2 pl-4 hover:border-indigo-800 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-800">
                  Step {stepIdx + 1}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </div>
            ) : step.status === 'current' ? (
              <div className="flex flex-col border-l-4 border-indigo-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-indigo-600">
                  Step {stepIdx + 1}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </div>
            ) : (
              <div className="group flex flex-col border-l-4 border-gray-200 py-2 pl-4 hover:border-gray-300 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                  Step {stepIdx + 1}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
} 