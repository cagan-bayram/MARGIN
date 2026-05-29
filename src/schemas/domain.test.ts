import { describe, expect, it } from '@jest/globals';

import { newExplanationRequestInputSchema, newPassageInputSchema, newSourceInputSchema } from '@/src/schemas/domain';

describe('domain schemas', () => {
  it('validates source creation input', () => {
    const result = newSourceInputSchema.parse({
      title: 'Critique of Pure Reason',
      sourceType: 'book',
      category: 'philosophy',
    });

    expect(result.title).toBe('Critique of Pure Reason');
  });

  it('validates passage creation input', () => {
    const result = newPassageInputSchema.parse({
      sourceId: 'src_1',
      excerpt: 'Kant described space and time as forms of intuition.',
      initialQuestion: 'What does this mean?',
    });

    expect(result.excerpt.length).toBeGreaterThan(10);
  });

  it('requires custom question for custom mode', () => {
    const invalid = newExplanationRequestInputSchema.safeParse({
      passageId: 'psg_1',
      selectedText: 'forms of intuition',
      mode: 'custom_question',
    });

    expect(invalid.success).toBe(false);
  });
});
