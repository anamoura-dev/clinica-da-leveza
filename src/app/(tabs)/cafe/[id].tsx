import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { supabase } from '../../../../lib/supabase';

type Cafe = {
  titulo: string;
  gancho: string | null;
  video_url: string | null;
};

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
  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

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

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (erro || !cafe) {
    return (
      <View style={styles.centro}>
        <Text style={styles.erro}>{erro}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {cafe.video_url && (
        <YoutubePlayer
          height={220}
          videoId={extrairVideoId(cafe.video_url)}
        />
      )}
      <View style={styles.conteudo}>
        <Text style={styles.titulo}>{cafe.titulo}</Text>
        {cafe.gancho && <Text style={styles.gancho}>{cafe.gancho}</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conteudo: {
    padding: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  gancho: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginTop: 8,
  },
  erro: {
    color: 'red',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});