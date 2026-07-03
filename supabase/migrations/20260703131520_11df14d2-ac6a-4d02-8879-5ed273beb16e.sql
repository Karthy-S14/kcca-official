
CREATE POLICY "public read kcca buckets" ON storage.objects FOR SELECT
  USING (bucket_id IN ('logos','gallery','players','downloads','certificates'));

CREATE POLICY "admin insert kcca buckets" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('logos','gallery','players','downloads','certificates') AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "admin update kcca buckets" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('logos','gallery','players','downloads','certificates') AND public.has_role(auth.uid(),'admin'))
  WITH CHECK (bucket_id IN ('logos','gallery','players','downloads','certificates') AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "admin delete kcca buckets" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN ('logos','gallery','players','downloads','certificates') AND public.has_role(auth.uid(),'admin'));
