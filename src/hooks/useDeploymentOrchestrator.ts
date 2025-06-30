
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

interface DeploymentParams {
  agentId: string
  configuration?: Record<string, any>
  credentials?: Record<string, string>
}

export const useDeploymentOrchestrator = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

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
        .limit(20)

      if (error) throw error
      return data
    },
    enabled: !!user
  })

  const deployAgent = useMutation({
    mutationFn: async (params: DeploymentParams) => {
      if (!user) throw new Error('User not authenticated')

      console.log('Starting agent deployment:', params)

      // Get the agent details
      const { data: agent, error: agentError } = await supabase
        .from('agents')
        .select('*')
        .eq('id', params.agentId)
        .eq('user_id', user.id)
        .single()

      if (agentError) throw agentError

      // Create or get user container
      let { data: container, error: containerError } = await supabase
        .from('user_containers')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (containerError && containerError.code === 'PGRST116') {
        // No container exists, create one
        const { data: newContainer, error: createError } = await supabase
          .from('user_containers')
          .insert({
            user_id: user.id,
            container_id: `container-${user.id}-${Date.now()}`,
            status: 'provisioning'
          })
          .select()
          .single()

        if (createError) throw createError
        container = newContainer
      } else if (containerError) {
        throw containerError
      }

      // Deploy via edge function
      const { data, error } = await supabase.functions.invoke('workflow-deployer', {
        body: {
          agentId: params.agentId,
          agentName: agent.name,
          configuration: params.configuration || agent.configuration,
          credentials: params.credentials,
          containerId: container.container_id
        }
      })

      if (error) throw error

      // Update agent status
      await supabase
        .from('agents')
        .update({ status: 'active' })
        .eq('id', params.agentId)

      return { agent, container, deployment: data }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
      queryClient.invalidateQueries({ queryKey: ['container-status'] })
      queryClient.invalidateQueries({ queryKey: ['deployment-logs'] })
      
      toast({
        title: "Agent deployed successfully",
        description: `${data.agent.name} is now active and processing leads.`,
      })
    },
    onError: (error) => {
      console.error('Deployment failed:', error)
      toast({
        title: "Deployment failed",
        description: error.message,
        variant: "destructive",
      })
    }
  })

  return {
    deploymentLogs,
    deployAgent,
    isDeploying: deployAgent.isPending
  }
}
