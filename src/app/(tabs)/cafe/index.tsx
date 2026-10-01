import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Carregando, Cartao, Erro, Tela, Vazio } from '@/components/ui';
import { useDados } from '@/hooks/use-dados';
import { Cores, Destaques, Espaco, Fontes, Raio, t } from '@/constants/theme';
import { supabase } from '../../../../lib/supabase';

type Cafe = {
  id: string;
  titulo: string;
  gancho: string | null;
};

const cor = Destaques.cafe;

async function buscarCafes(): Promise<Cafe[]> {
  const { data, error } = await supabase
    .from('content')
    .select('id, titulo, gancho')
    .eq('tipo', 'cafe')
    .eq('publicado', true)
    .order('ordem', { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export default function ListaCafes() {
  const { dados, carregando, erro, tentarDeNovo } = useDados(buscarCafes);
  const cafes = dados ?? [];

  if (carregando) return <Carregando />;
  if (erro) return <Erro mensagem={erro} onTentar={tentarDeNovo} />;

  return (
    <Tela titulo="Cafés" subtitulo="Conversas curtas para tomar com calma.">
      <FlatList
        data={cafes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={estilos.lista}
        ListEmptyComponent={<Vazio mensagem="Nenhum café servido ainda." icone="cafe-outline" />}
        renderItem={({ item }) => (
          <Link href={`/cafe/${item.id}`} asChild>
            <Cartao style={estilos.cartao}>
              <View style={estilos.icone}>
                <Ionicons name="play" size={20} color={cor.escura} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={estilos.titulo}>{item.titulo}</Text>
                {item.gancho && (
                  <Text style={estilos.gancho} numberOfLines={2}>
                    {item.gancho}
                  </Text>
                )}
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
  icone: {
    width: 48,
    height: 48,
    borderRadius: Raio.sm,
    backgroundColor: cor.clara,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontFamily: Fontes.negrito,
    fontSize: t(16),
    color: Cores.texto,
  },
  gancho: {
    fontFamily: Fontes.regular,
    fontSize: t(14),
    lineHeight: t(20),
    color: Cores.textoSuave,
    marginTop: 2,
  },
});
