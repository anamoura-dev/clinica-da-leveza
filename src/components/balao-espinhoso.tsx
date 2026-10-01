import { ReactNode, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Cores } from '@/constants/theme';

/** "Ruído" determinístico entre 0 e 1, para as pontas variarem sem mudar a cada render. */
function ruido(k: number) {
  const x = Math.sin(k * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** Monta o contorno de uma elipse com pontas (estilo balão de quadrinho). */
function caminhoEspinhoso(largura: number, altura: number, pontas: number, profundidade: number) {
  const cx = largura / 2;
  const cy = altura / 2;
  const folga = 1 + 0.1; // espaço para as pontas mais longas
  const rx = (largura / 2 - 3) / folga;
  const ry = (altura / 2 - 3) / folga;

  const pontos: string[] = [];
  const total = pontas * 2;
  for (let k = 0; k < total; k++) {
    const angulo = (k / total) * Math.PI * 2 - Math.PI / 2;
    const r = k % 2 === 0 ? 1 + ruido(k) * 0.1 : 1 - profundidade + ruido(k) * 0.05;
    const x = cx + rx * r * Math.cos(angulo);
    const y = cy + ry * r * Math.sin(angulo);
    pontos.push(`${k === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return `${pontos.join(' ')} Z`;
}

export function BalaoEspinhoso({
  largura,
  altura,
  pontas = 22,
  profundidade = 0.16,
  cor = '#FFFFFF',
  contorno = Cores.marinho,
  espessura = 3,
}: {
  largura: number;
  altura: number;
  pontas?: number;
  profundidade?: number;
  cor?: string;
  contorno?: string;
  espessura?: number;
}) {
  return (
    <Svg width={largura} height={altura}>
      <Path
        d={caminhoEspinhoso(largura, altura, pontas, profundidade)}
        fill={cor}
        stroke={contorno}
        strokeWidth={espessura}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Caixa com balão pontudo atrás do conteúdo, que se ajusta ao tamanho do texto.
 * Use para "falas" (personagens, avisos) no estilo da paulada.
 */
export function CaixaEspinhosa({
  children,
  style,
  pontas = 16,
  profundidade = 0.13,
  espessura = 2.5,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  pontas?: number;
  profundidade?: number;
  espessura?: number;
}) {
  const [tamanho, setTamanho] = useState<{ w: number; h: number } | null>(null);
  return (
    <View
      style={[{ paddingHorizontal: '18%', paddingVertical: 40 }, style]}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        if (!tamanho || Math.abs(tamanho.w - width) > 1 || Math.abs(tamanho.h - height) > 1) {
          setTamanho({ w: width, h: height });
        }
      }}>
      {tamanho && (
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0 }}>
          <BalaoEspinhoso
            largura={tamanho.w}
            altura={tamanho.h}
            pontas={pontas}
            profundidade={profundidade}
            espessura={espessura}
          />
        </View>
      )}
      {children}
    </View>
  );
}
