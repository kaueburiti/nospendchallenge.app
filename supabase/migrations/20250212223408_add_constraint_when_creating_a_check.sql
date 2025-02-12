-- Create validation function
create or replace function check_date_within_challenge_range()
returns trigger as $$
begin
    if exists (
        select 1
        from public.challenges
        where id = NEW.challenge_id
        and NEW.date >= start_date
        and NEW.date <= end_date
    ) then
        return NEW;
    else
        raise exception 'Check date must be within challenge date range';
    end if;
end;
$$ language plpgsql;

-- Create trigger
create trigger ensure_date_within_challenge_range
    before insert or update
    on public.checks
    for each row
    execute function check_date_within_challenge_range();

-- Drop existing policy before creating new one
drop policy if exists "Users can insert their own checks" on public.checks;

-- Create new policy
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