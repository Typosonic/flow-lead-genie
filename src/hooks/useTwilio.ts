
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

export const useTwilio = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const sendSMS = useMutation({
    mutationFn: async ({ to, message }: { to: string; message: string }) => {
      if (!user) throw new Error('User not authenticated')

      console.log('Sending SMS to:', to)

      const { data, error } = await supabase.functions.invoke('twilio-service', {
        body: {
          action: 'send_sms',
          to,
          message
        }
      })

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['communications'] })
      toast({
        title: "SMS sent successfully",
        description: `Message delivered with SID: ${data.sid}`,
      })
    },
    onError: (error) => {
      console.error('SMS failed:', error)
      toast({
        title: "SMS failed",
        description: error.message,
        variant: "destructive",
      })
    }
  })

  const makeCall = useMutation({
    mutationFn: async ({ to }: { to: string }) => {
      if (!user) throw new Error('User not authenticated')

      console.log('Making call to:', to)

      const { data, error } = await supabase.functions.invoke('twilio-service', {
        body: {
          action: 'make_call',
          to
        }
      })

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['communications'] })
      toast({
        title: "Call initiated successfully",
        description: `Call started with SID: ${data.sid}`,
      })
    },
    onError: (error) => {
      console.error('Call failed:', error)
      toast({
        title: "Call failed",
        description: error.message,
        variant: "destructive",
      })
    }
  })

  const testConnection = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase.functions.invoke('twilio-service', {
        body: {
          action: 'test_connection'
        }
      })

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      toast({
        title: "Twilio connection successful",
        description: `Connected to account: ${data.account_name}`,
      })
    },
    onError: (error) => {
      toast({
        title: "Twilio connection failed",
        description: error.message,
        variant: "destructive",
      })
    }
  })

  return {
    sendSMS,
    makeCall,
    testConnection,
    isSendingSMS: sendSMS.isPending,
    isMakingCall: makeCall.isPending,
    isTesting: testConnection.isPending
  }
}
