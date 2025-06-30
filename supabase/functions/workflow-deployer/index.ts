
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
      throw new Error('Invalid authentication')
    }

    const { templateId, agentName, configuration, credentials }: WorkflowDeployRequest = await req.json()

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

    // Check if user has a container, if not deploy one
    let { data: container, error: containerError } = await supabase
      .from('user_containers')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (containerError) {
      // Deploy container first via container-manager
      const { data: deployResult } = await supabase.functions.invoke('container-manager', {
        body: {
          action: 'deploy',
          workflowId: `template_${templateId}`,
          credentials
        }
      })

      // Get the newly created container
      const { data: newContainer } = await supabase
        .from('user_containers')
        .select('*')
        .eq('user_id', user.id)
        .single()

      container = newContainer
    }

    if (!container) {
      throw new Error('Failed to create or retrieve container')
    }

    // Store credentials if provided
    if (credentials) {
      for (const [serviceName, credential] of Object.entries(credentials)) {
        await supabase
          .from('user_credentials')
          .upsert({
            user_id: user.id,
            service_name: serviceName,
            encrypted_credentials: JSON.stringify(credential), // In production, encrypt this properly
          })
      }
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

    // Deploy to container
    const deploymentResult = await deployToContainer(
      container.container_id,
      template,
      configuration,
      user.id,
      agent.id
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
        status: deploymentResult.success ? 'completed' : 'failed',
        deployment_time: new Date().toISOString(),
        metadata: deploymentResult
      })

    // Log container event
    await supabase
      .from('container_events')
      .insert({
        user_id: user.id,
        container_id: container.container_id,
        event_type: 'workflow_deployed',
        workflow_id: deploymentResult.workflowId,
        metadata: {
          agent_id: agent.id,
          template_id: templateId,
          deployment_success: deploymentResult.success
        }
      })

    return new Response(
      JSON.stringify({
        success: true,
        agent,
        container,
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
  userId: string,
  agentId: string
) {
  const workflowId = `wf_${agentId}_${Date.now()}`
  
  console.log(`Deploying to container ${containerId}:`, {
    template: template.name,
    configuration,
    userId,
    agentId
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
      agentId: agentId,
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
