import { supabase } from '../../lib/supabase';

/** Sorteia uma paulada, evitando repetir a que está na tela. */
export function sortear(lista: string[], evitar: string | null) {
  const opcoes = lista.length > 1 ? lista.filter((frase) => frase !== evitar) : lista;
  return opcoes[Math.floor(Math.random() * opcoes.length)];
}

/** Pauladas de abertura. Use com useDados(buscarPauladas, 'pauladas') para ter cache offline. */
export async function buscarPauladas() {
  const { data, error } = await supabase
    .from('pauladas')
    .select('texto')
    .eq('ativa', true)
    .eq('uso', 'abertura');

  if (error) throw new Error(error.message);
  const textos = (data ?? []).map((p) => p.texto as string);
  if (textos.length === 0) throw new Error('Nenhuma paulada encontrada.');
  return { textos, inicial: sortear(textos, null) };
}

/**
 * Frases de acolhimento ("Não sei. Só entrei."). Ficam na tabela pauladas com uso = 'acolhimento'.
 * Estas são as do app: aparecem se o banco ainda não tiver nenhuma ou se estiver sem internet.
 * (Textos para a Ana Paula revisar.)
 */
export const ACOLHIMENTOS_DO_APP = [
  'Tudo bem não saber por onde começar. Você já começou: está aqui.',
  'Hoje pode ser só um respiro. Ninguém está te cobrando nada nesta tela.',
  'Cansaço não é sinal de que você está fazendo errado. Às vezes é só sinal de que está fazendo muito.',
  'Você não precisa ter todas as respostas para ser um lugar seguro para o seu filho.',
  'Nem todo dia é dia de aprender alguma coisa. Alguns dias são só para atravessar.',
  'Se hoje foi difícil, isso não apaga tudo o que você já construiu.',
  'Seu filho está em construção. Você também. E tudo bem.',
  'Pausa também é cuidado. Inclusive com você.',
  'Errar com seu filho não te desqualifica. Voltar para consertar também é educar.',
  'Antes de cuidar de alguém, vale perguntar: e você, como está?',
  'Não precisa chegar aqui inteiro. Pode chegar do jeito que dá.',
  'Às vezes, o melhor começo é parar um pouquinho.',
];

/** Acolhimentos do banco; se não houver (ou sem internet e sem cache), usa os do app. */
export async function buscarAcolhimentos() {
  try {
    const { data, error } = await supabase
      .from('pauladas')
      .select('texto')
      .eq('ativa', true)
      .eq('uso', 'acolhimento');
    if (error) throw error;
    const textos = (data ?? []).map((p) => p.texto as string);
    if (textos.length > 0) return { textos };
  } catch {
    // segue com as frases do app
  }
  return { textos: ACOLHIMENTOS_DO_APP };
}
