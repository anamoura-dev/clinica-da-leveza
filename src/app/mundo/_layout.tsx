import { Stack } from 'expo-router';

import { opcoesDaPilha } from '@/components/navegacao';
import { Cores } from '@/constants/theme';

export default function LayoutMundo() {
  return (
    <Stack screenOptions={opcoesDaPilha(Cores.pessegoEscuro)}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="desenhar" options={{ title: 'Desenhar' }} />
    </Stack>
  );
}
