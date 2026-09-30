import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Cores, Espaco, Fontes, Raio } from '@/constants/theme';

// Linha do tempo da "paulada" (em ms)
const PREPARO = 350; // o pau pega impulso
const GOLPE = 260; // o pau vem na direção de quem está olhando
const IMPACTO = PREPARO + GOLPE; // momento da pancada
const FRASE = IMPACTO + 450; // quando as palavras começam a entrar

/** Uma forma colorida que flutua devagar no fundo do cartão. */
function Bolha({
  cor,
  tamanho,
  topo,
  esquerda,
  dx,
  dy,
  duracao,
  parado,
}: {
  cor: string;
  tamanho: number;
  topo: number;
  esquerda: number;
  dx: number;
  dy: number;
  duracao: number;
  parado: boolean;
}) {
  const t = useSharedValue(0);

  useEffect(() => {
    if (parado) return;
    t.value = withRepeat(
      withTiming(1, { duration: duracao, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [t, duracao, parado]);

  const estilo = useAnimatedStyle(() => ({
    transform: [
      { translateX: t.value * dx },
      { translateY: t.value * dy },
      { scale: 1 + t.value * 0.15 },
    ],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        estilos.bolha,
        { backgroundColor: cor, width: tamanho, height: tamanho, borderRadius: tamanho / 2, top: topo, left: esquerda },
        estilo,
      ]}
    />
  );
}

/** O pau de madeira. Gira a partir do cabo (embaixo) e cresce em direção à tela. */
function Pau() {
  const giro = useSharedValue(-35);
  const escala = useSharedValue(0.55);
  const opacidade = useSharedValue(0);

  useEffect(() => {
    opacidade.value = withSequence(
      withTiming(1, { duration: 120 }),
      withDelay(IMPACTO - 60, withTiming(0, { duration: 140 })),
    );
    giro.value = withSequence(
      withTiming(-110, { duration: PREPARO, easing: Easing.out(Easing.quad) }),
      withTiming(20, { duration: GOLPE, easing: Easing.in(Easing.cubic) }),
    );
    escala.value = withDelay(PREPARO, withTiming(2.6, { duration: GOLPE, easing: Easing.in(Easing.cubic) }));
  }, [giro, escala, opacidade]);

  const estilo = useAnimatedStyle(() => ({
    opacity: opacidade.value,
    transform: [{ scale: escala.value }, { rotate: `${giro.value}deg` }],
  }));

  return (
    <View pointerEvents="none" style={estilos.pauArea}>
      {/* O eixo de rotação é o centro deste bloco, que coincide com a ponta do cabo. */}
      <Animated.View style={[estilos.pauEixo, estilo]}>
        <View style={estilos.pauCorpo}>
          <View style={[estilos.pauVeio, { top: 22, left: 8 }]} />
          <View style={[estilos.pauVeio, { top: 58, left: 16, width: 3 }]} />
          <View style={[estilos.pauNo, { top: 84, left: 6 }]} />
        </View>
        <View style={estilos.pauCabo} />
        <View style={{ height: 150 }} />
      </Animated.View>
    </View>
  );
}

/** Clarão + "PÁ!" no momento da pancada. */
function Impacto({ parado }: { parado: boolean }) {
  const clarao = useSharedValue(0);
  const estouro = useSharedValue(0);
  const opacidadeEstouro = useSharedValue(0);

  useEffect(() => {
    if (parado) return;
    clarao.value = withDelay(
      IMPACTO,
      withSequence(withTiming(0.75, { duration: 60 }), withTiming(0, { duration: 320 })),
    );
    estouro.value = withDelay(
      IMPACTO,
      withSequence(
        withTiming(1.35, { duration: 140, easing: Easing.out(Easing.back(3)) }),
        withTiming(1, { duration: 120 }),
      ),
    );
    opacidadeEstouro.value = withDelay(
      IMPACTO,
      withSequence(withTiming(1, { duration: 40 }), withDelay(380, withTiming(0, { duration: 220 }))),
    );
  }, [clarao, estouro, opacidadeEstouro, parado]);

  const estiloClarao = useAnimatedStyle(() => ({ opacity: clarao.value }));
  const estiloEstouro = useAnimatedStyle(() => ({
    opacity: opacidadeEstouro.value,
    transform: [{ scale: estouro.value }, { rotate: '-8deg' }],
  }));

  return (
    <>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, estilos.clarao, estiloClarao]} />
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, estilos.centro]}>
        <Animated.View style={[estilos.estouro, estiloEstouro]}>
          <Text style={estilos.estouroTexto}>PÁ!</Text>
        </Animated.View>
      </View>
    </>
  );
}

/** Uma "cena" completa: pancada, tremida e depois a frase. Remonta a cada nova paulada. */
function Cena({ texto, parado, onOutra }: { texto: string; parado: boolean; onOutra?: () => void }) {
  const tremida = useSharedValue(0);
  const palavras = texto.split(/\s+/).filter(Boolean);
  const inicioFrase = parado ? 0 : FRASE;

  useEffect(() => {
    if (parado) return;
    tremida.value = withDelay(
      IMPACTO,
      withSequence(
        withTiming(-14, { duration: 45 }),
        withTiming(12, { duration: 45 }),
        withTiming(-8, { duration: 45 }),
        withTiming(6, { duration: 45 }),
        withTiming(0, { duration: 60 }),
      ),
    );
    const vibrar = setTimeout(() => {
      if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, IMPACTO);
    return () => clearTimeout(vibrar);
  }, [tremida, parado]);

  const estiloTremida = useAnimatedStyle(() => ({
    transform: [{ translateX: tremida.value }, { rotate: `${tremida.value * 0.15}deg` }],
  }));

  return (
    <Animated.View style={[estilos.cartao, estiloTremida]}>
      <View pointerEvents="none" style={estilos.fundo}>
        <Bolha cor={Cores.lavanda} tamanho={220} topo={-90} esquerda={-70} dx={40} dy={30} duracao={7000} parado={parado} />
        <Bolha cor={Cores.pessego} tamanho={160} topo={140} esquerda={200} dx={-50} dy={-25} duracao={9000} parado={parado} />
        <Bolha cor={Cores.salvia} tamanho={120} topo={-30} esquerda={230} dx={-30} dy={45} duracao={8000} parado={parado} />
        <Impacto parado={parado} />
      </View>

      <Animated.View entering={parado ? undefined : FadeIn.delay(inicioFrase)} style={estilos.rotulo}>
        <Ionicons name="sparkles" size={14} color={Cores.pessegoClaro} />
        <Text style={estilos.rotuloTexto}>#Paulada</Text>
      </Animated.View>

      <View style={estilos.frase} accessible accessibilityLabel={texto}>
        {palavras.map((palavra, i) => (
          <Animated.Text
            key={`${palavra}-${i}`}
            entering={parado ? undefined : FadeInDown.delay(inicioFrase + 100 + i * 90).duration(450)}
            style={estilos.palavra}>
            {palavra}
          </Animated.Text>
        ))}
      </View>

      {onOutra && (
        <Animated.View entering={parado ? undefined : FadeIn.delay(inicioFrase + 200 + palavras.length * 90)}>
          <Pressable
            onPress={onOutra}
            accessibilityLabel="Outra paulada"
            style={({ pressed }) => [estilos.botao, pressed && { opacity: 0.7 }]}>
            <Ionicons name="refresh" size={16} color="#FFFFFF" />
            <Text style={estilos.botaoTexto}>Outra paulada</Text>
          </Pressable>
        </Animated.View>
      )}

      {!parado && <Pau />}
    </Animated.View>
  );
}

export function PauladaAnimada({ texto, onOutra }: { texto: string; onOutra?: () => void }) {
  const parado = useReducedMotion();
  // A key faz a cena inteira (pancada + frase) recomeçar a cada nova paulada.
  return <Cena key={texto} texto={texto} parado={parado} onOutra={onOutra} />;
}

const MADEIRA = '#C48A55';
const MADEIRA_ESCURA = '#8B5A2B';

const estilos = StyleSheet.create({
  cartao: {
    borderRadius: Raio.lg,
    padding: Espaco.lg + 4,
    minHeight: 280,
    justifyContent: 'center',
    gap: Espaco.md,
    // sem overflow hidden: o pau pode "sair" do cartão em direção a quem olha
    zIndex: 10,
    elevation: 10,
  },
  fundo: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: Raio.lg,
    overflow: 'hidden',
    backgroundColor: Cores.lavandaEscura,
  },
  centro: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bolha: {
    position: 'absolute',
    opacity: 0.45,
  },
  pauArea: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauEixo: {
    alignItems: 'center',
    // corpo (120) + cabo (30) + espaço (150) = 300, então o centro fica na ponta do cabo
    height: 300,
  },
  pauCorpo: {
    width: 34,
    height: 120,
    backgroundColor: MADEIRA,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 2,
    borderColor: MADEIRA_ESCURA,
  },
  pauCabo: {
    width: 20,
    height: 30,
    backgroundColor: MADEIRA_ESCURA,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  pauVeio: {
    position: 'absolute',
    width: 2,
    height: 40,
    borderRadius: 1,
    backgroundColor: MADEIRA_ESCURA,
    opacity: 0.5,
  },
  pauNo: {
    position: 'absolute',
    width: 8,
    height: 6,
    borderRadius: 4,
    backgroundColor: MADEIRA_ESCURA,
    opacity: 0.7,
  },
  clarao: {
    backgroundColor: '#FFFFFF',
  },
  estouro: {
    backgroundColor: Cores.pessego,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: Raio.md,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  estouroTexto: {
    fontFamily: Fontes.extra,
    fontSize: 40,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  rotulo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rotuloTexto: {
    fontFamily: Fontes.extra,
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Cores.pessegoClaro,
  },
  frase: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 7,
  },
  palavra: {
    fontFamily: Fontes.extra,
    fontSize: 28,
    lineHeight: 37,
    color: '#FFFFFF',
  },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: Raio.pilula,
    marginTop: Espaco.xs,
  },
  botaoTexto: {
    fontFamily: Fontes.negrito,
    fontSize: 14,
    color: '#FFFFFF',
  },
});
