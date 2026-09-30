import { Ionicons } from '@expo/vector-icons';
import { Href, Link } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Botao, Carregando, Cartao, Erro, Rotulo, Tela } from '@/components/ui';
import { useDados } from '@/hooks/use-dados';
import { Cores, Destaque, Destaques, Espaco, Fontes, Raio } from '@/constants/theme';
import { supabase } from '../../../lib/supabase';

function saudacao() {
  const hora = new Date().getHours();
  if (hora < 12) return 'Bom dia';
  if (hora < 18) return 'Boa tarde';
  return 'Boa noite';
}

function sortear(lista: string[], evitar: string | null) {
  const opcoes = lista.length > 1 ? lista.filter((t) => t !== evitar) : lista;
  return opcoes[Math.floor(Math.random() * opcoes.length)];
}

const ATALHOS: {
  href: Href;
  titulo: string;
  descricao: string;
  icone: keyof typeof Ionicons.glyphMap;
  destaque: Destaque;
}[] = [
  {
    href: '/manualeve',
    titulo: 'ManuaLeve',
    descricao: 'Meu filho não quer... e agora?',
    icone: 'book-outline',
    destaque: Destaques.manualeve,
  },
  {
    href: '/cafe',
    titulo: 'Cafés',
    descricao: 'Conversas curtas para o seu dia',
    icone: 'cafe-outline',
    destaque: Destaques.cafe,
  },
  {
    href: '/fases',
    titulo: 'Passa de Fase',
    descricao: 'Treine situações do dia a dia',
    icone: 'game-controller-outline',
    destaque: Destaques.fases,
  },
];

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

export default function Hoje() {
  const { dados, carregando, erro, tentarDeNovo } = useDados(buscarPauladas);
  const [escolhida, setEscolhida] = useState<string | null>(null);
  const pauladas = dados?.textos ?? [];
  const atual = escolhida ?? dados?.inicial ?? null;

  if (carregando) return <Carregando />;
  if (erro) return <Erro mensagem={erro} onTentar={tentarDeNovo} />;

  return (
    <Tela titulo={`${saudacao()}!`} subtitulo="Um respiro para começar.">
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View style={estilos.paulada}>
          <Rotulo cor={Cores.lavandaEscura}>#Paulada</Rotulo>
          <Text style={estilos.pauladaTexto}>{atual}</Text>
          {pauladas.length > 1 && (
            <Botao
              titulo="Outra paulada"
              icone="refresh"
              variante="suave"
              cor={Cores.lavandaEscura}
              onPress={() => setEscolhida(sortear(pauladas, atual))}
            />
          )}
        </View>

        <Text style={estilos.secao}>Para explorar</Text>
        {ATALHOS.map((a) => (
          <Link key={a.titulo} href={a.href} asChild>
            <Cartao style={estilos.atalho}>
              <View style={[estilos.atalhoIcone, { backgroundColor: a.destaque.clara }]}>
                <Ionicons name={a.icone} size={22} color={a.destaque.escura} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={estilos.atalhoTitulo}>{a.titulo}</Text>
                <Text style={estilos.atalhoDescricao}>{a.descricao}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Cores.textoClaro} />
            </Cartao>
          </Link>
        ))}
      </ScrollView>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  conteudo: {
    paddingHorizontal: Espaco.lg,
    paddingBottom: Espaco.xl,
    gap: Espaco.md,
  },
  paulada: {
    backgroundColor: Cores.lavandaClara,
    borderRadius: Raio.lg,
    padding: Espaco.lg,
    paddingVertical: Espaco.xl,
    alignItems: 'center',
    gap: Espaco.lg,
  },
  pauladaTexto: {
    fontFamily: Fontes.negrito,
    fontSize: 22,
    lineHeight: 31,
    color: Cores.texto,
    textAlign: 'center',
  },
  secao: {
    fontFamily: Fontes.extra,
    fontSize: 18,
    color: Cores.texto,
    marginTop: Espaco.sm,
  },
  atalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.md,
  },
  atalhoIcone: {
    width: 44,
    height: 44,
    borderRadius: Raio.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  atalhoTitulo: {
    fontFamily: Fontes.negrito,
    fontSize: 16,
    color: Cores.texto,
  },
  atalhoDescricao: {
    fontFamily: Fontes.regular,
    fontSize: 14,
    color: Cores.textoSuave,
    marginTop: 2,
  },
});
