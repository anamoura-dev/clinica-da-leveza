import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';

import { Carregando, Cartao, Erro, Rotulo, Vazio } from '@/components/ui';
import { Cores, Destaques, Espaco, Fontes } from '@/constants/theme';
import { supabase } from '../../../../../lib/supabase';

type Cenario = {
  id: string;
  texto: string;
  ordem: number;
};

const cor = Destaques.fases;

export default function ListaCenarios() {
  const { faseId } = useLocalSearchParams<{ faseId: string }>();
  const [cenarios, setCenarios] = useState<Cenario[]>([]);
  const [tituloFase, setTituloFase] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    buscarCenarios();
  }, [faseId]);

  async function buscarCenarios() {
    setCarregando(true);
    setErro(null);

    const [cenariosRes, faseRes] = await Promise.all([
      supabase
        .from('cenarios')
        .select('id, texto, ordem')
        .eq('fase_id', faseId)
        .order('ordem', { ascending: true }),
      supabase.from('fases').select('titulo').eq('id', faseId).maybeSingle(),
    ]);

    if (cenariosRes.error) {
      setErro(cenariosRes.error.message);
    } else {
      setCenarios(cenariosRes.data || []);
    }
    setTituloFase(faseRes.data?.titulo ?? '');

    setCarregando(false);
  }

  return (
    <>
      <Stack.Screen options={{ title: tituloFase }} />
      {carregando ? (
        <Carregando cor={cor.cor} />
      ) : erro ? (
        <Erro mensagem={erro} onTentar={buscarCenarios} />
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
    fontSize: 16,
    lineHeight: 23,
    color: Cores.texto,
  },
});
