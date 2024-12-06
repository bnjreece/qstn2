import React from 'react';
import type { FormStep } from '../types/document';

interface FormStepperProps {
  steps: FormStep[];
  currentStep: number;
  onStepClick: (index: number) => void;
}

export function FormStepper({ steps, currentStep, onStepClick }: FormStepperProps) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
        {steps.map((step, index) => (
          <li key={step.id} className="md:flex-1">
            <button
              onClick={() => onStepClick(index)}
              className={`group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0 ${
                index === currentStep
                  ? 'border-indigo-600'
                  : index < currentStep
                  ? 'border-green-600'
                  : 'border-gray-200'
              }`}
            >
              <span className="text-sm font-medium">
                Step {index + 1}
              </span>
              <span className="text-sm">{step.title}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
} 