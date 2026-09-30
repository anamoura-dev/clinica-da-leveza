import { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { Cores } from '@/constants/theme';

type Nuvem = { x: number | `${number}%`; y: number | `${number}%`; largura: number };

/** Nuvem branca simples: três "bolas" sobrepostas. */
function NuvemBranca({ largura }: { largura: number }) {
  const a = largura * 0.38;
  return (
    <View style={{ width: largura, height: a }}>
      <View style={[estilos.bola, { left: 0, top: a * 0.35, width: largura, height: a * 0.65, borderRadius: a }]} />
      <View style={[estilos.bola, { left: largura * 0.18, top: a * 0.05, width: largura * 0.38, height: largura * 0.38 * 0.8, borderRadius: largura }]} />
      <View style={[estilos.bola, { left: largura * 0.42, top: 0, width: largura * 0.36, height: largura * 0.36 * 0.9, borderRadius: largura }]} />
    </View>
  );
}

/**
 * Fundo de céu (gradiente azul → claro) com nuvens.
 * Fica atrás do conteúdo: coloque-o como primeiro filho de uma View com position relative.
 */
export function Ceu({
  nuvens = [],
  ateCreme = false,
}: {
  nuvens?: Nuvem[];
  /** termina no creme do fundo do app, para "emendar" com o resto da tela */
  ateCreme?: boolean;
}) {
  const id = `ceu-${useId().replace(/:/g, '')}`;
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%">
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={Cores.ceuTopo} />
            <Stop offset={ateCreme ? '0.7' : '1'} stopColor={Cores.ceuBase} />
            <Stop offset="1" stopColor={ateCreme ? Cores.fundo : Cores.ceuBase} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
      {nuvens.map((n, i) => (
        <View key={i} style={{ position: 'absolute', left: n.x, top: n.y, opacity: 0.92 }}>
          <NuvemBranca largura={n.largura} />
        </View>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  bola: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
});
