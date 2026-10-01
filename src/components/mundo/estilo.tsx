import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Contorno, Cores, Espaco, ESCALA_TEXTO, Fontes } from '@/constants/theme';

/**
 * Letra do Espaço das Crianças: um pouco maior que o resto do app.
 * (ESCALA_TEXTO do app × ESCALA_CRIANCAS). Mude este número para ajustar só a área infantil.
 */
export const ESCALA_CRIANCAS = 1.15;
export const tk = (tamanho: number) => Math.round(tamanho * ESCALA_TEXTO * ESCALA_CRIANCAS);

/**
 * No Espaço das Crianças tudo é em CAIXA ALTA (letra bastão), que ajuda quem
 * está começando a ler (5 anos) e continua natural para os maiores (11/12).
 */
export const CaixaAlta = {
  textTransform: 'uppercase',
  letterSpacing: 0.5,
} as const;

/** Cores firmes das listras do balão, usadas em sequência nos cartões. */
export const CORES_BLOCO = [Cores.azul, Cores.terracota, Cores.verde, Cores.amarelo, Cores.lilas] as const;
export const corDoBloco = (indice: number) => CORES_BLOCO[indice % CORES_BLOCO.length];

/** Cor hex com transparência (ex.: '#EE9A86' com 80%). */
export const tom = (hex: string, alfa: number) =>
  `${hex}${Math.round(alfa * 255)
    .toString(16)
    .padStart(2, '0')}`;

/**
 * Barra do topo do Espaço das Crianças: botão (fechar ou voltar),
 * os passos do caminho (1 · 2 · 3) e as estrelas ganhas.
 */
export function BarraPassos({
  passo,
  total = 3,
  estrelas,
  icone = 'arrow-back',
  aoTocarIcone,
  rotuloIcone,
}: {
  passo: number;
  total?: number;
  estrelas: number;
  icone?: 'arrow-back' | 'close';
  aoTocarIcone: () => void;
  rotuloIcone: string;
}) {
  return (
    <View style={estilos.barra}>
      <Pressable onPress={aoTocarIcone} hitSlop={12} accessibilityLabel={rotuloIcone} style={estilos.barraBotao}>
        <Ionicons name={icone} size={24} color={Cores.marinho} />
      </Pressable>
      <View style={estilos.passos} accessibilityLabel={`Passo ${passo} de ${total}`}>
        {Array.from({ length: total }, (_, i) => {
          const n = i + 1;
          const feito = n < passo;
          const atual = n === passo;
          return (
            <View key={n} style={estilos.passoLinha}>
              {i > 0 && <View style={[estilos.trilho, (feito || atual) && estilos.trilhoFeito]} />}
              <View style={[estilos.passo, atual && estilos.passoAtual, feito && estilos.passoFeito]}>
                {feito ? (
                  <Ionicons name="checkmark" size={14} color={Cores.marinho} />
                ) : (
                  <Text style={[estilos.passoNumero, atual && estilos.passoNumeroAtual]}>{n}</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
      <View style={estilos.estrelas}>
        <Text style={estilos.estrelasTexto}>⭐ {estrelas}</Text>
      </View>
    </View>
  );
}

/** Título de seção com ícone (no lugar de emoji decorativo). */
export function SecaoTitulo({
  icone,
  cor = Cores.marinho,
  children,
}: {
  icone: keyof typeof Ionicons.glyphMap;
  cor?: string;
  children: ReactNode;
}) {
  return (
    <View style={estilos.linha}>
      <View style={[estilos.icone, { backgroundColor: cor }]}>
        <Ionicons name={icone} size={16} color="#FFFFFF" />
      </View>
      <Text style={estilos.texto}>{children}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Espaco.xs,
  },
  barraBotao: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Cores.superficie,
    alignItems: 'center',
    justifyContent: 'center',
    ...Contorno,
  },
  passos: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trilho: {
    width: 22,
    height: 3,
    backgroundColor: Cores.borda,
  },
  trilhoFeito: {
    backgroundColor: Cores.marinho,
  },
  passo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Cores.superficie,
    borderWidth: 2,
    borderColor: Cores.borda,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passoAtual: {
    backgroundColor: Cores.amarelo,
    ...Contorno,
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  passoFeito: {
    backgroundColor: Cores.verde,
    ...Contorno,
  },
  passoNumero: {
    fontFamily: Fontes.extra,
    fontSize: tk(12),
    color: Cores.textoClaro,
  },
  passoNumeroAtual: {
    color: Cores.marinho,
    fontSize: tk(15),
  },
  estrelas: {
    backgroundColor: Cores.superficie,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    ...Contorno,
  },
  estrelasTexto: {
    fontFamily: Fontes.extra,
    fontSize: tk(14),
    color: Cores.marinho,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm,
    marginTop: Espaco.sm,
  },
  icone: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    ...Contorno,
  },
  texto: {
    ...CaixaAlta,
    letterSpacing: 1,
    fontFamily: Fontes.extra,
    fontSize: tk(17),
    color: Cores.marinho,
  },
});
