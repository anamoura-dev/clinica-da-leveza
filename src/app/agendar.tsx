import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BalaoAr } from '@/components/balao-ar';
import { Agenda } from '@/constants/clinica';
import { Contorno, Cores, Destaques, Espaco, Fontes, Raio, t } from '@/constants/theme';

/**
 * "Quero conversar com a Ana": como ela trabalha, em poucas palavras, e um convite
 * para chamar no WhatsApp. Valores e pagamento ficam para a conversa com ela.
 * O app não guarda nada: o botão só abre o WhatsApp com uma mensagem pronta.
 */

const COR = Destaques.lupa;

function abrirWhatsApp() {
  const url = `https://wa.me/${Agenda.whatsapp}?text=${encodeURIComponent(Agenda.mensagemWhatsApp)}`;
  Linking.openURL(url).catch(() =>
    Alert.alert('Não deu para abrir o WhatsApp', `Chame a Ana Paula no número ${Agenda.whatsappExibicao}.`),
  );
}

export default function ConversarComAna() {
  const paragrafos = Agenda.comoTrabalho
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <Stack.Screen options={{ title: 'Conversar com a Ana' }} />
      <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
        <View style={estilos.topo}>
          <BalaoAr largura={46} />
          <View style={{ flex: 1 }}>
            <Text style={estilos.nome}>{Agenda.profissional}</Text>
            <Text style={estilos.especialidade}>{Agenda.especialidade}</Text>
          </View>
        </View>

        <Text style={estilos.titulo}>Como a Ana trabalha</Text>
        <View style={estilos.cartao}>
          {paragrafos.map((p, i) => (
            <Text key={i} style={estilos.texto}>
              {p}
            </Text>
          ))}
        </View>

        <Pressable
          onPress={abrirWhatsApp}
          accessibilityRole="link"
          style={({ pressed }) => [estilos.botao, pressed && { opacity: 0.85 }]}>
          <Ionicons name="logo-whatsapp" size={22} color="#FFFFFF" />
          <Text style={estilos.botaoTexto}>Conversar pelo WhatsApp</Text>
        </Pressable>

        <View style={estilos.linhaInfo}>
          <Ionicons name="lock-closed-outline" size={16} color={Cores.textoSuave} />
          <Text style={estilos.nota}>O app não guarda nada: a conversa acontece direto no seu WhatsApp.</Text>
        </View>
      </ScrollView>
    </>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: Cores.fundo },
  conteudo: { padding: Espaco.lg, paddingBottom: Espaco.xl * 2, gap: Espaco.md },
  topo: { flexDirection: 'row', alignItems: 'center', gap: Espaco.md },
  nome: { fontFamily: Fontes.extra, fontSize: t(22), color: Cores.marinho },
  especialidade: { fontFamily: Fontes.media, fontSize: t(15), color: COR.escura },
  titulo: { fontFamily: Fontes.extra, fontSize: t(20), color: Cores.marinho, marginTop: Espaco.sm },
  cartao: { backgroundColor: COR.clara, borderRadius: Raio.md, padding: Espaco.md + 4, gap: Espaco.sm + 4 },
  texto: { fontFamily: Fontes.regular, fontSize: t(16), lineHeight: t(25), color: Cores.texto },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Espaco.sm,
    backgroundColor: '#25A35A',
    borderRadius: Raio.pilula,
    paddingVertical: 16,
    marginTop: Espaco.sm,
    ...Contorno,
  },
  botaoTexto: { fontFamily: Fontes.extra, fontSize: t(17), color: '#FFFFFF' },
  linhaInfo: { flexDirection: 'row', gap: 6, alignItems: 'flex-start', marginTop: Espaco.sm },
  nota: { flex: 1, fontFamily: Fontes.regular, fontSize: t(12), lineHeight: t(17), color: Cores.textoSuave },
});
