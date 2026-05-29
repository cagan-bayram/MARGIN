import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { AppButton } from '@/src/components/AppButton';
import { Card } from '@/src/components/Card';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { listSources } from '@/src/db/repositories';
import { colors } from '@/src/theme/tokens';

export function LibraryScreen() {
  const [sources, setSources] = useState<{ id: string; title: string; sourceType: string; authorOrPublisher?: string; marginNoteCount: number }[]>([]);

  useFocusEffect(
    useCallback(() => {
      listSources().then(setSources);
    }, []),
  );

  return (
    <ScreenContainer>
      <AppButton label="Add Source" onPress={() => router.push('/add-source')} />
      {sources.length === 0 ? (
        <Card>
          <Text style={styles.empty}>No sources yet. Add a book, article, or paper to begin.</Text>
        </Card>
      ) : (
        sources.map((source) => (
          <Pressable key={source.id} onPress={() => router.push({ pathname: '/source/[sourceId]', params: { sourceId: source.id } })}>
            <Card>
              <Text style={styles.title}>{source.title}</Text>
              {source.authorOrPublisher ? <Text style={styles.meta}>{source.authorOrPublisher}</Text> : null}
              <Text style={styles.meta}>{source.sourceType} · {source.marginNoteCount} notes</Text>
            </Card>
          </Pressable>
        ))
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  empty: { color: colors.muted },
  title: { color: colors.text, fontSize: 17, fontWeight: '700' },
  meta: { color: colors.muted },
});
