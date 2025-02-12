-- Create enum for day status
create type day_status as enum ('not_started', 'completed', 'failed', 'skipped');

-- Create days table
create table public.days (
    id bigint generated by default as identity primary key,
    challenge_id bigint not null references public.challenges(id) on delete cascade,
    status day_status not null default 'not_started',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policy
alter table public.days enable row level security;

-- Allow authenticated users to read days
create policy "Users can read days"
on public.days for select
to authenticated
using (true);

-- Allow authenticated users to insert their own days
create policy "Users can insert days for their challenges"
on public.days for insert
to authenticated
with check (
    challenge_id in (
        select id from public.challenges
        where owner_id = auth.uid()
    )
);

-- Allow authenticated users to update their own days
create policy "Users can update days for their challenges"
on public.days for update
to authenticated
using (
    challenge_id in (
        select id from public.challenges
        where owner_id = auth.uid()
    )
);