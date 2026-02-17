
-- 1. News table: add explicit INSERT/UPDATE/DELETE policies (defense-in-depth)
CREATE POLICY "Only service role can insert news"
ON public.news FOR INSERT
WITH CHECK (false);

CREATE POLICY "Only service role can update news"
ON public.news FOR UPDATE
USING (false);

CREATE POLICY "Only service role can delete news"
ON public.news FOR DELETE
USING (false);

-- 2. Credit system: server-side functions to prevent client manipulation

-- Function to reset daily credits (called by client, enforced server-side)
CREATE OR REPLACE FUNCTION public.reset_daily_credits()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_row RECORD;
BEGIN
  SELECT credits, credits_reset_at, last_share_bonus_at INTO profile_row
  FROM profiles WHERE user_id = auth.uid() FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Profile not found');
  END IF;

  -- Check if reset needed (new UTC day)
  IF profile_row.credits_reset_at::date = CURRENT_DATE THEN
    RETURN jsonb_build_object('credits', profile_row.credits, 'reset', false,
      'can_share', profile_row.last_share_bonus_at IS NULL OR profile_row.last_share_bonus_at::date < CURRENT_DATE);
  END IF;

  UPDATE profiles SET credits = 3, credits_reset_at = NOW()
  WHERE user_id = auth.uid();

  RETURN jsonb_build_object('credits', 3, 'reset', true,
    'can_share', profile_row.last_share_bonus_at IS NULL OR profile_row.last_share_bonus_at::date < CURRENT_DATE);
END;
$$;

GRANT EXECUTE ON FUNCTION public.reset_daily_credits() TO authenticated;

-- Function to claim share bonus (enforced server-side)
CREATE OR REPLACE FUNCTION public.claim_share_bonus()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_row RECORD;
  new_credits INTEGER;
BEGIN
  SELECT credits, last_share_bonus_at INTO profile_row
  FROM profiles WHERE user_id = auth.uid() FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Profile not found');
  END IF;

  IF profile_row.last_share_bonus_at IS NOT NULL
     AND profile_row.last_share_bonus_at::date = CURRENT_DATE THEN
    RETURN jsonb_build_object('error', 'Already claimed today');
  END IF;

  new_credits := profile_row.credits + 3;
  UPDATE profiles SET credits = new_credits, last_share_bonus_at = NOW()
  WHERE user_id = auth.uid();

  RETURN jsonb_build_object('credits', new_credits, 'success', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_share_bonus() TO authenticated;

-- 3. Restrict profiles UPDATE policy to prevent credit field manipulation
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update own non-credit fields"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Use a trigger to prevent direct credit manipulation
CREATE OR REPLACE FUNCTION public.protect_credit_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Allow SECURITY DEFINER functions to modify credits
  IF current_setting('role') = 'authenticated' THEN
    NEW.credits := OLD.credits;
    NEW.credits_reset_at := OLD.credits_reset_at;
    NEW.last_share_bonus_at := OLD.last_share_bonus_at;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER protect_profile_credits
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_credit_fields();
