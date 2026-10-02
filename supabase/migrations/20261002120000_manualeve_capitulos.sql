-- ManuaLeve no formato do livro 📗
-- Cada capítulo tem: a história (a criança falando), o "se eu pudesse te explicar",
-- a tradução emocional para pais, quando buscar ajuda e a pergunta de cabeceira.
-- Rode no Supabase: SQL Editor → New query → cole tudo → Run. Pode rodar mais de uma vez.
-- As tabelas antigas (manualeve_situacoes / manualeve_entradas) ficam como estão; o app não usa mais.

create table if not exists manualeve_capitulos (
  id text primary key,          -- ex.: 'vendaval'
  numero int not null,          -- número do capítulo no livro
  titulo text not null,         -- ex.: 'Quando tudo vira um vendaval'
  tema text,                    -- opcional, ex.: 'Agressividade'
  emoji text not null default '🌿',
  historia text not null,       -- a criança falando (parágrafos separados por linha em branco)
  fala text,                    -- o "Se eu pudesse te explicar" (sem aspas)
  traducao text not null,       -- tradução emocional para pais
  quando_buscar_ajuda text,     -- quando o olhar profissional é indispensável
  pergunta text,                -- pergunta de cabeceira
  ativo boolean not null default true,
  ordem int not null default 0
);

alter table manualeve_capitulos enable row level security;
drop policy if exists "leitura publica" on manualeve_capitulos;
create policy "leitura publica" on manualeve_capitulos for select using (true);
