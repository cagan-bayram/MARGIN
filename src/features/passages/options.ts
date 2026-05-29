import type { ExplanationMode } from '@/src/types/domain';

export const explanationModeOptions: { value: ExplanationMode; label: string }[] = [
  { value: 'explain_simply', label: 'Explain simply' },
  { value: 'missing_background', label: 'What background am I missing?' },
  { value: 'why_does_this_follow', label: 'Why does this follow?' },
  { value: 'give_example', label: 'Give an example' },
  { value: 'argument_breakdown', label: 'Break down the argument' },
  { value: 'define_term', label: 'Define this term' },
  { value: 'custom_question', label: 'Ask my own question' },
];
