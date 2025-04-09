-- Fix the table name in handle_participant_leaving function
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
    DELETE FROM public.challenge_chat_messages
    WHERE challenge_id = OLD.challenge_id
    AND profile_id = OLD.user_id;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Add comment
COMMENT ON FUNCTION public.handle_participant_leaving IS 'Handles cleanup when a participant leaves a challenge, including deleting their checks and chat messages'; 