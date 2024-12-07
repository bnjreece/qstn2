import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { Button } from '~/components/ui/Button';
import { requireUserId } from '~/utils/auth.server';
import { supabase } from '~/utils/supabase.server';

interface Step {
  title: string;
  description: string;
  tips: string[];
}

const STEPS: Step[] = [
  {
    title: "What is your personal mission?",
    description: "Define your purpose in life and what you want to contribute to the world.",
    tips: [
      "Think about what truly motivates you",
      "Consider how you want to impact others",
      "Focus on the 'why' behind your actions",
    ],
  },
  {
    title: "What is your personal vision?",
    description: "Envision your ideal future self and what you want to become.",
    tips: [
      "Imagine yourself 5-10 years from now",
      "Be bold and ambitious",
      "Include both personal and professional aspects",
    ],
  },
  {
    title: "What are your core values?",
    description: "Define the principles that guide your decisions and actions.",
    tips: [
      "Choose values that truly resonate with you",
      "Think about what you stand for",
      "Consider what principles guide your decisions",
    ],
  },
];

export async function loader({ request }: { request: Request }) {
  const userId = await requireUserId(request);
  
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

    return json({ document: newDocument });
  }

  return json({ document });
}

export default function PersonalPlan() {
  const [currentStep, setCurrentStep] = useState(0);
  const step = STEPS[currentStep];
  const [answers, setAnswers] = useState<string[]>(Array(STEPS.length).fill(''));

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Progress bar */}
      <div className="max-w-3xl mx-auto px-8 pt-8">
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <div className="mt-2 text-sm font-light text-gray-500">
          Step {currentStep + 1} of {STEPS.length}
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
            value={answers[currentStep]}
            onChange={(e) => {
              const newAnswers = [...answers];
              newAnswers[currentStep] = e.target.value;
              setAnswers(newAnswers);
            }}
            autoFocus
          />
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
        </div>

        {/* Navigation */}
        <div className="mt-12 flex justify-between gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            variant="secondary"
            size="lg"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentStep === STEPS.length - 1}
            size="lg"
          >
            {currentStep === STEPS.length - 1 ? 'Complete' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
} 