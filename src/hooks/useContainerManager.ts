
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'

interface ContainerAction {
  workflowId: string
  action: 'deploy' | 'stop' | 'restart' | 'status'
  credentials?: Record<string, string>
}

export const useContainerManager = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const deployContainer = useMutation({
    mutationFn: async ({ workflowId, credentials }: { workflowId: string, credentials?: Record<string, string> }) => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase.functions.invoke('container-manager', {
        body: {
          action: 'deploy',
          workflowId,
          credentials
        }
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      toast({
        title: "Container Deployment Started",
        description: "Your dedicated n8n container is being deployed. This may take a few minutes.",
      })
      queryClient.invalidateQueries({ queryKey: ['container-status'] })
      queryClient.invalidateQueries({ queryKey: ['agents'] })
    },
    onError: (error: any) => {
      toast({
        title: "Deployment Failed",
        description: error.message || "Failed to deploy container",
        variant: "destructive",
      })
    }
  })

  const manageContainer = useMutation({
    mutationFn: async ({ action, workflowId }: ContainerAction) => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase.functions.invoke('container-manager', {
        body: { action, workflowId }
      })

      if (error) throw error
      return data
    },
    onSuccess: (data, variables) => {
      toast({
        title: `Container ${variables.action}`,
        description: `Container ${variables.action} completed successfully`,
      })
      queryClient.invalidateQueries({ queryKey: ['container-status'] })
    },
    onError: (error: any) => {
      toast({
        title: "Container Action Failed",
        description: error.message,
        variant: "destructive",
      })
    }
  })

  const containerStatus = useQuery({
    queryKey: ['container-status', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase.functions.invoke('container-manager', {
        body: { action: 'status', workflowId: '' }
      })

      if (error) throw error
      return data
    },
    enabled: !!user,
    refetchInterval: 30000 // Poll every 30 seconds
  })

  return {
    deployContainer,
    manageContainer,
    containerStatus,
    isDeploying: deployContainer.isPending,
    isManaging: manageContainer.isPending
  }
}
