import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/src/components/AppButton';
import { Card } from '@/src/components/Card';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { listMarginNotes } from '@/src/db/repositories';
import { colors, spacing } from '@/src/theme/tokens';

export function HomeScreen() {
  const [recent, setRecent] = useState<{ id: string; selectedText: string; sourceTitle: string }[]>([]);

  useFocusEffect(
    useCallback(() => {
      listMarginNotes().then((items) => {
        setRecent(items.slice(0, 3).map((item) => ({ id: item.id, selectedText: item.selectedText, sourceTitle: item.sourceTitle })));
      });
    }, []),
  );

  return (
    <ScreenContainer>
      <Text style={styles.title}>MARGIN</Text>
      <Text style={styles.tagline}>Never read past confusion again.</Text>
      <Text style={styles.supporting}>Highlight anything confusing. Understand it instantly. Remember what you learned.</Text>
      <View style={styles.row}>
        <AppButton label="Analyse a Passage" onPress={() => router.push('/(tabs)/library')} />
        <AppButton label="Add a Source" variant="secondary" onPress={() => router.push('/add-source')} />
      </View>

      <Card>
        <Text style={styles.sectionTitle}>Recent Margin Notes</Text>
        {recent.length === 0 ? (
          <Text style={styles.muted}>No notes yet. Capture your first confusing passage to begin.</Text>
        ) : (
          recent.map((item) => (
            <View key={item.id} style={styles.noteRow}>
              <Text style={styles.noteText}>{item.selectedText}</Text>
              <Text style={styles.muted}>{item.sourceTitle}</Text>
            </View>
          ))
        )}
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 36, color: colors.text, fontWeight: '800' },
  tagline: { fontSize: 20, color: colors.accent, fontWeight: '700' },
  supporting: { color: colors.muted, lineHeight: 22 },
  row: { gap: spacing.sm },
  sectionTitle: { color: colors.text, fontWeight: '700', fontSize: 18 },
  muted: { color: colors.muted },
  noteRow: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm },
  noteText: { color: colors.text, fontWeight: '600' },
});
