
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Container, Play, Square, RotateCcw, ExternalLink } from 'lucide-react'
import { useContainerManager } from '@/hooks/useContainerManager'

interface ContainerStatusCardProps {
  containerId: string
  status: string
  url?: string
  lastDeployed?: string
  onStart?: () => void
  onStop?: () => void
  onRestart?: () => void
}

const ContainerStatusCard = ({ 
  containerId, 
  status, 
  url, 
  lastDeployed,
  onStart,
  onStop,
  onRestart
}: ContainerStatusCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running': return 'bg-green-500'
      case 'stopped': return 'bg-red-500'
      case 'provisioning': return 'bg-yellow-500'
      case 'deploying': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Container className="h-4 w-4" />
          {containerId}
        </CardTitle>
        <Badge className={`${getStatusColor(status)} text-white`}>
          {getStatusText(status)}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {url && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">URL:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(url, '_blank')}
                className="h-6 text-xs"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Open
              </Button>
            </div>
          )}
          
          {lastDeployed && (
            <div className="text-xs text-muted-foreground">
              Last deployed: {new Date(lastDeployed).toLocaleString()}
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            {status === 'stopped' && onStart && (
              <Button size="sm" onClick={onStart} className="flex-1">
                <Play className="h-3 w-3 mr-1" />
                Start
              </Button>
            )}
            
            {status === 'running' && onStop && (
              <Button size="sm" variant="outline" onClick={onStop} className="flex-1">
                <Square className="h-3 w-3 mr-1" />
                Stop
              </Button>
            )}
            
            {status === 'running' && onRestart && (
              <Button size="sm" variant="outline" onClick={onRestart} className="flex-1">
                <RotateCcw className="h-3 w-3 mr-1" />
                Restart
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ContainerStatusCard
