-- Store public meteosensitivity test submissions without requiring an auth user.
create table if not exists public.test_results (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  score integer not null check (score >= 0 and score <= 100),
  name text not null,
  age integer not null,
  gender text not null,
  has_chronic boolean not null default false,
  answers jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone not null default now()
);

alter table public.test_results enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'test_results'
      and policyname = 'Users can view their own results'
  ) then
    create policy "Users can view their own results"
    on public.test_results for select
    using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'test_results'
      and policyname = 'Users can insert their own results'
  ) then
    create policy "Users can insert their own results"
    on public.test_results for insert
    with check (auth.uid() = user_id);
  end if;
end $$;

alter table public.test_results
  alter column user_id drop not null;

alter table public.test_results
  add column if not exists locale text not null default 'uk'
    check (locale in ('uk', 'ru', 'pl', 'ro', 'hu')),
  add column if not exists physical_activity text,
  add column if not exists result_label text,
  add column if not exists ip_hash text,
  add column if not exists user_agent text;

create index if not exists idx_test_results_created_at on public.test_results(created_at desc);
create index if not exists idx_test_results_user_id on public.test_results(user_id);
create index if not exists idx_test_results_locale on public.test_results(locale);
create index if not exists idx_test_results_score on public.test_results(score);
