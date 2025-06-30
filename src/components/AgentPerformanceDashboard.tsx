
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Users, Phone, MessageSquare, Calendar } from "lucide-react";

const AgentPerformanceDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");

  const performanceData = [
    { name: "Mon", leads: 24, calls: 12, conversions: 8 },
    { name: "Tue", leads: 31, calls: 18, conversions: 12 },
    { name: "Wed", leads: 28, calls: 15, conversions: 9 },
    { name: "Thu", leads: 35, calls: 22, conversions: 15 },
    { name: "Fri", leads: 42, calls: 28, conversions: 18 },
    { name: "Sat", leads: 38, calls: 25, conversions: 16 },
    { name: "Sun", leads: 33, calls: 20, conversions: 14 }
  ];

  const conversionData = [
    { name: "SMS Response", value: 68, color: "#8884d8" },
    { name: "Call Answer", value: 45, color: "#82ca9d" },
    { name: "Booking Made", value: 32, color: "#ffc658" },
    { name: "No Response", value: 25, color: "#ff7c7c" }
  ];

  const agentStats = [
    {
      name: "Ad-Flow Agent",
      status: "active",
      leads: 156,
      calls: 89,
      bookings: 42,
      trend: "up"
    },
    {
      name: "Real Estate SDR",
      status: "active", 
      leads: 98,
      calls: 67,
      bookings: 28,
      trend: "up"
    },
    {
      name: "Service Business SDR",
      status: "paused",
      leads: 45,
      calls: 23,
      bookings: 12,
      trend: "down"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agent Performance</h2>
          <p className="text-muted-foreground">Monitor your AI agents' campaign performance</p>
        </div>
        <div className="flex gap-2">
          {["24h", "7d", "30d", "90d"].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className="rounded-full"
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">Agent Details</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="glass-morphism border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                    <p className="text-2xl font-bold">1,247</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500">+12.3%</span>
                  <span className="text-muted-foreground ml-1">vs last week</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Calls Made</p>
                    <p className="text-2xl font-bold">892</p>
                  </div>
                  <Phone className="h-8 w-8 text-green-500" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500">+8.7%</span>
                  <span className="text-muted-foreground ml-1">vs last week</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">SMS Sent</p>
                    <p className="text-2xl font-bold">3,421</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-purple-500" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-red-500">-2.1%</span>
                  <span className="text-muted-foreground ml-1">vs last week</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Bookings</p>
                    <p className="text-2xl font-bold">156</p>
                  </div>
                  <Calendar className="h-8 w-8 text-orange-500" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500">+15.2%</span>
                  <span className="text-muted-foreground ml-1">vs last week</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-morphism border-border/40">
            <CardHeader>
              <CardTitle>Weekly Performance</CardTitle>
              <CardDescription>Lead generation and conversion trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                  <XAxis dataKey="name" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip />
                  <Line type="monotone" dataKey="leads" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="calls" stroke="#82ca9d" strokeWidth={2} />
                  <Line type="monotone" dataKey="conversions" stroke="#ffc658" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          {agentStats.map((agent) => (
            <Card key={agent.name} className="glass-morphism border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">🤖</div>
                    <div>
                      <h3 className="font-semibold">{agent.name}</h3>
                      <Badge className={agent.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                        {agent.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-bold text-lg">{agent.leads}</p>
                      <p className="text-muted-foreground">Leads</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg">{agent.calls}</p>
                      <p className="text-muted-foreground">Calls</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg">{agent.bookings}</p>
                      <p className="text-muted-foreground">Bookings</p>
                    </div>
                    {agent.trend === 'up' ? (
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="conversions">
          <Card className="glass-morphism border-border/40">
            <CardHeader>
              <CardTitle>Conversion Breakdown</CardTitle>
              <CardDescription>Response rates across different touchpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={conversionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {conversionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-4">
                  {conversionData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="text-lg font-bold">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentPerformanceDashboard;
