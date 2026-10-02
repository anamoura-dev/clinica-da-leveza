import { Link } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Carregando, Cartao, Erro, Tela, Vazio } from '@/components/ui';
import { useDados } from '@/hooks/use-dados';
import { Cores, Destaques, Espaco, Fontes, t } from '@/constants/theme';
import { supabase } from '../../../../lib/supabase';

type Capitulo = {
  id: string;
  numero: number;
  titulo: string;
  tema: string | null;
  emoji: string | null;
};

const cor = Destaques.manualeve;

async function buscarCapitulos(): Promise<Capitulo[]> {
  const { data, error } = await supabase
    .from('manualeve_capitulos')
    .select('id, numero, titulo, tema, emoji')
    .eq('ativo', true)
    .order('ordem', { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export default function ManuaLeve() {
  const { dados, carregando, erro, tentarDeNovo } = useDados(buscarCapitulos, 'manualeve-capitulos');
  const capitulos = dados ?? [];

  if (carregando) return <Carregando />;
  if (erro) return <Erro mensagem={erro} onTentar={tentarDeNovo} />;

  return (
    <Tela
      titulo="ManuaLeve"
      subtitulo="Antes de corrigir, entenda o que a criança está tentando dizer."
    >
      <FlatList
        data={capitulos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={estilos.lista}
        ListEmptyComponent={<Vazio mensagem="Nenhum capítulo por aqui ainda." />}
        renderItem={({ item }) => (
          <Link href={`/manualeve/${item.id}`} asChild>
            <Cartao style={estilos.cartao}>
              <View style={estilos.emojiFundo}>
                <Text style={estilos.emoji}>{item.emoji ?? '🌿'}</Text>
              </View>
              <View style={estilos.textos}>
                <Text style={estilos.numero}>
                  Capítulo {item.numero}
                  {item.tema ? ` · ${item.tema}` : ''}
                </Text>
                <Text style={estilos.titulo}>{item.titulo}</Text>
              </View>
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
  cartao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.md,
  },
  emojiFundo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: cor.clara,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: t(26),
  },
  textos: {
    flex: 1,
    gap: 2,
  },
  numero: {
    fontFamily: Fontes.media,
    fontSize: t(13),
    color: cor.escura,
  },
  titulo: {
    fontFamily: Fontes.negrito,
    fontSize: t(16),
    lineHeight: t(22),
    color: Cores.texto,
  },
});
