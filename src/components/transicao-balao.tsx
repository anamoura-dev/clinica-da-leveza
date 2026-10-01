import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Modal, Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { BalaoAr } from '@/components/balao-ar';
import { Ceu } from '@/components/ceu';
import { Cores, Fontes, t } from '@/constants/theme';

// Linha do tempo (ms)
const ENTRADA = 180; // o céu aparece
const SUBIDA = 650; // o balão sobe do pé da tela até o meio
const PAUSA = 250; // flutua um instante
const SAIDA = 450; // acelera e sai por cima
export const DURACAO_TRANSICAO = ENTRADA + SUBIDA + PAUSA + SAIDA; // ~1,5 s

/**
 * Tela de passagem: o balão da Leveza sobe voando enquanto a próxima página "carrega".
 * Mostre com `destino` (texto) e navegue em `aoTerminar`.
 */
export function TransicaoBalao({ destino, aoTerminar }: { destino: string; aoTerminar: () => void }) {
  const { height } = useWindowDimensions();
  const fundo = useSharedValue(0);
  const y = useSharedValue(height * 0.55);
  const balanco = useSharedValue(0);
  const texto = useSharedValue(0);

  useEffect(() => {
    fundo.value = withTiming(1, { duration: ENTRADA });
    texto.value = withDelay(ENTRADA + 250, withTiming(1, { duration: 300 }));
    y.value = withDelay(
      ENTRADA,
      withSequence(
        withTiming(0, { duration: SUBIDA, easing: Easing.out(Easing.cubic) }),
        withTiming(-12, { duration: PAUSA, easing: Easing.inOut(Easing.sin) }),
        withTiming(-height * 0.75, { duration: SAIDA, easing: Easing.in(Easing.cubic) }),
      ),
    );
    balanco.value = withDelay(
      ENTRADA,
      withSequence(
        withTiming(-5, { duration: 350, easing: Easing.inOut(Easing.sin) }),
        withTiming(4, { duration: 450, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 500, easing: Easing.inOut(Easing.sin) }),
      ),
    );
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const fim = setTimeout(aoTerminar, DURACAO_TRANSICAO);
    return () => clearTimeout(fim);
  }, [fundo, y, balanco, texto, height, aoTerminar]);

  const estiloFundo = useAnimatedStyle(() => ({ opacity: fundo.value }));
  const estiloBalao = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }, { rotate: `${balanco.value}deg` }],
  }));
  const estiloTexto = useAnimatedStyle(() => ({ opacity: texto.value }));

  return (
    <Modal transparent visible animationType="none" statusBarTranslucent onRequestClose={aoTerminar}>
      <Animated.View style={[StyleSheet.absoluteFill, estiloFundo]}>
        <Ceu
          ateCreme
          nuvens={[
            { x: '8%', y: '18%', largura: 90 },
            { x: '62%', y: '30%', largura: 110 },
            { x: '14%', y: '64%', largura: 80 },
            { x: '66%', y: '76%', largura: 70 },
          ]}
        />
        <View style={estilos.centro}>
          <Animated.View style={estiloBalao}>
            <BalaoAr largura={96} />
          </Animated.View>
        </View>
        <Animated.View style={[estilos.rodape, estiloTexto]}>
          <Text style={estilos.texto}>Abrindo {destino}...</Text>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rodape: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '16%',
    alignItems: 'center',
  },
  texto: {
    fontFamily: Fontes.extra,
    fontSize: t(18),
    color: Cores.marinho,
  },
});
