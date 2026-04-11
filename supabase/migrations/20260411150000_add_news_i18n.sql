ALTER TABLE public.news
ADD COLUMN IF NOT EXISTS title_uk text,
ADD COLUMN IF NOT EXISTS slug_uk text,
ADD COLUMN IF NOT EXISTS content_uk text,
ADD COLUMN IF NOT EXISTS meta_title_uk text,
ADD COLUMN IF NOT EXISTS meta_description_uk text,
ADD COLUMN IF NOT EXISTS title_ru text,
ADD COLUMN IF NOT EXISTS slug_ru text,
ADD COLUMN IF NOT EXISTS content_ru text,
ADD COLUMN IF NOT EXISTS meta_title_ru text,
ADD COLUMN IF NOT EXISTS meta_description_ru text;

UPDATE public.news
SET
  title_uk = COALESCE(title_uk, title),
  slug_uk = COALESCE(slug_uk, slug),
  content_uk = COALESCE(content_uk, content),
  meta_title_uk = COALESCE(meta_title_uk, meta_title),
  meta_description_uk = COALESCE(meta_description_uk, meta_description);

CREATE UNIQUE INDEX IF NOT EXISTS idx_news_slug_uk_unique
ON public.news(slug_uk)
WHERE slug_uk IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_news_slug_ru_unique
ON public.news(slug_ru)
WHERE slug_ru IS NOT NULL;
