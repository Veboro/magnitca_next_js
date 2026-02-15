
-- Add slug column
ALTER TABLE public.news ADD COLUMN slug text UNIQUE;

-- Create index for fast slug lookups
CREATE INDEX idx_news_slug ON public.news(slug);
