
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

export const useContainerManager = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const containerStatus = useQuery({
    queryKey: ['container-status', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('user_containers')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return { container: data }
    },
    enabled: !!user
  })

  const manageContainer = useMutation({
    mutationFn: async ({ action, workflowId }: { action: 'stop' | 'restart'; workflowId: string }) => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase.functions.invoke('container-manager', {
        body: { action, workflowId, userId: user.id }
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['container-status'] })
      toast({
        title: "Container action completed",
        description: "Container operation was successful.",
      })
    },
    onError: (error) => {
      toast({
        title: "Container action failed",
        description: error.message,
        variant: "destructive",
      })
    }
  })

  return {
    containerStatus,
    manageContainer,
    isManaging: manageContainer.isPending
  }
}
