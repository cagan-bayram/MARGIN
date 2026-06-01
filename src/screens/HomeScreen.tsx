import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Colors, Typography, Spacing, Radius } from '../theme/colors';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.container}>
        {/* Top badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>AI Reading Companion</Text>
        </View>

        {/* Hero text */}
        <View style={styles.hero}>
          <Text style={styles.appName}>MARGIN</Text>
          <Text style={styles.headline}>Understand anything{'\n'}you read.</Text>
          <Text style={styles.subheadline}>
            Paste text, tap the confusing part,{'\n'}and get instant clarity.
          </Text>
        </View>

        {/* Feature chips */}
        <View style={styles.chips}>
          {['Books', 'Articles', 'Lectures', 'Essays', 'Papers'].map((label) => (
            <View key={label} style={styles.chip}>
              <Text style={styles.chipText}>{label}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <Pressable
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          onPress={() => navigation.navigate('PasteText')}
        >
          <Text style={styles.ctaText}>Start Reading</Text>
        </Pressable>

        {/* Footer note */}
        <Text style={styles.footnote}>No account required · Works offline*</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accentSurface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.accentBorder,
  },
  badgeText: {
    fontSize: Typography.fontSizeXS,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.accent,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  hero: {
    gap: Spacing.sm,
  },
  appName: {
    fontSize: Typography.fontSizeHero,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textPrimary,
    letterSpacing: 6,
    marginBottom: Spacing.xs,
  },
  headline: {
    fontSize: Typography.fontSizeXL,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textPrimary,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  subheadline: {
    fontSize: Typography.fontSizeLG,
    color: Colors.textSecondary,
    lineHeight: 26,
    fontWeight: Typography.fontWeightRegular,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  chip: {
    backgroundColor: Colors.surfaceRaised,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.xs + 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipText: {
    fontSize: Typography.fontSizeSM,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeightMedium,
  },
  cta: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  ctaText: {
    fontSize: Typography.fontSizeLG,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.white,
    letterSpacing: 0.2,
  },
  footnote: {
    textAlign: 'center',
    fontSize: Typography.fontSizeXS,
    color: Colors.textTertiary,
    letterSpacing: 0.3,
  },
});
