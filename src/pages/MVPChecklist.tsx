
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, Circle, AlertCircle } from "lucide-react"

type TaskStatus = 'pending' | 'in-progress' | 'completed'

interface Task {
  id: string
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: TaskStatus
  dependencies?: string[]
  estimatedHours?: number
  devNotes?: string
}

const MVPChecklist = () => {
  const [tasks, setTasks] = useState<Task[]>([
    // Authentication & User Management
    {
      id: 'auth-setup',
      title: 'Authentication Setup',
      description: 'Implement user registration, login, and logout functionality',
      category: 'auth',
      priority: 'critical',
      status: 'completed',
      estimatedHours: 6,
      devNotes: 'Supabase Auth with email/password'
    },
    {
      id: 'user-profiles',
      title: 'User Profiles',
      description: 'Create user profile management and settings',
      category: 'auth',
      priority: 'high',
      status: 'completed',
      estimatedHours: 4,
      devNotes: 'Profile table with user preferences'
    },
    {
      id: 'password-reset',
      title: 'Password Reset',
      description: 'Implement forgot/reset password functionality',
      category: 'auth',
      priority: 'medium',
      status: 'pending',
      estimatedHours: 3,
      devNotes: 'Email-based password reset flow'
    },
    {
      id: 'email-verification',
      title: 'Email Verification',
      description: 'Verify user email addresses during registration',
      category: 'auth',
      priority: 'medium',
      status: 'pending',
      estimatedHours: 2,
      devNotes: 'Email confirmation before account activation'
    },
    {
      id: 'session-management',
      title: 'Session Management',
      description: 'Handle user sessions and token refresh',
      category: 'auth',
      priority: 'high',
      status: 'completed',
      estimatedHours: 3,
      devNotes: 'Auto-refresh tokens and session persistence'
    },

    // Core Lead Management
    {
      id: 'lead-crud',
      title: 'Lead CRUD Operations',
      description: 'Create, read, update, delete leads with full data management',
      category: 'leads',
      priority: 'critical',
      status: 'completed',
      estimatedHours: 8,
      devNotes: 'Full CRUD with validation and error handling'
    },
    {
      id: 'lead-search',
      title: 'Lead Search & Filtering',
      description: 'Search leads by name, email, phone, tags, and custom fields',
      category: 'leads',
      priority: 'high',
      status: 'pending',
      estimatedHours: 5,
      devNotes: 'Full-text search with filters and sorting'
    },
    {
      id: 'lead-import',
      title: 'Lead Import/Export',
      description: 'Bulk import leads from CSV and export lead data',
      category: 'leads',
      priority: 'medium',
      status: 'pending',
      estimatedHours: 6,
      devNotes: 'CSV parsing with validation and error reporting'
    },
    {
      id: 'lead-tags',
      title: 'Lead Tags & Categories',
      description: 'Tag system for organizing and categorizing leads',
      category: 'leads',
      priority: 'medium',
      status: 'pending',
      estimatedHours: 4,
      devNotes: 'Tag management with autocomplete'
    },
    {
      id: 'lead-notes',
      title: 'Lead Notes & History',
      description: 'Add notes and track interaction history for each lead',
      category: 'leads',
      priority: 'high',
      status: 'pending',
      estimatedHours: 5,
      devNotes: 'Timeline view with rich text notes'
    },

    // Communications
    {
      id: 'sms-integration',
      title: 'SMS Integration',
      description: 'Send and receive SMS messages through Twilio',
      category: 'communications',
      priority: 'critical',
      status: 'completed',
      estimatedHours: 6,
      devNotes: 'Twilio SMS with delivery status tracking'
    },
    {
      id: 'voice-calls',
      title: 'Voice Call Integration',
      description: 'Make and receive voice calls through Twilio',
      category: 'communications',
      priority: 'high',
      status: 'completed',
      estimatedHours: 8,
      devNotes: 'Voice calling with call recording'
    },
    {
      id: 'email-integration',
      title: 'Email Integration',
      description: 'Send and track email communications',
      category: 'communications',
      priority: 'high',
      status: 'pending',
      estimatedHours: 7,
      devNotes: 'SMTP integration with open/click tracking'
    },
    {
      id: 'message-templates',
      title: 'Message Templates',
      description: 'Create reusable templates for SMS, email, and voice messages',
      category: 'communications',
      priority: 'medium',
      status: 'pending',
      estimatedHours: 4,
      devNotes: 'Template engine with variable substitution'
    },
    {
      id: 'communication-history',
      title: 'Communication History',
      description: 'Track all communications with leads in a unified timeline',
      category: 'communications',
      priority: 'high',
      status: 'pending',
      estimatedHours: 6,
      devNotes: 'Unified timeline with all communication types'
    },

    // Automation Engine
    {
      id: 'automation-rules',
      title: 'Automation Rules Engine',
      description: 'Create and manage automation workflows for lead follow-up',
      category: 'automation',
      priority: 'critical',
      status: 'completed',
      estimatedHours: 12,
      devNotes: 'Rule builder with triggers and actions'
    },
    {
      id: 'trigger-system',
      title: 'Trigger System',
      description: 'Define triggers for automation rules (time-based, event-based)',
      category: 'automation',
      priority: 'high',
      status: 'pending',
      estimatedHours: 8,
      devNotes: 'Cron-based and webhook triggers'
    },
    {
      id: 'action-system',
      title: 'Action System',
      description: 'Define actions for automation rules (send message, update lead, etc.)',
      category: 'automation',
      priority: 'high',
      status: 'pending',
      estimatedHours: 6,
      devNotes: 'Pluggable action system'
    },
    {
      id: 'automation-logs',
      title: 'Automation Execution Logs',
      description: 'Track and log all automation rule executions',
      category: 'automation',
      priority: 'medium',
      status: 'pending',
      estimatedHours: 4,
      devNotes: 'Execution history with success/failure tracking'
    },
    {
      id: 'automation-testing',
      title: 'Automation Testing',
      description: 'Test automation rules before activating them',
      category: 'automation',
      priority: 'medium',
      status: 'pending',
      estimatedHours: 5,
      devNotes: 'Dry-run mode for rule testing'
    },

    // Integrations
    {
      id: 'meta-api',
      title: 'Meta Business API Integration',
      description: 'Integrate with Meta Business API to fetch leads from Facebook/Instagram ads',
      category: 'integrations',
      priority: 'critical',
      status: 'completed',
      estimatedHours: 10,
      devNotes: 'Real-time lead sync with webhook support'
    },
    {
      id: 'google-ads',
      title: 'Google Ads Integration',
      description: 'Fetch leads from Google Ads campaigns',
      category: 'integrations',
      priority: 'high',
      status: 'pending',
      estimatedHours: 8,
      devNotes: 'Google Ads API integration'
    },
    {
      id: 'linkedin-ads',
      title: 'LinkedIn Ads Integration',
      description: 'Import leads from LinkedIn advertising campaigns',
      category: 'integrations',
      priority: 'medium',
      status: 'pending',
      estimatedHours: 7,
      devNotes: 'LinkedIn Marketing API'
    },
    {
      id: 'webhook-endpoints',
      title: 'Webhook Endpoints',
      description: 'Create webhook endpoints for receiving leads from various sources',
      category: 'integrations',
      priority: 'high',
      status: 'pending',
      estimatedHours: 5,
      devNotes: 'Generic webhook handler with authentication'
    },
    {
      id: 'zapier-integration',
      title: 'Zapier Integration',
      description: 'Connect with Zapier for third-party app integrations',
      category: 'integrations',
      priority: 'low',
      status: 'pending',
      estimatedHours: 6,
      devNotes: 'Zapier webhook triggers and actions'
    },

    // UI/UX Components
    {
      id: 'dashboard-ui',
      title: 'Main Dashboard UI',
      description: 'Create the main dashboard with key metrics and quick actions',
      category: 'ui',
      priority: 'critical',
      status: 'completed',
      estimatedHours: 8,
      devNotes: 'Responsive dashboard with charts'
    },
    {
      id: 'lead-management-ui',
      title: 'Lead Management Interface',
      description: 'UI for viewing, editing, and managing leads',
      category: 'ui',
      priority: 'critical',
      status: 'completed',
      estimatedHours: 10,
      devNotes: 'Table view with inline editing'
    },
    {
      id: 'communication-ui',
      title: 'Communication Interface',
      description: 'UI for sending messages and viewing communication history',
      category: 'ui',
      priority: 'high',
      status: 'pending',
      estimatedHours: 8,
      devNotes: 'Chat-like interface with templates'
    },
    {
      id: 'automation-builder-ui',
      title: 'Automation Rule Builder UI',
      description: 'Visual interface for creating and editing automation rules',
      category: 'ui',
      priority: 'high',
      status: 'pending',
      estimatedHours: 12,
      devNotes: 'Drag-and-drop rule builder'
    },
    {
      id: 'mobile-responsive',
      title: 'Mobile Responsive Design',
      description: 'Ensure all interfaces work well on mobile devices',
      category: 'ui',
      priority: 'medium',
      status: 'pending',
      estimatedHours: 6,
      devNotes: 'Mobile-first responsive design'
    },

    // Security & Credentials
    {
      id: 'credential-vault',
      title: 'Credential Vault',
      description: 'Securely store and manage API credentials for third-party services',
      category: 'security',
      priority: 'critical',
      status: 'completed',
      estimatedHours: 8,
      devNotes: 'Encrypted credential storage with access logs'
    },
    {
      id: 'access-control',
      title: 'Role-Based Access Control',
      description: 'Implement user roles and permissions system',
      category: 'security',
      priority: 'medium',
      status: 'pending',
      estimatedHours: 8,
      devNotes: 'Admin, manager, agent roles with permissions'
    },
    {
      id: 'audit-logs',
      title: 'Audit Logging',
      description: 'Log all user actions for security and compliance',
      category: 'security',
      priority: 'medium',
      status: 'pending',
      estimatedHours: 4,
      devNotes: 'Comprehensive audit trail'
    },
    {
      id: 'data-encryption',
      title: 'Data Encryption',
      description: 'Encrypt sensitive data at rest and in transit',
      category: 'security',
      priority: 'high',
      status: 'pending',
      estimatedHours: 6,
      devNotes: 'AES encryption for PII data'
    },
    {
      id: 'api-security',
      title: 'API Security',
      description: 'Implement API authentication, rate limiting, and security headers',
      category: 'security',
      priority: 'high',
      status: 'pending',
      estimatedHours: 5,
      devNotes: 'JWT tokens with rate limiting'
    },

    // Analytics & Reporting
    {
      id: 'lead-analytics',
      title: 'Lead Analytics Dashboard',
      description: 'Analytics for lead sources, conversion rates, and performance',
      category: 'analytics',
      priority: 'medium',
      status: 'pending',
      estimatedHours: 8,
      devNotes: 'Charts showing lead funnel metrics'
    },
    {
      id: 'communication-analytics',
      title: 'Communication Analytics',
      description: 'Track message delivery rates, response rates, and engagement',
      category: 'analytics',
      priority: 'medium',
      status: 'pending',
      estimatedHours: 6,
      devNotes: 'Communication effectiveness metrics'
    },
    {
      id: 'automation-analytics',
      title: 'Automation Performance',
      description: 'Analytics for automation rule performance and effectiveness',
      category: 'analytics',
      priority: 'low',
      status: 'pending',
      estimatedHours: 5,
      devNotes: 'Rule execution success rates and impact'
    },
    {
      id: 'custom-reports',
      title: 'Custom Report Builder',
      description: 'Allow users to create custom reports and dashboards',
      category: 'analytics',
      priority: 'low',
      status: 'pending',
      estimatedHours: 10,
      devNotes: 'Drag-and-drop report builder'
    },
    {
      id: 'export-reports',
      title: 'Report Export',
      description: 'Export reports to PDF, CSV, and Excel formats',
      category: 'analytics',
      priority: 'low',
      status: 'pending',
      estimatedHours: 4,
      devNotes: 'Multiple export format support'
    },

    // Performance & Scalability
    {
      id: 'database-optimization',
      title: 'Database Optimization',
      description: 'Optimize database queries and add proper indexing',
      category: 'performance',
      priority: 'medium',
      status: 'pending',
      estimatedHours: 6,
      devNotes: 'Query optimization and index creation'
    },
    {
      id: 'caching-layer',
      title: 'Caching Implementation',
      description: 'Implement caching for frequently accessed data',
      category: 'performance',
      priority: 'medium',
      status: 'pending',
      estimatedHours: 5,
      devNotes: 'Redis caching for API responses'
    },
    {
      id: 'api-pagination',
      title: 'API Pagination',
      description: 'Implement pagination for large data sets',
      category: 'performance',
      priority: 'high',
      status: 'pending',
      estimatedHours: 3,
      devNotes: 'Cursor-based pagination'
    },
    {
      id: 'background-jobs',
      title: 'Background Job Processing',
      description: 'Process heavy tasks in background workers',
      category: 'performance',
      priority: 'medium',
      status: 'pending',
      estimatedHours: 7,
      devNotes: 'Queue system for async processing'
    },
    {
      id: 'cdn-setup',
      title: 'CDN Implementation',
      description: 'Set up CDN for static assets and global content delivery',
      category: 'performance',
      priority: 'low',
      status: 'pending',
      estimatedHours: 3,
      devNotes: 'CloudFront or similar CDN setup'
    },

    // Testing & Quality Assurance
    {
      id: 'unit-tests',
      title: 'Unit Testing',
      description: 'Write unit tests for all core business logic',
      category: 'testing',
      priority: 'medium',
      status: 'pending',
      estimatedHours: 12,
      devNotes: 'Jest/Vitest unit tests with good coverage'
    },
    {
      id: 'integration-tests',
      title: 'Integration Testing',
      description: 'Test API endpoints and database interactions',
      category: 'testing',
      priority: 'medium',
      status: 'pending',
      estimatedHours: 8,
      devNotes: 'API testing with test database'
    },
    {
      id: 'e2e-tests',
      title: 'End-to-End Testing',
      description: 'Test complete user workflows and critical paths',
      category: 'testing',
      priority: 'low',
      status: 'pending',
      estimatedHours: 10,
      devNotes: 'Playwright or Cypress E2E tests'
    },
    {
      id: 'load-testing',
      title: 'Load Testing',
      description: 'Test system performance under expected load',
      category: 'testing',
      priority: 'low',
      status: 'pending',
      estimatedHours: 5,
      devNotes: 'Load testing with realistic traffic patterns'
    },
    {
      id: 'security-testing',
      title: 'Security Testing',
      description: 'Perform security audits and penetration testing',
      category: 'testing',
      priority: 'medium',
      status: 'pending',
      estimatedHours: 6,
      devNotes: 'OWASP security testing guidelines'
    },

    // Deployment & DevOps
    {
      id: 'ci-cd-pipeline',
      title: 'CI/CD Pipeline',
      description: 'Set up automated testing and deployment pipeline',
      category: 'devops',
      priority: 'medium',
      status: 'pending',
      estimatedHours: 8,
      devNotes: 'GitHub Actions or similar CI/CD'
    },
    {
      id: 'environment-setup',
      title: 'Environment Configuration',
      description: 'Set up development, staging, and production environments',
      category: 'devops',
      priority: 'high',
      status: 'pending',
      estimatedHours: 6,
      devNotes: 'Environment-specific configs and secrets'
    },
    {
      id: 'monitoring-setup',
      title: 'Application Monitoring',
      description: 'Set up error tracking, performance monitoring, and alerting',
      category: 'devops',
      priority: 'medium',
      status: 'pending',
      estimatedHours: 5,
      devNotes: 'Sentry or similar monitoring tools'
    },
    {
      id: 'backup-strategy',
      title: 'Backup & Recovery',
      description: 'Implement automated backups and disaster recovery procedures',
      category: 'devops',
      priority: 'medium',
      status: 'pending',
      estimatedHours: 4,
      devNotes: 'Automated database backups with point-in-time recovery'
    },
    {
      id: 'log-management',
      title: 'Log Management',
      description: 'Centralized logging and log analysis setup',
      category: 'devops',
      priority: 'low',
      status: 'pending',
      estimatedHours: 4,
      devNotes: 'Structured logging with centralized collection'
    },

    // Documentation & Training
    {
      id: 'api-documentation',
      title: 'API Documentation',
      description: 'Comprehensive API documentation with examples',
      category: 'documentation',
      priority: 'medium',
      status: 'pending',
      estimatedHours: 6,
      devNotes: 'OpenAPI/Swagger documentation'
    },
    {
      id: 'user-documentation',
      title: 'User Documentation',
      description: 'End-user guides and help documentation',
      category: 'documentation',
      priority: 'medium',
      status: 'pending',
      estimatedHours: 8,
      devNotes: 'In-app help and external documentation site'
    },
    {
      id: 'admin-documentation',
      title: 'Admin Documentation',
      description: 'System administration and configuration guides',
      category: 'documentation',
      priority: 'low',
      status: 'pending',
      estimatedHours: 4,
      devNotes: 'Setup and configuration documentation'
    },
    {
      id: 'video-tutorials',
      title: 'Video Tutorials',
      description: 'Create video tutorials for key features',
      category: 'documentation',
      priority: 'low',
      status: 'pending',
      estimatedHours: 10,
      devNotes: 'Screen recordings with voiceover'
    },
    {
      id: 'onboarding-flow',
      title: 'User Onboarding',
      description: 'Interactive onboarding flow for new users',
      category: 'documentation',
      priority: 'medium',
      status: 'pending',
      estimatedHours: 6,
      devNotes: 'Step-by-step guided tour'
    }
  ])

  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const statusOrder: TaskStatus[] = ['pending', 'in-progress', 'completed']
        const currentIndex = statusOrder.indexOf(task.status)
        const nextIndex = (currentIndex + 1) % statusOrder.length
        return { ...task, status: statusOrder[nextIndex] }
      }
      return task
    }))
  }

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusVariant = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return 'default'
      case 'in-progress':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'destructive'
      case 'high':
        return 'secondary'
      case 'medium':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getPriorityIcon = (priority: string) => {
    if (priority === 'critical') {
      return <AlertCircle className="h-3 w-3" />
    }
    return null
  }

  const categoryStats = tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = { total: 0, completed: 0 }
    }
    acc[task.category].total++
    if (task.status === 'completed') {
      acc[task.category].completed++
    }
    return acc
  }, {} as Record<string, { total: number; completed: number }>)

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.status === 'completed').length
  const overallProgress = Math.round((completedTasks / totalTasks) * 100)

  const categoryNames: Record<string, string> = {
    auth: 'Authentication',
    leads: 'Lead Management',
    communications: 'Communications',
    automation: 'Automation',
    integrations: 'Integrations',
    ui: 'UI/UX',
    security: 'Security',
    analytics: 'Analytics',
    performance: 'Performance',
    testing: 'Testing',
    devops: 'DevOps',
    documentation: 'Documentation'
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">MVP Development Checklist</h1>
        <p className="text-muted-foreground">
          Track progress across all development categories for the AI Lead Management Platform
        </p>
      </div>

      {/* Overall Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Overall Progress
            <Badge variant="outline" className="text-lg font-bold">
              {overallProgress}%
            </Badge>
          </CardTitle>
          <CardDescription>
            {completedTasks} of {totalTasks} tasks completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress} className="h-3" />
        </CardContent>
      </Card>

      {/* Category Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.entries(categoryStats).map(([category, stats]) => {
          const progress = Math.round((stats.completed / stats.total) * 100)
          return (
            <Card key={category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  {categoryNames[category] || category}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {stats.completed}/{stats.total}
                  </span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">All Tasks</h2>
        <div className="grid gap-4">
          {tasks.map(task => (
            <Card key={task.id} className="transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between space-x-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-1"
                        onClick={() => toggleTaskStatus(task.id)}
                      >
                        {getStatusIcon(task.status)}
                      </Button>
                      <div className="flex-1">
                        <h3 className="font-semibold leading-none mb-1">
                          {task.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {task.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        {categoryNames[task.category] || task.category}
                      </Badge>
                      <Badge variant={getPriorityVariant(task.priority)} className="text-xs">
                        <div className="flex items-center gap-1">
                          {getPriorityIcon(task.priority)}
                          {task.priority}
                        </div>
                      </Badge>
                      <Badge variant={getStatusVariant(task.status)} className="text-xs">
                        {task.status.replace('-', ' ')}
                      </Badge>
                      {task.estimatedHours && (
                        <Badge variant="outline" className="text-xs">
                          {task.estimatedHours}h
                        </Badge>
                      )}
                    </div>

                    {task.dependencies && task.dependencies.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Dependencies:</span> {task.dependencies.join(', ')}
                      </div>
                    )}

                    {task.devNotes && (
                      <div className="text-xs bg-muted/50 p-3 rounded-md">
                        <span className="font-medium">Notes:</span> {task.devNotes}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MVPChecklist
