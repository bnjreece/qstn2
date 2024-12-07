import { supabase } from "./supabase.server";

export type QuestionType = 
  | 'mission'
  | 'vision'
  | 'values'
  | 'long_term_aspirations'
  | 'one_year_activities'
  | 'ninety_day_start'
  | 'ninety_day_stop';

export interface Question {
  id: string;
  title: string;
  description: string | null;
  tips: string[];
  type: QuestionType;
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
    console.error('[QuestionUtils] Error fetching questions:', error);
    throw new Error('Failed to fetch questions');
  }

  return questions as Question[];
}

/**
 * Fetch questions by type
 */
export async function getQuestionsByType(type: QuestionType) {
  const { data: questions, error } = await supabase
    .from('questions')
    .select('*')
    .eq('type', type)
    .eq('is_active', true)
    .order('order_index');

  if (error) {
    console.error(`[QuestionUtils] Error fetching ${type} questions:`, error);
    throw new Error(`Failed to fetch ${type} questions`);
  }

  return questions as Question[];
}

/**
 * Fetch basic questions (mission, vision, values)
 */
export async function getBasicQuestions() {
  const { data: questions, error } = await supabase
    .from('questions')
    .select('*')
    .in('type', ['mission', 'vision', 'values'])
    .eq('is_active', true)
    .order('order_index');

  if (error) {
    console.error('[QuestionUtils] Error fetching basic questions:', error);
    throw new Error('Failed to fetch basic questions');
  }

  return questions as Question[];
}

/**
 * Fetch questions by timeframe (10-25yr, 1yr, 90day)
 */
export async function getQuestionsByTimeframe(timeframe: 'long_term_aspirations' | 'one_year_activities' | 'ninety_day_start' | 'ninety_day_stop') {
  const { data: questions, error } = await supabase
    .from('questions')
    .select('*')
    .eq('type', timeframe)
    .eq('is_active', true)
    .order('order_index');

  if (error) {
    console.error(`[QuestionUtils] Error fetching ${timeframe} questions:`, error);
    throw new Error(`Failed to fetch ${timeframe} questions`);
  }

  return questions as Question[];
}

/**
 * Get a specific question and its dependencies
 */
export async function getQuestionWithDependencies(questionId: string) {
  const { data: question, error: questionError } = await supabase
    .from('questions')
    .select('*')
    .eq('id', questionId)
    .single();

  if (questionError) {
    console.error('[QuestionUtils] Error fetching question:', questionError);
    throw new Error('Failed to fetch question');
  }

  const { data: dependencies, error: dependencyError } = await supabase
    .from('question_dependencies')
    .select('*')
    .eq('question_id', questionId);

  if (dependencyError) {
    console.error('[QuestionUtils] Error fetching dependencies:', dependencyError);
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
    console.error('[QuestionUtils] Current question not found:', currentQuestionId);
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
    console.error('[QuestionUtils] Error fetching dependencies:', error);
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

  if (!areDependenciesSatisfied) {
    console.log('[QuestionUtils] Dependencies not satisfied for question:', nextQuestion.id);
  }

  return areDependenciesSatisfied ? nextQuestion : null;
}

/**
 * Get all answers for a user
 */
export async function getUserAnswers(userId: string) {
  const { data: answers, error } = await supabase
    .from('answers')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('[QuestionUtils] Error fetching user answers:', error);
    throw new Error('Failed to fetch user answers');
  }

  return answers;
}

/**
 * Save an answer for a question
 */
export async function saveAnswer(userId: string, questionId: string, answer: string) {
  const { data, error } = await supabase
    .from('answers')
    .upsert({
      user_id: userId,
      question_id: questionId,
      answer,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('[QuestionUtils] Error saving answer:', error);
    throw new Error('Failed to save answer');
  }

  return data;
} 