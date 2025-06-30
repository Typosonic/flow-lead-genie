
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, ruleId, leadId, userId } = await req.json()

    console.log('Automation Engine:', { action, ruleId, leadId, userId })

    if (action === 'execute_rule') {
      // Get the rule
      const { data: rule, error: ruleError } = await supabaseClient
        .from('automation_rules')
        .select('*')
        .eq('id', ruleId)
        .eq('user_id', userId)
        .eq('is_active', true)
        .single()

      if (ruleError || !rule) {
        throw new Error('Rule not found or inactive')
      }

      // Get the lead
      const { data: lead, error: leadError } = await supabaseClient
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .eq('user_id', userId)
        .single()

      if (leadError || !lead) {
        throw new Error('Lead not found')
      }

      // Execute the action based on rule type
      let result = null

      if (rule.action.type === 'send_sms' && lead.phone) {
        // Get user credentials for Twilio
        const { data: credentials } = await supabaseClient
          .from('user_credentials')
          .select('*')
          .eq('user_id', userId)
          .eq('service', 'twilio')
          .single()

        if (credentials) {
          // Send SMS via Twilio service
          const { data: smsResult, error: smsError } = await supabaseClient.functions.invoke('twilio-service', {
            body: {
              action: 'send_sms',
              to: lead.phone,
              message: rule.action.value || 'Automated follow-up message',
              userId
            }
          })

          if (!smsError) {
            result = smsResult
          }
        }
      } else if (rule.action.type === 'send_email' && lead.email) {
        // Create email communication record
        const { data: emailResult } = await supabaseClient
          .from('communications')
          .insert({
            user_id: userId,
            lead_id: leadId,
            type: 'email',
            content: rule.action.value || 'Automated follow-up email',
            direction: 'outbound',
            status: 'sent'
          })
          .select()
          .single()

        result = emailResult
      } else if (rule.action.type === 'update_status') {
        // Update lead status
        const { data: statusResult } = await supabaseClient
          .from('leads')
          .update({
            status: rule.action.value || 'contacted'
          })
          .eq('id', leadId)
          .eq('user_id', userId)
          .select()
          .single()

        result = statusResult
      } else if (rule.action.type === 'make_call' && lead.phone) {
        // Get user credentials for Twilio
        const { data: credentials } = await supabaseClient
          .from('user_credentials')
          .select('*')
          .eq('user_id', userId)
          .eq('service', 'twilio')
          .single()

        if (credentials) {
          // Make call via Twilio service
          const { data: callResult, error: callError } = await supabaseClient.functions.invoke('twilio-service', {
            body: {
              action: 'make_call',
              to: lead.phone,
              userId
            }
          })

          if (!callError) {
            result = callResult
          }
        }
      }

      // Log the automation execution
      await supabaseClient
        .from('automation_logs')
        .insert({
          user_id: userId,
          rule_id: ruleId,
          lead_id: leadId,
          action_type: rule.action.type,
          status: result ? 'success' : 'failed',
          details: result || 'Action execution failed'
        })

      return new Response(
        JSON.stringify({ 
          success: true, 
          result,
          message: `Automation rule executed: ${rule.action.type}` 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Check for triggers (this would be called by other services when events happen)
    if (action === 'check_triggers') {
      const { triggerType, leadId: triggeredLeadId, triggerValue } = await req.json()

      // Find matching rules
      const { data: matchingRules } = await supabaseClient
        .from('automation_rules')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .eq('trigger->type', triggerType)

      const executedRules = []

      for (const rule of matchingRules || []) {
        // Check if trigger conditions match
        let shouldExecute = false

        if (triggerType === 'lead_created') {
          shouldExecute = true
        } else if (triggerType === 'lead_status_changed' && rule.trigger.value === triggerValue) {
          shouldExecute = true
        }

        if (shouldExecute) {
          // Schedule execution (with delay if specified)
          if (rule.delay > 0) {
            // In a real implementation, you'd use a job queue or scheduler
            setTimeout(async () => {
              await supabaseClient.functions.invoke('automation-engine', {
                body: {
                  action: 'execute_rule',
                  ruleId: rule.id,
                  leadId: triggeredLeadId,
                  userId
                }
              })
            }, rule.delay * 60 * 1000) // Convert minutes to milliseconds
          } else {
            // Execute immediately
            await supabaseClient.functions.invoke('automation-engine', {
              body: {
                action: 'execute_rule',
                ruleId: rule.id,
                leadId: triggeredLeadId,
                userId
              }
            })
          }

          executedRules.push(rule.id)
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          executedRules,
          message: `Checked triggers and executed ${executedRules.length} rules` 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    throw new Error('Invalid action')

  } catch (error) {
    console.error('Automation Engine Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
