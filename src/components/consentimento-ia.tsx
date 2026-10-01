import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { ReactNode, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Carregando } from '@/components/ui';
import { Contorno, Cores, Espaco, Fontes, Raio, t } from '@/constants/theme';

const CHAVE = 'lupa:consentimento-v1';

/**
 * Antes da primeira conversa com a Lupa, explica que as mensagens vão para a
 * empresa de IA (Anthropic) e pede o "concordo" (exigido pela Apple e pela LGPD).
 * A resposta fica guardada no celular; depois disso mostra direto a conversa.
 */
export function ComConsentimentoIA({ children }: { children: ReactNode }) {
  const [consentiu, setConsentiu] = useState<boolean | null>(null);

  useEffect(() => {
    let ativo = true;
    AsyncStorage.getItem(CHAVE)
      .then((valor) => {
        if (ativo) setConsentiu(valor === 'sim');
      })
      .catch(() => {
        if (ativo) setConsentiu(false);
      });
    return () => {
      ativo = false;
    };
  }, []);

  async function concordar() {
    await AsyncStorage.setItem(CHAVE, 'sim').catch(() => {});
    setConsentiu(true);
  }

  if (consentiu === null) return <Carregando />;
  if (consentiu) return <>{children}</>;

  return (
    <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
      <View style={estilos.icone}>
        <Ionicons name="shield-checkmark-outline" size={36} color={Cores.lilasEscuro} />
      </View>
      <Text style={estilos.titulo}>Antes de conversar com a Lupa</Text>

      {[
        ['sparkles-outline', 'A Lupa é uma inteligência artificial. Ela ajuda a investigar situações e organizar ideias, mas não faz diagnósticos e não substitui um profissional.'],
        ['send-outline', 'Para responder, as mensagens que você escrever são enviadas à Anthropic, a empresa que fornece a inteligência artificial da Lupa.'],
        ['lock-closed-outline', 'O app não guarda as conversas. Evite escrever nomes completos, endereços ou documentos.'],
        ['call-outline', 'Em uma emergência, ligue para o SAMU (192). Para apoio emocional, o CVV atende 24h pelo 188.'],
      ].map(([icone, texto]) => (
        <View key={icone} style={estilos.item}>
          <Ionicons name={icone as keyof typeof Ionicons.glyphMap} size={22} color={Cores.lilasEscuro} />
          <Text style={estilos.itemTexto}>{texto}</Text>
        </View>
      ))}

      <Pressable onPress={() => router.push('/privacidade')} hitSlop={8}>
        <Text style={estilos.link}>Ler a política de privacidade</Text>
      </Pressable>

      <Pressable onPress={concordar} style={({ pressed }) => [estilos.botao, pressed && { opacity: 0.85 }]}>
        <Text style={estilos.botaoTexto}>Concordo e quero conversar</Text>
      </Pressable>
      <Pressable onPress={() => router.back()} hitSlop={8} style={{ alignSelf: 'center' }}>
        <Text style={estilos.agoraNao}>Agora não</Text>
      </Pressable>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: Cores.fundo,
  },
  conteudo: {
    padding: Espaco.lg,
    gap: Espaco.md,
    paddingBottom: Espaco.xl * 2,
  },
  icone: {
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Cores.lilasClaro,
    alignItems: 'center',
    justifyContent: 'center',
    ...Contorno,
  },
  titulo: {
    fontFamily: Fontes.extra,
    fontSize: t(22),
    color: Cores.marinho,
    textAlign: 'center',
    marginBottom: Espaco.sm,
  },
  item: {
    flexDirection: 'row',
    gap: Espaco.md,
    alignItems: 'flex-start',
    backgroundColor: Cores.superficie,
    borderRadius: Raio.md,
    padding: Espaco.md,
    ...Contorno,
  },
  itemTexto: {
    flex: 1,
    fontFamily: Fontes.regular,
    fontSize: t(15),
    lineHeight: t(21),
    color: Cores.texto,
  },
  link: {
    fontFamily: Fontes.negrito,
    fontSize: t(14),
    color: Cores.lilasEscuro,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  botao: {
    backgroundColor: Cores.lilasEscuro,
    borderRadius: Raio.pilula,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: Espaco.sm,
    ...Contorno,
  },
  botaoTexto: {
    fontFamily: Fontes.extra,
    fontSize: t(16),
    color: '#FFFFFF',
  },
  agoraNao: {
    fontFamily: Fontes.media,
    fontSize: t(14),
    color: Cores.textoSuave,
  },
});
