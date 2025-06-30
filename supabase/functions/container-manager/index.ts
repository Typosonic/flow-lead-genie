
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ContainerRequest {
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

    const { workflowId, action, credentials }: ContainerRequest = await req.json()

    console.log(`Container Manager: ${action} for user ${user.id}, workflow ${workflowId}`)

    // Log the container action
    await supabase
      .from('credential_access_logs')
      .insert({
        user_id: user.id,
        service_name: 'container_manager',
        action: `container_${action}`,
        ip_address: req.headers.get('x-forwarded-for') || 'unknown'
      })

    switch (action) {
      case 'deploy':
        return await deployContainer(supabase, user.id, workflowId, credentials)
      case 'stop':
        return await stopContainer(supabase, user.id)
      case 'restart':
        return await restartContainer(supabase, user.id)
      case 'status':
        return await getContainerStatus(supabase, user.id)
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
  // Check if user already has a container
  const { data: existingContainer } = await supabase
    .from('user_containers')
    .select('*')
    .eq('user_id', userId)
    .single()

  const containerId = `n8n-${userId}-${Date.now()}`
  
  if (!existingContainer) {
    // Create new container record
    const { data: newContainer, error: createError } = await supabase
      .from('user_containers')
      .insert({
        user_id: userId,
        container_id: containerId,
        status: 'provisioning',
        region: 'us-central1',
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
  } else {
    // Update existing container
    await supabase
      .from('user_containers')
      .update({ 
        status: 'deploying',
        last_deployed_at: new Date().toISOString()
      })
      .eq('user_id', userId)
  }

  // Store encrypted credentials if provided
  if (credentials) {
    for (const [serviceName, credential] of Object.entries(credentials)) {
      await supabase
        .from('user_credentials')
        .upsert({
          user_id: userId,
          service_name: serviceName,
          encrypted_credentials: JSON.stringify(credential), // In production, encrypt this properly
        })
    }
  }

  // Log deployment event
  await supabase
    .from('container_events')
    .insert({
      user_id: userId,
      container_id: containerId,
      event_type: 'deployment_started',
      workflow_id: workflowId,
      metadata: { action: 'deploy', timestamp: new Date().toISOString() }
    })

  // Simulate container deployment (replace with actual cloud provider API calls)
  setTimeout(async () => {
    await supabase
      .from('user_containers')
      .update({ 
        status: 'running',
        container_url: `https://${containerId}.run.app`,
        deployed_at: new Date().toISOString()
      })
      .eq('user_id', userId)

    // Log successful deployment
    await supabase
      .from('container_events')
      .insert({
        user_id: userId,
        container_id: containerId,
        event_type: 'deployment_completed',
        workflow_id: workflowId,
        metadata: { status: 'success' }
      })
  }, 5000)

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

  // Log the stop event
  const { data: container } = await supabase
    .from('user_containers')
    .select('container_id')
    .eq('user_id', userId)
    .single()

  if (container) {
    await supabase
      .from('container_events')
      .insert({
        user_id: userId,
        container_id: container.container_id,
        event_type: 'container_stopped',
        metadata: { timestamp: new Date().toISOString() }
      })
  }

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

  // Log the restart event
  const { data: container } = await supabase
    .from('user_containers')
    .select('container_id')
    .eq('user_id', userId)
    .single()

  if (container) {
    await supabase
      .from('container_events')
      .insert({
        user_id: userId,
        container_id: container.container_id,
        event_type: 'container_restarted',
        metadata: { timestamp: new Date().toISOString() }
      })
  }

  // Simulate restart delay
  setTimeout(async () => {
    await supabase
      .from('user_containers')
      .update({ status: 'running' })
      .eq('user_id', userId)
  }, 3000)

  return new Response(
    JSON.stringify({ success: true, status: 'restarting' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getContainerStatus(supabase: any, userId: string) {
  const { data: container, error } = await supabase
    .from('user_containers')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw error
  }

  return new Response(
    JSON.stringify({ container: container || null }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
