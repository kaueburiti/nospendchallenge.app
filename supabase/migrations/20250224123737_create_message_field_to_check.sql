-- Add message column to checks table
alter table public.checks
add column message text;

-- Update RLS policies to include the new field
drop policy if exists "Users can insert their own checks" on public.checks;

create policy "Users can insert their own checks"
on public.checks for insert
to authenticated
with check (
    user_id = auth.uid() 
    and challenge_id in (
        select id 
        from public.challenges
        where owner_id = auth.uid()
    )
);