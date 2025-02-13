-- Add description column to challenges table
alter table public.challenges
add column description text;

-- Make it nullable since existing challenges won't have descriptions
comment on column public.challenges.description is 'Optional description of the challenge'; 