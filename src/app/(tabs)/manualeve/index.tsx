import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Carregando, Cartao, Erro, Tela, Vazio } from '@/components/ui';
import { Cores, Destaques, Espaco, Fontes } from '@/constants/theme';
import { supabase } from '../../../../lib/supabase';

type Situacao = {
  id: string;
  rotulo: string;
  emoji: string | null;
};

const cor = Destaques.manualeve;

export default function ManuaLeve() {
  const [situacoes, setSituacoes] = useState<Situacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    buscarSituacoes();
  }, []);

  async function buscarSituacoes() {
    setCarregando(true);
    setErro(null);

    const { data, error } = await supabase
      .from('manualeve_situacoes')
      .select('id, rotulo, emoji')
      .eq('ativa', true)
      .order('ordem', { ascending: true });

    if (error) {
      setErro(error.message);
    } else {
      setSituacoes(data || []);
    }

    setCarregando(false);
  }

  if (carregando) return <Carregando cor={cor.cor} />;
  if (erro) return <Erro mensagem={erro} onTentar={buscarSituacoes} />;

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
    fontSize: 30,
  },
  rotulo: {
    fontFamily: Fontes.negrito,
    fontSize: 15,
    color: Cores.texto,
    textAlign: 'center',
  },
});
