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
 * ✏️ Texto da Ana Paula (03/10/2026). Parágrafos separados por linha em branco; o 1º aparece em destaque.
 */
export const Agenda = {
  profissional: 'Ana Paula Rodrigues',
  especialidade: 'Neuropsi Sistêmica',
  /** Só números, com 55 (Brasil) + DDD. */
  whatsapp: '553194131079',
  whatsappExibicao: '(31) 9413-1079',
  comoTrabalho: `💭 Criança nenhuma chega sozinha. 🔍

Então, quando alguém conta a ela que uma criança está desafiadora, ansiosa, agressiva, insegura, desatenta ou simplesmente “difícil”, ela até olha para a criança.

Mas não para nela. Aliás, não começa por ela!

Olha para a família. Para as relações. Para as expectativas. Para o que está sendo pedido. Para o que está sendo permitido. Para aquilo que ninguém está dizendo, mas todo mundo está vivendo.

Não porque ela acha que os pais são culpados.

Mas porque a família inteira participa da história. 😏

O trabalho dela é justamente esse: ajudar a enxergar o que está por trás do sintoma/comportamento sem transformar a infância num problema a ser consertado.

Ela gosta de traduzir o que parece complicado.

De fazer perguntas que às vezes dão uma pequena coçada na cabeça ou um pequeno golpe no estômago (brincadeira!)

De acolher sem passar pano.

De colocar limite sem transformar a casa num quartel.

E de lembrar que entender uma criança não significa concordar com tudo o que ela faz.

Seu maior diferencial é emprestar suas lentes 🔍 para o outro!

Depois de tantos anos olhando para infância, desenvolvimento e relações, foi entendendo que muitas vezes não falta informação para uma família.

Falta uma lente diferente para enxergar aquilo que já está acontecendo.

E quando o olhar muda, a história pode começar a mudar também.

É disso que ela gosta!

De ajudar crianças a serem crianças.

E adultos a serem adultos.

Sem culpa.

Sem receitas mágicas.

E, se possível, com um pouco mais de leveza no caminho. 🎈`,
  /** Mensagem que já vai escrita no WhatsApp. */
  mensagemWhatsApp: 'Olá, Ana Paula! Vim pelo app Clínica da Leveza e gostaria de entender melhor como funciona o seu trabalho.',
} as const;
