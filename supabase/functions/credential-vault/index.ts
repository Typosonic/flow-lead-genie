
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CredentialRequest {
  service: string
  credentials: Record<string, string>
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
      throw new Error('Invalid authentication')
    }

    const { service, credentials, action }: CredentialRequest = await req.json()

    console.log(`Credential Vault: ${action} for user ${user.id}, service ${service}`)

    switch (action) {
      case 'store':
        return await storeCredentials(supabase, user.id, service, credentials)
      case 'retrieve':
        return await retrieveCredentials(supabase, user.id, service)
      case 'delete':
        return await deleteCredentials(supabase, user.id, service)
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

async function storeCredentials(supabase: any, userId: string, service: string, credentials: Record<string, string>) {
  // In production, encrypt credentials before storing
  const encryptedCredentials = await encryptCredentials(credentials)
  
  const { data, error } = await supabase
    .from('user_credentials')
    .upsert({
      user_id: userId,
      service_name: service,
      encrypted_credentials: encryptedCredentials,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()

  if (error) {
    throw new Error(`Failed to store credentials: ${error.message}`)
  }

  // Log credential access
  await supabase
    .from('credential_access_logs')
    .insert({
      user_id: userId,
      service_name: service,
      action: 'store',
      timestamp: new Date().toISOString(),
      ip_address: req.headers.get('x-forwarded-for') || 'unknown'
    })

  return new Response(
    JSON.stringify({ success: true, service }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function retrieveCredentials(supabase: any, userId: string, service: string) {
  const { data, error } = await supabase
    .from('user_credentials')
    .select('encrypted_credentials')
    .eq('user_id', userId)
    .eq('service_name', service)
    .single()

  if (error) {
    throw new Error(`Failed to retrieve credentials: ${error.message}`)
  }

  // Decrypt credentials
  const decryptedCredentials = await decryptCredentials(data.encrypted_credentials)

  // Log credential access
  await supabase
    .from('credential_access_logs')
    .insert({
      user_id: userId,
      service_name: service,
      action: 'retrieve',
      timestamp: new Date().toISOString(),
      ip_address: req.headers.get('x-forwarded-for') || 'unknown'
    })

  return new Response(
    JSON.stringify({ credentials: decryptedCredentials }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function deleteCredentials(supabase: any, userId: string, service: string) {
  const { error } = await supabase
    .from('user_credentials')
    .delete()
    .eq('user_id', userId)
    .eq('service_name', service)

  if (error) {
    throw new Error(`Failed to delete credentials: ${error.message}`)
  }

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function listServices(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('user_credentials')
    .select('service_name, created_at, updated_at')
    .eq('user_id', userId)

  if (error) {
    throw new Error(`Failed to list services: ${error.message}`)
  }

  return new Response(
    JSON.stringify({ services: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

// Simple encryption/decryption functions (use proper encryption in production)
async function encryptCredentials(credentials: Record<string, string>): Promise<string> {
  // In production, use proper encryption with Supabase Vault or AWS KMS
  const encoder = new TextEncoder()
  const data = encoder.encode(JSON.stringify(credentials))
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(Deno.env.get('ENCRYPTION_KEY') || 'default-key-change-in-prod'),
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  )
  
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  )
  
  const combined = new Uint8Array(iv.length + encrypted.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(encrypted), iv.length)
  
  return btoa(String.fromCharCode(...combined))
}

async function decryptCredentials(encryptedData: string): Promise<Record<string, string>> {
  // In production, use proper decryption with Supabase Vault or AWS KMS
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  
  const combined = new Uint8Array(atob(encryptedData).split('').map(c => c.charCodeAt(0)))
  const iv = combined.slice(0, 12)
  const encrypted = combined.slice(12)
  
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(Deno.env.get('ENCRYPTION_KEY') || 'default-key-change-in-prod'),
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  )
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encrypted
  )
  
  return JSON.parse(decoder.decode(decrypted))
}
