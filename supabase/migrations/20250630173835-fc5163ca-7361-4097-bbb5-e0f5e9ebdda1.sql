
-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Users can view workflows from their packages" ON public.extracted_workflows;
DROP POLICY IF EXISTS "System can insert workflows" ON public.extracted_workflows;
DROP POLICY IF EXISTS "System can update workflows" ON public.extracted_workflows;
DROP POLICY IF EXISTS "Users can view their own packages" ON public.agent_packages;
DROP POLICY IF EXISTS "Users can create their own packages" ON public.agent_packages;
DROP POLICY IF EXISTS "Users can update their own packages" ON public.agent_packages;
DROP POLICY IF EXISTS "Users can delete their own packages" ON public.agent_packages;
DROP POLICY IF EXISTS "Users can upload their own packages" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own packages" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own packages" ON storage.objects;

-- Enable RLS on tables that don't have it yet
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitor_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies for all tables

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Agents policies
CREATE POLICY "Users can view own agents" ON public.agents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own agents" ON public.agents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own agents" ON public.agents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own agents" ON public.agents
  FOR DELETE USING (auth.uid() = user_id);

-- Agent templates policies (public read, authenticated write)
CREATE POLICY "Anyone can view public templates" ON public.agent_templates
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create templates" ON public.agent_templates
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own templates" ON public.agent_templates
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own templates" ON public.agent_templates
  FOR DELETE USING (auth.uid() = created_by);

-- Agent packages policies (replace existing ones)
CREATE POLICY "Users can view own agent packages" ON public.agent_packages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own agent packages" ON public.agent_packages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own agent packages" ON public.agent_packages
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own agent packages" ON public.agent_packages
  FOR DELETE USING (auth.uid() = user_id);

-- Leads policies
CREATE POLICY "Users can view own leads" ON public.leads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own leads" ON public.leads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leads" ON public.leads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own leads" ON public.leads
  FOR DELETE USING (auth.uid() = user_id);

-- Communications policies
CREATE POLICY "Users can view own communications" ON public.communications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own communications" ON public.communications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own communications" ON public.communications
  FOR UPDATE USING (auth.uid() = user_id);

-- Integrations policies
CREATE POLICY "Users can view own integrations" ON public.integrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own integrations" ON public.integrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own integrations" ON public.integrations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own integrations" ON public.integrations
  FOR DELETE USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Usage tracking policies
CREATE POLICY "Users can view own usage" ON public.usage_tracking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert usage tracking" ON public.usage_tracking
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Competitor analysis policies
CREATE POLICY "Users can view own competitor analysis" ON public.competitor_analysis
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own competitor analysis" ON public.competitor_analysis
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own competitor analysis" ON public.competitor_analysis
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own competitor analysis" ON public.competitor_analysis
  FOR DELETE USING (auth.uid() = user_id);

-- Extracted workflows policies (replace existing ones)
CREATE POLICY "Users can view own extracted workflows" ON public.extracted_workflows
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.agent_packages 
    WHERE id = package_id AND user_id = auth.uid()
  ));

CREATE POLICY "System can insert extracted workflows" ON public.extracted_workflows
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.agent_packages 
    WHERE id = package_id AND user_id = auth.uid()
  ));

CREATE POLICY "System can update extracted workflows" ON public.extracted_workflows
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.agent_packages 
    WHERE id = package_id AND user_id = auth.uid()
  ));
