
import { Bot, MessageSquare, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import AgentStatusToggle from "@/components/AgentStatusToggle";
import RecentLeadsCard from "@/components/RecentLeadsCard";
import StatsGrid from "@/components/StatsGrid";
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
          <p className="text-muted-foreground">Monitor your AI agent performance</p>
        </div>
        
        <AgentStatusToggle />
      </div>

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
      </div>
    </div>
  );
};

export default Dashboard;
