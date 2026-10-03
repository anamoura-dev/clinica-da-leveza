import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, useReducedMotion } from 'react-native-reanimated';

import { BalaoFlutuante } from '@/components/balao-ar';
import { Botao, Carregando, Erro, Rotulo } from '@/components/ui';
import { useDados } from '@/hooks/use-dados';
import { registrarProgresso } from '@/components/conta/dados';
import { Contorno, Cores, Destaques, Espaco, Fontes, Raio, t } from '@/constants/theme';
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

/** A devolutiva vem em camadas: cada parágrafo (separado por linha em branco) é uma camada. */
const camadasDe = (texto: string) =>
  texto
    .split(/\n\s*\n/)
    .map((parte) => parte.trim())
    .filter(Boolean);

export default function TelaCenario() {
  const { faseId, cenarioId } = useLocalSearchParams<{ faseId: string; cenarioId: string }>();
  const [escolhida, setEscolhida] = useState<number | null>(null);
  const [visiveis, setVisiveis] = useState(1);
  const parado = useReducedMotion();

  function escolher(i: number | null) {
    setEscolhida(i);
    setVisiveis(1);
  }

  const carregar = useCallback(async () => {
    const [cenarioRes, opcoesRes, faseRes] = await Promise.all([
      supabase.from('cenarios').select('texto').eq('id', cenarioId).maybeSingle(),
      supabase
        .from('opcoes')
        .select('id, texto, devolutiva')
        .eq('cenario_id', cenarioId)
        .order('ordem', { ascending: true }),
      // Os cenários da fase, na ordem, para saber qual é o próximo.
      supabase.from('cenarios').select('id').eq('fase_id', faseId).order('ordem', { ascending: true }),
    ]);
    const falha = cenarioRes.error || opcoesRes.error;
    if (falha) throw new Error(falha.message);
    if (!cenarioRes.data) throw new Error('Cenário não encontrado.');
    const ids = ((faseRes.data ?? []) as { id: string }[]).map((c) => c.id);
    const posicao = ids.indexOf(cenarioId);
    const proximo = posicao >= 0 && posicao < ids.length - 1 ? ids[posicao + 1] : null;
    return { cenario: cenarioRes.data as Cenario, opcoes: (opcoesRes.data ?? []) as Opcao[], proximo };
  }, [faseId, cenarioId]);

  const { dados, carregando, erro, tentarDeNovo } = useDados(carregar, `cenario:${cenarioId}`);
  const cenario = dados?.cenario ?? null;
  const opcoes = dados?.opcoes ?? [];
  const proximo = dados?.proximo ?? null;

  const opcao = escolhida !== null ? opcoes[escolhida] : null;
  const camadas = opcao ? camadasDe(opcao.devolutiva) : [];
  const tudoVisto = visiveis >= camadas.length;

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
            <Rotulo cor={cor.escura}>A cena</Rotulo>
            <Text style={estilos.situacaoTexto}>{cenario.texto}</Text>
          </View>

          {!opcao && (
            <>
              <Text style={estilos.pergunta}>E agora?</Text>
              {opcoes.map((o, i) => (
                <Pressable
                  key={o.id}
                  onPress={() => {
                    escolher(i);
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
                <View style={[estilos.letra, { backgroundColor: cor.escura }]}>
                  <Text style={[estilos.letraTexto, { color: '#FFFFFF' }]}>{letra(escolhida)}</Text>
                </View>
                <Text style={estilos.opcaoTexto}>{opcao.texto}</Text>
              </View>

              <View style={estilos.devolutiva}>
                <View style={estilos.devolutivaCabecalho}>
                  <Ionicons name="sparkles-outline" size={20} color={Cores.verdeEscuro} />
                  <Text style={estilos.vamosPensar}>Vamos olhar melhor para essa escolha?</Text>
                </View>
                {camadas.slice(0, visiveis).map((camada, i) => (
                  <Animated.Text
                    key={i}
                    entering={i === 0 || parado ? undefined : FadeInDown.duration(400)}
                    style={estilos.devolutivaTexto}>
                    {camada}
                  </Animated.Text>
                ))}
                {!tudoVisto && (
                  <Pressable
                    onPress={() => setVisiveis((n) => n + 1)}
                    hitSlop={8}
                    style={({ pressed }) => [estilos.maisFundo, pressed && estilos.pressionado]}>
                    <Text style={estilos.maisFundoTexto}>Olhar mais de perto</Text>
                    <Ionicons name="chevron-down" size={18} color={Cores.verdeEscuro} />
                  </Pressable>
                )}
              </View>

              {/* Fim da fase: o balão sobe, sem medalha nem pontos. */}
              {!proximo && tudoVisto && (
                <Animated.View entering={parado ? undefined : FadeInUp.duration(1200)} style={estilos.fimDaFase}>
                  <BalaoFlutuante largura={56} amplitude={8} />
                  <Text style={estilos.fimDaFaseTexto}>Fase concluída.</Text>
                </Animated.View>
              )}

              {proximo ? (
                <Botao
                  titulo="Próxima situação"
                  icone="arrow-forward"
                  cor={cor.escura}
                  onPress={() => router.replace(`/fases/${faseId}/${proximo}`)}
                />
              ) : (
                <Botao titulo="Fim da fase! Voltar" icone="flag-outline" cor={cor.escura} onPress={() => router.back()} />
              )}
              <Botao
                titulo="Ver outras opções"
                icone="arrow-back"
                variante="suave"
                cor={cor.escura}
                onPress={() => escolher(null)}
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
    fontSize: t(19),
    lineHeight: t(27),
    color: Cores.texto,
  },
  pergunta: {
    fontFamily: Fontes.extra,
    fontSize: t(18),
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
    fontSize: t(16),
    color: cor.escura,
  },
  opcaoTexto: {
    flex: 1,
    fontFamily: Fontes.media,
    fontSize: t(16),
    lineHeight: t(23),
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
    fontSize: t(16),
    color: Cores.verdeEscuro,
  },
  maisFundo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.xs,
    alignSelf: 'flex-start',
    paddingVertical: Espaco.xs,
  },
  maisFundoTexto: {
    fontFamily: Fontes.negrito,
    fontSize: t(15),
    color: Cores.verdeEscuro,
    textDecorationLine: 'underline',
  },
  fimDaFase: {
    alignItems: 'center',
    gap: Espaco.sm,
    paddingVertical: Espaco.md,
  },
  fimDaFaseTexto: {
    fontFamily: Fontes.extra,
    fontSize: t(18),
    color: Cores.marinho,
  },
  devolutivaTexto: {
    fontFamily: Fontes.regular,
    fontSize: t(16),
    lineHeight: t(25),
    color: Cores.texto,
  },
});
