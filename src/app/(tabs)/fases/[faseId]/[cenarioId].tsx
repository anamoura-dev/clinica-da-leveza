import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Botao, Carregando, Erro, Rotulo } from '@/components/ui';
import { useDados } from '@/hooks/use-dados';
import { registrarProgresso } from '@/components/conta/dados';
import { Contorno, Cores, Destaques, Espaco, Fontes, Raio } from '@/constants/theme';
import { supabase } from '../../../../../lib/supabase';

type Cenario = {
  texto: string;
};

type Opcao = {
  id: string;
  texto: string;
  devolutiva: string;
};

const cor = Destaques.fases;
const letra = (i: number) => String.fromCharCode(65 + i);

export default function TelaCenario() {
  const { cenarioId } = useLocalSearchParams<{ cenarioId: string }>();
  const [escolhida, setEscolhida] = useState<number | null>(null);

  const carregar = useCallback(async () => {
    const [cenarioRes, opcoesRes] = await Promise.all([
      supabase.from('cenarios').select('texto').eq('id', cenarioId).maybeSingle(),
      supabase
        .from('opcoes')
        .select('id, texto, devolutiva')
        .eq('cenario_id', cenarioId)
        .order('ordem', { ascending: true }),
    ]);
    const falha = cenarioRes.error || opcoesRes.error;
    if (falha) throw new Error(falha.message);
    if (!cenarioRes.data) throw new Error('Cenário não encontrado.');
    return { cenario: cenarioRes.data as Cenario, opcoes: (opcoesRes.data ?? []) as Opcao[] };
  }, [cenarioId]);

  const { dados, carregando, erro, tentarDeNovo } = useDados(carregar);
  const cenario = dados?.cenario ?? null;
  const opcoes = dados?.opcoes ?? [];

  const opcao = escolhida !== null ? opcoes[escolhida] : null;

  return (
    <>
      <Stack.Screen options={{ title: 'Cenário' }} />
      {carregando ? (
        <Carregando />
      ) : erro || !cenario ? (
        <Erro mensagem={erro ?? 'Algo deu errado.'} onTentar={tentarDeNovo} />
      ) : (
        <ScrollView contentContainerStyle={estilos.conteudo}>
          <View style={estilos.situacao}>
            <Rotulo cor={cor.escura}>A situação</Rotulo>
            <Text style={estilos.situacaoTexto}>{cenario.texto}</Text>
          </View>

          {!opcao && (
            <>
              <Text style={estilos.pergunta}>E você?</Text>
              {opcoes.map((o, i) => (
                <Pressable
                  key={o.id}
                  onPress={() => {
                    setEscolhida(i);
                    registrarProgresso('cenario', cenarioId); // conta como jogado (se estiver logado)
                  }}
                  style={({ pressed }) => [estilos.opcao, pressed && estilos.pressionado]}>
                  <View style={estilos.letra}>
                    <Text style={estilos.letraTexto}>{letra(i)}</Text>
                  </View>
                  <Text style={estilos.opcaoTexto}>{o.texto}</Text>
                </Pressable>
              ))}
            </>
          )}

          {opcao && escolhida !== null && (
            <>
              <View style={estilos.escolha}>
                <View style={[estilos.letra, { backgroundColor: cor.cor }]}>
                  <Text style={[estilos.letraTexto, { color: '#FFFFFF' }]}>{letra(escolhida)}</Text>
                </View>
                <Text style={estilos.opcaoTexto}>{opcao.texto}</Text>
              </View>

              <View style={estilos.devolutiva}>
                <View style={estilos.devolutivaCabecalho}>
                  <Ionicons name="sparkles-outline" size={20} color={Cores.verdeEscuro} />
                  <Text style={estilos.vamosPensar}>Vamos pensar...</Text>
                </View>
                <Text style={estilos.devolutivaTexto}>{opcao.devolutiva}</Text>
              </View>

              <Botao
                titulo="Ver outras opções"
                icone="arrow-back"
                variante="suave"
                cor={cor.escura}
                onPress={() => setEscolhida(null)}
              />
            </>
          )}
        </ScrollView>
      )}
    </>
  );
}

const estilos = StyleSheet.create({
  conteudo: {
    padding: Espaco.lg,
    paddingTop: Espaco.sm,
    gap: Espaco.md,
  },
  situacao: {
    backgroundColor: cor.clara,
    borderRadius: Raio.lg,
    padding: Espaco.lg,
    gap: Espaco.sm,
  },
  situacaoTexto: {
    fontFamily: Fontes.negrito,
    fontSize: 19,
    lineHeight: 27,
    color: Cores.texto,
  },
  pergunta: {
    fontFamily: Fontes.extra,
    fontSize: 18,
    color: Cores.texto,
    marginTop: Espaco.sm,
  },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.md,
    backgroundColor: Cores.superficie,
    borderRadius: Raio.md,
    padding: Espaco.md,
    ...Contorno,
  },
  pressionado: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  escolha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.md,
    borderRadius: Raio.md,
    padding: Espaco.md,
    borderWidth: 1.5,
    borderColor: cor.cor,
    backgroundColor: Cores.superficie,
  },
  letra: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: cor.clara,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letraTexto: {
    fontFamily: Fontes.extra,
    fontSize: 16,
    color: cor.escura,
  },
  opcaoTexto: {
    flex: 1,
    fontFamily: Fontes.media,
    fontSize: 16,
    lineHeight: 23,
    color: Cores.texto,
  },
  devolutiva: {
    backgroundColor: Cores.verdeClaro,
    borderRadius: Raio.md,
    padding: Espaco.lg,
    gap: Espaco.sm,
  },
  devolutivaCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm,
  },
  vamosPensar: {
    fontFamily: Fontes.extra,
    fontSize: 16,
    color: Cores.verdeEscuro,
  },
  devolutivaTexto: {
    fontFamily: Fontes.regular,
    fontSize: 16,
    lineHeight: 25,
    color: Cores.texto,
  },
});
