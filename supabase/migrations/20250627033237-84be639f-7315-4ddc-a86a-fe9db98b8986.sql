
-- Add a table to store extracted workflows from packages
CREATE TABLE public.extracted_workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id UUID REFERENCES public.agent_packages(id) ON DELETE CASCADE NOT NULL,
  workflow_name TEXT NOT NULL,
  workflow_data JSONB NOT NULL,
  template_id UUID REFERENCES public.agent_templates(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on extracted workflows
ALTER TABLE public.extracted_workflows ENABLE ROW LEVEL SECURITY;

-- Allow users to view workflows from their packages
CREATE POLICY "Users can view workflows from their packages" 
  ON public.extracted_workflows 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.agent_packages 
      WHERE id = package_id AND user_id = auth.uid()
    )
  );

-- Allow the processing system to insert workflows
CREATE POLICY "System can insert workflows" 
  ON public.extracted_workflows 
  FOR INSERT 
  WITH CHECK (true);

-- Allow the processing system to update workflows
CREATE POLICY "System can update workflows" 
  ON public.extracted_workflows 
  FOR UPDATE 
  USING (true);

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_extracted_workflows_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_extracted_workflows_updated_at
  BEFORE UPDATE ON public.extracted_workflows
  FOR EACH ROW
  EXECUTE FUNCTION update_extracted_workflows_updated_at();
