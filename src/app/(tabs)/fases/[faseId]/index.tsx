import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../../../../../lib/supabase';

type Cenario = {
  id: string;
  texto: string;
  ordem: number;
};

export default function ListaCenarios() {
  const { faseId } = useLocalSearchParams<{ faseId: string }>();
  const [cenarios, setCenarios] = useState<Cenario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    buscarCenarios();
  }, [faseId]);

  async function buscarCenarios() {
    setCarregando(true);
    setErro(null);

    const { data, error } = await supabase
      .from('cenarios')
      .select('id, texto, ordem')
      .eq('fase_id', faseId)
      .order('ordem', { ascending: true });

    if (error) {
      setErro(error.message);
    } else {
      setCenarios(data || []);
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
      <FlatList
        data={cenarios}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item, index }) => (
          <Link href={`/fases/${faseId}/${item.id}`} asChild>
            <Pressable style={styles.card}>
              <Text style={styles.cardNumero}>Cenário {index + 1}</Text>
              <Text style={styles.cardTexto}>{item.texto}</Text>
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
  lista: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardNumero: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  cardTexto: {
    fontSize: 16,
  },
  erro: {
    color: 'red',
  },
});