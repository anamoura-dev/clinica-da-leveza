-- Espaço das Crianças 🎈
-- Rode este arquivo no Supabase: painel → SQL Editor → New query → cole tudo → Run.
-- Ele cria as tabelas, libera a leitura para o app e coloca conteúdo de EXEMPLO
-- (para trocar depois pelo painel em Table Editor).

-- ---------- Tabelas ----------

create table if not exists mundo_personagens (
  id text primary key,                 -- ex.: 'nina'
  nome text not null,                  -- ex.: 'Nina'
  especie text not null,               -- ex.: 'a raposa curiosa'
  emoji text not null,
  cor text not null default '#F7C9B0', -- cor de fundo (hex)
  fala text not null,                  -- como o personagem se apresenta
  ordem int not null default 0
);

create table if not exists mundo_sentimentos (
  id text primary key,                 -- ex.: 'bravo'
  nome text not null,                  -- ex.: 'Bravo'
  emoji text not null,
  cor text not null,                   -- hex
  personagem_id text references mundo_personagens(id),
  mensagem text not null,              -- o que o personagem diz quando a criança escolhe esse sentimento
  ordem int not null default 0
);

create table if not exists mundo_historias (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  emoji text not null default '📖',
  sentimento_id text references mundo_sentimentos(id),
  personagem_id text references mundo_personagens(id),
  paginas jsonb not null,              -- lista de páginas: [{ "emoji": "🐻", "texto": "..." }]
  pergunta_final text,                 -- pergunta para conversar depois da leitura
  audio_url text,                      -- link de um áudio (mp3) narrando a história; opcional
  publicada boolean not null default true,
  ordem int not null default 0
);

create table if not exists mundo_missoes (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  emoji text not null default '🎯',
  sentimento_id text references mundo_sentimentos(id),
  descricao text,
  passos jsonb not null,               -- lista de passos: ["...", "..."]
  desenhar boolean not null default false, -- true = a missão termina no cantinho de desenho
  publicada boolean not null default true,
  ordem int not null default 0
);

-- ---------- Leitura liberada para o app ----------

alter table mundo_personagens enable row level security;
alter table mundo_sentimentos enable row level security;
alter table mundo_historias enable row level security;
alter table mundo_missoes enable row level security;

drop policy if exists "leitura publica" on mundo_personagens;
drop policy if exists "leitura publica" on mundo_sentimentos;
drop policy if exists "leitura publica" on mundo_historias;
drop policy if exists "leitura publica" on mundo_missoes;

create policy "leitura publica" on mundo_personagens for select using (true);
create policy "leitura publica" on mundo_sentimentos for select using (true);
create policy "leitura publica" on mundo_historias for select using (publicada);
create policy "leitura publica" on mundo_missoes for select using (publicada);

-- ---------- Conteúdo de EXEMPLO ----------

insert into mundo_personagens (id, nome, especie, emoji, cor, fala, ordem) values
  ('nina',  'Nina',  'a raposa curiosa',     '🦊', '#FDEDE4', 'Oi! Eu sou a Nina. Adoro descobrir o que a gente sente por dentro.', 1),
  ('bento', 'Bento', 'o urso que ruge baixinho', '🐻', '#F6D9CF', 'Quando fico bravo, eu respiro fundo como um urso bem grandão.', 2),
  ('lila',  'Lila',  'a tartaruga corajosa', '🐢', '#E7F0E4', 'Às vezes eu me escondo no casco. E tudo bem, depois eu saio de novo.', 3),
  ('tito',  'Tito',  'o polvo abraçador',    '🐙', '#EEE8FA', 'Tenho oito braços. Todos eles servem para abraçar.', 4)
on conflict (id) do nothing;

insert into mundo_sentimentos (id, nome, emoji, cor, personagem_id, mensagem, ordem) values
  ('feliz',     'Feliz',      '😊', '#F9D97A', 'nina',  'Que coisa boa! O que deixou você feliz hoje? Guarda esse sentimento no coração.', 1),
  ('triste',    'Triste',     '😢', '#9CC0E8', 'tito',  'Ficar triste acontece com todo mundo. Quer um abraço de oito braços? Contar para alguém ajuda.', 2),
  ('bravo',     'Bravo',      '😠', '#EE9A86', 'bento', 'Grrr! Ficar bravo é normal. Vamos respirar juntos antes de fazer qualquer coisa?', 3),
  ('com-medo',  'Com medo',   '😨', '#C3B3E8', 'lila',  'Medo é o jeito do corpo cuidar de você. Vamos procurar uma coragem pequenininha?', 4),
  ('calmo',     'Calmo',      '😌', '#A9CDA2', 'nina',  'Que gostoso estar calmo. Respira devagar e sente como o seu corpo está tranquilo.', 5)
on conflict (id) do nothing;

insert into mundo_historias (titulo, emoji, sentimento_id, personagem_id, paginas, pergunta_final, ordem) values
(
  'O dia em que o Bento ficou vermelho', '🐻', 'bravo', 'bento',
  '[
    {"emoji": "🐻🍯", "texto": "O Bento estava construindo a maior torre de blocos da floresta."},
    {"emoji": "💥🧱", "texto": "Mas o vento soprou forte... e a torre caiu! Todinha no chão."},
    {"emoji": "😠🔥", "texto": "O Bento ficou quente, vermelho, com vontade de chutar tudo. GRRR!"},
    {"emoji": "🌬️🎈", "texto": "Então ele lembrou: encheu a barriga de ar como um balão... e soltou bem devagar. Uma, duas, três vezes."},
    {"emoji": "🐻🧱✨", "texto": "O calor foi passando. O Bento pegou o primeiro bloco e começou uma torre nova. Ainda mais bonita."}
  ]'::jsonb,
  'E você, o que faz quando fica bravo? Onde no corpo você sente a raiva?', 1
),
(
  'Lila e o barulho no escuro', '🐢', 'com-medo', 'lila',
  '[
    {"emoji": "🐢🌙", "texto": "Era noite e a Lila já estava quase dormindo."},
    {"emoji": "🌳💨", "texto": "De repente: TOC, TOC, TOC! Um barulho estranho lá fora."},
    {"emoji": "🐢🫣", "texto": "A Lila se escondeu dentro do casco, com o coração batendo rápido."},
    {"emoji": "🔦👀", "texto": "Ela respirou fundo, pegou a lanterna e espiou só um pouquinho. Coragem pequena também é coragem!"},
    {"emoji": "🌳🍂😄", "texto": "Era só um galho batendo na janela! A Lila riu, fez carinho no casco e dormiu tranquila."}
  ]'::jsonb,
  'Tem alguma coisa que dá medo em você? O que ajuda você a se sentir seguro?', 2
),
(
  'O abraço de oito braços', '🐙', 'triste', 'tito',
  '[
    {"emoji": "🐙🏖️", "texto": "O Tito tinha um amigo especial: um peixinho chamado Bolha."},
    {"emoji": "🐟🌊", "texto": "Um dia, a família do Bolha foi morar em outro mar, bem longe."},
    {"emoji": "🐙💧", "texto": "O Tito ficou triste. Os oito braços ficaram molinhos, sem vontade de brincar."},
    {"emoji": "🐢🦊🐻", "texto": "Os amigos perceberam e chegaram perto. Ninguém mandou ele parar de ficar triste. Eles só ficaram junto."},
    {"emoji": "🐙💞", "texto": "O Tito deu um abraço de oito braços em todo mundo. A saudade continuou, mas agora ela era mais leve."}
  ]'::jsonb,
  'Você já sentiu saudade de alguém? Quem você gosta de abraçar quando está triste?', 3
);

insert into mundo_missoes (titulo, emoji, sentimento_id, descricao, passos, desenhar, ordem) values
(
  'Respiração do balão', '🎈', 'bravo', 'Para quando a raiva esquenta o corpo.',
  '["Sente de um jeito confortável", "Coloque a mão na barriga", "Encha a barriga de ar como um balão, contando 1, 2, 3, 4", "Solte o ar bem devagar, contando 1, 2, 3, 4", "Repita mais duas vezes"]'::jsonb,
  false, 1
),
(
  'Caixa da coragem', '📦', 'com-medo', 'Para transformar o medo em algo que dá para olhar.',
  '["Pense em uma coisa que dá medo", "Conte para um adulto que você gosta", "Escolha uma palavra de coragem (tipo: EU CONSIGO!)", "Desenhe o seu medo bem pequenininho"]'::jsonb,
  true, 2
),
(
  'Onde mora o sentimento?', '🗺️', 'triste', 'Para descobrir onde o sentimento aparece no corpo.',
  '["Feche os olhos um pouquinho", "Onde você sente esse sentimento? Na barriga, no peito, na garganta?", "Coloque a mão nesse lugar", "Respire devagar e faça um carinho ali"]'::jsonb,
  false, 3
),
(
  'Três coisas boas', '⭐', 'feliz', 'Para guardar os momentos bons do dia.',
  '["Pense em uma coisa boa que aconteceu hoje", "Pense em mais uma", "E mais uma!", "Conte as três para alguém da sua casa"]'::jsonb,
  false, 4
),
(
  'Desenhe como você está', '🎨', null, 'Nem sempre dá para falar. Desenhar também é contar.',
  '["Escolha uma cor que parece com o que você sente", "Desenhe o seu sentimento (pode ser rabisco!)", "Mostre para um adulto e conte o que desenhou"]'::jsonb,
  true, 5
);
