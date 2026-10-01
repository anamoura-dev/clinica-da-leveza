import { Cores, Fontes, t } from '@/constants/theme';

/** Cabeçalho padrão das telas internas (detalhes) de cada aba. */
export function opcoesDaPilha(corDestaque: string) {
  return {
    headerTintColor: corDestaque,
    headerShadowVisible: false,
    headerBackButtonDisplayMode: 'minimal',
    headerStyle: { backgroundColor: Cores.fundo },
    headerTitleStyle: { fontFamily: Fontes.negrito, color: Cores.texto, fontSize: t(17) },
    contentStyle: { backgroundColor: Cores.fundo },
  } as const;
}

/** Estilo da barra de abas (usado no layout e na Home, que a esconde na abertura). */
export const estiloBarraAbas = {
  backgroundColor: Cores.superficie,
  borderTopColor: Cores.borda,
} as const;

export const barraAbasEscondida = { display: 'none' } as const;
