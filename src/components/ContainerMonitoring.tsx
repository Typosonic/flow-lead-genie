
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Activity, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Server,
  Zap
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

const ContainerMonitoring = () => {
  const { user } = useAuth()

  const containerEvents = useQuery({
    queryKey: ['container-events', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('container_events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      return data
    },
    enabled: !!user,
    refetchInterval: 10000 // Refresh every 10 seconds
  })

  const deploymentLogs = useQuery({
    queryKey: ['deployment-logs', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('deployment_logs')
        .select(`
          *,
          agents (name)
        `)
        .eq('user_id', user.id)
        .order('deployment_time', { ascending: false })
        .limit(10)

      if (error) throw error
      return data
    },
    enabled: !!user
  })

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'deployment_started':
      case 'deployment_completed':
        return <Zap className="h-4 w-4" />
      case 'container_stopped':
        return <AlertTriangle className="h-4 w-4" />
      case 'container_restarted':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getEventBadgeVariant = (eventType: string) => {
    switch (eventType) {
      case 'deployment_completed':
        return 'default' as const
      case 'deployment_started':
        return 'secondary' as const
      case 'container_stopped':
        return 'destructive' as const
      case 'container_restarted':
        return 'outline' as const
      default:
        return 'secondary' as const
    }
  }

  const getDeploymentStatusBadge = (status: string) => {
    switch (status) {
      case 'deploying':
        return <Badge variant="secondary">Deploying</Badge>
      case 'completed':
        return <Badge variant="default">Completed</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (containerEvents.isLoading || deploymentLogs.isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Container Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Container Events
          </CardTitle>
          <CardDescription>
            Real-time monitoring of your container activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {containerEvents.data?.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No container events yet
              </p>
            ) : (
              containerEvents.data?.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getEventIcon(event.event_type)}
                    <div>
                      <p className="font-medium text-sm">{event.event_type.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={getEventBadgeVariant(event.event_type)}>
                    {event.event_type}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Deployment Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Deployment History
          </CardTitle>
          <CardDescription>
            Track your agent deployment status and history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deploymentLogs.data?.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No deployments yet
              </p>
            ) : (
              deploymentLogs.data?.map((deployment) => (
                <div key={deployment.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4" />
                    <div>
                      <p className="font-medium text-sm">{deployment.agents?.name || 'Unknown Agent'}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(deployment.deployment_time).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {getDeploymentStatusBadge(deployment.status)}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ContainerMonitoring
