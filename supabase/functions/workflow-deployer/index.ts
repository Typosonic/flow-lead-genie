
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WorkflowDeployRequest {
  templateId: string
  agentName: string
  configuration?: Record<string, any>
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

    const { templateId, agentName, configuration }: WorkflowDeployRequest = await req.json()

    console.log(`Deploying workflow template ${templateId} for user ${user.id}`)

    // Get template data
    const { data: template, error: templateError } = await supabase
      .from('agent_templates')
      .select('*')
      .eq('id', templateId)
      .single()

    if (templateError) {
      throw new Error(`Template not found: ${templateError.message}`)
    }

    // Check if user has a container
    let { data: container, error: containerError } = await supabase
      .from('user_containers')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (containerError) {
      // Create container if it doesn't exist
      const { data: newContainer, error: createError } = await supabase
        .from('user_containers')
        .insert({
          user_id: user.id,
          container_id: `n8n-${user.id}-${Date.now()}`,
          status: 'provisioning',
          region: 'us-central1'
        })
        .select()
        .single()

      if (createError) {
        throw new Error(`Failed to create container: ${createError.message}`)
      }
      container = newContainer
    }

    // Create agent record
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .insert({
        user_id: user.id,
        name: agentName,
        description: template.description,
        status: 'deploying',
        configuration: {
          ...template.configuration,
          ...configuration,
          template_id: templateId,
          container_id: container.container_id
        },
        prompt_template: template.prompt_template,
        n8n_workflow_id: `workflow_${Date.now()}`
      })
      .select()
      .single()

    if (agentError) {
      throw new Error(`Failed to create agent: ${agentError.message}`)
    }

    // Deploy to container (simulate deployment)
    const deploymentResult = await deployToContainer(
      container.container_id,
      template,
      configuration,
      user.id
    )

    // Update agent status
    await supabase
      .from('agents')
      .update({
        status: deploymentResult.success ? 'active' : 'failed',
        n8n_workflow_id: deploymentResult.workflowId
      })
      .eq('id', agent.id)

    // Log deployment
    await supabase
      .from('deployment_logs')
      .insert({
        user_id: user.id,
        agent_id: agent.id,
        template_id: templateId,
        container_id: container.container_id,
        status: deploymentResult.success ? 'success' : 'failed',
        deployment_time: new Date().toISOString(),
        metadata: deploymentResult
      })

    return new Response(
      JSON.stringify({
        success: true,
        agent,
        deployment: deploymentResult
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Workflow Deployer Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function deployToContainer(
  containerId: string, 
  template: any, 
  configuration: any, 
  userId: string
) {
  // In production, this would:
  // 1. Get user credentials from vault
  // 2. Generate n8n workflow JSON with injected credentials
  // 3. Deploy to dedicated container via Cloud Run API
  // 4. Configure webhooks and triggers
  
  const workflowId = `wf_${Date.now()}`
  
  // Simulate deployment process
  console.log(`Deploying to container ${containerId}:`, {
    template: template.name,
    configuration,
    userId
  })

  // Simulate workflow creation in n8n
  const workflowDefinition = {
    id: workflowId,
    name: template.name,
    nodes: template.configuration.nodes || [],
    connections: template.configuration.connections || {},
    settings: {
      executionOrder: 'v1'
    },
    staticData: {},
    meta: {
      templateId: template.id,
      userId: userId,
      deployedAt: new Date().toISOString()
    }
  }

  // In production, make API call to n8n container
  // await fetch(`${containerUrl}/api/v1/workflows`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(workflowDefinition)
  // })

  return {
    success: true,
    workflowId,
    containerUrl: `https://${containerId}.run.app`,
    deployedAt: new Date().toISOString(),
    workflow: workflowDefinition
  }
}
