import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { Explanation, TextBlock } from '../types';
import { splitTextIntoBlocks } from '../utils/splitText';
import { generateMockExplanation } from '../lib/mockAi';
import ReadingBlock from '../components/ReadingBlock';
import ExplanationBottomSheet from '../components/ExplanationBottomSheet';
import { Colors, Typography, Spacing, Radius } from '../theme/colors';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Reader'>;
  route: RouteProp<RootStackParamList, 'Reader'>;
};

export default function ReaderScreen({ navigation, route }: Props) {
  const { text } = route.params;

  const blocks = useMemo(() => splitTextIntoBlocks(text), [text]);

  const [selectedBlock, setSelectedBlock] = useState<TextBlock | null>(null);
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  const handleBlockPress = (block: TextBlock) => {
    setSelectedBlock(block);
    const exp = generateMockExplanation(block.text, text);
    setExplanation(exp);
    setSheetVisible(true);
  };

  const handleCloseSheet = () => {
    setSheetVisible(false);
  };

  const previewTitle = text.slice(0, 36).trim() + (text.length > 36 ? '…' : '');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {previewTitle}
        </Text>
        <View style={styles.blockCount}>
          <Text style={styles.blockCountText}>{blocks.length} blocks</Text>
        </View>
      </View>

      {/* Tap hint */}
      <View style={styles.hintBar}>
        <Text style={styles.hintText}>Tap any block to get an explanation</Text>
      </View>

      {/* Reading content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {blocks.map((block) => (
          <ReadingBlock
            key={block.id}
            block={block}
            isSelected={selectedBlock?.id === block.id && sheetVisible}
            onPress={handleBlockPress}
          />
        ))}

        {/* Bottom spacer so last block isn't clipped by safe area */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Explanation bottom sheet */}
      <ExplanationBottomSheet
        visible={sheetVisible}
        block={selectedBlock}
        explanation={explanation}
        onClose={handleCloseSheet}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  backText: {
    fontSize: Typography.fontSizeMD,
    color: Colors.accent,
    fontWeight: Typography.fontWeightMedium,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: Typography.fontSizeSM,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeightMedium,
    marginHorizontal: Spacing.sm,
  },
  blockCount: {
    backgroundColor: Colors.surfaceRaised,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  blockCountText: {
    fontSize: Typography.fontSizeXS,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeightMedium,
  },
  hintBar: {
    backgroundColor: Colors.accentSurface,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.accentBorder,
    alignItems: 'center',
  },
  hintText: {
    fontSize: Typography.fontSizeXS,
    color: Colors.accent,
    fontWeight: Typography.fontWeightMedium,
    letterSpacing: 0.3,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  bottomSpacer: {
    height: Spacing.xxl,
  },
});
