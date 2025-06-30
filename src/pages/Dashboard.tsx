
import { Bot, MessageSquare, Zap, TrendingUp, Users, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AgentStatusToggle from "@/components/AgentStatusToggle";
import RecentLeadsCard from "@/components/RecentLeadsCard";
import StatsGrid from "@/components/StatsGrid";
import AgentPerformanceDashboard from "@/components/AgentPerformanceDashboard";
import CampaignIntegration from "@/components/CampaignIntegration";
import LeadManagement from "@/components/LeadManagement";
import { useCreateAgent } from "@/hooks/useAgents";

const Dashboard = () => {
  const createAgent = useCreateAgent();

  const handleDeployAgent = () => {
    createAgent.mutate({
      name: "Quick Agent",
      description: "Quickly deployed agent for lead generation"
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Monitor your AI agent performance and campaign results</p>
        </div>
        
        <AgentStatusToggle />
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <StatsGrid />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Leads */}
            <RecentLeadsCard />

            {/* Quick Actions & Performance */}
            <div className="space-y-6">
              {/* Quick Deploy */}
              <Card className="glass-morphism border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Deploy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full btn-gradient rounded-xl py-6"
                    onClick={handleDeployAgent}
                    disabled={createAgent.isPending}
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    {createAgent.isPending ? 'Deploying...' : 'Deploy New Agent'}
                  </Button>
                  <Button variant="outline" className="w-full rounded-xl py-3 border-border/40">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    View Templates
                  </Button>
                </CardContent>
              </Card>

              {/* Performance Overview */}
              <Card className="glass-morphism border-border/40">
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                  <CardDescription>This week's overview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Lead Response Rate</span>
                      <span>68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Call Success Rate</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Booking Conversion</span>
                      <span>32%</span>
                    </div>
                    <Progress value={32} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Campaign Summary */}
            <Card className="glass-morphism border-border/40">
              <CardHeader>
                <CardTitle>Active Campaigns</CardTitle>
                <CardDescription>Facebook ad campaigns performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Home Services Lead Gen</p>
                      <p className="text-sm text-muted-foreground">24 leads today</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-500">$2.40</p>
                      <p className="text-xs text-muted-foreground">Cost/Lead</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Real Estate Listings</p>
                      <p className="text-sm text-muted-foreground">18 leads today</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-500">$3.20</p>
                      <p className="text-xs text-muted-foreground">Cost/Lead</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">E-commerce Products</p>
                      <p className="text-sm text-muted-foreground">31 leads today</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-500">$1.80</p>
                      <p className="text-xs text-muted-foreground">Cost/Lead</p>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  View All Campaigns
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <AgentPerformanceDashboard />
        </TabsContent>

        <TabsContent value="leads">
          <LeadManagement />
        </TabsContent>

        <TabsContent value="integrations">
          <CampaignIntegration />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
