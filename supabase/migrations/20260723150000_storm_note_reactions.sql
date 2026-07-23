-- "I feel the same" reactions (thumbs-up only) for storm feeling notes.

alter table public.storm_feeling_notes
  add column if not exists helpful_count integer not null default 0;

create table if not exists public.storm_note_reactions (
  id uuid primary key default gen_random_uuid(),
  note_id uuid not null references public.storm_feeling_notes (id) on delete cascade,
  anonymous_id_hash text not null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

-- one reaction per anonymous user per note
create unique index if not exists storm_note_reactions_unique_idx
on public.storm_note_reactions (note_id, anonymous_id_hash);

alter table public.storm_note_reactions enable row level security;

drop policy if exists "Service role manages storm note reactions" on public.storm_note_reactions;
create policy "Service role manages storm note reactions"
on public.storm_note_reactions
for all
to service_role
using (true)
with check (true);

-- Atomically record a reaction and return the fresh count.
-- Returns the current helpful_count; increments only on the first vote from a hash.
create or replace function public.react_to_storm_note(p_note_id uuid, p_hash text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rows integer := 0;
  v_count integer;
begin
  insert into public.storm_note_reactions (note_id, anonymous_id_hash)
  values (p_note_id, p_hash)
  on conflict (note_id, anonymous_id_hash) do nothing;

  get diagnostics v_rows = row_count;

  if v_rows > 0 then
    update public.storm_feeling_notes
      set helpful_count = helpful_count + 1
      where id = p_note_id
      returning helpful_count into v_count;
  else
    select helpful_count into v_count
      from public.storm_feeling_notes
      where id = p_note_id;
  end if;

  return coalesce(v_count, 0);
end;
$$;

notify pgrst, 'reload schema';
