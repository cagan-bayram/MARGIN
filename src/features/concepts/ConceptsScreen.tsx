import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/src/components/Card';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { listConcepts, listNotesByConcept } from '@/src/db/repositories';
import { colors } from '@/src/theme/tokens';

export function ConceptsScreen() {
  const [concepts, setConcepts] = useState<any[]>([]);
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null);
  const [connectedNotes, setConnectedNotes] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      listConcepts().then(setConcepts);
    }, []),
  );

  const onSelect = async (conceptId: string) => {
    setSelectedConceptId((prev) => (prev === conceptId ? null : conceptId));
    if (selectedConceptId === conceptId) {
      setConnectedNotes([]);
      return;
    }
    const notes = await listNotesByConcept(conceptId);
    setConnectedNotes(notes);
  };

  return (
    <ScreenContainer>
      {concepts.length === 0 ? (
        <Card>
          <Text style={styles.muted}>Concepts will appear as you save demo Margin Notes.</Text>
        </Card>
      ) : (
        concepts.map((concept) => (
          <View key={concept.id}>
            <Pressable onPress={() => onSelect(concept.id)}>
              <Card>
                <Text style={styles.title}>{concept.name}</Text>
                <Text style={styles.muted}>type: {concept.type} · {concept.note_count} notes</Text>
              </Card>
            </Pressable>
            {selectedConceptId === concept.id
              ? connectedNotes.map((note) => (
                  <Card key={note.id}>
                    <Text style={styles.title}>{note.selected_text}</Text>
                    <Text style={styles.muted}>{note.source_title}</Text>
                  </Card>
                ))
              : null}
          </View>
        ))
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontWeight: '700' },
  muted: { color: colors.muted },
});
