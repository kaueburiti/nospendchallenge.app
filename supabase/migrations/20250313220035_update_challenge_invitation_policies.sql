-- Update challenge invitations policies to use JWT email
DROP POLICY IF EXISTS "Users can read their own invitations" ON public.challenge_invitations;
CREATE POLICY "Users can read their own invitations"
    ON public.challenge_invitations
    FOR SELECT
    TO authenticated
    USING (
        inviter_id = auth.uid() OR 
        invitee_email = auth.jwt()->>'email'
    );

DROP POLICY IF EXISTS "Users can update invitations they received" ON public.challenge_invitations;
CREATE POLICY "Users can update invitations they received"
    ON public.challenge_invitations
    FOR UPDATE
    TO authenticated
    USING (
        invitee_email = auth.jwt()->>'email'
    )
    WITH CHECK (
        invitee_email = auth.jwt()->>'email' AND
        (status = 'accepted' OR status = 'declined')
    );

-- Update challenge participants policy
DROP POLICY IF EXISTS "Users can join challenges they're invited to" ON public.challenge_participants;
CREATE POLICY "Users can join challenges they're invited to"
    ON public.challenge_participants
    FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id = auth.uid() AND
        (
            -- User is the owner of the challenge
            EXISTS (
                SELECT 1 FROM public.challenges 
                WHERE id = challenge_id AND owner_id = auth.uid()
            ) OR
            -- User has an accepted invitation
            EXISTS (
                SELECT 1 FROM public.challenge_invitations 
                WHERE challenge_id = challenge_participants.challenge_id 
                AND invitee_email = auth.jwt()->>'email'
                AND status = 'accepted'
            )
        )
    );