ALTER TABLE public.news
ADD COLUMN IF NOT EXISTS title_cs text,
ADD COLUMN IF NOT EXISTS slug_cs text,
ADD COLUMN IF NOT EXISTS content_cs text,
ADD COLUMN IF NOT EXISTS meta_title_cs text,
ADD COLUMN IF NOT EXISTS meta_description_cs text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_news_slug_cs_unique
ON public.news(slug_cs)
WHERE slug_cs IS NOT NULL;
