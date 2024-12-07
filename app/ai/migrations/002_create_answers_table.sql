-- Drop the table if it exists
DROP TABLE IF EXISTS answers;

-- Create answers table
CREATE TABLE answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    question_id UUID NOT NULL REFERENCES questions(id),
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

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read for users" ON answers;
DROP POLICY IF EXISTS "Enable insert for users" ON answers;
DROP POLICY IF EXISTS "Enable update for users" ON answers;
DROP POLICY IF EXISTS "Enable delete for users" ON answers;
DROP POLICY IF EXISTS "Users can manage their own answers" ON answers;

-- Create separate policies for each operation
CREATE POLICY "Enable read for users"
    ON answers FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Enable insert for users"
    ON answers FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Enable update for users"
    ON answers FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Enable delete for users"
    ON answers FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- Grant necessary privileges
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON answers TO anon, authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated; 