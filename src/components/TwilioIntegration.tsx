
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Phone, MessageSquare, TestTube, Settings } from 'lucide-react'
import { useTwilio } from '@/hooks/useTwilio'
import { useCredentialVault } from '@/hooks/useCredentialVault'

const TwilioIntegration = () => {
  const [smsTo, setSmsTo] = useState('')
  const [smsMessage, setSmsMessage] = useState('')
  const [callTo, setCallTo] = useState('')

  const { sendSMS, makeCall, testConnection, isSendingSMS, isMakingCall, isTesting } = useTwilio()
  const { userServices } = useCredentialVault()

  const hasTwilioCredentials = userServices.data?.services?.some(
    (service: any) => service.service_name === 'twilio'
  )

  const handleSendSMS = async () => {
    if (!smsTo || !smsMessage) return
    await sendSMS.mutateAsync({ to: smsTo, message: smsMessage })
    setSmsTo('')
    setSmsMessage('')
  }

  const handleMakeCall = async () => {
    if (!callTo) return
    await makeCall.mutateAsync({ to: callTo })
    setCallTo('')
  }

  const handleTestConnection = async () => {
    await testConnection.mutateAsync()
  }

  if (!hasTwilioCredentials) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Twilio Integration Setup
          </CardTitle>
          <CardDescription>
            Configure your Twilio credentials to enable SMS and voice calling capabilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Twilio Not Configured</h3>
            <p className="text-muted-foreground mb-4">
              Add your Twilio credentials in the Credential Vault to enable SMS and voice features.
            </p>
            <p className="text-sm text-muted-foreground">
              You'll need: Account SID, Auth Token, and Phone Number from your Twilio Console.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Twilio Integration</h2>
          <p className="text-muted-foreground">Send SMS messages and make voice calls</p>
        </div>
        <Badge variant="outline" className="bg-green-500/20 text-green-400">
          <Settings className="h-3 w-3 mr-1" />
          Configured
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SMS Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              Send SMS
            </CardTitle>
            <CardDescription>
              Send text messages to leads and customers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sms-to">Phone Number</Label>
              <Input
                id="sms-to"
                type="tel"
                placeholder="+1234567890"
                value={smsTo}
                onChange={(e) => setSmsTo(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sms-message">Message</Label>
              <Textarea
                id="sms-message"
                placeholder="Enter your message here..."
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                rows={4}
              />
            </div>
            <Button
              onClick={handleSendSMS}
              disabled={!smsTo || !smsMessage || isSendingSMS}
              className="w-full"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {isSendingSMS ? 'Sending...' : 'Send SMS'}
            </Button>
          </CardContent>
        </Card>

        {/* Voice Call Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-green-500" />
              Make Voice Call
            </CardTitle>
            <CardDescription>
              Initiate voice calls to leads and customers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="call-to">Phone Number</Label>
              <Input
                id="call-to"
                type="tel"
                placeholder="+1234567890"
                value={callTo}
                onChange={(e) => setCallTo(e.target.value)}
              />
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                This will initiate a call using your configured Twilio number. 
                The call will use the default Twilio demo greeting.
              </p>
            </div>
            <Button
              onClick={handleMakeCall}
              disabled={!callTo || isMakingCall}
              className="w-full"
            >
              <Phone className="h-4 w-4 mr-2" />
              {isMakingCall ? 'Calling...' : 'Make Call'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Test Connection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Test Connection
          </CardTitle>
          <CardDescription>
            Verify your Twilio credentials are working correctly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleTestConnection}
            disabled={isTesting}
            variant="outline"
            className="w-full"
          >
            <TestTube className="h-4 w-4 mr-2" />
            {isTesting ? 'Testing...' : 'Test Twilio Connection'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default TwilioIntegration
