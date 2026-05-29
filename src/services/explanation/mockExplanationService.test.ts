import { describe, expect, it } from '@jest/globals';

import { MockExplanationService } from '@/src/services/explanation/MockExplanationService';

describe('MockExplanationService', () => {
  const service = new MockExplanationService();

  it('matches philosophy trigger', async () => {
    const result = await service.generate({
      passageExcerpt: 'Kant described space and time as forms of intuition.',
      selectedText: 'forms of intuition',
      mode: 'explain_simply',
    });

    expect(result.isDemoExplanation).toBe(true);
    expect(result.relatedConcepts).toContain('Forms of Intuition');
  });

  it('returns fallback for unmatched text', async () => {
    const result = await service.generate({
      passageExcerpt: 'An unrelated sentence about architecture.',
      selectedText: 'brick pattern',
      mode: 'define_term',
    });

    expect(result.plainEnglishExplanation.toLowerCase()).toContain('demo explanation');
    expect(result.missingBackground?.toLowerCase()).toContain('mock analysis');
  });
});
