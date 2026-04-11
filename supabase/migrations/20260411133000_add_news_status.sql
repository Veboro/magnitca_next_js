ALTER TABLE public.news
ADD COLUMN IF NOT EXISTS status text;

UPDATE public.news
SET status = 'published'
WHERE status IS NULL;

ALTER TABLE public.news
ALTER COLUMN status SET DEFAULT 'draft';

ALTER TABLE public.news
ALTER COLUMN status SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'news_status_check'
  ) THEN
    ALTER TABLE public.news
    ADD CONSTRAINT news_status_check
    CHECK (status IN ('draft', 'published'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_news_status_published_at
ON public.news(status, published_at DESC);
