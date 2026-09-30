import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInRight, ZoomIn } from 'react-native-reanimated';

import { buscarHistoria } from '@/components/mundo/dados';
import { Carregando, Erro } from '@/components/ui';
import { Cores, Espaco, Fontes, Raio, Sombra } from '@/constants/theme';
import { useDados } from '@/hooks/use-dados';

/** Botão "Ouvir" — só aparece quando a história tem um áudio. */
function BotaoOuvir({ url }: { url: string }) {
  const player = useAudioPlayer(url);
  const status = useAudioPlayerStatus(player);
  const tocando = status.playing;

  return (
    <Pressable
      onPress={() => (tocando ? player.pause() : player.play())}
      style={({ pressed }) => [estilos.ouvir, pressed && { opacity: 0.8 }]}
      accessibilityLabel={tocando ? 'Pausar a história' : 'Ouvir a história'}>
      <Ionicons name={tocando ? 'pause' : 'headset'} size={20} color="#FFFFFF" />
      <Text style={estilos.ouvirTexto}>{tocando ? 'Pausar' : 'Ouvir'}</Text>
    </Pressable>
  );
}

export default function LerHistoria() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const carregar = useCallback(() => buscarHistoria(id), [id]);
  const { dados, carregando, erro, tentarDeNovo } = useDados(carregar);
  const [pagina, setPagina] = useState(0);

  if (carregando) return <Carregando cor={Cores.pessego} />;
  if (erro || !dados) return <Erro mensagem={erro ?? 'Algo deu errado.'} onTentar={tentarDeNovo} />;

  const { historia, personagem } = dados;
  const paginas = historia.paginas ?? [];
  const total = paginas.length;
  const noFim = pagina >= total; // "página" extra de conversa no final
  const atual = paginas[Math.min(pagina, total - 1)];
  const corFundo = personagem?.cor ?? Cores.pessegoClaro;

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerStyle: { backgroundColor: corFundo },
          headerRight: () => (historia.audio_url ? <BotaoOuvir url={historia.audio_url} /> : null),
        }}
      />
      <View style={[estilos.tela, { backgroundColor: corFundo }]}>
        <ScrollView contentContainerStyle={estilos.conteudo}>
          <Text style={estilos.titulo}>{historia.titulo}</Text>

          {!noFim && atual ? (
            <Animated.View key={pagina} entering={FadeInRight.duration(350)} style={estilos.pagina}>
              <Text style={estilos.ilustracao}>{atual.emoji}</Text>
              <Text style={estilos.texto}>{atual.texto}</Text>
            </Animated.View>
          ) : (
            <Animated.View entering={ZoomIn.springify().damping(12)} style={estilos.pagina}>
              <Text style={estilos.ilustracao}>🎉</Text>
              <Text style={estilos.fim}>Fim!</Text>
              {historia.pergunta_final && (
                <View style={estilos.conversa}>
                  <Text style={estilos.conversaRotulo}>💬 Para conversar</Text>
                  <Text style={estilos.conversaTexto}>{historia.pergunta_final}</Text>
                </View>
              )}
            </Animated.View>
          )}
        </ScrollView>

        {/* Pontinhos de progresso + navegação */}
        <View style={estilos.rodape}>
          <View style={estilos.pontos}>
            {[...paginas, null].map((_, i) => (
              <View key={i} style={[estilos.ponto, i === pagina && estilos.pontoAtivo]} />
            ))}
          </View>
          <View style={estilos.botoes}>
            <Pressable
              onPress={() => setPagina((p) => Math.max(0, p - 1))}
              disabled={pagina === 0}
              style={[estilos.botao, estilos.botaoVoltar, pagina === 0 && { opacity: 0.3 }]}
              accessibilityLabel="Página anterior">
              <Ionicons name="arrow-back" size={26} color={Cores.texto} />
            </Pressable>
            {noFim ? (
              <Pressable onPress={() => router.back()} style={[estilos.botao, estilos.botaoFrente]}>
                <Text style={estilos.botaoTexto}>Terminar</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => setPagina((p) => p + 1)}
                style={[estilos.botao, estilos.botaoFrente]}
                accessibilityLabel="Próxima página">
                <Text style={estilos.botaoTexto}>{pagina === total - 1 ? 'Acabou?' : 'Próxima'}</Text>
                <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
  },
  conteudo: {
    padding: Espaco.lg,
    paddingTop: 0,
    flexGrow: 1,
  },
  titulo: {
    fontFamily: Fontes.extra,
    fontSize: 22,
    lineHeight: 28,
    color: Cores.texto,
    textAlign: 'center',
    marginBottom: Espaco.md,
  },
  pagina: {
    flex: 1,
    backgroundColor: Cores.superficie,
    borderRadius: Raio.lg,
    padding: Espaco.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Espaco.lg,
    minHeight: 380,
    ...Sombra,
  },
  ilustracao: {
    fontSize: 84,
    textAlign: 'center',
  },
  texto: {
    fontFamily: Fontes.negrito,
    fontSize: 22,
    lineHeight: 32,
    color: Cores.texto,
    textAlign: 'center',
  },
  fim: {
    fontFamily: Fontes.extra,
    fontSize: 34,
    color: Cores.pessegoEscuro,
  },
  conversa: {
    backgroundColor: Cores.lavandaClara,
    borderRadius: Raio.md,
    padding: Espaco.md,
    gap: 6,
    alignSelf: 'stretch',
  },
  conversaRotulo: {
    fontFamily: Fontes.extra,
    fontSize: 13,
    color: Cores.lavandaEscura,
  },
  conversaTexto: {
    fontFamily: Fontes.media,
    fontSize: 18,
    lineHeight: 26,
    color: Cores.texto,
  },
  rodape: {
    padding: Espaco.lg,
    paddingTop: Espaco.sm,
    gap: Espaco.md,
  },
  pontos: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  ponto: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(61,52,80,0.2)',
  },
  pontoAtivo: {
    width: 26,
    backgroundColor: Cores.texto,
  },
  botoes: {
    flexDirection: 'row',
    gap: Espaco.md,
  },
  botao: {
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Espaco.sm,
  },
  botaoVoltar: {
    width: 60,
    backgroundColor: Cores.superficie,
  },
  botaoFrente: {
    flex: 1,
    backgroundColor: Cores.pessegoEscuro,
  },
  botaoTexto: {
    fontFamily: Fontes.extra,
    fontSize: 20,
    color: '#FFFFFF',
  },
  ouvir: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Cores.pessegoEscuro,
    borderRadius: Raio.pilula,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  ouvirTexto: {
    fontFamily: Fontes.extra,
    fontSize: 14,
    color: '#FFFFFF',
  },
});
