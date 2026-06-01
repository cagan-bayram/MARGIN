import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { TextBlock } from '../types';
import { Colors, Typography, Spacing, Radius } from '../theme/colors';

interface Props {
  block: TextBlock;
  isSelected: boolean;
  onPress: (block: TextBlock) => void;
}

export default function ReadingBlock({ block, isSelected, onPress }: Props) {
  return (
    <Pressable
      onPress={() => onPress(block)}
      style={({ pressed }) => [
        styles.container,
        isSelected && styles.selected,
        pressed && !isSelected && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Paragraph ${block.index + 1}. Tap to explain.`}
    >
      {isSelected && <View style={styles.selectedBar} />}
      <Text style={[styles.text, isSelected && styles.textSelected]}>
        {block.text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  selected: {
    backgroundColor: Colors.selectedBg,
    borderColor: Colors.selectedBorder,
  },
  pressed: {
    backgroundColor: Colors.surfaceRaised,
  },
  selectedBar: {
    width: 3,
    borderRadius: Radius.full,
    backgroundColor: Colors.accent,
    alignSelf: 'stretch',
    flexShrink: 0,
  },
  text: {
    flex: 1,
    fontSize: Typography.fontSizeMD,
    lineHeight: Typography.lineHeightBody,
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeightRegular,
    letterSpacing: 0.1,
  },
  textSelected: {
    color: Colors.textPrimary,
  },
});
