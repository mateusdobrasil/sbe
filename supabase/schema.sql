-- ============================================================================
--  SBE — esquema do banco (Supabase / Postgres)
--
--  Como aplicar:
--    Supabase Studio → SQL Editor → cole este arquivo → Run.
--
--  Depois de aplicar e popular as tabelas, defina CONTENT_SOURCE=supabase
--  nas variáveis de ambiente da Vercel. Enquanto uma tabela estiver vazia,
--  o site continua lendo o conteúdo correspondente de /content — a migração
--  pode ser feita uma tabela por vez.
-- ============================================================================

-- ─── Conteúdo público (leitura liberada, escrita só pelo painel) ────────────

create table if not exists public.providers (
  slug         text primary key,
  name         text not null,
  specialties  text[] not null default '{}',
  district     text,
  address      text,
  phone        text,
  logo         text,
  discount     int check (discount between 0 and 100),
  featured     boolean not null default false,
  created_at   timestamptz not null default now()
);
comment on table public.providers is 'Clínicas, laboratórios e hospitais da rede credenciada.';

create table if not exists public.services (
  slug        text primary key,
  name        text not null,
  summary     text not null,
  description text not null default '',
  icon        text not null default 'heart',
  category    text not null default 'Saúde',
  price       text,
  how_to      text[] not null default '{}',
  sort_order  int not null default 0
);

create table if not exists public.impact_stats (
  id         bigint generated always as identity primary key,
  value      text not null,
  label      text not null,
  note       text,
  sort_order int not null default 0
);

create table if not exists public.leaders (
  id         bigint generated always as identity primary key,
  name       text not null,
  role       text not null,
  photo      text,
  term       text,
  sort_order int not null default 0
);

create table if not exists public.transparency_docs (
  id    bigint generated always as identity primary key,
  title text not null,
  year  int  not null,
  type  text not null,
  file  text not null,
  size  text
);

create table if not exists public.testimonials (
  id         bigint generated always as identity primary key,
  quote      text not null,
  author     text not null,
  role       text,
  sort_order int not null default 0
);

create table if not exists public.faq (
  id         bigint generated always as identity primary key,
  question   text not null,
  answer     text not null,
  sort_order int not null default 0
);

create table if not exists public.membership_plans (
  slug       text primary key,
  name       text not null,
  price      text not null,
  period     text not null default 'por mês',
  highlight  boolean not null default false,
  benefits   text[] not null default '{}',
  note       text,
  sort_order int not null default 0
);

create table if not exists public.posts (
  slug       text primary key,
  title      text not null,
  excerpt    text not null default '',
  content    text not null default '',
  date       date not null default current_date,
  category   text not null default 'Notícias',
  cover      text,
  author     text,
  published  boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists posts_published_date_idx
  on public.posts (published, date desc);

-- ─── Formulários (escrita pelo servidor, leitura só pela equipe) ────────────

create table if not exists public.leads (
  id         bigint generated always as identity primary key,
  kind       text not null check (kind in ('contato','voluntariado','associado','credenciamento')),
  name       text not null,
  email      text not null,
  phone      text not null,
  subject    text,
  message    text,
  handled    boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists leads_created_idx on public.leads (created_at desc);
comment on table public.leads is
  'Mensagens enviadas pelos formulários do site. Contém dado pessoal — tratar conforme a LGPD.';

-- ============================================================================
--  Row Level Security
-- ============================================================================

alter table public.providers         enable row level security;
alter table public.services          enable row level security;
alter table public.impact_stats      enable row level security;
alter table public.leaders           enable row level security;
alter table public.transparency_docs enable row level security;
alter table public.testimonials      enable row level security;
alter table public.faq               enable row level security;
alter table public.membership_plans  enable row level security;
alter table public.posts             enable row level security;
alter table public.leads             enable row level security;

-- Conteúdo institucional: qualquer visitante pode ler.
do $$
declare t text;
begin
  foreach t in array array[
    'providers','services','impact_stats','leaders',
    'transparency_docs','testimonials','faq','membership_plans'
  ]
  loop
    execute format('drop policy if exists "leitura publica" on public.%I', t);
    execute format(
      'create policy "leitura publica" on public.%I for select to anon, authenticated using (true)', t
    );
  end loop;
end $$;

-- Notícias: só as publicadas ficam visíveis ao público.
drop policy if exists "leitura publica de posts publicados" on public.posts;
create policy "leitura publica de posts publicados"
  on public.posts for select to anon, authenticated
  using (published = true);

-- Leads: ninguém lê pelo cliente. A gravação acontece na rota /api/contato,
-- com a service role key, que ignora RLS. Sem política de select, uma chave
-- anon vazada não expõe dado pessoal nenhum.
drop policy if exists "sem leitura publica de leads" on public.leads;

-- ============================================================================
--  Carga inicial mínima
--  O restante do conteúdo pode ser importado de /content via CSV no Studio.
-- ============================================================================

insert into public.faq (question, answer, sort_order) values
  ('Preciso ser associado para ser atendido?',
   'Não. A SBE atende associados e não associados. Os associados têm prioridade no agendamento e pagam valores menores, mas ninguém é recusado por não ser associado.', 1),
  ('A SBE é um plano de saúde?',
   'Não. A SBE é uma Organização da Sociedade Civil sem fins lucrativos que mantém um Programa de Parceria na Assistência à Saúde, com valores negociados junto a clínicas e laboratórios credenciados. Não se trata de plano de saúde regulado pela ANS.', 2),
  ('Existe carência?',
   'Não há carência para consultas e exames na rede credenciada. Você pode usar o benefício desde o primeiro mês.', 3)
on conflict do nothing;
