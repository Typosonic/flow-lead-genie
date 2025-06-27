
-- Create a table for uploaded agent packages
CREATE TABLE public.agent_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  agent_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'processing',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.agent_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own packages" 
  ON public.agent_packages 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own packages" 
  ON public.agent_packages 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own packages" 
  ON public.agent_packages 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own packages" 
  ON public.agent_packages 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create storage bucket for agent packages
INSERT INTO storage.buckets (id, name, public) 
VALUES ('agent-packages', 'agent-packages', false);

-- Create storage policies
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
