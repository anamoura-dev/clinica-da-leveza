import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '../../../../../lib/supabase';

type Cenario = {
  texto: string;
};

type Opcao = {
  id: string;
  texto: string;
  devolutiva: string;
};

export default function TelaCenario() {
  const { cenarioId } = useLocalSearchParams<{ cenarioId: string }>();
  const [cenario, setCenario] = useState<Cenario | null>(null);
  const [opcoes, setOpcoes] = useState<Opcao[]>([]);
  const [escolhida, setEscolhida] = useState<Opcao | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    buscarCenario();
  }, [cenarioId]);

  async function buscarCenario() {
    setCarregando(true);
    setErro(null);
    setEscolhida(null);

    const [{ data: cenarioData, error: cenarioError }, { data: opcoesData, error: opcoesError }] =
      await Promise.all([
        supabase.from('cenarios').select('texto').eq('id', cenarioId).maybeSingle(),
        supabase.from('opcoes').select('id, texto, devolutiva').eq('cenario_id', cenarioId).order('ordem', { ascending: true }),
      ]);

    if (cenarioError || opcoesError) {
      setErro(cenarioError?.message || opcoesError?.message || 'Erro ao carregar.');
    } else {
      setCenario(cenarioData);
      setOpcoes(opcoesData || []);
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

  if (erro || !cenario) {
    return (
      <View style={styles.centro}>
        <Text style={styles.erro}>{erro}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Text style={styles.situacao}>{cenario.texto}</Text>

      {!escolhida && (
        <View style={styles.opcoes}>
          <Text style={styles.pergunta}>Você:</Text>
          {opcoes.map((opcao, index) => (
            <Pressable
              key={opcao.id}
              style={styles.opcaoCard}
              onPress={() => setEscolhida(opcao)}
            >
              <Text style={styles.opcaoLetra}>{String.fromCharCode(65 + index)}</Text>
              <Text style={styles.opcaoTexto}>{opcao.texto}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {escolhida && (
        <View style={styles.devolutivaBox}>
          <Text style={styles.vamosPensar}>Vamos pensar...</Text>
          <Text style={styles.devolutivaTexto}>{escolhida.devolutiva}</Text>

          <Pressable style={styles.botaoOutra} onPress={() => setEscolhida(null)}>
            <Text style={styles.botaoOutraTexto}>← Ver outras opções</Text>
          </Pressable>
        </View>
      )}
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
  situacao: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    lineHeight: 28,
  },
  opcoes: {
    gap: 12,
  },
  pergunta: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  opcaoCard: {
    flexDirection: 'row',
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
    gap: 12,
  },
  opcaoLetra: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0066cc',
  },
  opcaoTexto: {
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
  },
  devolutivaBox: {
    backgroundColor: '#fff8e6',
    borderRadius: 12,
    padding: 20,
  },
  vamosPensar: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#b8860b',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  devolutivaTexto: {
    fontSize: 16,
    lineHeight: 24,
  },
  botaoOutra: {
    marginTop: 20,
  },
  botaoOutraTexto: {
    color: '#0066cc',
    fontWeight: '600',
  },
  erro: {
    color: 'red',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});