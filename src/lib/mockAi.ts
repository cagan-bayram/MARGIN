import { Explanation } from '../types';

// ─── Mock explanation ────────────────────────────────────────────────────────
// FUTURE: Replace with real AI call, e.g.
//   const client = new Anthropic();
//   const msg = await client.messages.create({
//     model: 'claude-opus-4-8',
//     max_tokens: 1024,
//     messages: [{ role: 'user', content: buildPrompt(selectedText, fullContext) }],
//   });
export function generateMockExplanation(
  selectedText: string,
  fullContext?: string,
): Explanation {
  const preview = selectedText.slice(0, 60).toLowerCase().replace(/[""]/g, '"');

  return {
    simpleExplanation:
      `The passage "${preview}…" is making the case that ` +
      `ideas don't live in isolation — they depend on a web of prior assumptions ` +
      `that the author takes for granted. Once you spot those assumptions, the ` +
      `whole argument becomes much easier to follow.`,

    keyIdea:
      `The author is arguing that understanding something deeply requires ` +
      `identifying what's being left unsaid. The text is doing more work than ` +
      `it appears to on the surface.`,

    analogy:
      `Think of an iceberg. The sentence you read is the tip — visible and ` +
      `concrete. But the meaning it carries floats on a much larger mass of ` +
      `shared context that sits below the waterline. This passage is asking ` +
      `you to notice the water.`,

    example:
      `Imagine a physics textbook saying "F = ma, therefore the object accelerates." ` +
      `A newcomer might wonder: why "therefore"? The gap in between is filled by ` +
      `Newton's second law — knowledge the author expects you to already hold. ` +
      `This passage works the same way.`,

    whyItMatters:
      `This is one of those load-bearing sentences. Misread it and the next ` +
      `three paragraphs won't quite make sense. Get it right and the rest of ` +
      `the argument clicks into place cleanly.`,
  };
}

// ─── Mock follow-up ──────────────────────────────────────────────────────────
// FUTURE: Replace with a multi-turn conversation call to the AI API,
//   passing prior messages as context alongside the selected text.
export function generateMockFollowUp(
  question: string,
  selectedText: string,
): string {
  const pool = [
    `That's exactly the right thing to push on. The short answer is that the ` +
      `author is using a rhetorical move common in this genre: asserting something ` +
      `confidently to establish authority, then walking it back subtly two pages ` +
      `later. If you keep reading with that in mind, you'll catch it.`,

    `Good instinct. The tension you're feeling is intentional. The author ` +
      `deliberately leaves this ambiguous so that readers from different ` +
      `backgrounds can each find their own entry point. It's not a flaw — ` +
      `it's a feature of the writing style.`,

    `The key is to separate the claim from the evidence. The passage is making ` +
      `a strong claim, but the evidence for it comes earlier in the chapter — ` +
      `which is easy to miss on a first read. Once you go back and find that ` +
      `evidence, the claim stops feeling unsupported.`,

    `Great question. The reason this feels counterintuitive is that we're ` +
      `trained to look for explicit cause-and-effect. But this author is working ` +
      `with emergent patterns — outcomes that nobody caused directly but everyone ` +
      `contributed to. It's a different mode of explanation, and it takes a moment ` +
      `to shift gears.`,
  ];

  const idx = (question.length + selectedText.length) % pool.length;
  return pool[idx];
}
