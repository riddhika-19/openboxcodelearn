"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Users, UserPlus, Mail, Loader2, CheckCircle, AlertCircle } from "lucide-react"

export function ResendContactManager() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    audienceId: "",
  })

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/resend-contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      setResult({ type: response.ok ? "success" : "error", data })
    } catch (error) {
      setResult({ type: "error", data: { error: "Network error occurred" } })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const clearForm = () => {
    setFormData({ email: "", firstName: "", lastName: "", audienceId: "" })
    setResult(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Resend Contact Management
          </CardTitle>
          <CardDescription>Add users to your Resend audience for email campaigns and newsletters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Contact Form */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add New Contact
            </h3>

            <form onSubmit={handleAddContact} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="user@example.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="John"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Doe"
                  />
                </div>

                <div>
                  <Label htmlFor="audienceId">Audience ID</Label>
                  <Input
                    id="audienceId"
                    value={formData.audienceId}
                    onChange={(e) => handleInputChange("audienceId", e.target.value)}
                    placeholder="Leave empty for default audience"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding Contact...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add to Audience
                    </>
                  )}
                </Button>

                <Button type="button" variant="outline" onClick={clearForm}>
                  Clear Form
                </Button>
              </div>
            </form>
          </div>

          <Separator />

          {/* Results Display */}
          {result && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Result</h3>

              <Card
                className={`border-2 ${
                  result.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                }`}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    {result.type === "success" ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    )}

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={result.type === "success" ? "default" : "destructive"}>
                          {result.type === "success" ? "Success" : "Error"}
                        </Badge>
                      </div>

                      <p className={`text-sm ${result.type === "success" ? "text-green-800" : "text-red-800"}`}>
                        {result.data.message || result.data.error}
                      </p>

                      {result.data.contactId && (
                        <p className="text-xs text-gray-600 mt-2">
                          Contact ID: <code className="bg-gray-200 px-1 rounded">{result.data.contactId}</code>
                        </p>
                      )}

                      {result.data.details && (
                        <p className="text-xs text-gray-600 mt-1">Details: {result.data.details}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Information Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              How It Works
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Users who register through the popup are automatically added to your Resend audience</li>
              <li>• You can manually add contacts using this form</li>
              <li>• All contacts are set as subscribed by default</li>
              <li>• Use the audience ID to organize contacts into different lists</li>
              <li>• Environment variable RESEND_AUDIENCE_ID is used as the default audience</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
