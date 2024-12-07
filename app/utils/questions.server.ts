import { supabase } from "./supabase.server";

export interface Question {
  id: string;
  title: string;
  description: string | null;
  tips: string[];
  type: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuestionDependency {
  id: string;
  question_id: string;
  dependent_on_question_id: string;
  condition: Record<string, unknown>;
  created_at: string;
}

/**
 * Fetch all active questions ordered by their index
 */
export async function getActiveQuestions() {
  const { data: questions, error } = await supabase
    .from('questions')
    .select('*')
    .eq('is_active', true)
    .order('order_index');

  if (error) {
    console.error('Error fetching questions:', error);
    throw new Error('Failed to fetch questions');
  }

  return questions as Question[];
}

/**
 * Fetch a specific question by ID, including its dependencies
 */
export async function getQuestionWithDependencies(questionId: string) {
  const { data: question, error: questionError } = await supabase
    .from('questions')
    .select('*')
    .eq('id', questionId)
    .single();

  if (questionError) {
    console.error('Error fetching question:', questionError);
    throw new Error('Failed to fetch question');
  }

  const { data: dependencies, error: dependencyError } = await supabase
    .from('question_dependencies')
    .select('*')
    .eq('question_id', questionId);

  if (dependencyError) {
    console.error('Error fetching dependencies:', dependencyError);
    throw new Error('Failed to fetch question dependencies');
  }

  return {
    ...question,
    dependencies: dependencies || []
  } as Question & { dependencies: QuestionDependency[] };
}

/**
 * Get the next question based on current answers and dependencies
 */
export async function getNextQuestion(currentQuestionId: string, answers: Record<string, unknown>) {
  // First, get all questions to determine order
  const questions = await getActiveQuestions();
  const currentIndex = questions.findIndex(q => q.id === currentQuestionId);
  
  if (currentIndex === -1) {
    throw new Error('Current question not found');
  }

  // Get the next question in order
  const nextQuestion = questions[currentIndex + 1];
  if (!nextQuestion) {
    return null; // No more questions
  }

  // Check if the next question has dependencies
  const { data: dependencies, error } = await supabase
    .from('question_dependencies')
    .select('*')
    .eq('question_id', nextQuestion.id);

  if (error) {
    console.error('Error fetching dependencies:', error);
    throw new Error('Failed to fetch question dependencies');
  }

  // If there are no dependencies, return the next question
  if (!dependencies || dependencies.length === 0) {
    return nextQuestion;
  }

  // Check if all dependencies are satisfied
  const areDependenciesSatisfied = dependencies.every(dep => {
    const condition = dep.condition as Record<string, unknown>;
    const answer = answers[dep.dependent_on_question_id];
    
    // Simple equality check for now - can be expanded for more complex conditions
    return answer === condition.value;
  });

  return areDependenciesSatisfied ? nextQuestion : null;
} 