-- Create challenges table
CREATE TABLE public.challenges (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    owner_id uuid REFERENCES auth.users NOT NULL,
    title text NOT NULL,
    total_days integer NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow authenticated users to read all challenges
CREATE POLICY "Authenticated users can read all challenges"
    ON public.challenges
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to insert their own challenges
CREATE POLICY "Users can insert their own challenges"
    ON public.challenges
    FOR INSERT
    TO authenticated
    WITH CHECK (owner_id = auth.uid());

-- Allow authenticated users to update their own challenges
CREATE POLICY "Users can update their own challenges"
    ON public.challenges
    FOR UPDATE
    TO authenticated
    USING (owner_id = auth.uid())
    WITH CHECK (owner_id = auth.uid());

-- Allow authenticated users to delete their own challenges
CREATE POLICY "Users can delete their own challenges"
    ON public.challenges
    FOR DELETE
    TO authenticated
    USING (owner_id = auth.uid());

