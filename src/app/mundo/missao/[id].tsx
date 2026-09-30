import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import { buscarMissao, marcarMissaoConcluida } from '@/components/mundo/dados';
import { Carregando, Erro } from '@/components/ui';
import { Cores, Espaco, Fontes, Raio, Sombra } from '@/constants/theme';
import { useDados } from '@/hooks/use-dados';

export default function FazerMissao() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const carregar = useCallback(() => buscarMissao(id), [id]);
  const { dados: missao, carregando, erro, tentarDeNovo } = useDados(carregar);
  const [feitos, setFeitos] = useState<number[]>([]);
  const [comemorando, setComemorando] = useState(false);

  if (carregando) return <Carregando cor={Cores.pessego} />;
  if (erro || !missao) return <Erro mensagem={erro ?? 'Algo deu errado.'} onTentar={tentarDeNovo} />;

  const passos = missao.passos ?? [];

  function alternar(i: number) {
    if (!missao) return;
    const novos = feitos.includes(i) ? feitos.filter((f) => f !== i) : [...feitos, i];
    setFeitos(novos);
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    if (novos.length === passos.length && passos.length > 0) {
      setComemorando(true);
      marcarMissaoConcluida(missao.id);
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Missão' }} />
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View style={estilos.cabecalho}>
          <Text style={estilos.emoji}>{missao.emoji}</Text>
          <Text style={estilos.titulo}>{missao.titulo}</Text>
          {missao.descricao && <Text style={estilos.descricao}>{missao.descricao}</Text>}
        </View>

        {passos.map((passo, i) => {
          const feito = feitos.includes(i);
          return (
            <Pressable
              key={i}
              onPress={() => alternar(i)}
              style={({ pressed }) => [estilos.passo, feito && estilos.passoFeito, pressed && { transform: [{ scale: 0.98 }] }]}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: feito }}>
              <View style={[estilos.caixa, feito && estilos.caixaFeita]}>
                {feito ? (
                  <Ionicons name="checkmark" size={24} color="#FFFFFF" />
                ) : (
                  <Text style={estilos.numero}>{i + 1}</Text>
                )}
              </View>
              <Text style={[estilos.passoTexto, feito && estilos.passoTextoFeito]}>{passo}</Text>
            </Pressable>
          );
        })}

        {comemorando && (
          <Animated.View entering={FadeIn} style={estilos.comemoracao}>
            <Animated.Text entering={ZoomIn.springify().damping(8)} style={estilos.estrela}>
              🌟
            </Animated.Text>
            <Text style={estilos.parabens}>Missão cumprida!</Text>
            <Text style={estilos.parabensTexto}>Você ganhou uma estrela ⭐</Text>
            {missao.desenhar ? (
              <Pressable onPress={() => router.replace('/mundo/desenhar')} style={estilos.botao}>
                <Text style={estilos.botaoTexto}>🎨 Ir desenhar</Text>
              </Pressable>
            ) : (
              <Pressable onPress={() => router.back()} style={estilos.botao}>
                <Text style={estilos.botaoTexto}>Voltar</Text>
              </Pressable>
            )}
          </Animated.View>
        )}
      </ScrollView>
    </>
  );
}

const estilos = StyleSheet.create({
  conteudo: {
    padding: Espaco.lg,
    paddingTop: Espaco.sm,
    gap: Espaco.md,
    paddingBottom: Espaco.xl * 2,
  },
  cabecalho: {
    alignItems: 'center',
    gap: 4,
    marginBottom: Espaco.sm,
  },
  emoji: {
    fontSize: 72,
  },
  titulo: {
    fontFamily: Fontes.extra,
    fontSize: 26,
    color: Cores.texto,
    textAlign: 'center',
  },
  descricao: {
    fontFamily: Fontes.media,
    fontSize: 16,
    color: Cores.textoSuave,
    textAlign: 'center',
  },
  passo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.md,
    backgroundColor: Cores.superficie,
    borderRadius: Raio.md,
    padding: Espaco.md,
    minHeight: 72,
    ...Sombra,
  },
  passoFeito: {
    backgroundColor: Cores.salviaClara,
  },
  caixa: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: Cores.pessego,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caixaFeita: {
    backgroundColor: Cores.salvia,
    borderColor: Cores.salvia,
  },
  numero: {
    fontFamily: Fontes.extra,
    fontSize: 18,
    color: Cores.pessegoEscuro,
  },
  passoTexto: {
    flex: 1,
    fontFamily: Fontes.negrito,
    fontSize: 18,
    lineHeight: 25,
    color: Cores.texto,
  },
  passoTextoFeito: {
    color: Cores.salviaEscura,
  },
  comemoracao: {
    alignItems: 'center',
    backgroundColor: '#FFF4D6',
    borderRadius: Raio.lg,
    padding: Espaco.lg,
    gap: 6,
    marginTop: Espaco.sm,
  },
  estrela: {
    fontSize: 90,
  },
  parabens: {
    fontFamily: Fontes.extra,
    fontSize: 28,
    color: Cores.texto,
  },
  parabensTexto: {
    fontFamily: Fontes.media,
    fontSize: 17,
    color: Cores.textoSuave,
  },
  botao: {
    backgroundColor: Cores.pessegoEscuro,
    borderRadius: Raio.pilula,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: Espaco.md,
  },
  botaoTexto: {
    fontFamily: Fontes.extra,
    fontSize: 18,
    color: '#FFFFFF',
  },
});
