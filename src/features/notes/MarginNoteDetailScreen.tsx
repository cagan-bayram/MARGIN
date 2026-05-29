import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { AppButton } from '@/src/components/AppButton';
import { AppInput } from '@/src/components/AppInput';
import { Card } from '@/src/components/Card';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { createFollowUpQuestion, getMarginNoteDetail } from '@/src/db/repositories';
import { explanationService } from '@/src/services/explanation';
import { colors } from '@/src/theme/tokens';

export function MarginNoteDetailScreen() {
  const { noteId } = useLocalSearchParams<{ noteId: string }>();
  const [detail, setDetail] = useState<any>(null);
  const [followUpInput, setFollowUpInput] = useState('');

  const refresh = useCallback(() => {
    if (!noteId) return;
    getMarginNoteDetail(noteId).then(setDetail);
  }, [noteId]);

  useFocusEffect(refresh);

  if (!detail) {
    return (
      <ScreenContainer>
        <Text style={styles.muted}>Margin note not found.</Text>
      </ScreenContainer>
    );
  }

  const { note, source, passage, request, followUps } = detail;

  const onAskFollowUp = async () => {
    if (!followUpInput.trim()) return;
    const answer = await explanationService.answerFollowUp(followUpInput.trim());
    await createFollowUpQuestion({ marginNoteId: note.id, question: followUpInput.trim(), answer, isDemoAnswer: true });
    setFollowUpInput('');
    refresh();
  };

  return (
    <ScreenContainer>
      <Card>
        <Text style={styles.badge}>Demo Explanation</Text>
        <Text style={styles.text}>{passage.excerpt}</Text>
        <Text style={styles.section}>Confusing text: {request.selectedText}</Text>
        <Text style={styles.muted}>{source.title}{passage.pageOrLocation ? ` · ${passage.pageOrLocation}` : ''}</Text>
      </Card>

      <Card>
        <Text style={styles.section}>Plain-English Explanation</Text>
        <Text style={styles.text}>{note.plainEnglishExplanation}</Text>
        {note.missingBackground ? <><Text style={styles.section}>What You Were Missing</Text><Text style={styles.text}>{note.missingBackground}</Text></> : null}
        {note.exampleOrAnalogy ? <><Text style={styles.section}>Example or Analogy</Text><Text style={styles.text}>{note.exampleOrAnalogy}</Text></> : null}
        {note.whyItMatters ? <><Text style={styles.section}>Why It Matters</Text><Text style={styles.text}>{note.whyItMatters}</Text></> : null}
        {note.adaptiveModuleTitle && note.adaptiveModuleContent ? <><Text style={styles.section}>{note.adaptiveModuleTitle}</Text><Text style={styles.text}>{note.adaptiveModuleContent}</Text></> : null}
        <Text style={styles.section}>Related Concepts</Text>
        <Text style={styles.text}>{note.relatedConcepts.join(', ')}</Text>
      </Card>

      <Card>
        <Text style={styles.section}>Ask Follow-up Question (Demo)</Text>
        <AppInput value={followUpInput} onChangeText={setFollowUpInput} placeholder="Ask a follow-up" />
        <AppButton label="Ask Follow-up Question" onPress={onAskFollowUp} variant="secondary" />
        {followUps.map((fup: any) => (
          <Text key={fup.id} style={styles.text}>Q: {fup.question}\nA: {fup.answer}</Text>
        ))}
      </Card>

      <AppButton label="Save Margin Note" onPress={() => router.push('/(tabs)/notes')} />
      <AppButton label="Return to Source" variant="secondary" onPress={() => router.replace({ pathname: '/source/[sourceId]', params: { sourceId: source.id } })} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  badge: { color: '#111', backgroundColor: colors.accent, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start', fontWeight: '800' },
  section: { color: colors.accent, fontWeight: '700', marginTop: 8 },
  text: { color: colors.text, lineHeight: 21 },
  muted: { color: colors.muted },
});
