import type { ExplanationInput, ExplanationOutput, ExplanationService } from '@/src/services/explanation/types';

function includesAny(content: string, tokens: string[]) {
  return tokens.some((token) => content.includes(token));
}

export class MockExplanationService implements ExplanationService {
  async generate(input: ExplanationInput): Promise<ExplanationOutput> {
    const combined = `${input.passageExcerpt} ${input.selectedText} ${input.customQuestion ?? ''}`.toLowerCase();

    if (includesAny(combined, ['kant', 'forms of intuition', 'thing-in-itself'])) {
      return {
        isDemoExplanation: true,
        plainEnglishExplanation:
          'Demo explanation: Kant says space and time are lenses your mind always uses to organize experience. They are not discovered inside objects themselves.',
        missingBackground:
          'Mock analysis: This comes from Kant’s distinction between appearances (what we can experience) and the thing-in-itself (what exists independently of our perception).',
        exampleOrAnalogy:
          'Imagine wearing tinted glasses from birth: everything you see is filtered, but the filter is your own setup, not the object.',
        whyItMatters: 'It changes how we think about certainty, knowledge limits, and what philosophical claims can be justified.',
        adaptiveModuleTitle: 'Argument Structure',
        adaptiveModuleContent:
          'Premise 1: Experience is structured. Premise 2: Structure requires forms. Conclusion: Space and time are forms supplied by the mind.',
        relatedConcepts: ['Forms of Intuition', 'Thing-in-itself', 'Transcendental Idealism'],
      };
    }

    if (includesAny(combined, ['tanzimat', 'constantinople', 'ottoman'])) {
      return {
        isDemoExplanation: true,
        plainEnglishExplanation:
          'Demo explanation: The Tanzimat reforms were 19th-century Ottoman modernization efforts to centralize administration and legal institutions.',
        missingBackground:
          'Mock analysis: Ottoman elites were responding to military pressure, fiscal strain, and competition with European states.',
        exampleOrAnalogy:
          'Think of a large organization replacing local custom rules with standardized procedures from headquarters.',
        whyItMatters: 'These reforms shaped late Ottoman governance and influenced successor institutions across the region.',
        adaptiveModuleTitle: 'Historical Context: Before and After',
        adaptiveModuleContent:
          'Before: uneven provincial practices. During Tanzimat: legal and bureaucratic standardization. After: stronger central state tools with mixed social outcomes.',
        relatedConcepts: ['Tanzimat', 'Ottoman Empire', 'Centralization'],
      };
    }

    if (includesAny(combined, ['bretton woods', 'gold standard', 'yield curve'])) {
      return {
        isDemoExplanation: true,
        plainEnglishExplanation:
          'Demo explanation: Bretton Woods fixed exchange rates to the dollar, and the dollar to gold. Leaving it allowed currencies to float by market demand.',
        missingBackground:
          'Mock analysis: Fixed-rate systems constrain domestic policy when inflation, trade balances, and capital flows shift.',
        exampleOrAnalogy:
          'A fixed peg is like locking prices between stores; a floating rate is continuous repricing as supply and demand move.',
        whyItMatters: 'Exchange regime changes affect inflation control, trade competitiveness, and financial stability.',
        adaptiveModuleTitle: 'Economic Causal Chain',
        adaptiveModuleContent:
          'Policy constraints + imbalances -> pressure on peg -> abandonment -> floating rates -> new monetary policy flexibility.',
        relatedConcepts: ['Bretton Woods', 'Floating Exchange Rate', 'Gold Standard'],
      };
    }

    if (includesAny(combined, ['wave-function', 'entropy', 'natural selection'])) {
      return {
        isDemoExplanation: true,
        plainEnglishExplanation:
          'Demo explanation: This concept describes how a system changes under specific scientific rules, often requiring hidden prerequisites to follow the argument.',
        missingBackground:
          'Mock analysis: You usually need prior concepts (measurement, probability, energy, adaptation, or timescale) before this statement is intuitive.',
        exampleOrAnalogy:
          'Like understanding a recipe step only after knowing what each ingredient does in the final dish.',
        whyItMatters: 'Without prerequisites, science text feels abrupt; with them, the logic becomes predictable and learnable.',
        adaptiveModuleTitle: 'Scientific Prerequisites',
        adaptiveModuleContent:
          'Relevant prerequisites include baseline definitions, causal mechanism, and what observations count as evidence.',
        relatedConcepts: ['Wave-function Collapse', 'Entropy', 'Natural Selection'],
      };
    }

    if (includesAny(combined, ['referentially transparent', 'pure function', 'monad'])) {
      return {
        isDemoExplanation: true,
        plainEnglishExplanation:
          'Demo explanation: Referential transparency means an expression can be replaced by its value without changing program behavior.',
        missingBackground:
          'Mock analysis: This depends on functions being pure—same input, same output, no hidden side effects.',
        exampleOrAnalogy:
          'If f(2) is always 4, replacing f(2) with 4 everywhere should never break the program.',
        whyItMatters: 'It enables reliable refactoring, testability, and reasoning about code at scale.',
        adaptiveModuleTitle: 'Programming Example',
        adaptiveModuleContent: 'const double = (x:number) => x*2; // double(2) can always be replaced with 4',
        relatedConcepts: ['Referential Transparency', 'Pure Function', 'Monad'],
      };
    }

    return {
      isDemoExplanation: true,
      plainEnglishExplanation:
        'Demo explanation: This is mock analysis only. Secure AI explanation is not enabled in this prototype.',
      missingBackground:
        'Mock analysis: Future secure AI will adapt to your exact selected text and your question without leaving reading flow.',
      exampleOrAnalogy: 'Use this as a placeholder to test navigation, note saving, and concept extraction.',
      whyItMatters: 'This scaffold validates product interaction before integrating real model calls.',
      relatedConcepts: ['Mock analysis', 'Reading comprehension'],
    };
  }

  async answerFollowUp(question: string): Promise<string> {
    return `Demo explanation: Mock follow-up answer for "${question}". Real secure AI follow-up is not enabled yet.`;
  }
}
