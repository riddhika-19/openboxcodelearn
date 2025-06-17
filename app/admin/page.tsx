"use client"

import { EmailTestPanel } from "@/components/email-test-panel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, Mail, Users, BarChart3 } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage emails and monitor platform activity</p>
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
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Open Rate</p>
                  <p className="text-2xl font-bold text-gray-900">85%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Settings className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <Badge variant="default">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
