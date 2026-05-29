import { Alert, StyleSheet, Text } from 'react-native';

import { AppButton } from '@/src/components/AppButton';
import { Card } from '@/src/components/Card';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { clearAllData } from '@/src/db/client';
import { colors } from '@/src/theme/tokens';

export function SettingsScreen() {
  const confirmClear = () => {
    Alert.alert('Clear all local data?', 'This will remove sources, passages, notes, concepts, and follow-ups from this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          clearAllData();
          Alert.alert('Done', 'Local data cleared.');
        },
      },
    ]);
  };

  return (
    <ScreenContainer>
      <Card>
        <Text style={styles.title}>MARGIN v0.1.0 (prototype)</Text>
        <Text style={styles.line}>Your reading data is currently stored only on this device.</Text>
        <Text style={styles.line}>Explanations in this prototype are mock content. Real AI analysis is not yet enabled.</Text>
      </Card>
      <AppButton label="Clear all local data" variant="danger" onPress={confirmClear} />
      <Card>
        <Text style={styles.title}>Coming later</Text>
        <Text style={styles.line}>Camera passage scanning</Text>
        <Text style={styles.line}>Secure AI explanations</Text>
        <Text style={styles.line}>Sync across devices</Text>
        <Text style={styles.line}>Premium plan</Text>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontWeight: '700' },
  line: { color: colors.muted },
});
