-- Manual bucket creation (run this as service_role or in Supabase dashboard)
-- Go to Storage in Supabase Dashboard and create bucket manually with these settings:

-- Bucket name: documents
-- Public: true
-- File size limit: 10485760 (10MB)
-- Allowed MIME types: image/jpeg, image/png, image/gif, application/pdf

-- Then run these policies:
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'documents' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can delete their files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documents' AND 
    auth.role() = 'authenticated'
  );
