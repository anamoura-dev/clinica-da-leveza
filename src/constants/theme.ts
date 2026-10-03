/**
 * Identidade visual da Clínica da Leveza (paleta do app, 04/10/2026).
 * Azul identidade #24527F · Laranja #F2A06B · Lima #D0DE7D · Pink #D86BB7
 * · Marfim #FCFDF0 (fundo) · Grafite #252525 (texto).
 * Os nomes antigos das chaves (terracota, verde, amarelo, lilas) foram mantidos
 * para não mexer no resto do código: veja ao lado qual cor cada um virou.
 * O balão de ar quente tem as cores dele em src/components/balao-ar.tsx.
 */

export const Cores = {
  fundo: '#FCFDF0', // marfim
  superficie: '#FFFFFF',
  borda: '#E7E8D6',

  marinho: '#24527F', // azul identidade: títulos e contornos
  texto: '#252525', // grafite
  textoSuave: '#5F6368',
  textoClaro: '#9EA19A',

  azul: '#8FB3D9', // azul claro (tom do azul identidade)
  azulEscuro: '#24527F',
  azulClaro: '#E3ECF6',

  terracota: '#F2A06B', // laranja identidade
  terracotaEscura: '#B8622C',
  terracotaClara: '#FCE6D6',

  verde: '#D0DE7D', // lima
  verdeEscuro: '#5A6A12',
  verdeClaro: '#F1F5D5',

  amarelo: '#D0DE7D', // lima (a paleta nova não tem amarelo)
  amareloEscuro: '#5A6A12',
  amareloClaro: '#F4F7DD',

  lilas: '#D86BB7', // pink acento
  lilasEscuro: '#A8418A',
  lilasClaro: '#F8E1F1',

  cesto: '#F0B24E',
  ceuTopo: '#C3D6EA',
  ceuBase: '#EAF1F7',

  erro: '#C0564B',
} as const;

/** Cor de cada seção do app. */
export const Destaques = {
  hoje: { cor: Cores.marinho, escura: '#1B3F63', clara: Cores.azulClaro },
  manualeve: { cor: Cores.azul, escura: Cores.azulEscuro, clara: Cores.azulClaro },
  cafe: { cor: Cores.terracota, escura: Cores.terracotaEscura, clara: Cores.terracotaClara },
  fases: { cor: Cores.verde, escura: Cores.verdeEscuro, clara: Cores.verdeClaro },
  lupa: { cor: Cores.marinho, escura: '#1B3F63', clara: Cores.azulClaro },
  mundo: { cor: Cores.lilas, escura: Cores.lilasEscuro, clara: Cores.lilasClaro },
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
