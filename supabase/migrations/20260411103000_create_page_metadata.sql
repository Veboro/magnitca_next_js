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
