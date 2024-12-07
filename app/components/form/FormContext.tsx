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
  console.log('[FormProvider] Initializing with:', { initialData, totalSteps });

  const [state, setState] = useState<FormState>({
    currentStep: 1,
    formData: initialData,
    isLoading: false,
    hasUnsavedChanges: false,
  });

  useEffect(() => {
    console.log('[FormProvider] State updated:', {
      currentStep: state.currentStep,
      totalSteps,
      hasUnsavedChanges: state.hasUnsavedChanges,
      isLoading: state.isLoading,
      formDataKeys: Object.keys(state.formData)
    });
  }, [state, totalSteps]);

  const setCurrentStep = useCallback((step: number) => {
    console.log('[FormProvider] Setting step:', {
      currentStep: step,
      previousStep: state.currentStep
    });
    setState(prev => {
      const newState = { ...prev, currentStep: step };
      console.log('[FormProvider] New state after setCurrentStep:', newState);
      return newState;
    });
  }, []);

  const updateFormData = useCallback(async (sectionId: string, data: any) => {
    console.log('[FormProvider] Updating form data:', { sectionId, data });
    setState(prev => {
      const newState = {
        ...prev,
        formData: { ...prev.formData, [sectionId]: data },
        hasUnsavedChanges: true,
      };
      console.log('[FormProvider] New state after updateFormData:', newState);
      return newState;
    });

    if (onSave) {
      setState(prev => ({ ...prev, isLoading: true }));
      try {
        await onSave({ ...state.formData, [sectionId]: data });
        setState(prev => ({ ...prev, hasUnsavedChanges: false }));
      } catch (error) {
        console.error('[FormProvider] Error saving form data:', error);
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    }
  }, [onSave, state.formData]);

  const setIsLoading = useCallback((loading: boolean) => {
    console.log('[FormProvider] Setting loading:', loading);
    setState(prev => {
      const newState = { ...prev, isLoading: loading };
      console.log('[FormProvider] New state after setIsLoading:', newState);
      return newState;
    });
  }, []);

  const goToNextStep = useCallback(() => {
    setState(prev => {
      const nextStep = prev.currentStep + 1;
      if (nextStep <= totalSteps) {
        console.log('[FormProvider] Moving to next step:', {
          from: prev.currentStep,
          to: nextStep,
          totalSteps
        });
        return {
          ...prev,
          currentStep: nextStep,
        };
      }
      console.log('[FormProvider] Already at last step');
      return prev;
    });
  }, [totalSteps]);

  const goToPreviousStep = useCallback(() => {
    console.log('[FormProvider] Going to previous step:', {
      currentStep: state.currentStep
    });
    setState(prev => {
      if (prev.currentStep > 1) {
        const prevStep = prev.currentStep - 1;
        console.log('[FormProvider] Moving to step:', prevStep);
        const newState = {
          ...prev,
          currentStep: prevStep,
        };
        console.log('[FormProvider] New state after goToPreviousStep:', newState);
        return newState;
      }
      console.log('[FormProvider] Already at first step, no update needed');
      return prev;
    });
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

  console.log('[FormProvider] Rendering with context value:', {
    currentStep: value.currentStep,
    totalSteps: value.totalSteps,
    hasHandlers: {
      goToNextStep: !!value.goToNextStep,
      goToPreviousStep: !!value.goToPreviousStep
    }
  });

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
}

export function useForm() {
  const context = useContext(FormContext);
  if (!context) {
    console.error('[useForm] Form context is null - this component must be used within a FormProvider');
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
} 