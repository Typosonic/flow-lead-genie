
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Phone, MessageSquare, Calendar, Eye, MoreHorizontal, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LeadManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const leads = [
    {
      id: "1",
      name: "John Smith",
      email: "john@example.com",
      phone: "+1234567890",
      source: "Facebook Ad - Home Services",
      status: "new",
      lastContact: "2 hours ago",
      score: 85,
      agent: "Ad-Flow Agent"
    },
    {
      id: "2", 
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1234567891",
      source: "Facebook Ad - Real Estate",
      status: "contacted",
      lastContact: "1 day ago",
      score: 72,
      agent: "Real Estate SDR"
    },
    {
      id: "3",
      name: "Mike Davis",
      email: "mike@example.com", 
      phone: "+1234567892",
      source: "Facebook Ad - E-commerce",
      status: "qualified",
      lastContact: "3 hours ago",
      score: 91,
      agent: "E-commerce Chatbot"
    },
    {
      id: "4",
      name: "Emily Wilson",
      email: "emily@example.com",
      phone: "+1234567893", 
      source: "Facebook Ad - Content Creation",
      status: "booked",
      lastContact: "5 minutes ago",
      score: 88,
      agent: "Content Creator Assistant"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'contacted':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'qualified':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'booked':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cold':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lead Management</h2>
          <p className="text-muted-foreground">Track and manage leads from your Facebook ad campaigns</p>
        </div>
        <Button className="btn-gradient">
          <Download className="h-4 w-4 mr-2" />
          Export Leads
        </Button>
      </div>

      <Tabs defaultValue="all-leads" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all-leads">All Leads</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="converted">Converted</TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border rounded-md bg-background"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="booked">Booked</option>
              <option value="cold">Cold</option>
            </select>
          </div>
        </div>

        <TabsContent value="all-leads" className="space-y-4">
          <div className="grid gap-4">
            {filteredLeads.map((lead) => (
              <Card key={lead.id} className="glass-morphism border-border/40">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{lead.name}</h3>
                        <p className="text-sm text-muted-foreground">{lead.email}</p>
                        <p className="text-sm text-muted-foreground">{lead.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">Status</p>
                      </div>

                      <div className="text-center">
                        <p className={`font-bold text-lg ${getScoreColor(lead.score)}`}>{lead.score}</p>
                        <p className="text-xs text-muted-foreground">Score</p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm font-medium">{lead.lastContact}</p>
                        <p className="text-xs text-muted-foreground">Last Contact</p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm font-medium">{lead.agent}</p>
                        <p className="text-xs text-muted-foreground">Assigned Agent</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="rounded-full">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-full">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-full">
                          <Calendar className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" className="rounded-full">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                            <DropdownMenuItem>Change Status</DropdownMenuItem>
                            <DropdownMenuItem>Assign Agent</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/40">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Source: {lead.source}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">Lead ID: #{lead.id}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="new">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">New Leads</h3>
            <p className="text-muted-foreground">Fresh leads from your Facebook campaigns will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="in-progress">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">In Progress</h3>
            <p className="text-muted-foreground">Leads currently being worked by your agents</p>
          </div>
        </TabsContent>

        <TabsContent value="converted">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Converted Leads</h3>
            <p className="text-muted-foreground">Successfully converted leads and bookings</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeadManagement;
