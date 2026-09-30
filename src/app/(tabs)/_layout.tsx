import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hoje',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="manualeve"
        options={{
          title: 'ManuaLeve',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🧰</Text>,
        }}
      />
      <Tabs.Screen
        name="cafe"
        options={{
          title: 'Cafés',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>☕</Text>,
        }}
      />
      <Tabs.Screen
        name="fases"
        options={{
          title: 'Fases',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🎮</Text>,
        }}
      />
    </Tabs>
  );
}
