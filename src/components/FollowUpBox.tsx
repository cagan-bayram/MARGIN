import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../theme/colors';

interface Props {
  onSubmit: (question: string) => void;
  answer: string | null;
  isLoading: boolean;
}

export default function FollowUpBox({ onSubmit, answer, isLoading }: Props) {
  const [question, setQuestion] = useState('');

  const handleAsk = () => {
    const trimmed = question.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setQuestion('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ask a follow-up</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="What did you mean by…?"
          placeholderTextColor={Colors.textTertiary}
          value={question}
          onChangeText={setQuestion}
          multiline
          maxLength={400}
          returnKeyType="send"
          onSubmitEditing={handleAsk}
          blurOnSubmit
        />
        <Pressable
          style={({ pressed }) => [
            styles.askButton,
            pressed && styles.askButtonPressed,
            (!question.trim() || isLoading) && styles.askButtonDisabled,
          ]}
          onPress={handleAsk}
          disabled={!question.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Text style={styles.askButtonText}>Ask</Text>
          )}
        </Pressable>
      </View>

      {answer && (
        <View style={styles.answerContainer}>
          <View style={styles.answerBar} />
          <Text style={styles.answerText}>{answer}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: Typography.fontSizeSM,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: Typography.fontSizeMD,
    color: Colors.textPrimary,
    minHeight: 44,
    maxHeight: 100,
  },
  askButton: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 56,
  },
  askButtonPressed: {
    opacity: 0.85,
  },
  askButtonDisabled: {
    backgroundColor: Colors.textTertiary,
  },
  askButtonText: {
    fontSize: Typography.fontSizeMD,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.white,
  },
  answerContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.accentSurface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.accentBorder,
  },
  answerBar: {
    width: 3,
    borderRadius: Radius.full,
    backgroundColor: Colors.accent,
    alignSelf: 'stretch',
    flexShrink: 0,
  },
  answerText: {
    flex: 1,
    fontSize: Typography.fontSizeMD,
    lineHeight: Typography.lineHeightBody,
    color: Colors.textPrimary,
  },
});
