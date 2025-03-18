-- Make profiles and challenges storage buckets publicly accessible

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON storage.objects;
DROP POLICY IF EXISTS "Public challenges are viewable by everyone." ON storage.objects;

-- Create policies for public access to profiles and challenges buckets
CREATE POLICY "Public profiles are viewable by everyone."
ON storage.objects FOR SELECT
USING (bucket_id = 'profiles');

CREATE POLICY "Public challenges are viewable by everyone."
ON storage.objects FOR SELECT
USING (bucket_id = 'challenges');

-- Ensure the buckets exist (if they don't already)
INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('challenges', 'challenges', true)
ON CONFLICT (id) DO UPDATE SET public = true; 