
import React, { useState } from 'react'

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
    {
      id: 'credential-vault',
      title: 'Credential Vault',
      description: 'Securely store and manage API credentials for third-party services',
      category: 'core',
      priority: 'critical',
      status: 'completed',
      estimatedHours: 10,
      devNotes: 'Edge function with encryption and access logs'
    },
    {
      id: 'lead-management',
      title: 'Lead Management',
      description: 'CRUD operations for leads with user association',
      category: 'core',
      priority: 'critical',
      status: 'completed',
      estimatedHours: 8,
      devNotes: 'Supabase tables and React hooks'
    },
    {
      id: 'communications',
      title: 'Communications Module',
      description: 'Send and track SMS, voice, and email communications',
      category: 'core',
      priority: 'high',
      status: 'completed',
      dependencies: ['credential-vault', 'lead-management'],
      estimatedHours: 12,
      devNotes: 'Integrate with Twilio and email services'
    },
    {
      id: 'meta-api',
      title: 'Meta Business API Integration',
      description: 'Integrate with Meta Business API to fetch leads from Facebook/Instagram ads',
      category: 'integrations',
      priority: 'critical',
      status: 'completed',
      dependencies: ['credential-vault'],
      estimatedHours: 8,
      devNotes: 'Edge function with credential management and real-time lead sync'
    },
    {
      id: 'twilio-integration',
      title: 'Twilio SMS/Voice Integration',
      description: 'Enable SMS and voice calling through Twilio API',
      category: 'integrations',
      priority: 'critical',
      status: 'completed',
      dependencies: ['credential-vault'],
      estimatedHours: 6,
      devNotes: 'Edge function with user credentials, SMS and voice call capabilities'
    },
    {
      id: 'ui-components',
      title: 'UI Components',
      description: 'Reusable UI components for forms, buttons, cards, and notifications',
      category: 'ui',
      priority: 'medium',
      status: 'completed',
      estimatedHours: 5,
      devNotes: 'Radix UI and Tailwind CSS based'
    },
    {
      id: 'automation-rules',
      title: 'Automation Rules Engine',
      description: 'Create and manage automation workflows for lead follow-up',
      category: 'features',
      priority: 'high',
      status: 'completed',
      dependencies: ['communications', 'lead-management'],
      estimatedHours: 10,
      devNotes: 'Rule builder with triggers and actions'
    },
    {
      id: 'reporting-dashboard',
      title: 'Reporting Dashboard',
      description: 'Visualize lead and communication metrics',
      category: 'features',
      priority: 'medium',
      status: 'pending',
      dependencies: ['lead-management', 'communications'],
      estimatedHours: 7,
      devNotes: 'Charts and data summaries'
    }
  ])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">MVP Development Checklist</h1>
      <ul className="space-y-4">
        {tasks.map(task => (
          <li key={task.id} className="border rounded p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <span
                className={`px-2 py-1 rounded text-sm font-medium ${
                  task.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : task.status === 'in-progress'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </span>
            </div>
            <p className="text-muted-foreground mb-1">{task.description}</p>
            <p className="text-xs text-muted-foreground mb-1">
              Category: {task.category} | Priority: {task.priority} | Estimated Hours: {task.estimatedHours ?? 'N/A'}
            </p>
            {task.dependencies && task.dependencies.length > 0 && (
              <p className="text-xs text-muted-foreground mb-1">
                Depends on: {task.dependencies.join(', ')}
              </p>
            )}
            {task.devNotes && (
              <p className="text-xs italic text-muted-foreground">Notes: {task.devNotes}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MVPChecklist
