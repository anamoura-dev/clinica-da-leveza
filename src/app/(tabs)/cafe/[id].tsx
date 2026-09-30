import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

import { Carregando, Erro, Rotulo } from '@/components/ui';
import { Cores, Destaques, Espaco, Fontes, Raio } from '@/constants/theme';
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

export default function Cafe() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const larguraVideo = width - Espaco.lg * 2;
  const alturaVideo = Math.round((larguraVideo * 9) / 16);

  useEffect(() => {
    buscarCafe();
  }, [id]);

  async function buscarCafe() {
    setCarregando(true);
    setErro(null);

    const { data, error } = await supabase
      .from('content')
      .select('titulo, gancho, video_url')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      setErro(error.message);
    } else if (!data) {
      setErro('Café não encontrado.');
    } else {
      setCafe(data);
    }

    setCarregando(false);
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Café' }} />
      {carregando ? (
        <Carregando cor={cor.cor} />
      ) : erro || !cafe ? (
        <Erro mensagem={erro ?? 'Algo deu errado.'} onTentar={buscarCafe} />
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
    fontSize: 24,
    lineHeight: 31,
    color: Cores.texto,
  },
  gancho: {
    fontFamily: Fontes.regular,
    fontSize: 17,
    lineHeight: 26,
    color: Cores.textoSuave,
  },
});
