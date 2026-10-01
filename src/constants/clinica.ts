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
 * Agendamento ("Quero agendar uma consulta").
 * ✏️ Valores, duração e regras são EXEMPLOS: troque quando a Ana Paula confirmar.
 * O app não guarda nada: o formulário só monta uma mensagem de WhatsApp.
 */
export const Agenda = {
  profissional: 'Ana Paula Rodrigues',
  especialidade: 'Neuropsi Sistêmica',
  /** Site da Ana Paula, onde ela vende os livros dela. */
  siteLivros: 'https://aprendendoaserleve.com.br',
  /** Só números, com 55 (Brasil) + DDD. */
  whatsapp: '553194131079',
  whatsappExibicao: '(31) 9413-1079',
  /** Porcentagem do valor paga como sinal para confirmar o horário. */
  sinalPercentual: 25,
  consultas: [
    { id: 'online', nome: 'Online', icone: 'videocam-outline', detalhe: 'Por vídeo', valor: 200, duracao: '50 min' },
    { id: 'presencial', nome: 'Presencial', icone: 'home-outline', detalhe: 'No consultório', valor: 250, duracao: '50 min' },
  ],
  regras: [
    'O horário só fica reservado depois do pagamento do sinal.',
    'Precisa remarcar? Avise com até 24 horas de antecedência e o sinal vale para o novo horário.',
    'Cancelamentos com menos de 24 horas ou faltas: o sinal não é devolvido.',
    'O restante é pago no dia da consulta. A nota fiscal é emitida para todos os pagamentos.',
  ],
  endereco: '[ENDEREÇO DO CONSULTÓRIO]',
  /** Link de cadastro/agendamento do Tivita, se existir. Vira um botão quando preenchido. */
  linkTivita: '[LINK DO TIVITA]',
} as const;

export type TipoConsulta = (typeof Agenda.consultas)[number];

/** 250 → "R$ 250,00" */
export const reais = (valor: number) => `R$ ${valor.toFixed(2).replace('.', ',')}`;

export const valorDoSinal = (valor: number) => Math.round(valor * Agenda.sinalPercentual) / 100;
