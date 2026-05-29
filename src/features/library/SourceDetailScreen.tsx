import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { AppButton } from '@/src/components/AppButton';
import { Card } from '@/src/components/Card';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { getSourceById, listMarginNotesBySource } from '@/src/db/repositories';
import { colors } from '@/src/theme/tokens';

export function SourceDetailScreen() {
  const { sourceId } = useLocalSearchParams<{ sourceId: string }>();
  const [source, setSource] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!sourceId) return;
      getSourceById(sourceId).then(setSource);
      listMarginNotesBySource(sourceId).then(setNotes);
    }, [sourceId]),
  );

  if (!source) {
    return (
      <ScreenContainer>
        <Text style={styles.meta}>Source not found.</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Card>
        <Text style={styles.title}>{source.title}</Text>
        {source.authorOrPublisher ? <Text style={styles.meta}>{source.authorOrPublisher}</Text> : null}
        <Text style={styles.meta}>{source.sourceType} · {source.category}</Text>
        {source.notes ? <Text style={styles.meta}>{source.notes}</Text> : null}
      </Card>

      <AppButton label="Add Confusing Passage" onPress={() => router.push({ pathname: '/add-passage/[sourceId]', params: { sourceId } })} />

      <Card>
        <Text style={styles.sectionTitle}>Saved Margin Notes</Text>
        {notes.length === 0 ? (
          <Text style={styles.meta}>No notes for this source yet.</Text>
        ) : (
          notes.map((note) => (
            <Pressable key={note.id} onPress={() => router.push({ pathname: '/note/[noteId]', params: { noteId: note.id } })}>
              <Text style={styles.noteLine}>{note.plainEnglishExplanation.slice(0, 90)}...</Text>
            </Pressable>
          ))
        )}
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 20, fontWeight: '700' },
  meta: { color: colors.muted },
  sectionTitle: { color: colors.text, fontWeight: '700', fontSize: 18 },
  noteLine: { color: colors.text, paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.border },
});
