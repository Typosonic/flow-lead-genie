
import { Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLeads } from '@/hooks/useLeads';

const RecentLeadsCard = () => {
  const { data: leads, isLoading } = useLeads();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-500/20 text-blue-400";
      case "contacted": return "bg-yellow-500/20 text-yellow-400";
      case "qualified": return "bg-green-500/20 text-green-400";
      case "converted": return "bg-purple-500/20 text-purple-400";
      case "lost": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'L';
  };

  if (isLoading) {
    return (
      <Card className="lg:col-span-2 glass-morphism border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Recent Leads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border/40">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <Card className="lg:col-span-2 glass-morphism border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Recent Leads
          </CardTitle>
          <CardDescription>Latest prospects from your campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No leads yet. Start your first campaign to see leads here.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2 glass-morphism border-border/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Recent Leads
        </CardTitle>
        <CardDescription>Latest prospects from your campaigns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leads.map((lead) => (
            <div key={lead.id} className="flex items-center justify-between p-4 rounded-xl border border-border/40 hover:bg-muted/20 transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-blue-600 flex items-center justify-center text-white font-medium">
                  {getInitials(lead.first_name, lead.last_name)}
                </div>
                <div>
                  <p className="font-medium">
                    {lead.first_name || lead.last_name 
                      ? `${lead.first_name || ''} ${lead.last_name || ''}`.trim()
                      : 'Anonymous Lead'
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">{lead.phone || lead.email || 'No contact info'}</p>
                  <p className="text-xs text-muted-foreground">{lead.source || 'Unknown source'}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className={`${getStatusColor(lead.status)} border-0 mb-1`}>
                  {lead.status}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(lead.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentLeadsCard;
