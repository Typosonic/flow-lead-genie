
import { useAuth } from '@/contexts/AuthContext'
import StatsGrid from '@/components/StatsGrid'
import RecentLeadsCard from '@/components/RecentLeadsCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAgents } from '@/hooks/useAgents'
import { Plus, Bot, Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { user } = useAuth()
  const { data: agents } = useAgents()
  const navigate = useNavigate()

  const activeAgents = agents?.filter(agent => agent.status === 'active') || []
  const totalAgents = agents?.length || 0

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.user_metadata?.first_name || 'User'}!
        </h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => navigate('/agent-builder')}>
            <Plus className="mr-2 h-4 w-4" />
            Create Agent
          </Button>
        </div>
      </div>

      <StatsGrid />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <RecentLeadsCard />
        </div>
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Active Agents</CardTitle>
              <CardDescription>
                Your deployed AI agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100">
                    <Bot className="h-4 w-4 text-brand-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {activeAgents.length} of {totalAgents} agents active
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Working 24/7 to convert your leads
                    </p>
                  </div>
                </div>
                
                {activeAgents.slice(0, 3).map((agent) => (
                  <div key={agent.id} className="flex items-center space-x-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                      <Play className="h-3 w-3 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {agent.description || 'No description'}
                      </p>
                    </div>
                  </div>
                ))}
                
                {totalAgents === 0 && (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground text-sm mb-2">
                      No agents deployed yet
                    </p>
                    <Button size="sm" onClick={() => navigate('/agent-library')}>
                      Browse Templates
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
