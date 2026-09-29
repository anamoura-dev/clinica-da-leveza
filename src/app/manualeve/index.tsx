import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../../../lib/supabase';

type Situacao = {
  id: string;
  rotulo: string;
  emoji: string | null;
};

export default function ManuaLeve() {
  const [situacoes, setSituacoes] = useState<Situacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    buscarSituacoes();
  }, []);

  async function buscarSituacoes() {
    setCarregando(true);
    setErro(null);

    const { data, error } = await supabase
      .from('manualeve_situacoes')
      .select('id, rotulo, emoji')
      .eq('ativa', true)
      .order('ordem', { ascending: true });

    if (error) {
      setErro(error.message);
    } else {
      setSituacoes(data || []);
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
      <Text style={styles.titulo}>Meu filho não quer...</Text>
      <FlatList
        data={situacoes}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <Link href={`/manualeve/${item.id}`} asChild>
            <Pressable style={styles.card}>
              <Text style={styles.emoji}>{item.emoji}</Text>
              <Text style={styles.rotulo}>{item.rotulo}</Text>
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
    paddingHorizontal: 12,
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  lista: {
    paddingBottom: 24,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  erro: {
    color: 'red',
  },
});