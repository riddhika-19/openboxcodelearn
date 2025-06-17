"use client"

import { EmailTestPanel } from "@/components/email-test-panel"
import { MistakeTracker } from "@/components/mistake-tracker"
import { ResendContactManager } from "@/components/resend-contact-manager"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Mail, Users, AlertTriangle, MessageSquare } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage emails, track mistakes, and monitor platform activity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">15,000+</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Emails Sent</p>
                  <p className="text-2xl font-bold text-gray-900">50,000+</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Mistakes Tracked</p>
                  <p className="text-2xl font-bold text-gray-900">2,500+</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">SMS Sent</p>
                  <p className="text-2xl font-bold text-gray-900">1,200+</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="emails" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="emails">Email Management</TabsTrigger>
            <TabsTrigger value="mistakes">Mistake Tracking</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="emails" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EmailTestPanel />

              <Card>
                <CardHeader>
                  <CardTitle>Email Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Current Settings:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• From: OpenBox Community &lt;noreply@openboxcommunity.dev&gt;</li>
                      <li>• Admin: info.aviralone@gmail.com</li>
                      <li>• Provider: Resend</li>
                      <li>• Daily emails: Manual trigger</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Email Types:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>✅ Welcome emails (automatic)</li>
                      <li>✅ Admin notifications (automatic)</li>
                      <li>✅ Progress emails (manual/scheduled)</li>
                      <li>✅ Personalized content (4 personality types)</li>
                      <li>✅ Consultation offers (mistake-triggered)</li>
                      <li>✅ Weekly mistake reports</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="mistakes" className="space-y-6">
            <MistakeTracker />
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <ResendContactManager />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    System Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">API Integrations:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>✅ Resend Email API</li>
                      <li>✅ DeepSeek AI API</li>
                      <li>⚠️ SMS Service (Simulated)</li>
                      <li>✅ Local Storage (User Data)</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Mistake Tracking:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>✅ Automatic mistake detection</li>
                      <li>✅ First mistake notifications</li>
                      <li>✅ Weekly report generation</li>
                      <li>✅ Consultation email triggers</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Email Service</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">AI Feedback</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Mistake Tracking</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">SMS Service</span>
                    <Badge variant="secondary">Simulated</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">User Registration</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
