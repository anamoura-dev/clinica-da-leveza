import { Stack } from 'expo-router';

import { opcoesDaPilha } from '@/components/navegacao';
import { Destaques } from '@/constants/theme';

export default function Layout() {
  return (
    <Stack screenOptions={opcoesDaPilha(Destaques.cafe.escura)}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
