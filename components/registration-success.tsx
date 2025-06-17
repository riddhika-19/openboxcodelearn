"use client"

import { CheckCircle, Mail, Users, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface RegistrationSuccessProps {
  userData: {
    name: string
    email: string
    addedToResendAudience?: boolean
    resendContactId?: string
  }
  onClose: () => void
}

export function RegistrationSuccess({ userData, onClose }: RegistrationSuccessProps) {
  return (
    <div className="text-center py-8">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to OpenBox! 🎉</h2>

      <p className="text-gray-600 mb-6">
        Registration successful, <strong>{userData.name}</strong>!
        {userData.addedToResendAudience
          ? " You've been added to our community mailing list."
          : " Check your email for confirmation."}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <Mail className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-blue-900 mb-1">Email Sent</h3>
            <p className="text-sm text-blue-700">Check {userData.email} for your welcome message</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-green-900 mb-1">Community Member</h3>
            <p className="text-sm text-green-700">
              {userData.addedToResendAudience ? "Added to mailing list successfully" : "Welcome to the community"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>📧 Daily personalized progress emails</li>
          <li>🎯 Customized learning recommendations</li>
          <li>👥 Access to our Discord community</li>
          <li>🏆 Weekly challenges and achievements</li>
        </ul>
      </div>

      <div className="flex gap-3 justify-center">
        <Button onClick={onClose} className="flex-1 max-w-xs">
          Start Learning Journey
        </Button>
        <Button
          variant="outline"
          onClick={() => window.open("https://github.com/riddhika-19/openboxcodelearn", "_blank")}
          className="gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          View on GitHub
        </Button>
      </div>

      {userData.resendContactId && <p className="text-xs text-gray-500 mt-4">Contact ID: {userData.resendContactId}</p>}
    </div>
  )
}
