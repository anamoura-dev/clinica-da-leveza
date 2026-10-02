import { useEffect, useId } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { ClipPath, Defs, Ellipse, G, Line, Path, Rect } from 'react-native-svg';

import { Cores } from '@/constants/theme';

/**
 * Balão de ar quente — símbolo da Clínica da Leveza.
 * Desenho próprio do app: envelope com gomos listrados em tons pastel
 * (azul, rosa, roxo, verde e amarelo), contorno azul-marinho, cordas e cesto.
 * As mesmas cores estão no ícone do app (assets/images) — se mudar aqui, gere o ícone de novo.
 */
export const CoresBalao = {
  azul: '#B7D2EE',
  rosa: '#F6C3CF',
  roxo: '#D4C6F0',
  verde: '#C8E0A8',
  amarelo: '#F8E0A2',
  cesto: '#F5CF92',
} as const;

export function BalaoAr({ largura = 48 }: { largura?: number }) {
  const w = largura;
  const h = w * 1.32;
  const idRecorte = `envelope-${useId().replace(/:/g, '')}`;
  const traco = Math.max(1.2, w * 0.018);

  const envelope = `M${w * 0.5} ${w * 0.04} C${w * 0.93} ${w * 0.04} ${w} ${w * 0.42} ${w * 0.9} ${w * 0.6} C${w * 0.8} ${w * 0.78} ${w * 0.66} ${w * 0.86} ${w * 0.6} ${w * 0.93} L${w * 0.4} ${w * 0.93} C${w * 0.34} ${w * 0.86} ${w * 0.2} ${w * 0.78} ${w * 0.1} ${w * 0.6} C0 ${w * 0.42} ${w * 0.07} ${w * 0.04} ${w * 0.5} ${w * 0.04} Z`;
  const gomos: [number, string][] = [
    [0.5, CoresBalao.azul],
    [0.38, CoresBalao.rosa],
    [0.28, CoresBalao.roxo],
    [0.18, CoresBalao.verde],
    [0.085, CoresBalao.amarelo],
  ];

  return (
    <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <Defs>
        <ClipPath id={idRecorte}>
          <Path d={envelope} />
        </ClipPath>
      </Defs>
      <G clipPath={`url(#${idRecorte})`}>
        <Rect width={w} height={w} fill={CoresBalao.azul} />
        {gomos.map(([rx, cor]) => (
          <Ellipse
            key={cor}
            cx={w * 0.5}
            cy={w * 0.48}
            rx={w * rx}
            ry={w * 0.62}
            fill={cor}
            stroke={Cores.marinho}
            strokeWidth={traco * 0.7}
          />
        ))}
      </G>
      <Path d={envelope} fill="none" stroke={Cores.marinho} strokeWidth={traco} />
      <Rect
        x={w * 0.39}
        y={w * 0.92}
        width={w * 0.22}
        height={w * 0.05}
        rx={w * 0.02}
        fill={CoresBalao.rosa}
        stroke={Cores.marinho}
        strokeWidth={traco * 0.7}
      />
      <Line x1={w * 0.41} y1={w * 0.97} x2={w * 0.39} y2={w * 1.1} stroke={Cores.marinho} strokeWidth={traco * 0.7} />
      <Line x1={w * 0.59} y1={w * 0.97} x2={w * 0.61} y2={w * 1.1} stroke={Cores.marinho} strokeWidth={traco * 0.7} />
      <Rect
        x={w * 0.34}
        y={w * 1.1}
        width={w * 0.32}
        height={w * 0.19}
        rx={w * 0.03}
        fill={CoresBalao.cesto}
        stroke={Cores.marinho}
        strokeWidth={traco * 0.8}
      />
      {[0.42, 0.5, 0.58].map((x) => (
        <Line
          key={x}
          x1={w * x}
          y1={w * 1.13}
          x2={w * x}
          y2={w * 1.26}
          stroke={Cores.marinho}
          strokeWidth={traco * 0.5}
          opacity={0.6}
        />
      ))}
      <Rect
        x={w * 0.31}
        y={w * 1.08}
        width={w * 0.38}
        height={w * 0.05}
        rx={w * 0.02}
        fill={CoresBalao.cesto}
        stroke={Cores.marinho}
        strokeWidth={traco * 0.8}
      />
    </Svg>
  );
}

/** Balão que flutua devagar para cima e para baixo. */
export function BalaoFlutuante({
  largura = 48,
  amplitude = 6,
  duracao = 1800,
  style,
}: {
  largura?: number;
  amplitude?: number;
  duracao?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const parado = useReducedMotion();
  const y = useSharedValue(0);

  useEffect(() => {
    if (parado) return;
    y.value = withRepeat(
      withSequence(
        withTiming(-amplitude, { duration: duracao, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: duracao, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
    );
  }, [y, amplitude, duracao, parado]);

  const estilo = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }, { rotate: `${(y.value / Math.max(1, amplitude)) * -2}deg` }],
  }));

  return (
    <Animated.View style={[estilo, style]}>
      <BalaoAr largura={largura} />
    </Animated.View>
  );
}

/** Espaço reservado do tamanho do balão (útil para alinhar layouts). */
export function EspacoBalao({ largura = 48 }: { largura?: number }) {
  return <View style={{ width: largura, height: largura * 1.32 }} />;
}
