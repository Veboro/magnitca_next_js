
ALTER TABLE public.profiles ADD COLUMN credits_reset_at timestamp with time zone NOT NULL DEFAULT now();
ALTER TABLE public.profiles ADD COLUMN last_share_bonus_at timestamp with time zone;
