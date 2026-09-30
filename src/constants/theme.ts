/**
 * Identidade visual da Leveza — suave e acolhedora.
 * Tons pastel (lavanda, pêssego, sálvia) sobre um fundo creme quente.
 */

export const Cores = {
  fundo: '#FBF7F4',
  superficie: '#FFFFFF',
  borda: '#EFE7E1',

  texto: '#3D3450',
  textoSuave: '#7A7089',
  textoClaro: '#A59DB1',

  lavanda: '#8E78C8',
  lavandaEscura: '#5E4A9A',
  lavandaClara: '#EEE8FA',

  pessego: '#E8956F',
  pessegoEscuro: '#A95B38',
  pessegoClaro: '#FDEDE4',

  salvia: '#7FA677',
  salviaEscura: '#4B7244',
  salviaClara: '#E7F0E4',

  erro: '#C0564B',
} as const;

/** Cada seção do app tem sua cor de destaque. */
export const Destaques = {
  hoje: { cor: Cores.lavanda, escura: Cores.lavandaEscura, clara: Cores.lavandaClara },
  manualeve: { cor: Cores.salvia, escura: Cores.salviaEscura, clara: Cores.salviaClara },
  cafe: { cor: Cores.pessego, escura: Cores.pessegoEscuro, clara: Cores.pessegoClaro },
  fases: { cor: Cores.lavanda, escura: Cores.lavandaEscura, clara: Cores.lavandaClara },
} as const;

export type Destaque = (typeof Destaques)[keyof typeof Destaques];

export const Fontes = {
  regular: 'Nunito_400Regular',
  media: 'Nunito_600SemiBold',
  negrito: 'Nunito_700Bold',
  extra: 'Nunito_800ExtraBold',
} as const;

export const Espaco = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const Raio = {
  sm: 12,
  md: 20,
  lg: 28,
  pilula: 999,
} as const;

export const Sombra = {
  shadowColor: '#5E4A9A',
  shadowOpacity: 0.08,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 6 },
  elevation: 3,
} as const;
