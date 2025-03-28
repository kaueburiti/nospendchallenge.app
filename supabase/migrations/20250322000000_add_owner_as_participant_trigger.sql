-- Create trigger function to add owner as participant
CREATE OR REPLACE FUNCTION public.handle_new_challenge_owner()
RETURNS TRIGGER AS $$
BEGIN
    -- Add the owner as a participant
    INSERT INTO public.challenge_participants (
        challenge_id,
        user_id
    )
    VALUES (
        NEW.id,
        NEW.owner_id
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new challenges
CREATE TRIGGER on_challenge_created
AFTER INSERT ON public.challenges
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_challenge_owner();

-- Add comment
COMMENT ON FUNCTION public.handle_new_challenge_owner IS 'Automatically adds the challenge owner as a participant when a new challenge is created'; 