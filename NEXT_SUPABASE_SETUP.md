# Next.js Supabase Split

This project can now use a dedicated Supabase project for the new Next.js site while keeping the old Vite site on the existing one.

If you are creating a completely new database for the new site, that is the preferred setup.

## New Next.js env vars

Add these to `.env` for the new site:

```env
NEXT_PUBLIC_APP_SUPABASE_URL=https://YOUR-NEW-PROJECT.supabase.co
NEXT_PUBLIC_APP_SUPABASE_PUBLISHABLE_KEY=YOUR-NEW-PUBLISHABLE-KEY
APP_SUPABASE_URL=https://YOUR-NEW-PROJECT.supabase.co
APP_SUPABASE_PUBLISHABLE_KEY=YOUR-NEW-PUBLISHABLE-KEY
APP_SUPABASE_SERVICE_ROLE_KEY=YOUR-NEW-SERVICE-ROLE-KEY
```

## Old Vite env vars

Leave the old site on the existing project:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_SUPABASE_PROJECT_ID=...
SUPABASE_URL=...
SUPABASE_PUBLISHABLE_KEY=...
```

## Effect

- Next.js app prefers the `APP` / `NEXT_PUBLIC_APP` variables.
- Old Vite app can continue using `VITE_*`.
- This allows both versions of the site to coexist against different Supabase projects.

## Important

For a brand new Supabase project, apply the clean bootstrap migration:

- `/Users/slaxor/Documents/development/magnetic-storm-hub/supabase/migrations/20260411120000_bootstrap_next_site.sql`

This creates only the schema the new Next.js site currently needs:

- `news`
- `page_metadata`
- storage bucket `news-images`

It intentionally does not create old legacy tables like:

- `profiles`
- `test_results`
- `user_notifications`
- `user_roles`

The current Next.js admin panel works with server-side auth cookies, so you do not need Supabase Auth or role tables for the new site admin.

You can keep the old Vite site pointed at the old Supabase project and the new Next.js site pointed at the new one.
