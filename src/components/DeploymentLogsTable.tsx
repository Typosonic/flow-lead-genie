
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Clock, Container, Bot } from 'lucide-react'
import { useDeploymentOrchestrator } from '@/hooks/useDeploymentOrchestrator'

const DeploymentLogsTable = () => {
  const { deploymentLogs } = useDeploymentOrchestrator()

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'deploying': return 'bg-blue-500'
      case 'deployed': return 'bg-green-500'
      case 'failed': return 'bg-red-500'
      case 'pending': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  if (deploymentLogs.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Deployments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">Loading deployment logs...</div>
        </CardContent>
      </Card>
    )
  }

  const logs = deploymentLogs.data || []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Deployments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {logs.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No deployments yet
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {log.agents?.name ? (
                        <Bot className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Container className="h-4 w-4 text-gray-500" />
                      )}
                      <div>
                        <div className="font-medium">
                          {log.agents?.name || 'Container Deployment'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {log.agent_templates?.name && `From template: ${log.agent_templates.name}`}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={`${getStatusColor(log.status)} text-white`}>
                      {log.status}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      {new Date(log.deployment_time).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default DeploymentLogsTable
