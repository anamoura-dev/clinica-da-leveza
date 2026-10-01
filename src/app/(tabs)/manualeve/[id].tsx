import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Carregando, Erro } from '@/components/ui';
import { useDados } from '@/hooks/use-dados';
import { BotaoFavorito } from '@/components/conta/botao-favorito';
import { Cores, Espaco, Fontes, Raio, t } from '@/constants/theme';
import { supabase } from '../../../../lib/supabase';

type Entrada = {
  o_que_pode_estar_acontecendo: string;
  o_que_evitar: string;
  o_que_fazer_hoje: string;
  quando_investigar_mais: string;
};

type Situacao = {
  rotulo: string;
  emoji: string | null;
};

const SECOES: {
  campo: keyof Entrada;
  titulo: string;
  icone: keyof typeof Ionicons.glyphMap;
  corFundo: string;
  corIcone: string;
}[] = [
  {
    campo: 'o_que_pode_estar_acontecendo',
    titulo: 'O que pode estar acontecendo',
    icone: 'bulb-outline',
    corFundo: Cores.azulClaro,
    corIcone: Cores.azulEscuro,
  },
  {
    campo: 'o_que_evitar',
    titulo: 'O que evitar',
    icone: 'hand-left-outline',
    corFundo: Cores.terracotaClara,
    corIcone: Cores.terracotaEscura,
  },
  {
    campo: 'o_que_fazer_hoje',
    titulo: 'O que você pode fazer hoje',
    icone: 'heart-outline',
    corFundo: Cores.verdeClaro,
    corIcone: Cores.verdeEscuro,
  },
  {
    campo: 'quando_investigar_mais',
    titulo: 'Quando investigar mais',
    icone: 'search-outline',
    corFundo: Cores.azulClaro,
    corIcone: Cores.azulEscuro,
  },
];

export default function ResultadoManuaLeve() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const carregar = useCallback(async () => {
    const [entradaRes, situacaoRes] = await Promise.all([
      supabase
        .from('manualeve_entradas')
        .select('o_que_pode_estar_acontecendo, o_que_evitar, o_que_fazer_hoje, quando_investigar_mais')
        .eq('situacao_id', id)
        .limit(1)
        .maybeSingle(),
      supabase.from('manualeve_situacoes').select('rotulo, emoji').eq('id', id).maybeSingle(),
    ]);
    if (entradaRes.error) throw new Error(entradaRes.error.message);
    if (!entradaRes.data) throw new Error('Ainda não há conteúdo para essa situação.');
    return {
      entrada: entradaRes.data as Entrada,
      situacao: (situacaoRes.data ?? null) as Situacao | null,
    };
  }, [id]);

  const { dados, carregando, erro, tentarDeNovo } = useDados(carregar);
  const entrada = dados?.entrada ?? null;
  const situacao = dados?.situacao ?? null;

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerRight: () => (
            <BotaoFavorito
              tipo="manualeve"
              itemId={id}
              titulo={situacao ? `Meu filho não quer ${situacao.rotulo}` : undefined}
            />
          ),
        }}
      />
      {carregando ? (
        <Carregando />
      ) : erro || !entrada ? (
        <Erro mensagem={erro ?? 'Algo deu errado.'} onTentar={tentarDeNovo} />
      ) : (
        <ScrollView contentContainerStyle={estilos.conteudo}>
          {situacao && (
            <View style={estilos.topo}>
              <Text style={estilos.emoji}>{situacao.emoji ?? '🌿'}</Text>
              <Text style={estilos.contexto}>Meu filho não quer...</Text>
              <Text style={estilos.titulo}>{situacao.rotulo}</Text>
            </View>
          )}

          {SECOES.map((s) =>
            entrada[s.campo] ? (
              <View key={s.campo} style={[estilos.secao, { backgroundColor: s.corFundo }]}>
                <View style={estilos.secaoCabecalho}>
                  <Ionicons name={s.icone} size={20} color={s.corIcone} />
                  <Text style={[estilos.secaoTitulo, { color: s.corIcone }]}>{s.titulo}</Text>
                </View>
                <Text style={estilos.texto}>{entrada[s.campo]}</Text>
              </View>
            ) : null,
          )}
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
    color: Cores.textoSuave,
  },
  titulo: {
    fontFamily: Fontes.extra,
    fontSize: t(24),
    color: Cores.texto,
    textAlign: 'center',
  },
  secao: {
    borderRadius: Raio.md,
    padding: Espaco.md + 4,
    gap: Espaco.sm,
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
});
