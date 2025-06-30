
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Facebook, MessageSquare, Phone, Zap, CheckCircle, AlertCircle, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CampaignIntegration = () => {
  const [connections, setConnections] = useState({
    facebook: false,
    sms: false,
    voice: false,
    calendar: false
  });
  const { toast } = useToast();

  const handleConnect = (service: string) => {
    setConnections(prev => ({ ...prev, [service]: true }));
    toast({
      title: "Integration connected",
      description: `${service} integration has been successfully connected.`,
    });
  };

  const integrations = [
    {
      id: "facebook",
      name: "Facebook Ads",
      description: "Connect your Facebook Ads account to automatically capture leads",
      icon: Facebook,
      status: connections.facebook ? "connected" : "disconnected",
      color: "blue"
    },
    {
      id: "sms", 
      name: "SMS Service",
      description: "Set up SMS messaging for lead follow-up",
      icon: MessageSquare,
      status: connections.sms ? "connected" : "disconnected", 
      color: "green"
    },
    {
      id: "voice",
      name: "Voice Calling",
      description: "Configure voice calling capabilities",
      icon: Phone,
      status: connections.voice ? "connected" : "disconnected",
      color: "purple"
    },
    {
      id: "calendar",
      name: "Calendar Booking",
      description: "Integrate calendar for automatic appointment booking",
      icon: Zap,
      status: connections.calendar ? "connected" : "disconnected",
      color: "orange"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Campaign Integrations</h2>
        <p className="text-muted-foreground">Connect your marketing tools to supercharge your Facebook ad campaigns</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="facebook">Facebook Setup</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => {
              const Icon = integration.icon;
              return (
                <Card key={integration.id} className="glass-morphism border-border/40">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-${integration.color}-500/20`}>
                          <Icon className={`h-5 w-5 text-${integration.color}-500`} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{integration.name}</h3>
                          <Badge className={integration.status === 'connected' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                            {integration.status === 'connected' ? (
                              <><CheckCircle className="h-3 w-3 mr-1" /> Connected</>
                            ) : (
                              <><AlertCircle className="h-3 w-3 mr-1" /> Not Connected</>
                            )}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>
                    <Button 
                      className="w-full"
                      variant={integration.status === 'connected' ? 'outline' : 'default'}
                      onClick={() => handleConnect(integration.id)}
                      disabled={integration.status === 'connected'}
                    >
                      {integration.status === 'connected' ? 'Configure' : 'Connect'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="facebook" className="space-y-4">
          <Card className="glass-morphism border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Facebook className="h-5 w-5 text-blue-500" />
                Facebook Ads Integration
              </CardTitle>
              <CardDescription>Connect your Facebook Ads account to automatically capture and process leads</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fb-access-token">Access Token</Label>
                <Input id="fb-access-token" placeholder="Enter your Facebook Access Token" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fb-ad-account">Ad Account ID</Label>
                <Input id="fb-ad-account" placeholder="act_1234567890" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fb-page-id">Page ID</Label>
                <Input id="fb-page-id" placeholder="Enter your Facebook Page ID" />
              </div>
              <Button className="w-full btn-gradient">
                Connect Facebook Ads
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-border/40">
            <CardHeader>
              <CardTitle>Lead Form Mapping</CardTitle>
              <CardDescription>Map Facebook lead form fields to your CRM</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Facebook Field</Label>
                  <div className="space-y-2 mt-2">
                    <div className="p-2 bg-muted rounded text-sm">full_name</div>
                    <div className="p-2 bg-muted rounded text-sm">email</div>
                    <div className="p-2 bg-muted rounded text-sm">phone_number</div>
                  </div>
                </div>
                <div>
                  <Label>CRM Field</Label>
                  <div className="space-y-2 mt-2">
                    <Input placeholder="Name" />
                    <Input placeholder="Email" />
                    <Input placeholder="Phone" />
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Field Mapping
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass-morphism border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-green-500" />
                  SMS Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sms-provider">SMS Provider</Label>
                  <select className="w-full p-2 border rounded-md bg-background">
                    <option>Twilio</option>
                    <option>MessageBird</option>
                    <option>Plivo</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sms-number">From Number</Label>
                  <Input id="sms-number" placeholder="+1234567890" />
                </div>
                <Button className="w-full">Configure SMS</Button>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-purple-500" />
                  Voice Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="voice-provider">Voice Provider</Label>
                  <select className="w-full p-2 border rounded-md bg-background">
                    <option>Twilio Voice</option>
                    <option>Vonage</option>
                    <option>AWS Connect</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="voice-number">Call From Number</Label>
                  <Input id="voice-number" placeholder="+1234567890" />
                </div>
                <Button className="w-full">Configure Voice</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card className="glass-morphism border-border/40">
            <CardHeader>
              <CardTitle>Automation Rules</CardTitle>
              <CardDescription>Set up intelligent automation workflows for your campaigns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">New Lead Response</h4>
                  <p className="text-sm text-muted-foreground mb-3">Automatically respond to new Facebook leads within 5 minutes</p>
                  <div className="flex items-center gap-2">
                    <Badge>SMS First</Badge>
                    <Badge>Call if No Response</Badge>
                    <Badge>Book Calendar</Badge>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Follow-up Sequence</h4>
                  <p className="text-sm text-muted-foreground mb-3">Multi-touch follow-up for unresponsive leads</p>
                  <div className="flex items-center gap-2">
                    <Badge>Day 1: SMS</Badge>
                    <Badge>Day 3: Call</Badge>
                    <Badge>Day 7: Final SMS</Badge>
                  </div>
                </div>
              </div>
              
              <Button className="w-full btn-gradient">
                <Plus className="h-4 w-4 mr-2" />
                Create New Rule
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignIntegration;
