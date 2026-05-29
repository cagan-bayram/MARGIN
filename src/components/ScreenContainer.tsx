import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/src/theme/tokens';

type ScreenContainerProps = PropsWithChildren<{ scroll?: boolean }>;

export function ScreenContainer({ children, scroll = true }: ScreenContainerProps) {
  const content = <View style={styles.inner}>{children}</View>;

  if (!scroll) {
    return <View style={styles.container}>{content}</View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {content}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: spacing.xl },
  inner: { padding: spacing.md, gap: spacing.md },
});
