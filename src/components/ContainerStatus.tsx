import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Container, 
  Play, 
  Square, 
  RotateCcw, 
  Activity, 
  Clock,
  ExternalLink,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { useContainerManager } from '@/hooks/useContainerManager'

const ContainerStatus = () => {
  const { 
    containerStatus, 
    stopContainer, 
    restartContainer, 
    isStopping, 
    isRestarting 
  } = useContainerManager()

  const container = containerStatus.data?.container
  const isLoading = containerStatus.isLoading

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500'
      case 'deploying': case 'restarting': return 'bg-yellow-500'
      case 'stopped': case 'failed': return 'bg-red-500'
      case 'provisioning': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <CheckCircle className="h-4 w-4" />
      case 'deploying': case 'restarting': return <Clock className="h-4 w-4" />
      case 'stopped': case 'failed': return <AlertCircle className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const handleContainerAction = async (action: 'stop' | 'restart') => {
    if (action === 'stop') {
      await stopContainer.mutateAsync()
    } else if (action === 'restart') {
      await restartContainer.mutateAsync()
    }
  }

  const isManaging = isStopping || isRestarting

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </CardContent>
      </Card>
    )
  }

  if (!container) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Container className="h-5 w-5" />
            No Container Deployed
          </CardTitle>
          <CardDescription>
            Deploy your first agent to create a dedicated n8n container
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Parse resources safely
  const resources = container.resources && typeof container.resources === 'object' 
    ? container.resources as { cpu?: string; memory?: string }
    : null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Container className="h-5 w-5" />
          Your Dedicated Container
        </CardTitle>
        <CardDescription>
          Isolated n8n instance running your automation workflows
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Overview */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(container.status)}`} />
            <div>
              <p className="font-medium">Status: {container.status}</p>
              <p className="text-sm text-muted-foreground">
                Container ID: {container.container_id}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            {getStatusIcon(container.status)}
            {container.status}
          </Badge>
        </div>

        <Separator />

        {/* Container Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Region</p>
            <p className="text-sm text-muted-foreground">{container.region}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Deployed</p>
            <p className="text-sm text-muted-foreground">
              {container.deployed_at 
                ? new Date(container.deployed_at).toLocaleDateString()
                : 'Not deployed'
              }
            </p>
          </div>
          {resources && (
            <>
              <div>
                <p className="text-sm font-medium">CPU</p>
                <p className="text-sm text-muted-foreground">{resources.cpu || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Memory</p>
                <p className="text-sm text-muted-foreground">{resources.memory || 'N/A'}</p>
              </div>
            </>
          )}
        </div>

        {/* Container URL */}
        {container.container_url && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Container URL</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-muted rounded text-sm">
                {container.container_url}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(container.container_url, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <Separator />

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleContainerAction('restart')}
            disabled={isManaging || container.status !== 'running'}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Restart
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleContainerAction('stop')}
            disabled={isManaging || container.status === 'stopped'}
          >
            <Square className="h-4 w-4 mr-2" />
            Stop
          </Button>
        </div>

        {/* Performance Metrics */}
        {container.status === 'running' && (
          <div className="mt-4 p-4 bg-muted/20 rounded-lg">
            <h4 className="font-medium mb-2">Performance</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Uptime</p>
                <p className="font-mono">99.9%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Workflows</p>
                <p className="font-mono">12</p>
              </div>
              <div>
                <p className="text-muted-foreground">Executions</p>
                <p className="font-mono">1,234</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ContainerStatus
