
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useAgentPackages = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['agent-packages', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('agent_packages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useUploadAgentPackage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error('User not authenticated');
      
      // Upload file to storage
      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('agent-packages')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      // Create package record
      const { data, error } = await supabase
        .from('agent_packages')
        .insert({
          user_id: user.id,
          name: file.name.replace('.zip', ''),
          file_path: uploadData.path,
          file_size: file.size,
          status: 'processing'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-packages'] });
      toast({
        title: "Package uploaded",
        description: "Your agent package is being processed and will be available soon.",
      });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
