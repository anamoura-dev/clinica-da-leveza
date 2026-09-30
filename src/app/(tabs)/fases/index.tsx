import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../../../../lib/supabase';

type Fase = {
  id: string;
  titulo: string;
  tema: string | null;
};

export default function ListaFases() {
  const [fases, setFases] = useState<Fase[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    buscarFases();
  }, []);

  async function buscarFases() {
    setCarregando(true);
    setErro(null);

    const { data, error } = await supabase
      .from('fases')
      .select('id, titulo, tema')
      .eq('ativa', true)
      .order('ordem', { ascending: true });

    if (error) {
      setErro(error.message);
    } else {
      setFases(data || []);
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
      <Text style={styles.titulo}>🎮 Passa de Fase</Text>
      <FlatList
        data={fases}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <Link href={`/fases/${item.id}`} asChild>
            <Pressable style={styles.card}>
              <Text style={styles.cardTitulo}>{item.titulo}</Text>
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
  },
  erro: {
    color: 'red',
  },
});