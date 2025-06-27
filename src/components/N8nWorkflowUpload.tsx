
import { useState, useCallback } from 'react';
import { Upload, File, X, Plus, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCreateAgentTemplates } from '@/hooks/useCreateAgentTemplates';

interface WorkflowFile {
  file: File;
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  name?: string;
  nodeCount?: number;
}

const N8nWorkflowUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<WorkflowFile[]>([]);
  const createTemplates = useCreateAgentTemplates();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const jsonFiles = files.filter(file => 
      file.type === 'application/json' || file.name.endsWith('.json')
    );

    const newWorkflowFiles: WorkflowFile[] = jsonFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending' as const,
    }));

    setSelectedFiles(prev => [...prev, ...newWorkflowFiles]);
  };

  const removeFile = (id: string) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== id));
  };

  const processFiles = async () => {
    const filesToProcess = selectedFiles.filter(f => f.status === 'pending');
    
    for (const workflowFile of filesToProcess) {
      // Update status to processing
      setSelectedFiles(prev => 
        prev.map(f => f.id === workflowFile.id ? { ...f, status: 'processing' } : f)
      );

      try {
        // Read and parse the JSON file
        const text = await workflowFile.file.text();
        const workflowData = JSON.parse(text);

        // Validate it's an n8n workflow
        if (!workflowData.nodes || !Array.isArray(workflowData.nodes)) {
          throw new Error('Invalid n8n workflow format');
        }

        // Extract workflow name from filename or workflow data
        const workflowName = workflowData.name || 
          workflowFile.file.name.replace('.json', '').replace(/[-_]/g, ' ');

        // Update file info
        setSelectedFiles(prev => 
          prev.map(f => f.id === workflowFile.id ? { 
            ...f, 
            name: workflowName,
            nodeCount: workflowData.nodes.length 
          } : f)
        );

        // Create agent template
        await createTemplates.mutateAsync({
          name: workflowName,
          description: `n8n workflow: ${workflowName}. Contains ${workflowData.nodes.length} nodes.`,
          category: determineCategory(workflowName, workflowData),
          configuration: {
            type: 'n8n-workflow',
            workflow_data: workflowData,
            node_count: workflowData.nodes.length,
            source: 'direct-upload'
          },
          prompt_template: generatePromptFromWorkflow(workflowData),
          is_public: true
        });

        // Update status to completed
        setSelectedFiles(prev => 
          prev.map(f => f.id === workflowFile.id ? { ...f, status: 'completed' } : f)
        );

      } catch (error) {
        console.error('Error processing workflow:', error);
        setSelectedFiles(prev => 
          prev.map(f => f.id === workflowFile.id ? { ...f, status: 'error' } : f)
        );
      }
    }
  };

  const determineCategory = (name: string, workflow: any): string => {
    const workflowName = name.toLowerCase();
    const nodeTypes = workflow.nodes?.map((node: any) => node.type?.toLowerCase() || '') || [];
    
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
    
    if (nodeTypes.some((type: string) => type.includes('webhook') || type.includes('http'))) {
      return 'SDR';
    } else if (nodeTypes.some((type: string) => type.includes('telegram') || type.includes('slack'))) {
      return 'Chatbot';
    }
    
    return 'Other';
  };

  const generatePromptFromWorkflow = (workflow: any): string => {
    const nodeCount = workflow.nodes?.length || 0;
    const hasWebhook = workflow.nodes?.some((node: any) => 
      node.type?.toLowerCase().includes('webhook')
    ) || false;
    const hasHttp = workflow.nodes?.some((node: any) => 
      node.type?.toLowerCase().includes('http')
    ) || false;
    
    let prompt = `You are an AI agent powered by the n8n workflow "${workflow.name || 'Untitled Workflow'}". `;
    
    if (hasWebhook) {
      prompt += 'You can receive webhooks and process incoming data automatically. ';
    }
    
    if (hasHttp) {
      prompt += 'You can make HTTP requests to external APIs and services. ';
    }
    
    prompt += `This workflow contains ${nodeCount} nodes that handle various automation tasks. `;
    prompt += 'You should help users understand how to use this automation and assist with any related questions.';
    
    return prompt;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const canProcess = selectedFiles.some(f => f.status === 'pending');
  const hasCompleted = selectedFiles.some(f => f.status === 'completed');

  return (
    <Card className="glass-morphism border-border/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload n8n Workflows
        </CardTitle>
        <CardDescription>
          Upload individual n8n workflow JSON files to create agent templates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-brand-500 bg-brand-500/10' 
              : 'border-border/40 hover:border-border/60'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium mb-2">Drop n8n workflow files here</p>
          <p className="text-sm text-muted-foreground mb-3">or click to browse (.json files only)</p>
          <input
            type="file"
            accept=".json,application/json"
            onChange={handleFileSelect}
            className="hidden"
            id="workflow-upload"
            multiple
          />
          <label htmlFor="workflow-upload">
            <Button variant="outline" className="cursor-pointer" asChild>
              <span>
                <Plus className="h-4 w-4 mr-2" />
                Select Files
              </span>
            </Button>
          </label>
        </div>

        {/* File List */}
        {selectedFiles.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Selected Workflows ({selectedFiles.length})</h4>
              {canProcess && (
                <Button 
                  onClick={processFiles}
                  disabled={createTemplates.isPending}
                  size="sm"
                >
                  {createTemplates.isPending ? 'Processing...' : 'Create Templates'}
                </Button>
              )}
            </div>

            {selectedFiles.map((workflowFile) => (
              <div key={workflowFile.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <File className="h-6 w-6 text-brand-500" />
                  <div>
                    <p className="font-medium">
                      {workflowFile.name || workflowFile.file.name}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{formatFileSize(workflowFile.file.size)}</span>
                      {workflowFile.nodeCount && (
                        <>
                          <span>•</span>
                          <span>{workflowFile.nodeCount} nodes</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(workflowFile.status)}>
                    {workflowFile.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {workflowFile.status}
                  </Badge>
                  {workflowFile.status === 'pending' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(workflowFile.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {hasCompleted && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-sm text-green-400">
              ✅ Templates created successfully! Check the Template Library to see your new agents.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default N8nWorkflowUpload;
