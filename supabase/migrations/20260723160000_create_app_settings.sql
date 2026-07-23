-- Simple key/value store for site-wide toggles managed from the admin panel.
create table if not exists public.app_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.app_settings enable row level security;

-- only server routes (service role) read/write settings
drop policy if exists "Service role manages app settings" on public.app_settings;
create policy "Service role manages app settings"
on public.app_settings
for all
to service_role
using (true)
with check (true);

-- storm feeling notes moderation mode: 'moderation' (default, hold for review) or 'autopost'
insert into public.app_settings (key, value)
values ('storm_notes_mode', 'moderation')
on conflict (key) do nothing;

notify pgrst, 'reload schema';
