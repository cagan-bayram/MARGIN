import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppInput } from '@/src/components/AppInput';
import { Card } from '@/src/components/Card';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { listMarginNotes } from '@/src/db/repositories';
import { NotesEmptyState } from '@/src/features/notes/components/NotesEmptyState';
import { useNotesFiltersStore } from '@/src/store/notesFilters';
import { colors, spacing } from '@/src/theme/tokens';

const categories = ['all', 'history', 'economics', 'philosophy', 'psychology', 'science', 'technology', 'fiction', 'other'] as const;

export function NotesScreen() {
  const [notes, setNotes] = useState<any[]>([]);
  const { search, category, setSearch, setCategory } = useNotesFiltersStore();

  useFocusEffect(
    useCallback(() => {
      listMarginNotes().then(setNotes);
    }, []),
  );

  const filtered = useMemo(
    () =>
      notes.filter((note) => {
        const matchesCategory = category === 'all' || note.sourceCategory === category;
        const query = search.trim().toLowerCase();
        const matchesSearch =
          query.length === 0 ||
          note.selectedText.toLowerCase().includes(query) ||
          note.plainEnglishExplanation.toLowerCase().includes(query) ||
          note.sourceTitle.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
      }),
    [notes, search, category],
  );

  return (
    <ScreenContainer>
      <AppInput placeholder="Search notes" value={search} onChangeText={setSearch} />
      <View style={styles.filters}>
        {categories.map((value) => (
          <Pressable key={value} onPress={() => setCategory(value)} style={[styles.filterChip, category === value && styles.filterChipSelected]}>
            <Text style={[styles.filterText, category === value && styles.filterTextSelected]}>{value}</Text>
          </Pressable>
        ))}
      </View>

      {filtered.length === 0 ? (
        <NotesEmptyState />
      ) : (
        filtered.map((note) => (
          <Pressable key={note.id} onPress={() => router.push({ pathname: '/note/[noteId]', params: { noteId: note.id } })}>
            <Card>
              <Text style={styles.selected}>{note.selectedText}</Text>
              <Text style={styles.preview}>{note.plainEnglishExplanation.slice(0, 120)}...</Text>
              <Text style={styles.meta}>
                {note.sourceTitle} · {new Date(note.savedAt ?? note.createdAt).toLocaleDateString()}
              </Text>
            </Card>
          </Pressable>
        ))
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  filterChip: { borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  filterChipSelected: { backgroundColor: '#473f2a', borderColor: colors.accent },
  filterText: { color: colors.muted, fontSize: 12 },
  filterTextSelected: { color: colors.accent },
  selected: { color: colors.text, fontWeight: '700' },
  preview: { color: colors.muted },
  meta: { color: colors.muted, fontSize: 12 },
});
