-- Create storage buckets
insert into storage.buckets (id, name, public)
values 
  ('profiles', 'profiles', false),
  ('challenges', 'challenges', false);

-- Enable RLS on storage.objects
alter table storage.objects enable row level security;

-- Profiles bucket policies
create policy "Authenticated users can view profile images"
on storage.objects for select
to authenticated
using (
  bucket_id = 'profiles'
);

create policy "Users can upload their own profile images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'profiles'
  and (storage.extension(name) = 'jpg' 
    or storage.extension(name) = 'png'
    or storage.extension(name) = 'jpeg'
    or storage.extension(name) = 'webp')
  and length(name) < 100
);

create policy "Users can update their own profile images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'profiles'
)
with check (
  bucket_id = 'profiles'
);

create policy "Users can delete their own profile images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'profiles'
);

-- Challenges bucket policies
create policy "Authenticated users can view challenge images"
on storage.objects for select
to authenticated
using (
  bucket_id = 'challenges'
);

create policy "Users can upload challenge images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'challenges'
  and (storage.extension(name) = 'jpg' 
    or storage.extension(name) = 'png'
    or storage.extension(name) = 'jpeg'
    or storage.extension(name) = 'webp')
  and length(name) < 100
);

create policy "Users can update their own challenge images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'challenges'
)
with check (
  bucket_id = 'challenges'
);

create policy "Users can delete their own challenge images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'challenges'
);

-- Prevent path traversal attacks
create policy "Path traversal prevention"
on storage.objects for all
to authenticated
using (
  not (name like '%..%')
);