import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { Contorno, Cores, Espaco, Fontes, Raio } from '@/constants/theme';

const CORES = ['#3D3450', '#E0564B', '#F29A3F', '#F2C94C', '#7FA677', '#4F8FD6', '#8E78C8', '#E27AAE'];
const ESPESSURAS = [6, 12, 22];

type Traco = { d: string; cor: string; espessura: number };

export default function Desenhar() {
  const [tracos, setTracos] = useState<Traco[]>([]);
  const [cor, setCor] = useState(CORES[1]);
  const [espessura, setEspessura] = useState(ESPESSURAS[1]);

  // Cada toque começa um traço novo; arrastar vai somando pontos a ele.
  const toque = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e) => {
          const { locationX: x, locationY: y } = e.nativeEvent;
          setTracos((atuais) => [...atuais, { d: `M${x.toFixed(1)} ${y.toFixed(1)} l0.1 0`, cor, espessura }]);
        },
        onPanResponderMove: (e) => {
          const { locationX: x, locationY: y } = e.nativeEvent;
          setTracos((atuais) => {
            if (!atuais.length) return atuais;
            const ultimo = atuais[atuais.length - 1];
            return [...atuais.slice(0, -1), { ...ultimo, d: `${ultimo.d} L${x.toFixed(1)} ${y.toFixed(1)}` }];
          });
        },
      }),
    [cor, espessura],
  );

  return (
    <SafeAreaView style={estilos.tela} edges={['bottom']}>
      <Text style={estilos.pedido}>Desenhe como você está se sentindo 💛</Text>

      <View style={estilos.papel} {...toque.panHandlers}>
        {/* Camada que ignora toques: o toque é sempre do papel, então as coordenadas não "pulam" */}
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <Svg width="100%" height="100%">
            {tracos.map((t, i) => (
              <Path
                key={i}
                d={t.d}
                stroke={t.cor}
                strokeWidth={t.espessura}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            ))}
          </Svg>
        </View>
        {tracos.length === 0 && (
          <View pointerEvents="none" style={estilos.dica}>
            <Text style={estilos.dicaTexto}>Use o dedo para desenhar aqui ✍️</Text>
          </View>
        )}
      </View>

      <View style={estilos.ferramentas}>
        <View style={estilos.cores}>
          {CORES.map((c) => (
            <Pressable
              key={c}
              onPress={() => setCor(c)}
              accessibilityLabel={`Cor ${c}`}
              style={[estilos.cor, { backgroundColor: c }, cor === c && estilos.corAtiva]}
            />
          ))}
        </View>
        <View style={estilos.linha}>
          <View style={estilos.espessuras}>
            {ESPESSURAS.map((e) => (
              <Pressable
                key={e}
                onPress={() => setEspessura(e)}
                style={[estilos.espessura, espessura === e && estilos.espessuraAtiva]}
                accessibilityLabel={`Pincel ${e}`}>
                <View style={{ width: e, height: e, borderRadius: e / 2, backgroundColor: cor }} />
              </Pressable>
            ))}
          </View>
          <View style={estilos.acoes}>
            <Pressable
              onPress={() => setTracos((t) => t.slice(0, -1))}
              style={estilos.acao}
              accessibilityLabel="Desfazer">
              <Ionicons name="arrow-undo" size={24} color={Cores.texto} />
            </Pressable>
            <Pressable onPress={() => setTracos([])} style={estilos.acao} accessibilityLabel="Apagar tudo">
              <Ionicons name="trash-outline" size={24} color={Cores.erro} />
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: Cores.fundo,
    padding: Espaco.md,
    paddingTop: 0,
    gap: Espaco.md,
  },
  pedido: {
    fontFamily: Fontes.extra,
    fontSize: 19,
    color: Cores.texto,
    textAlign: 'center',
  },
  papel: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: Raio.lg,
    overflow: 'hidden',
    ...Contorno,
  },
  dica: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dicaTexto: {
    fontFamily: Fontes.media,
    fontSize: 17,
    color: Cores.textoClaro,
  },
  ferramentas: {
    gap: Espaco.md,
  },
  cores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cor: {
    width: 36,
    height: 36,
    borderRadius: 18,
    ...Contorno,
  },
  corAtiva: {
    transform: [{ scale: 1.2 }],
    borderWidth: 3.5,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  espessuras: {
    flexDirection: 'row',
    gap: Espaco.sm,
  },
  espessura: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Cores.superficie,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  espessuraAtiva: {
    borderColor: Cores.texto,
  },
  acoes: {
    flexDirection: 'row',
    gap: Espaco.sm,
  },
  acao: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Cores.superficie,
    alignItems: 'center',
    justifyContent: 'center',
    ...Contorno,
  },
});
