import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { ReactNode, useState } from 'react';
import { Pressable, PressableProps, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CaixaEspinhosa } from '@/components/balao-espinhoso';
import { Ceu } from '@/components/ceu';
import { buscarMundo, Sentimento, useMissoesConcluidas } from '@/components/mundo/dados';
import { Carregando, Erro } from '@/components/ui';
import { Contorno, Cores, Espaco, Fontes, Raio } from '@/constants/theme';
import { useDados } from '@/hooks/use-dados';

/**
 * Área tocável com efeito de toque, que funciona dentro de <Link asChild>.
 * Dentro de um Link, passe o estilo como objeto (use StyleSheet.flatten para juntar).
 */
function Toque({ style, children, ...props }: PressableProps & { style?: StyleProp<ViewStyle>; children: ReactNode }) {
  return (
    <Pressable {...props} style={({ pressed }) => [style, pressed && estilos.pressionado]}>
      {children}
    </Pressable>
  );
}

/** Cor hex com transparência (ex.: '#EE9A86' + 40%). */
const tom = (hex: string, alfa: number) =>
  `${hex}${Math.round(alfa * 255)
    .toString(16)
    .padStart(2, '0')}`;

export default function EspacoDasCriancas() {
  const { dados, carregando, erro, tentarDeNovo } = useDados(buscarMundo);
  const concluidas = useMissoesConcluidas();
  const insets = useSafeAreaInsets();
  const [sentimento, setSentimento] = useState<Sentimento | null>(null);
  const [personagemFalando, setPersonagemFalando] = useState<string | null>(null);

  if (carregando) return <Carregando />;
  if (erro || !dados) return <Erro mensagem={erro ?? 'Algo deu errado.'} onTentar={tentarDeNovo} />;

  const { personagens, sentimentos, historias, missoes } = dados;
  const guia = personagens[0];

  // Quem fala no balão: o personagem do sentimento escolhido, o personagem tocado ou a guia.
  const falante = sentimento
    ? personagens.find((p) => p.id === sentimento.personagem_id) ?? guia
    : personagens.find((p) => p.id === personagemFalando) ?? guia;
  const fala = sentimento
    ? sentimento.mensagem
    : falante
      ? falante.fala
      : 'Oi! Que bom que você chegou.';

  const sugestoes = sentimento
    ? [
        ...historias
          .filter((h) => h.sentimento_id === sentimento.id)
          .map((h) => ({ tipo: 'historia' as const, id: h.id, titulo: h.titulo, emoji: h.emoji })),
        ...missoes
          .filter((m) => m.sentimento_id === sentimento.id)
          .map((m) => ({ tipo: 'missao' as const, id: m.id, titulo: m.titulo, emoji: m.emoji })),
      ]
    : [];

  const estrelas = missoes.filter((m) => concluidas.includes(m.id)).length;

  return (
    <View style={estilos.tela}>
      <ScrollView contentContainerStyle={{ paddingBottom: Espaco.xl * 2 }}>
        {/* Céu com a turma falando no balão pontudo */}
        <View style={[estilos.ceu, { paddingTop: insets.top + Espaco.sm }]}>
          <Ceu nuvens={[{ x: '62%', y: 34, largura: 90 }, { x: '4%', y: 96, largura: 60 }]} />
          <View style={estilos.topo}>
            <Pressable onPress={() => router.back()} hitSlop={12} accessibilityLabel="Sair do Espaço das Crianças">
              <Ionicons name="close" size={26} color={Cores.marinho} />
            </Pressable>
            <Text style={estilos.topoTitulo}>Espaço das Crianças</Text>
            <View style={estilos.estrelas}>
              <Text style={estilos.estrelasTexto}>⭐ {estrelas}</Text>
            </View>
          </View>

          <View style={estilos.cena}>
            <Animated.View
              key={`${falante?.id}-${sentimento?.id ?? ''}`}
              entering={ZoomIn.springify().damping(12)}
              style={[estilos.personagem, { backgroundColor: falante?.cor ?? Cores.amareloClaro }]}>
              <Text style={estilos.personagemEmoji}>{falante?.emoji ?? '🦊'}</Text>
            </Animated.View>
            <Animated.View key={fala} entering={FadeIn.duration(300)} style={{ flex: 1 }}>
              <CaixaEspinhosa>
                {falante && <Text style={estilos.falaNome}>{falante.nome}</Text>}
                <Text style={estilos.falaTexto}>{fala}</Text>
              </CaixaEspinhosa>
            </Animated.View>
          </View>
        </View>

        <View style={estilos.conteudo}>
        {/* Termômetro de sentimentos */}
        <Text style={estilos.pergunta}>Como você está se sentindo agora?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.sentimentos}>
          {sentimentos.map((s) => {
            const ativo = sentimento?.id === s.id;
            return (
              <Pressable
                key={s.id}
                onPress={() => {
                  setSentimento(ativo ? null : s);
                  setPersonagemFalando(null);
                }}
                style={({ pressed }) => [
                  estilos.sentimento,
                  { backgroundColor: tom(s.cor, ativo ? 1 : 0.55) },
                  ativo && estilos.sentimentoAtivo,
                  pressed && { transform: [{ scale: 0.94 }] },
                ]}>
                <Text style={estilos.sentimentoEmoji}>{s.emoji}</Text>
                <Text style={estilos.sentimentoNome}>{s.nome}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {sugestoes.length > 0 && (
          <Animated.View entering={FadeIn} style={estilos.bloco}>
            <Text style={estilos.secao}>Para você agora</Text>
            {sugestoes.map((s) => (
              <Link
                key={s.id}
                href={s.tipo === 'historia' ? `/mundo/historia/${s.id}` : `/mundo/missao/${s.id}`}
                asChild>
                <Toque style={estilos.sugestao}>
                  <Text style={estilos.itemEmoji}>{s.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={estilos.itemTipo}>{s.tipo === 'historia' ? 'História' : 'Missão'}</Text>
                    <Text style={estilos.itemTitulo}>{s.titulo}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={Cores.amareloEscuro} />
                </Toque>
              </Link>
            ))}
          </Animated.View>
        )}

        {/* Histórias */}
        <View style={estilos.bloco}>
          <Text style={estilos.secao}>📖 Histórias</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.carrossel}>
            {historias.map((h) => {
              const cor = personagens.find((p) => p.id === h.personagem_id)?.cor ?? Cores.amareloClaro;
              return (
                <Link key={h.id} href={`/mundo/historia/${h.id}`} asChild>
                  <Toque style={StyleSheet.flatten([estilos.historia, { backgroundColor: cor }])}>
                    <Text style={estilos.historiaEmoji}>{h.emoji}</Text>
                    <Text style={estilos.historiaTitulo} numberOfLines={3}>
                      {h.titulo}
                    </Text>
                  </Toque>
                </Link>
              );
            })}
          </ScrollView>
        </View>

        {/* Missões */}
        <View style={estilos.bloco}>
          <Text style={estilos.secao}>🎯 Missões</Text>
          {missoes.map((m) => {
            const feita = concluidas.includes(m.id);
            return (
              <Link key={m.id} href={`/mundo/missao/${m.id}`} asChild>
                <Toque style={estilos.missao}>
                  <Text style={estilos.itemEmoji}>{m.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={estilos.itemTitulo}>{m.titulo}</Text>
                    {m.descricao && <Text style={estilos.itemDescricao}>{m.descricao}</Text>}
                  </View>
                  <Text style={estilos.missaoEstrela}>{feita ? '⭐' : '☆'}</Text>
                </Toque>
              </Link>
            );
          })}
        </View>

        {/* Desenhar */}
        <Link href="/mundo/desenhar" asChild>
          <Toque style={estilos.desenhar}>
            <Text style={estilos.desenharEmoji}>🎨</Text>
            <View style={{ flex: 1 }}>
              <Text style={estilos.desenharTitulo}>Cantinho de desenhar</Text>
              <Text style={estilos.desenharTexto}>Desenhe como você está se sentindo</Text>
            </View>
          </Toque>
        </Link>

        {/* Turma */}
        <View style={estilos.bloco}>
          <Text style={estilos.secao}>Conheça a turma</Text>
          <View style={estilos.turma}>
            {personagens.map((p) => (
              <Pressable
                key={p.id}
                onPress={() => {
                  setPersonagemFalando(p.id);
                  setSentimento(null);
                }}
                style={({ pressed }) => [estilos.amigo, pressed && estilos.pressionado]}>
                <View style={[estilos.amigoCirculo, { backgroundColor: p.cor }]}>
                  <Text style={estilos.amigoEmoji}>{p.emoji}</Text>
                </View>
                <Text style={estilos.amigoNome}>{p.nome}</Text>
                <Text style={estilos.amigoEspecie}>{p.especie}</Text>
              </Pressable>
            ))}
          </View>
        </View>

          <Text style={estilos.rodape}>Um espaço para explorar junto com um adulto 💛</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: Cores.fundo,
  },
  ceu: {
    paddingHorizontal: Espaco.md,
    paddingBottom: Espaco.lg,
    borderBottomLeftRadius: Raio.lg,
    borderBottomRightRadius: Raio.lg,
    overflow: 'hidden',
    gap: Espaco.sm,
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Espaco.xs,
  },
  topoTitulo: {
    fontFamily: Fontes.extra,
    fontSize: 18,
    color: Cores.marinho,
  },
  estrelas: {
    backgroundColor: Cores.superficie,
    borderRadius: Raio.pilula,
    paddingVertical: 4,
    paddingHorizontal: 10,
    ...Contorno,
  },
  estrelasTexto: {
    fontFamily: Fontes.extra,
    fontSize: 15,
    color: Cores.texto,
  },
  conteudo: {
    padding: Espaco.md,
    gap: Espaco.md,
  },
  cena: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.md,
  },
  personagem: {
    width: 88,
    height: 88,
    borderRadius: 44,
    ...Contorno,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personagemEmoji: {
    fontSize: 56,
  },
  falaNome: {
    fontFamily: Fontes.extra,
    fontSize: 13,
    color: Cores.terracota,
    textAlign: 'center',
    marginBottom: 2,
  },
  falaTexto: {
    fontFamily: Fontes.negrito,
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
    color: Cores.texto,
  },
  pergunta: {
    fontFamily: Fontes.extra,
    fontSize: 21,
    color: Cores.texto,
    marginTop: Espaco.sm,
  },
  sentimentos: {
    gap: Espaco.sm + 2,
    paddingVertical: 4,
  },
  sentimento: {
    width: 84,
    height: 96,
    borderRadius: Raio.md,
    ...Contorno,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  sentimentoAtivo: {
    borderWidth: 3.5,
    transform: [{ translateY: -3 }],
  },
  sentimentoEmoji: {
    fontSize: 36,
  },
  sentimentoNome: {
    fontFamily: Fontes.extra,
    fontSize: 13,
    color: Cores.texto,
  },
  bloco: {
    gap: Espaco.sm + 2,
  },
  secao: {
    fontFamily: Fontes.extra,
    fontSize: 20,
    color: Cores.texto,
    marginTop: Espaco.sm,
  },
  sugestao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.md,
    backgroundColor: Cores.amareloClaro,
    borderRadius: Raio.md,
    padding: Espaco.md,
    ...Contorno,
  },
  itemEmoji: {
    fontSize: 34,
  },
  itemTipo: {
    fontFamily: Fontes.extra,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Cores.terracota,
  },
  itemTitulo: {
    fontFamily: Fontes.extra,
    fontSize: 17,
    color: Cores.texto,
  },
  itemDescricao: {
    fontFamily: Fontes.regular,
    fontSize: 14,
    color: Cores.textoSuave,
    marginTop: 2,
  },
  carrossel: {
    gap: Espaco.md,
    paddingVertical: 4,
  },
  historia: {
    width: 150,
    height: 180,
    borderRadius: Raio.lg,
    padding: Espaco.md,
    justifyContent: 'space-between',
    ...Contorno,
  },
  historiaEmoji: {
    fontSize: 54,
  },
  historiaTitulo: {
    fontFamily: Fontes.extra,
    fontSize: 16,
    lineHeight: 20,
    color: Cores.texto,
  },
  missao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.md,
    backgroundColor: Cores.superficie,
    borderRadius: Raio.md,
    padding: Espaco.md,
    ...Contorno,
  },
  missaoEstrela: {
    fontSize: 26,
    color: Cores.amareloEscuro,
  },
  desenhar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.md,
    ...Contorno,
    backgroundColor: Cores.lilasClaro,
    borderRadius: Raio.lg,
    padding: Espaco.lg,
    marginTop: Espaco.sm,
  },
  desenharEmoji: {
    fontSize: 48,
  },
  desenharTitulo: {
    fontFamily: Fontes.extra,
    fontSize: 19,
    color: Cores.lilasEscuro,
  },
  desenharTexto: {
    fontFamily: Fontes.media,
    fontSize: 15,
    color: Cores.texto,
  },
  turma: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Espaco.sm,
  },
  amigo: {
    width: '48%',
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: Cores.superficie,
    borderRadius: Raio.md,
    padding: Espaco.md,
    ...Contorno,
  },
  amigoCirculo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    ...Contorno,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  amigoEmoji: {
    fontSize: 36,
  },
  amigoNome: {
    fontFamily: Fontes.extra,
    fontSize: 16,
    color: Cores.texto,
  },
  amigoEspecie: {
    fontFamily: Fontes.regular,
    fontSize: 13,
    color: Cores.textoSuave,
    textAlign: 'center',
  },
  pressionado: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  rodape: {
    fontFamily: Fontes.media,
    fontSize: 14,
    color: Cores.textoSuave,
    textAlign: 'center',
    marginTop: Espaco.md,
  },
});
