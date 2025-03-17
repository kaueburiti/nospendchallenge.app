-- Drop existing policy
drop policy if exists "Users can insert their own checks" on public.checks;

-- Create new policy that allows both owners and participants to create checks
create policy "Users can insert checks for owned or participating challenges"
on public.checks for insert
to authenticated
with check (
    user_id = auth.uid() 
    and (
        -- User is the challenge owner
        challenge_id in (
            select id 
            from public.challenges
            where owner_id = auth.uid()
        )
        OR
        -- User is a participant in the challenge
        challenge_id in (
            select challenge_id
            from public.challenge_participants
            where user_id = auth.uid()
        )
    )
);