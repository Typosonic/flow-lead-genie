
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Shield, Key, Trash2, Plus, Eye, EyeOff } from 'lucide-react'
import { useCredentialVault } from '@/hooks/useCredentialVault'

const CredentialVault = () => {
  const [selectedService, setSelectedService] = useState('')
  const [credentials, setCredentials] = useState<Record<string, string>>({})
  const [showCredentials, setShowCredentials] = useState<Record<string, boolean>>({})

  const {
    storeCredentials,
    deleteCredentials,
    userServices,
    isStoring,
    isDeleting
  } = useCredentialVault()

  const services = [
    {
      name: 'facebook_ads',
      label: 'Facebook Ads',
      icon: '📘',
      fields: ['app_id', 'app_secret', 'access_token']
    },
    {
      name: 'twilio',
      label: 'Twilio',
      icon: '📱',
      fields: ['account_sid', 'auth_token', 'phone_number']
    },
    {
      name: 'openai',
      label: 'OpenAI',
      icon: '🤖',
      fields: ['api_key']
    },
    {
      name: 'stripe',
      label: 'Stripe',
      icon: '💳',
      fields: ['secret_key', 'publishable_key']
    },
    {
      name: 'calendly',
      label: 'Calendly',
      icon: '📅',
      fields: ['access_token', 'organization_uri']
    }
  ]

  const handleStoreCredentials = async () => {
    if (!selectedService || !credentials) return

    await storeCredentials.mutateAsync({
      serviceName: selectedService,
      credentials
    })

    setCredentials({})
    setSelectedService('')
  }

  const handleDeleteCredentials = async (serviceName: string) => {
    await deleteCredentials.mutateAsync(serviceName)
  }

  const toggleShowCredential = (field: string) => {
    setShowCredentials(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const storedServices = userServices.data?.services || []

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-brand-500" />
        <div>
          <h1 className="text-3xl font-bold">Credential Vault</h1>
          <p className="text-muted-foreground">Securely store and manage your API credentials</p>
        </div>
      </div>

      <Tabs defaultValue="add" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="add">Add Credentials</TabsTrigger>
          <TabsTrigger value="manage">Manage Stored</TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Service Credentials
              </CardTitle>
              <CardDescription>
                Select a service and securely store your API credentials. These will be automatically injected into your agents.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Service Selection */}
              <div className="space-y-2">
                <Label>Select Service</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {services.map((service) => (
                    <Button
                      key={service.name}
                      variant={selectedService === service.name ? "default" : "outline"}
                      className="h-auto p-4 flex flex-col items-center gap-2"
                      onClick={() => setSelectedService(service.name)}
                    >
                      <span className="text-2xl">{service.icon}</span>
                      <span className="text-sm">{service.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Credential Fields */}
              {selectedService && (
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-semibold">
                    {services.find(s => s.name === selectedService)?.label} Credentials
                  </h4>
                  
                  {services
                    .find(s => s.name === selectedService)
                    ?.fields.map((field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field}>
                        {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Label>
                      <div className="relative">
                        <Input
                          id={field}
                          type={showCredentials[field] ? "text" : "password"}
                          value={credentials[field] || ''}
                          onChange={(e) => setCredentials(prev => ({
                            ...prev,
                            [field]: e.target.value
                          }))}
                          placeholder={`Enter your ${field.replace(/_/g, ' ')}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => toggleShowCredential(field)}
                        >
                          {showCredentials[field] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button
                    onClick={handleStoreCredentials}
                    disabled={isStoring || !Object.keys(credentials).length}
                    className="w-full"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    {isStoring ? 'Storing...' : 'Store Credentials Securely'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stored Credentials</CardTitle>
              <CardDescription>
                Manage your securely stored API credentials. These are automatically used by your agents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {storedServices.length === 0 ? (
                <div className="text-center py-8">
                  <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Credentials Stored</h3>
                  <p className="text-muted-foreground">Add some API credentials to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {storedServices.map((service: any) => {
                    const serviceConfig = services.find(s => s.name === service.service_name)
                    return (
                      <div
                        key={service.service_name}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {serviceConfig?.icon || '🔑'}
                          </span>
                          <div>
                            <h4 className="font-medium">
                              {serviceConfig?.label || service.service_name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Added {new Date(service.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            <Shield className="h-3 w-3 mr-1" />
                            Encrypted
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCredentials(service.service_name)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CredentialVault
