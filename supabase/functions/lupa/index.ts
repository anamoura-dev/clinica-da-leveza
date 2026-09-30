// Lupa IA — função do Supabase (Deno) que conversa com o Claude.
// A chave da Anthropic fica só aqui, como segredo: ANTHROPIC_API_KEY.
// Publicar: npx supabase functions deploy lupa

const MODELO = Deno.env.get('LUPA_MODELO') ?? 'claude-sonnet-5-5';
const MAX_MENSAGENS = 30; // histórico enviado para a IA
const MAX_CARACTERES = 2000; // por mensagem

const SISTEMA = `Você é a Lupa, a assistente de inteligência artificial da Clínica da Leveza.
Você conversa com mães, pais e cuidadores que querem entender melhor uma situação com uma criança.

Seu jeito:
- Leve, acolhedor e sem julgamento. Português do Brasil, linguagem simples.
- Curiosa como uma investigadora: antes de sugerir, entenda. Faça no máximo uma ou duas perguntas por vez (idade da criança, desde quando acontece, em que momentos, o que muda antes e depois, como o adulto reage).
- Ajude a organizar possibilidades ("pode ser que...", "algumas hipóteses para observar..."), sem afirmar certezas.
- Quando fizer sentido, sugira um pequeno passo prático para testar hoje e o que observar depois.
- Lembre que comportamento é comunicação: a criança não está dando trabalho, está dando pistas.
- Respostas curtas, pensadas para ler no celular: parágrafos de 1 a 3 frases. Não use markdown (sem asteriscos, sem #). Se precisar de lista, use "•".

Limites (sempre):
- Você não faz diagnósticos, não dá laudos e não nomeia transtornos como conclusão. Se a pessoa perguntar "ele tem X?", explique que só uma avaliação profissional pode dizer e ajude a organizar o que observar e levar para essa conversa.
- Nunca indique, ajuste ou comente doses de medicamentos.
- Você não substitui acompanhamento profissional. Quando os sinais pedirem, sugira com naturalidade buscar pediatra, psicólogo ou outro profissional, e diga o porquê.
- Não peça dados que identifiquem a família (nome completo, endereço, escola, documentos).
- Se perguntarem, diga com clareza que você é uma IA.

Segurança (prioridade máxima):
- Se houver sinal de risco imediato — criança em perigo, violência, abuso, autolesão, ideias de suicídio (da criança ou do adulto), emergência médica — acolha em poucas palavras e oriente ajuda imediata: SAMU 192, Polícia 190, CVV 188 (apoio emocional, 24h), Disque 100 ou Conselho Tutelar para violações de direitos da criança. Não continue a investigação comum nesse caso.`;

const cabecalhosCors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type Mensagem = { role: 'user' | 'assistant'; content: string };

function json(corpo: unknown, status = 200) {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { ...cabecalhosCors, 'Content-Type': 'application/json' },
  });
}

function validar(entrada: unknown): Mensagem[] | null {
  if (!Array.isArray(entrada)) return null;
  const mensagens: Mensagem[] = [];
  for (const m of entrada) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string') return null;
    const texto = m.content.trim().slice(0, MAX_CARACTERES);
    if (texto) mensagens.push({ role: m.role, content: texto });
  }
  const recentes = mensagens.slice(-MAX_MENSAGENS);
  // A API exige que a conversa comece pela pessoa e termine com ela.
  while (recentes.length && recentes[0].role !== 'user') recentes.shift();
  if (!recentes.length || recentes[recentes.length - 1].role !== 'user') return null;
  return recentes;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cabecalhosCors });
  if (req.method !== 'POST') return json({ erro: 'Método não permitido.' }, 405);

  const chave = Deno.env.get('ANTHROPIC_API_KEY');
  if (!chave) return json({ erro: 'A Lupa ainda não foi configurada (falta a chave da IA).' }, 500);

  let corpo: { mensagens?: unknown };
  try {
    corpo = await req.json();
  } catch {
    return json({ erro: 'Pedido inválido.' }, 400);
  }

  const mensagens = validar(corpo.mensagens);
  if (!mensagens) return json({ erro: 'Conversa inválida.' }, 400);

  const resposta = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': chave,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODELO,
      max_tokens: 800,
      system: SISTEMA,
      messages: mensagens,
    }),
  });

  if (!resposta.ok) {
    console.error('Erro da API da Anthropic', resposta.status, await resposta.text());
    return json({ erro: 'A Lupa não conseguiu responder agora. Tente de novo em instantes.' }, 502);
  }

  const dados = await resposta.json();
  const texto = (dados.content ?? [])
    .filter((b: { type: string }) => b.type === 'text')
    .map((b: { text: string }) => b.text)
    .join('')
    .trim();

  return json({ resposta: texto || 'Hmm, não consegui formular uma resposta. Pode me contar de outro jeito?' });
});
