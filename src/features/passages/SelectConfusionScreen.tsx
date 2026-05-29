import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/src/components/AppButton';
import { AppInput } from '@/src/components/AppInput';
import { Card } from '@/src/components/Card';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { createExplanationRequest, getPassageById, saveMarginNote } from '@/src/db/repositories';
import { explanationModeOptions } from '@/src/features/passages/options';
import { explanationService } from '@/src/services/explanation';
import { newExplanationRequestInputSchema } from '@/src/schemas/domain';
import { colors, spacing } from '@/src/theme/tokens';
import type { ExplanationMode, Passage } from '@/src/types/domain';
import { nowIso } from '@/src/utils/id';

export function SelectConfusionScreen() {
  const { passageId } = useLocalSearchParams<{ passageId: string }>();
  const [passage, setPassage] = useState<Passage | null>(null);
  const [selectedText, setSelectedText] = useState('');
  const [mode, setMode] = useState<ExplanationMode>('explain_simply');
  const [customQuestion, setCustomQuestion] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!passageId) return;
    getPassageById(passageId).then(setPassage);
  }, [passageId]);

  const onExplain = async () => {
    if (!passage) return;

    const parsed = newExplanationRequestInputSchema.safeParse({
      passageId: passage.id,
      selectedText,
      mode,
      customQuestion: customQuestion || undefined,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid input');
      return;
    }

    const request = await createExplanationRequest(parsed.data);
    const generated = await explanationService.generate({
      passageExcerpt: passage.excerpt,
      selectedText: request.selectedText,
      mode: request.mode,
      customQuestion: request.customQuestion,
    });

    const note = await saveMarginNote({
      sourceId: passage.sourceId,
      passageId: passage.id,
      explanationRequestId: request.id,
      isDemoExplanation: true,
      plainEnglishExplanation: generated.plainEnglishExplanation,
      missingBackground: generated.missingBackground,
      exampleOrAnalogy: generated.exampleOrAnalogy,
      whyItMatters: generated.whyItMatters,
      adaptiveModuleTitle: generated.adaptiveModuleTitle,
      adaptiveModuleContent: generated.adaptiveModuleContent,
      relatedConcepts: generated.relatedConcepts,
      savedAt: nowIso(),
    });

    router.replace({ pathname: '/note/[noteId]', params: { noteId: note.id } });
  };

  if (!passage) {
    return (
      <ScreenContainer>
        <Text style={styles.text}>Passage not found.</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Card>
        <Text style={styles.text}>{passage.excerpt}</Text>
      </Card>
      <Text style={styles.label}>Selected confusing text *</Text>
      <AppInput value={selectedText} onChangeText={setSelectedText} placeholder="What exactly do you want explained?" />
      <Text style={styles.helper}>What exactly do you want explained?</Text>
      <Text style={styles.label}>Explanation mode</Text>
      <View style={styles.chips}>
        {explanationModeOptions.map((option) => (
          <Pressable key={option.value} onPress={() => setMode(option.value)} style={[styles.chip, mode === option.value && styles.chipSelected]}>
            <Text style={[styles.chipText, mode === option.value && styles.chipTextSelected]}>{option.label}</Text>
          </Pressable>
        ))}
      </View>
      {mode === 'custom_question' ? <AppInput value={customQuestion} onChangeText={setCustomQuestion} placeholder="Ask your own question" /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <AppButton label="Explain This" onPress={onExplain} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  text: { color: colors.text, lineHeight: 22 },
  label: { color: colors.text, fontWeight: '600' },
  helper: { color: colors.muted },
  chips: { gap: spacing.xs },
  chip: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: spacing.sm, backgroundColor: colors.surfaceAlt },
  chipSelected: { borderColor: colors.accent, backgroundColor: '#473f2a' },
  chipText: { color: colors.text },
  chipTextSelected: { color: colors.accent, fontWeight: '700' },
  error: { color: colors.danger },
});
