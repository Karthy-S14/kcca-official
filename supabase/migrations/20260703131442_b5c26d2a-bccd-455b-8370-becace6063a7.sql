
DROP POLICY IF EXISTS "anyone submits contact" ON public.contacts;
CREATE POLICY "anyone submits contact" ON public.contacts FOR INSERT WITH CHECK (
  name IS NOT NULL AND email IS NOT NULL AND message IS NOT NULL AND handled = false
);
