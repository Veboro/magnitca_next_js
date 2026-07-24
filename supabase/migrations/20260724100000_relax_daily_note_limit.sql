-- Allow up to 3 notes per anonymous user per Kyiv day (was exactly 1).
-- The old unique index enforced a single note; the API now enforces the count.
drop index if exists public.storm_feeling_notes_daily_user_idx;

-- Non-unique lookup index for the per-user/day count the API runs on submit.
create index if not exists storm_feeling_notes_daily_user_lookup_idx
on public.storm_feeling_notes (anonymous_id_hash, response_date);

notify pgrst, 'reload schema';
