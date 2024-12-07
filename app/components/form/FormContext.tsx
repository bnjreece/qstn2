import { createContext, useContext, ReactNode, useState, useCallback } from 'react';

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

  const setCurrentStep = useCallback((step: number) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const updateFormData = useCallback(async (sectionId: string, data: any) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, [sectionId]: data },
      hasUnsavedChanges: true,
    }));

    // Autosave if onSave is provided
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
    setState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, totalSteps),
    }));
  }, [totalSteps]);

  const goToPreviousStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }));
  }, []);

  return (
    <FormContext.Provider
      value={{
        ...state,
        setCurrentStep,
        updateFormData,
        setIsLoading,
        goToNextStep,
        goToPreviousStep,
        totalSteps,
      }}
    >
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