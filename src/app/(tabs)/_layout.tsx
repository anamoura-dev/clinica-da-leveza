import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { ColorValue } from 'react-native';

import { Cores, Destaques, Fontes } from '@/constants/theme';

type NomeIcone = keyof typeof Ionicons.glyphMap;

function icone(ativo: NomeIcone, inativo: NomeIcone) {
  return ({ color, focused, size }: { color: ColorValue; focused: boolean; size: number }) => (
    <Ionicons name={focused ? ativo : inativo} size={size} color={color as string} />
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: Cores.textoClaro,
        tabBarLabelStyle: { fontFamily: Fontes.negrito, fontSize: 11 },
        tabBarStyle: {
          backgroundColor: Cores.superficie,
          borderTopColor: Cores.borda,
        },
        sceneStyle: { backgroundColor: Cores.fundo },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hoje',
          tabBarActiveTintColor: Destaques.hoje.escura,
          tabBarIcon: icone('sunny', 'sunny-outline'),
        }}
      />
      <Tabs.Screen
        name="manualeve"
        options={{
          title: 'ManuaLeve',
          tabBarActiveTintColor: Destaques.manualeve.escura,
          tabBarIcon: icone('book', 'book-outline'),
        }}
      />
      <Tabs.Screen
        name="cafe"
        options={{
          title: 'Cafés',
          tabBarActiveTintColor: Destaques.cafe.escura,
          tabBarIcon: icone('cafe', 'cafe-outline'),
        }}
      />
      <Tabs.Screen
        name="fases"
        options={{
          title: 'Fases',
          tabBarActiveTintColor: Destaques.fases.escura,
          tabBarIcon: icone('game-controller', 'game-controller-outline'),
        }}
      />
    </Tabs>
  );
}
