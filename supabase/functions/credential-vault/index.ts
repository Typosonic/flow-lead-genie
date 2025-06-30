
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CredentialRequest {
  serviceName: string
  credentials?: Record<string, string>
  action: 'store' | 'retrieve' | 'delete' | 'list'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from JWT token
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const { serviceName, credentials, action }: CredentialRequest = await req.json()

    console.log(`Credential Vault: ${action} for service ${serviceName}, user ${user.id}`)

    // Log the credential access
    await supabase
      .from('credential_access_logs')
      .insert({
        user_id: user.id,
        service_name: serviceName,
        action,
        ip_address: req.headers.get('x-forwarded-for') || 'unknown'
      })

    switch (action) {
      case 'store':
        return await storeCredentials(supabase, user.id, serviceName, credentials!)
      case 'retrieve':
        return await retrieveCredentials(supabase, user.id, serviceName)
      case 'delete':
        return await deleteCredentials(supabase, user.id, serviceName)
      case 'list':
        return await listServices(supabase, user.id)
      default:
        throw new Error(`Invalid action: ${action}`)
    }

  } catch (error) {
    console.error('Credential Vault Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function storeCredentials(supabase: any, userId: string, serviceName: string, credentials: Record<string, string>) {
  // In production, encrypt credentials before storing
  const encryptedCredentials = JSON.stringify(credentials)
  
  const { data, error } = await supabase
    .from('user_credentials')
    .upsert({
      user_id: userId,
      service_name: serviceName,
      encrypted_credentials: encryptedCredentials,
    })
    .select()

  if (error) {
    throw new Error(`Failed to store credentials: ${error.message}`)
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Credentials stored successfully',
      serviceName 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function retrieveCredentials(supabase: any, userId: string, serviceName: string) {
  const { data, error } = await supabase
    .from('user_credentials')
    .select('encrypted_credentials')
    .eq('user_id', userId)
    .eq('service_name', serviceName)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw error
  }

  if (!data) {
    return new Response(
      JSON.stringify({ error: 'Credentials not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // In production, decrypt credentials before returning
  const credentials = JSON.parse(data.encrypted_credentials)

  return new Response(
    JSON.stringify({ 
      success: true, 
      credentials,
      serviceName 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function deleteCredentials(supabase: any, userId: string, serviceName: string) {
  const { error } = await supabase
    .from('user_credentials')
    .delete()
    .eq('user_id', userId)
    .eq('service_name', serviceName)

  if (error) {
    throw new Error(`Failed to delete credentials: ${error.message}`)
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Credentials deleted successfully',
      serviceName 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function listServices(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('user_credentials')
    .select('service_name, created_at, updated_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      services: data || []
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
