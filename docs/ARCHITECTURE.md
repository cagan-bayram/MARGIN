# ARCHITECTURE

## Local-first storage design
SQLite (`expo-sqlite`) stores source metadata, passages, explanation requests, margin notes, concepts, concept links, and follow-up questions on-device.

## Repository/service layering
- `src/db/client.ts`: schema bootstrap + migration entry
- `src/db/repositories.ts`: typed create/list/get operations
- UI screens call repository functions, not raw SQL

## Explanation service abstraction
UI depends on `ExplanationService` interface. Current implementation is `MockExplanationService`. This allows swapping to `RemoteExplanationService` later without rewriting screens.

## Security boundary
Private API keys must never exist in the mobile app. Real AI/OCR integrations should be called through a secure backend/edge function that holds secrets server-side.

## Future secure backend shape
1. Mobile sends selected passage context and mode to authenticated API endpoint.
2. Backend validates policy and copyright constraints.
3. Backend calls model provider and returns structured explanation modules.
4. Mobile persists response locally and optionally syncs metadata.

## Future OCR and selection considerations
- OCR should extract only user-selected short excerpts, not full copyrighted books.
- Native text selection should eventually replace manual selected-text input.
- Include provenance metadata (source/page/location/selection bounds) for trust and revisitability.

## Suggested development sequence
1. Stabilize mock interaction quality and usability
2. Add stronger validation/error handling and migrations
3. Introduce secure backend contract and remote service implementation
4. Add OCR/share/import capture channels
5. Add optional sync and account layers
