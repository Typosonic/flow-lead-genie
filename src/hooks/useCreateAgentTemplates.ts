
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CreateTemplateData {
  name: string;
  description?: string;
  category?: string;
  configuration?: any;
  prompt_template?: string;
  is_public?: boolean;
}

export const useCreateAgentTemplates = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (templateData: CreateTemplateData) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('agent_templates')
        .insert({
          name: templateData.name,
          description: templateData.description,
          category: templateData.category || 'Other',
          configuration: templateData.configuration || {},
          prompt_template: templateData.prompt_template,
          is_public: templateData.is_public ?? true,
          created_by: user.id,
          usage_count: 0
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-templates'] });
      toast({
        title: "Template created",
        description: "Your agent template has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating template",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
