import { TextBlock } from '../types';

export function splitTextIntoBlocks(rawText: string): TextBlock[] {
  const trimmed = rawText.trim();

  // Try paragraph split first (double newline)
  const paragraphs = trimmed
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\n/g, ' ').trim())
    .filter((p) => p.length > 0);

  if (paragraphs.length > 1) {
    return paragraphs.map((text, index) => ({ id: `block-${index}`, text, index }));
  }

  // Single block of text — split into sentence pairs for readability
  const sentenceMatches = trimmed.match(/[^.!?]+[.!?]+["']?/g);
  if (!sentenceMatches || sentenceMatches.length <= 2) {
    // Short enough to stay as one block
    return [{ id: 'block-0', text: trimmed, index: 0 }];
  }

  const paired: TextBlock[] = [];
  for (let i = 0; i < sentenceMatches.length; i += 2) {
    const text = [sentenceMatches[i], sentenceMatches[i + 1]]
      .filter(Boolean)
      .join(' ')
      .trim();
    if (text) {
      paired.push({ id: `block-${paired.length}`, text, index: paired.length });
    }
  }
  return paired;
}
