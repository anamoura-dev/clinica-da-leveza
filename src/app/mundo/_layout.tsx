import { Stack } from 'expo-router';

import { opcoesDaPilha } from '@/components/navegacao';
import { Cores } from '@/constants/theme';

export default function LayoutMundo() {
  return (
    <Stack screenOptions={opcoesDaPilha(Cores.amareloEscuro)}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="sentimento/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="desenhar" options={{ title: 'DESENHAR' }} />
    </Stack>
  );
}
