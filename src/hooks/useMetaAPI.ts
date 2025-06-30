
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

interface MetaAdAccount {
  id: string
  name: string
  account_id: string
  currency: string
}

interface MetaForm {
  id: string
  name: string
  status: string
  locale: string
}

interface MetaLead {
  id: string
  created_time: string
  ad_id: string
  form_id: string
  field_data: Array<{
    name: string
    values: string[]
  }>
}

export const useMetaAPI = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const adAccounts = useQuery({
    queryKey: ['meta-ad-accounts', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase.functions.invoke('meta-api', {
        body: {
          action: 'get_ad_accounts',
          userId: user.id
        }
      })

      if (error) throw error
      return data.ad_accounts as MetaAdAccount[]
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  const leadForms = useQuery({
    queryKey: ['meta-lead-forms', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase.functions.invoke('meta-api', {
        body: {
          action: 'get_lead_forms',
          userId: user.id
        }
      })

      if (error) throw error
      return data.forms as MetaForm[]
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000
  })

  const syncLeads = useMutation({
    mutationFn: async ({ formId, since }: { formId: string; since?: string }) => {
      if (!user) throw new Error('User not authenticated')

      console.log('Syncing leads from Meta form:', formId)

      const { data, error } = await supabase.functions.invoke('meta-api', {
        body: {
          action: 'sync_leads',
          formId,
          since: since || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Last 24 hours by default
          userId: user.id
        }
      })

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      toast({
        title: "Leads synced successfully",
        description: `Imported ${data.imported_count} new leads from Meta.`,
      })
    },
    onError: (error) => {
      console.error('Lead sync failed:', error)
      toast({
        title: "Lead sync failed",
        description: error.message,
        variant: "destructive",
      })
    }
  })

  const testConnection = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase.functions.invoke('meta-api', {
        body: {
          action: 'test_connection',
          userId: user.id
        }
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      toast({
        title: "Meta API connection successful",
        description: "Your Meta Business API credentials are working correctly.",
      })
    },
    onError: (error) => {
      toast({
        title: "Meta API connection failed",
        description: error.message,
        variant: "destructive",
      })
    }
  })

  return {
    adAccounts,
    leadForms,
    syncLeads,
    testConnection,
    isSyncing: syncLeads.isPending,
    isTesting: testConnection.isPending
  }
}
