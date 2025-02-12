-- Create function to generate days
create or replace function public.generate_challenge_days()
returns trigger
language plpgsql
security definer
as $$
declare
    day_date date;
begin
    -- Loop through each date in the range
    day_date := date(NEW.start_date);
    while day_date <= date(NEW.end_date) loop
        insert into public.days (challenge_id, created_at)
        values (NEW.id, day_date);
        
        day_date := day_date + interval '1 day';
    end loop;
    
    return NEW;
end;
$$;

-- Create trigger
create trigger on_challenge_created
    after insert
    on public.challenges
    for each row
    execute function public.generate_challenge_days();