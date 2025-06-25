
import { useState } from "react";
import { Bot, Calendar, MessageSquare, Phone, TrendingUp, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const [agentActive, setAgentActive] = useState(true);

  const stats = [
    {
      title: "Leads Today",
      value: "24",
      change: "+12%",
      icon: Users,
      color: "text-green-500"
    },
    {
      title: "Calls Placed",
      value: "18",
      change: "+8%",
      icon: Phone,
      color: "text-brand-500"
    },
    {
      title: "Bookings",
      value: "7",
      change: "+15%",
      icon: Calendar,
      color: "text-purple-500"
    },
    {
      title: "Response Rate",
      value: "68%",
      change: "+5%",
      icon: TrendingUp,
      color: "text-orange-500"
    }
  ];

  const recentLeads = [
    {
      name: "Sarah Johnson",
      phone: "+1 (555) 123-4567",
      source: "Facebook Ad",
      status: "SMS Sent",
      lastAction: "2 min ago",
      booked: false
    },
    {
      name: "Mike Chen",
      phone: "+1 (555) 987-6543",
      source: "Google Ad",
      status: "Call Placed",
      lastAction: "15 min ago",
      booked: true
    },
    {
      name: "Lisa Martinez",
      phone: "+1 (555) 456-7890",
      source: "Facebook Ad",
      status: "Responded",
      lastAction: "1 hour ago",
      booked: false
    },
    {
      name: "David Park",
      phone: "+1 (555) 321-0987",
      source: "Referral",
      status: "Booked",
      lastAction: "2 hours ago",
      booked: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SMS Sent": return "bg-blue-500/20 text-blue-400";
      case "Call Placed": return "bg-yellow-500/20 text-yellow-400";
      case "Responded": return "bg-green-500/20 text-green-400";
      case "Booked": return "bg-purple-500/20 text-purple-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Monitor your AI agent performance</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Agent Status:</span>
            <Badge 
              variant={agentActive ? "default" : "secondary"}
              className={`px-3 py-1 ${agentActive ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}`}
            >
              <div className={`w-2 h-2 rounded-full mr-2 ${agentActive ? 'bg-green-400' : 'bg-gray-400'}`} />
              {agentActive ? "Active" : "Inactive"}
            </Badge>
            <Button
              variant={agentActive ? "destructive" : "default"}
              size="sm"
              onClick={() => setAgentActive(!agentActive)}
              className="transition-all duration-200"
            >
              {agentActive ? "Pause Agent" : "Activate Agent"}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="glass-morphism border-border/40 card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-sm ${stat.color}`}>{stat.change}</p>
                </div>
                <div className={`p-3 rounded-2xl bg-gradient-to-br from-${stat.color.split('-')[1]}-500/20 to-${stat.color.split('-')[1]}-600/20`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <Card className="lg:col-span-2 glass-morphism border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Leads
            </CardTitle>
            <CardDescription>Latest prospects from your campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeads.map((lead, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-border/40 hover:bg-muted/20 transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-blue-600 flex items-center justify-center text-white font-medium">
                      {lead.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-sm text-muted-foreground">{lead.phone}</p>
                      <p className="text-xs text-muted-foreground">{lead.source}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`${getStatusColor(lead.status)} border-0 mb-1`}>
                      {lead.status}
                    </Badge>
                    {lead.booked && (
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 ml-2">
                        Booked
                      </Badge>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">{lead.lastAction}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
              <Button className="w-full btn-gradient rounded-xl py-6">
                <Bot className="h-4 w-4 mr-2" />
                Deploy New Agent
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
