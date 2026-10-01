import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Carregando, Cartao, Erro, Tela, Vazio } from '@/components/ui';
import { useDados } from '@/hooks/use-dados';
import { Cores, Destaques, Espaco, Fontes, Raio, t } from '@/constants/theme';
import { supabase } from '../../../../lib/supabase';

type Fase = {
  id: string;
  titulo: string;
  tema: string | null;
};

const cor = Destaques.fases;

async function buscarFases(): Promise<Fase[]> {
  const { data, error } = await supabase
    .from('fases')
    .select('id, titulo, tema')
    .eq('ativa', true)
    .order('ordem', { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export default function ListaFases() {
  const { dados, carregando, erro, tentarDeNovo } = useDados(buscarFases, 'fases');
  const fases = dados ?? [];

  if (carregando) return <Carregando />;
  if (erro) return <Erro mensagem={erro} onTentar={tentarDeNovo} />;

  return (
    <Tela titulo="Passa de Fase" subtitulo="Treine como agir nas situações do dia a dia.">
      <FlatList
        data={fases}
        keyExtractor={(item) => item.id}
        contentContainerStyle={estilos.lista}
        ListEmptyComponent={<Vazio mensagem="Nenhuma fase liberada ainda." icone="game-controller-outline" />}
        renderItem={({ item, index }) => (
          <Link href={`/fases/${item.id}`} asChild>
            <Cartao style={estilos.cartao}>
              <View style={estilos.numero}>
                <Text style={estilos.numeroTexto}>{index + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={estilos.titulo}>{item.titulo}</Text>
                {item.tema && <Text style={estilos.tema}>{item.tema}</Text>}
              </View>
              <Ionicons name="chevron-forward" size={18} color={Cores.textoClaro} />
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
  numero: {
    width: 44,
    height: 44,
    borderRadius: Raio.sm,
    backgroundColor: cor.clara,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numeroTexto: {
    fontFamily: Fontes.extra,
    fontSize: t(18),
    color: cor.escura,
  },
  titulo: {
    fontFamily: Fontes.negrito,
    fontSize: t(16),
    color: Cores.texto,
  },
  tema: {
    fontFamily: Fontes.regular,
    fontSize: t(14),
    color: Cores.textoSuave,
    marginTop: 2,
  },
});
