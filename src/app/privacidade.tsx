import { Stack } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Clinica, preenchido } from '@/constants/clinica';
import { POLITICA_DE_PRIVACIDADE } from '@/constants/politica-privacidade';
import { Cores, Espaco, Fontes, t } from '@/constants/theme';

/** Troca os marcadores {NOME}, {EMAIL}... pelos dados de src/constants/clinica.ts. */
function preencher(texto: string) {
  const ou = (valor: string, alternativa: string) => (preenchido(valor) ? valor : alternativa);
  return texto
    .replaceAll(' (CNPJ {CNPJ})', preenchido(Clinica.cnpj) ? ' (CNPJ {CNPJ})' : '')
    .replaceAll('{NOME}', Clinica.nome)
    .replaceAll('{RESPONSAVEL}', Clinica.responsavel)
    .replaceAll('{CNPJ}', Clinica.cnpj)
    .replaceAll('{EMAIL}', ou(Clinica.email, 'pelo WhatsApp da tela “Quero agendar uma consulta”'))
    .replaceAll('{DATA}', Clinica.politicaAtualizadaEm);
}

export default function Privacidade() {
  return (
    <>
      <Stack.Screen options={{ title: 'Privacidade' }} />
      <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
        <Text style={estilos.titulo}>Política de Privacidade</Text>
        {POLITICA_DE_PRIVACIDADE.map((secao) => (
          <View key={secao.titulo} style={estilos.secao}>
            <Text style={estilos.secaoTitulo}>{secao.titulo}</Text>
            {secao.paragrafos.map((p, i) => (
              <Text key={i} style={estilos.paragrafo}>
                {preencher(p)}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: Cores.fundo,
  },
  conteudo: {
    padding: Espaco.lg,
    paddingBottom: Espaco.xl * 2,
    gap: Espaco.lg,
  },
  titulo: {
    fontFamily: Fontes.extra,
    fontSize: t(24),
    color: Cores.marinho,
  },
  secao: {
    gap: Espaco.sm,
  },
  secaoTitulo: {
    fontFamily: Fontes.extra,
    fontSize: t(17),
    color: Cores.marinho,
  },
  paragrafo: {
    fontFamily: Fontes.regular,
    fontSize: t(15),
    lineHeight: t(22),
    color: Cores.texto,
  },
});
