import { z } from 'zod';

export const sourceTypeSchema = z.enum(['book', 'article', 'paper', 'essay', 'documentation', 'other']);
export const sourceCategorySchema = z.enum(['history', 'economics', 'philosophy', 'psychology', 'science', 'technology', 'fiction', 'other']);
export const explanationModeSchema = z.enum([
  'explain_simply',
  'missing_background',
  'why_does_this_follow',
  'give_example',
  'argument_breakdown',
  'define_term',
  'custom_question',
]);
export const conceptTypeSchema = z.enum(['term', 'person', 'event', 'place', 'theory', 'method', 'claim', 'institution']);

export const sourceSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1),
  authorOrPublisher: z.string().trim().optional(),
  sourceType: sourceTypeSchema,
  category: sourceCategorySchema,
  notes: z.string().trim().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const newSourceInputSchema = sourceSchema.omit({ id: true, createdAt: true, updatedAt: true });

export const passageSchema = z.object({
  id: z.string().min(1),
  sourceId: z.string().min(1),
  excerpt: z.string().trim().min(1).max(1500),
  pageOrLocation: z.string().trim().optional(),
  chapterOrSection: z.string().trim().optional(),
  initialQuestion: z.string().trim().optional(),
  createdAt: z.string(),
});

export const newPassageInputSchema = passageSchema.omit({ id: true, createdAt: true });

export const explanationRequestSchema = z
  .object({
    id: z.string().min(1),
    passageId: z.string().min(1),
    selectedText: z.string().trim().min(1),
    mode: explanationModeSchema,
    customQuestion: z.string().trim().optional(),
    createdAt: z.string(),
  })
  .superRefine((value, ctx) => {
    if (value.mode === 'custom_question' && !value.customQuestion) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['customQuestion'], message: 'Custom question is required for this mode.' });
    }
  });

export const newExplanationRequestInputSchema = z
  .object({
    passageId: z.string().min(1),
    selectedText: z.string().trim().min(1),
    mode: explanationModeSchema,
    customQuestion: z.string().trim().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.mode === 'custom_question' && !value.customQuestion) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['customQuestion'], message: 'Custom question is required for this mode.' });
    }
  });

export const marginNoteSchema = z.object({
  id: z.string().min(1),
  sourceId: z.string().min(1),
  passageId: z.string().min(1),
  explanationRequestId: z.string().min(1),
  isDemoExplanation: z.boolean(),
  plainEnglishExplanation: z.string().min(1),
  missingBackground: z.string().optional(),
  exampleOrAnalogy: z.string().optional(),
  whyItMatters: z.string().optional(),
  adaptiveModuleTitle: z.string().optional(),
  adaptiveModuleContent: z.string().optional(),
  relatedConcepts: z.array(z.string()),
  createdAt: z.string(),
  savedAt: z.string().optional(),
});

export const conceptSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: conceptTypeSchema,
  summary: z.string().optional(),
  createdAt: z.string(),
});

export const marginNoteConceptSchema = z.object({
  marginNoteId: z.string().min(1),
  conceptId: z.string().min(1),
});

export const followUpQuestionSchema = z.object({
  id: z.string().min(1),
  marginNoteId: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
  isDemoAnswer: z.boolean(),
  createdAt: z.string(),
});
