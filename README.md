# MARGIN

MARGIN is an AI-powered mobile reading companion with one promise: **Never read past confusion again.**

## Product vision
Readers hit confusing passages and keep going to avoid breaking flow. MARGIN captures that confusion instantly and turns it into connected Margin Notes they can revisit.

## Core problem
Leaving the reading context to search breaks momentum and causes hidden understanding gaps to accumulate.

## Current mock functionality
This scaffold implements a local-first demo vertical slice:

**Add Source → Add Passage → Select Confusion → Generate Demo Explanation → Save Margin Note → View in Notes and Concepts**

All explanations are clearly marked demo/mock content.

## Tech stack
- Expo + React Native + TypeScript (strict)
- Expo Router
- Token-based `StyleSheet` design system (NativeWind intentionally not used for stability in this initial scaffold)
- `expo-sqlite` for local-first storage
- Zustand (lightweight UI filter state)
- Zod validation
- ESLint + Prettier
- Jest + React Native Testing Library

## Setup
```bash
npm install
npm run start
```

## Commands
```bash
npm run lint
npm run typecheck
npm test
```

## Project structure
- `app/` Expo Router routes
- `src/components/` shared UI components
- `src/features/` feature screens
- `src/db/` SQLite bootstrap + repositories
- `src/services/explanation/` explanation interface + mock service
- `src/schemas/` Zod schemas
- `src/types/` domain types
- `src/theme/` design tokens
- `docs/` product and architecture docs

## What is mocked
- Explanation generation
- Follow-up answers
- Concept extraction rules

## Next milestones
1. Strengthen note rendering and editing UX
2. Improve selection ergonomics for confusing text
3. Add secure backend API contract for real AI explanations
4. Add OCR and share/import pipelines later (out of current scope)
