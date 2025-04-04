-- Create challenge_activities table
CREATE TABLE public.challenge_activities (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    challenge_id bigint REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes for performance
CREATE INDEX challenge_activities_challenge_id_idx ON public.challenge_activities(challenge_id);
CREATE INDEX challenge_activities_user_id_idx ON public.challenge_activities(user_id);
CREATE INDEX challenge_activities_created_at_idx ON public.challenge_activities(created_at);

-- Enable Row Level Security
ALTER TABLE public.challenge_activities ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow authenticated users to read activities for challenges they participate in
CREATE POLICY "Users can view activities for their challenges"
    ON public.challenge_activities
    FOR SELECT
    TO authenticated
    USING (
        -- User is the challenge owner
        challenge_id IN (
            SELECT id FROM public.challenges WHERE owner_id = auth.uid()
        )
        OR
        -- User is a participant in the challenge
        challenge_id IN (
            SELECT challenge_id FROM public.challenge_participants WHERE user_id = auth.uid()
        )
    );

-- Create trigger function for new participants
CREATE OR REPLACE FUNCTION public.handle_new_challenge_participant()
RETURNS TRIGGER AS $$
DECLARE
    participant_name text;
    challenge_title text;
BEGIN
    -- Get participant name
    SELECT display_name INTO participant_name
    FROM public.profiles
    WHERE id = NEW.user_id;

    -- Get challenge title
    SELECT title INTO challenge_title
    FROM public.challenges
    WHERE id = NEW.challenge_id;

    -- Create activity
    INSERT INTO public.challenge_activities (
        challenge_id,
        user_id,
        title,
        description
    )
    VALUES (
        NEW.challenge_id,
        NEW.user_id,
        'New participant',
        participant_name || ' joined the challenge "' || challenge_title || '"'
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new participants
CREATE TRIGGER on_challenge_participant_created
AFTER INSERT ON public.challenge_participants
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_challenge_participant();

-- Create trigger function for new checks
CREATE OR REPLACE FUNCTION public.handle_new_check()
RETURNS TRIGGER AS $$
DECLARE
    participant_name text;
    challenge_title text;
    check_date_formatted text;
    activity_description text;
BEGIN
    -- Get participant name
    SELECT display_name INTO participant_name
    FROM public.profiles
    WHERE id = NEW.user_id;

    -- Get challenge title
    SELECT title INTO challenge_title
    FROM public.challenges
    WHERE id = NEW.challenge_id;
    
    -- Format date
    check_date_formatted := to_char(NEW.date, 'Month DD, YYYY');
    
    -- Create base description
    activity_description := participant_name || ' completed day for "' || challenge_title || '" on ' || check_date_formatted;
    
    -- Add message if present
    IF NEW.message IS NOT NULL AND NEW.message != '' THEN
        activity_description := activity_description || ' with message: "' || NEW.message || '"';
    END IF;

    -- Create activity
    INSERT INTO public.challenge_activities (
        challenge_id,
        user_id,
        title,
        description
    )
    VALUES (
        NEW.challenge_id,
        NEW.user_id,
        'Day completed',
        activity_description
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new checks
CREATE TRIGGER on_check_created
AFTER INSERT ON public.checks
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_check();

-- Add comments
COMMENT ON TABLE public.challenge_activities IS 'Table storing activities related to challenges';
COMMENT ON COLUMN public.challenge_activities.challenge_id IS 'References the challenge this activity belongs to';
COMMENT ON COLUMN public.challenge_activities.user_id IS 'References the user who performed the activity';
COMMENT ON COLUMN public.challenge_activities.title IS 'Short title of the activity';
COMMENT ON COLUMN public.challenge_activities.description IS 'Detailed description of the activity'; 