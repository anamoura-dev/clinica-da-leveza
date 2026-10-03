import { Ionicons } from '@expo/vector-icons';
import { Href, Link, router, useLocalSearchParams } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, PressableProps, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CaixaFofa } from '@/components/balao-fofo';
import { buscarMundo, useMissoesConcluidas } from '@/components/mundo/dados';
import { BarraPassos, CaixaAlta, tk, tom } from '@/components/mundo/estilo';
import { Carregando, Erro } from '@/components/ui';
import { Contorno, Cores, Espaco, Fontes, Raio } from '@/constants/theme';
import { useDados } from '@/hooks/use-dados';

/** Área tocável com efeito de toque, que funciona dentro de <Link asChild>. */
function Toque({ style, children, ...props }: PressableProps & { style?: StyleProp<ViewStyle>; children: ReactNode }) {
  return (
    <Pressable {...props} style={({ pressed }) => [style, pressed && estilos.pressionado]}>
      {children}
    </Pressable>
  );
}

type Opcao = {
  chave: string;
  href: Href;
  icone: keyof typeof Ionicons.glyphMap;
  cor: string;
  rotulo: string;
  titulo: string;
  emoji?: string;
  feita?: boolean;
};

/**
 * PASSO 2 — a página do sentimento escolhido.
 * O personagem daquele sentimento fala, e a criança escolhe o que fazer:
 * ouvir uma história, fazer uma missão ou desenhar (passo 3).
 */
export default function PassoEscolha() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dados, carregando, erro, tentarDeNovo } = useDados(buscarMundo, 'mundo');
  const concluidas = useMissoesConcluidas();

  if (carregando) return <Carregando />;
  if (erro || !dados) return <Erro mensagem={erro ?? 'Algo deu errado.'} onTentar={tentarDeNovo} />;

  const sentimento = dados.sentimentos.find((s) => s.id === id);
  if (!sentimento) return <Erro mensagem="Esse sentimento não foi encontrado." onTentar={() => router.back()} />;

  const personagem = dados.personagens.find((p) => p.id === sentimento.personagem_id) ?? dados.personagens[0];
  const estrelas = dados.missoes.filter((m) => concluidas.includes(m.id)).length;

  // Primeiro o que é deste sentimento; depois ideias que servem para qualquer sentimento.
  const opcoes: Opcao[] = [
    ...dados.historias
      .filter((h) => h.sentimento_id === sentimento.id)
      .map((h) => ({
        chave: `h-${h.id}`,
        href: `/mundo/historia/${h.id}` as Href,
        icone: 'book' as const,
        cor: Cores.azulEscuro,
        rotulo: 'Ouvir uma história',
        titulo: h.titulo,
        emoji: h.emoji,
      })),
    ...dados.missoes
      .filter((m) => m.sentimento_id === sentimento.id || m.sentimento_id === null)
      .sort((a, b) => Number(b.sentimento_id === sentimento.id) - Number(a.sentimento_id === sentimento.id))
      .map((m) => ({
        chave: `m-${m.id}`,
        href: `/mundo/missao/${m.id}` as Href,
        icone: 'flag' as const,
        cor: Cores.verdeEscuro,
        rotulo: 'Fazer uma missão',
        titulo: m.titulo,
        emoji: m.emoji,
        feita: concluidas.includes(m.id),
      })),
    {
      chave: 'desenhar',
      href: '/mundo/desenhar',
      icone: 'color-palette',
      cor: Cores.lilasEscuro,
      rotulo: 'Desenhar',
      titulo: `Desenhe como é ficar ${sentimento.nome.toLowerCase()}`,
    },
  ];

  return (
    <SafeAreaView style={estilos.tela} edges={['top']}>
      <View style={estilos.topo}>
        <BarraPassos
          passo={2}
          estrelas={estrelas}
          rotuloIcone="Escolher outro sentimento"
          aoTocarIcone={() => router.back()}
        />
      </View>

      <ScrollView contentContainerStyle={estilos.conteudo}>
        {/* O sentimento escolhido + o personagem falando */}
        <View style={[estilos.escolhido, { backgroundColor: tom(sentimento.cor, 0.9) }]}>
          <Text style={estilos.escolhidoEmoji}>{sentimento.emoji}</Text>
          <Text style={estilos.escolhidoTexto}>Você está: {sentimento.nome}</Text>
        </View>

        <View style={estilos.cena}>
          <Animated.View
            entering={ZoomIn.springify().damping(12)}
            style={[estilos.personagem, { backgroundColor: personagem?.cor ?? Cores.amareloClaro }]}>
            <Text style={estilos.personagemEmoji}>{personagem?.emoji ?? '🦊'}</Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(150).duration(350)} style={{ flex: 1 }}>
            <CaixaFofa>
              {personagem && <Text style={estilos.falaNome}>{personagem.nome}</Text>}
              <Text style={estilos.falaTexto}>{sentimento.mensagem}</Text>
            </CaixaFofa>
          </Animated.View>
        </View>

        <Text style={estilos.pergunta}>O que você quer fazer agora?</Text>

        {opcoes.map((o, i) => (
          <Animated.View key={o.chave} entering={FadeInDown.delay(250 + i * 70).duration(350)}>
            <Link href={o.href} asChild>
              <Toque style={estilos.opcao}>
                <View style={[estilos.opcaoIcone, { backgroundColor: o.cor }]}>
                  <Ionicons name={o.icone} size={26} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[estilos.opcaoRotulo, { color: o.cor }]}>{o.rotulo}</Text>
                  <Text style={estilos.opcaoTitulo}>
                    {o.emoji ? `${o.emoji} ` : ''}
                    {o.titulo}
                  </Text>
                </View>
                {o.feita !== undefined ? (
                  <Text style={estilos.estrela}>{o.feita ? '⭐' : '☆'}</Text>
                ) : (
                  <Ionicons name="chevron-forward" size={22} color={Cores.marinho} />
                )}
              </Toque>
            </Link>
          </Animated.View>
        ))}

        <Pressable onPress={() => router.back()} style={estilos.outro} hitSlop={8}>
          <Ionicons name="arrow-back" size={18} color={Cores.textoSuave} />
          <Text style={estilos.outroTexto}>Escolher outro sentimento</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: Cores.fundo,
  },
  topo: {
    paddingHorizontal: Espaco.md,
    paddingTop: Espaco.sm,
  },
  conteudo: {
    padding: Espaco.md,
    gap: Espaco.md,
    paddingBottom: Espaco.xl * 2,
  },
  escolhido: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: Espaco.sm,
    paddingVertical: Espaco.sm,
    paddingHorizontal: Espaco.lg,
    borderRadius: Raio.pilula,
    ...Contorno,
  },
  escolhidoEmoji: {
    fontSize: 28,
  },
  escolhidoTexto: {
    ...CaixaAlta,
    fontFamily: Fontes.extra,
    fontSize: tk(16),
    color: Cores.marinho,
  },
  cena: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm,
  },
  personagem: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    ...Contorno,
  },
  personagemEmoji: {
    fontSize: 50,
  },
  falaNome: {
    ...CaixaAlta,
    fontFamily: Fontes.extra,
    fontSize: tk(12),
    color: Cores.terracotaEscura,
    textAlign: 'center',
  },
  falaTexto: {
    ...CaixaAlta,
    fontFamily: Fontes.negrito,
    fontSize: tk(13),
    lineHeight: tk(18),
    color: Cores.marinho,
    textAlign: 'center',
  },
  pergunta: {
    ...CaixaAlta,
    fontFamily: Fontes.extra,
    fontSize: tk(19),
    lineHeight: tk(24),
    color: Cores.marinho,
    textAlign: 'center',
    marginTop: Espaco.sm,
  },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.md,
    backgroundColor: Cores.superficie,
    borderRadius: Raio.md,
    padding: Espaco.md,
    minHeight: 84,
    ...Contorno,
  },
  opcaoIcone: {
    width: 52,
    height: 52,
    borderRadius: Raio.sm,
    alignItems: 'center',
    justifyContent: 'center',
    ...Contorno,
  },
  opcaoRotulo: {
    ...CaixaAlta,
    letterSpacing: 1,
    fontFamily: Fontes.extra,
    fontSize: tk(11),
  },
  opcaoTitulo: {
    ...CaixaAlta,
    fontFamily: Fontes.extra,
    fontSize: tk(15),
    lineHeight: tk(20),
    color: Cores.marinho,
    marginTop: 2,
  },
  estrela: {
    fontSize: 26,
    color: Cores.amareloEscuro,
  },
  pressionado: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  outro: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: Espaco.sm,
  },
  outroTexto: {
    ...CaixaAlta,
    fontFamily: Fontes.extra,
    fontSize: tk(13),
    color: Cores.textoSuave,
  },
});
