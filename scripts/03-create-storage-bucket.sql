-- Create a storage bucket for profile images
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile_images', 'profile_images', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS for the bucket
-- Allow authenticated users to insert their own profile images
CREATE POLICY "Allow authenticated users to upload their own profile images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'profile_images' AND auth.uid() = owner);

-- Allow authenticated users to view all profile images
CREATE POLICY "Allow authenticated users to view profile images" ON storage.objects
FOR SELECT USING (bucket_id = 'profile_images');

-- Allow authenticated users to update their own profile images
CREATE POLICY "Allow authenticated users to update their own profile images" ON storage.objects
FOR UPDATE USING (bucket_id = 'profile_images' AND auth.uid() = owner);

-- Allow authenticated users to delete their own profile images
CREATE POLICY "Allow authenticated users to delete their own profile images" ON storage.objects
FOR DELETE USING (bucket_id = 'profile_images' AND auth.uid() = owner);
