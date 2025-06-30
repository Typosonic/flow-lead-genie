
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCredentialVault } from '@/hooks/useCredentialVault'
import { useMetaAPI } from '@/hooks/useMetaAPI'
import { Facebook, CheckCircle, AlertCircle, Download, Loader2 } from 'lucide-react'

const MetaIntegration = () => {
  const [accessToken, setAccessToken] = useState('')
  const [appId, setAppId] = useState('')
  const [appSecret, setAppSecret] = useState('')
  const [selectedFormId, setSelectedFormId] = useState('')

  const { storeCredentials, userServices, isStoring } = useCredentialVault()
  const { adAccounts, leadForms, syncLeads, testConnection, isSyncing, isTesting } = useMetaAPI()

  const hasMetaCredentials = userServices.data?.services?.some(
    service => service.service_name === 'meta_business_api'
  )

  const handleStoreCredentials = async () => {
    if (!accessToken || !appId || !appSecret) {
      return
    }

    await storeCredentials.mutateAsync({
      serviceName: 'meta_business_api',
      credentials: {
        access_token: accessToken,
        app_id: appId,
        app_secret: appSecret
      }
    })

    setAccessToken('')
    setAppId('')
    setAppSecret('')
  }

  const handleSyncLeads = async () => {
    if (!selectedFormId) return
    await syncLeads.mutateAsync({ formId: selectedFormId })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Facebook className="h-6 w-6 text-blue-600" />
            <CardTitle>Meta Business API Integration</CardTitle>
            {hasMetaCredentials && (
              <Badge variant="default" className="ml-auto">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            )}
          </div>
          <CardDescription>
            Connect your Meta Business account to automatically sync leads from Facebook and Instagram ads.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={hasMetaCredentials ? "manage" : "setup"}>
            <TabsList>
              <TabsTrigger value="setup">Setup</TabsTrigger>
              {hasMetaCredentials && <TabsTrigger value="manage">Manage</TabsTrigger>}
            </TabsList>

            <TabsContent value="setup" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="access-token">Access Token</Label>
                  <Input
                    id="access-token"
                    type="password"
                    placeholder="Your Meta Business API access token"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="app-id">App ID</Label>
                  <Input
                    id="app-id"
                    placeholder="Your Facebook App ID"
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="app-secret">App Secret</Label>
                  <Input
                    id="app-secret"
                    type="password"
                    placeholder="Your Facebook App Secret"
                    value={appSecret}
                    onChange={(e) => setAppSecret(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleStoreCredentials}
                  disabled={!accessToken || !appId || !appSecret || isStoring}
                >
                  {isStoring && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Store Credentials
                </Button>
              </div>
            </TabsContent>

            {hasMetaCredentials && (
              <TabsContent value="manage" className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => testConnection.mutate()}
                    disabled={isTesting}
                  >
                    {isTesting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Test Connection
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ad Accounts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {adAccounts.isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Loading ad accounts...</span>
                      </div>
                    ) : adAccounts.error ? (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span>Failed to load ad accounts</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {adAccounts.data?.map((account) => (
                          <div key={account.id} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <div className="font-medium">{account.name}</div>
                              <div className="text-sm text-muted-foreground">ID: {account.account_id}</div>
                            </div>
                            <Badge variant="outline">{account.currency}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Lead Forms</CardTitle>
                    <CardDescription>
                      Select a form to sync leads from your Meta campaigns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {leadForms.isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Loading lead forms...</span>
                      </div>
                    ) : leadForms.error ? (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span>Failed to load lead forms</span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          {leadForms.data?.map((form) => (
                            <div
                              key={form.id}
                              className={`flex items-center justify-between p-2 border rounded cursor-pointer ${
                                selectedFormId === form.id ? 'border-blue-500 bg-blue-50' : ''
                              }`}
                              onClick={() => setSelectedFormId(form.id)}
                            >
                              <div>
                                <div className="font-medium">{form.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  Status: {form.status} | Locale: {form.locale}
                                </div>
                              </div>
                              <Badge variant={form.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                {form.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                        {selectedFormId && (
                          <Button onClick={handleSyncLeads} disabled={isSyncing}>
                            {isSyncing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            <Download className="h-4 w-4 mr-2" />
                            Sync Leads from Selected Form
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default MetaIntegration
