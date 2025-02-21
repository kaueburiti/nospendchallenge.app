-- Drop total_days column from challenges table since it can be calculated from start_date and end_date
alter table public.challenges
drop column total_days;

-- Add a function to calculate total days if needed
create or replace function public.get_challenge_total_days(challenge_row challenges)
returns integer
language sql
stable
as $$
  select date(challenge_row.end_date) - date(challenge_row.start_date) + 1;
$$;