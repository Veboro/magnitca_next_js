create table if not exists public.daily_storm_feelings (
  id uuid primary key default gen_random_uuid(),
  response_date date not null,
  anonymous_id_hash text not null,
  locale text not null default 'uk',
  feels_storm boolean not null,
  kp_now numeric,
  kp_today_max numeric,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create unique index if not exists daily_storm_feelings_daily_user_idx
on public.daily_storm_feelings (response_date, anonymous_id_hash);

create index if not exists daily_storm_feelings_response_date_idx
on public.daily_storm_feelings (response_date desc);

create or replace view public.daily_storm_feeling_stats as
select
  response_date,
  count(*)::integer as total,
  count(*) filter (where feels_storm)::integer as yes,
  count(*) filter (where not feels_storm)::integer as no,
  case
    when count(*) > 0 then round((count(*) filter (where feels_storm))::numeric / count(*)::numeric * 100)::integer
    else 0
  end as yes_percent,
  case
    when count(*) > 0 then 100 - round((count(*) filter (where feels_storm))::numeric / count(*)::numeric * 100)::integer
    else 0
  end as no_percent,
  avg(kp_now) as avg_kp_now,
  max(kp_today_max) as max_kp_today
from public.daily_storm_feelings
group by response_date;

alter table public.daily_storm_feelings enable row level security;

drop policy if exists "Service role manages daily storm feelings" on public.daily_storm_feelings;
create policy "Service role manages daily storm feelings"
on public.daily_storm_feelings
for all
to service_role
using (true)
with check (true);

create or replace function public.touch_daily_storm_feelings_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists set_daily_storm_feelings_updated_at on public.daily_storm_feelings;
create trigger set_daily_storm_feelings_updated_at
before update on public.daily_storm_feelings
for each row
execute function public.touch_daily_storm_feelings_updated_at();
