import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vuiyyzrpvvnflgqaofhm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1aXl5enJwdnZuZmxncWFvZmhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0NDYyODYsImV4cCI6MjA0OTAyMjI4Nn0.xMMecnAW_Q7vd2J-IKyVOfgzGaRkM0mmB0S-6rlHUf8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDatabase() {
  console.log('Checking questions table...')
  
  const { data: questions, error: questionsError } = await supabase
    .from('questions')
    .select('*')
    .eq('is_active', true)
  
  if (questionsError) {
    console.error('Error fetching questions:', questionsError)
    return
  }
  
  console.log('Found questions:', questions)
}

checkDatabase() 