import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Carregando, Erro } from '@/components/ui';
import { useDados } from '@/hooks/use-dados';
import { BotaoFavorito } from '@/components/conta/botao-favorito';
import { LivroRecomendado } from '@/components/livros';
import { Cores, Destaques, Espaco, Fontes, Raio, t } from '@/constants/theme';
import { supabase } from '../../../../lib/supabase';

type Capitulo = {
  numero: number;
  titulo: string;
  tema: string | null;
  emoji: string | null;
  historia: string;
  fala: string | null;
  traducao: string;
  quando_buscar_ajuda: string | null;
  pergunta: string | null;
};

const cor = Destaques.manualeve;

/** Separa o texto do banco em parágrafos (linha em branco entre eles). */
function Paragrafos({ texto, estilo }: { texto: string; estilo: object }) {
  return (
    <>
      {texto
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p, i) => (
          <Text key={i} style={estilo}>
            {p}
          </Text>
        ))}
    </>
  );
}

function Secao({
  titulo,
  icone,
  corFundo,
  corIcone,
  children,
}: {
  titulo: string;
  icone: keyof typeof Ionicons.glyphMap;
  corFundo: string;
  corIcone: string;
  children: React.ReactNode;
}) {
  return (
    <View style={[estilos.secao, { backgroundColor: corFundo }]}>
      <View style={estilos.secaoCabecalho}>
        <Ionicons name={icone} size={20} color={corIcone} />
        <Text style={[estilos.secaoTitulo, { color: corIcone }]}>{titulo}</Text>
      </View>
      {children}
    </View>
  );
}

export default function CapituloManuaLeve() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const carregar = useCallback(async () => {
    const { data, error } = await supabase
      .from('manualeve_capitulos')
      .select('numero, titulo, tema, emoji, historia, fala, traducao, quando_buscar_ajuda, pergunta')
      .eq('id', id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) throw new Error('Ainda não há conteúdo para esse capítulo.');
    return data as Capitulo;
  }, [id]);

  const { dados: capitulo, carregando, erro, tentarDeNovo } = useDados(carregar, `manualeve-capitulo:${id}`);

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerRight: () => (
            <BotaoFavorito tipo="manualeve" itemId={id} titulo={capitulo?.titulo} />
          ),
        }}
      />
      {carregando ? (
        <Carregando />
      ) : erro || !capitulo ? (
        <Erro mensagem={erro ?? 'Algo deu errado.'} onTentar={tentarDeNovo} />
      ) : (
        <ScrollView contentContainerStyle={estilos.conteudo}>
          <View style={estilos.topo}>
            <Text style={estilos.emoji}>{capitulo.emoji ?? '🌿'}</Text>
            <Text style={estilos.contexto}>
              Capítulo {capitulo.numero}
              {capitulo.tema ? ` · ${capitulo.tema}` : ''}
            </Text>
            <Text style={estilos.titulo}>{capitulo.titulo}</Text>
          </View>

          <Secao
            titulo="A criança falando"
            icone="chatbubble-ellipses-outline"
            corFundo={Cores.amareloClaro}
            corIcone={Cores.amareloEscuro}
          >
            <Paragrafos texto={capitulo.historia} estilo={estilos.texto} />
            {capitulo.fala ? (
              <View style={estilos.fala}>
                <Text style={estilos.falaRotulo}>Se eu pudesse te explicar…</Text>
                <Text style={estilos.falaTexto}>“{capitulo.fala}”</Text>
              </View>
            ) : null}
          </Secao>

          <Secao
            titulo="Tradução emocional para pais"
            icone="bulb-outline"
            corFundo={Cores.azulClaro}
            corIcone={Cores.azulEscuro}
          >
            <Paragrafos texto={capitulo.traducao} estilo={estilos.texto} />
          </Secao>

          {capitulo.quando_buscar_ajuda ? (
            <Secao
              titulo="Quando buscar ajuda"
              icone="search-outline"
              corFundo={Cores.terracotaClara}
              corIcone={Cores.terracotaEscura}
            >
              <Paragrafos texto={capitulo.quando_buscar_ajuda} estilo={estilos.texto} />
            </Secao>
          ) : null}

          {capitulo.pergunta ? (
            <View style={estilos.pergunta}>
              <Text style={estilos.perguntaRotulo}>🌙 Pergunta de cabeceira</Text>
              <Text style={estilos.perguntaTexto}>{capitulo.pergunta}</Text>
            </View>
          ) : null}

          <LivroRecomendado semente={id} />
        </ScrollView>
      )}
    </>
  );
}

const estilos = StyleSheet.create({
  conteudo: {
    padding: Espaco.lg,
    paddingTop: Espaco.sm,
    gap: Espaco.md,
  },
  topo: {
    alignItems: 'center',
    marginBottom: Espaco.sm,
  },
  emoji: {
    fontSize: t(44),
    marginBottom: Espaco.sm,
  },
  contexto: {
    fontFamily: Fontes.media,
    fontSize: t(14),
    color: cor.escura,
  },
  titulo: {
    fontFamily: Fontes.extra,
    fontSize: t(24),
    lineHeight: t(30),
    color: Cores.texto,
    textAlign: 'center',
  },
  secao: {
    borderRadius: Raio.md,
    padding: Espaco.md + 4,
    gap: Espaco.sm + 2,
  },
  secaoCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm,
  },
  secaoTitulo: {
    fontFamily: Fontes.extra,
    fontSize: t(15),
  },
  texto: {
    fontFamily: Fontes.regular,
    fontSize: t(16),
    lineHeight: t(25),
    color: Cores.texto,
  },
  fala: {
    marginTop: Espaco.sm,
    backgroundColor: Cores.superficie,
    borderRadius: Raio.sm,
    padding: Espaco.md,
    gap: Espaco.xs,
  },
  falaRotulo: {
    fontFamily: Fontes.media,
    fontSize: t(13),
    color: Cores.amareloEscuro,
  },
  falaTexto: {
    fontFamily: Fontes.negrito,
    fontSize: t(17),
    lineHeight: t(26),
    color: Cores.texto,
  },
  pergunta: {
    backgroundColor: Cores.lilasClaro,
    borderRadius: Raio.md,
    padding: Espaco.lg,
    alignItems: 'center',
    gap: Espaco.sm,
  },
  perguntaRotulo: {
    fontFamily: Fontes.extra,
    fontSize: t(15),
    color: Cores.lilasEscuro,
  },
  perguntaTexto: {
    fontFamily: Fontes.negrito,
    fontSize: t(18),
    lineHeight: t(27),
    color: Cores.texto,
    textAlign: 'center',
  },
});
