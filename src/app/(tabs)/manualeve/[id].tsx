import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../../../../lib/supabase';

type Entrada = {
  o_que_pode_estar_acontecendo: string;
  o_que_evitar: string;
  o_que_fazer_hoje: string;
  quando_investigar_mais: string;
};

export default function ResultadoManuaLeve() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [entrada, setEntrada] = useState<Entrada | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    buscarEntrada();
  }, [id]);

  async function buscarEntrada() {
    setCarregando(true);
    setErro(null);

    const { data, error } = await supabase
      .from('manualeve_entradas')
      .select('o_que_pode_estar_acontecendo, o_que_evitar, o_que_fazer_hoje, quando_investigar_mais')
      .eq('situacao_id', id)
      .limit(1)
      .maybeSingle();

    if (error) {
      setErro(error.message);
    } else if (!data) {
      setErro('Ainda não há conteúdo para essa situação.');
    } else {
      setEntrada(data);
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

  if (erro || !entrada) {
    return (
      <View style={styles.centro}>
        <Text style={styles.erro}>{erro}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Text style={styles.secaoTitulo}>O que pode estar acontecendo</Text>
      <Text style={styles.texto}>{entrada.o_que_pode_estar_acontecendo}</Text>

      <Text style={styles.secaoTitulo}>O que evitar</Text>
      <Text style={styles.texto}>{entrada.o_que_evitar}</Text>

      <Text style={styles.secaoTitulo}>O que você pode fazer hoje</Text>
      <Text style={styles.texto}>{entrada.o_que_fazer_hoje}</Text>

      <Text style={styles.secaoTitulo}>Quando investigar mais</Text>
      <Text style={styles.texto}>{entrada.quando_investigar_mais}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  conteudo: {
    padding: 20,
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secaoTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 20,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  texto: {
    fontSize: 16,
    lineHeight: 24,
  },
  erro: {
    color: 'red',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});