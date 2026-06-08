ALTER TABLE public.news
ADD COLUMN IF NOT EXISTS title_pl text,
ADD COLUMN IF NOT EXISTS slug_pl text,
ADD COLUMN IF NOT EXISTS content_pl text,
ADD COLUMN IF NOT EXISTS meta_title_pl text,
ADD COLUMN IF NOT EXISTS meta_description_pl text,
ADD COLUMN IF NOT EXISTS title_ro text,
ADD COLUMN IF NOT EXISTS slug_ro text,
ADD COLUMN IF NOT EXISTS content_ro text,
ADD COLUMN IF NOT EXISTS meta_title_ro text,
ADD COLUMN IF NOT EXISTS meta_description_ro text,
ADD COLUMN IF NOT EXISTS title_hu text,
ADD COLUMN IF NOT EXISTS slug_hu text,
ADD COLUMN IF NOT EXISTS content_hu text,
ADD COLUMN IF NOT EXISTS meta_title_hu text,
ADD COLUMN IF NOT EXISTS meta_description_hu text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_news_slug_pl_unique
ON public.news(slug_pl)
WHERE slug_pl IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_news_slug_ro_unique
ON public.news(slug_ro)
WHERE slug_ro IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_news_slug_hu_unique
ON public.news(slug_hu)
WHERE slug_hu IS NOT NULL;
