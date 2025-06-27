
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAgents } from '@/hooks/useAgents';

const AgentStatusToggle = () => {
  const { data: agents, isLoading } = useAgents();
  const [localActive, setLocalActive] = useState(true);
  
  // For now, we'll use local state. In production, this would update the agent status in the database
  const activeAgents = agents?.filter(agent => agent.status === 'active').length || 0;
  const hasActiveAgents = activeAgents > 0;
  const agentActive = hasActiveAgents && localActive;

  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Agent Status:</span>
        <div className="h-6 w-20 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Agent Status:</span>
        <Badge 
          variant={agentActive ? "default" : "secondary"}
          className={`px-3 py-1 ${agentActive ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}`}
        >
          <div className={`w-2 h-2 rounded-full mr-2 ${agentActive ? 'bg-green-400' : 'bg-gray-400'}`} />
          {agentActive ? "Active" : "Inactive"}
        </Badge>
        <Button
          variant={agentActive ? "destructive" : "default"}
          size="sm"
          onClick={() => setLocalActive(!localActive)}
          className="transition-all duration-200"
          disabled={!hasActiveAgents && !localActive}
        >
          {agentActive ? "Pause Agent" : "Activate Agent"}
        </Button>
      </div>
    </div>
  );
};

export default AgentStatusToggle;
