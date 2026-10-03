import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { BalaoFlutuante } from '@/components/balao-ar';
import { Cores, Espaco, Fontes, Raio, t } from '@/constants/theme';

/**
 * Tela de boas-vindas: aparece uma vez cada vez que o app é aberto,
 * antes da paulada. Manchas coloridas da paleta nos cantos.
 */

// Forma orgânica (mancha) num quadro de -80 a 80.
const MANCHA =
  'M43,-61C55,-52,63,-38,68,-23C73,-8,75,9,69,23C63,37,49,48,34,57C19,66,3,73,-14,72C-31,71,-49,62,-60,48C-71,34,-75,15,-72,-2C-69,-19,-59,-34,-46,-44C-33,-54,-17,-59,-1,-58C15,-57,31,-70,43,-61Z';

type Mancha = { cor: string; tamanho: number; giro: number; pos: object };

const MANCHAS: Mancha[] = [
  { cor: Cores.verde, tamanho: 170, giro: 20, pos: { top: -60, left: -70 } },
  { cor: Cores.terracota, tamanho: 120, giro: 110, pos: { top: '20%', left: -70 } },
  { cor: Cores.verde, tamanho: 110, giro: 200, pos: { top: -40, right: -45 } },
  { cor: Cores.lilas, tamanho: 190, giro: 60, pos: { bottom: '6%', right: -110 } },
  { cor: Cores.terracota, tamanho: 210, giro: 300, pos: { bottom: -90, left: -80 } },
  { cor: Cores.verde, tamanho: 130, giro: 150, pos: { bottom: -70, left: 60 } },
  { cor: Cores.verde, tamanho: 22, giro: 0, pos: { bottom: '10%', right: '28%' } },
];

export function BoasVindas({ aoEntrar }: { aoEntrar: () => void }) {
  const parado = useReducedMotion();
  const entrar = (atraso: number) => (parado ? undefined : FadeInDown.delay(atraso).duration(600));

  return (
    <View style={estilos.tela}>
      {MANCHAS.map((m, i) => (
        <Animated.View
          key={i}
          pointerEvents="none"
          entering={parado ? undefined : FadeIn.delay(i * 80).duration(700)}
          style={[estilos.mancha, m.pos, { width: m.tamanho, height: m.tamanho, transform: [{ rotate: `${m.giro}deg` }] }]}>
          <Svg width="100%" height="100%" viewBox="-80 -80 160 160">
            <Path d={MANCHA} fill={m.cor} opacity={0.9} />
          </Svg>
        </Animated.View>
      ))}

      <SafeAreaView style={estilos.centro}>
        <Animated.View entering={entrar(200)} style={estilos.marca}>
          <BalaoFlutuante largura={72} />
          <Text style={estilos.clinica}>Clínica da</Text>
          <Text style={estilos.leveza}>Leveza</Text>
        </Animated.View>

        <Animated.Text entering={entrar(600)} style={estilos.frase}>
          Porque a vida muda{'\n'}quando o olhar muda.
        </Animated.Text>

        <Animated.View entering={entrar(1000)}>
          <Pressable
            onPress={aoEntrar}
            accessibilityRole="button"
            style={({ pressed }) => [estilos.botao, pressed && estilos.pressionado]}>
            <Text style={estilos.botaoTexto}>Vamos juntos?</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: Cores.fundo,
    overflow: 'hidden',
  },
  mancha: {
    position: 'absolute',
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Espaco.xl,
    gap: Espaco.xl,
  },
  marca: {
    alignItems: 'center',
  },
  clinica: {
    fontFamily: Fontes.media,
    fontSize: t(26),
    color: Cores.marinho,
    marginTop: Espaco.md,
  },
  leveza: {
    fontFamily: Fontes.extra,
    fontSize: t(50),
    lineHeight: t(58),
    color: Cores.marinho,
  },
  frase: {
    fontFamily: Fontes.media,
    fontSize: t(17),
    lineHeight: t(25),
    color: Cores.marinho,
    textAlign: 'center',
  },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Espaco.sm,
    backgroundColor: Cores.marinho,
    borderRadius: Raio.pilula,
    paddingVertical: 16,
    paddingHorizontal: Espaco.xl,
    minWidth: 240,
  },
  botaoTexto: {
    fontFamily: Fontes.extra,
    fontSize: t(17),
    color: '#FFFFFF',
  },
  pressionado: {
    opacity: 0.85,
  },
});
