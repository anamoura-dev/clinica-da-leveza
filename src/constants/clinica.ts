/**
 * Dados da Clínica da Leveza usados no app (contato, política de privacidade).
 * ✏️ Preencha os campos entre [colchetes]. Enquanto estiverem entre colchetes,
 * o app esconde aquele contato.
 */
export const Clinica = {
  nome: 'Clínica da Leveza',
  razaoSocial: '[RAZÃO SOCIAL DA CLÍNICA]',
  cnpj: '[CNPJ]',
  email: '[E-MAIL DE CONTATO]',
  instagram: '[usuario_do_instagram]', // sem o @
  site: '[https://site-da-clinica.com.br]',
  politicaAtualizadaEm: '01/10/2026',
} as const;

/** true quando o campo já foi preenchido (não está mais entre colchetes). */
export const preenchido = (valor: string) => !!valor && !valor.startsWith('[');
