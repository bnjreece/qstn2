import { ReactNode, Children, isValidElement, useEffect } from 'react';
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
    hasUnsavedChanges
  });
  
  const currentChild = childrenArray[currentStep - 1];

  // Log state changes
  useEffect(() => {
    console.log('[FormContainer] State changed:', {
      currentStep,
      totalSteps,
      isLoading,
      hasUnsavedChanges,
      childrenCount: childrenArray.length,
      hasCurrentChild: !!currentChild
    });
  }, [currentStep, totalSteps, isLoading, hasUnsavedChanges, childrenArray.length, currentChild]);

  const handleNext = () => {
    console.log('[FormContainer] Next button clicked:', {
      currentStep,
      totalSteps,
      isButtonDisabled: currentStep === totalSteps
    });
    
    if (currentStep < totalSteps) {
      console.log('[FormContainer] Calling goToNextStep');
      goToNextStep();
      console.log('[FormContainer] After goToNextStep call');
    } else {
      console.log('[FormContainer] Already at last step');
    }
  };

  const handlePrevious = () => {
    console.log('[FormContainer] Previous button clicked:', {
      currentStep,
      isButtonDisabled: currentStep === 1
    });
    
    if (currentStep > 1) {
      console.log('[FormContainer] Calling goToPreviousStep');
      goToPreviousStep();
      console.log('[FormContainer] After goToPreviousStep call');
    } else {
      console.log('[FormContainer] Already at first step');
    }
  };

  // Log button state
  useEffect(() => {
    console.log('[FormContainer] Button state:', {
      nextDisabled: currentStep === totalSteps,
      prevDisabled: currentStep === 1,
      currentStep,
      totalSteps
    });
  }, [currentStep, totalSteps]);

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
          >
            {currentStep === totalSteps ? 'Complete' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
} 