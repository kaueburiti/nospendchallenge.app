-- Drop existing trigger first
drop trigger if exists ensure_date_within_challenge_range on public.checks;
drop function if exists check_date_within_challenge_range();

-- Recreate function with explicit date casting
create or replace function check_date_within_challenge_range()
returns trigger as $$
begin
    if exists (
        select 1
        from public.challenges
        where id = NEW.challenge_id
        and DATE(NEW.date) >= DATE(start_date)
        and DATE(NEW.date) <= DATE(end_date)
    ) then
        return NEW;
    else
        raise exception 'Check date must be within challenge date range';
    end if;
end;
$$ language plpgsql;

-- Recreate trigger
create trigger ensure_date_within_challenge_range
    before insert or update
    on public.checks
    for each row
    execute function check_date_within_challenge_range();