
-- Add image_url column to news
ALTER TABLE public.news ADD COLUMN image_url text;

-- Create storage bucket for news images
INSERT INTO storage.buckets (id, name, public) VALUES ('news-images', 'news-images', true);

-- Allow public read access
CREATE POLICY "Public read news images" ON storage.objects FOR SELECT USING (bucket_id = 'news-images');

-- Allow service role to upload (edge functions use service role key)
CREATE POLICY "Service role upload news images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'news-images');
