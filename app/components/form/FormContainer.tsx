import { ReactNode, Children, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { useForm } from './FormContext';

interface FormContainerProps {
  children: ReactNode;
}

export function FormContainer({ children }: FormContainerProps) {
  const {
    currentStep,
    totalSteps,
    isLoading,
    goToNextStep,
    goToPreviousStep,
    hasUnsavedChanges,
  } = useForm();

  // Convert children to array and get current child
  const childrenArray = Children.toArray(children);
  const currentChild = childrenArray[currentStep - 1];

  console.log('[FormContainer] Rendering:', {
    currentStep,
    totalSteps,
    childrenCount: childrenArray.length,
    hasCurrentChild: !!currentChild,
    currentChildType: currentChild ? (currentChild as any).type?.name : 'unknown'
  });

  const handleNext = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('[FormContainer] Next button clicked:', {
      currentStep,
      totalSteps,
      childrenCount: childrenArray.length
    });
    
    if (goToNextStep) {
      goToNextStep();
    }
  }, [currentStep, totalSteps, goToNextStep, childrenArray.length]);

  const handlePrevious = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (goToPreviousStep) {
      goToPreviousStep();
    }
  }, [goToPreviousStep]);

  // Log state changes
  useEffect(() => {
    console.log('[FormContainer] State changed:', {
      currentStep,
      totalSteps,
      childrenCount: childrenArray.length,
      hasCurrentChild: !!currentChild
    });
  }, [currentStep, totalSteps, childrenArray.length, currentChild]);

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full max-w-3xl mx-auto px-8 flex flex-col">
      {/* Progress bar */}
      <div className="py-8">
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-sm font-light text-gray-500">
            Step {currentStep} of {totalSteps}
          </span>
          {hasUnsavedChanges && (
            <span className="text-sm font-light text-indigo-600">
              Saving...
            </span>
          )}
        </div>
      </div>

      {/* Form content */}
      <div className="flex-grow flex flex-col">
        <div className="flex-grow py-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              {currentChild}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        <div className="py-8 flex justify-between gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            variant="secondary"
            isLoading={isLoading}
            size="lg"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentStep === totalSteps}
            isLoading={isLoading}
            size="lg"
            data-testid="next-button"
          >
            {currentStep === totalSteps ? 'Complete' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
} 