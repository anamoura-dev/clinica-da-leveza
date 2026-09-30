import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { ColorValue } from 'react-native';

import { barraAbasEscondida, estiloBarraAbas } from '@/components/navegacao';
import { Cores, Destaques, Fontes } from '@/constants/theme';

type NomeIcone = keyof typeof Ionicons.glyphMap;

function icone(ativo: NomeIcone, inativo: NomeIcone) {
  return function IconeDaAba({ color, focused, size }: { color: ColorValue; focused: boolean; size: number }) {
    return <Ionicons name={focused ? ativo : inativo} size={size} color={color as string} />;
  };
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: Cores.textoClaro,
        tabBarLabelStyle: { fontFamily: Fontes.negrito, fontSize: 11 },
        tabBarStyle: estiloBarraAbas,
        sceneStyle: { backgroundColor: Cores.fundo },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          // A Home abre com a paulada em tela cheia; a barra aparece ao arrastar.
          tabBarStyle: barraAbasEscondida,
          tabBarActiveTintColor: Destaques.hoje.escura,
          tabBarIcon: icone('home', 'home-outline'),
        }}
      />
      <Tabs.Screen
        name="cafe"
        options={{
          title: 'Café',
          tabBarActiveTintColor: Destaques.cafe.escura,
          tabBarIcon: icone('cafe', 'cafe-outline'),
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
        name="fases"
        options={{
          title: 'Jogos',
          tabBarActiveTintColor: Destaques.fases.escura,
          tabBarIcon: icone('game-controller', 'game-controller-outline'),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarActiveTintColor: Destaques.hoje.escura,
          tabBarIcon: icone('person', 'person-outline'),
        }}
      />
    </Tabs>
  );
}
