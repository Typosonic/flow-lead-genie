
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAgentTemplates } from '@/hooks/useAgentTemplates'
import DeployAgentDialog from '@/components/DeployAgentDialog'
import UserAgentsSection from '@/components/UserAgentsSection'
import { Search, Bot, Star, Zap, Users } from 'lucide-react'

const AgentLibrary = () => {
  const { data: templates, isLoading } = useAgentTemplates()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<{ id: string; name: string } | null>(null)
  const [isDeployDialogOpen, setIsDeployDialogOpen] = useState(false)

  const filteredTemplates = templates?.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDeploy = (template: { id: string; name: string }) => {
    setSelectedTemplate(template)
    setIsDeployDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Agent Library</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Agent Library</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Template Library</TabsTrigger>
          <TabsTrigger value="deployed">Your Agents</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates?.map((template) => (
              <Card key={template.id} className="glass-morphism border-border/40 card-hover group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🤖</div>
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        {template.category && (
                          <Badge variant="secondary" className="mt-1">
                            {template.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {template.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{template.rating}</span>
                      </div>
                    )}
                  </div>
                  {template.description && (
                    <CardDescription className="text-sm">{template.description}</CardDescription>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {template.usage_count} deployments
                    </div>
                  </div>

                  <Button
                    onClick={() => handleDeploy({ id: template.id, name: template.name })}
                    className="w-full rounded-xl btn-gradient"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Deploy Agent
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates?.length === 0 && (
            <Card className="glass-morphism border-border/40">
              <CardContent className="text-center py-12">
                <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No templates found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or browse all available templates
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="deployed" className="space-y-4">
          <UserAgentsSection />
        </TabsContent>
      </Tabs>

      {selectedTemplate && (
        <DeployAgentDialog
          isOpen={isDeployDialogOpen}
          onOpenChange={setIsDeployDialogOpen}
          templateId={selectedTemplate.id}
          templateName={selectedTemplate.name}
        />
      )}
    </div>
  )
}

export default AgentLibrary
