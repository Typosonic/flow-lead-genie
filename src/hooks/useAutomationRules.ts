
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

interface AutomationRule {
  id: string
  user_id: string
  name: string
  description?: string
  trigger: {
    type: string
    value?: string
  }
  action: {
    type: string
    value?: string
  }
  delay: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export const useAutomationRules = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const rules = useQuery({
    queryKey: ['automation-rules', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('automation_rules')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as AutomationRule[]
    },
    enabled: !!user
  })

  const createRule = useMutation({
    mutationFn: async (ruleData: Omit<AutomationRule, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('automation_rules')
        .insert({
          user_id: user.id,
          ...ruleData
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-rules'] })
      toast({
        title: "Rule created",
        description: "Automation rule has been created successfully.",
      })
    },
    onError: (error) => {
      toast({
        title: "Failed to create rule",
        description: error.message,
        variant: "destructive",
      })
    }
  })

  const updateRule = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AutomationRule> & { id: string }) => {
      const { data, error } = await supabase
        .from('automation_rules')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-rules'] })
      toast({
        title: "Rule updated",
        description: "Automation rule has been updated successfully.",
      })
    },
    onError: (error) => {
      toast({
        title: "Failed to update rule",
        description: error.message,
        variant: "destructive",
      })
    }
  })

  const deleteRule = useMutation({
    mutationFn: async (ruleId: string) => {
      const { error } = await supabase
        .from('automation_rules')
        .delete()
        .eq('id', ruleId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-rules'] })
      toast({
        title: "Rule deleted",
        description: "Automation rule has been deleted successfully.",
      })
    },
    onError: (error) => {
      toast({
        title: "Failed to delete rule",
        description: error.message,
        variant: "destructive",
      })
    }
  })

  const executeRule = useMutation({
    mutationFn: async ({ ruleId, leadId }: { ruleId: string; leadId: string }) => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase.functions.invoke('automation-engine', {
        body: {
          action: 'execute_rule',
          ruleId,
          leadId,
          userId: user.id
        }
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      toast({
        title: "Rule executed",
        description: "Automation rule has been executed successfully.",
      })
    },
    onError: (error) => {
      toast({
        title: "Failed to execute rule",
        description: error.message,
        variant: "destructive",
      })
    }
  })

  return {
    rules: rules.data,
    isLoading: rules.isLoading,
    createRule,
    updateRule,
    deleteRule,
    executeRule
  }
}
