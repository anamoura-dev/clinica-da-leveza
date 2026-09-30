import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmBreve } from '@/components/ui';
import { Cores, Espaco, Fontes, Raio, Sombra } from '@/constants/theme';
import { supabase } from '../../lib/supabase';

// A Lupa só liga depois que a função "lupa" estiver publicada no Supabase
// (e, no futuro, para quem tiver assinatura). Troque para true para ativar.
const LUPA_ATIVA = false;

type Mensagem = { id: string; role: 'user' | 'assistant'; content: string };

const BOAS_VINDAS: Mensagem = {
  id: 'boas-vindas',
  role: 'assistant',
  content:
    'Oi! Eu sou a Lupa 🔍\n\nMe conta o que está acontecendo com a criança. Vou te fazer algumas perguntas para a gente investigar juntas e organizar as possibilidades.',
};

const SUGESTOES = [
  'Meu filho faz birra por tudo',
  'Ela não quer ir para a escola',
  'Não sei se é fase ou algo mais',
];

let contador = 0;
const novoId = () => `${Date.now()}-${contador++}`;

async function perguntarParaLupa(historico: Mensagem[]) {
  const mensagens = historico
    .filter((m) => m.id !== BOAS_VINDAS.id)
    .map(({ role, content }) => ({ role, content }));
  const { data, error } = await supabase.functions.invoke<{ resposta?: string; erro?: string }>('lupa', {
    body: { mensagens },
  });
  if (error || !data?.resposta) throw new Error(data?.erro ?? 'A Lupa não conseguiu responder agora.');
  return data.resposta;
}

/** Três pontinhos pulando enquanto a Lupa pensa. */
function Digitando() {
  return (
    <View style={[estilos.balao, estilos.balaoLupa, estilos.digitando]}>
      {[0, 1, 2].map((i) => (
        <Ponto key={i} atraso={i * 150} />
      ))}
    </View>
  );
}

function Ponto({ atraso }: { atraso: number }) {
  const y = useSharedValue(0);
  useEffect(() => {
    y.value = withDelay(
      atraso,
      withRepeat(withSequence(withTiming(-5, { duration: 280 }), withTiming(0, { duration: 280 })), -1),
    );
  }, [y, atraso]);
  const estilo = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return <Animated.View style={[estilos.ponto, estilo]} />;
}

export default function Conversar() {
  if (!LUPA_ATIVA) {
    return (
      <>
        <Stack.Screen options={{ title: 'Lupa IA' }} />
        <EmBreve
          icone="search-outline"
          titulo="A Lupa vem aí"
          texto="Em breve você vai poder conversar com a Lupa, nossa assistente, para investigar situações e organizar possibilidades."
        />
      </>
    );
  }
  return <LupaIA />;
}

function LupaIA() {
  const insets = useSafeAreaInsets();
  const rolagem = useRef<ScrollView>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([BOAS_VINDAS]);
  const [texto, setTexto] = useState('');
  const [pensando, setPensando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function enviar(historico: Mensagem[]) {
    setErro(null);
    setPensando(true);
    try {
      const resposta = await perguntarParaLupa(historico);
      setMensagens([...historico, { id: novoId(), role: 'assistant', content: resposta }]);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'A Lupa não conseguiu responder agora.');
    } finally {
      setPensando(false);
    }
  }

  function mandar(conteudo: string) {
    const limpo = conteudo.trim();
    if (!limpo || pensando) return;
    const historico = [...mensagens, { id: novoId(), role: 'user' as const, content: limpo }];
    setMensagens(historico);
    setTexto('');
    enviar(historico);
  }

  function novaConversa() {
    setMensagens([BOAS_VINDAS]);
    setErro(null);
    setTexto('');
  }

  const soBoasVindas = mensagens.length === 1;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Lupa IA',
          headerRight: () =>
            soBoasVindas ? null : (
              <Pressable onPress={novaConversa} hitSlop={10} accessibilityLabel="Nova conversa">
                <Ionicons name="create-outline" size={22} color={Cores.lavandaEscura} />
              </Pressable>
            ),
        }}
      />
      <KeyboardAvoidingView
        style={estilos.tela}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 44 : 0}>
        <ScrollView
          ref={rolagem}
          contentContainerStyle={estilos.conversa}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => rolagem.current?.scrollToEnd({ animated: true })}>
          <View style={estilos.aviso}>
            <Ionicons name="information-circle-outline" size={16} color={Cores.textoSuave} />
            <Text style={estilos.avisoTexto}>
              A Lupa ajuda a investigar e organizar ideias. Não faz diagnósticos nem substitui
              acompanhamento profissional.
            </Text>
          </View>

          {mensagens.map((m) => (
            <Animated.View
              key={m.id}
              entering={FadeInUp.duration(250)}
              style={[estilos.balao, m.role === 'user' ? estilos.balaoPessoa : estilos.balaoLupa]}>
              <Text style={[estilos.balaoTexto, m.role === 'user' && estilos.balaoTextoPessoa]}>{m.content}</Text>
            </Animated.View>
          ))}

          {soBoasVindas && (
            <View style={estilos.sugestoes}>
              {SUGESTOES.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => mandar(s)}
                  style={({ pressed }) => [estilos.sugestao, pressed && { opacity: 0.7 }]}>
                  <Text style={estilos.sugestaoTexto}>{s}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {pensando && <Digitando />}

          {erro && (
            <View style={estilos.erro}>
              <Text style={estilos.erroTexto}>{erro}</Text>
              <Pressable onPress={() => enviar(mensagens)} hitSlop={8}>
                <Text style={estilos.erroBotao}>Tentar de novo</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>

        <View style={[estilos.barra, { paddingBottom: Math.max(insets.bottom, Espaco.sm) }]}>
          <TextInput
            style={estilos.entrada}
            value={texto}
            onChangeText={setTexto}
            placeholder="Escreva aqui..."
            placeholderTextColor={Cores.textoClaro}
            multiline
            maxLength={2000}
          />
          <Pressable
            onPress={() => mandar(texto)}
            disabled={!texto.trim() || pensando}
            accessibilityLabel="Enviar"
            style={[estilos.enviar, (!texto.trim() || pensando) && { opacity: 0.4 }]}>
            <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: Cores.fundo,
  },
  conversa: {
    padding: Espaco.md,
    gap: Espaco.sm + 2,
  },
  aviso: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: Cores.superficie,
    borderRadius: Raio.sm,
    padding: Espaco.sm + 2,
    marginBottom: Espaco.sm,
    borderWidth: 1,
    borderColor: Cores.borda,
  },
  avisoTexto: {
    flex: 1,
    fontFamily: Fontes.regular,
    fontSize: 12,
    lineHeight: 17,
    color: Cores.textoSuave,
  },
  balao: {
    maxWidth: '85%',
    borderRadius: Raio.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  balaoLupa: {
    alignSelf: 'flex-start',
    backgroundColor: Cores.superficie,
    borderBottomLeftRadius: 6,
    ...Sombra,
  },
  balaoPessoa: {
    alignSelf: 'flex-end',
    backgroundColor: Cores.lavandaEscura,
    borderBottomRightRadius: 6,
  },
  balaoTexto: {
    fontFamily: Fontes.regular,
    fontSize: 16,
    lineHeight: 23,
    color: Cores.texto,
  },
  balaoTextoPessoa: {
    color: '#FFFFFF',
  },
  sugestoes: {
    gap: Espaco.sm,
    alignItems: 'flex-end',
    marginTop: Espaco.xs,
  },
  sugestao: {
    borderWidth: 1.5,
    borderColor: Cores.lavanda,
    borderRadius: Raio.pilula,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  sugestaoTexto: {
    fontFamily: Fontes.media,
    fontSize: 14,
    color: Cores.lavandaEscura,
  },
  digitando: {
    flexDirection: 'row',
    gap: 5,
    paddingVertical: 16,
  },
  ponto: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Cores.lavanda,
  },
  erro: {
    alignSelf: 'center',
    alignItems: 'center',
    gap: 4,
    padding: Espaco.sm,
  },
  erroTexto: {
    fontFamily: Fontes.regular,
    fontSize: 13,
    color: Cores.erro,
    textAlign: 'center',
  },
  erroBotao: {
    fontFamily: Fontes.negrito,
    fontSize: 14,
    color: Cores.lavandaEscura,
  },
  barra: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Espaco.sm,
    paddingHorizontal: Espaco.md,
    paddingTop: Espaco.sm,
    backgroundColor: Cores.superficie,
    borderTopWidth: 1,
    borderTopColor: Cores.borda,
  },
  entrada: {
    flex: 1,
    maxHeight: 120,
    minHeight: 42,
    backgroundColor: Cores.fundo,
    borderRadius: 21,
    paddingHorizontal: 16,
    paddingTop: 11,
    paddingBottom: 11,
    fontFamily: Fontes.regular,
    fontSize: 16,
    color: Cores.texto,
  },
  enviar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Cores.lavandaEscura,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
