
import { Package, Download, Trash2, Clock, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAgentPackages, useExtractedWorkflows } from '@/hooks/useAgentPackages';

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

  const getStatusMessage = (status: string, agentCount: number) => {
    switch (status) {
      case 'completed':
        return `${agentCount} agent${agentCount !== 1 ? 's' : ''} extracted and published`;
      case 'processing':
        return 'Extracting workflows...';
      case 'failed':
        return 'Processing failed';
      default:
        return 'Pending processing';
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
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </div>
  );
};

const PackageCard = ({ pkg }: { pkg: any }) => {
  const { data: workflows } = useExtractedWorkflows(pkg.id);

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

  const getStatusMessage = (status: string, agentCount: number) => {
    switch (status) {
      case 'completed':
        return `${agentCount} agent${agentCount !== 1 ? 's' : ''} extracted and published`;
      case 'processing':
        return 'Extracting workflows...';
      case 'failed':
        return 'Processing failed';
      default:
        return 'Pending processing';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'Unknown size';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="glass-morphism border-border/40">
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
        <div className="text-sm text-muted-foreground">
          {getStatusMessage(pkg.status, pkg.agent_count || 0)}
        </div>
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

        {workflows && workflows.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Extracted Workflows:</p>
            <div className="space-y-1">
              {workflows.slice(0, 3).map((workflow) => (
                <div key={workflow.id} className="flex items-center justify-between text-xs bg-muted/20 rounded p-2">
                  <span className="truncate">{workflow.workflow_name}</span>
                  {workflow.status === 'completed' && (
                    <ExternalLink className="h-3 w-3 text-brand-500" />
                  )}
                </div>
              ))}
              {workflows.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  +{workflows.length - 3} more workflows
                </p>
              )}
            </div>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          Uploaded {new Date(pkg.created_at).toLocaleDateString()}
        </div>

        <div className="flex gap-2">
          {pkg.status === 'completed' && (
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl border-brand-500/30 text-brand-400 hover:bg-brand-500/10"
              onClick={() => {
                // Scroll to Template Library tab
                const templateTab = document.querySelector('[data-value="templates"]');
                if (templateTab) {
                  (templateTab as HTMLElement).click();
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 100);
                }
              }}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              View in Library
            </Button>
          )}
          
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
  );
};

export default AgentPackagesList;
