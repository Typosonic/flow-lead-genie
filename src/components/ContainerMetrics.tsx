
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Cpu, MemoryStick, HardDrive, Activity } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: number
  max: number
  unit: string
  icon: React.ReactNode
  color?: string
}

const MetricCard = ({ title, value, max, unit, icon, color = "bg-blue-500" }: MetricCardProps) => {
  const percentage = Math.round((value / max) * 100)
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value} {unit}
        </div>
        <Progress value={percentage} className="mt-2" />
        <p className="text-xs text-muted-foreground mt-1">
          {percentage}% of {max} {unit}
        </p>
      </CardContent>
    </Card>
  )
}

const ContainerMetrics = () => {
  // Mock data - in real implementation, this would come from container monitoring
  const metrics = {
    cpu: { value: 0.8, max: 2, unit: 'cores' },
    memory: { value: 1.2, max: 4, unit: 'GB' },
    storage: { value: 2.5, max: 10, unit: 'GB' },
    uptime: { value: 72, max: 100, unit: 'hours' }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="CPU Usage"
        value={metrics.cpu.value}
        max={metrics.cpu.max}
        unit={metrics.cpu.unit}
        icon={<Cpu className="h-4 w-4 text-muted-foreground" />}
        color="bg-blue-500"
      />
      
      <MetricCard
        title="Memory"
        value={metrics.memory.value}
        max={metrics.memory.max}
        unit={metrics.memory.unit}
        icon={<MemoryStick className="h-4 w-4 text-muted-foreground" />}
        color="bg-green-500"
      />
      
      <MetricCard
        title="Storage"
        value={metrics.storage.value}
        max={metrics.storage.max}
        unit={metrics.storage.unit}
        icon={<HardDrive className="h-4 w-4 text-muted-foreground" />}
        color="bg-yellow-500"
      />
      
      <MetricCard
        title="Uptime"
        value={metrics.uptime.value}
        max={metrics.uptime.max}
        unit={metrics.uptime.unit}
        icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        color="bg-purple-500"
      />
    </div>
  )
}

export default ContainerMetrics
