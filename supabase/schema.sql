-- Safal Vidyalaya — Supabase schema
-- Run once in Supabase → SQL Editor → New query → paste → Run.

-- ========== Tables ==========
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  ref text,
  source text default 'website',           -- 'website' (admission form) | 'callback'
  student_name text,
  dob date,
  standard text,                           -- '1'..'12' or 'Std 11 — Science' from the callback form
  stream text,
  medium text,
  campus text,
  parent_name text not null,
  relation text,
  phone text not null,
  email text,
  docs jsonb default '{}'::jsonb,          -- { birth_certificate: 'storage/path', ... }
  status text not null default 'New' check (status in ('New','Called','Visit booked','Admitted','Closed'))
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  message text not null,
  handled boolean not null default false
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  subject text,
  phone text not null,
  email text not null,
  address text,
  experience text,
  qualification text,
  joining_date date,
  message text,
  resume_path text,
  status text not null default 'New'
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  tag text default 'Announcement',
  type text not null default 'photo' check (type in ('photo','video')),
  date date default current_date,
  image_url text,
  video_url text,
  body text,
  published boolean not null default true
);

-- ========== Row Level Security ==========
-- Visitors (anon) can only INSERT form submissions and READ published news.
-- Signed-in staff (authenticated) can read and update everything.
alter table public.enquiries   enable row level security;
alter table public.messages    enable row level security;
alter table public.applications enable row level security;
alter table public.news        enable row level security;

create policy "public can submit enquiries"     on public.enquiries    for insert to anon, authenticated with check (true);
create policy "public can submit messages"      on public.messages     for insert to anon, authenticated with check (true);
create policy "public can submit applications"  on public.applications for insert to anon, authenticated with check (true);
create policy "public can read published news"  on public.news         for select to anon using (published = true);

create policy "staff full access enquiries"    on public.enquiries    for all to authenticated using (true) with check (true);
create policy "staff full access messages"     on public.messages     for all to authenticated using (true) with check (true);
create policy "staff full access applications" on public.applications for all to authenticated using (true) with check (true);
create policy "staff full access news"         on public.news         for all to authenticated using (true) with check (true);

-- ========== Storage (uploads) ==========
insert into storage.buckets (id, name, public) values ('admission-docs', 'admission-docs', false) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('resumes', 'resumes', false) on conflict do nothing;

create policy "public can upload admission docs" on storage.objects for insert to anon, authenticated with check (bucket_id = 'admission-docs');
create policy "public can upload resumes"        on storage.objects for insert to anon, authenticated with check (bucket_id = 'resumes');
create policy "staff can read uploads"           on storage.objects for select to authenticated using (bucket_id in ('admission-docs', 'resumes'));

-- ========== Seed news ==========
insert into public.news (title, tag, type, date, body) values
  ('Admissions open for Session 2026–27 — English & Gujarati medium', 'Admissions', 'photo', '2026-10-01', 'Admissions are open for Std 1 to Std 10 and Std 11–12 (Arts, Commerce and Science streams) in both English and Gujarati medium.'),
  ('Spell Bee International — explore new heights', 'Competition', 'photo', '2026-09-10', 'Registrations are open for Spell Bee International.'),
  ('Cambridge English Language Assessment — YLE exams', 'Assessment', 'photo', '2026-08-28', 'Students can register for Cambridge Young Learners English exams.');

-- ========== Staff accounts ==========
-- Create staff logins in Supabase → Authentication → Users → "Add user" (email + password).
-- Then turn OFF public sign-ups: Authentication → Providers → Email → "Allow new users to sign up" = off.
