import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

import { Carregando, Erro, Rotulo } from '@/components/ui';
import { useDados } from '@/hooks/use-dados';
import { BotaoFavorito } from '@/components/conta/botao-favorito';
import { Cores, Destaques, Espaco, Fontes, Raio, t } from '@/constants/theme';
import { supabase } from '../../../../lib/supabase';

type Cafe = {
  titulo: string;
  gancho: string | null;
  video_url: string | null;
};

const cor = Destaques.cafe;

// Aceita tanto o ID puro ("dQw4w9WgXcQ") quanto links completos do YouTube
// (youtube.com/watch?v=..., youtu.be/..., /shorts/..., /embed/...).
function extrairVideoId(valor: string): string {
  const texto = valor.trim();
  const padroes = [
    /[?&]v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /\/(?:shorts|embed|live)\/([A-Za-z0-9_-]{11})/,
  ];
  for (const padrao of padroes) {
    const achado = texto.match(padrao);
    if (achado) return achado[1];
  }
  return texto;
}

export default function DetalheCafe() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const carregar = useCallback(async () => {
    const { data, error } = await supabase
      .from('content')
      .select('titulo, gancho, video_url')
      .eq('id', id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) throw new Error('Café não encontrado.');
    return data as Cafe;
  }, [id]);

  const { dados: cafe, carregando, erro, tentarDeNovo } = useDados(carregar);

  const larguraVideo = width - Espaco.lg * 2;
  const alturaVideo = Math.round((larguraVideo * 9) / 16);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Café',
          headerRight: () => <BotaoFavorito tipo="cafe" itemId={id} titulo={cafe?.titulo} />,
        }}
      />
      {carregando ? (
        <Carregando />
      ) : erro || !cafe ? (
        <Erro mensagem={erro ?? 'Algo deu errado.'} onTentar={tentarDeNovo} />
      ) : (
        <ScrollView contentContainerStyle={estilos.conteudo}>
          {cafe.video_url && (
            <View style={[estilos.video, { height: alturaVideo }]}>
              <YoutubePlayer
                width={larguraVideo}
                height={alturaVideo}
                videoId={extrairVideoId(cafe.video_url)}
              />
            </View>
          )}
          <Rotulo cor={cor.escura}>☕ Café</Rotulo>
          <Text style={estilos.titulo}>{cafe.titulo}</Text>
          {cafe.gancho && <Text style={estilos.gancho}>{cafe.gancho}</Text>}
        </ScrollView>
      )}
    </>
  );
}

const estilos = StyleSheet.create({
  conteudo: {
    padding: Espaco.lg,
    paddingTop: Espaco.sm,
    gap: Espaco.sm,
  },
  video: {
    borderRadius: Raio.md,
    overflow: 'hidden',
    backgroundColor: cor.clara,
    marginBottom: Espaco.md,
  },
  titulo: {
    fontFamily: Fontes.extra,
    fontSize: t(24),
    lineHeight: t(31),
    color: Cores.texto,
  },
  gancho: {
    fontFamily: Fontes.regular,
    fontSize: t(17),
    lineHeight: t(26),
    color: Cores.textoSuave,
  },
});
