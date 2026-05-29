import { StyleSheet, Text } from 'react-native';

import { Card } from '@/src/components/Card';
import { colors } from '@/src/theme/tokens';

export function NotesEmptyState() {
  return (
    <Card>
      <Text style={styles.text}>When a passage confuses you, resolve it here instead of reading past it.</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  text: { color: colors.muted },
});
