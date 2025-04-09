-- Create function to handle participant leaving
CREATE OR REPLACE FUNCTION public.handle_participant_leaving()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if there will be at least one participant remaining
    IF NOT EXISTS (
        SELECT 1 FROM public.challenge_participants
        WHERE challenge_id = OLD.challenge_id
        AND id != OLD.id
    ) THEN
        RAISE EXCEPTION 'Cannot leave challenge: at least one participant must remain';
    END IF;

    -- Delete participant's checks
    DELETE FROM public.checks
    WHERE challenge_id = OLD.challenge_id
    AND user_id = OLD.user_id;

    -- Delete participant's chat messages
    DELETE FROM public.challenge_chat
    WHERE challenge_id = OLD.challenge_id
    AND user_id = OLD.user_id;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to handle participant leaving
CREATE TRIGGER on_participant_leaving
BEFORE DELETE ON public.challenge_participants
FOR EACH ROW
EXECUTE FUNCTION public.handle_participant_leaving();

-- Create function to prevent challenge owner from leaving
CREATE OR REPLACE FUNCTION public.prevent_owner_leaving()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM public.challenges
        WHERE challenges.id = OLD.challenge_id
        AND challenges.owner_id = OLD.user_id
    ) THEN
        RAISE EXCEPTION 'Challenge owner cannot leave the challenge';
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to prevent owner from leaving
CREATE TRIGGER prevent_owner_leaving_trigger
BEFORE DELETE ON public.challenge_participants
FOR EACH ROW
EXECUTE FUNCTION public.prevent_owner_leaving();

-- Update the existing policy to prevent owner from leaving
DROP POLICY IF EXISTS "Users can leave challenges they joined" ON public.challenge_participants;
CREATE POLICY "Users can leave challenges they joined"
    ON public.challenge_participants
    FOR DELETE
    TO authenticated
    USING (
        user_id = auth.uid() AND
        NOT EXISTS (
            SELECT 1 FROM public.challenges
            WHERE challenges.id = challenge_id
            AND challenges.owner_id = auth.uid()
        )
    ); 