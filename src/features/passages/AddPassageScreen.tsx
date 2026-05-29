import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { AppButton } from '@/src/components/AppButton';
import { AppInput } from '@/src/components/AppInput';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { createPassage } from '@/src/db/repositories';
import { newPassageInputSchema } from '@/src/schemas/domain';
import { colors } from '@/src/theme/tokens';

export function AddPassageScreen() {
  const { sourceId } = useLocalSearchParams<{ sourceId: string }>();
  const [excerpt, setExcerpt] = useState('');
  const [pageOrLocation, setPageOrLocation] = useState('');
  const [chapterOrSection, setChapterOrSection] = useState('');
  const [initialQuestion, setInitialQuestion] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onContinue = async () => {
    const parsed = newPassageInputSchema.safeParse({
      sourceId,
      excerpt,
      pageOrLocation: pageOrLocation || undefined,
      chapterOrSection: chapterOrSection || undefined,
      initialQuestion: initialQuestion || undefined,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid input');
      return;
    }

    const passage = await createPassage(parsed.data);
    router.replace({ pathname: '/select-confusion/[passageId]', params: { passageId: passage.id } });
  };

  return (
    <ScreenContainer>
      <Text style={styles.label}>Passage excerpt *</Text>
      <AppInput multiline value={excerpt} onChangeText={setExcerpt} maxLength={1500} style={styles.large} placeholder="Paste up to 1,500 characters" />
      <Text style={styles.helper}>{excerpt.length}/1500</Text>
      <Text style={styles.label}>Page or location</Text>
      <AppInput value={pageOrLocation} onChangeText={setPageOrLocation} placeholder="Optional" />
      <Text style={styles.label}>Chapter/section</Text>
      <AppInput value={chapterOrSection} onChangeText={setChapterOrSection} placeholder="Optional" />
      <Text style={styles.label}>What specifically is confusing here?</Text>
      <AppInput value={initialQuestion} onChangeText={setInitialQuestion} placeholder="Optional" />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <AppButton label="Continue" onPress={onContinue} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.text, fontWeight: '600' },
  helper: { color: colors.muted },
  large: { minHeight: 140, textAlignVertical: 'top' },
  error: { color: colors.danger },
});
