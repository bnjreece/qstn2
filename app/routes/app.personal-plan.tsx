import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { FormProvider } from '~/components/form/FormContext';
import { FormContainer } from '~/components/form/FormContainer';
import { FormSection } from '~/components/form/FormSection';
import { requireUserId } from '~/utils/auth.server';
import { supabase } from '~/utils/supabase.server';
import { getActiveQuestions, type Question } from '~/utils/questions.server';

interface LoaderData {
  questions: Question[];
}

export async function loader({ request }: { request: Request }) {
  try {
    console.log('Starting loader execution');
    const userId = await requireUserId(request);
    console.log('User ID:', userId);
    
    // Fetch questions directly to debug
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .eq('is_active', true)
      .order('order_index');

    if (questionsError) {
      console.error('Error fetching questions:', questionsError);
      throw new Error('Failed to fetch questions');
    }

    console.log('Fetched questions:', questions);

    return json<LoaderData>({ 
      questions: questions || []
    });
  } catch (error) {
    console.error('Loader error:', error);
    throw error;
  }
}

function QuestionStep({ question }: { question: Question }) {
  console.log('Rendering QuestionStep for question:', question);
  return (
    <FormSection
      title={question.title}
      description={question.description || ''}
      sectionId={question.id}
      tips={question.tips}
    >
      {({ value, onChange }) => {
        console.log('QuestionStep render props - value:', value);
        return (
          <textarea
            className="w-full bg-transparent text-2xl font-light border-b-2 border-gray-200 p-0 pb-2 resize-none focus:outline-none focus:ring-0 focus:border-indigo-600"
            placeholder="Click here and start typing..."
            rows={3}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            autoFocus
          />
        );
      }}
    </FormSection>
  );
}

export default function PersonalPlan() {
  const { questions } = useLoaderData<typeof loader>();

  console.log('PersonalPlan rendered with questions:', questions);

  const handleSave = async (data: Record<string, any>) => {
    console.log('Saving data:', data);
    // TODO: Implement save functionality after fixing RLS policies
  };

  // If no questions are loaded yet, show loading state
  if (!questions || !questions.length) {
    console.log('No questions loaded, showing loading state');
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">No questions found. Please make sure questions are seeded in the database.</div>
      </div>
    );
  }

  console.log('Initializing FormProvider with totalSteps:', questions.length);
  return (
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
  );
} 