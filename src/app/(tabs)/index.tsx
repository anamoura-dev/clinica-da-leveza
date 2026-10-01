import { Ionicons } from '@expo/vector-icons';
import { Href, router, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BalaoAr, BalaoFlutuante } from '@/components/balao-ar';
import { VitrineLivros } from '@/components/livros';
import { barraAbasEscondida, estiloBarraAbas } from '@/components/navegacao';
import { PauladaAnimada } from '@/components/paulada-animada';
import { TransicaoBalao } from '@/components/transicao-balao';
import { Cartao, Rotulo } from '@/components/ui';
import { Cores, Destaques, Espaco, Fontes, Raio, t } from '@/constants/theme';
import { useDados } from '@/hooks/use-dados';
import { supabase } from '../../../lib/supabase';

function sortear(lista: string[], evitar: string | null) {
  const opcoes = lista.length > 1 ? lista.filter((frase) => frase !== evitar) : lista;
  return opcoes[Math.floor(Math.random() * opcoes.length)];
}

async function buscarPauladas() {
  const { data, error } = await supabase
    .from('pauladas')
    .select('texto')
    .eq('ativa', true)
    .eq('uso', 'abertura');

  if (error) throw new Error(error.message);
  const textos = (data ?? []).map((p) => p.texto as string);
  if (textos.length === 0) throw new Error('Nenhuma paulada encontrada.');
  return { textos, inicial: sortear(textos, null) };
}

// Cada caminho tem a cor de uma listra do balão (a mesma da seção).
type Caminho = { emoji: string; texto: string; href: Href; cor: string; nome: string };
const CAMINHOS: Caminho[] = [
  { emoji: '🔍', texto: 'Quero entender uma situação', href: '/manualeve', cor: Destaques.manualeve.cor, nome: 'o ManuaLeve' },
  { emoji: '☕', texto: 'Quero aprender alguma coisa', href: '/cafe', cor: Destaques.cafe.cor, nome: 'os Cafés' },
  { emoji: '🎮', texto: 'Quero passar de fase', href: '/fases', cor: Destaques.fases.cor, nome: 'os Jogos' },
  { emoji: '📅', texto: 'Quero agendar uma consulta', href: '/agendar', cor: Destaques.lupa.cor, nome: 'a agenda' },
  { emoji: '🎈', texto: 'Quero entrar no mundo das crianças', href: '/mundo', cor: Destaques.mundo.cor, nome: 'o Espaço das Crianças' },
];

export default function Home() {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const paginas = useRef<ScrollView>(null);
  const [pagina, setPagina] = useState(0);
  const [altura, setAltura] = useState(0);
  const [viagem, setViagem] = useState<Caminho | null>(null);
  const reduzirMovimento = useReducedMotion();

  // Ao tocar num caminho, o balão sobe voando e só então a página abre.
  function viajar(c: Caminho) {
    if (viagem) return;
    if (reduzirMovimento) {
      router.push(c.href);
      return;
    }
    setViagem(c);
  }

  const chegar = useCallback(() => {
    if (viagem) router.push(viagem.href);
    setViagem(null);
  }, [viagem]);

  const { dados, carregando, erro, tentarDeNovo } = useDados(buscarPauladas);
  const [escolhida, setEscolhida] = useState<string | null>(null);
  const pauladas = dados?.textos ?? [];
  const atual = escolhida ?? dados?.inicial ?? null;

  // Na abertura (página 1) só aparece a paulada: a barra de abas fica escondida.
  useEffect(() => {
    navigation.setOptions({ tabBarStyle: pagina === 0 ? barraAbasEscondida : estiloBarraAbas });
  }, [navigation, pagina]);

  function aoTerminarRolagem(e: NativeSyntheticEvent<NativeScrollEvent>) {
    setPagina(Math.round(e.nativeEvent.contentOffset.x / width));
  }

  function irPara(n: number) {
    paginas.current?.scrollTo({ x: n * width, animated: true });
    setPagina(n);
  }

  return (
    <View style={estilos.raiz} onLayout={(e) => setAltura(e.nativeEvent.layout.height)}>
      <StatusBar style="dark" />
      {viagem && <TransicaoBalao destino={viagem.nome} aoTerminar={chegar} />}
      <ScrollView
        ref={paginas}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={aoTerminarRolagem}>
        {/* Página 1: a paulada */}
        <View style={{ width, height: altura }}>
          {carregando ? (
            <View style={[estilos.abertura, estilos.centro]}>
              <BalaoFlutuante largura={56} amplitude={10} duracao={900} />
            </View>
          ) : erro || !atual ? (
            <View style={[estilos.abertura, estilos.centro, { gap: Espaco.md }]}>
              <Text style={estilos.erroTexto}>{erro ?? 'Algo deu errado.'}</Text>
              <Pressable onPress={tentarDeNovo} style={estilos.erroBotao}>
                <Text style={estilos.erroBotaoTexto}>Tentar de novo</Text>
              </Pressable>
              <Pressable onPress={() => irPara(1)} hitSlop={12}>
                <Text style={estilos.erroTexto}>Seguir →</Text>
              </Pressable>
            </View>
          ) : (
            <PauladaAnimada
              texto={atual}
              onOutra={pauladas.length > 1 ? () => setEscolhida(sortear(pauladas, atual)) : undefined}
              onAvancar={() => irPara(1)}
            />
          )}
        </View>

        {/* Página 2: por onde começar */}
        <SafeAreaView style={[estilos.menu, { width, height: altura }]} edges={['top']}>
          <ScrollView contentContainerStyle={estilos.conteudo}>
            <View style={estilos.topo}>
              <BalaoAr largura={40} />
              <View style={{ flex: 1 }}>
                <Rotulo cor={Cores.marinho}>Clínica da Leveza</Rotulo>
                <Text style={estilos.slogan}>
                  <Text style={{ color: Cores.verdeEscuro }}>aprendendo </Text>
                  <Text style={{ color: Cores.terracota }}>a </Text>
                  <Text style={{ color: Cores.amareloEscuro }}>ser </Text>
                  <Text style={{ color: Cores.lilasEscuro }}>leve</Text>
                </Text>
              </View>
              <Pressable onPress={() => irPara(0)} hitSlop={12} accessibilityLabel="Ver a paulada">
                <Ionicons name="sparkles-outline" size={22} color={Cores.marinho} />
              </Pressable>
            </View>

            <Text style={estilos.pergunta}>O que trouxe você até aqui?</Text>

            <View style={estilos.caminhos}>
              {CAMINHOS.map((c) => (
                <Cartao key={c.texto} style={estilos.caminho} onPress={() => viajar(c)} accessibilityRole="link">
                  <View style={[estilos.bolinha, { backgroundColor: c.cor }]}>
                    <Text style={estilos.emoji}>{c.emoji}</Text>
                  </View>
                  <Text style={estilos.caminhoTexto}>{c.texto}</Text>
                  <Ionicons name="chevron-forward" size={18} color={Cores.textoClaro} />
                </Cartao>
              ))}
            </View>

            <VitrineLivros />
          </ScrollView>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: {
    flex: 1,
    backgroundColor: Cores.ceuTopo,
  },
  abertura: {
    flex: 1,
    backgroundColor: Cores.ceuTopo,
  },
  centro: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Espaco.lg,
  },
  erroTexto: {
    fontFamily: Fontes.media,
    fontSize: t(15),
    color: Cores.marinho,
    textAlign: 'center',
  },
  erroBotao: {
    backgroundColor: Cores.superficie,
    borderWidth: 2,
    borderColor: Cores.marinho,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: Raio.pilula,
  },
  erroBotaoTexto: {
    fontFamily: Fontes.negrito,
    fontSize: t(15),
    color: Cores.marinho,
  },
  menu: {
    flex: 1,
    backgroundColor: Cores.fundo,
  },
  conteudo: {
    padding: Espaco.lg,
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm + 4,
  },
  slogan: {
    fontFamily: Fontes.extra,
    fontSize: t(14),
    marginTop: 2,
  },
  bolinha: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pergunta: {
    fontFamily: Fontes.extra,
    fontSize: t(28),
    lineHeight: t(36),
    color: Cores.texto,
    marginTop: Espaco.md,
    marginBottom: Espaco.lg,
  },
  caminhos: {
    gap: Espaco.sm + 4,
  },
  caminho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.md,
    paddingVertical: Espaco.md + 2,
    borderRadius: Raio.md,
  },
  emoji: {
    fontSize: t(19),
  },
  caminhoTexto: {
    flex: 1,
    fontFamily: Fontes.media,
    fontSize: t(16),
    color: Cores.texto,
  },
});
