
-- Create storage bucket for agent packages if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('agent-packages', 'agent-packages', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for agent packages
DROP POLICY IF EXISTS "Users can upload their own packages" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own packages" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own packages" ON storage.objects;

CREATE POLICY "Users can upload their own packages" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'agent-packages' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own packages" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'agent-packages' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own packages" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'agent-packages' AND auth.uid()::text = (storage.foldername(name))[1]);
