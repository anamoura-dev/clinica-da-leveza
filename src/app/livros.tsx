import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { abrirLivro } from '@/components/livros';
import { LIVROS } from '@/constants/livros';
import { Contorno, Cores, Espaco, Fontes, Raio, t } from '@/constants/theme';

/** Página "Livros da Ana": os dois livros infantis com resumo e botão de compra. */
export default function Livros() {
  return (
    <>
      <Stack.Screen options={{ title: 'Livros da Ana' }} />
      <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
        <Text style={estilos.intro}>
          Livros infantis escritos pela Ana para ler junto com as crianças.
        </Text>
        {LIVROS.map((l) => (
          <View key={l.id} style={estilos.livro}>
            <Image source={l.capa} style={estilos.capa} contentFit="cover" />
            <Text style={estilos.titulo}>{l.titulo}</Text>
            <Text style={estilos.resumo}>{l.resumo}</Text>
            <Pressable
              onPress={() => abrirLivro(l)}
              accessibilityRole="link"
              style={({ pressed }) => [estilos.botao, pressed && { opacity: 0.85 }]}>
              <Ionicons name="cart-outline" size={20} color="#FFFFFF" />
              <Text style={estilos.botaoTexto}>Quero este livro</Text>
            </Pressable>
          </View>
        ))}
        <Text style={estilos.nota}>A compra é feita no site aprendendoaserleve.com.br.</Text>
      </ScrollView>
    </>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: Cores.fundo },
  conteudo: { padding: Espaco.lg, paddingBottom: Espaco.xl * 2, gap: Espaco.lg },
  intro: { fontFamily: Fontes.regular, fontSize: t(16), lineHeight: t(23), color: Cores.texto },
  livro: {
    backgroundColor: Cores.superficie,
    borderRadius: Raio.lg,
    padding: Espaco.md,
    gap: Espaco.sm + 4,
    ...Contorno,
  },
  capa: { width: '100%', aspectRatio: 1, borderRadius: Raio.md, ...Contorno },
  titulo: { fontFamily: Fontes.extra, fontSize: t(22), color: Cores.marinho },
  resumo: { fontFamily: Fontes.regular, fontSize: t(15), lineHeight: t(22), color: Cores.texto },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Espaco.sm,
    backgroundColor: Cores.terracota,
    borderRadius: Raio.pilula,
    paddingVertical: 14,
    ...Contorno,
  },
  botaoTexto: { fontFamily: Fontes.extra, fontSize: t(17), color: '#FFFFFF' },
  nota: { fontFamily: Fontes.regular, fontSize: t(13), color: Cores.textoSuave, textAlign: 'center' },
});
