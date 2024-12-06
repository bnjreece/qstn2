-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published'))
);

-- Create document_steps table
CREATE TABLE IF NOT EXISTS document_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    step INTEGER NOT NULL,
    data JSONB NOT NULL DEFAULT '{}'
);

-- Create indexes
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_document_steps_document_id ON document_steps(document_id);
CREATE INDEX idx_document_steps_step ON document_steps(step);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for documents table
CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_steps ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own documents"
    ON documents FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents"
    ON documents FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents"
    ON documents FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents"
    ON documents FOR DELETE
    USING (auth.uid() = user_id);

-- Document steps policies
CREATE POLICY "Users can view their document steps"
    ON document_steps FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM documents
        WHERE documents.id = document_steps.document_id
        AND documents.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert document steps"
    ON document_steps FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM documents
        WHERE documents.id = document_steps.document_id
        AND documents.user_id = auth.uid()
    ));

CREATE POLICY "Users can update document steps"
    ON document_steps FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM documents
        WHERE documents.id = document_steps.document_id
        AND documents.user_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM documents
        WHERE documents.id = document_steps.document_id
        AND documents.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete document steps"
    ON document_steps FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM documents
        WHERE documents.id = document_steps.document_id
        AND documents.user_id = auth.uid()
    )); 