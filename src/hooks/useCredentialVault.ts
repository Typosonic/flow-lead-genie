
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface CredentialOperation {
  service: string
  credentials?: Record<string, string>
  action: 'store' | 'retrieve' | 'delete' | 'list'
}

export const useCredentialVault = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const storeCredentials = useMutation({
    mutationFn: async ({ service, credentials }: { service: string, credentials: Record<string, string> }) => {
      const { data, error } = await supabase.functions.invoke('credential-vault', {
        body: {
          service,
          credentials,
          action: 'store'
        }
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      toast({
        title: "Credentials Stored",
        description: "Your API credentials have been securely stored.",
      })
      queryClient.invalidateQueries({ queryKey: ['user-services'] })
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Store Credentials",
        description: error.message,
        variant: "destructive",
      })
    }
  })

  const retrieveCredentials = useMutation({
    mutationFn: async ({ service }: { service: string }) => {
      const { data, error } = await supabase.functions.invoke('credential-vault', {
        body: {
          service,
          action: 'retrieve'
        }
      })

      if (error) throw error
      return data
    }
  })

  const deleteCredentials = useMutation({
    mutationFn: async ({ service }: { service: string }) => {
      const { data, error } = await supabase.functions.invoke('credential-vault', {
        body: {
          service,
          action: 'delete'
        }
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      toast({
        title: "Credentials Deleted",
        description: "API credentials have been removed from your vault.",
      })
      queryClient.invalidateQueries({ queryKey: ['user-services'] })
    }
  })

  const userServices = useQuery({
    queryKey: ['user-services'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('credential-vault', {
        body: { action: 'list', service: '' }
      })

      if (error) throw error
      return data
    }
  })

  return {
    storeCredentials,
    retrieveCredentials,
    deleteCredentials,
    userServices,
    isStoring: storeCredentials.isPending,
    isRetrieving: retrieveCredentials.isPending,
    isDeleting: deleteCredentials.isPending
  }
}
