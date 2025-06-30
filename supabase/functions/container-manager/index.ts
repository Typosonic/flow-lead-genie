
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ContainerRequest {
  userId: string
  workflowId: string
  action: 'deploy' | 'stop' | 'restart' | 'status'
  credentials?: Record<string, string>
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

    const { userId, workflowId, action, credentials }: ContainerRequest = await req.json()

    console.log(`Container Manager: ${action} for user ${userId}, workflow ${workflowId}`)

    // Get user's container configuration
    const { data: userContainer, error: containerError } = await supabase
      .from('user_containers')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (containerError && action === 'deploy') {
      // Create new container record
      const { data: newContainer, error: createError } = await supabase
        .from('user_containers')
        .insert({
          user_id: userId,
          container_id: `n8n-${userId}-${Date.now()}`,
          status: 'provisioning',
          region: 'us-central1', // Default region
          resources: {
            cpu: '1',
            memory: '2Gi',
            storage: '10Gi'
          }
        })
        .select()
        .single()

      if (createError) {
        throw new Error(`Failed to create container record: ${createError.message}`)
      }

      console.log('Created new container record:', newContainer)
    }

    switch (action) {
      case 'deploy':
        return await deployContainer(supabase, userId, workflowId, credentials)
      case 'stop':
        return await stopContainer(supabase, userId)
      case 'restart':
        return await restartContainer(supabase, userId)
      case 'status':
        return await getContainerStatus(supabase, userId)
      default:
        throw new Error(`Invalid action: ${action}`)
    }

  } catch (error) {
    console.error('Container Manager Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function deployContainer(supabase: any, userId: string, workflowId: string, credentials?: Record<string, string>) {
  // In production, this would interface with Google Cloud Run or AWS Fargate
  // For now, we'll simulate the deployment process
  
  const containerId = `n8n-${userId}-${Date.now()}`
  
  // Update container status
  await supabase
    .from('user_containers')
    .update({ 
      status: 'deploying',
      last_deployed_at: new Date().toISOString()
    })
    .eq('user_id', userId)

  // Simulate container deployment delay
  setTimeout(async () => {
    await supabase
      .from('user_containers')
      .update({ 
        status: 'running',
        container_url: `https://${containerId}.run.app`,
        deployed_at: new Date().toISOString()
      })
      .eq('user_id', userId)
  }, 5000)

  // Store encrypted credentials if provided
  if (credentials) {
    await supabase
      .from('user_credentials')
      .upsert({
        user_id: userId,
        service_name: 'n8n_container',
        encrypted_credentials: JSON.stringify(credentials), // In production, encrypt this
        created_at: new Date().toISOString()
      })
  }

  // Log deployment event
  await supabase
    .from('container_events')
    .insert({
      user_id: userId,
      container_id: containerId,
      event_type: 'deployment_started',
      workflow_id: workflowId,
      metadata: { action: 'deploy' }
    })

  return new Response(
    JSON.stringify({ 
      success: true, 
      containerId,
      status: 'deploying',
      message: 'Container deployment initiated'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function stopContainer(supabase: any, userId: string) {
  await supabase
    .from('user_containers')
    .update({ 
      status: 'stopped',
      stopped_at: new Date().toISOString()
    })
    .eq('user_id', userId)

  return new Response(
    JSON.stringify({ success: true, status: 'stopped' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function restartContainer(supabase: any, userId: string) {
  await supabase
    .from('user_containers')
    .update({ 
      status: 'restarting',
      last_restart_at: new Date().toISOString()
    })
    .eq('user_id', userId)

  return new Response(
    JSON.stringify({ success: true, status: 'restarting' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getContainerStatus(supabase: any, userId: string) {
  const { data: container } = await supabase
    .from('user_containers')
    .select('*')
    .eq('user_id', userId)
    .single()

  return new Response(
    JSON.stringify({ container }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
