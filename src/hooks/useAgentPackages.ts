
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

export const useAgentPackages = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const packages = useQuery({
    queryKey: ['agent-packages', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('agent_packages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!user
  })

  const uploadPackage = useMutation({
    mutationFn: async ({ file, name, description }: { 
      file: File
      name: string
      description?: string 
    }) => {
      if (!user) throw new Error('User not authenticated')

      console.log('Starting package upload:', { name, fileSize: file.size })

      // Upload file to storage
      const fileName = `${user.id}/${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('agent-packages')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Create package record
      const { data, error } = await supabase
        .from('agent_packages')
        .insert({
          user_id: user.id,
          name,
          description,
          file_path: fileName,
          file_size: file.size,
          status: 'processing'
        })
        .select()
        .single()

      if (error) throw error

      // Trigger processing
      await supabase.functions.invoke('process-agent-package', {
        body: { packageId: data.id }
      })

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-packages'] })
      toast({
        title: "Package uploaded",
        description: "Your package is being processed. You'll see extracted workflows soon.",
      })
    },
    onError: (error) => {
      console.error('Upload failed:', error)
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      })
    }
  })

  const deletePackage = useMutation({
    mutationFn: async (packageId: string) => {
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('agent_packages')
        .delete()
        .eq('id', packageId)
        .eq('user_id', user.id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-packages'] })
      toast({
        title: "Package deleted",
        description: "The package has been removed.",
      })
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      })
    }
  })

  return {
    packages,
    uploadPackage,
    deletePackage,
    isUploading: uploadPackage.isPending,
    isDeleting: deletePackage.isPending
  }
}

export const useExtractedWorkflows = (packageId?: string) => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['extracted-workflows', packageId],
    queryFn: async () => {
      if (!user || !packageId) throw new Error('Missing required parameters')

      const { data, error } = await supabase
        .from('extracted_workflows')
        .select('*')
        .eq('package_id', packageId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!user && !!packageId
  })
}
