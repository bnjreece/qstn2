import { json, redirect } from '@remix-run/node';
import { Form, useLoaderData, useSubmit } from '@remix-run/react';
import { requireUserId } from '~/utils/auth.server';
import { supabase } from '~/utils/supabase.server';
import type { Question } from '~/utils/questions.server';
import { QuestionCategory } from "~/components/QuestionCategory";
import { useState } from 'react';

interface LoaderData {
  questions: Question[];
  currentStep: number;
  totalSteps: number;
  currentAnswer: string | null;
  planningDirection: 'top_down' | 'bottom_up';
}

export async function loader({ request }: { request: Request }) {
  const userId = await requireUserId(request);
  const url = new URL(request.url);
  const currentStep = parseInt(url.searchParams.get('step') || '1');

  // Get user's planning direction preference
  const { data: preference } = await supabase
    .from('user_preferences')
    .select('planning_direction')
    .eq('user_id', userId)
    .single();

  const planningDirection = preference?.planning_direction || 'top_down';

  // Get questions and sort based on direction
  const { data: questions, error } = await supabase
    .from('questions')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: planningDirection === 'top_down' });

  if (error) throw error;
  if (!questions?.length) {
    return json({ questions: [], currentStep: 1, totalSteps: 0, currentAnswer: null, planningDirection });
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
    currentAnswer: answer?.answer || null,
    planningDirection
  });
}

export async function action({ request }: { request: Request }) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const direction = formData.get('direction');

  // Handle direction choice submission
  if (direction) {
    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        planning_direction: direction,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) throw error;
    return redirect('?step=2'); // Start with the first actual question
  }

  // Handle regular question submissions
  const questionId = formData.get('questionId');
  const answer = formData.get('answer');
  const step = formData.get('step');
  const complete = formData.get('complete') === 'true';
  const previous = formData.get('previous') === 'true';

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
    return redirect('/app/personal-plan/summary');
  }

  // Otherwise, go to the next or previous step
  const currentStep = parseInt(step.toString());
  const nextStep = previous ? currentStep - 1 : currentStep + 1;
  return redirect(`/app/personal-plan?step=${nextStep}`);
}

export default function PersonalPlanQuestions() {
  const { questions, currentStep, totalSteps, currentAnswer, planningDirection } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-ui-light flex items-center justify-center">
        <div className="text-dark/70">No questions found. Please make sure questions are seeded in the database.</div>
      </div>
    );
  }

  // Show direction choice as first step
  if (currentStep === 1) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h2 className="heading-1 border-b border-primary/10 pb-2">Choose Your Planning Approach</h2>
          <p className="mt-3 text-lg md:text-xl text-body">Would you prefer to start with long-term aspirations and work down to weekly actions, or start with weekly actions and build up to long-term aspirations?</p>
        </div>

        <Form method="post" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="group cursor-pointer">
              <input 
                type="radio" 
                name="direction" 
                value="top_down" 
                className="sr-only peer"
              />
              <div className="relative bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border-2 border-secondary/20 p-6 hover:border-secondary hover:shadow-md transition-all duration-200 peer-checked:border-secondary">
                <h3 className="text-xl font-medium text-quaternary mb-3">Big Picture First</h3>
                <p className="text-dark/70">Start with your long-term vision and break it down into smaller steps</p>
              </div>
            </label>

            <label className="group cursor-pointer">
              <input 
                type="radio" 
                name="direction" 
                value="bottom_up" 
                className="sr-only peer"
              />
              <div className="relative bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border-2 border-secondary/20 p-6 hover:border-secondary hover:shadow-md transition-all duration-200 peer-checked:border-secondary">
                <h3 className="text-xl font-medium text-quaternary mb-3">Small Steps First</h3>
                <p className="text-dark/70">Begin with immediate actions and gradually build towards your bigger goals</p>
              </div>
            </label>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="btn btn-primary px-8"
            >
              Continue
            </button>
          </div>

          <div className="card p-4 md:p-6 border-l-4 border-tertiary">
            <h3 className="heading-2 text-sm mb-2 md:mb-3 flex items-center gap-2">
              <span className="text-tertiary text-lg">💡</span>
              Tips
            </h3>
            <ul className="space-y-1 md:space-y-2">
              <li className="flex items-start text-body">
                <span className="mr-2 text-secondary">•</span>
                <span>Starting with long-term helps set the big picture first</span>
              </li>
              <li className="flex items-start text-body">
                <span className="mr-2 text-secondary">•</span>
                <span>Starting with short-term helps build momentum with immediate actions</span>
              </li>
            </ul>
          </div>
        </Form>
      </div>
    );
  }

  const currentQuestion = questions[currentStep - 2]; // Offset by 1 since first step is direction choice
  
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-ui-light flex items-center justify-center">
        <div className="text-dark/70">Question not found. Please try refreshing the page.</div>
      </div>
    );
  }

  // Extract category and timeframe from question type
  const getTypeMapping = (type: string, title: string) => {
    // Handle foundation questions
    if (type === 'mission' || type === 'vision' || type === 'values') {
      return {
        category: type,
        timeframe: 'foundation'
      };
    }

    // Handle long term aspirations
    if (type === 'long_term_aspirations') {
      const category = title.toLowerCase().includes('relationship') ? 'relationships' :
                      title.toLowerCase().includes('achievement') ? 'achievements' :
                      title.toLowerCase().includes('ritual') ? 'rituals' :
                      'wealth_experience';
      return {
        category,
        timeframe: 'long_term'
      };
    }

    // Handle activities (one_week, ninety_day, one_year)
    const [timeframe, category] = type.split('_activities')[0].split('_');
    const mappedTimeframe = timeframe === 'ninety' ? 'ninety_day' : 
                           timeframe === 'one' ? `one_${category}` : timeframe;
    
    return {
      category: title.toLowerCase().includes('relationship') ? 'relationships' :
                title.toLowerCase().includes('achievement') ? 'achievements' :
                title.toLowerCase().includes('ritual') ? 'rituals' :
                'wealth_experience',
      timeframe: mappedTimeframe
    };
  };

  const { category, timeframe } = getTypeMapping(currentQuestion.type, currentQuestion.title);

  // Handle direction change
  const handleDirectionChange = (newDirection: 'top_down' | 'bottom_up') => {
    const formData = new FormData();
    formData.append('direction', newDirection);
    submit(formData, { method: 'post' });
  };

  return (
    <Form method="post" className="space-y-4 md:space-y-8">
      <input type="hidden" name="_action" value="saveAnswer" />
      <input type="hidden" name="questionId" value={currentQuestion.id} />
      <input type="hidden" name="step" value={currentStep} />
      {currentStep === totalSteps && (
        <input type="hidden" name="complete" value="true" />
      )}

      <div className="space-y-6 md:space-y-8">
        {/* Progress indicator */}
        <div>
          <div className="progress-bar">
            <div 
              className="progress-bar-fill"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <div className="mt-1 md:mt-2 flex items-center gap-1 md:gap-2 justify-end text-sm md:text-base">
            <span className="text-lg md:text-2xl text-primary font-medium">{currentStep}</span>
            <span className="text-dark/60">of</span>
            <span className="text-tertiary">{totalSteps}</span>
          </div>
        </div>

        {/* Category and Question */}
        <div>
          <QuestionCategory 
            category={category as any}
            timeframe={timeframe as any}
          />
          <h2 className="heading-1 border-b border-primary/10 pb-2">{currentQuestion.title}</h2>
          {currentQuestion.description && (
            <p className="mt-3 text-lg md:text-xl text-body">{currentQuestion.description}</p>
          )}
        </div>

        {/* Answer input */}
        <div className="py-4">
          <textarea
            name="answer"
            defaultValue={currentAnswer || ''}
            className="input text-xl md:text-2xl w-full !min-h-[240px]"
            placeholder="Click here and start typing..."
            rows={8}
            autoFocus
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
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
          <div className="card p-4 md:p-6 border-l-4 border-tertiary">
            <h3 className="heading-2 text-sm mb-2 md:mb-3 flex items-center gap-2">
              <span className="text-tertiary text-lg">💡</span>
              Tips
            </h3>
            <ul className="space-y-1 md:space-y-2">
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