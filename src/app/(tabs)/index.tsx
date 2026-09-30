import { Ionicons } from '@expo/vector-icons';
import { Href, Link } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { PauladaAnimada } from '@/components/paulada-animada';
import { Carregando, Cartao, Erro, Rotulo, Tela } from '@/components/ui';
import { Cores, Espaco, Fontes, Raio } from '@/constants/theme';
import { useDados } from '@/hooks/use-dados';
import { supabase } from '../../../lib/supabase';

function sortear(lista: string[], evitar: string | null) {
  const opcoes = lista.length > 1 ? lista.filter((t) => t !== evitar) : lista;
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

const CAMINHOS: { emoji: string; texto: string; href: Href }[] = [
  { emoji: '🔍', texto: 'Quero entender uma situação', href: '/manualeve' },
  { emoji: '☕', texto: 'Quero aprender alguma coisa', href: '/cafe' },
  { emoji: '🎮', texto: 'Quero passar de fase', href: '/fases' },
  { emoji: '💬', texto: 'Quero conversar', href: '/conversar' },
  { emoji: '🎈', texto: 'Quero entrar no mundo das crianças', href: '/mundo' },
];

export default function Home() {
  const { dados, carregando, erro, tentarDeNovo } = useDados(buscarPauladas);
  const [escolhida, setEscolhida] = useState<string | null>(null);
  const pauladas = dados?.textos ?? [];
  const atual = escolhida ?? dados?.inicial ?? null;

  if (carregando) return <Carregando />;
  if (erro) return <Erro mensagem={erro} onTentar={tentarDeNovo} />;

  return (
    <Tela>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <Rotulo cor={Cores.lavandaEscura}>Clínica da Leveza</Rotulo>

        {atual && (
          <View style={estilos.destaque}>
            <PauladaAnimada
              texto={atual}
              onOutra={pauladas.length > 1 ? () => setEscolhida(sortear(pauladas, atual)) : undefined}
            />
          </View>
        )}

        <Text style={estilos.pergunta}>O que trouxe você até aqui?</Text>

        <View style={estilos.caminhos}>
          {CAMINHOS.map((c) => (
            <Link key={c.texto} href={c.href} asChild>
              <Cartao style={estilos.caminho}>
                <Text style={estilos.emoji}>{c.emoji}</Text>
                <Text style={estilos.caminhoTexto}>{c.texto}</Text>
                <Ionicons name="chevron-forward" size={18} color={Cores.textoClaro} />
              </Cartao>
            </Link>
          ))}
        </View>
      </ScrollView>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  conteudo: {
    padding: Espaco.lg,
    paddingTop: Espaco.lg,
  },
  destaque: {
    marginTop: Espaco.md,
  },
  pergunta: {
    fontFamily: Fontes.media,
    fontSize: 16,
    color: Cores.textoSuave,
    marginTop: Espaco.lg,
    marginBottom: Espaco.md,
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
    fontSize: 22,
  },
  caminhoTexto: {
    flex: 1,
    fontFamily: Fontes.media,
    fontSize: 16,
    color: Cores.texto,
  },
});
