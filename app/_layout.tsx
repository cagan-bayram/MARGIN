import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { initializeDatabase } from '@/src/db/client';
import { colors } from '@/src/theme/tokens';

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initializeDatabase().finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ contentStyle: { backgroundColor: colors.background }, headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.text }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add-source" options={{ title: 'Add Source', presentation: 'modal' }} />
        <Stack.Screen name="source/[sourceId]" options={{ title: 'Source Detail' }} />
        <Stack.Screen name="add-passage/[sourceId]" options={{ title: 'Add Passage', presentation: 'modal' }} />
        <Stack.Screen name="select-confusion/[passageId]" options={{ title: 'Select Confusion', presentation: 'modal' }} />
        <Stack.Screen name="note/[noteId]" options={{ title: 'Margin Note' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
