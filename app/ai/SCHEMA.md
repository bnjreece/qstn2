# Database Schema

## Tables

### documents
| Column | Type | Nullable | Default | Key | References |
|--------|------|----------|----------|-----|------------|
| id | uuid | NO | gen_random_uuid() | PK | |
| user_id | uuid | NO | | FK | users(id) |
| title | text | NO | | | |
| created_at | timestamptz | NO | now() | | |
| updated_at | timestamptz | NO | now() | | |
| is_complete | boolean | NO | false | | |

### document_sections
| Column | Type | Nullable | Default | Key | References |
|--------|------|----------|----------|-----|------------|
| id | uuid | NO | gen_random_uuid() | PK | |
| document_id | uuid | NO | | FK | documents(id) |
| section_type | text | NO | | | |
| content | jsonb | NO | '{}' | | |
| order_index | integer | NO | | | |
| created_at | timestamptz | NO | now() | | |
| updated_at | timestamptz | NO | now() | | |

### questions
| Column | Type | Nullable | Default | Key | References |
|--------|------|----------|----------|-----|------------|
| id | uuid | NO | uuid_generate_v4() | PK | |
| title | text | NO | | | |
| description | text | YES | | | |
| tips | text[] | YES | | | |
| type | text | NO | | | |
| order_index | integer | NO | | | |
| is_active | boolean | YES | true | | |
| created_at | timestamptz | NO | now() | | |
| updated_at | timestamptz | NO | now() | | |

### answers
| Column | Type | Nullable | Default | Key | References |
|--------|------|----------|----------|-----|------------|
| id | uuid | NO | uuid_generate_v4() | PK | |
| user_id | uuid | NO | | FK | users(id) |
| question_id | uuid | NO | | FK | questions(id) |
| answer | text | YES | | | |
| created_at | timestamptz | NO | now() | | |
| updated_at | timestamptz | NO | now() | | |

### question_dependencies
| Column | Type | Nullable | Default | Key | References |
|--------|------|----------|----------|-----|------------|
| id | uuid | NO | uuid_generate_v4() | PK | |
| question_id | uuid | NO | | FK | questions(id) |
| dependent_on_question_id | uuid | NO | | FK | questions(id) |
| condition | jsonb | NO | '{}' | | |
| created_at | timestamptz | NO | now() | | |

## Indexes
- `documents`: Primary key on `id`
- `document_sections`: Primary key on `id`, Foreign key on `document_id`
- `questions`: Primary key on `id`, Index on `type`, `order_index`, and `is_active`
- `answers`: Primary key on `id`, Unique constraint on `(user_id, question_id)`, Foreign keys on `user_id` and `question_id`
- `question_dependencies`: Primary key on `id`, Foreign keys on `question_id` and `dependent_on_question_id`

## Triggers
- `update_questions_updated_at`: Updates `updated_at` timestamp on questions table before update
- `update_answers_updated_at`: Updates `updated_at` timestamp on answers table before update

## Notes
- All tables use UUID for primary keys
- Timestamps are stored in timezone-aware format
- JSON data is stored using `jsonb` type for better performance
- Question dependencies allow for branching flows based on previous answers
- Row-level security policies are in place for user data isolation 