-- Create wishlists storage bucket
insert into storage.buckets (id, name, public)
values ('wishlists', 'wishlists', true)
on conflict (id) do update set public = true;

-- Public can view wishlist images
create policy "Public wishlists are viewable by everyone."
on storage.objects for select
using (bucket_id = 'wishlists');

-- Authenticated users can upload wishlist images
create policy "Users can upload wishlist images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'wishlists'
  and (storage.extension(name) = 'jpg'
    or storage.extension(name) = 'png'
    or storage.extension(name) = 'jpeg'
    or storage.extension(name) = 'webp')
  and length(name) < 100
);

-- Authenticated users can update their own wishlist images
create policy "Users can update their own wishlist images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'wishlists'
)
with check (
  bucket_id = 'wishlists'
);

-- Authenticated users can delete their own wishlist images
create policy "Users can delete their own wishlist images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'wishlists'
);

-- Prevent path traversal attacks for wishlists
create policy "Path traversal prevention for wishlists"
on storage.objects for all
to authenticated
using (
  bucket_id = 'wishlists' and not (name like '%..%')
); 