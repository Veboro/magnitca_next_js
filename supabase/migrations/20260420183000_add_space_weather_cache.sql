CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE TABLE IF NOT EXISTS public.space_weather_cache (
  cache_key text PRIMARY KEY,
  payload jsonb NOT NULL,
  source text NOT NULL DEFAULT 'noaa',
  fetched_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.space_weather_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role manages space weather cache" ON public.space_weather_cache;
CREATE POLICY "Service role manages space weather cache"
ON public.space_weather_cache
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.touch_space_weather_cache_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_space_weather_cache_updated_at ON public.space_weather_cache;
CREATE TRIGGER set_space_weather_cache_updated_at
BEFORE UPDATE ON public.space_weather_cache
FOR EACH ROW
EXECUTE FUNCTION public.touch_space_weather_cache_updated_at();

DO $$
DECLARE
  existing_job_id bigint;
BEGIN
  SELECT jobid
  INTO existing_job_id
  FROM cron.job
  WHERE jobname = 'refresh-space-weather-cache';

  IF existing_job_id IS NOT NULL THEN
    PERFORM cron.unschedule(existing_job_id);
  END IF;
END $$;

SELECT cron.schedule(
  'refresh-space-weather-cache',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://xdysdmtwhhnkvdbaaflm.supabase.co/functions/v1/refresh-space-weather',
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);
