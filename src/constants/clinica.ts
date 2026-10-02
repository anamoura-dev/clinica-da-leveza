/**
 * Dados do app e da responsável por ele (contato, política de privacidade).
 * Não existe clínica: a Ana Paula atende sozinha no consultório dela.
 * "Clínica da Leveza" é só o nome do app.
 * ✏️ Preencha os campos entre [colchetes]. Enquanto estiverem entre colchetes,
 * o app esconde aquele contato.
 */
export const Clinica = {
  nome: 'Clínica da Leveza',
  responsavel: 'Ana Paula Rodrigues',
  cnpj: '[CNPJ]', // só se ela tiver (ex.: MEI). Se não tiver, deixe entre colchetes.
  email: '[E-MAIL DE CONTATO]',
  instagram: '[usuario_do_instagram]', // sem o @
  politicaAtualizadaEm: '01/10/2026',
} as const;

/** true quando o campo já foi preenchido (não está mais entre colchetes). */
export const preenchido = (valor: string) => !!valor && !valor.startsWith('[');

/**
 * "Quero conversar com a Ana": um texto curto sobre como ela trabalha + botão do WhatsApp.
 * Sem valores nem regras de pagamento no app: isso é conversado com ela, porque o trabalho
 * precisa ser explicado antes (ex.: a avaliação neuropsicológica leva cerca de 3 meses).
 * ✏️ O texto é um RASCUNHO para a Ana Paula revisar. Parágrafos separados por linha em branco.
 */
export const Agenda = {
  profissional: 'Ana Paula Rodrigues',
  especialidade: 'Neuropsi Sistêmica',
  /** Só números, com 55 (Brasil) + DDD. */
  whatsapp: '553194131079',
  whatsappExibicao: '(31) 9413-1079',
  comoTrabalho: `A Ana olha para a criança junto com tudo o que está em volta dela: a história, a família, a escola, a rotina. Porque comportamento nunca acontece sozinho.

Cada caso é único, e por isso tudo começa com uma conversa. Uma avaliação neuropsicológica, por exemplo, é um processo de cerca de três meses, com várias etapas, e vale a pena entender cada uma antes de decidir.

Chame a Ana no WhatsApp. Ela explica com calma como funciona, o que está incluído e qual caminho faz sentido para vocês.`,
  /** Mensagem que já vai escrita no WhatsApp. */
  mensagemWhatsApp: 'Olá, Ana Paula! Vim pelo app Clínica da Leveza e gostaria de entender melhor como funciona o seu trabalho.',
} as const;
