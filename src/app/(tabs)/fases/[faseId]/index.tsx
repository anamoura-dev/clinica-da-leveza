import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';

import { Carregando, Cartao, Erro, Rotulo, Vazio } from '@/components/ui';
import { useDados } from '@/hooks/use-dados';
import { Cores, Destaques, Espaco, Fontes, t } from '@/constants/theme';
import { supabase } from '../../../../../lib/supabase';

type Cenario = {
  id: string;
  texto: string;
  ordem: number;
};

const cor = Destaques.fases;

export default function ListaCenarios() {
  const { faseId } = useLocalSearchParams<{ faseId: string }>();
  const carregar = useCallback(async () => {
    const [cenariosRes, faseRes] = await Promise.all([
      supabase
        .from('cenarios')
        .select('id, texto, ordem')
        .eq('fase_id', faseId)
        .order('ordem', { ascending: true }),
      supabase.from('fases').select('titulo').eq('id', faseId).maybeSingle(),
    ]);
    if (cenariosRes.error) throw new Error(cenariosRes.error.message);
    return {
      cenarios: (cenariosRes.data ?? []) as Cenario[],
      tituloFase: (faseRes.data?.titulo as string | undefined) ?? '',
    };
  }, [faseId]);

  const { dados, carregando, erro, tentarDeNovo } = useDados(carregar);
  const cenarios = dados?.cenarios ?? [];
  const tituloFase = dados?.tituloFase ?? '';

  return (
    <>
      <Stack.Screen options={{ title: tituloFase }} />
      {carregando ? (
        <Carregando />
      ) : erro ? (
        <Erro mensagem={erro} onTentar={tentarDeNovo} />
      ) : (
        <FlatList
          data={cenarios}
          keyExtractor={(item) => item.id}
          contentContainerStyle={estilos.lista}
          ListEmptyComponent={<Vazio mensagem="Essa fase ainda não tem cenários." />}
          renderItem={({ item, index }) => (
            <Link href={`/fases/${faseId}/${item.id}`} asChild>
              <Cartao style={estilos.cartao}>
                <Rotulo cor={cor.escura}>Cenário {index + 1}</Rotulo>
                <Text style={estilos.texto} numberOfLines={3}>
                  {item.texto}
                </Text>
              </Cartao>
            </Link>
          )}
        />
      )}
    </>
  );
}

const estilos = StyleSheet.create({
  lista: {
    padding: Espaco.lg,
    paddingTop: Espaco.sm,
    gap: Espaco.md,
  },
  cartao: {
    gap: Espaco.xs + 2,
  },
  texto: {
    fontFamily: Fontes.media,
    fontSize: t(16),
    lineHeight: t(23),
    color: Cores.texto,
  },
});
