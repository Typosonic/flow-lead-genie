
import { Package, Download, Trash2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAgentPackages } from '@/hooks/useAgentPackages';

const AgentPackagesList = () => {
  const { data: packages, isLoading } = useAgentPackages();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'Unknown size';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Uploaded Packages</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse glass-morphism border-border/40">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-16 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!packages || packages.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Uploaded Packages</h3>
        <Card className="glass-morphism border-border/40">
          <CardContent className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No packages uploaded yet</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Uploaded Packages ({packages.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="glass-morphism border-border/40">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Package className="h-8 w-8 text-brand-500" />
                  <div>
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(pkg.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(pkg.status)}
                          {pkg.status}
                        </div>
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              {pkg.description && (
                <CardDescription>{pkg.description}</CardDescription>
              )}
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">File Size:</span>
                  <p className="font-medium">{formatFileSize(pkg.file_size || 0)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Agents:</span>
                  <p className="font-medium">{pkg.agent_count || 0}</p>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Uploaded {new Date(pkg.created_at).toLocaleDateString()}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl border-border/40"
                  disabled={pkg.status !== 'completed'}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AgentPackagesList;
