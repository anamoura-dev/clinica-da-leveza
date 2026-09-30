import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../../../lib/supabase';

export default function Index() {
  const [paulada, setPaulada] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    buscarPaulada();
  }, []);

  async function buscarPaulada() {
    setCarregando(true);
    setErro(null);

    const { data, error } = await supabase
      .from('pauladas')
      .select('texto')
      .eq('ativa', true)
      .eq('uso', 'abertura');

    if (error) {
      setErro(error.message);
      setCarregando(false);
      return;
    }

    if (data && data.length > 0) {
      const aleatoria = data[Math.floor(Math.random() * data.length)];
      setPaulada(aleatoria.texto);
    } else {
      setErro('Nenhuma paulada encontrada.');
    }

    setCarregando(false);
  }

  return (
    <View style={styles.container}>
      {carregando && <ActivityIndicator size="large" />}

      {erro && <Text style={styles.erro}>Erro: {erro}</Text>}

      {!carregando && !erro && (
        <>
          <Text style={styles.label}>#PAULADA</Text>
          <Text style={styles.texto}>{paulada}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 16,
    letterSpacing: 2,
  },
  texto: {
    fontSize: 22,
    textAlign: 'center',
    lineHeight: 30,
  },
  erro: {
    color: 'red',
    textAlign: 'center',
  },
});