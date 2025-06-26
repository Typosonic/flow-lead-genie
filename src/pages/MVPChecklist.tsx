
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, AlertTriangle, Clock, ExternalLink } from "lucide-react";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done" | "critical";
  category: string;
  estimatedHours?: number;
  dependencies?: string[];
  resources?: { name: string; url: string }[];
}

const MVPChecklist = () => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    // Authentication & User Management
    {
      id: "auth-setup",
      title: "Supabase Authentication Setup",
      description: "Configure email/password auth, user tables, and RLS policies",
      status: "critical",
      category: "Authentication",
      estimatedHours: 4,
      resources: [
        { name: "Supabase Auth Docs", url: "https://supabase.com/docs/guides/auth" }
      ]
    },
    {
      id: "auth-ui",
      title: "Login/Signup UI Components",
      description: "Create responsive auth forms with validation and error handling",
      status: "todo",
      category: "Authentication",
      estimatedHours: 6,
      dependencies: ["auth-setup"]
    },
    {
      id: "user-onboarding",
      title: "User Onboarding Flow",
      description: "Complete the onboarding walkthrough with proper state management",
      status: "in-progress",
      category: "Authentication",
      estimatedHours: 8,
      dependencies: ["auth-ui"]
    },

    // Database & Backend
    {
      id: "database-schema",
      title: "Database Schema Design",
      description: "Create tables for users, agents, leads, subscriptions, and configurations",
      status: "critical",
      category: "Backend",
      estimatedHours: 6,
      resources: [
        { name: "Supabase Database", url: "https://supabase.com/docs/guides/database" }
      ]
    },
    {
      id: "rls-policies",
      title: "Row Level Security Policies",
      description: "Implement secure RLS policies for all tables",
      status: "todo",
      category: "Backend",
      estimatedHours: 4,
      dependencies: ["database-schema"]
    },
    {
      id: "api-functions",
      title: "Supabase Edge Functions",
      description: "Create functions for agent deployment, lead processing, and integrations",
      status: "todo",
      category: "Backend",
      estimatedHours: 16,
      dependencies: ["database-schema"]
    },

    // AI Agent System
    {
      id: "n8n-integration",
      title: "n8n Workflow Integration",
      description: "Set up n8n instance and create base agent workflows",
      status: "critical",
      category: "AI Agents",
      estimatedHours: 20,
      resources: [
        { name: "n8n Documentation", url: "https://docs.n8n.io/" }
      ]
    },
    {
      id: "agent-templates",
      title: "Agent Template System",
      description: "Create reusable agent templates with configuration options",
      status: "todo",
      category: "AI Agents",
      estimatedHours: 12,
      dependencies: ["n8n-integration"]
    },
    {
      id: "agent-deployment",
      title: "Agent Deployment Pipeline",
      description: "Automate agent deployment from dashboard to n8n",
      status: "todo",
      category: "AI Agents",
      estimatedHours: 10,
      dependencies: ["agent-templates", "api-functions"]
    },

    // Meta/Facebook Integration
    {
      id: "meta-api-setup",
      title: "Meta API Integration",
      description: "Set up Meta Business API for lead forms and ad data",
      status: "critical",
      category: "Integrations",
      estimatedHours: 12,
      resources: [
        { name: "Meta Business API", url: "https://developers.facebook.com/docs/marketing-api" }
      ]
    },
    {
      id: "lead-sync",
      title: "Lead Synchronization",
      description: "Real-time sync of leads from Meta to Supabase",
      status: "todo",
      category: "Integrations",
      estimatedHours: 8,
      dependencies: ["meta-api-setup", "database-schema"]
    },
    {
      id: "competitor-spy",
      title: "Competitor Ad Spy Tool",
      description: "Implement Meta Ad Library scraping for competitor analysis",
      status: "todo",
      category: "Integrations",
      estimatedHours: 10,
      dependencies: ["meta-api-setup"]
    },

    // Payment System
    {
      id: "stripe-setup",
      title: "Stripe Payment Integration",
      description: "Configure Stripe for subscription billing and usage-based pricing",
      status: "critical",
      category: "Payments",
      estimatedHours: 8,
      resources: [
        { name: "Stripe Docs", url: "https://stripe.com/docs" }
      ]
    },
    {
      id: "subscription-management",
      title: "Subscription Management",
      description: "Handle plan upgrades, downgrades, and billing cycles",
      status: "todo",
      category: "Payments",
      estimatedHours: 12,
      dependencies: ["stripe-setup"]
    },
    {
      id: "usage-tracking",
      title: "Usage-Based Billing",
      description: "Track agent usage, SMS/calls, and implement metered billing",
      status: "todo",
      category: "Payments",
      estimatedHours: 10,
      dependencies: ["stripe-setup", "agent-deployment"]
    },

    // Communication Services
    {
      id: "sms-service",
      title: "SMS Service Integration",
      description: "Set up Twilio or similar for SMS automation",
      status: "critical",
      category: "Communications",
      estimatedHours: 6,
      resources: [
        { name: "Twilio SMS API", url: "https://www.twilio.com/docs/sms" }
      ]
    },
    {
      id: "voice-service",
      title: "Voice Call Integration",
      description: "Implement AI voice calling capabilities",
      status: "todo",
      category: "Communications",
      estimatedHours: 15,
      dependencies: ["sms-service"]
    },
    {
      id: "calendar-integration",
      title: "Calendar Integration",
      description: "Connect with Calendly, Google Calendar for booking management",
      status: "todo",
      category: "Communications",
      estimatedHours: 8
    },

    // UI/UX & Frontend
    {
      id: "landing-page",
      title: "Marketing Landing Page",
      description: "Create conversion-optimized landing page with pricing",
      status: "todo",
      category: "Frontend",
      estimatedHours: 16
    },
    {
      id: "dashboard-complete",
      title: "Complete Dashboard Features",
      description: "Finish all dashboard functionality with real data integration",
      status: "in-progress",
      category: "Frontend",
      estimatedHours: 20,
      dependencies: ["database-schema", "api-functions"]
    },
    {
      id: "mobile-optimization",
      title: "Mobile Responsive Design",
      description: "Ensure all pages work perfectly on mobile devices",
      status: "todo",
      category: "Frontend",
      estimatedHours: 12,
      dependencies: ["dashboard-complete"]
    },

    // Security & Compliance
    {
      id: "security-audit",
      title: "Security Audit",
      description: "Review and test all security measures, API endpoints",
      status: "todo",
      category: "Security",
      estimatedHours: 8,
      dependencies: ["rls-policies", "api-functions"]
    },
    {
      id: "data-privacy",
      title: "GDPR/Privacy Compliance",
      description: "Implement privacy policy, data deletion, user consent",
      status: "todo",
      category: "Security",
      estimatedHours: 6
    },
    {
      id: "rate-limiting",
      title: "Rate Limiting & DDoS Protection",
      description: "Implement API rate limiting and security measures",
      status: "todo",
      category: "Security",
      estimatedHours: 4,
      dependencies: ["api-functions"]
    },

    // Testing & Quality Assurance
    {
      id: "unit-tests",
      title: "Unit Testing",
      description: "Write comprehensive tests for critical functions",
      status: "todo",
      category: "Testing",
      estimatedHours: 16,
      dependencies: ["api-functions", "dashboard-complete"]
    },
    {
      id: "integration-tests",
      title: "Integration Testing",
      description: "Test all external API integrations and workflows",
      status: "todo",
      category: "Testing",
      estimatedHours: 12,
      dependencies: ["meta-api-setup", "stripe-setup", "sms-service"]
    },
    {
      id: "user-acceptance-testing",
      title: "User Acceptance Testing",
      description: "Test complete user journeys from signup to agent deployment",
      status: "todo",
      category: "Testing",
      estimatedHours: 8,
      dependencies: ["dashboard-complete", "agent-deployment"]
    },

    // DevOps & Deployment
    {
      id: "production-deployment",
      title: "Production Environment Setup",
      description: "Configure production Supabase project and deployments",
      status: "todo",
      category: "DevOps",
      estimatedHours: 6
    },
    {
      id: "monitoring-logging",
      title: "Monitoring & Logging",
      description: "Set up error tracking, performance monitoring, and logs",
      status: "todo",
      category: "DevOps",
      estimatedHours: 8,
      dependencies: ["production-deployment"]
    },
    {
      id: "backup-recovery",
      title: "Backup & Recovery",
      description: "Implement automated backups and disaster recovery",
      status: "todo",
      category: "DevOps",
      estimatedHours: 4,
      dependencies: ["production-deployment"]
    },

    // Business & Legal
    {
      id: "terms-privacy",
      title: "Terms of Service & Privacy Policy",
      description: "Create legal documents for SaaS operation",
      status: "todo",
      category: "Legal",
      estimatedHours: 4
    },
    {
      id: "pricing-strategy",
      title: "Pricing Strategy Implementation",
      description: "Finalize and implement pricing tiers in Stripe",
      status: "todo",
      category: "Business",
      estimatedHours: 4,
      dependencies: ["stripe-setup"]
    },
    {
      id: "customer-support",
      title: "Customer Support System",
      description: "Set up help desk, documentation, and support workflows",
      status: "todo",
      category: "Business",
      estimatedHours: 8
    }
  ]);

  const toggleStatus = (id: string) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === id) {
        const statusOrder = ["todo", "in-progress", "done"];
        const currentIndex = statusOrder.indexOf(item.status);
        const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      done: "default",
      "in-progress": "secondary",
      critical: "destructive",
      todo: "outline"
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {status === "in-progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const categories = [...new Set(checklist.map(item => item.category))];
  const totalItems = checklist.length;
  const completedItems = checklist.filter(item => item.status === "done").length;
  const criticalItems = checklist.filter(item => item.status === "critical").length;
  const totalHours = checklist.reduce((sum, item) => sum + (item.estimatedHours || 0), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gradient">MVP Production Checklist</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Complete roadmap to launch Agent-flow as a production-ready SaaS platform
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedItems}/{totalItems}</div>
              <div className="text-xs text-muted-foreground">
                {Math.round((completedItems / totalItems) * 100)}% Complete
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Critical Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{criticalItems}</div>
              <div className="text-xs text-muted-foreground">Must complete first</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Estimated Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHours}h</div>
              <div className="text-xs text-muted-foreground">Total development time</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
              <div className="text-xs text-muted-foreground">Different focus areas</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {categories.map(category => {
        const categoryItems = checklist.filter(item => item.category === category);
        const categoryCompleted = categoryItems.filter(item => item.status === "done").length;
        
        return (
          <Card key={category} className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{category}</CardTitle>
                <Badge variant="outline">
                  {categoryCompleted}/{categoryItems.length}
                </Badge>
              </div>
              <CardDescription>
                {Math.round((categoryCompleted / categoryItems.length) * 100)}% complete
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryItems.map(item => (
                  <div key={item.id} className="border rounded-lg p-4 hover:bg-muted/20 transition-colors">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleStatus(item.id)}
                        className="mt-1 hover:scale-110 transition-transform"
                      >
                        {getStatusIcon(item.status)}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          {getStatusBadge(item.status)}
                        </div>
                        
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          {item.estimatedHours && (
                            <span>⏱️ {item.estimatedHours}h</span>
                          )}
                          {item.dependencies && item.dependencies.length > 0 && (
                            <span>🔗 Depends on: {item.dependencies.join(", ")}</span>
                          )}
                        </div>
                        
                        {item.resources && item.resources.length > 0 && (
                          <div className="mt-2 space-x-2">
                            {item.resources.map((resource, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => window.open(resource.url, "_blank")}
                              >
                                {resource.name}
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      <Card className="mt-8 bg-gradient-to-r from-brand-500/10 to-blue-600/10 border-brand-500/20">
        <CardHeader>
          <CardTitle className="text-xl">🚀 Ready to Launch?</CardTitle>
          <CardDescription>
            Once all critical items are complete and 80%+ of total items are done, you'll be ready for MVP launch!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">
              <strong>Priority 1:</strong> Complete all {criticalItems} critical items first
            </p>
            <p className="text-sm">
              <strong>Priority 2:</strong> Focus on Authentication, Backend, and AI Agents categories
            </p>
            <p className="text-sm">
              <strong>Priority 3:</strong> Implement payments and core integrations
            </p>
            <p className="text-sm">
              <strong>Final:</strong> Polish UI/UX, testing, and deployment
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MVPChecklist;
