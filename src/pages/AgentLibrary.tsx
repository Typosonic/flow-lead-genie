
import { useState } from "react";
import { Bot, MessageSquare, Phone, Search, Zap, Filter, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const AgentLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "SDR", "Chatbot", "Voice", "Content", "Ads", "Real Estate"];

  const agents = [
    {
      id: 1,
      name: "Ad-Flow Agent",
      description: "Automatically follow up with Facebook leads via SMS and voice calls",
      category: "Ads",
      icon: "🎯",
      features: ["SMS Follow-up", "Voice Calls", "Booking Integration"],
      deployment: "5 min",
      popularity: "Most Popular"
    },
    {
      id: 2,
      name: "Real Estate SDR",
      description: "Qualify leads and book property viewings automatically",
      category: "Real Estate",
      icon: "🏠",
      features: ["Lead Qualification", "Appointment Booking", "Follow-up Sequences"],
      deployment: "3 min",
      popularity: null
    },
    {
      id: 3,
      name: "E-commerce Chatbot",
      description: "Handle customer inquiries and abandoned cart recovery",
      category: "Chatbot",
      icon: "🛒",
      features: ["24/7 Support", "Cart Recovery", "Product Recommendations"],
      deployment: "2 min",
      popularity: null
    },
    {
      id: 4,
      name: "Service Business SDR",
      description: "Convert service inquiries into booked consultations",
      category: "SDR",
      icon: "🔧",
      features: ["Consultation Booking", "Service Qualification", "Price Quotes"],
      deployment: "4 min",
      popularity: "Trending"
    },
    {
      id: 5,
      name: "Content Creator Assistant",
      description: "Engage with potential clients and book content creation calls",
      category: "Content",
      icon: "📸",
      features: ["Portfolio Sharing", "Package Explanation", "Call Booking"],
      deployment: "3 min",
      popularity: null
    },
    {
      id: 6,
      name: "Voice-First Sales Agent",
      description: "Prioritizes voice calls for high-touch sales processes",
      category: "Voice",
      icon: "🎙️",
      features: ["Voice-First Approach", "Call Scripts", "CRM Integration"],
      deployment: "6 min",
      popularity: null
    }
  ];

  const filteredAgents = agents.filter(agent => {
    const matchesCategory = selectedCategory === "All" || agent.category === selectedCategory;
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Agent Library</h1>
          <p className="text-muted-foreground">Deploy proven AI automation workflows</p>
        </div>
        
        <div className="flex items-center gap-4">
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

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => (
          <Card key={agent.id} className="glass-morphism border-border/40 card-hover group">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{agent.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getCategoryColor(agent.category)}>
                        {agent.category}
                      </Badge>
                      {agent.popularity && (
                        <Badge variant="outline" className="border-brand-500/30 text-brand-400">
                          {agent.popularity}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <CardDescription className="text-sm">{agent.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Features */}
              <div>
                <p className="text-sm font-medium mb-2">Key Features:</p>
                <div className="flex flex-wrap gap-1">
                  {agent.features.map((feature, index) => (
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
                <span className="font-medium">{agent.deployment}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button className="flex-1 btn-gradient rounded-xl group-hover:scale-[1.02] transition-all duration-200">
                  <Zap className="h-4 w-4 mr-2" />
                  Deploy
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
      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No agents found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default AgentLibrary;
