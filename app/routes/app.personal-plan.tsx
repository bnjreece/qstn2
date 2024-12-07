import { json, redirect } from '@remix-run/node';
import { Form, useLoaderData, useSearchParams, useSubmit, useActionData } from '@remix-run/react';
import { requireUserId } from '~/utils/auth.server';
import { supabase } from '~/utils/supabase.server';
import { getActiveQuestions, type Question } from '~/utils/questions.server';

interface LoaderData {
  questions: Question[];
  currentStep: number;
  totalSteps: number;
}

export async function loader({ request }: { request: Request }) {
  const userId = await requireUserId(request);
  const url = new URL(request.url);
  const currentStep = parseInt(url.searchParams.get('step') || '1');

  const { data: questions, error } = await supabase
    .from('questions')
    .select('*')
    .eq('is_active', true)
    .order('order_index');

  if (error) throw error;
  if (!questions?.length) {
    return json({ questions: [], currentStep: 1, totalSteps: 0 });
  }

  // Validate step parameter
  if (currentStep < 1 || currentStep > questions.length) {
    return redirect('/app/personal-plan?step=1');
  }

  return json<LoaderData>({
    questions,
    currentStep,
    totalSteps: questions.length
  });
}

export async function action({ request }: { request: Request }) {
  try {
    const userId = await requireUserId(request);
    console.log('[PersonalPlan Action] User ID from session:', userId);

    const formData = await request.formData();
    const formEntries = Object.fromEntries(formData);
    console.log('[PersonalPlan Action] Form data received:', formEntries);

    const { _action, questionId, answer, step } = formEntries;

    if (!_action || !questionId || !step) {
      console.error('[PersonalPlan Action] Missing required fields:', { _action, questionId, step });
      throw new Error('Missing required fields');
    }

    if (_action === 'saveAnswer') {
      // Log the exact data we're using for the query
      console.log('[PersonalPlan Action] Query parameters:', {
        userId,
        questionId,
        answer: answer || '',
        step,
        userIdType: typeof userId,
        questionIdType: typeof questionId
      });

      // First check if the answer exists
      const { data: existingAnswer, error: checkError } = await supabase
        .from('answers')
        .select('id')
        .eq('user_id', userId)
        .eq('question_id', questionId)
        .maybeSingle();

      if (checkError) {
        console.error('[PersonalPlan Action] Error checking for existing answer:', {
          error: checkError,
          userId,
          questionId
        });
        throw new Error(`Database error: ${checkError.message}`);
      }

      let saveResult;
      if (existingAnswer) {
        // Update existing answer
        console.log('[PersonalPlan Action] Updating existing answer:', {
          id: existingAnswer.id,
          userId,
          questionId
        });
        saveResult = await supabase
          .from('answers')
          .update({
            answer: (answer as string) || '',
            updated_at: new Date().toISOString()
          })
          .eq('id', existingAnswer.id)
          .select()
          .single();
      } else {
        // Insert new answer
        console.log('[PersonalPlan Action] Creating new answer:', {
          userId,
          questionId,
          answerLength: (answer as string)?.length || 0
        });
        saveResult = await supabase
          .from('answers')
          .insert({
            user_id: userId,
            question_id: questionId as string,
            answer: (answer as string) || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
      }

      if (saveResult.error) {
        console.error('[PersonalPlan Action] Error saving answer:', {
          code: saveResult.error.code,
          message: saveResult.error.message,
          details: saveResult.error.details,
          userId,
          questionId
        });
        throw new Error(`Failed to save answer: ${saveResult.error.message}`);
      }

      console.log('[PersonalPlan Action] Answer saved successfully:', saveResult.data);
    }

    const nextStep = parseInt(step.toString()) + 1;
    console.log('[PersonalPlan Action] Redirecting to step:', nextStep);
    return redirect(`/app/personal-plan?step=${nextStep}`);
  } catch (error: unknown) {
    console.error('[PersonalPlan Action] Error:', {
      name: error instanceof Error ? error.name : 'Unknown error',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });

    return json(
      { 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
}

function QuestionView({ question, currentStep, totalSteps }: { 
  question: Question; 
  currentStep: number;
  totalSteps: number;
}) {
  const submit = useSubmit();
  const actionData = useActionData<{ error?: string }>();

  const handleNext = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    submit(form, { replace: true });
  };

  return (
    <Form method="post" onSubmit={handleNext} className="space-y-8">
      <input type="hidden" name="_action" value="saveAnswer" />
      <input type="hidden" name="questionId" value={question.id} />
      <input type="hidden" name="step" value={currentStep} />

      <div className="space-y-12">
        {/* Error message */}
        {actionData?.error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {actionData.error}
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* Progress indicator */}
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <div className="text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </div>

        {/* Question */}
        <div>
          <h2 className="text-4xl font-light text-gray-900">{question.title}</h2>
          {question.description && (
            <p className="mt-4 text-xl font-light text-gray-600">{question.description}</p>
          )}
        </div>

        {/* Answer input */}
        <div className="py-8">
          <textarea
            name="answer"
            className="w-full bg-transparent text-2xl font-light border-b-2 border-gray-200 p-0 pb-2 resize-none focus:outline-none focus:ring-0 focus:border-indigo-600"
            placeholder="Click here and start typing..."
            rows={3}
            autoFocus
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <Form action="?index" className="contents">
            <button
              type="submit"
              name="step"
              value={currentStep - 1}
              disabled={currentStep === 1}
              className="px-6 py-3 text-base font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Previous
            </button>
          </Form>
          <button
            type="submit"
            className="px-6 py-3 text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {currentStep === totalSteps ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    </Form>
  );
}

export default function PersonalPlan() {
  const { questions, currentStep, totalSteps } = useLoaderData<typeof loader>();
  const currentQuestion = questions[currentStep - 1];

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">No questions found. Please make sure questions are seeded in the database.</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full max-w-3xl mx-auto px-8 py-12">
      <QuestionView 
        question={currentQuestion} 
        currentStep={currentStep}
        totalSteps={totalSteps}
      />
    </div>
  );
} 