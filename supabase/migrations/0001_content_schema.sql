-- JA Zambia website: content store
-- Run once in Supabase (SQL Editor → New query → paste → Run).
-- Creates the tables the admin area edits, the security rules,
-- and a public "media" bucket for photos and logos.

-- ─────────────────────────────────────────────────────────────
-- Team members allowed into the admin area
-- ─────────────────────────────────────────────────────────────
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;

-- True when the logged-in user is on the admin_users list.
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admin_users where user_id = (select auth.uid()));
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admin_users where user_id = (select auth.uid()) and role = 'admin');
$$;

-- Keeps updated_at current on every edit.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- Editable text blocks (home hero, milestone banner, about text,
-- contact details, donation details…). One row per block.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.settings enable row level security;

create table if not exists public.stats (
  id uuid primary key default gen_random_uuid(),
  value text not null,
  label text not null,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.stats enable row level security;

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  audience text not null default '',
  summary text not null default '',
  body text not null default '',
  accent text not null default 'teal' check (accent in ('teal', 'lime', 'aqua', 'azure', 'jade', 'yellow')),
  photo_url text,
  photo_alt text not null default '',
  sort_order int not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);
alter table public.programs enable row level security;

create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  excerpt text not null default '',
  body text not null default '',
  category text not null default 'News',
  photo_url text,
  photo_alt text not null default '',
  published_at timestamptz,          -- empty = draft; a future date = scheduled
  updated_at timestamptz not null default now()
);
alter table public.news_posts enable row level security;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  summary text not null default '',
  body text not null default '',
  location text not null default '',
  starts_at timestamptz not null,
  ends_at timestamptz,
  registration_url text,
  photo_url text,
  photo_alt text not null default '',
  published boolean not null default true,
  updated_at timestamptz not null default now()
);
alter table public.events enable row level security;

create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  bio text not null default '',
  photo_url text,
  person_group text not null default 'team' check (person_group in ('team', 'board', 'alumni')),
  sort_order int not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);
alter table public.people enable row level security;

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  website_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);
alter table public.partners enable row level security;

create table if not exists public.impact_stories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  quote text not null default '',
  person text not null default '',
  body text not null default '',
  photo_url text,
  photo_alt text not null default '',
  video_url text,                    -- YouTube link
  sort_order int not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);
alter table public.impact_stories enable row level security;

-- ─────────────────────────────────────────────────────────────
-- Form submissions (contact, volunteer, partnership)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  form_type text not null check (form_type in ('contact', 'volunteer', 'partner')),
  name text not null check (char_length(name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 320),
  phone text check (char_length(phone) <= 50),
  organisation text check (char_length(organisation) <= 200),
  message text not null default '' check (char_length(message) <= 5000),
  details jsonb not null default '{}'::jsonb,
  status text not null default 'new' check (status in ('new', 'handled')),
  created_at timestamptz not null default now()
);
alter table public.form_submissions enable row level security;

create index if not exists form_submissions_created_idx on public.form_submissions (created_at desc);
create index if not exists news_posts_published_idx on public.news_posts (published_at desc);
create index if not exists events_starts_idx on public.events (starts_at);

-- updated_at triggers
do $$
declare t text;
begin
  foreach t in array array['settings', 'stats', 'programs', 'news_posts', 'events', 'people', 'partners', 'impact_stories']
  loop
    execute format('drop trigger if exists touch_%1$s on public.%1$I', t);
    execute format('create trigger touch_%1$s before update on public.%1$I for each row execute function public.touch_updated_at()', t);
  end loop;
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- Security rules (Row Level Security)
--   • Visitors can read published content only.
--   • Visitors can send a form, but never read submissions.
--   • Logged-in team members on admin_users can edit everything.
-- ─────────────────────────────────────────────────────────────
-- (Row Level Security is switched on right after each table is created, above.)

-- admin_users: staff can see the list; only admins manage it
drop policy if exists "staff read admin list" on public.admin_users;
create policy "staff read admin list" on public.admin_users
  for select to authenticated using ((select public.is_staff()));
drop policy if exists "admins manage admin list" on public.admin_users;
create policy "admins manage admin list" on public.admin_users
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Public read rules
drop policy if exists "public read settings" on public.settings;
create policy "public read settings" on public.settings for select using (true);
drop policy if exists "public read stats" on public.stats;
create policy "public read stats" on public.stats for select using (true);
drop policy if exists "public read programs" on public.programs;
create policy "public read programs" on public.programs for select using (published or (select public.is_staff()));
drop policy if exists "public read news" on public.news_posts;
create policy "public read news" on public.news_posts
  for select using ((published_at is not null and published_at <= now()) or (select public.is_staff()));
drop policy if exists "public read events" on public.events;
create policy "public read events" on public.events for select using (published or (select public.is_staff()));
drop policy if exists "public read people" on public.people;
create policy "public read people" on public.people for select using (published or (select public.is_staff()));
drop policy if exists "public read partners" on public.partners;
create policy "public read partners" on public.partners for select using (published or (select public.is_staff()));
drop policy if exists "public read stories" on public.impact_stories;
create policy "public read stories" on public.impact_stories for select using (published or (select public.is_staff()));

-- Staff write rules (insert / update / delete)
do $$
declare t text;
begin
  foreach t in array array['settings', 'stats', 'programs', 'news_posts', 'events', 'people', 'partners', 'impact_stories']
  loop
    execute format('drop policy if exists "staff insert %1$s" on public.%1$I', t);
    execute format('create policy "staff insert %1$s" on public.%1$I for insert to authenticated with check ((select public.is_staff()))', t);
    execute format('drop policy if exists "staff update %1$s" on public.%1$I', t);
    execute format('create policy "staff update %1$s" on public.%1$I for update to authenticated using ((select public.is_staff())) with check ((select public.is_staff()))', t);
    execute format('drop policy if exists "staff delete %1$s" on public.%1$I', t);
    execute format('create policy "staff delete %1$s" on public.%1$I for delete to authenticated using ((select public.is_staff()))', t);
  end loop;
end;
$$;

-- Form submissions: anyone may submit a new one; only staff may read or update
drop policy if exists "anyone can submit a form" on public.form_submissions;
create policy "anyone can submit a form" on public.form_submissions
  for insert to anon, authenticated with check (status = 'new');
drop policy if exists "staff read submissions" on public.form_submissions;
create policy "staff read submissions" on public.form_submissions
  for select to authenticated using ((select public.is_staff()));
drop policy if exists "staff update submissions" on public.form_submissions;
create policy "staff update submissions" on public.form_submissions
  for update to authenticated using ((select public.is_staff())) with check ((select public.is_staff()));
drop policy if exists "admins delete submissions" on public.form_submissions;
create policy "admins delete submissions" on public.form_submissions
  for delete to authenticated using ((select public.is_admin()));

-- ─────────────────────────────────────────────────────────────
-- Photo & logo storage: public to view, staff to upload/change
-- ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/avif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "staff upload media" on storage.objects;
create policy "staff upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and (select public.is_staff()));
drop policy if exists "staff update media" on storage.objects;
create policy "staff update media" on storage.objects
  for update to authenticated using (bucket_id = 'media' and (select public.is_staff()));
drop policy if exists "staff delete media" on storage.objects;
create policy "staff delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and (select public.is_staff()));
drop policy if exists "staff list media" on storage.objects;
create policy "staff list media" on storage.objects
  for select to authenticated using (bucket_id = 'media' and (select public.is_staff()));
