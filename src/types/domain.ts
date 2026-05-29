import type {
  conceptSchema,
  explanationModeSchema,
  explanationRequestSchema,
  followUpQuestionSchema,
  marginNoteConceptSchema,
  marginNoteSchema,
  passageSchema,
  sourceCategorySchema,
  sourceSchema,
  sourceTypeSchema,
} from '@/src/schemas/domain';
import type { z } from 'zod';

export type Source = z.infer<typeof sourceSchema>;
export type SourceType = z.infer<typeof sourceTypeSchema>;
export type SourceCategory = z.infer<typeof sourceCategorySchema>;
export type Passage = z.infer<typeof passageSchema>;
export type ExplanationRequest = z.infer<typeof explanationRequestSchema>;
export type ExplanationMode = z.infer<typeof explanationModeSchema>;
export type MarginNote = z.infer<typeof marginNoteSchema>;
export type Concept = z.infer<typeof conceptSchema>;
export type MarginNoteConcept = z.infer<typeof marginNoteConceptSchema>;
export type FollowUpQuestion = z.infer<typeof followUpQuestionSchema>;
