ALTER TABLE public.news
ADD COLUMN IF NOT EXISTS title_bg text,
ADD COLUMN IF NOT EXISTS slug_bg text,
ADD COLUMN IF NOT EXISTS content_bg text,
ADD COLUMN IF NOT EXISTS meta_title_bg text,
ADD COLUMN IF NOT EXISTS meta_description_bg text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_news_slug_bg_unique
ON public.news(slug_bg)
WHERE slug_bg IS NOT NULL;
