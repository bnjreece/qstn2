# QSTN - Your Story

## Vision
A platform for teams and individuals to learn about each other, align personal or team vision, and create a plan/set goals. The platform generates beautiful AI-powered reports from interactive exercises and inputs, helping users craft their story and align their goals.

## Core Features
1. Dual Paths:
   - Personal Journey: Individual assessment and life planning
   - Team Journey: Group dynamics and strategy alignment

2. AI-Guided Experience:
   - Personality assessments (individual/team)
   - Vision and strategy development
   - Interactive exercises and prompts
   - AI-generated outputs (assessments, plans, strategies)

## Quick Navigation
- Database Schema: `app/ai/SCHEMA.md`
- Authentication: `app/routes/auth/*`
- App Layout: `app/routes/app.tsx`
- Form Steps: `app/config/form-sections.ts`
- Database Types: `app/types/supabase.ts`
- Shared Components: `app/components/layout/*`

## Implementation Plan (TODO)

### Completed Features
- [x] Database-driven questions
- [x] Base components and UI
- [x] Form state management
- [x] Progressive disclosure UI
- [x] Direction choice (top-down vs bottom-up)

### Immediate Priorities (Easy)
1. Initial Experience Setup
   - [ ] Change tagline to "Your Story"
   - [ ] Add AI level selection slider:
     - Level 1: No AI (clean experience)
     - Level 2: Basic AI (grammar/formatting cleanup)
     - Level 3: Guided AI (personality-based suggestions)
   - [ ] Add timeframe preference selection

2. AI Integration Levels
   - [ ] Implement clean mode (no AI)
   - [ ] Build basic text cleanup/formatting AI
   - [ ] Create 10-question personality assessment
   - [ ] Add personality-based question flow
   - [ ] Implement multiple choice suggestions

3. Core Experience
   - [ ] Add progress tracking
   - [ ] Basic sharing options
   - [ ] Email reminders for goals
   - [ ] Reminder customization

### Medium Complexity
1. Content Generation
   - [ ] Generate clean summaries (Level 2)
   - [ ] Create personality-based reports (Level 3)
   - [ ] Build infographics with themes
   - [ ] Add exportable reports

2. Assessment System
   - [ ] Expand personality test options
   - [ ] Enhance individual assessment flow
   - [ ] Create assessment-based customization
   - [ ] Build AI-guided question flow

3. Individual Advanced Features
   - [ ] Dynamic goal suggestions
   - [ ] Progress analytics
   - [ ] Achievement tracking
   - [ ] Personal insights dashboard

### Advanced Features (Team/Social)
1. Team Path Foundation
   - [ ] Add team/individual path selection
   - [ ] Team member invitations
   - [ ] Basic collaboration tools
   - [ ] Shared workspaces

2. Team Assessment & Planning
   - [ ] Team dynamics assessment
   - [ ] Team goal alignment AI
   - [ ] Conflict detection
   - [ ] Strategy optimization
   - [ ] Team compatibility analysis

3. Team Advanced Features
   - [ ] Goal sharing and discovery
   - [ ] Team matching
   - [ ] Collaborative planning
   - [ ] Community insights
   - [ ] Cross-team analytics

## Technical Guidelines

### Frontend Architecture
- Remix for server-side rendering and data loading
- TailwindCSS for styling
- TypeScript for type safety
- Component hierarchy:
  - Layout components (`app/components/layout/`)
  - Form components (`app/components/form/`)
  - Shared UI components (`app/components/ui/`)

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