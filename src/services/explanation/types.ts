import type { ExplanationMode } from '@/src/types/domain';

export type ExplanationInput = {
  passageExcerpt: string;
  selectedText: string;
  mode: ExplanationMode;
  customQuestion?: string;
};

export type ExplanationOutput = {
  isDemoExplanation: true;
  plainEnglishExplanation: string;
  missingBackground?: string;
  exampleOrAnalogy?: string;
  whyItMatters?: string;
  adaptiveModuleTitle?: string;
  adaptiveModuleContent?: string;
  relatedConcepts: string[];
};

export interface ExplanationService {
  generate(input: ExplanationInput): Promise<ExplanationOutput>;
  answerFollowUp(question: string): Promise<string>;
}
