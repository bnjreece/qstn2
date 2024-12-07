import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';

interface FormState {
  currentStep: number;
  formData: Record<string, any>;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
}

interface FormContextType extends FormState {
  setCurrentStep: (step: number) => void;
  updateFormData: (sectionId: string, data: any) => void;
  setIsLoading: (loading: boolean) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  totalSteps: number;
}

const FormContext = createContext<FormContextType | null>(null);

interface FormProviderProps {
  children: ReactNode;
  initialData?: Record<string, any>;
  totalSteps: number;
  onSave?: (data: Record<string, any>) => Promise<void>;
}

export function FormProvider({
  children,
  initialData = {},
  totalSteps,
  onSave,
}: FormProviderProps) {
  const [state, setState] = useState<FormState>({
    currentStep: 1,
    formData: initialData,
    isLoading: false,
    hasUnsavedChanges: false,
  });

  useEffect(() => {
    console.log('Form state updated:', state);
    console.log('Total steps:', totalSteps);
  }, [state, totalSteps]);

  const setCurrentStep = useCallback((step: number) => {
    console.log('Setting current step to:', step);
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const updateFormData = useCallback(async (sectionId: string, data: any) => {
    console.log('Updating form data:', { sectionId, data });
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, [sectionId]: data },
      hasUnsavedChanges: true,
    }));

    if (onSave) {
      setState(prev => ({ ...prev, isLoading: true }));
      try {
        await onSave({ ...state.formData, [sectionId]: data });
        setState(prev => ({ ...prev, hasUnsavedChanges: false }));
      } catch (error) {
        console.error('Error saving form data:', error);
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    }
  }, [onSave, state.formData]);

  const setIsLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const goToNextStep = useCallback(() => {
    console.log('Going to next step from:', state.currentStep, 'total:', totalSteps);
    if (state.currentStep < totalSteps) {
      setState(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1,
      }));
    }
  }, [state.currentStep, totalSteps]);

  const goToPreviousStep = useCallback(() => {
    console.log('Going to previous step from:', state.currentStep);
    if (state.currentStep > 1) {
      setState(prev => ({
        ...prev,
        currentStep: prev.currentStep - 1,
      }));
    }
  }, [state.currentStep]);

  const value = {
    ...state,
    setCurrentStep,
    updateFormData,
    setIsLoading,
    goToNextStep,
    goToPreviousStep,
    totalSteps,
  };

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
}

export function useForm() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
} 