create table if not exists public.city_weather_cache (
  cache_key text primary key,
  payload jsonb not null,
  fetched_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.city_weather_cache enable row level security;

drop policy if exists "Service role can manage city weather cache" on public.city_weather_cache;
create policy "Service role can manage city weather cache"
on public.city_weather_cache
for all
to service_role
using (true)
with check (true);

create or replace function public.set_city_weather_cache_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_city_weather_cache_updated_at on public.city_weather_cache;
create trigger set_city_weather_cache_updated_at
before update on public.city_weather_cache
for each row
execute function public.set_city_weather_cache_updated_at();
