CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

DO $$
DECLARE
  telegram_job_id bigint;
  site_news_job_id bigint;
BEGIN
  SELECT jobid
  INTO telegram_job_id
  FROM cron.job
  WHERE jobname = 'daily-telegram-forecast';

  IF telegram_job_id IS NOT NULL THEN
    PERFORM cron.unschedule(telegram_job_id);
  END IF;

  SELECT jobid
  INTO site_news_job_id
  FROM cron.job
  WHERE jobname = 'daily-site-news';

  IF site_news_job_id IS NOT NULL THEN
    PERFORM cron.unschedule(site_news_job_id);
  END IF;
END $$;

SELECT cron.schedule(
  'daily-telegram-forecast',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://xdysdmtwhhnkvdbaaflm.supabase.co/functions/v1/telegram-forecast',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (
        SELECT decrypted_secret
        FROM vault.decrypted_secrets
        WHERE name = 'SUPABASE_SERVICE_ROLE_KEY'
        LIMIT 1
      )
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);

SELECT cron.schedule(
  'daily-site-news',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://xdysdmtwhhnkvdbaaflm.supabase.co/functions/v1/generate-news',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (
        SELECT decrypted_secret
        FROM vault.decrypted_secrets
        WHERE name = 'SUPABASE_SERVICE_ROLE_KEY'
        LIMIT 1
      )
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);
