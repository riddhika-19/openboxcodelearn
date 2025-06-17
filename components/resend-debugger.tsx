"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Mail, Users, Loader2 } from "lucide-react"

export function ResendDebugger() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)
  const [testEmail, setTestEmail] = useState("")

  const testEmailSending = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail }),
      })
      const result = await response.json()
      setTestResults(result)
    } catch (error) {
      setTestResults({ error: "Failed to test email sending" })
    } finally {
      setIsLoading(false)
    }
  }

  const testContactCreation = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-resend-contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail, name: "Test User" }),
      })
      const result = await response.json()
      setTestResults(result)
    } catch (error) {
      setTestResults({ error: "Failed to test contact creation" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Resend Integration Debugger
          </CardTitle>
          <CardDescription>Test your Resend configuration to identify email delivery issues</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="test-email">Test Email Address</Label>
            <Input
              id="test-email"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={testEmailSending} disabled={isLoading || !testEmail} className="gap-2">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              Test Email Sending
            </Button>
            <Button
              onClick={testContactCreation}
              disabled={isLoading || !testEmail}
              variant="outline"
              className="gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
              Test Contact Creation
            </Button>
          </div>

          {testResults && (
            <Card className={testResults.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {testResults.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="font-semibold">{testResults.success ? "Test Successful" : "Test Failed"}</span>
                </div>
                <Textarea
                  value={JSON.stringify(testResults, null, 2)}
                  readOnly
                  className="font-mono text-sm"
                  rows={8}
                />
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Environment Variables Check</CardTitle>
          <CardDescription>Verify your Resend configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>RESEND_API_KEY</span>
              <Badge variant={process.env.RESEND_API_KEY ? "default" : "destructive"}>
                {process.env.RESEND_API_KEY ? "Set" : "Missing"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>RESEND_AUDIENCE_ID</span>
              <Badge variant={process.env.RESEND_AUDIENCE_ID ? "default" : "destructive"}>
                {process.env.RESEND_AUDIENCE_ID ? "Set" : "Missing"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
