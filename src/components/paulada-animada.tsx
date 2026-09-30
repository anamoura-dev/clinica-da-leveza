import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
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

import { BalaoEspinhoso } from '@/components/balao-espinhoso';
import { Cores, Fontes } from '@/constants/theme';

// Linha do tempo da abertura (ms) — tudo acontece em ~2,5 s
const PREPARO = 300; // o pau pega impulso
const GOLPE = 220; // o pau vem na direção de quem está olhando
const IMPACTO = PREPARO + GOLPE; // 520: pancada
const BOLINHAS = 800; // bolinhas do pensamento
const BALAO = 1040; // balão principal
const FRASE = 1250; // palavras começam
const DURACAO_FRASE = 1000; // tempo total para todas as palavras entrarem
const DICA = 2500; // "arraste para o lado"

const MADEIRA = '#C48A55';
const MADEIRA_ESCURA = '#8B5A2B';

/** Tamanho da fonte conforme o comprimento da frase, para caber no balão. */
function tamanhoFonte(texto: string, larguraBalao: number) {
  const base = larguraBalao / 13;
  const reducao = Math.max(0, texto.length - 50) / 8;
  return Math.max(17, Math.min(30, base - reducao));
}

/** O pau de madeira: gira a partir do cabo e cresce em direção à tela. */
function Pau() {
  const giro = useSharedValue(-30);
  const escala = useSharedValue(0.6);
  const opacidade = useSharedValue(0);

  useEffect(() => {
    opacidade.value = withSequence(
      withTiming(1, { duration: 100 }),
      withDelay(IMPACTO - 60, withTiming(0, { duration: 120 })),
    );
    giro.value = withSequence(
      withTiming(-115, { duration: PREPARO, easing: Easing.out(Easing.quad) }),
      withTiming(15, { duration: GOLPE, easing: Easing.in(Easing.cubic) }),
    );
    escala.value = withDelay(PREPARO, withTiming(3.2, { duration: GOLPE, easing: Easing.in(Easing.cubic) }));
  }, [giro, escala, opacidade]);

  const estilo = useAnimatedStyle(() => ({
    opacity: opacidade.value,
    transform: [{ scale: escala.value }, { rotate: `${giro.value}deg` }],
  }));

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, estilos.centro]}>
      <Animated.View style={[estilos.pauEixo, estilo]}>
        <View style={estilos.pauCorpo}>
          <View style={[estilos.pauVeio, { top: 26, left: 10 }]} />
          <View style={[estilos.pauVeio, { top: 74, left: 22, width: 3 }]} />
          <View style={[estilos.pauNo, { top: 112, left: 8 }]} />
        </View>
        <View style={estilos.pauCabo} />
        {/* espaço igual ao comprimento do pau: o centro deste bloco é a ponta do cabo */}
        <View style={{ height: 200 }} />
      </Animated.View>
    </View>
  );
}

/** Clarão na tela inteira + "PÁ!" no momento da pancada. */
function Impacto() {
  const clarao = useSharedValue(0);
  const estouro = useSharedValue(0);
  const opacidadeEstouro = useSharedValue(0);

  useEffect(() => {
    clarao.value = withDelay(
      IMPACTO,
      withSequence(withTiming(0.8, { duration: 50 }), withTiming(0, { duration: 300 })),
    );
    estouro.value = withDelay(
      IMPACTO,
      withSequence(
        withTiming(1.4, { duration: 130, easing: Easing.out(Easing.back(3)) }),
        withTiming(1, { duration: 110 }),
      ),
    );
    opacidadeEstouro.value = withDelay(
      IMPACTO,
      withSequence(withTiming(1, { duration: 30 }), withDelay(260, withTiming(0, { duration: 180 }))),
    );
  }, [clarao, estouro, opacidadeEstouro]);

  const estiloClarao = useAnimatedStyle(() => ({ opacity: clarao.value }));
  const estiloEstouro = useAnimatedStyle(() => ({
    opacity: opacidadeEstouro.value,
    transform: [{ scale: estouro.value }, { rotate: '-8deg' }],
  }));

  return (
    <>
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, estilos.centro]}>
        <Animated.View style={[estilos.estouro, estiloEstouro]}>
          <Text style={estilos.estouroTexto}>PÁ!</Text>
        </Animated.View>
      </View>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, estilos.clarao, estiloClarao]} />
    </>
  );
}

/** Algo que "estoura" na tela no tempo certo e depois fica balançando de leve. */
function Estouro({
  atraso,
  parado,
  balanco = 1.5,
  children,
}: {
  atraso: number;
  parado: boolean;
  balanco?: number;
  children: React.ReactNode;
}) {
  const escala = useSharedValue(parado ? 1 : 0);
  const giro = useSharedValue(0);

  useEffect(() => {
    if (parado) return;
    escala.value = withDelay(
      atraso,
      withSequence(
        withTiming(1.12, { duration: 220, easing: Easing.out(Easing.back(2)) }),
        withTiming(1, { duration: 140 }),
      ),
    );
    giro.value = withDelay(
      atraso + 360,
      withRepeat(
        withSequence(
          withTiming(balanco, { duration: 1300, easing: Easing.inOut(Easing.sin) }),
          withTiming(-balanco, { duration: 1300, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      ),
    );
  }, [escala, giro, atraso, parado, balanco]);

  const estilo = useAnimatedStyle(() => ({
    opacity: escala.value > 0.01 ? 1 : 0,
    transform: [{ scale: escala.value }, { rotate: `${giro.value}deg` }],
  }));

  return <Animated.View style={estilo}>{children}</Animated.View>;
}

/** Setinha animada: "arraste para o lado". */
function DicaArrastar({ parado, onPress }: { parado: boolean; onPress?: () => void }) {
  const x = useSharedValue(0);

  useEffect(() => {
    if (parado) return;
    x.value = withDelay(
      DICA,
      withRepeat(
        withSequence(
          withTiming(10, { duration: 450, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 450, easing: Easing.in(Easing.quad) }),
        ),
        -1,
      ),
    );
  }, [x, parado]);

  const estiloSeta = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <Animated.View entering={parado ? undefined : FadeIn.delay(DICA).duration(400)} style={estilos.dica}>
      <Pressable onPress={onPress} hitSlop={16} style={estilos.dicaBotao}>
        <Text style={estilos.dicaTexto}>arraste para o lado</Text>
        <Animated.View style={estiloSeta}>
          <Ionicons name="arrow-forward" size={18} color={Cores.pessegoClaro} />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

/** A cena inteira. Remonta (e recomeça) a cada nova paulada. */
function Cena({
  texto,
  parado,
  onOutra,
  onAvancar,
}: {
  texto: string;
  parado: boolean;
  onOutra?: () => void;
  onAvancar?: () => void;
}) {
  const { width } = useWindowDimensions();
  const tremida = useSharedValue(0);

  const larguraBalao = Math.min(width - 24, 440);
  const alturaBalao = larguraBalao * 0.86;
  const fonte = tamanhoFonte(texto, larguraBalao);
  const palavras = texto.split(/\s+/).filter(Boolean);
  const passo = Math.min(110, DURACAO_FRASE / Math.max(1, palavras.length));

  useEffect(() => {
    if (parado) return;
    tremida.value = withDelay(
      IMPACTO,
      withSequence(
        withTiming(-16, { duration: 40 }),
        withTiming(14, { duration: 40 }),
        withTiming(-9, { duration: 40 }),
        withTiming(6, { duration: 40 }),
        withTiming(0, { duration: 50 }),
      ),
    );
    const vibrar = setTimeout(() => {
      if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, IMPACTO);
    return () => clearTimeout(vibrar);
  }, [tremida, parado]);

  const estiloTremida = useAnimatedStyle(() => ({
    transform: [{ translateX: tremida.value }, { rotate: `${tremida.value * 0.12}deg` }],
  }));

  return (
    <View style={estilos.tela}>
      <Animated.View style={[estilos.palco, estiloTremida]}>
        <Animated.View entering={parado ? undefined : FadeIn.delay(BALAO)} style={estilos.rotulo}>
          <Ionicons name="sparkles" size={14} color={Cores.pessegoClaro} />
          <Text style={estilos.rotuloTexto}>#Paulada</Text>
        </Animated.View>

        {/* Balão de pensamento pontudo com a frase dentro. Tocar sorteia outra. */}
        <Pressable onPress={onOutra} disabled={!onOutra} accessibilityLabel={texto} accessibilityHint="Toque para outra paulada">
          <Estouro atraso={BALAO} parado={parado}>
            <View style={{ width: larguraBalao, height: alturaBalao }}>
              <BalaoEspinhoso largura={larguraBalao} altura={alturaBalao} contorno={Cores.texto} />
              <View style={[StyleSheet.absoluteFill, estilos.centro, { paddingHorizontal: larguraBalao * 0.17 }]}>
                <View style={estilos.frase}>
                  {palavras.map((palavra, i) => (
                    <Animated.Text
                      key={`${palavra}-${i}`}
                      entering={parado ? undefined : FadeInDown.delay(FRASE + i * passo).duration(350)}
                      style={[estilos.palavra, { fontSize: fonte, lineHeight: fonte * 1.28 }]}>
                      {palavra}
                    </Animated.Text>
                  ))}
                </View>
              </View>
            </View>
          </Estouro>
        </Pressable>

        {/* Bolinhas do pensamento, descendo até quem está "pensando" */}
        <View style={estilos.bolinhas}>
          <Estouro atraso={BOLINHAS + 160} parado={parado} balanco={4}>
            <BalaoEspinhoso largura={64} altura={54} pontas={11} profundidade={0.22} espessura={2.5} contorno={Cores.texto} />
          </Estouro>
          <View style={{ marginLeft: -30, marginTop: 44 }}>
            <Estouro atraso={BOLINHAS + 80} parado={parado} balanco={5}>
              <BalaoEspinhoso largura={42} altura={36} pontas={9} profundidade={0.24} espessura={2.5} contorno={Cores.texto} />
            </Estouro>
          </View>
          <View style={{ marginLeft: -20, marginTop: 78 }}>
            <Estouro atraso={BOLINHAS} parado={parado} balanco={6}>
              <BalaoEspinhoso largura={26} altura={22} pontas={7} profundidade={0.25} espessura={2} contorno={Cores.texto} />
            </Estouro>
          </View>
        </View>
      </Animated.View>

      {!parado && <Pau />}
      {!parado && <Impacto />}

      <DicaArrastar parado={parado} onPress={onAvancar} />
    </View>
  );
}

/** Abertura do app: pancada + balão com a paulada. Ocupa a tela toda. */
export function PauladaAnimada({
  texto,
  onOutra,
  onAvancar,
}: {
  texto: string;
  onOutra?: () => void;
  onAvancar?: () => void;
}) {
  const parado = useReducedMotion();
  return <Cena key={texto} texto={texto} parado={parado} onOutra={onOutra} onAvancar={onAvancar} />;
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: Cores.lavandaEscura,
    overflow: 'hidden',
  },
  palco: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  centro: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rotulo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rotuloTexto: {
    fontFamily: Fontes.extra,
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: Cores.pessegoClaro,
  },
  frase: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    columnGap: 6,
  },
  palavra: {
    userSelect: 'none',
    fontFamily: Fontes.extra,
    color: Cores.texto,
    textAlign: 'center',
  },
  bolinhas: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginLeft: '16%',
    marginTop: -14,
  },
  pauEixo: {
    alignItems: 'center',
    // corpo (160) + cabo (40) + espaço (200) = 400: o centro fica na ponta do cabo
    height: 400,
  },
  pauCorpo: {
    width: 44,
    height: 160,
    backgroundColor: MADEIRA,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 2.5,
    borderColor: MADEIRA_ESCURA,
  },
  pauCabo: {
    width: 26,
    height: 40,
    backgroundColor: MADEIRA_ESCURA,
    borderBottomLeftRadius: 13,
    borderBottomRightRadius: 13,
  },
  pauVeio: {
    position: 'absolute',
    width: 2,
    height: 50,
    borderRadius: 1,
    backgroundColor: MADEIRA_ESCURA,
    opacity: 0.5,
  },
  pauNo: {
    position: 'absolute',
    width: 10,
    height: 7,
    borderRadius: 5,
    backgroundColor: MADEIRA_ESCURA,
    opacity: 0.7,
  },
  clarao: {
    backgroundColor: '#FFFFFF',
  },
  estouro: {
    backgroundColor: Cores.pessego,
    paddingHorizontal: 26,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  estouroTexto: {
    fontFamily: Fontes.extra,
    fontSize: 48,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  dica: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dicaBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  dicaTexto: {
    fontFamily: Fontes.negrito,
    fontSize: 15,
    color: Cores.pessegoClaro,
  },
});
