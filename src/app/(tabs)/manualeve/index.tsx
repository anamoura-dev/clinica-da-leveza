import { Link } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Carregando, Cartao, Erro, Tela, Vazio } from '@/components/ui';
import { useDados } from '@/hooks/use-dados';
import { Cores, Destaques, Espaco, Fontes, t } from '@/constants/theme';
import { supabase } from '../../../../lib/supabase';

type Situacao = {
  id: string;
  rotulo: string;
  emoji: string | null;
};

const cor = Destaques.manualeve;

async function buscarSituacoes(): Promise<Situacao[]> {
  const { data, error } = await supabase
    .from('manualeve_situacoes')
    .select('id, rotulo, emoji')
    .eq('ativa', true)
    .order('ordem', { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export default function ManuaLeve() {
  const { dados, carregando, erro, tentarDeNovo } = useDados(buscarSituacoes);
  const situacoes = dados ?? [];

  if (carregando) return <Carregando />;
  if (erro) return <Erro mensagem={erro} onTentar={tentarDeNovo} />;

  return (
    <Tela titulo="Meu filho não quer..." subtitulo="Escolha a situação e veja por onde começar.">
      <FlatList
        data={situacoes}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={estilos.linha}
        contentContainerStyle={estilos.lista}
        ListEmptyComponent={<Vazio mensagem="Nenhuma situação por aqui ainda." />}
        renderItem={({ item }) => (
          <Link href={`/manualeve/${item.id}`} asChild>
            <Cartao style={estilos.cartao}>
              <View style={estilos.emojiFundo}>
                <Text style={estilos.emoji}>{item.emoji ?? '🌿'}</Text>
              </View>
              <Text style={estilos.rotulo}>{item.rotulo}</Text>
            </Cartao>
          </Link>
        )}
      />
    </Tela>
  );
}

const estilos = StyleSheet.create({
  lista: {
    paddingHorizontal: Espaco.lg,
    paddingBottom: Espaco.xl,
    gap: Espaco.md,
  },
  linha: {
    gap: Espaco.md,
  },
  cartao: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Espaco.lg,
    gap: Espaco.sm,
  },
  emojiFundo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: cor.clara,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: t(30),
  },
  rotulo: {
    fontFamily: Fontes.negrito,
    fontSize: t(15),
    color: Cores.texto,
    textAlign: 'center',
  },
});
