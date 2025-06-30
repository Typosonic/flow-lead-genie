
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ContainerStatus from '@/components/ContainerStatus'
import ContainerMonitoring from '@/components/ContainerMonitoring'
import ContainerMetrics from '@/components/ContainerMetrics'
import UserAgentsSection from '@/components/UserAgentsSection'
import { Server, Activity, BarChart3, Bot } from 'lucide-react'

const Infrastructure = () => {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Infrastructure</h2>
        <p className="text-muted-foreground">
          Monitor and manage your AI automation infrastructure
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Agents
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Metrics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <ContainerStatus />
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>Your infrastructure at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Container Status</span>
                    <span className="text-sm text-green-600">Running</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Active Agents</span>
                    <span className="text-sm">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total Workflows</span>
                    <span className="text-sm">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Uptime</span>
                    <span className="text-sm">99.9%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <UserAgentsSection />
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <ContainerMonitoring />
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <ContainerMetrics />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Infrastructure
