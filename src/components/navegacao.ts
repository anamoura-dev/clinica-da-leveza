import { Cores, Fontes } from '@/constants/theme';

/** Cabeçalho padrão das telas internas (detalhes) de cada aba. */
export function opcoesDaPilha(corDestaque: string) {
  return {
    headerTintColor: corDestaque,
    headerShadowVisible: false,
    headerBackButtonDisplayMode: 'minimal',
    headerStyle: { backgroundColor: Cores.fundo },
    headerTitleStyle: { fontFamily: Fontes.negrito, color: Cores.texto, fontSize: 17 },
    contentStyle: { backgroundColor: Cores.fundo },
  } as const;
}
