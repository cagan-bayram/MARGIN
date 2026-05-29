import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/src/components/AppButton';
import { AppInput } from '@/src/components/AppInput';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { createSource } from '@/src/db/repositories';
import { sourceCategoryOptions, sourceTypeOptions } from '@/src/features/library/constants';
import { newSourceInputSchema } from '@/src/schemas/domain';
import { colors, spacing } from '@/src/theme/tokens';
import type { SourceCategory, SourceType } from '@/src/types/domain';

export function AddSourceScreen() {
  const [title, setTitle] = useState('');
  const [authorOrPublisher, setAuthorOrPublisher] = useState('');
  const [sourceType, setSourceType] = useState<SourceType>('book');
  const [category, setCategory] = useState<SourceCategory>('history');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSave = async () => {
    const parsed = newSourceInputSchema.safeParse({
      title,
      authorOrPublisher: authorOrPublisher || undefined,
      sourceType,
      category,
      notes: notes || undefined,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid input');
      return;
    }

    const source = await createSource(parsed.data);
    router.replace({ pathname: '/source/[sourceId]', params: { sourceId: source.id } });
  };

  return (
    <ScreenContainer>
      <Text style={styles.label}>Title *</Text>
      <AppInput value={title} onChangeText={setTitle} placeholder="Source title" />
      <Text style={styles.label}>Author or Publisher</Text>
      <AppInput value={authorOrPublisher} onChangeText={setAuthorOrPublisher} placeholder="Optional" />
      <Text style={styles.label}>Source Type</Text>
      <View style={styles.chips}>{sourceTypeOptions.map((option) => <Chip key={option} value={option} selected={sourceType === option} onPress={() => setSourceType(option)} />)}</View>
      <Text style={styles.label}>Topic/Category</Text>
      <View style={styles.chips}>{sourceCategoryOptions.map((option) => <Chip key={option} value={option} selected={category === option} onPress={() => setCategory(option)} />)}</View>
      <Text style={styles.label}>Notes</Text>
      <AppInput multiline value={notes} onChangeText={setNotes} placeholder="Optional" style={{ minHeight: 90, textAlignVertical: 'top' }} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <AppButton label="Save Source" onPress={onSave} />
    </ScreenContainer>
  );
}

function Chip({ value, selected, onPress }: { value: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{value}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.text, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chip: { borderRadius: 999, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: colors.surfaceAlt },
  chipSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.text },
  chipTextSelected: { color: '#111', fontWeight: '700' },
  error: { color: colors.danger },
});
