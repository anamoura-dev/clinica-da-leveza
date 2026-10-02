import { Ionicons } from '@expo/vector-icons';
import { Href, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, useReducedMotion } from 'react-native-reanimated';

import { BalaoFlutuante } from '@/components/balao-ar';
import { buscarAcolhimentos, sortear } from '@/components/pauladas';
import { Rotulo } from '@/components/ui';
import { LUPA_ATIVA } from '@/constants/recursos';
import { Cores, Destaques, Espaco, Fontes, Raio, t } from '@/constants/theme';
import { useDados } from '@/hooks/use-dados';

/**
 * "Não sei. Só entrei." — para quem chega sem saber o que procura.
 * Nada de resolver: uma frase de acolhimento e portas leves.
 * Com a Lupa ligada, aparece também o convite para contar o que está acontecendo.
 * (Textos para a Ana Paula revisar.)
 */

type Porta = { emoji: string; texto: string; href: Href; cor: string };
const PORTAS: Porta[] = [
  { emoji: '☕', texto: 'Tomar um café', href: '/cafe', cor: Destaques.cafe.cor },
  { emoji: '🧰', texto: 'Abrir a gaveta do ManuaLeve', href: '/manualeve', cor: Destaques.manualeve.cor },
  { emoji: '🎮', texto: 'Brincar de passar de fase', href: '/fases', cor: Destaques.fases.cor },
];

export default function SoEntrei() {
  const parado = useReducedMotion();
  const entrar = (atraso: number) => (parado ? undefined : FadeInDown.delay(atraso).duration(500));

  // Frase de acolhimento (não é paulada: aqui ninguém leva cutucada).
  const { dados } = useDados(buscarAcolhimentos, 'acolhimentos');
  const [frase, setFrase] = useState<string | null>(null);
  if (dados && frase === null) setFrase(sortear(dados.textos, null));

  return (
    <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
      <Animated.View entering={parado ? undefined : FadeIn.duration(700)} style={estilos.balao}>
        <BalaoFlutuante largura={44} />
      </Animated.View>

      <Animated.Text entering={entrar(150)} style={estilos.otimo}>
        Ótimo.
      </Animated.Text>
      <Animated.Text entering={entrar(500)} style={estilos.frase}>
        Então não vamos começar tentando resolver nada.
      </Animated.Text>

      {LUPA_ATIVA && (
        <Animated.View entering={entrar(850)}>
          <Pressable
            onPress={() => router.push('/conversar')}
            accessibilityRole="link"
            style={({ pressed }) => [estilos.lupa, pressed && estilos.pressionado]}>
            <Text style={estilos.lupaTexto}>Me conta o que está acontecendo</Text>
            <Ionicons name="arrow-forward" size={20} color={Cores.fundo} />
          </Pressable>
        </Animated.View>
      )}

      {frase && (
        <Animated.View entering={entrar(LUPA_ATIVA ? 1100 : 900)} style={estilos.acolhimento}>
          <Rotulo cor={Cores.lilasEscuro}>Um respiro</Rotulo>
          <Pressable
            onPress={() => dados && setFrase(sortear(dados.textos, frase))}
            accessibilityHint="Toque para outra frase">
            <Text style={estilos.acolhimentoTexto}>{frase}</Text>
          </Pressable>
        </Animated.View>
      )}

      <Animated.View entering={entrar(LUPA_ATIVA ? 1350 : 1150)} style={estilos.portas}>
        <Text style={estilos.portasTitulo}>Se der vontade de seguir:</Text>
        {PORTAS.map((p) => (
          <Pressable
            key={p.texto}
            onPress={() => router.push(p.href)}
            accessibilityRole="link"
            style={({ pressed }) => [estilos.porta, pressed && estilos.pressionado]}>
            <View style={[estilos.faixa, { backgroundColor: p.cor }]} />
            <Text style={estilos.portaEmoji}>{p.emoji}</Text>
            <Text style={estilos.portaTexto}>{p.texto}</Text>
          </Pressable>
        ))}
      </Animated.View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: Cores.fundo,
  },
  conteudo: {
    padding: Espaco.lg,
    paddingBottom: Espaco.xl * 2,
  },
  balao: {
    alignItems: 'flex-start',
    marginBottom: Espaco.lg,
  },
  otimo: {
    fontFamily: Fontes.extra,
    fontSize: t(40),
    lineHeight: t(48),
    color: Cores.marinho,
  },
  frase: {
    fontFamily: Fontes.negrito,
    fontSize: t(22),
    lineHeight: t(30),
    color: Cores.marinho,
    marginTop: Espaco.sm,
  },
  lupa: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Espaco.md,
    backgroundColor: Cores.marinho,
    borderRadius: Raio.md,
    paddingVertical: Espaco.md,
    paddingHorizontal: Espaco.lg,
    marginTop: Espaco.lg,
  },
  lupaTexto: {
    flex: 1,
    fontFamily: Fontes.extra,
    fontSize: t(17),
    color: Cores.fundo,
  },
  acolhimento: {
    marginTop: Espaco.xl,
    paddingTop: Espaco.lg,
    borderTopWidth: 1,
    borderTopColor: Cores.borda,
    gap: Espaco.sm,
  },
  acolhimentoTexto: {
    fontFamily: Fontes.extra,
    fontSize: t(20),
    lineHeight: t(28),
    color: Cores.texto,
  },
  portas: {
    marginTop: Espaco.xl,
  },
  portasTitulo: {
    fontFamily: Fontes.media,
    fontSize: t(15),
    color: Cores.textoSuave,
    marginBottom: Espaco.xs,
  },
  porta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.md,
    paddingVertical: Espaco.md,
    borderBottomWidth: 1,
    borderBottomColor: Cores.borda,
  },
  faixa: {
    width: 5,
    alignSelf: 'stretch',
    borderRadius: Raio.pilula,
  },
  portaEmoji: {
    fontSize: t(18),
  },
  portaTexto: {
    flex: 1,
    fontFamily: Fontes.negrito,
    fontSize: t(17),
    color: Cores.texto,
  },
  pressionado: {
    opacity: 0.6,
  },
});
