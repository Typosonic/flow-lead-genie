
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

export const useCredentialVault = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const credentials = useQuery({
    queryKey: ['user-credentials', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('user_credentials')
        .select('id, service_name, created_at, updated_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!user
  })

  const storeCredentials = useMutation({
    mutationFn: async ({ serviceName, credentials }: { 
      serviceName: string
      credentials: Record<string, string>
    }) => {
      if (!user) throw new Error('User not authenticated')

      console.log('Storing credentials for service:', serviceName)

      const { data, error } = await supabase.functions.invoke('credential-vault', {
        body: {
          action: 'store',
          serviceName,
          credentials,
          userId: user.id
        }
      })

      if (error) throw error
      return data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-credentials'] })
      toast({
        title: "Credentials stored",
        description: `${variables.serviceName} credentials have been securely stored.`,
      })
    },
    onError: (error) => {
      console.error('Failed to store credentials:', error)
      toast({
        title: "Failed to store credentials",
        description: error.message,
        variant: "destructive",
      })
    }
  })

  const retrieveCredentials = useMutation({
    mutationFn: async (serviceName: string) => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase.functions.invoke('credential-vault', {
        body: {
          action: 'retrieve',
          serviceName,
          userId: user.id
        }
      })

      if (error) throw error
      return data
    }
  })

  const deleteCredentials = useMutation({
    mutationFn: async (serviceName: string) => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase.functions.invoke('credential-vault', {
        body: {
          action: 'delete',
          serviceName,
          userId: user.id
        }
      })

      if (error) throw error
      return data
    },
    onSuccess: (data, serviceName) => {
      queryClient.invalidateQueries({ queryKey: ['user-credentials'] })
      toast({
        title: "Credentials deleted",
        description: `${serviceName} credentials have been removed.`,
      })
    },
    onError: (error) => {
      toast({
        title: "Failed to delete credentials",
        description: error.message,
        variant: "destructive",
      })
    }
  })

  return {
    credentials,
    storeCredentials,
    retrieveCredentials,
    deleteCredentials,
    isStoring: storeCredentials.isPending,
    isRetrieving: retrieveCredentials.isPending,
    isDeleting: deleteCredentials.isPending
  }
}
