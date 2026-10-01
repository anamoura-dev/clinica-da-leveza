import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Contorno, Cores, Espaco, Fontes, Raio, t } from '@/constants/theme';

function novaConta() {
  const a = 6 + Math.floor(Math.random() * 4); // 6 a 9
  const b = 6 + Math.floor(Math.random() * 4);
  const certa = a * b;
  const erradas = new Set<number>();
  while (erradas.size < 2) {
    const e = certa + (Math.floor(Math.random() * 5) + 1) * (Math.random() < 0.5 ? -1 : 1) * (a > b ? a - 4 : b - 4);
    if (e > 0 && e !== certa) erradas.add(e);
  }
  const opcoes = [certa, ...erradas].sort(() => Math.random() - 0.5);
  return { a, b, certa, opcoes };
}

/**
 * "Trava para adultos": uma continha simples antes de sair do Espaço das Crianças
 * (ou, no futuro, antes de compras e links externos).
 */
export function PortaoAdulto({
  visivel,
  aoLiberar,
  aoCancelar,
}: {
  visivel: boolean;
  aoLiberar: () => void;
  aoCancelar: () => void;
}) {
  const [conta, setConta] = useState(novaConta);
  const [errou, setErrou] = useState(false);

  function responder(valor: number) {
    if (valor === conta.certa) {
      setErrou(false);
      setConta(novaConta());
      aoLiberar();
    } else {
      setErrou(true);
      setConta(novaConta());
    }
  }

  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={aoCancelar}>
      <View style={estilos.fundo}>
        <View style={estilos.cartao}>
          <Text style={estilos.titulo}>Pergunta para um adulto</Text>
          <Text style={estilos.pergunta}>
            Quanto é {conta.a} × {conta.b}?
          </Text>
          {errou && <Text style={estilos.erro}>Não foi dessa vez. Tente esta outra conta.</Text>}
          <View style={estilos.opcoes}>
            {conta.opcoes.map((valor) => (
              <Pressable
                key={valor}
                onPress={() => responder(valor)}
                style={({ pressed }) => [estilos.opcao, pressed && { opacity: 0.8 }]}>
                <Text style={estilos.opcaoTexto}>{valor}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            onPress={() => {
              setErrou(false);
              aoCancelar();
            }}
            hitSlop={8}>
            <Text style={estilos.voltar}>Voltar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: 'rgba(47,58,107,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Espaco.lg,
  },
  cartao: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: Cores.fundo,
    borderRadius: Raio.lg,
    padding: Espaco.lg,
    gap: Espaco.md,
    alignItems: 'center',
    ...Contorno,
  },
  titulo: {
    fontFamily: Fontes.extra,
    fontSize: t(14),
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Cores.textoSuave,
  },
  pergunta: {
    fontFamily: Fontes.extra,
    fontSize: t(26),
    color: Cores.marinho,
  },
  erro: {
    fontFamily: Fontes.media,
    fontSize: t(13),
    color: Cores.erro,
    textAlign: 'center',
  },
  opcoes: {
    flexDirection: 'row',
    gap: Espaco.sm,
    alignSelf: 'stretch',
  },
  opcao: {
    flex: 1,
    backgroundColor: Cores.superficie,
    borderRadius: Raio.md,
    paddingVertical: 14,
    alignItems: 'center',
    ...Contorno,
  },
  opcaoTexto: {
    fontFamily: Fontes.extra,
    fontSize: t(20),
    color: Cores.marinho,
  },
  voltar: {
    fontFamily: Fontes.media,
    fontSize: t(14),
    color: Cores.textoSuave,
    textDecorationLine: 'underline',
  },
});
