
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useDeployAgent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (templateData: { 
      id?: string; 
      name: string; 
      description?: string; 
      configuration?: any;
      prompt_template?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('agents')
        .insert({
          user_id: user.id,
          name: templateData.name,
          description: templateData.description,
          configuration: templateData.configuration || {},
          prompt_template: templateData.prompt_template,
          status: 'active' as const
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update template usage count if deploying from template (not static templates)
      if (templateData.id && !templateData.id.startsWith('static-')) {
        // First get the current usage count
        const { data: currentTemplate, error: fetchError } = await supabase
          .from('agent_templates')
          .select('usage_count')
          .eq('id', templateData.id)
          .single();
        
        if (!fetchError && currentTemplate) {
          const newUsageCount = (currentTemplate.usage_count || 0) + 1;
          
          const { error: updateError } = await supabase
            .from('agent_templates')
            .update({ usage_count: newUsageCount })
            .eq('id', templateData.id);
          
          if (updateError) {
            console.warn('Failed to update template usage count:', updateError);
          }
        }
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast({
        title: "Agent deployed",
        description: "Your agent has been deployed successfully and is now active.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deploying agent",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
