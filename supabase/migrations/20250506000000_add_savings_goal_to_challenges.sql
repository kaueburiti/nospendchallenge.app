-- Add savings_goal column to challenges table
ALTER TABLE public.challenges
ADD COLUMN savings_goal NUMERIC DEFAULT NULL;

-- Update policy for reading challenges
DROP POLICY IF EXISTS "Authenticated users can read all challenges" ON public.challenges;
CREATE POLICY "Authenticated users can read all challenges"
    ON public.challenges
    FOR SELECT
    TO authenticated
    USING (true);

-- Update policy for inserting challenges
DROP POLICY IF EXISTS "Users can insert their own challenges" ON public.challenges;
CREATE POLICY "Users can insert their own challenges"
    ON public.challenges
    FOR INSERT
    TO authenticated
    WITH CHECK (owner_id = auth.uid());

-- Update policy for updating challenges
DROP POLICY IF EXISTS "Users can update their own challenges" ON public.challenges;
CREATE POLICY "Users can update their own challenges"
    ON public.challenges
    FOR UPDATE
    TO authenticated
    USING (owner_id = auth.uid())
    WITH CHECK (owner_id = auth.uid()); 