# QSTN Database Schema

## Current Tables

### answers
- id: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
- user_id: UUID NOT NULL REFERENCES auth.users(id)
- question_id: UUID NOT NULL REFERENCES questions(id)
- answer: TEXT
- created_at: TIMESTAMPTZ NOT NULL DEFAULT NOW()
- updated_at: TIMESTAMPTZ NOT NULL DEFAULT NOW()

### questions
- id: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
- title: TEXT NOT NULL
- description: TEXT
- tips: TEXT[]
- type: TEXT NOT NULL
- order_index: INTEGER NOT NULL
- is_active: BOOLEAN DEFAULT true
- created_at: TIMESTAMPTZ NOT NULL DEFAULT NOW()
- updated_at: TIMESTAMPTZ NOT NULL DEFAULT NOW()

### question_dependencies
- id: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
- question_id: UUID NOT NULL REFERENCES questions(id)
- dependent_on_question_id: UUID NOT NULL REFERENCES questions(id)
- condition: JSONB NOT NULL DEFAULT '{}'
- created_at: TIMESTAMPTZ NOT NULL DEFAULT NOW()

### documents
- id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- user_id: UUID NOT NULL REFERENCES auth.users(id)
- title: TEXT NOT NULL
- is_complete: BOOLEAN NOT NULL DEFAULT false
- created_at: TIMESTAMPTZ NOT NULL DEFAULT NOW()
- updated_at: TIMESTAMPTZ NOT NULL DEFAULT NOW()

### document_sections
- id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- document_id: UUID NOT NULL REFERENCES documents(id)
- section_type: TEXT NOT NULL
- content: JSONB NOT NULL DEFAULT '{}'
- order_index: INTEGER NOT NULL
- created_at: TIMESTAMPTZ NOT NULL DEFAULT NOW()
- updated_at: TIMESTAMPTZ NOT NULL DEFAULT NOW()

### user_preferences
- user_id: UUID PRIMARY KEY REFERENCES auth.users(id)
- planning_direction: TEXT NOT NULL DEFAULT 'top_down'
- created_at: TIMESTAMPTZ NOT NULL DEFAULT NOW()
- updated_at: TIMESTAMPTZ NOT NULL DEFAULT NOW()

## Relationships
- answers -> questions (question_id)
- answers -> auth.users (user_id)
- question_dependencies -> questions (question_id, dependent_on_question_id)
- documents -> auth.users (user_id)
- document_sections -> documents (document_id)
- user_preferences -> auth.users (user_id) 