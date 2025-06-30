
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

type CommunicationType = 'sms' | 'voice' | 'email'

export const useCommunications = (leadId?: string) => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['communications', user?.id, leadId],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')

      let query = supabase
        .from('communications')
        .select(`
          *,
          leads (first_name, last_name, email, phone),
          agents (name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (leadId) {
        query = query.eq('lead_id', leadId)
      }

      const { data, error } = await query

      if (error) throw error
      return data
    },
    enabled: !!user
  })
}

export const useCreateCommunication = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      leadId,
      agentId,
      type,
      content,
      direction = 'outbound'
    }: {
      leadId: string
      agentId?: string
      type: CommunicationType
      content: string
      direction?: 'inbound' | 'outbound'
    }) => {
      if (!user) throw new Error('User not authenticated')

      console.log('Creating communication:', { leadId, type, direction })

      const { data, error } = await supabase
        .from('communications')
        .insert({
          user_id: user.id,
          lead_id: leadId,
          agent_id: agentId,
          type,
          content,
          direction,
          status: 'sent'
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['communications'] })
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] })
      
      toast({
        title: "Communication sent",
        description: `${data.type} message has been sent successfully.`,
      })
    },
    onError: (error) => {
      console.error('Communication failed:', error)
      toast({
        title: "Communication failed",
        description: error.message,
        variant: "destructive",
      })
    }
  })
}

export const useCommunicationStats = () => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['communication-stats', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')

      const today = new Date().toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('communications')
        .select('type, status, created_at')
        .eq('user_id', user.id)
        .gte('created_at', today)

      if (error) throw error

      const stats = {
        total: data.length,
        sms: data.filter(c => c.type === 'sms').length,
        voice: data.filter(c => c.type === 'voice').length,
        email: data.filter(c => c.type === 'email').length,
        sent: data.filter(c => c.status === 'sent').length,
        failed: data.filter(c => c.status === 'failed').length
      }

      return stats
    },
    enabled: !!user,
    refetchInterval: 60000 // Refresh every minute
  })
}
