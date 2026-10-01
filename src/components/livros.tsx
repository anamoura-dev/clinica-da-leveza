import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Livro, livroPara, LIVROS } from '@/constants/livros';
import { Contorno, Cores, Espaco, Fontes, Raio, Sombra, t } from '@/constants/theme';

export const abrirLivro = (livro: Livro) => Linking.openURL(livro.link);

/** Vitrine grande da Home: as capas lado a lado, cada uma abre a página de compra. */
export function VitrineLivros() {
  return (
    <View style={estilos.vitrine}>
      <View style={estilos.vitrineTopo}>
        <Text style={estilos.selo}>📚 LIVROS DA ANA</Text>
        <Text style={estilos.vitrineTitulo}>Para ler com seu filho</Text>
      </View>
      <View style={estilos.capas}>
        {LIVROS.map((l, i) => (
          <Pressable
            key={l.id}
            onPress={() => abrirLivro(l)}
            accessibilityRole="link"
            accessibilityLabel={`Livro ${l.titulo}: ver no site`}
            style={({ pressed }) => [estilos.capaBotao, pressed && { opacity: 0.85 }]}>
            <Image
              source={l.capa}
              style={[estilos.capa, { transform: [{ rotate: i % 2 ? '2.5deg' : '-2.5deg' }] }]}
              contentFit="cover"
            />
            <Text style={estilos.capaTitulo} numberOfLines={2}>
              {l.titulo}
            </Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        onPress={() => router.push('/livros')}
        style={({ pressed }) => [estilos.botao, pressed && { opacity: 0.85 }]}>
        <Text style={estilos.botaoTexto}>Conhecer os livros</Text>
        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

/** Cartão no fim dos conteúdos para pais (Café, ManuaLeve). */
export function LivroRecomendado({ semente }: { semente: string }) {
  const livro = livroPara(semente);
  return (
    <Pressable
      onPress={() => abrirLivro(livro)}
      accessibilityRole="link"
      style={({ pressed }) => [estilos.recomendado, pressed && { opacity: 0.85 }]}>
      <Image source={livro.capa} style={estilos.recomendadoCapa} contentFit="cover" />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={estilos.recomendadoRotulo}>📚 PARA LER COM SEU FILHO</Text>
        <Text style={estilos.recomendadoTitulo}>{livro.titulo}</Text>
        <Text style={estilos.recomendadoTexto} numberOfLines={3}>
          {livro.chamada}
        </Text>
        <Text style={estilos.recomendadoLink}>Ver o livro →</Text>
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  vitrine: {
    backgroundColor: Cores.amareloClaro,
    borderRadius: Raio.lg,
    padding: Espaco.md,
    gap: Espaco.md,
    marginTop: Espaco.md,
    ...Contorno,
    ...Sombra,
  },
  vitrineTopo: { gap: 2 },
  selo: { fontFamily: Fontes.extra, fontSize: t(12), letterSpacing: 1, color: Cores.terracotaEscura },
  vitrineTitulo: { fontFamily: Fontes.extra, fontSize: t(21), color: Cores.marinho },
  capas: { flexDirection: 'row', gap: Espaco.md },
  capaBotao: { flex: 1, gap: Espaco.sm, alignItems: 'center' },
  capa: { width: '100%', aspectRatio: 1, borderRadius: Raio.sm, ...Contorno },
  capaTitulo: { fontFamily: Fontes.extra, fontSize: t(14), color: Cores.marinho, textAlign: 'center' },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Espaco.sm,
    backgroundColor: Cores.terracota,
    borderRadius: Raio.pilula,
    paddingVertical: 13,
    ...Contorno,
  },
  botaoTexto: { fontFamily: Fontes.extra, fontSize: t(16), color: '#FFFFFF' },
  recomendado: {
    flexDirection: 'row',
    gap: Espaco.md,
    alignItems: 'center',
    backgroundColor: Cores.amareloClaro,
    borderRadius: Raio.md,
    padding: Espaco.md,
    marginTop: Espaco.md,
    ...Contorno,
  },
  recomendadoCapa: { width: 88, height: 88, borderRadius: Raio.sm, ...Contorno },
  recomendadoRotulo: { fontFamily: Fontes.extra, fontSize: t(11), letterSpacing: 0.8, color: Cores.terracotaEscura },
  recomendadoTitulo: { fontFamily: Fontes.extra, fontSize: t(17), color: Cores.marinho },
  recomendadoTexto: { fontFamily: Fontes.regular, fontSize: t(13), lineHeight: t(18), color: Cores.texto },
  recomendadoLink: { fontFamily: Fontes.negrito, fontSize: t(14), color: Cores.terracotaEscura, marginTop: 2 },
});
