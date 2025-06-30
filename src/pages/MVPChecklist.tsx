import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Clock, AlertTriangle, ExternalLink, Users, Brain, Zap } from "lucide-react";

type ChecklistStatus = "todo" | "in-progress" | "done" | "critical";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ChecklistStatus;
  estimatedHours?: number;
  dependencies?: string[];
  resources?: { name: string; url: string }[];
}

const MVPChecklist = () => {
  const [items, setItems] = useState<ChecklistItem[]>([
    // Infrastructure & Architecture (UPDATED SECTION)
    {
      id: "infrastructure-architecture",
      title: "Scalable Infrastructure Architecture Design",
      description: "Design multi-tenant architecture with containerized n8n, Edge Functions, and auto-scaling",
      status: "done",
      category: "Infrastructure",
      estimatedHours: 12,
      resources: [
        { name: "Supabase Edge Functions", url: "https://supabase.com/docs/guides/functions" },
        { name: "Google Cloud Run", url: "https://cloud.google.com/run" }
      ]
    },
    {
      id: "container-orchestration",
      title: "Container Orchestration Setup",
      description: "Set up Google Cloud Run for auto-scaling n8n instances per tenant",
      status: "done",
      category: "Infrastructure",
      estimatedHours: 16,
      dependencies: ["infrastructure-architecture"]
    },
    {
      id: "credential-vault",
      title: "Centralized Credential Management",
      description: "Implement secure API key storage and injection system using Supabase Vault",
      status: "done",
      category: "Infrastructure",
      estimatedHours: 10,
      dependencies: ["infrastructure-architecture"]
    },
    {
      id: "workflow-deployment-pipeline",
      title: "Dynamic Workflow Deployment Pipeline",
      description: "Build system for deploying pre-built n8n workflows to dedicated user containers",
      status: "done",
      category: "Infrastructure",
      estimatedHours: 20,
      dependencies: ["container-orchestration", "credential-vault"]
    },
    {
      id: "multi-tenant-isolation",
      title: "Multi-Tenant Security Isolation",
      description: "Implement secure tenant isolation with dedicated containers and credential injection",
      status: "todo",
      category: "Infrastructure",
      estimatedHours: 14,
      dependencies: ["container-orchestration", "credential-vault"]
    },
    {
      id: "auto-scaling-policies",
      title: "Auto-Scaling & Performance Optimization",
      description: "Configure auto-scaling policies and performance monitoring for container instances",
      status: "todo",
      category: "Infrastructure",
      estimatedHours: 12,
      dependencies: ["container-orchestration"]
    },

    // Authentication & User Management
    {
      id: "auth-setup",
      title: "Supabase Authentication Setup",
      description: "Configure email/password auth, user tables, and RLS policies",
      status: "done",
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
      title: "Scalable Database Schema Design",
      description: "Create partitioned tables for users, agents, leads, subscriptions with performance optimization",
      status: "done",
      category: "Backend",
      estimatedHours: 8,
      resources: [
        { name: "Supabase Database", url: "https://supabase.com/docs/guides/database" }
      ]
    },
    {
      id: "rls-policies",
      title: "Row Level Security Policies",
      description: "Implement secure RLS policies for all tables with multi-tenant isolation",
      status: "done",
      category: "Backend",
      estimatedHours: 6,
      dependencies: ["database-schema"]
    },
    {
      id: "api-functions",
      title: "Supabase Edge Functions",
      description: "Create functions for agent deployment, lead processing, and external API integrations",
      status: "done",
      category: "Backend",
      estimatedHours: 20,
      dependencies: ["database-schema", "credential-vault"]
    },
    {
      id: "database-optimization",
      title: "Database Performance Optimization",
      description: "Implement connection pooling, indexes, and partitioning for scale",
      status: "todo",
      category: "Backend",
      estimatedHours: 8,
      dependencies: ["database-schema"]
    },

    // AI Agent System
    {
      id: "n8n-integration",
      title: "Containerized n8n Workflow System",
      description: "Set up containerized n8n instances with dynamic deployment and credential injection",
      status: "in-progress",
      category: "AI Agents",
      estimatedHours: 24,
      dependencies: ["container-orchestration", "credential-vault"],
      resources: [
        { name: "n8n Documentation", url: "https://docs.n8n.io/" }
      ]
    },
    {
      id: "agent-templates",
      title: "Pre-built Agent Template System",
      description: "Create library of pre-built agent workflows with secure deployment",
      status: "todo",
      category: "AI Agents",
      estimatedHours: 16,
      dependencies: ["n8n-integration"]
    },
    {
      id: "agent-deployment",
      title: "Automated Agent Deployment Pipeline",
      description: "Build system for one-click agent deployment to dedicated user containers",
      status: "in-progress",
      category: "AI Agents",
      estimatedHours: 14,
      dependencies: ["agent-templates", "workflow-deployment-pipeline"]
    },

    // External API Integrations
    {
      id: "meta-api-setup",
      title: "Facebook/Meta API Integration",
      description: "Centralized Meta Business API integration with credential management",
      status: "critical",
      category: "Integrations",
      estimatedHours: 14,
      dependencies: ["credential-vault"],
      resources: [
        { name: "Meta Business API", url: "https://developers.facebook.com/docs/marketing-api" }
      ]
    },
    {
      id: "twilio-integration",
      title: "Twilio SMS/Voice Integration",
      description: "Centralized Twilio integration for SMS and voice automation",
      status: "critical",
      category: "Integrations",
      estimatedHours: 12,
      dependencies: ["credential-vault"],
      resources: [
        { name: "Twilio API", url: "https://www.twilio.com/docs" }
      ]
    },
    {
      id: "lead-sync",
      title: "Real-time Lead Synchronization",
      description: "Real-time sync of leads from Meta to user-isolated containers",
      status: "todo",
      category: "Integrations",
      estimatedHours: 10,
      dependencies: ["meta-api-setup", "multi-tenant-isolation"]
    },
    {
      id: "competitor-spy",
      title: "Competitor Ad Spy Tool",
      description: "Implement Meta Ad Library scraping with centralized API management",
      status: "todo",
      category: "Integrations",
      estimatedHours: 12,
      dependencies: ["meta-api-setup"]
    },

    // Payment System
    {
      id: "stripe-setup",
      title: "Stripe Payment Integration",
      description: "Configure Stripe for subscription billing with usage-based pricing",
      status: "critical",
      category: "Payments",
      estimatedHours: 8,
      resources: [
        { name: "Stripe Docs", url: "https://stripe.com/docs" }
      ]
    },
    {
      id: "subscription-management",
      title: "Multi-Tenant Subscription Management",
      description: "Handle plan upgrades, downgrades, and tenant-specific billing",
      status: "todo",
      category: "Payments",
      estimatedHours: 14,
      dependencies: ["stripe-setup", "multi-tenant-isolation"]
    },
    {
      id: "usage-tracking",
      title: "Container-Based Usage Tracking",
      description: "Track agent usage, resource consumption, and implement metered billing",
      status: "todo",
      category: "Payments",
      estimatedHours: 12,
      dependencies: ["stripe-setup", "container-orchestration"]
    },

    // Performance & Monitoring
    {
      id: "monitoring-setup",
      title: "Infrastructure Monitoring",
      description: "Set up comprehensive monitoring for containers, databases, and API performance",
      status: "todo",
      category: "DevOps",
      estimatedHours: 10,
      dependencies: ["container-orchestration"]
    },
    {
      id: "alerting-system",
      title: "Auto-Scaling Alerts & Triggers",
      description: "Configure intelligent alerting and auto-scaling triggers",
      status: "todo",
      category: "DevOps",
      estimatedHours: 8,
      dependencies: ["monitoring-setup"]
    },
    {
      id: "performance-optimization",
      title: "Container Performance Optimization",
      description: "Implement pre-warming, caching, and latency optimization",
      status: "todo",
      category: "DevOps",
      estimatedHours: 12,
      dependencies: ["container-orchestration"]
    },

    // Authentication & User Management (existing)
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

    // Database & Backend (existing)
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

    // AI Agent System (existing)
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

    // Meta/Facebook Integration (existing)
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

    // Payment System (existing)
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

    // Communication Services (existing)
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

    // UI/UX & Frontend (existing)
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

    // Security & Compliance (existing)
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

    // Testing & Quality Assurance (existing)
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

    // DevOps & Deployment (existing)
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

    // Business & Legal (existing)
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

  const toggleItemStatus = (itemId: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        let newStatus: ChecklistStatus;
        switch (item.status) {
          case "todo":
            newStatus = "in-progress";
            break;
          case "in-progress":
            newStatus = "done";
            break;
          case "done":
            newStatus = "todo";
            break;
          case "critical":
            newStatus = "in-progress";
            break;
          default:
            newStatus = "todo";
        }
        return { ...item, status: newStatus };
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

  const categories = [...new Set(items.map(item => item.category))];
  const totalItems = items.length;
  const completedItems = items.filter(item => item.status === "done").length;
  const criticalItems = items.filter(item => item.status === "critical").length;
  const totalHours = items.reduce((sum, item) => sum + (item.estimatedHours || 0), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gradient">MVP Production Checklist</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Complete roadmap to launch Agent-flow as a scalable, multi-tenant SaaS platform
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
              <div className="text-xs text-muted-foreground">Infrastructure priority</div>
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
        const categoryItems = items.filter(item => item.category === category);
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
                        onClick={() => toggleItemStatus(item.id)}
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
          <CardTitle className="text-xl">🚀 Ready to Scale?</CardTitle>
          <CardDescription>
            Focus on Infrastructure and Backend first to build a scalable foundation for 1000+ users!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">
              <strong>Priority 1:</strong> Complete all {criticalItems} critical infrastructure items first
            </p>
            <p className="text-sm">
              <strong>Priority 2:</strong> Build scalable backend with containerized n8n and credential management
            </p>
            <p className="text-sm">
              <strong>Priority 3:</strong> Implement multi-tenant security and auto-scaling
            </p>
            <p className="text-sm">
              <strong>Final:</strong> Add monitoring, testing, and performance optimization
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MVPChecklist;
