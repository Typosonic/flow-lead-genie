
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface N8nWorkflow {
  name: string;
  nodes: any[];
  connections: any;
  active: boolean;
  settings?: any;
  staticData?: any;
  meta?: any;
  pinData?: any;
  versionId?: string;
}

// Simple ZIP file parser for extracting JSON files
async function extractJsonFiles(zipData: Uint8Array): Promise<Record<string, any>> {
  const decoder = new TextDecoder();
  const files: Record<string, any> = {};
  
  try {
    // Look for JSON files in the ZIP data
    // This is a simplified approach - we'll look for JSON patterns in the data
    const zipString = decoder.decode(zipData);
    
    // Split by common ZIP file separators and look for JSON content
    const chunks = zipString.split('\x00').filter(chunk => chunk.length > 10);
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      
      // Look for JSON patterns
      const jsonStart = chunk.indexOf('{');
      const jsonEnd = chunk.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        try {
          const jsonContent = chunk.substring(jsonStart, jsonEnd + 1);
          const parsed = JSON.parse(jsonContent);
          
          // Check if it looks like an n8n workflow
          if (parsed.nodes && Array.isArray(parsed.nodes)) {
            const filename = `workflow_${i}.json`;
            files[filename] = new TextEncoder().encode(jsonContent);
          }
        } catch (e) {
          // Not valid JSON, continue
          continue;
        }
      }
    }
    
    return files;
  } catch (error) {
    console.error('Error extracting files:', error);
    throw new Error('Failed to extract ZIP contents');
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { packageId } = await req.json();

    if (!packageId) {
      return new Response(
        JSON.stringify({ error: 'Package ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing package: ${packageId}`);

    // Get the package details
    const { data: packageData, error: packageError } = await supabaseClient
      .from('agent_packages')
      .select('*')
      .eq('id', packageId)
      .single();

    if (packageError || !packageData) {
      console.error('Package not found:', packageError);
      return new Response(
        JSON.stringify({ error: 'Package not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Download the ZIP file from storage
    const { data: fileData, error: downloadError } = await supabaseClient.storage
      .from('agent-packages')
      .download(packageData.file_path);

    if (downloadError || !fileData) {
      console.error('Failed to download file:', downloadError);
      await supabaseClient
        .from('agent_packages')
        .update({ status: 'failed' })
        .eq('id', packageId);
      
      return new Response(
        JSON.stringify({ error: 'Failed to download package file' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('File downloaded successfully, extracting...');

    // Convert blob to Uint8Array for extraction
    const arrayBuffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    let extractedFiles: any = {};
    try {
      extractedFiles = await extractJsonFiles(uint8Array);
    } catch (extractError) {
      console.error('Failed to extract file:', extractError);
      await supabaseClient
        .from('agent_packages')
        .update({ status: 'failed' })
        .eq('id', packageId);
      
      return new Response(
        JSON.stringify({ error: 'Failed to extract ZIP file' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Files extracted, processing workflows...');

    const workflows: N8nWorkflow[] = [];
    let processedCount = 0;

    // Process all files in the extracted archive
    for (const [filePath, fileContent] of Object.entries(extractedFiles)) {
      // Skip directories and non-JSON files
      if (typeof fileContent !== 'object' || !filePath.endsWith('.json')) {
        continue;
      }

      try {
        // Convert Uint8Array to string and parse JSON
        const jsonString = new TextDecoder().decode(fileContent as Uint8Array);
        const workflowData = JSON.parse(jsonString);

        // Validate if it's an n8n workflow
        if (workflowData.nodes && Array.isArray(workflowData.nodes)) {
          workflows.push({
            name: workflowData.name || `Workflow ${processedCount + 1}`,
            nodes: workflowData.nodes,
            connections: workflowData.connections || {},
            active: workflowData.active || false,
            settings: workflowData.settings || {},
            staticData: workflowData.staticData || {},
            meta: workflowData.meta || {},
            pinData: workflowData.pinData || {},
            versionId: workflowData.versionId || '1'
          });
          
          console.log(`Found workflow: ${workflowData.name || `Workflow ${processedCount + 1}`}`);
          processedCount++;
        }
      } catch (parseError) {
        console.warn(`Failed to parse JSON file ${filePath}:`, parseError);
        continue;
      }
    }

    console.log(`Processed ${workflows.length} workflows`);

    if (workflows.length === 0) {
      await supabaseClient
        .from('agent_packages')
        .update({ status: 'failed' })
        .eq('id', packageId);
      
      return new Response(
        JSON.stringify({ error: 'No valid n8n workflows found in package' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert extracted workflows
    const extractedWorkflows = workflows.map(workflow => ({
      package_id: packageId,
      workflow_name: workflow.name,
      workflow_data: workflow,
      status: 'extracted'
    }));

    const { error: insertError } = await supabaseClient
      .from('extracted_workflows')
      .insert(extractedWorkflows);

    if (insertError) {
      console.error('Failed to insert workflows:', insertError);
      await supabaseClient
        .from('agent_packages')
        .update({ status: 'failed' })
        .eq('id', packageId);
      
      return new Response(
        JSON.stringify({ error: 'Failed to save extracted workflows' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Convert workflows to public agent templates
    for (const workflow of workflows) {
      const description = `Automated n8n workflow: ${workflow.name}. Contains ${workflow.nodes.length} nodes.`;
      const category = determineCategory(workflow);
      
      // Create agent template
      const { data: templateData, error: templateError } = await supabaseClient
        .from('agent_templates')
        .insert({
          name: workflow.name,
          description: description,
          category: category,
          configuration: {
            type: 'n8n-workflow',
            workflow_data: workflow,
            node_count: workflow.nodes.length,
            source: 'user-upload'
          },
          prompt_template: generatePromptFromWorkflow(workflow),
          is_public: true,
          created_by: packageData.user_id,
          usage_count: 0
        })
        .select()
        .single();

      if (!templateError && templateData) {
        // Update extracted workflow with template reference
        await supabaseClient
          .from('extracted_workflows')
          .update({ 
            template_id: templateData.id,
            status: 'completed'
          })
          .eq('package_id', packageId)
          .eq('workflow_name', workflow.name);
      }
    }

    // Update package status
    await supabaseClient
      .from('agent_packages')
      .update({ 
        status: 'completed',
        agent_count: workflows.length
      })
      .eq('id', packageId);

    console.log(`Successfully processed ${workflows.length} workflows`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully processed ${workflows.length} workflows`,
        workflows: workflows.length
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing package:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function determineCategory(workflow: N8nWorkflow): string {
  const workflowName = workflow.name.toLowerCase();
  const nodeTypes = workflow.nodes.map(node => node.type?.toLowerCase() || '');
  
  // Determine category based on workflow name and node types
  if (workflowName.includes('sdr') || workflowName.includes('sales')) {
    return 'SDR';
  } else if (workflowName.includes('chat') || workflowName.includes('bot')) {
    return 'Chatbot';
  } else if (workflowName.includes('voice') || workflowName.includes('call')) {
    return 'Voice';
  } else if (workflowName.includes('content') || workflowName.includes('social')) {
    return 'Content';
  } else if (workflowName.includes('ad') || workflowName.includes('marketing')) {
    return 'Ads';
  } else if (workflowName.includes('real estate') || workflowName.includes('property')) {
    return 'Real Estate';
  }
  
  // Check node types for additional hints
  if (nodeTypes.some(type => type.includes('webhook') || type.includes('http'))) {
    return 'SDR';
  } else if (nodeTypes.some(type => type.includes('telegram') || type.includes('slack'))) {
    return 'Chatbot';
  }
  
  return 'Other';
}

function generatePromptFromWorkflow(workflow: N8nWorkflow): string {
  const nodeCount = workflow.nodes.length;
  const hasWebhook = workflow.nodes.some(node => node.type?.toLowerCase().includes('webhook'));
  const hasHttp = workflow.nodes.some(node => node.type?.toLowerCase().includes('http'));
  
  let prompt = `You are an AI agent powered by the n8n workflow "${workflow.name}". `;
  
  if (hasWebhook) {
    prompt += 'You can receive webhooks and process incoming data automatically. ';
  }
  
  if (hasHttp) {
    prompt += 'You can make HTTP requests to external APIs and services. ';
  }
  
  prompt += `This workflow contains ${nodeCount} nodes that handle various automation tasks. `;
  prompt += 'You should help users understand how to use this automation and assist with any related questions.';
  
  return prompt;
}
