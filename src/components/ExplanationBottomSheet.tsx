import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Explanation, TextBlock } from '../types';
import { generateMockFollowUp } from '../lib/mockAi';
import ExplanationCard from './ExplanationCard';
import FollowUpBox from './FollowUpBox';
import { Colors, Typography, Spacing, Radius } from '../theme/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.82;

interface Props {
  visible: boolean;
  block: TextBlock | null;
  explanation: Explanation | null;
  onClose: () => void;
}

export default function ExplanationBottomSheet({
  visible,
  block,
  explanation,
  onClose,
}: Props) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);

  const [followUpAnswer, setFollowUpAnswer] = useState<string | null>(null);
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      setFollowUpAnswer(null);
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 22,
          stiffness: 220,
          mass: 0.8,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SHEET_HEIGHT,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => setModalVisible(false));
    }
  }, [visible]);

  const handleFollowUp = (question: string) => {
    if (!block) return;
    setIsFollowUpLoading(true);
    // Simulate network latency
    setTimeout(() => {
      const answer = generateMockFollowUp(question, block.text);
      setFollowUpAnswer(answer);
      setIsFollowUpLoading(false);
    }, 800);
  };

  if (!modalVisible) return null;

  return (
    <Modal
      transparent
      visible={modalVisible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Overlay */}
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          { transform: [{ translateY }], paddingBottom: insets.bottom + Spacing.md },
        ]}
      >
        {/* Drag handle */}
        <View style={styles.handleRow}>
          <View style={styles.handle} />
        </View>

        {/* Sheet header */}
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Explanation</Text>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>Done</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Selected quote */}
          {block && (
            <View style={styles.quoteBlock}>
              <View style={styles.quoteBar} />
              <Text style={styles.quoteText} numberOfLines={4}>
                {block.text}
              </Text>
            </View>
          )}

          {/* Explanation */}
          {explanation && <ExplanationCard explanation={explanation} />}

          {/* Follow-up */}
          <View style={styles.followUpWrapper}>
            <FollowUpBox
              onSubmit={handleFollowUp}
              answer={followUpAnswer}
              isLoading={isFollowUpLoading}
            />
          </View>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 20,
  },
  handleRow: {
    alignItems: 'center',
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  sheetTitle: {
    fontSize: Typography.fontSizeLG,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textPrimary,
    letterSpacing: 0.1,
  },
  closeBtn: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  closeBtnText: {
    fontSize: Typography.fontSizeMD,
    color: Colors.accent,
    fontWeight: Typography.fontWeightSemiBold,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    gap: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  quoteBlock: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quoteBar: {
    width: 3,
    borderRadius: Radius.full,
    backgroundColor: Colors.textTertiary,
    alignSelf: 'stretch',
    flexShrink: 0,
  },
  quoteText: {
    flex: 1,
    fontSize: Typography.fontSizeSM,
    lineHeight: 22,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  followUpWrapper: {
    marginTop: Spacing.sm,
  },
});
