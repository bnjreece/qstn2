import { json } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import { requireUserId } from '~/utils/auth.server';
import { supabase } from '~/utils/supabase.server';
import type { Question } from '~/utils/questions.server';
import type { ReactNode } from 'react';
import { QuestionCategory } from "~/components/QuestionCategory";

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
      title: '90 Day Activities',
      types: ['ninety_day_activities']
    },
    {
      title: '1 Week Activities',
      types: ['one_week_activities']
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

  // Helper function to get category and timeframe
  const getTypeMapping = (type: string, title: string) => {
    if (type === 'mission' || type === 'vision' || type === 'values') {
      return {
        category: type,
        timeframe: 'foundation'
      };
    }

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

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-light text-primary mb-8 border-b-2 border-primary/20 pb-4">Your Personal Plan Summary</h1>
      
      <div className="space-y-16">
        {sections.map((section) => (
          <div key={section.title} className="space-y-8">
            <h2 className="text-3xl font-light text-tertiary">{section.title}</h2>
            
            <div className="space-y-8">
              {section.questions.map(({ question, answer }) => {
                const { category, timeframe } = getTypeMapping(question.type, question.title);
                return (
                  <div key={question.id} className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border-l-4 border-secondary p-6 space-y-4 hover:shadow-md transition-shadow duration-200">
                    <div>
                      <QuestionCategory 
                        category={category as any}
                        timeframe={timeframe as any}
                      />
                      <h3 className="text-xl font-medium text-quaternary mt-3">{question.title}</h3>
                      {question.description && (
                        <p className="mt-1 text-dark/70">{question.description}</p>
                      )}
                    </div>

                    <div className="bg-ui-light/80 rounded p-4 border border-secondary/10">
                      {answer ? (
                        <div className="whitespace-pre-wrap text-dark break-words">{answer}</div>
                      ) : (
                        <div className="text-dark/40 italic">No answer provided</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-end">
        <Link
          to=".."
          className="px-6 py-3 text-base font-medium rounded-md text-white bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-tertiary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent shadow-sm hover:shadow-md"
        >
          Edit Your Plan
        </Link>
      </div>
    </div>
  );
} 