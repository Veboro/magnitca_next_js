-- Force Supabase/PostgREST to refresh the schema cache after adding news locale columns.
select pg_notify('pgrst', 'reload schema');
