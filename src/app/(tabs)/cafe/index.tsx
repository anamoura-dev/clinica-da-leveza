import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../../../../lib/supabase';

type Cafe = {
  id: string;
  titulo: string;
  gancho: string | null;
};

export default function ListaCafes() {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    buscarCafes();
  }, []);

  async function buscarCafes() {
    setCarregando(true);
    setErro(null);

    const { data, error } = await supabase
      .from('content')
      .select('id, titulo, gancho')
      .eq('tipo', 'cafe')
      .eq('publicado', true)
      .order('ordem', { ascending: true });

    if (error) {
      setErro(error.message);
    } else {
      setCafes(data || []);
    }

    setCarregando(false);
  }

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.centro}>
        <Text style={styles.erro}>Erro: {erro}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>☕ Cafés</Text>
      <FlatList
        data={cafes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <Link href={`/cafe/${item.id}`} asChild>
            <Pressable style={styles.card}>
              <Text style={styles.cardTitulo}>{item.titulo}</Text>
              {item.gancho && <Text style={styles.cardGancho}>{item.gancho}</Text>}
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  lista: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardGancho: {
    fontSize: 14,
    color: '#666',
  },
  erro: {
    color: 'red',
  },
});