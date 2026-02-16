
-- Add credits column to profiles with default 5 for new users
ALTER TABLE public.profiles ADD COLUMN credits integer NOT NULL DEFAULT 5;

-- Update existing profiles to have 5 credits
UPDATE public.profiles SET credits = 5 WHERE credits = 0;
