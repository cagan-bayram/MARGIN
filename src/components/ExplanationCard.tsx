import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Explanation } from '../types';
import { Colors, Typography, Spacing, Radius } from '../theme/colors';

interface SectionProps {
  label: string;
  emoji: string;
  content: string;
}

function Section({ label, emoji, content }: SectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEmoji}>{emoji}</Text>
        <Text style={styles.sectionLabel}>{label}</Text>
      </View>
      <Text style={styles.sectionContent}>{content}</Text>
    </View>
  );
}

interface Props {
  explanation: Explanation;
}

export default function ExplanationCard({ explanation }: Props) {
  return (
    <View style={styles.container}>
      <Section
        label="Simple explanation"
        emoji="💡"
        content={explanation.simpleExplanation}
      />
      <View style={styles.divider} />
      <Section
        label="Key idea"
        emoji="🔑"
        content={explanation.keyIdea}
      />
      <View style={styles.divider} />
      <Section
        label="Analogy"
        emoji="🧩"
        content={explanation.analogy}
      />
      <View style={styles.divider} />
      <Section
        label="Example"
        emoji="📌"
        content={explanation.example}
      />
      <View style={styles.divider} />
      <Section
        label="Why it matters"
        emoji="🎯"
        content={explanation.whyItMatters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  section: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  sectionEmoji: {
    fontSize: Typography.fontSizeMD,
  },
  sectionLabel: {
    fontSize: Typography.fontSizeSM,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionContent: {
    fontSize: Typography.fontSizeMD,
    lineHeight: Typography.lineHeightBody,
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: Spacing.md,
  },
});
