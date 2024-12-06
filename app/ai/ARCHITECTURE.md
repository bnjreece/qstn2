# QSTN - AI Architecture Guide

## Quick Navigation for AI
- Authentication: `app/routes/auth/*`
- App Layout: `app/routes/app.tsx`
- Form Steps: `app/config/form-sections.ts`
- Database Types: `app/types/supabase.ts`
- Shared Components: `app/components/layout/*`

## Deployment Configuration

### Environment Variables
Required in both development and production:
```env
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
SESSION_SECRET=your-secret
```

Production-specific variables:
```env
# Set by Vercel automatically, but can be overridden if needed
VERCEL_URL=your-vercel-domain

# Node environment should be 'production' in deployment
NODE_ENV=production
```

### URL Configuration
The application uses the following logic to determine the base URL:
1. In production:
   - Use `VERCEL_URL` if available
   - Fallback to hardcoded production URL
2. In development:
   - Use `localhost:3000`

### Supabase Configuration
Authentication redirect URLs needed:
```
https://qstn2.vercel.app/auth/callback
https://qstn2-git-main-bnjreeces-projects.vercel.app/auth/callback
https://qstn2-fsxjugq6d-bnjreeces-projects.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

### Vercel Configuration
- Framework Preset: Remix
- Build Command: `npx remix build`
- Install Command: `npm install`
- Output Directory: `public/build`

## Current State

### Authentication (Completed)
- Magic link flow using Supabase
- Protected routes with session management
- Error boundaries and type-safe auth data flow
- Key files:
  - `auth.server.ts`: Server-side auth utilities
  - `auth.callback.tsx`: Magic link handling
  - `auth.login.tsx`: Login form
  - `AuthLoaderData` type for type-safe auth data

### Database Schema (Implemented)
```sql
documents (
  id uuid PK,
  user_id uuid FK -> auth.users,
  title text,
  created_at timestamp,
  updated_at timestamp,
  is_complete boolean
)

document_sections (
  id uuid PK,
  document_id uuid FK -> documents,
  section_type text,
  content jsonb,
  order_index integer,
  created_at timestamp,
  updated_at timestamp
)
```

RLS policies ensure users can only access their own documents and sections.

## Next Phase: Multi-step Form (In Progress)

### Form Structure
Each strategic plan consists of multiple sections, stored as JSON in document_sections:
1. Core Values & Purpose
2. Big Hairy Audacious Goal (BHAG)
3. 3-5 Year Targets
4. Annual Goals
5. Quarterly Priorities
6. Weekly Rocks
7. Daily Habits

### Implementation Plan
1. Create TypeForm-style UI with:
   - Progressive disclosure
   - Autosave as user types
   - Beautiful transitions
   - Mobile-first design

2. Data Flow:
   - Each step saves to document_sections
   - Final view aggregates all sections
   - Real-time updates using Supabase subscriptions

## Future Phases

### Phase 2: Personality Assessment
- Integration with personality assessment tools
- Customized plan suggestions based on personality type
- Additional schema needed:
  ```sql
  personality_assessments (
    id uuid PK,
    user_id uuid FK,
    assessment_type text,
    results jsonb,
    created_at timestamp
  )
  ```

### Phase 3: Team Planning
- Company/team workspaces
- Shared goals and alignment
- Additional schema needed:
  ```sql
  organizations (
    id uuid PK,
    name text,
    created_by uuid FK
  )
  
  team_members (
    id uuid PK,
    org_id uuid FK,
    user_id uuid FK,
    role text
  )
  
  team_documents (
    id uuid PK,
    org_id uuid FK,
    document_id uuid FK
  )
  ```

## Architecture Decisions

### Frontend
- Remix for server-side rendering and data loading
- TailwindCSS for styling
- TypeScript for type safety
- Component hierarchy:
  - Layout components (`app/components/layout/`)
  - Form components (to be created in `app/components/form/`)
  - Shared UI components (to be created in `app/components/ui/`)

### Data Flow
1. Server-side loaders fetch initial data
2. Client-side updates save immediately
3. Optimistic UI updates with error handling
4. Real-time updates for collaborative features

### Security
- Row Level Security (RLS) in Supabase
- Server-side session validation
- Type-safe data access patterns
- Protected route middleware

## AI Development Guidelines

1. When adding new features:
   - Update types in `app/types/`
   - Add server utilities in `app/utils/`
   - Place components in appropriate directories
   - Follow existing error handling patterns

2. Data Mutations:
   - Use Remix actions for form submissions
   - Implement optimistic updates
   - Add proper error boundaries
   - Follow existing type patterns

3. Authentication:
   - Always use `requireUserId` for protected routes
   - Handle session errors gracefully
   - Maintain type safety with `AuthLoaderData`

4. Styling:
   - Use Tailwind utility classes
   - Follow existing component patterns
   - Maintain responsive design
   - Use CSS transitions for smooth UX 