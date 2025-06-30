
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

interface ContainerActionParams {
  action: 'deploy' | 'stop' | 'restart'
  workflowId: string
  credentials?: Record<string, string>
}

export const useContainerManager = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const containerStatus = useQuery({
    queryKey: ['container-status', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('user_containers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) throw error
      return { container: data }
    },
    enabled: !!user,
    refetchInterval: 30000
  })

  const manageContainer = useMutation({
    mutationFn: async (params: ContainerActionParams) => {
      const { data, error } = await supabase.functions.invoke('container-manager', {
        body: params
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['container-status'] })
      queryClient.invalidateQueries({ queryKey: ['container-events'] })
    }
  })

  return {
    containerStatus,
    manageContainer,
    isManaging: manageContainer.isPending
  }
}
