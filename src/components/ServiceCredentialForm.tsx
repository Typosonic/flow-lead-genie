
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Shield, Plus } from 'lucide-react'
import { useCredentialVault } from '@/hooks/useCredentialVault'

const ServiceCredentialForm = () => {
  const [service, setService] = useState('')
  const [credentials, setCredentials] = useState<Record<string, string>>({})
  const [customService, setCustomService] = useState('')
  
  const { storeCredentials, isStoring } = useCredentialVault()

  const predefinedServices = [
    { value: 'openai', label: 'OpenAI', fields: ['api_key'] },
    { value: 'twilio', label: 'Twilio', fields: ['account_sid', 'auth_token'] },
    { value: 'google_sheets', label: 'Google Sheets', fields: ['client_id', 'client_secret', 'refresh_token'] },
    { value: 'slack', label: 'Slack', fields: ['bot_token', 'webhook_url'] },
    { value: 'meta_ads', label: 'Meta Ads', fields: ['access_token', 'app_id', 'app_secret'] },
    { value: 'calendly', label: 'Calendly', fields: ['api_key'] },
    { value: 'custom', label: 'Custom Service', fields: [] }
  ]

  const selectedServiceConfig = predefinedServices.find(s => s.value === service)

  const handleFieldChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const serviceName = service === 'custom' ? customService : service
    if (!serviceName || Object.keys(credentials).length === 0) return

    try {
      await storeCredentials.mutateAsync({
        serviceName,
        credentials
      })
      
      // Reset form
      setService('')
      setCredentials({})
      setCustomService('')
    } catch (error) {
      console.error('Failed to store credentials:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Service Credentials
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="service">Service</Label>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {predefinedServices.map((service) => (
                  <SelectItem key={service.value} value={service.value}>
                    {service.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {service === 'custom' && (
            <div>
              <Label htmlFor="customService">Custom Service Name</Label>
              <Input
                id="customService"
                value={customService}
                onChange={(e) => setCustomService(e.target.value)}
                placeholder="Enter service name"
              />
            </div>
          )}

          {selectedServiceConfig && selectedServiceConfig.fields.length > 0 && (
            <div className="space-y-3">
              {selectedServiceConfig.fields.map((field) => (
                <div key={field}>
                  <Label htmlFor={field}>
                    {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Label>
                  {field.includes('token') || field.includes('secret') || field.includes('key') ? (
                    <Textarea
                      id={field}
                      value={credentials[field] || ''}
                      onChange={(e) => handleFieldChange(field, e.target.value)}
                      placeholder={`Enter ${field}`}
                      className="font-mono text-sm"
                    />
                  ) : (
                    <Input
                      id={field}
                      value={credentials[field] || ''}
                      onChange={(e) => handleFieldChange(field, e.target.value)}
                      placeholder={`Enter ${field}`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {service === 'custom' && customService && (
            <div>
              <Label htmlFor="customCredentials">Credentials (JSON format)</Label>
              <Textarea
                id="customCredentials"
                placeholder='{"api_key": "your-key", "secret": "your-secret"}'
                className="font-mono text-sm"
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value)
                    setCredentials(parsed)
                  } catch {
                    // Invalid JSON, ignore
                  }
                }}
              />
            </div>
          )}

          <Button 
            type="submit" 
            disabled={!service || (service === 'custom' && !customService) || Object.keys(credentials).length === 0 || isStoring}
            className="w-full"
          >
            <Shield className="h-4 w-4 mr-2" />
            {isStoring ? 'Storing...' : 'Store Credentials'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default ServiceCredentialForm
