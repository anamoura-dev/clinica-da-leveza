// Excluir conta — função do Supabase (Deno).
// Apaga o usuário logado; perfil, filhos, favoritos e progresso vão junto (on delete cascade).
// Exigido pela Apple (App Store) e pela LGPD.
// Publicar: npx supabase functions deploy excluir-conta
import { createClient } from 'jsr:@supabase/supabase-js@2';

const cabecalhosCors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function json(corpo: unknown, status = 200) {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { ...cabecalhosCors, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cabecalhosCors });
  if (req.method !== 'POST') return json({ erro: 'Método não permitido.' }, 405);

  const token = (req.headers.get('Authorization') ?? '').replace('Bearer ', '');
  if (!token) return json({ erro: 'Não autenticado.' }, 401);

  // Cliente com a chave de serviço (existe automaticamente nas funções do Supabase).
  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  // Descobre quem está pedindo a partir do token — ninguém consegue apagar a conta de outra pessoa.
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) return json({ erro: 'Sessão inválida.' }, 401);

  const apagar = await admin.auth.admin.deleteUser(data.user.id);
  if (apagar.error) {
    console.error('Erro ao excluir conta', apagar.error);
    return json({ erro: 'Não foi possível excluir a conta.' }, 500);
  }
  return json({ ok: true });
});
