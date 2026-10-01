/**
 * Identidade visual da Leveza — "Balão da Leveza".
 * A paleta vem das listras do balão de ar quente (símbolo da clínica):
 * azul céu, terracota, verde e amarelo, com contornos em azul-marinho
 * e fundo creme (como o tecido do bordado "aprendendo a ser leve").
 */

export const Cores = {
  fundo: '#FAF6EE',
  superficie: '#FFFFFF',
  borda: '#EAE3D6',

  marinho: '#2F3A6B', // contornos e texto principal
  texto: '#2F3A6B',
  textoSuave: '#6B7090',
  textoClaro: '#9AA0B8',

  azul: '#7FA8D2',
  azulEscuro: '#3F6E9E',
  azulClaro: '#E3EEF8',

  terracota: '#C9664E',
  terracotaEscura: '#A24A34',
  terracotaClara: '#F7E0D8',

  verde: '#8FBA5C',
  verdeEscuro: '#4F7F2E',
  verdeClaro: '#E6F0DA',

  amarelo: '#EEC46A',
  amareloEscuro: '#8A6A1F',
  amareloClaro: '#FBF0D2',

  lilas: '#B6AEDD',
  lilasEscuro: '#6A5FAE',
  lilasClaro: '#EEEBF8',

  cesto: '#F0B24E',
  ceuTopo: '#A9CBEA',
  ceuBase: '#D8E8F4',

  erro: '#C0564B',
} as const;

/** Cada seção do app tem a cor de uma listra do balão. */
export const Destaques = {
  hoje: { cor: Cores.azul, escura: Cores.azulEscuro, clara: Cores.azulClaro },
  manualeve: { cor: Cores.verde, escura: Cores.verdeEscuro, clara: Cores.verdeClaro },
  cafe: { cor: Cores.terracota, escura: Cores.terracotaEscura, clara: Cores.terracotaClara },
  fases: { cor: Cores.azul, escura: Cores.azulEscuro, clara: Cores.azulClaro },
  lupa: { cor: Cores.lilas, escura: Cores.lilasEscuro, clara: Cores.lilasClaro },
  mundo: { cor: Cores.amarelo, escura: Cores.amareloEscuro, clara: Cores.amareloClaro },
} as const;

export type Destaque = (typeof Destaques)[keyof typeof Destaques];

/**
 * Escala dos textos do app inteiro (1 = tamanho original).
 * Para letras maiores ou menores em todo o app, mude só este número.
 * O app também respeita o tamanho de texto escolhido no celular.
 */
export const ESCALA_TEXTO = 1.15;

/** Tamanho de texto já com a escala do app: use em fontSize e lineHeight. */
export const t = (tamanho: number) => Math.round(tamanho * ESCALA_TEXTO);

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

/** Contorno "de quadrinho" usado em cartões e balões. */
export const Contorno = {
  borderWidth: 2,
  borderColor: Cores.marinho,
} as const;

export const Sombra = {
  shadowColor: '#2F3A6B',
  shadowOpacity: 0.06,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
} as const;
