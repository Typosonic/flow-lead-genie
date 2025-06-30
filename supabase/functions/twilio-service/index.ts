
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TwilioRequest {
  action: 'send_sms' | 'make_call' | 'get_call_status' | 'test_connection'
  to?: string
  message?: string
  callSid?: string
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

    const { action, to, message, callSid }: TwilioRequest = await req.json()

    console.log(`Twilio Service: ${action} for user ${user.id}`)

    // Retrieve Twilio credentials from credential vault
    const { data: credentialData, error: credError } = await supabase.functions.invoke('credential-vault', {
      body: {
        action: 'retrieve',
        serviceName: 'twilio',
        userId: user.id
      }
    })

    if (credError || !credentialData?.credentials) {
      throw new Error('Twilio credentials not found. Please add your Twilio credentials in the Credential Vault.')
    }

    const { account_sid, auth_token, phone_number } = credentialData.credentials

    if (!account_sid || !auth_token || !phone_number) {
      throw new Error('Incomplete Twilio credentials. Please ensure account_sid, auth_token, and phone_number are configured.')
    }

    switch (action) {
      case 'send_sms':
        return await sendSMS(account_sid, auth_token, phone_number, to!, message!, user.id, supabase)
      case 'make_call':
        return await makeCall(account_sid, auth_token, phone_number, to!, user.id, supabase)
      case 'get_call_status':
        return await getCallStatus(account_sid, auth_token, callSid!, user.id, supabase)
      case 'test_connection':
        return await testConnection(account_sid, auth_token)
      default:
        throw new Error(`Invalid action: ${action}`)
    }

  } catch (error) {
    console.error('Twilio Service Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function sendSMS(accountSid: string, authToken: string, fromNumber: string, to: string, message: string, userId: string, supabase: any) {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
  
  const formData = new URLSearchParams()
  formData.append('From', fromNumber)
  formData.append('To', to)
  formData.append('Body', message)

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(`Twilio SMS Error: ${result.message}`)
  }

  // Log the communication
  await supabase
    .from('communications')
    .insert({
      user_id: userId,
      type: 'sms',
      content: message,
      direction: 'outbound',
      status: result.status,
      external_id: result.sid,
      metadata: {
        to,
        from: fromNumber,
        twilio_sid: result.sid
      }
    })

  return new Response(
    JSON.stringify({ 
      success: true, 
      sid: result.sid,
      status: result.status 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function makeCall(accountSid: string, authToken: string, fromNumber: string, to: string, userId: string, supabase: any) {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json`
  
  const formData = new URLSearchParams()
  formData.append('From', fromNumber)
  formData.append('To', to)
  formData.append('Url', 'http://demo.twilio.com/docs/voice.xml') // Default TwiML for demo
  formData.append('Method', 'GET')

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(`Twilio Call Error: ${result.message}`)
  }

  // Log the communication
  await supabase
    .from('communications')
    .insert({
      user_id: userId,
      type: 'voice',
      content: `Call to ${to}`,
      direction: 'outbound',
      status: result.status,
      external_id: result.sid,
      metadata: {
        to,
        from: fromNumber,
        twilio_sid: result.sid
      }
    })

  return new Response(
    JSON.stringify({ 
      success: true, 
      sid: result.sid,
      status: result.status 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getCallStatus(accountSid: string, authToken: string, callSid: string, userId: string, supabase: any) {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls/${callSid}.json`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
    }
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(`Twilio Call Status Error: ${result.message}`)
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      status: result.status,
      duration: result.duration 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function testConnection(accountSid: string, authToken: string) {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}.json`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
    }
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(`Twilio Connection Test Failed: ${result.message}`)
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      account_name: result.friendly_name,
      status: result.status 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
