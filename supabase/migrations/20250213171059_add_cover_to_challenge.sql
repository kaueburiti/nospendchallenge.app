-- Add cover column to challenges table
alter table public.challenges
add column cover text;

-- Optional: Add storage policy if you're using Supabase Storage
create policy "Public read access to challenge covers"
on storage.objects for select
using ( bucket_id = 'challenges' );  -- Assuming you'll store covers in a 'challenges' bucket

create policy "Users can upload challenge covers"
on storage.objects for insert
to authenticated
with check (
    bucket_id = 'challenges' 
    and (storage.extension(name) = 'jpg' 
    or storage.extension(name) = 'png'
    or storage.extension(name) = 'jpeg')
);