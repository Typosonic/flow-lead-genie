
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAgentTemplates = () => {
  return useQuery({
    queryKey: ['agent-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agent_templates')
        .select('*')
        .eq('is_public', true)
        .order('usage_count', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};
