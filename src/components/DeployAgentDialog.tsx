
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useDeployAgent } from '@/hooks/useDeployAgent'
import { Loader2 } from 'lucide-react'

interface DeployAgentDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  templateId: string
  templateName: string
}

const DeployAgentDialog = ({ 
  isOpen, 
  onOpenChange, 
  templateId, 
  templateName 
}: DeployAgentDialogProps) => {
  const [agentName, setAgentName] = useState(`${templateName} Agent`)
  const [description, setDescription] = useState('')
  const deployAgent = useDeployAgent()

  const handleDeploy = async () => {
    await deployAgent.mutateAsync({
      templateId,
      agentName,
      configuration: {
        description
      }
    })
    onOpenChange(false)
    setAgentName(`${templateName} Agent`)
    setDescription('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deploy Agent</DialogTitle>
          <DialogDescription>
            Deploy "{templateName}" as a new AI agent in your infrastructure.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Agent Name</Label>
            <Input
              id="name"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="Enter agent name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this agent will do"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeploy}
            disabled={!agentName.trim() || deployAgent.isPending}
          >
            {deployAgent.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Deploy Agent
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeployAgentDialog
