# QSTN - AI Architecture Guide

## Quick Navigation for AI
- Authentication: `app/routes/auth/*`
- App Layout: `app/routes/app.tsx`
- Form Steps: `app/config/form-sections.ts`
- Database Types: `app/types/supabase.ts`
- Database Schema: `app/ai/SCHEMA.md`
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

## Current State v2

### Authentication (Completed)
- Magic link flow using Supabase
- Protected routes with session management
- Error boundaries and type-safe auth data flow
- Key files:
  - `auth.server.ts`: Server-side auth utilities
  - `auth.callback.tsx`: Magic link handling
  - `auth.login.tsx`: Login form
  - `AuthLoaderData` type for type-safe auth data

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

#### 1. Database-Driven Questions (Completed)
- [x] Create questions and dependencies tables
- [x] Seed initial questions from existing hardcoded data
- [x] Create question fetching utilities
- [x] Update types for database questions
- [x] Modify form to use database questions

#### 2. Base Components Setup (Completed)
- [x] Create `app/components/form/` directory
- [x] Create `app/components/ui/` directory
- [x] Build base text input component with animations
- [x] Build form container with step navigation
- [x] Implement mobile-first responsive design

#### 3. Form State Management (Completed)
- [x] Implement answer persistence with autosave
- [x] Add answer retrieval for previous questions
- [x] Create final summary/results page
- [x] Add loading states during save/fetch
- [x] Add error handling for failed saves

#### 4. Progressive Disclosure UI (Completed)
- [x] Single question view component
- [x] Smooth transitions between steps
- [x] Progress indicator
- [x] Back/Next navigation
- [x] Mobile-friendly touch gestures

#### 5. Data Management & Polish
- [ ] Implement autosave to answers table
- [ ] Add optimistic updates
- [ ] Handle offline/error states
- [ ] Add save indicators
- [ ] Add keyboard navigation
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

4. Form Debugging Best Practices:
   - Use consistent logging format with component prefixes:
     ```typescript
     console.log('[ComponentName] Event:', { data });
     ```
   - Track component lifecycle:
     - Log mounting and unmounting
     - Log prop and state changes
     - Log form context updates
     - Log event handler execution
   - Verify context providers:
     - Import hooks correctly (e.g., `useForm`)
     - Check context values are accessible
     - Log context value changes
   - Event handler implementation:
     - Use `useCallback` for handlers
     - Add TypeScript types
     - Prevent default behavior when needed
     - Add error boundaries
     - Log event flow

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

### Brand Colors and UI Guidelines

#### Brand Colors
```css
/* Primary Colors */
--color-primary: #906D22;    /* Deep Gold */
--color-secondary: #FBB626;  /* Bright Yellow */
--color-tertiary: #DC641F;   /* Burnt Orange */
--color-quaternary: #983712; /* Deep Red/Brown */
--color-dark: #3F1A0B;       /* Dark Brown */

/* UI Colors */
--color-ui-light: #F5F3F0;   /* Light Warm Gray */
--color-ui-dark: #2A2520;    /* Dark Warm Gray */

/* Accent Color */
--color-accent: #2D7D76;     /* Muted Teal */
```

#### Color Usage Guidelines
1. Primary Actions
   - Buttons: Primary color (#906D22)
   - Hover states: Secondary color (#FBB626)
   - Focus states: Accent color (#2D7D76)

2. Text Colors
   - Headers: Dark color (#3F1A0B)
   - Body text: UI Dark (#2A2520)
   - Subtle text: 60% opacity of UI Dark

3. Backgrounds
   - Main background: UI Light (#F5F3F0)
   - Cards/Elevated elements: White
   - Accent sections: 10% opacity of Primary

4. Progress & Status
   - Progress bars: Primary to Secondary gradient
   - Success states: Accent color
   - Error states: Quaternary color (#983712)
   - Warning states: Tertiary color (#DC641F)

#### Implementation
```typescript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#906D22',
        secondary: '#FBB626',
        tertiary: '#DC641F',
        quaternary: '#983712',
        dark: '#3F1A0B',
        'ui-light': '#F5F3F0',
        'ui-dark': '#2A2520',
        accent: '#2D7D76',
      },
    },
  },
}
```

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

## Styling Architecture

### Directory Structure
```
app/
├── styles/
│   ├── tailwind.css     # Main Tailwind imports and component classes
│   └── global.css       # Global styles and CSS resets
├── components/
│   ├── ui/             # Reusable UI components
│   │   └── Button.tsx   # Example: Base button component
│   └── layout/         # Layout components
└── routes/            # Route components
```

### Styling Hierarchy
1. **Base Styles** (`app/styles/global.css`)
   - CSS resets
   - Root variables
   - Base element styles
   - Font imports

2. **Component Classes** (`app/styles/tailwind.css`)
   - Reusable component patterns
   - Custom utility patterns
   - Layout patterns

3. **Utility Classes** (in components)
   - Direct Tailwind utilities
   - Component-specific styles

### Component Style Guidelines

1. **Layout Components**
   - Use semantic HTML
   - Mobile-first responsive design
   - Container patterns for consistent spacing
   ```tsx
   <div className="min-h-screen bg-ui-light">
     <div className="w-full max-w-4xl mx-auto px-8 py-12">
       {children}
     </div>
   </div>
   ```

2. **UI Components**
   - Composition over inheritance
   - Props for variants
   - Consistent class ordering:
     1. Layout (position, display, width, height)
     2. Spacing (margin, padding)
     3. Typography
     4. Visual (colors, borders, shadows)
     5. Interactive states
   ```tsx
   <button className={twMerge(
     // Base styles
     "inline-flex items-center justify-center",
     "px-6 py-3",
     "text-base font-medium",
     "rounded-md bg-primary text-white",
     "hover:bg-primary-dark focus:ring-2",
     // Variant styles
     variantStyles[variant],
     className
   )}>
   ```

### Color System

1. **Semantic Color Tokens**
   ```js
   colors: {
     // Brand Colors
     'primary': '#906D22',
     'primary-dark': '#785A1C',
     'secondary': '#FBB626',
     'tertiary': '#DC641F',
     'quaternary': '#983712',
     
     // UI Colors
     'ui': {
       light: '#F5F3F0',
       dark: '#2A2520',
     },
     
     // Text Colors
     'text': {
       primary: '#3F1A0B',
       secondary: '#2A2520',
       muted: 'rgba(42, 37, 32, 0.6)',
     },
     
     // Feedback Colors
     'status': {
       success: '#2D7D76',
       error: '#983712',
       warning: '#DC641F',
     }
   }
   ```

2. **Color Usage**
   - Use semantic color names in components
   - Consistent opacity values (10%, 20%, 60%, etc.)
   - Document color purpose in comments

### Typography System

1. **Font Scale**
   ```js
   fontSize: {
     'xs': ['0.75rem', { lineHeight: '1rem' }],
     'sm': ['0.875rem', { lineHeight: '1.25rem' }],
     'base': ['1rem', { lineHeight: '1.5rem' }],
     'lg': ['1.125rem', { lineHeight: '1.75rem' }],
     'xl': ['1.25rem', { lineHeight: '1.75rem' }],
     '2xl': ['1.5rem', { lineHeight: '2rem' }],
     '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
     '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
     '5xl': ['3rem', { lineHeight: '1.16' }],
   }
   ```

2. **Typography Classes**
   ```css
   .heading-1 {
     @apply text-4xl font-serif text-text-primary;
   }
   .text-body {
     @apply text-base font-serif text-text-secondary;
   }
   ```

### Best Practices

1. **Component Organization**
   - Keep styles close to components
   - Use composition for complex components
   - Extract common patterns to component classes

2. **Responsive Design**
   - Mobile-first approach
   - Use standard breakpoints
   - Fluid typography when appropriate

3. **Performance**
   - Minimize CSS-in-JS usage
   - Use Tailwind's JIT mode
   - Purge unused styles in production

4. **Accessibility**
   - Maintain color contrast (WCAG 2.1)
   - Use semantic HTML elements
   - Support reduced motion
   - Keyboard navigation

5. **State Management**
   - Consistent hover/focus states
   - Loading states for all interactive elements
   - Error states with clear feedback
   - Disabled states with visual indication