import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Cores, Espaco, Fontes, Raio, Sombra } from '@/constants/theme';

/** Tela de topo de aba: fundo creme, respeita o notch e mostra título/subtítulo. */
export function Tela({
  titulo,
  subtitulo,
  children,
}: {
  titulo?: string;
  subtitulo?: string;
  children: ReactNode;
}) {
  return (
    <SafeAreaView style={estilos.tela} edges={['top']}>
      {(titulo || subtitulo) && (
        <View style={estilos.cabecalho}>
          {titulo && <Text style={estilos.titulo}>{titulo}</Text>}
          {subtitulo && <Text style={estilos.subtitulo}>{subtitulo}</Text>}
        </View>
      )}
      {children}
    </SafeAreaView>
  );
}

export function Carregando({ cor = Cores.lavanda }: { cor?: string }) {
  return (
    <View style={estilos.centro}>
      <ActivityIndicator size="large" color={cor} />
    </View>
  );
}

export function Erro({ mensagem, onTentar }: { mensagem: string; onTentar?: () => void }) {
  return (
    <View style={estilos.centro}>
      <Ionicons name="cloud-offline-outline" size={40} color={Cores.textoClaro} />
      <Text style={estilos.erroTexto}>{mensagem}</Text>
      {onTentar && <Botao titulo="Tentar de novo" onPress={onTentar} variante="suave" />}
    </View>
  );
}

export function Vazio({ mensagem, icone = 'leaf-outline' }: { mensagem: string; icone?: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={estilos.centro}>
      <Ionicons name={icone} size={40} color={Cores.textoClaro} />
      <Text style={estilos.vazioTexto}>{mensagem}</Text>
    </View>
  );
}

/** Cartão branco arredondado que responde ao toque. */
export function Cartao({
  children,
  style,
  ...props
}: PressableProps & { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [estilos.cartao, pressed && estilos.pressionado, style]}>
      {children}
    </Pressable>
  );
}

export function Botao({
  titulo,
  onPress,
  cor = Cores.lavanda,
  variante = 'cheio',
  icone,
}: {
  titulo: string;
  onPress: () => void;
  cor?: string;
  variante?: 'cheio' | 'suave';
  icone?: keyof typeof Ionicons.glyphMap;
}) {
  const cheio = variante === 'cheio';
  const corTexto = cheio ? '#FFFFFF' : cor;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        estilos.botao,
        cheio ? { backgroundColor: cor } : { backgroundColor: 'transparent', borderColor: cor, borderWidth: 1.5 },
        pressed && estilos.pressionado,
      ]}>
      {icone && <Ionicons name={icone} size={18} color={corTexto} />}
      <Text style={[estilos.botaoTexto, { color: corTexto }]}>{titulo}</Text>
    </Pressable>
  );
}

/** Etiqueta pequena em caixa alta, tipo "#PAULADA". */
export function Rotulo({ children, cor = Cores.textoSuave }: { children: ReactNode; cor?: string }) {
  return <Text style={[estilos.rotulo, { color: cor }]}>{children}</Text>;
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: Cores.fundo,
  },
  cabecalho: {
    paddingHorizontal: Espaco.lg,
    paddingTop: Espaco.md,
    paddingBottom: Espaco.md,
  },
  titulo: {
    fontFamily: Fontes.extra,
    fontSize: 28,
    color: Cores.texto,
  },
  subtitulo: {
    fontFamily: Fontes.regular,
    fontSize: 15,
    color: Cores.textoSuave,
    marginTop: Espaco.xs,
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Espaco.lg,
    gap: Espaco.md,
    backgroundColor: Cores.fundo,
  },
  erroTexto: {
    fontFamily: Fontes.media,
    fontSize: 15,
    color: Cores.textoSuave,
    textAlign: 'center',
  },
  vazioTexto: {
    fontFamily: Fontes.regular,
    fontSize: 15,
    color: Cores.textoSuave,
    textAlign: 'center',
  },
  cartao: {
    backgroundColor: Cores.superficie,
    borderRadius: Raio.md,
    padding: Espaco.md,
    ...Sombra,
  },
  pressionado: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Espaco.sm,
    paddingVertical: 12,
    paddingHorizontal: Espaco.lg,
    borderRadius: Raio.pilula,
    alignSelf: 'center',
  },
  botaoTexto: {
    fontFamily: Fontes.negrito,
    fontSize: 15,
  },
  rotulo: {
    fontFamily: Fontes.extra,
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
