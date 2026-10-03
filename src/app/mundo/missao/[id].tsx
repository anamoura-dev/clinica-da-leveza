import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import { buscarMissao, marcarMissaoConcluida } from '@/components/mundo/dados';
import { Carregando, Erro } from '@/components/ui';
import { Contorno, Cores, Espaco, Fontes, Raio } from '@/constants/theme';
import { CaixaAlta, tk } from '@/components/mundo/estilo';
import { useDados } from '@/hooks/use-dados';

export default function FazerMissao() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const carregar = useCallback(() => buscarMissao(id), [id]);
  const { dados: missao, carregando, erro, tentarDeNovo } = useDados(carregar, `missao:${id}`);
  const [feitos, setFeitos] = useState<number[]>([]);
  const [comemorando, setComemorando] = useState(false);

  if (carregando) return <Carregando />;
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
      <Stack.Screen options={{ title: 'MISSÃO' }} />
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
                  <Ionicons name="checkmark" size={24} color={Cores.marinho} />
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
    ...CaixaAlta,
    fontFamily: Fontes.extra,
    fontSize: tk(26),
    color: Cores.texto,
    textAlign: 'center',
  },
  descricao: {
    ...CaixaAlta,
    fontFamily: Fontes.media,
    fontSize: tk(16),
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
    ...Contorno,
  },
  passoFeito: {
    backgroundColor: Cores.verdeClaro,
  },
  caixa: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: Cores.marinho,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caixaFeita: {
    backgroundColor: Cores.verde,
    borderColor: Cores.verde,
  },
  numero: {
    ...CaixaAlta,
    fontFamily: Fontes.extra,
    fontSize: tk(18),
    color: Cores.marinho,
  },
  passoTexto: {
    ...CaixaAlta,
    flex: 1,
    fontFamily: Fontes.negrito,
    fontSize: tk(18),
    lineHeight: tk(25),
    color: Cores.texto,
  },
  passoTextoFeito: {
    color: Cores.verdeEscuro,
  },
  comemoracao: {
    alignItems: 'center',
    backgroundColor: Cores.amareloClaro,
    ...Contorno,
    borderRadius: Raio.lg,
    padding: Espaco.lg,
    gap: 6,
    marginTop: Espaco.sm,
  },
  estrela: {
    fontSize: 90,
  },
  parabens: {
    ...CaixaAlta,
    textAlign: 'center',
    fontFamily: Fontes.extra,
    fontSize: tk(26),
    color: Cores.texto,
  },
  parabensTexto: {
    ...CaixaAlta,
    textAlign: 'center',
    fontFamily: Fontes.media,
    fontSize: tk(17),
    color: Cores.textoSuave,
  },
  botao: {
    backgroundColor: Cores.amarelo,
    ...Contorno,
    borderRadius: Raio.pilula,
    paddingVertical: 14,
    paddingHorizontal: 28,
    marginTop: Espaco.md,
    alignSelf: 'center',
  },
  botaoTexto: {
    ...CaixaAlta,
    textAlign: 'center',
    fontFamily: Fontes.extra,
    fontSize: tk(16),
    color: Cores.marinho,
  },
});
