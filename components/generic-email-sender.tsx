"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react"

export function GenericEmailSender() {
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSending, setIsSending] = useState(false)
  const [lastResult, setLastResult] = useState<any>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const sendEmail = async () => {
    if (!formData.firstName || !formData.email) {
      alert("First name and email are required!")
      return
    }

    setIsSending(true)
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      setLastResult(result)

      if (result.success) {
        alert("Email sent successfully! Check the recipient's inbox.")
        // Reset form
        setFormData({
          firstName: "",
          email: "",
          subject: "",
          message: "",
        })
      } else {
        alert("Failed to send email: " + result.error)
      }
    } catch (error) {
      console.error("Error sending email:", error)
      alert("Error sending email. Check console for details.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Generic Email Sender
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="John"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Hello from OpenBox!"
            />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Welcome to our platform..."
              rows={3}
            />
          </div>

          <Button
            onClick={sendEmail}
            disabled={isSending || !formData.firstName || !formData.email}
            className="w-full gap-2"
          >
            <Send className="w-4 h-4" />
            {isSending ? "Sending..." : "Send Email"}
          </Button>
        </div>

        {lastResult && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {lastResult.success ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
              <Badge variant={lastResult.success ? "default" : "destructive"}>
                {lastResult.success ? "Success" : "Error"}
              </Badge>
            </div>
            <pre className="text-xs text-gray-600 overflow-auto">{JSON.stringify(lastResult, null, 2)}</pre>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Uses the reusable EmailTemplate component</p>
          <p>• Supports custom subject and message</p>
          <p>• Built with Resend API integration</p>
        </div>
      </CardContent>
    </Card>
  )
}
