
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'

interface DeploymentRequest {
  agentId: string
  templateId?: string
  workflowData?: any
  credentials?: Record<string, string>
}

export const useDeploymentOrchestrator = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const deployAgent = useMutation({
    mutationFn: async ({ agentId, templateId, workflowData, credentials }: DeploymentRequest) => {
      if (!user) throw new Error('User not authenticated')

      // First, ensure user has a container
      const { data: containerData } = await supabase.functions.invoke('container-manager', {
        body: { action: 'status', workflowId: '' }
      })

      if (!containerData.container || containerData.container.status !== 'running') {
        // Deploy container first
        await supabase.functions.invoke('container-manager', {
          body: { 
            action: 'deploy', 
            workflowId: agentId,
            credentials 
          }
        })
      }

      // Log deployment in deployment_logs table
      const { data, error } = await supabase
        .from('deployment_logs')
        .insert({
          user_id: user.id,
          agent_id: agentId,
          template_id: templateId,
          container_id: containerData.container?.container_id || `temp-${Date.now()}`,
          status: 'deploying',
          metadata: {
            workflow_data: workflowData,
            timestamp: new Date().toISOString()
          }
        })
        .select()
        .single()

      if (error) throw error

      // Update agent status to active
      await supabase
        .from('agents')
        .update({ status: 'active' })
        .eq('id', agentId)

      return data
    },
    onSuccess: () => {
      toast({
        title: "Agent Deployment Started",
        description: "Your agent is being deployed to your dedicated container.",
      })
      queryClient.invalidateQueries({ queryKey: ['agents'] })
      queryClient.invalidateQueries({ queryKey: ['deployment-logs'] })
      queryClient.invalidateQueries({ queryKey: ['container-status'] })
    },
    onError: (error: any) => {
      toast({
        title: "Deployment Failed",
        description: error.message || "Failed to deploy agent",
        variant: "destructive",
      })
    }
  })

  const deploymentLogs = useQuery({
    queryKey: ['deployment-logs', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('deployment_logs')
        .select(`
          *,
          agents (name),
          agent_templates (name)
        `)
        .eq('user_id', user.id)
        .order('deployment_time', { ascending: false })
        .limit(10)

      if (error) throw error
      return data
    },
    enabled: !!user
  })

  return {
    deployAgent,
    deploymentLogs,
    isDeploying: deployAgent.isPending
  }
}
