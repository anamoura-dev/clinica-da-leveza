-- Perfil 👤: dados de quem usa o app (login opcional com Google/Apple)
-- Rode no Supabase: painel → SQL Editor → New query → cole tudo → Run.
-- Segurança: cada pessoa só enxerga e altera os próprios dados (RLS).
-- Quando a conta é excluída, tudo dela é apagado junto (on delete cascade).

-- ---------- Perfil (1 por conta, criado sozinho no primeiro login) ----------
create table if not exists perfis (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  foto_url text,
  criado_em timestamptz not null default now()
);

-- ---------- Filhos: só o mínimo (apelido + ano de nascimento) ----------
create table if not exists filhos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  apelido text not null check (char_length(apelido) between 1 and 40),
  ano_nascimento int check (ano_nascimento between 2000 and 2100),
  criado_em timestamptz not null default now()
);
create index if not exists filhos_usuario on filhos(usuario_id);

-- ---------- Favoritos (café, história, situação do ManuaLeve) ----------
create table if not exists favoritos (
  usuario_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  tipo text not null check (tipo in ('cafe', 'historia', 'manualeve')),
  item_id text not null,
  titulo text,                         -- guardado para mostrar a lista sem outra consulta
  criado_em timestamptz not null default now(),
  primary key (usuario_id, tipo, item_id)
);

-- ---------- Progresso (missões do Espaço das Crianças, cenários dos Jogos) ----------
create table if not exists progresso (
  usuario_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  tipo text not null check (tipo in ('missao', 'cenario')),
  item_id text not null,
  criado_em timestamptz not null default now(),
  primary key (usuario_id, tipo, item_id)
);

-- ---------- Segurança: cada um só com o que é seu ----------
alter table perfis enable row level security;
alter table filhos enable row level security;
alter table favoritos enable row level security;
alter table progresso enable row level security;

drop policy if exists "dono" on perfis;
drop policy if exists "dono" on filhos;
drop policy if exists "dono" on favoritos;
drop policy if exists "dono" on progresso;

create policy "dono" on perfis for all to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "dono" on filhos for all to authenticated
  using ((select auth.uid()) = usuario_id) with check ((select auth.uid()) = usuario_id);
create policy "dono" on favoritos for all to authenticated
  using ((select auth.uid()) = usuario_id) with check ((select auth.uid()) = usuario_id);
create policy "dono" on progresso for all to authenticated
  using ((select auth.uid()) = usuario_id) with check ((select auth.uid()) = usuario_id);

-- ---------- Cria o perfil automaticamente no primeiro login ----------
create or replace function public.criar_perfil()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.perfis (id, nome, foto_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists ao_criar_usuario on auth.users;
create trigger ao_criar_usuario
  after insert on auth.users
  for each row execute function public.criar_perfil();
