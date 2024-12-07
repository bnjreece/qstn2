-- Drop the table if it exists (only in development)
DROP TABLE IF EXISTS answers;

-- Create answers table
CREATE TABLE answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    answer TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, question_id)
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_answers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_answers_updated_at
    BEFORE UPDATE ON answers
    FOR EACH ROW
    EXECUTE FUNCTION update_answers_updated_at();

-- Enable RLS
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can read their own answers"
    ON answers
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create their own answers"
    ON answers
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own answers"
    ON answers
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete their own answers"
    ON answers
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX answers_user_id_idx ON answers(user_id);
CREATE INDEX answers_question_id_idx ON answers(question_id);

-- Set up realtime
ALTER TABLE answers REPLICA IDENTITY FULL;

-- Comments
COMMENT ON TABLE answers IS 'Stores user answers to questions';
COMMENT ON COLUMN answers.user_id IS 'References auth.users(id)';
COMMENT ON COLUMN answers.question_id IS 'References questions(id)';
