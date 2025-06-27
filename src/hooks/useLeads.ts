
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useLeads = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['leads', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useLeadStats = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['lead-stats', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const today = new Date().toISOString().split('T')[0];
      
      // Get leads created today
      const { data: todayLeads, error: todayError } = await supabase
        .from('leads')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', today);
      
      if (todayError) throw todayError;
      
      // Get total leads
      const { data: totalLeads, error: totalError } = await supabase
        .from('leads')
        .select('id, status')
        .eq('user_id', user.id);
      
      if (totalError) throw totalError;
      
      // Get communications today
      const { data: communications, error: commError } = await supabase
        .from('communications')
        .select('id, type')
        .eq('user_id', user.id)
        .gte('created_at', today);
      
      if (commError) throw commError;
      
      const convertedLeads = totalLeads?.filter(lead => lead.status === 'converted').length || 0;
      const callsToday = communications?.filter(comm => comm.type === 'voice').length || 0;
      const totalLeadsCount = totalLeads?.length || 0;
      const responseRate = totalLeadsCount > 0 ? Math.round((convertedLeads / totalLeadsCount) * 100) : 0;
      
      return {
        leadsToday: todayLeads?.length || 0,
        callsPlaced: callsToday,
        bookings: convertedLeads,
        responseRate,
      };
    },
    enabled: !!user,
  });
};
