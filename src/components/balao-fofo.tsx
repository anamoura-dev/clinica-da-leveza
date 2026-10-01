import { ReactNode, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Cores } from '@/constants/theme';

/** Contorno de nuvem: uma elipse com "ondinhas" arredondadas para fora. */
function caminhoNuvem(largura: number, altura: number, espessura: number) {
  const cx = largura / 2;
  const cy = altura / 2;
  const estufa = 1.14; // quanto cada ondinha sai para fora
  const folga = 1.08; // espaço para as ondinhas caberem dentro do desenho
  const rx = (largura / 2 - espessura) / folga;
  const ry = (altura / 2 - espessura) / folga;
  const perimetro = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
  const ondas = Math.max(8, Math.round(perimetro / 34));

  // "Superelipse": um oval mais quadradinho, que deixa mais espaço para o texto nos cantos.
  const forma = 2.8;
  const curva = (v: number) => Math.sign(v) * Math.pow(Math.abs(v), 2 / forma);
  const ponto = (angulo: number, r: number) =>
    `${(cx + rx * r * curva(Math.cos(angulo))).toFixed(1)} ${(cy + ry * r * curva(Math.sin(angulo))).toFixed(1)}`;

  let d = `M${ponto(-Math.PI / 2, 1)}`;
  for (let i = 0; i < ondas; i++) {
    const a0 = -Math.PI / 2 + (i / ondas) * Math.PI * 2;
    const a1 = -Math.PI / 2 + ((i + 1) / ondas) * Math.PI * 2;
    d += ` Q${ponto((a0 + a1) / 2, estufa)} ${ponto(a1, 1)}`;
  }
  return `${d} Z`;
}

export function BalaoNuvem({
  largura,
  altura,
  cor = '#FFFFFF',
  contorno = Cores.marinho,
  espessura = 2.5,
}: {
  largura: number;
  altura: number;
  cor?: string;
  contorno?: string;
  espessura?: number;
}) {
  return (
    <Svg width={largura} height={altura}>
      <Path
        d={caminhoNuvem(largura, altura, espessura)}
        fill={cor}
        stroke={contorno}
        strokeWidth={espessura}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Fala em balão de nuvem fofinho (Espaço das Crianças), que se ajusta ao texto.
 * Duas bolinhas saem para a esquerda, em direção a quem está falando.
 */
export function CaixaFofa({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const [tamanho, setTamanho] = useState<{ w: number; h: number } | null>(null);
  return (
    <View style={[estilos.area, style]}>
      <View
        style={estilos.caixa}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          if (!tamanho || Math.abs(tamanho.w - width) > 1 || Math.abs(tamanho.h - height) > 1) {
            setTamanho({ w: width, h: height });
          }
        }}>
        {tamanho && (
          <View pointerEvents="none" style={estilos.fundo}>
            <BalaoNuvem largura={tamanho.w} altura={tamanho.h} />
          </View>
        )}
        {children}
      </View>
      {/* bolinhas do "pensamento/fala" indo até o personagem */}
      <View pointerEvents="none" style={[estilos.bolinha, estilos.bolinhaGrande]} />
      <View pointerEvents="none" style={[estilos.bolinha, estilos.bolinhaPequena]} />
    </View>
  );
}

const estilos = StyleSheet.create({
  area: {
    paddingLeft: 14, // espaço para as bolinhas
  },
  caixa: {
    paddingHorizontal: '12%',
    paddingVertical: 26,
  },
  fundo: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  bolinha: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: Cores.marinho,
    borderRadius: 999,
  },
  bolinhaGrande: {
    width: 16,
    height: 16,
    left: 6,
    bottom: '22%',
  },
  bolinhaPequena: {
    width: 9,
    height: 9,
    left: -2,
    bottom: '12%',
  },
});
