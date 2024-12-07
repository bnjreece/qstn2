import { json, redirect } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { requireUserId } from '~/utils/auth.server';
import { supabase } from '~/utils/supabase.server';
import type { Question } from '~/utils/questions.server';

interface LoaderData {
  questions: Question[];
  currentStep: number;
  totalSteps: number;
  currentAnswer: string | null;
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
    return json({ questions: [], currentStep: 1, totalSteps: 0, currentAnswer: null });
  }

  // Validate step parameter
  if (currentStep < 1 || currentStep > questions.length) {
    return redirect('?step=1');
  }

  // Get the current question's answer if it exists
  const currentQuestion = questions[currentStep - 1];
  const { data: answer } = await supabase
    .from('answers')
    .select('answer')
    .eq('user_id', userId)
    .eq('question_id', currentQuestion.id)
    .maybeSingle();

  return json<LoaderData>({
    questions,
    currentStep,
    totalSteps: questions.length,
    currentAnswer: answer?.answer || null
  });
}

export async function action({ request }: { request: Request }) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const questionId = formData.get('questionId');
  const answer = formData.get('answer');
  const step = formData.get('step');
  const complete = formData.get('complete') === 'true';
  const previous = formData.get('previous') === 'true';

  console.log('[PersonalPlan Action] Starting', {
    questionId,
    step,
    complete,
    previous,
    formData: Object.fromEntries(formData),
    url: request.url
  });

  if (!questionId || !step) {
    throw new Error('Missing required fields');
  }

  // Save the answer
  const { data: existingAnswer } = await supabase
    .from('answers')
    .select('id')
    .eq('user_id', userId)
    .eq('question_id', questionId)
    .maybeSingle();

  if (existingAnswer) {
    await supabase
      .from('answers')
      .update({
        answer: answer as string || '',
        updated_at: new Date().toISOString()
      })
      .eq('id', existingAnswer.id);
  } else {
    await supabase
      .from('answers')
      .insert({
        user_id: userId,
        question_id: questionId as string,
        answer: answer as string || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
  }

  // If this is the last step and we're completing, go to summary
  if (complete) {
    console.log('[PersonalPlan Action] Redirecting to summary');
    return redirect('/app/personal-plan/summary');
  }

  // Otherwise, go to the next or previous step
  const currentStep = parseInt(step.toString());
  const nextStep = previous ? currentStep - 1 : currentStep + 1;
  console.log('[PersonalPlan Action] Redirecting to step', nextStep);
  return redirect(`/app/personal-plan?step=${nextStep}`);
}

export default function PersonalPlanQuestions() {
  const { questions, currentStep, totalSteps, currentAnswer } = useLoaderData<typeof loader>();

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-ui-light flex items-center justify-center">
        <div className="text-dark/70">No questions found. Please make sure questions are seeded in the database.</div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep - 1];

  return (
    <Form method="post" className="space-y-8">
      <input type="hidden" name="_action" value="saveAnswer" />
      <input type="hidden" name="questionId" value={currentQuestion.id} />
      <input type="hidden" name="step" value={currentStep} />
      {currentStep === totalSteps && (
        <input type="hidden" name="complete" value="true" />
      )}

      <div className="space-y-12">
        {/* Progress indicator */}
        <div className="progress-bar">
          <div 
            className="progress-bar-fill"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl text-primary font-medium">{currentStep}</span>
          <span className="text-dark/60">of</span>
          <span className="text-tertiary">{totalSteps}</span>
        </div>

        {/* Question */}
        <div>
          <h2 className="heading-1 border-b border-primary/10 pb-2">{currentQuestion.title}</h2>
          {currentQuestion.description && (
            <p className="mt-4 text-xl text-body">{currentQuestion.description}</p>
          )}
        </div>

        {/* Answer input */}
        <div className="py-8">
          <textarea
            name="answer"
            defaultValue={currentAnswer || ''}
            className="input text-2xl resize-none"
            placeholder="Click here and start typing..."
            rows={3}
            autoFocus
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between gap-4 pt-4">
          <button
            type="submit"
            name="previous"
            value="true"
            disabled={currentStep === 1}
            className="btn btn-secondary disabled:opacity-50 disabled:hover:bg-transparent"
          >
            Previous
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            {currentStep === totalSteps ? 'Complete' : 'Next'}
          </button>
        </div>

        {/* Tips */}
        {currentQuestion.tips && currentQuestion.tips.length > 0 && (
          <div className="card p-6 border-l-4 border-tertiary">
            <h3 className="heading-2 text-sm mb-3 flex items-center gap-2">
              <span className="text-tertiary text-lg">💡</span>
              Tips
            </h3>
            <ul className="space-y-2">
              {currentQuestion.tips.map((tip, index) => (
                <li key={index} className="flex items-start text-body">
                  <span className="mr-2 text-secondary">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Form>
  );
} 