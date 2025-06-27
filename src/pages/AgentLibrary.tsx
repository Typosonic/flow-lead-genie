import { useState, useEffect } from "react";
import { Bot, MessageSquare, Phone, Search, Zap, Filter, Play, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateAgentDialog from "@/components/CreateAgentDialog";
import UserAgentsSection from "@/components/UserAgentsSection";
import AgentPackageUpload from "@/components/AgentPackageUpload";
import AgentPackagesList from "@/components/AgentPackagesList";
import { useAgentTemplates } from "@/hooks/useAgentTemplates";
import { useDeployAgent } from "@/hooks/useDeployAgent";
import { useAgentPackages } from "@/hooks/useAgentPackages";
import N8nWorkflowUpload from "@/components/N8nWorkflowUpload";

const AgentLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: templates, isLoading: templatesLoading, refetch: refetchTemplates } = useAgentTemplates();
  const { data: packages } = useAgentPackages();
  const deployAgent = useDeployAgent();

  // Refresh templates when packages are processed
  useEffect(() => {
    if (packages && packages.some(pkg => pkg.status === 'completed')) {
      refetchTemplates();
    }
  }, [packages, refetchTemplates]);

  const categories = ["All", "SDR", "Chatbot", "Voice", "Content", "Ads", "Real Estate"];

  // Static template agents for demonstration
  const staticTemplates = [
    {
      id: "static-1",
      name: "Ad-Flow Agent",
      description: "Automatically follow up with Facebook leads via SMS and voice calls",
      category: "Ads",
      icon: "🎯",
      features: ["SMS Follow-up", "Voice Calls", "Booking Integration"],
      deployment: "5 min",
      popularity: "Most Popular",
      configuration: { type: "ad-flow", automation: true },
      prompt_template: "You are an AI assistant specialized in following up with Facebook ad leads..."
    },
    {
      id: "static-2",
      name: "Real Estate SDR",
      description: "Qualify leads and book property viewings automatically",
      category: "Real Estate",
      icon: "🏠",
      features: ["Lead Qualification", "Appointment Booking", "Follow-up Sequences"],
      deployment: "3 min",
      popularity: null,
      configuration: { type: "real-estate-sdr", qualification: true },
      prompt_template: "You are a real estate sales development representative..."
    },
    {
      id: "static-3",
      name: "E-commerce Chatbot",
      description: "Handle customer inquiries and abandoned cart recovery",
      category: "Chatbot",
      icon: "🛒",
      features: ["24/7 Support", "Cart Recovery", "Product Recommendations"],
      deployment: "2 min",
      popularity: null,
      configuration: { type: "ecommerce-chatbot", support: true },
      prompt_template: "You are an e-commerce customer support specialist..."
    },
    {
      id: "static-4",
      name: "Service Business SDR",
      description: "Convert service inquiries into booked consultations",
      category: "SDR",
      icon: "🔧",
      features: ["Consultation Booking", "Service Qualification", "Price Quotes"],
      deployment: "4 min",
      popularity: "Trending",
      configuration: { type: "service-sdr", booking: true },
      prompt_template: "You are a service business sales representative..."
    },
    {
      id: "static-5",
      name: "Content Creator Assistant",
      description: "Engage with potential clients and book content creation calls",
      category: "Content",
      icon: "📸",
      features: ["Portfolio Sharing", "Package Explanation", "Call Booking"],
      deployment: "3 min",
      popularity: null,
      configuration: { type: "content-creator", portfolio: true },
      prompt_template: "You are a content creation specialist..."
    },
    {
      id: "static-6",
      name: "Voice-First Sales Agent",
      description: "Prioritizes voice calls for high-touch sales processes",
      category: "Voice",
      icon: "🎙️",
      features: ["Voice-First Approach", "Call Scripts", "CRM Integration"],
      deployment: "6 min",
      popularity: null,
      configuration: { type: "voice-sales", calls: true },
      prompt_template: "You are a voice-first sales specialist..."
    }
  ];

  // Combine static templates with database templates
  const allTemplates = [
    ...staticTemplates,
    ...(templates || []).map(t => {
      // Properly type the configuration object
      const config = t.configuration as Record<string, any> | null;
      const isUserUpload = config?.source === 'user-upload';
      
      return {
        id: t.id,
        name: t.name,
        description: t.description,
        category: t.category || "Other",
        icon: isUserUpload ? "📦" : "🤖",
        features: isUserUpload 
          ? [`${config?.node_count || 0} n8n nodes`, "User Created"]
          : ["Custom Template"],
        deployment: "2 min",
        popularity: t.usage_count > 10 ? "Popular" : isUserUpload ? "Community" : null,
        configuration: t.configuration,
        prompt_template: t.prompt_template
      };
    })
  ];

  const filteredTemplates = allTemplates.filter(template => {
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      "SDR": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "Chatbot": "bg-green-500/20 text-green-400 border-green-500/30",
      "Voice": "bg-purple-500/20 text-purple-400 border-purple-500/30",
      "Content": "bg-pink-500/20 text-pink-400 border-pink-500/30",
      "Ads": "bg-orange-500/20 text-orange-400 border-orange-500/30",
      "Real Estate": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    };
    return colors[category as keyof typeof colors] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  const handleDeploy = (template: any) => {
    deployAgent.mutate({
      id: template.id.startsWith('static-') ? undefined : template.id,
      name: template.name,
      description: template.description,
      configuration: template.configuration,
      prompt_template: template.prompt_template
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Agent Library</h1>
          <p className="text-muted-foreground">Deploy proven AI automation workflows or create custom agents</p>
        </div>
        
        <div className="flex items-center gap-4">
          <CreateAgentDialog />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 bg-background/50 border-border/40"
            />
          </div>
        </div>
      </div>

      {/* User Agents Section */}
      <UserAgentsSection />

      <Separator className="my-8" />

      {/* Main Content Tabs */}
      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates" data-value="templates">Template Library</TabsTrigger>
          <TabsTrigger value="workflows">Upload Workflows</TabsTrigger>
          <TabsTrigger value="packages">Upload Packages</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Template Library</h2>
            <p className="text-muted-foreground">Ready-to-deploy agent templates from the community and our library</p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category 
                    ? 'bg-brand-500 hover:bg-brand-600' 
                    : 'border-border/40 hover:bg-muted/20'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="glass-morphism border-border/40 card-hover group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{template.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getCategoryColor(template.category)}>
                            {template.category}
                          </Badge>
                          {template.popularity && (
                            <Badge variant="outline" className="border-brand-500/30 text-brand-400">
                              {template.popularity}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-sm">{template.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Features */}
                  <div>
                    <p className="text-sm font-medium mb-2">Key Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.features.map((feature, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="text-xs bg-muted/30 border-border/40"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Deployment Time */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Deployment time:</span>
                    <span className="font-medium">{template.deployment}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 btn-gradient rounded-xl group-hover:scale-[1.02] transition-all duration-200"
                      onClick={() => handleDeploy(template)}
                      disabled={deployAgent.isPending}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      {deployAgent.isPending ? 'Deploying...' : 'Deploy'}
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-xl border-border/40">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredTemplates.length === 0 && !templatesLoading && (
            <div className="text-center py-12">
              <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No templates found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Upload n8n Workflows</h2>
            <p className="text-muted-foreground">Upload individual n8n workflow JSON files to create agent templates instantly</p>
          </div>

          <div className="max-w-4xl">
            <N8nWorkflowUpload />
          </div>
        </TabsContent>

        <TabsContent value="packages" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Agent Packages</h2>
            <p className="text-muted-foreground">Upload and manage your n8n agent workflow packages</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <AgentPackageUpload />
            <div className="xl:col-span-1">
              <AgentPackagesList />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentLibrary;
