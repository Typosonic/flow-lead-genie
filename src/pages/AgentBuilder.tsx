
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, Wand2, Download, Copy, Sparkles, MessageSquare, User, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface GeneratedAgent {
  name: string;
  description: string;
  workflow: string;
  estimatedSetupTime: string;
  requiredIntegrations: string[];
}

const AgentBuilder = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI Agent Builder. Tell me about your business challenge and I'll create a custom n8n automation workflow for you. For example:\n\n• 'I need to follow up with leads from my website contact form'\n• 'I want to automate customer support tickets'\n• 'I need to sync data between my CRM and email marketing tool'\n\nWhat would you like to automate?",
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [claudeApiKey, setClaudeApiKey] = useState('');
  const [generatedAgent, setGeneratedAgent] = useState<GeneratedAgent | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    if (!claudeApiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Claude API key to chat with the AI agent builder.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': claudeApiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1000,
          messages: [
            {
              role: 'system',
              content: `You are an expert n8n workflow automation consultant. Help users create custom AI agents and automation workflows. 

When a user describes their business problem:
1. Ask clarifying questions if needed
2. Suggest a specific n8n workflow solution
3. Provide step-by-step setup instructions
4. List required integrations and tools
5. Estimate setup time

Focus on practical, actionable solutions using n8n's built-in nodes and popular integrations like:
- Webhook triggers
- HTTP requests
- Email sending
- Database operations
- SMS/WhatsApp
- Google Sheets
- CRM integrations
- AI/LLM nodes

Be conversational and helpful. If the user's request is complex, break it down into phases.`
            },
            ...messages.map(msg => ({
              role: msg.role === 'user' ? 'user' : 'assistant',
              content: msg.content
            })),
            {
              role: 'user',
              content: currentMessage
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content[0].text,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Try to extract agent details if the response contains a workflow suggestion
      if (data.content[0].text.includes('workflow') || data.content[0].text.includes('automation')) {
        // This is a simplified extraction - in a real app you'd use more sophisticated parsing
        const lines = data.content[0].text.split('\n');
        const nameMatch = lines.find(line => line.toLowerCase().includes('name:') || line.toLowerCase().includes('workflow:'));
        
        if (nameMatch) {
          setGeneratedAgent({
            name: nameMatch.split(':')[1]?.trim() || 'Custom Agent',
            description: data.content[0].text.substring(0, 200) + '...',
            workflow: data.content[0].text,
            estimatedSetupTime: '30-60 minutes',
            requiredIntegrations: ['n8n', 'Webhooks']
          });
        }
      }

    } catch (error) {
      console.error('Error calling Claude API:', error);
      toast({
        title: "Error",
        description: "Failed to get response from Claude AI. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyWorkflow = () => {
    if (generatedAgent) {
      navigator.clipboard.writeText(generatedAgent.workflow);
      toast({
        title: "Copied!",
        description: "Workflow instructions copied to clipboard.",
      });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600">
            <Wand2 className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Custom Agent Builder
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Describe your business challenge and get a custom n8n automation workflow powered by Claude AI. 
          From lead follow-up to customer support - we'll build the perfect agent for your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b border-border/40">
              <div className="flex items-center gap-3">
                <Bot className="h-5 w-5 text-purple-500" />
                <div>
                  <CardTitle className="text-lg">AI Agent Builder Chat</CardTitle>
                  <CardDescription>Powered by Claude AI</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                          <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white ml-auto'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      {message.role === 'user' && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                        <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400 animate-pulse" />
                      </div>
                      <div className="rounded-2xl px-4 py-2 bg-muted">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"></div>
                          <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>
              
              <div className="border-t border-border/40 p-4">
                <div className="flex gap-2">
                  <Textarea
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe your automation challenge..."
                    className="flex-1 min-h-[60px] resize-none"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!currentMessage.trim() || isLoading}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* API Key Input */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                Claude AI Setup
              </CardTitle>
              <CardDescription>
                Enter your Claude API key to start building custom agents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="api-key">Claude API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={claudeApiKey}
                  onChange={(e) => setClaudeApiKey(e.target.value)}
                  placeholder="sk-ant-api03-..."
                  className="mt-1"
                />
              </div>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  <p className="font-medium mb-1">Get your free Claude API key:</p>
                  <p>1. Visit console.anthropic.com</p>
                  <p>2. Sign up for a free account</p>
                  <p>3. Generate an API key</p>
                  <p>4. Paste it above to start chatting</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generated Agent */}
          {generatedAgent && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-500" />
                  Generated Agent
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">{generatedAgent.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {generatedAgent.description}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Setup Time:</span>
                    <Badge variant="outline">{generatedAgent.estimatedSetupTime}</Badge>
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground">Required:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {generatedAgent.requiredIntegrations.map((integration, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {integration}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={copyWorkflow} variant="outline" size="sm" className="flex-1">
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                    <Download className="h-3 w-3 mr-1" />
                    Deploy
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Example Prompts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                Example Prompts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                "Follow up with website leads via SMS and email",
                "Automate customer support ticket routing",
                "Sync CRM data with email marketing platform",
                "Create a social media content scheduler",
                "Build an inventory management system"
              ].map((prompt, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full text-left justify-start h-auto p-3 text-wrap"
                  onClick={() => setCurrentMessage(prompt)}
                  disabled={isLoading}
                >
                  <span className="text-xs">{prompt}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgentBuilder;
