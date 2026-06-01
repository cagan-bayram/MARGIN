import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Colors, Typography, Spacing, Radius } from '../theme/colors';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PasteText'>;
};

const SAMPLE_TEXT = `The market economy operates through a decentralized mechanism of prices and voluntary exchange. Unlike central planning, where a single authority attempts to gather and process all relevant economic information, market prices aggregate the dispersed knowledge held by millions of individuals.

Friedrich Hayek argued that this price system performs an epistemic miracle. No single mind — however brilliant — could ever possess the totality of knowledge required to plan an entire economy. Prices condense complex information about scarcity, demand, and productive capacity into a single signal that guides human behavior without anyone needing to understand the whole picture.

This is why market economies tend to be more adaptive than planned economies. When circumstances change — a new technology emerges, a resource becomes scarce, consumer tastes shift — prices adjust almost instantaneously, sending signals throughout the system that prompt actors to change their behavior accordingly.`;

export default function PasteTextScreen({ navigation }: Props) {
  const [text, setText] = useState('');
  const [showError, setShowError] = useState(false);

  const handleLoad = () => {
    if (!text.trim()) {
      setShowError(true);
      return;
    }
    navigation.navigate('Reader', { text: text.trim() });
  };

  const handleLoadSample = () => {
    setText(SAMPLE_TEXT);
    setShowError(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backText}>← Back</Text>
            </Pressable>
            <Text style={styles.title}>Paste Text</Text>
            <Pressable onPress={handleLoadSample} style={styles.sampleBtn}>
              <Text style={styles.sampleText}>Try sample</Text>
            </Pressable>
          </View>

          <Text style={styles.hint}>
            Paste any text you want to understand — a book passage, article, lecture
            note, or essay excerpt.
          </Text>

          {/* Input */}
          <View style={[styles.inputWrapper, showError && styles.inputWrapperError]}>
            <TextInput
              style={styles.input}
              placeholder="Paste a paragraph, article, lecture note, or book excerpt…"
              placeholderTextColor={Colors.textTertiary}
              value={text}
              onChangeText={(t) => {
                setText(t);
                if (showError) setShowError(false);
              }}
              multiline
              textAlignVertical="top"
              autoFocus={false}
              scrollEnabled={false}
            />
          </View>

          {showError && (
            <Text style={styles.errorText}>Please paste some text before loading.</Text>
          )}

          {text.trim().length > 0 && (
            <Text style={styles.charCount}>{text.trim().length} characters</Text>
          )}

          {/* Load button */}
          <Pressable
            style={({ pressed }) => [styles.loadBtn, pressed && styles.loadBtnPressed]}
            onPress={handleLoad}
          >
            <Text style={styles.loadBtnText}>Load Text</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    gap: Spacing.md,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  backText: {
    fontSize: Typography.fontSizeMD,
    color: Colors.accent,
    fontWeight: Typography.fontWeightMedium,
  },
  title: {
    fontSize: Typography.fontSizeLG,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },
  sampleBtn: {
    padding: Spacing.xs,
  },
  sampleText: {
    fontSize: Typography.fontSizeSM,
    color: Colors.accent,
    fontWeight: Typography.fontWeightMedium,
  },
  hint: {
    fontSize: Typography.fontSizeSM,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  inputWrapper: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 260,
    padding: Spacing.md,
  },
  inputWrapperError: {
    borderColor: Colors.errorText,
  },
  input: {
    flex: 1,
    fontSize: Typography.fontSizeMD,
    lineHeight: Typography.lineHeightBody,
    color: Colors.textPrimary,
    minHeight: 220,
  },
  errorText: {
    fontSize: Typography.fontSizeSM,
    color: Colors.errorText,
    marginTop: -Spacing.xs,
  },
  charCount: {
    fontSize: Typography.fontSizeXS,
    color: Colors.textTertiary,
    textAlign: 'right',
    marginTop: -Spacing.xs,
  },
  loadBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
    marginTop: Spacing.sm,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  loadBtnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  loadBtnText: {
    fontSize: Typography.fontSizeLG,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.white,
  },
});
