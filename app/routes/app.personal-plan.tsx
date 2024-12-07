import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState, type MouseEvent } from 'react';
import { requireUserId } from '~/utils/auth.server';
import { supabase } from '~/utils/supabase.server';
import { getActiveQuestions, type Question } from '~/utils/questions.server';

interface LoaderData {
  document: {
    id: string;
    title: string;
  } | null;
  questions: Question[];
}

export async function loader({ request }: { request: Request }) {
  const userId = await requireUserId(request);
  
  // Fetch questions
  const questions = await getActiveQuestions();
  
  // Fetch existing document or create a new one
  const { data: document } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!document) {
    const { data: newDocument } = await supabase
      .from('documents')
      .insert([{ user_id: userId, title: 'Personal Plan' }])
      .select()
      .single();

    return json<LoaderData>({ 
      document: newDocument,
      questions
    });
  }

  return json<LoaderData>({ document, questions });
}

export default function PersonalPlan() {
  const { questions } = useLoaderData<typeof loader>();
  const [currentStep, setCurrentStep] = useState(0);
  const step = questions[currentStep];
  const [answers, setAnswers] = useState<Record<string, string>>(
    Object.fromEntries(questions.map(q => [q.id, '']))
  );

  const handleNext = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('Next clicked');
    console.log('Current step:', currentStep);
    console.log('Questions length:', questions.length);
    
    if (currentStep < questions.length - 1) {
      const nextStep = currentStep + 1;
      console.log('Setting step to:', nextStep);
      setCurrentStep(nextStep);
    }
  };

  const handlePrevious = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('Previous clicked');
    console.log('Current step:', currentStep);
    
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      console.log('Setting step to:', prevStep);
      setCurrentStep(prevStep);
    }
  };

  // Log current state for debugging
  console.log('Rendering with:', {
    currentStep,
    questionsLength: questions.length,
    currentQuestion: step?.title,
    answers
  });

  // If no questions are loaded yet, show loading state
  if (!step) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading questions...</div>
      </div>
    );
  }

  return (
    <form className="min-h-screen bg-white" onSubmit={(e) => e.preventDefault()}>
      {/* Progress bar */}
      <div className="max-w-3xl mx-auto px-8 pt-8">
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          />
        </div>
        <div className="mt-2 text-sm font-light text-gray-500">
          Step {currentStep + 1} of {questions.length}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-8 py-12">
        <h1 className="text-4xl font-light text-gray-900 mb-4">
          {step.title}
        </h1>
        <p className="text-xl font-light text-gray-600 mb-8">
          {step.description}
        </p>
        <div className="space-y-8">
          <textarea
            className="w-full bg-transparent text-2xl font-light border-b-2 border-gray-200 p-0 pb-2 resize-none focus:outline-none focus:ring-0 focus:border-indigo-600"
            placeholder="Click here and start typing..."
            rows={3}
            value={answers[step.id]}
            onChange={(e) => {
              setAnswers(prev => ({
                ...prev,
                [step.id]: e.target.value
              }));
            }}
            autoFocus
          />
          {step.tips && step.tips.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Tips</h3>
              <ul className="space-y-2">
                {step.tips.map((tip, index) => (
                  <li key={index} className="flex items-start text-gray-600">
                    <span className="mr-2">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-12 flex justify-between gap-4">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-6 py-3 text-base font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={currentStep === questions.length - 1}
            className="px-6 py-3 text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {currentStep === questions.length - 1 ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    </form>
  );
} 