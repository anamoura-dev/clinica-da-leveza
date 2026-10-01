import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { buscarMundo, Sentimento, useMissoesConcluidas } from '@/components/mundo/dados';
import { BarraPassos, CaixaAlta, tk, tom } from '@/components/mundo/estilo';
import { Carregando, Erro } from '@/components/ui';
import { Contorno, Cores, Espaco, Fontes, Raio } from '@/constants/theme';
import { useDados } from '@/hooks/use-dados';

/** Divide a lista em linhas de 2 (a última pode ter 1, e aí ocupa a largura toda). */
function emLinhas<T>(lista: T[]) {
  const linhas: T[][] = [];
  for (let i = 0; i < lista.length; i += 2) linhas.push(lista.slice(i, i + 2));
  return linhas;
}

/**
 * PASSO 1 — "Como você está se sentindo agora?"
 * Só as emoções, ocupando a tela toda. Tocar numa leva ao passo 2.
 */
export default function PassoSentimento() {
  const { dados, carregando, erro, tentarDeNovo } = useDados(buscarMundo);
  const concluidas = useMissoesConcluidas();

  if (carregando) return <Carregando />;
  if (erro || !dados) return <Erro mensagem={erro ?? 'Algo deu errado.'} onTentar={tentarDeNovo} />;

  const estrelas = dados.missoes.filter((m) => concluidas.includes(m.id)).length;

  function escolher(s: Sentimento) {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    router.push(`/mundo/sentimento/${s.id}`);
  }

  let ordem = 0;
  return (
    <SafeAreaView style={estilos.tela} edges={['top', 'bottom']}>
      <View style={estilos.conteudo}>
        <BarraPassos
          passo={1}
          estrelas={estrelas}
          icone="close"
          rotuloIcone="Sair do Espaço das Crianças"
          aoTocarIcone={() => router.back()}
        />

        <Text style={estilos.pergunta}>Como você está se sentindo agora?</Text>
        <Text style={estilos.dica}>Toque no que mais parece com você</Text>

        <View style={estilos.grade}>
          {emLinhas(dados.sentimentos).map((linha, i) => (
            <View key={i} style={estilos.linha}>
              {linha.map((s) => {
                const atraso = 80 * ordem++;
                return (
                  <Animated.View key={s.id} entering={FadeInDown.delay(atraso).duration(350)} style={estilos.celula}>
                    <Pressable
                      onPress={() => escolher(s)}
                      accessibilityRole="button"
                      accessibilityLabel={s.nome}
                      style={({ pressed }) => [
                        estilos.sentimento,
                        { backgroundColor: tom(s.cor, 0.9) },
                        pressed && estilos.pressionado,
                      ]}>
                      <Text style={estilos.emoji}>{s.emoji}</Text>
                      <Text style={estilos.nome} numberOfLines={1} adjustsFontSizeToFit>
                        {s.nome}
                      </Text>
                    </Pressable>
                  </Animated.View>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: Cores.fundo,
  },
  conteudo: {
    flex: 1,
    padding: Espaco.md,
    paddingTop: Espaco.sm,
    gap: Espaco.sm,
  },
  pergunta: {
    ...CaixaAlta,
    fontFamily: Fontes.extra,
    fontSize: tk(22),
    lineHeight: tk(27),
    color: Cores.marinho,
    textAlign: 'center',
    marginTop: Espaco.md,
  },
  dica: {
    ...CaixaAlta,
    fontFamily: Fontes.media,
    fontSize: tk(12),
    color: Cores.textoSuave,
    textAlign: 'center',
    marginBottom: Espaco.sm,
  },
  grade: {
    flex: 1,
    gap: Espaco.md,
  },
  linha: {
    flex: 1,
    flexDirection: 'row',
    gap: Espaco.md,
  },
  celula: {
    flex: 1,
  },
  sentimento: {
    flex: 1,
    borderRadius: Raio.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Espaco.xs,
    padding: Espaco.sm,
    ...Contorno,
    borderWidth: 2.5,
  },
  pressionado: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
  emoji: {
    fontSize: 54,
  },
  nome: {
    ...CaixaAlta,
    letterSpacing: 1,
    fontFamily: Fontes.extra,
    fontSize: tk(17),
    color: Cores.marinho,
  },
});
