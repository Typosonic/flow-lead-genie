
-- Create tables for containerized infrastructure and multi-tenant support

-- User containers table for dedicated n8n instances
CREATE TABLE public.user_containers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  container_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'provisioning',
  region TEXT NOT NULL DEFAULT 'us-central1',
  container_url TEXT,
  resources JSONB DEFAULT '{"cpu": "1", "memory": "2Gi", "storage": "10Gi"}'::jsonb,
  deployed_at TIMESTAMP WITH TIME ZONE,
  last_deployed_at TIMESTAMP WITH TIME ZONE,
  last_restart_at TIMESTAMP WITH TIME ZONE,
  stopped_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User credentials table for secure API key storage
CREATE TABLE public.user_credentials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  encrypted_credentials TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, service_name)
);

-- Credential access logs for security auditing
CREATE TABLE public.credential_access_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  action TEXT NOT NULL,
  ip_address TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Container events for monitoring and debugging
CREATE TABLE public.container_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  container_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  workflow_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Deployment logs for tracking agent deployments
CREATE TABLE public.deployment_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.agent_templates(id) ON DELETE SET NULL,
  container_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  deployment_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable Row Level Security on all tables
ALTER TABLE public.user_containers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credential_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.container_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployment_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_containers
CREATE POLICY "Users can view their own containers" 
  ON public.user_containers 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own containers" 
  ON public.user_containers 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own containers" 
  ON public.user_containers 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own containers" 
  ON public.user_containers 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for user_credentials
CREATE POLICY "Users can view their own credentials" 
  ON public.user_credentials 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own credentials" 
  ON public.user_credentials 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own credentials" 
  ON public.user_credentials 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own credentials" 
  ON public.user_credentials 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for credential_access_logs
CREATE POLICY "Users can view their own credential logs" 
  ON public.credential_access_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Service can insert credential logs" 
  ON public.credential_access_logs 
  FOR INSERT 
  WITH CHECK (true);

-- RLS Policies for container_events
CREATE POLICY "Users can view their own container events" 
  ON public.container_events 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Service can insert container events" 
  ON public.container_events 
  FOR INSERT 
  WITH CHECK (true);

-- RLS Policies for deployment_logs
CREATE POLICY "Users can view their own deployment logs" 
  ON public.deployment_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Service can insert deployment logs" 
  ON public.deployment_logs 
  FOR INSERT 
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_user_containers_user_id ON public.user_containers(user_id);
CREATE INDEX idx_user_containers_status ON public.user_containers(status);
CREATE INDEX idx_user_credentials_user_service ON public.user_credentials(user_id, service_name);
CREATE INDEX idx_credential_logs_user_timestamp ON public.credential_access_logs(user_id, timestamp DESC);
CREATE INDEX idx_container_events_container_timestamp ON public.container_events(container_id, created_at DESC);
CREATE INDEX idx_deployment_logs_user_timestamp ON public.deployment_logs(user_id, deployment_time DESC);

-- Create updated_at trigger for user_containers
CREATE TRIGGER update_user_containers_updated_at
  BEFORE UPDATE ON public.user_containers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create updated_at trigger for user_credentials
CREATE TRIGGER update_user_credentials_updated_at
  BEFORE UPDATE ON public.user_credentials
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
