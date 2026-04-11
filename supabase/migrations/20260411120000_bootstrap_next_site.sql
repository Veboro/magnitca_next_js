CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE IF NOT EXISTS public.news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE,
  content text NOT NULL,
  source text NOT NULL DEFAULT 'manual',
  image_url text,
  meta_title text,
  meta_description text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  telegram_sent boolean NOT NULL DEFAULT false,
  published_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_news_slug ON public.news(slug);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON public.news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_status_published_at ON public.news(status, published_at DESC);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read news" ON public.news;
CREATE POLICY "Anyone can read news"
  ON public.news
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Only service role can manage news" ON public.news;
CREATE POLICY "Only service role can manage news"
  ON public.news
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP TRIGGER IF EXISTS update_news_updated_at ON public.news;
CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.page_metadata (
  page_key text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.page_metadata ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Only service role can manage page metadata" ON public.page_metadata;
CREATE POLICY "Only service role can manage page metadata"
  ON public.page_metadata
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

INSERT INTO public.page_metadata (page_key, title, description)
VALUES
  ('home', 'Магнітка — магнітні бурі сьогодні, прогноз Kp індексу', 'Магнітка — моніторинг магнітних бур в реальному часі. Kp індекс, сонячний вітер, прогноз геомагнітної активності та вплив на здоров''я. Дані NOAA щохвилини.'),
  ('about', 'Про Магнітку', 'Український сервіс моніторингу магнітних бур, Kp-індексу та космічної погоди на основі даних NOAA.'),
  ('contacts', 'Контакти', 'Зв''язок із командою Магнітки: питання, зворотний зв''язок і повідомлення про помилки.'),
  ('privacy', 'Політика конфіденційності', 'Політика конфіденційності сервісу Магнітка: cookie, аналітика та використання зовнішніх джерел даних.'),
  ('faq', 'FAQ про магнітні бурі', 'Часті питання про магнітні бурі, Kp-індекс, шкалу G1-G5, вплив на самопочуття та техніку.'),
  ('kp_index', 'Kp індекс', 'Поточний Kp-індекс, шкала бурі G1-G5, графік та пояснення впливу геомагнітної активності.'),
  ('solar_wind', 'Сонячний вітер', 'Швидкість сонячного вітру, густина, IMF Bz та живий графік космічної погоди для відстеження магнітних бур.'),
  ('calendar', 'Календар магнітних бур', 'Календар магнітних бур на поточний місяць та найближчий прогноз геомагнітної активності.'),
  ('news', 'Новини магнітних бур', 'Щоденні новини та прогнози магнітних бур, Kp-індексу, сонячного вітру та космічної погоди.')
ON CONFLICT (page_key) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('news-images', 'news-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read news images" ON storage.objects;
CREATE POLICY "Public read news images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'news-images');

DROP POLICY IF EXISTS "Service role can manage news images" ON storage.objects;
CREATE POLICY "Service role can manage news images"
  ON storage.objects
  FOR ALL
  USING (bucket_id = 'news-images' AND auth.role() = 'service_role')
  WITH CHECK (bucket_id = 'news-images' AND auth.role() = 'service_role');
