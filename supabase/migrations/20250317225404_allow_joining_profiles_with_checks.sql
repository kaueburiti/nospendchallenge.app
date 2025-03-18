-- Add a specific policy to allow joining profiles with checks
CREATE POLICY "Allow joining profiles with checks"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);