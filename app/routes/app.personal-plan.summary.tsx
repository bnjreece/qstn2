import { json } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import { requireUserId } from '~/utils/auth.server';
import { supabase } from '~/utils/supabase.server';
import type { Question } from '~/utils/questions.server';
import type { ReactNode } from 'react';

export async function loader({ request }: { request: Request }) {
  const userId = await requireUserId(request);

  // Get all questions
  const { data: questions, error: questionsError } = await supabase
    .from('questions')
    .select('*')
    .eq('is_active', true)
    .order('order_index');

  if (questionsError) throw questionsError;

  // Get all answers for this user
  const { data: answers, error: answersError } = await supabase
    .from('answers')
    .select('*')
    .eq('user_id', userId);

  if (answersError) throw answersError;

  // Organize questions and answers by section
  const sections = [
    {
      title: 'Foundation',
      types: ['mission', 'vision', 'values']
    },
    {
      title: '10-25 Year Aspirations',
      types: ['long_term_aspirations']
    },
    {
      title: '1 Year Activities',
      types: ['one_year_activities']
    },
    {
      title: '90 Day Activities (START)',
      types: ['ninety_day_start']
    },
    {
      title: '90 Day Activities (STOP)',
      types: ['ninety_day_stop']
    }
  ].map(section => ({
    title: section.title,
    questions: questions
      .filter(q => section.types.includes(q.type))
      .map(question => ({
        question,
        answer: answers?.find(a => a.question_id === question.id)?.answer || null
      }))
  }));

  return json({ sections });
}

export default function PersonalPlanSummary(): ReactNode {
  const { sections } = useLoaderData<typeof loader>();

  return (
    <>
      <h1 className="text-4xl font-light text-gray-900 mb-8">Your Personal Plan Summary</h1>
      
      <div className="space-y-16">
        {sections.map((section) => (
          <div key={section.title} className="space-y-8">
            <h2 className="text-3xl font-light text-gray-800">{section.title}</h2>
            
            <div className="space-y-8">
              {section.questions.map(({ question, answer }) => (
                <div key={question.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-medium text-gray-900">{question.title}</h3>
                    {question.description && (
                      <p className="mt-1 text-gray-600">{question.description}</p>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded p-4">
                    {answer ? (
                      <div className="whitespace-pre-wrap text-gray-800">{answer}</div>
                    ) : (
                      <div className="text-gray-400 italic">No answer provided</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-end">
        <Link
          to=".."
          className="px-6 py-3 text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Edit Your Plan
        </Link>
      </div>
    </>
  );
} 