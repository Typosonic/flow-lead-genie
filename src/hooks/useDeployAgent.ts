
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface DeployAgentParams {
  templateId: string
  agentName: string
  configuration?: Record<string, any>
  credentials?: Record<string, string>
}

export const useDeployAgent = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: DeployAgentParams) => {
      const { data, error } = await supabase.functions.invoke('workflow-deployer', {
        body: params
      })

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
      queryClient.invalidateQueries({ queryKey: ['container-status'] })
      toast({
        title: "Agent deployed successfully",
        description: `${data.agent.name} is now active and ready to process leads.`,
      })
    },
    onError: (error) => {
      toast({
        title: "Deployment failed",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}
