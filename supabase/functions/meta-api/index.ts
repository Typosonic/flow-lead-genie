
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MetaAPIRequest {
  action: 'get_ad_accounts' | 'get_lead_forms' | 'sync_leads' | 'test_connection'
  userId: string
  formId?: string
  since?: string
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

    const { action, userId, formId, since }: MetaAPIRequest = await req.json()

    // Get user credentials for Meta API
    const { data: credentials, error: credError } = await supabaseClient
      .from('user_credentials')
      .select('encrypted_credentials')
      .eq('user_id', userId)
      .eq('service_name', 'meta_business_api')
      .single()

    if (credError || !credentials) {
      throw new Error('Meta Business API credentials not found')
    }

    // In a real implementation, you would decrypt the credentials here
    // For now, we'll assume they're stored as JSON
    const metaCredentials = JSON.parse(credentials.encrypted_credentials)
    const { access_token, app_id, app_secret } = metaCredentials

    const baseUrl = 'https://graph.facebook.com/v18.0'

    switch (action) {
      case 'test_connection': {
        const response = await fetch(`${baseUrl}/me?access_token=${access_token}`)
        if (!response.ok) {
          throw new Error('Invalid Meta API credentials')
        }
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'get_ad_accounts': {
        const response = await fetch(
          `${baseUrl}/me/adaccounts?fields=id,name,account_id,currency&access_token=${access_token}`
        )
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error?.message || 'Failed to fetch ad accounts')
        }

        return new Response(JSON.stringify({ ad_accounts: data.data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'get_lead_forms': {
        // First get ad accounts to find forms
        const accountsResponse = await fetch(
          `${baseUrl}/me/adaccounts?access_token=${access_token}`
        )
        const accountsData = await accountsResponse.json()

        if (!accountsResponse.ok) {
          throw new Error('Failed to fetch ad accounts')
        }

        const forms = []
        for (const account of accountsData.data) {
          const formsResponse = await fetch(
            `${baseUrl}/${account.id}/leadgen_forms?fields=id,name,status,locale&access_token=${access_token}`
          )
          const formsData = await formsResponse.json()
          
          if (formsResponse.ok && formsData.data) {
            forms.push(...formsData.data)
          }
        }

        return new Response(JSON.stringify({ forms }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'sync_leads': {
        if (!formId) {
          throw new Error('Form ID is required for lead sync')
        }

        const sinceParam = since ? `&since=${new Date(since).getTime() / 1000}` : ''
        const response = await fetch(
          `${baseUrl}/${formId}/leads?access_token=${access_token}${sinceParam}`
        )
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error?.message || 'Failed to fetch leads')
        }

        let importedCount = 0

        // Process each lead
        for (const lead of data.data) {
          const leadData: any = {
            user_id: userId,
            source: 'meta_facebook',
            meta_form_id: formId,
            custom_fields: {},
            created_at: new Date(lead.created_time).toISOString()
          }

          // Parse field data
          for (const field of lead.field_data) {
            const value = field.values?.[0] || ''
            
            switch (field.name.toLowerCase()) {
              case 'email':
                leadData.email = value
                break
              case 'phone':
              case 'phone_number':
                leadData.phone = value
                break
              case 'first_name':
                leadData.first_name = value
                break
              case 'last_name':
                leadData.last_name = value
                break
              default:
                leadData.custom_fields[field.name] = value
            }
          }

          // Check if lead already exists
          const { data: existingLead } = await supabaseClient
            .from('leads')
            .select('id')
            .eq('user_id', userId)
            .eq('email', leadData.email)
            .single()

          if (!existingLead) {
            const { error: insertError } = await supabaseClient
              .from('leads')
              .insert(leadData)

            if (!insertError) {
              importedCount++
            }
          }
        }

        return new Response(JSON.stringify({ imported_count: importedCount }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Meta API error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
