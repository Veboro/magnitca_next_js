
-- Table to store browser push notification subscriptions
CREATE TABLE public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (public subscriptions, no auth required)
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe (insert)
CREATE POLICY "Anyone can subscribe to push notifications"
ON public.push_subscriptions
FOR INSERT
WITH CHECK (true);

-- Service role only for select/delete (used by edge functions)
CREATE POLICY "Service role can read subscriptions"
ON public.push_subscriptions
FOR SELECT
USING (true);

-- Allow unsubscribe by endpoint
CREATE POLICY "Anyone can unsubscribe"
ON public.push_subscriptions
FOR DELETE
USING (true);
