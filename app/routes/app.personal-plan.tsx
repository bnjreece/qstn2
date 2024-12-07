import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { FormProvider, useForm } from '~/components/form/FormContext';
import { FormContainer } from '~/components/form/FormContainer';
import { FormSection } from '~/components/form/FormSection';
import { requireUserId } from '~/utils/auth.server';
import { supabase } from '~/utils/supabase.server';
import { getActiveQuestions, type Question } from '~/utils/questions.server';
import { useCallback, useEffect, useRef, useState } from 'react';

// Extend Window interface to include our test functions
declare global {
  interface Window {
    testJS?: {
      log: (message: string) => void;
      alert: (message: string) => void;
      click: (element: string) => void;
    };
  }
}

function TestComponent() {
  const [count, setCount] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('[TestComponent] Mounted, count:', count);
    
    // Test vanilla JS click handler
    const button = buttonRef.current;
    if (button) {
      const handler = () => {
        console.log('[TestComponent] Native button clicked');
        setCount(c => c + 1);
      };
      button.addEventListener('click', handler);
      return () => button.removeEventListener('click', handler);
    }
  }, [count]);

  const handleClick = useCallback(() => {
    console.log('[TestComponent] React click handler');
    setCount(c => c + 1);
    window.testJS?.log('React button clicked');
    window.testJS?.alert('Count: ' + (count + 1));
  }, [count]);

  return (
    <div className="fixed top-4 right-4 flex flex-col gap-2 z-50 p-4 bg-white shadow-lg rounded">
      <div className="text-lg font-bold">Test Component</div>
      <div className="text-sm text-gray-600">Count: {count}</div>
      
      {/* React event handler */}
      <button
        type="button"
        onClick={handleClick}
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
      >
        React Click Test
      </button>
      
      {/* Native event handler */}
      <button
        ref={buttonRef}
        type="button"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Native Click Test
      </button>
      
      {/* Test div */}
      <div
        ref={divRef}
        className="px-4 py-2 bg-gray-500 text-white rounded cursor-pointer text-center"
        onClick={() => {
          console.log('[TestComponent] Div clicked');
          window.testJS?.click('test div');
        }}
      >
        Click Test Div
      </div>
    </div>
  );
}

interface LoaderData {
  questions: Question[];
}

export async function loader({ request }: { request: Request }) {
  try {
    console.log('[PersonalPlan Loader] Starting loader execution');
    const userId = await requireUserId(request);
    console.log('[PersonalPlan Loader] User ID:', userId);
    
    // Test Supabase connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('questions')
      .select('count');
    
    if (connectionError) {
      console.error('[PersonalPlan Loader] Database connection error:', connectionError);
      throw new Error('Failed to connect to database');
    }
    
    console.log('[PersonalPlan Loader] Database connection successful:', connectionTest);
    
    // Fetch questions with detailed error logging
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .eq('is_active', true)
      .order('order_index');

    if (questionsError) {
      console.error('[PersonalPlan Loader] Error fetching questions:', questionsError);
      throw new Error('Failed to fetch questions');
    }

    if (!questions || questions.length === 0) {
      console.log('[PersonalPlan Loader] No questions found in database');
    } else {
      console.log('[PersonalPlan Loader] Successfully fetched questions:', {
        count: questions.length,
        questions: questions.map(q => ({ id: q.id, title: q.title }))
      });
    }

    return json<LoaderData>({ 
      questions: questions || []
    });
  } catch (error) {
    console.error('[PersonalPlan Loader] Error:', error);
    throw error;
  }
}

function QuestionStep({ question }: { question: Question }) {
  console.log('[QuestionStep] Rendering question:', {
    id: question.id,
    title: question.title
  });

  const { formData } = useForm();
  console.log('[QuestionStep] Current form data:', formData);

  return (
    <FormSection
      title={question.title}
      description={question.description || ''}
      sectionId={question.id}
      tips={question.tips}
    >
      {({ value, onChange }) => {
        console.log('[QuestionStep] Render props:', {
          questionId: question.id,
          currentValue: value
        });

        const handleChange = (newValue: string) => {
          console.log('[QuestionStep] Value changing:', {
            questionId: question.id,
            oldValue: value,
            newValue
          });
          onChange(newValue);
        };

        return (
          <textarea
            className="w-full bg-transparent text-2xl font-light border-b-2 border-gray-200 p-0 pb-2 resize-none focus:outline-none focus:ring-0 focus:border-indigo-600"
            placeholder="Click here and start typing..."
            rows={3}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            autoFocus
          />
        );
      }}
    </FormSection>
  );
}

export default function PersonalPlan() {
  const { questions } = useLoaderData<typeof loader>();
  console.log('[PersonalPlan] Rendering with questions:', questions?.length);

  const handleSave = useCallback(async (data: Record<string, any>) => {
    console.log('[PersonalPlan] Saving form data:', data);
    // TODO: Implement save functionality
  }, []);

  // If no questions are loaded yet, show loading state
  if (!questions || !questions.length) {
    console.log('[PersonalPlan] No questions found');
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">No questions found. Please make sure questions are seeded in the database.</div>
      </div>
    );
  }

  console.log('[PersonalPlan] Rendering form with questions:', {
    count: questions.length,
    questionIds: questions.map(q => q.id)
  });

  return (
    <div>
      <TestComponent />
      <FormProvider
        initialData={{}}
        totalSteps={questions.length}
        onSave={handleSave}
      >
        <FormContainer>
          {questions.map((question) => (
            <QuestionStep key={question.id} question={question} />
          ))}
        </FormContainer>
      </FormProvider>
    </div>
  );
} 