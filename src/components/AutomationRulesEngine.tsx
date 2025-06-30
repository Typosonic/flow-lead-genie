
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Play, Pause } from 'lucide-react'
import { useAutomationRules } from '@/hooks/useAutomationRules'

const AutomationRulesEngine = () => {
  const { rules, createRule, updateRule, deleteRule, isLoading } = useAutomationRules()
  const [isCreating, setIsCreating] = useState(false)
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    trigger: '',
    triggerValue: '',
    action: '',
    actionValue: '',
    delay: 0
  })

  const handleCreateRule = async () => {
    if (!newRule.name || !newRule.trigger || !newRule.action) return

    await createRule.mutateAsync({
      name: newRule.name,
      description: newRule.description,
      trigger: {
        type: newRule.trigger,
        value: newRule.triggerValue
      },
      action: {
        type: newRule.action,
        value: newRule.actionValue
      },
      delay: newRule.delay,
      is_active: true
    })

    setNewRule({
      name: '',
      description: '',
      trigger: '',
      triggerValue: '',
      action: '',
      actionValue: '',
      delay: 0
    })
    setIsCreating(false)
  }

  const handleToggleRule = async (ruleId: string, isActive: boolean) => {
    await updateRule.mutateAsync({
      id: ruleId,
      is_active: !isActive
    })
  }

  if (isLoading) {
    return <div className="p-6">Loading automation rules...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Automation Rules</h1>
          <p className="text-muted-foreground">Create workflows to automate lead follow-up</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Rule
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Automation Rule</CardTitle>
            <CardDescription>Define triggers and actions for automated workflows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Rule Name</Label>
                <Input
                  id="name"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  placeholder="Welcome new leads"
                />
              </div>
              <div>
                <Label htmlFor="delay">Delay (minutes)</Label>
                <Input
                  id="delay"
                  type="number"
                  value={newRule.delay}
                  onChange={(e) => setNewRule({ ...newRule, delay: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newRule.description}
                onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                placeholder="Automatically send welcome message to new leads"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Trigger</Label>
                <Select value={newRule.trigger} onValueChange={(value) => setNewRule({ ...newRule, trigger: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead_created">New Lead Created</SelectItem>
                    <SelectItem value="lead_status_changed">Lead Status Changed</SelectItem>
                    <SelectItem value="no_response">No Response After X Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Trigger Value</Label>
                <Input
                  value={newRule.triggerValue}
                  onChange={(e) => setNewRule({ ...newRule, triggerValue: e.target.value })}
                  placeholder="e.g., hot, 3 (for days)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Action</Label>
                <Select value={newRule.action} onValueChange={(value) => setNewRule({ ...newRule, action: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="send_sms">Send SMS</SelectItem>
                    <SelectItem value="send_email">Send Email</SelectItem>
                    <SelectItem value="make_call">Make Call</SelectItem>
                    <SelectItem value="update_status">Update Lead Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Action Value</Label>
                <Textarea
                  value={newRule.actionValue}
                  onChange={(e) => setNewRule({ ...newRule, actionValue: e.target.value })}
                  placeholder="Message content or status value"
                  rows={2}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateRule} disabled={createRule.isPending}>
                {createRule.isPending ? 'Creating...' : 'Create Rule'}
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {rules?.map((rule) => (
          <Card key={rule.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {rule.name}
                    <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                      {rule.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{rule.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleRule(rule.id, rule.is_active)}
                  >
                    {rule.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteRule.mutate(rule.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Trigger:</strong> {rule.trigger.type}
                  {rule.trigger.value && ` (${rule.trigger.value})`}
                </div>
                <div>
                  <strong>Action:</strong> {rule.action.type}
                </div>
                <div>
                  <strong>Delay:</strong> {rule.delay} minutes
                </div>
              </div>
              {rule.action.value && (
                <div className="mt-2 p-2 bg-muted rounded text-sm">
                  <strong>Action Content:</strong> {rule.action.value}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {(!rules || rules.length === 0) && !isCreating && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-4">No automation rules created yet</p>
              <Button onClick={() => setIsCreating(true)}>Create Your First Rule</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default AutomationRulesEngine
