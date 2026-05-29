# CLAUDE HANDOFF

## What MARGIN is
MARGIN is a mobile reading companion that captures confusing passages and saves structured explanatory Margin Notes.

## Current implementation state
- Expo Router mobile scaffold with bottom tabs and stack/modal routes
- Local-first SQLite schema + repositories
- Mock explanation service via interface abstraction
- Working demo flow from source creation to saved note and concept listing
- Basic schema/service/component tests configured with Jest + RNTL

## Commands
- `npm install`
- `npm run start`
- `npm run lint`
- `npm run typecheck`
- `npm test`

## Architectural rules
- Keep UI dependent on `ExplanationService` interface
- Keep persisted reading data local-first
- Use Zod for form/domain validation
- Never place private API keys in client env vars

## Product scope constraints
Do not add real AI, OCR, authentication, purchases, backend sync, imported document reading, share extensions, or graph visualisation in this stage.

## Immediate next task
Verify the app boots and test the full mock flow: Add Source → Add Passage → Select Confusion → Demo Explanation → Save Margin Note → Notes/Concepts. Improve only one piece at a time. Do not add real AI, OCR, authentication, purchases, or backend services until the core interaction feels valuable with real sample passages.
