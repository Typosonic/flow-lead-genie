
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ContainerStatus from '@/components/ContainerStatus'
import ContainerMonitoring from '@/components/ContainerMonitoring'
import CredentialVault from '@/components/CredentialVault'
import { Container, Shield, Activity } from 'lucide-react'

const Infrastructure = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <Container className="h-8 w-8 text-brand-500" />
        <div>
          <h1 className="text-3xl font-bold">Infrastructure</h1>
          <p className="text-muted-foreground">
            Manage your dedicated containers, credentials, and monitoring
          </p>
        </div>
      </div>

      <Tabs defaultValue="containers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="containers" className="flex items-center gap-2">
            <Container className="h-4 w-4" />
            Containers
          </TabsTrigger>
          <TabsTrigger value="credentials" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Credentials
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Monitoring
          </TabsTrigger>
        </TabsList>

        <TabsContent value="containers" className="space-y-6">
          <ContainerStatus />
        </TabsContent>

        <TabsContent value="credentials" className="space-y-6">
          <CredentialVault />
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <ContainerMonitoring />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Infrastructure
