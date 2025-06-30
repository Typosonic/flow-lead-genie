
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

interface ContainerAction {
  workflowId: string
  action: 'deploy' | 'stop' | 'restart' | 'status'
  credentials?: Record<string, string>
}

export const useContainerManager = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const containerStatus = useQuery({
    queryKey: ['container-status', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase.functions.invoke('container-manager', {
        body: {
          action: 'status',
          workflowId: 'status-check'
        }
      })

      if (error) throw error
      return data
    },
    enabled: !!user,
    refetchInterval: 30000 // Refresh every 30 seconds
  })

  const deployContainer = useMutation({
    mutationFn: async ({ workflowId, credentials }: { workflowId: string; credentials?: Record<string, string> }) => {
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
      queryClient.invalidateQueries({ queryKey: ['container-status'] })
      toast({
        title: "Container deployment started",
        description: "Your n8n container is being deployed.",
      })
    },
    onError: (error) => {
      console.error('Container deployment failed:', error)
      toast({
        title: "Deployment failed",
        description: error.message,
        variant: "destructive",
      })
    }
  })

  const stopContainer = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase.functions.invoke('container-manager', {
        body: {
          action: 'stop',
          workflowId: 'stop-request'
        }
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['container-status'] })
      toast({
        title: "Container stopped",
        description: "Your n8n container has been stopped.",
      })
    },
    onError: (error) => {
      toast({
        title: "Failed to stop container",
        description: error.message,
        variant: "destructive",
      })
    }
  })

  const restartContainer = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase.functions.invoke('container-manager', {
        body: {
          action: 'restart',
          workflowId: 'restart-request'
        }
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['container-status'] })
      toast({
        title: "Container restarting",
        description: "Your n8n container is being restarted.",
      })
    },
    onError: (error) => {
      toast({
        title: "Failed to restart container",
        description: error.message,
        variant: "destructive",
      })
    }
  })

  return {
    containerStatus,
    deployContainer,
    stopContainer,
    restartContainer,
    isDeploying: deployContainer.isPending,
    isStopping: stopContainer.isPending,
    isRestarting: restartContainer.isPending
  }
}
