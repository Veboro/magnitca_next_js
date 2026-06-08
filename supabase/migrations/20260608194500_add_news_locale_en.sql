alter table public.news
  add column if not exists title_en text,
  add column if not exists slug_en text,
  add column if not exists content_en text,
  add column if not exists meta_title_en text,
  add column if not exists meta_description_en text;

create unique index if not exists news_slug_en_unique
  on public.news (slug_en)
  where slug_en is not null;

notify pgrst, 'reload schema';
