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
# Set by Vercel automatically
VERCEL_URL=your-vercel-domain

# Node environment should be 'production' in deployment
NODE_ENV=production
```

### URL Configuration
The application uses the following logic for authentication redirects:
1. In production:
   - Always use `https://www.qstn.co`
   - Ignore preview deployment URLs
2. In development:
   - Use `http://localhost:3000`

### Supabase Configuration
Required settings in Supabase project:

1. Site URL: `https://www.qstn.co`

2. Redirect URLs:
```
https://www.qstn.co/auth/callback
http://localhost:3000/auth/callback
```

3. Additional settings:
- Auth > Email Auth enabled
- Auth > PKCE flow enabled
- RLS policies configured for documents

### Domain Configuration
1. Primary domain: `www.qstn.co`
2. Redirect configuration:
   - `qstn.co` redirects to `www.qstn.co`
   - All traffic uses HTTPS

### Vercel Configuration
- Framework Preset: Remix
- Build Command: `npx remix build`
- Install Command: `npm install`
- Output Directory: `public/build`
- Domain Configuration:
  - Primary: `www.qstn.co`
  - Redirects: `qstn.co` → `www.qstn.co`

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

### Implementation Plan (TODO)

#### 1. Base Components Setup
- [ ] Create `app/components/form/` directory
- [ ] Create `app/components/ui/` directory
- [ ] Build base text input component with animations
- [ ] Build form container with step navigation
- [ ] Implement mobile-first responsive design

#### 2. Form State Management
- [ ] Create form context for state management
- [ ] Implement step navigation logic
- [ ] Add progress tracking
- [ ] Setup autosave functionality
- [ ] Add loading and error states

#### 3. Progressive Disclosure UI
- [ ] Single question view component
- [ ] Smooth transitions between steps
- [ ] Progress indicator
- [ ] Back/Next navigation
- [ ] Mobile-friendly touch gestures

#### 4. Data Management
- [ ] Setup Supabase real-time subscriptions
- [ ] Implement autosave to document_sections
- [ ] Add optimistic updates
- [ ] Handle offline/error states
- [ ] Add save indicators

#### 5. Individual Sections
- [ ] Core Values & Purpose section
- [ ] BHAG section
- [ ] 3-5 Year Targets section
- [ ] Annual Goals section
- [ ] Quarterly Priorities section
- [ ] Weekly Rocks section
- [ ] Daily Habits section

#### 6. Polish & Optimization
- [ ] Add keyboard navigation
- [ ] Implement save indicators
- [ ] Add progress persistence
- [ ] Optimize performance
- [ ] Add loading skeletons

### Technical Approach
1. Each form section will:
   - Use a shared text input component
   - Save automatically as user types
   - Support markdown formatting
   - Have smooth transitions

2. Progressive Disclosure:
   - Show one section at a time
   - Clear, focused interface
   - Easy navigation between sections
   - Visual progress indication

3. Mobile-first Design:
   - Full-screen form sections
   - Touch-friendly inputs
   - Swipe navigation (optional)
   - Responsive text sizing

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