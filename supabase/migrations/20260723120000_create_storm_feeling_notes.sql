create table if not exists public.storm_feeling_notes (
  id uuid primary key default gen_random_uuid(),
  response_date date not null,
  anonymous_id_hash text not null,
  locale text not null default 'uk',
  feeling_score smallint not null,
  body text not null,
  display_name text,
  age smallint,
  gender text,
  kp_now numeric,
  status text not null default 'pending',
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  constraint storm_feeling_notes_feeling_score_range check (feeling_score between -3 and 3),
  constraint storm_feeling_notes_body_len check (char_length(btrim(body)) between 3 and 280),
  constraint storm_feeling_notes_display_name_len check (display_name is null or char_length(display_name) <= 60),
  constraint storm_feeling_notes_age_range check (age is null or age between 1 and 120),
  constraint storm_feeling_notes_gender_check check (gender is null or gender in ('female', 'male', 'other')),
  constraint storm_feeling_notes_status_check check (status in ('pending', 'approved', 'rejected'))
);

-- one note per anonymous user per Kyiv day (upsert overwrites their own)
create unique index if not exists storm_feeling_notes_daily_user_idx
on public.storm_feeling_notes (response_date, anonymous_id_hash);

-- fast public feed query (approved, newest first)
create index if not exists storm_feeling_notes_feed_idx
on public.storm_feeling_notes (status, response_date desc, created_at desc);

alter table public.storm_feeling_notes enable row level security;

-- clients never touch this table directly; only the service role (server routes) writes/reads.
drop policy if exists "Service role manages storm feeling notes" on public.storm_feeling_notes;
create policy "Service role manages storm feeling notes"
on public.storm_feeling_notes
for all
to service_role
using (true)
with check (true);

create or replace function public.touch_storm_feeling_notes_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists set_storm_feeling_notes_updated_at on public.storm_feeling_notes;
create trigger set_storm_feeling_notes_updated_at
before update on public.storm_feeling_notes
for each row
execute function public.touch_storm_feeling_notes_updated_at();

notify pgrst, 'reload schema';
