
-- Allow admins to upload to news-images bucket
CREATE POLICY "Admins can upload news images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'news-images'
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow admins to delete news images
CREATE POLICY "Admins can delete news images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'news-images'
  AND public.has_role(auth.uid(), 'admin')
);
