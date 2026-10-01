import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInRight, ZoomIn } from 'react-native-reanimated';

import { buscarHistoria } from '@/components/mundo/dados';
import { Carregando, Erro } from '@/components/ui';
import { Contorno, Cores, Espaco, Fontes, Raio } from '@/constants/theme';
import { BotaoFavorito } from '@/components/conta/botao-favorito';
import { CaixaAlta, tk } from '@/components/mundo/estilo';
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
  // Em celular pequeno (ex.: iPhone SE), letra e ilustração um pouco menores para a página caber.
  const compacto = useWindowDimensions().height < 720;
  const { id } = useLocalSearchParams<{ id: string }>();
  const carregar = useCallback(() => buscarHistoria(id), [id]);
  const { dados, carregando, erro, tentarDeNovo } = useDados(carregar);
  const [pagina, setPagina] = useState(0);

  if (carregando) return <Carregando />;
  if (erro || !dados) return <Erro mensagem={erro ?? 'Algo deu errado.'} onTentar={tentarDeNovo} />;

  const { historia, personagem } = dados;
  const paginas = historia.paginas ?? [];
  const total = paginas.length;
  const noFim = pagina >= total; // "página" extra de conversa no final
  const atual = paginas[Math.min(pagina, total - 1)];
  const corFundo = personagem?.cor ?? Cores.amareloClaro;

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerStyle: { backgroundColor: corFundo },
          headerRight: () => (
            <View style={estilos.acoesTopo}>
              {historia.audio_url && <BotaoOuvir url={historia.audio_url} />}
              <BotaoFavorito tipo="historia" itemId={historia.id} titulo={historia.titulo} />
            </View>
          ),
        }}
      />
      <View style={[estilos.tela, { backgroundColor: corFundo }]}>
        <ScrollView contentContainerStyle={estilos.conteudo}>
          <Text style={estilos.titulo}>{historia.titulo}</Text>

          {!noFim && atual ? (
            <Animated.View key={pagina} entering={FadeInRight.duration(350)} style={estilos.pagina}>
              <Text style={[estilos.ilustracao, compacto && estilos.ilustracaoCompacta]}>{atual.emoji}</Text>
              <Text style={[estilos.texto, compacto && estilos.textoCompacto]}>{atual.texto}</Text>
            </Animated.View>
          ) : (
            <Animated.View entering={ZoomIn.springify().damping(12)} style={estilos.pagina}>
              <Text style={[estilos.ilustracao, compacto && estilos.ilustracaoCompacta]}>🎉</Text>
              <Text style={estilos.fim}>Fim!</Text>
              {historia.pergunta_final && (
                <View style={estilos.conversa}>
                  <Text style={estilos.conversaRotulo}>💬 Para conversar</Text>
                  <Text style={[estilos.conversaTexto, compacto && estilos.conversaCompacta]}>{historia.pergunta_final}</Text>
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
                <Ionicons name="arrow-forward" size={24} color={Cores.marinho} />
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
    ...CaixaAlta,
    fontFamily: Fontes.extra,
    fontSize: tk(22),
    lineHeight: tk(28),
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
    ...Contorno,
  },
  ilustracao: {
    fontSize: 72,
    textAlign: 'center',
  },
  texto: {
    ...CaixaAlta,
    fontFamily: Fontes.negrito,
    fontSize: tk(22),
    lineHeight: tk(32),
    color: Cores.texto,
    textAlign: 'center',
  },
  ilustracaoCompacta: {
    fontSize: 54,
  },
  conversaCompacta: {
    fontSize: tk(14),
    lineHeight: tk(20),
  },
  textoCompacto: {
    fontSize: tk(18),
    lineHeight: tk(25),
  },
  fim: {
    ...CaixaAlta,
    fontFamily: Fontes.extra,
    fontSize: tk(34),
    color: Cores.terracota,
  },
  conversa: {
    backgroundColor: Cores.azulClaro,
    borderRadius: Raio.md,
    padding: Espaco.md,
    gap: 6,
    alignSelf: 'stretch',
  },
  conversaRotulo: {
    ...CaixaAlta,
    fontFamily: Fontes.extra,
    fontSize: tk(13),
    color: Cores.azulEscuro,
  },
  conversaTexto: {
    ...CaixaAlta,
    fontFamily: Fontes.media,
    fontSize: tk(18),
    lineHeight: tk(26),
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
    ...Contorno,
  },
  botaoFrente: {
    flex: 1,
    backgroundColor: Cores.amarelo,
    ...Contorno,
  },
  botaoTexto: {
    ...CaixaAlta,
    fontFamily: Fontes.extra,
    fontSize: tk(20),
    color: Cores.marinho,
  },
  acoesTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  ouvir: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Cores.amareloEscuro,
    borderRadius: Raio.pilula,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  ouvirTexto: {
    ...CaixaAlta,
    fontFamily: Fontes.extra,
    fontSize: tk(14),
    color: '#FFFFFF',
  },
});
