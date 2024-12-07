import { ReactNode, Children, isValidElement, useEffect, useCallback } from 'react';
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
  console.log('[FormContainer] Initial render:', {
    childrenCount: childrenArray.length,
    currentStep,
    totalSteps,
    isLoading,
    hasUnsavedChanges,
    hasNextHandler: !!goToNextStep,
    hasPrevHandler: !!goToPreviousStep
  });
  
  const currentChild = childrenArray[currentStep - 1];

  const handleNext = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('[FormContainer] Next button clicked:', {
      currentStep,
      totalSteps,
      hasNextHandler: !!goToNextStep
    });
    
    if (goToNextStep) {
      goToNextStep();
    } else {
      console.error('[FormContainer] goToNextStep is undefined');
    }
  }, [currentStep, totalSteps, goToNextStep]);

  const handlePrevious = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('[FormContainer] Previous button clicked:', {
      currentStep,
      hasPrevHandler: !!goToPreviousStep
    });
    
    if (goToPreviousStep) {
      goToPreviousStep();
    } else {
      console.error('[FormContainer] goToPreviousStep is undefined');
    }
  }, [currentStep, goToPreviousStep]);

  // Log state changes
  useEffect(() => {
    console.log('[FormContainer] State changed:', {
      currentStep,
      totalSteps,
      isLoading,
      hasUnsavedChanges,
      childrenCount: childrenArray.length,
      hasCurrentChild: !!currentChild,
      hasNextHandler: !!goToNextStep,
      hasPrevHandler: !!goToPreviousStep
    });
  }, [currentStep, totalSteps, isLoading, hasUnsavedChanges, childrenArray.length, currentChild, goToNextStep, goToPreviousStep]);

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
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {currentChild}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        <div 
          className="py-8 flex justify-between gap-4"
          onClick={(e) => {
            console.log('[FormContainer] Navigation buttons container clicked:', {
              target: e.target,
              currentTarget: e.currentTarget
            });
          }}
        >
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
            onClick={(e) => {
              console.log('[FormContainer] Next button clicked directly');
              handleNext(e);
            }}
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