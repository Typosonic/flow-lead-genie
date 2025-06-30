
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

export const useLeads = () => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['leads', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!user
  })
}

export const useLeadStats = () => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['lead-stats', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')

      const today = new Date().toISOString().split('T')[0]

      const [leadsToday, totalCommunications] = await Promise.all([
        supabase
          .from('leads')
          .select('id')
          .eq('user_id', user.id)
          .gte('created_at', today)
          .then(({ data }) => data?.length || 0),
        
        supabase
          .from('communications')
          .select('type')
          .eq('user_id', user.id)
          .gte('created_at', today)
          .then(({ data }) => data || [])
      ])

      const callsPlaced = totalCommunications.filter(c => c.type === 'voice').length
      const bookings = totalCommunications.filter(c => c.type === 'calendar').length
      const responseRate = totalCommunications.length > 0 
        ? Math.round((bookings / totalCommunications.length) * 100)
        : 0

      return {
        leadsToday,
        callsPlaced,
        bookings,
        responseRate
      }
    },
    enabled: !!user,
    refetchInterval: 60000
  })
}
