
-- Update cron jobs to use service_role key from vault

-- Update daily-telegram-forecast
SELECT cron.alter_job(
  1,
  command := $$
  SELECT net.http_post(
    url := 'https://vipkucckidwsurcgxedw.supabase.co/functions/v1/telegram-forecast',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'SUPABASE_SERVICE_ROLE_KEY' LIMIT 1)
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);

-- Update daily-generate-news
SELECT cron.alter_job(
  2,
  command := $$
  SELECT net.http_post(
    url := 'https://vipkucckidwsurcgxedw.supabase.co/functions/v1/generate-news',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'SUPABASE_SERVICE_ROLE_KEY' LIMIT 1)
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);
