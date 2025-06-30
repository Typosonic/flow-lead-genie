
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLeadStats } from '@/hooks/useLeads'
import { TrendingUp, Phone, Calendar, BarChart3 } from 'lucide-react'

const StatsGrid = () => {
  const { data: stats, isLoading } = useLeadStats()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-6 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      title: "Leads Today",
      value: stats?.leadsToday || 0,
      icon: TrendingUp,
      description: "New leads generated today"
    },
    {
      title: "Calls Placed",
      value: stats?.callsPlaced || 0,
      icon: Phone,
      description: "Automated calls made today"
    },
    {
      title: "Bookings",
      value: stats?.bookings || 0,
      icon: Calendar,
      description: "Successful conversions"
    },
    {
      title: "Response Rate",
      value: `${stats?.responseRate || 0}%`,
      icon: BarChart3,
      description: "Overall conversion rate"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default StatsGrid
