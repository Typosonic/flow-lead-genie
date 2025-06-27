
import { Calendar, Phone, TrendingUp, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLeadStats } from '@/hooks/useLeads';

const StatsGrid = () => {
  const { data: stats, isLoading } = useLeadStats();

  const statsConfig = [
    {
      title: "Leads Today",
      value: stats?.leadsToday || 0,
      change: "+12%",
      icon: Users,
      color: "text-green-500"
    },
    {
      title: "Calls Placed",
      value: stats?.callsPlaced || 0,
      change: "+8%",
      icon: Phone,
      color: "text-brand-500"
    },
    {
      title: "Bookings",
      value: stats?.bookings || 0,
      change: "+15%",
      icon: Calendar,
      color: "text-purple-500"
    },
    {
      title: "Response Rate",
      value: `${stats?.responseRate || 0}%`,
      change: "+5%",
      icon: TrendingUp,
      color: "text-orange-500"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="glass-morphism border-border/40">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 w-20 bg-muted rounded mb-2" />
                <div className="h-8 w-16 bg-muted rounded mb-2" />
                <div className="h-3 w-12 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsConfig.map((stat, index) => (
        <Card key={index} className="glass-morphism border-border/40 card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className={`text-sm ${stat.color}`}>{stat.change}</p>
              </div>
              <div className={`p-3 rounded-2xl bg-gradient-to-br from-${stat.color.split('-')[1]}-500/20 to-${stat.color.split('-')[1]}-600/20`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsGrid;
