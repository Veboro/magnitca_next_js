
CREATE OR REPLACE FUNCTION public.notify_new_user_telegram()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  bot_token text;
  chat_id text;
  message_text text;
  request_id bigint;
BEGIN
  SELECT decrypted_secret INTO bot_token FROM vault.decrypted_secrets WHERE name = 'TELEGRAM_BOT_TOKEN' LIMIT 1;
  SELECT decrypted_secret INTO chat_id FROM vault.decrypted_secrets WHERE name = 'TELEGRAM_CHAT_ID' LIMIT 1;

  message_text := '🆕 Новий користувач зареєструвався!' || chr(10) ||
    '👤 Ім''я: ' || COALESCE(NEW.display_name, 'Не вказано') || chr(10) ||
    '🕐 Час: ' || to_char(NEW.created_at AT TIME ZONE 'Europe/Kyiv', 'DD.MM.YYYY HH24:MI');

  SELECT net.http_post(
    url := 'https://api.telegram.org/bot' || bot_token || '/sendMessage',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := jsonb_build_object(
      'chat_id', chat_id,
      'text', message_text,
      'parse_mode', 'HTML'
    )
  ) INTO request_id;

  RETURN NEW;
END;
$function$;

CREATE TRIGGER on_new_user_notify_telegram
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.notify_new_user_telegram();
