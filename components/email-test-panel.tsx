"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Send, Clock, CheckCircle, AlertCircle } from "lucide-react"

export function EmailTestPanel() {
  const [isSending, setIsSending] = useState(false)
  const [lastResult, setLastResult] = useState<any>(null)

  const sendTestProgressEmail = async () => {
    setIsSending(true)
    try {
      // Get user data from localStorage
      const userData = localStorage.getItem("openbox-user")
      const progressData = localStorage.getItem("cpp-learning-progress")

      if (!userData) {
        alert("No user data found. Please register first.")
        return
      }

      const user = JSON.parse(userData)
      const progress = progressData
        ? JSON.parse(progressData)
        : {
            completedLessons: [],
            totalScore: 0,
            currentStreak: 0,
          }

      const response = await fetch("/api/send-progress-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
          personalityType: user.personalityType || "motivated",
          currentStreak: progress.currentStreak || 0,
          completedLessons: progress.completedLessons || [],
          totalScore: progress.totalScore || 0,
          weeklyGoal: "Complete 3 lessons per week",
        }),
      })

      const result = await response.json()
      setLastResult(result)

      if (result.success) {
        alert("Progress email sent successfully! Check your inbox.")
      } else {
        alert("Failed to send email: " + result.error)
      }
    } catch (error) {
      console.error("Error sending test email:", error)
      alert("Error sending email. Check console for details.")
    } finally {
      setIsSending(false)
    }
  }

  const scheduleDailyEmails = async () => {
    setIsSending(true)
    try {
      const response = await fetch("/api/schedule-daily-emails", {
        method: "POST",
      })

      const result = await response.json()
      setLastResult(result)

      if (result.success) {
        alert(`Daily emails scheduled! Sent ${result.emailsSent} emails.`)
      } else {
        alert("Failed to schedule emails: " + result.error)
      }
    } catch (error) {
      console.error("Error scheduling daily emails:", error)
      alert("Error scheduling emails. Check console for details.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Email Testing Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Button onClick={sendTestProgressEmail} disabled={isSending} className="w-full gap-2">
            <Send className="w-4 h-4" />
            {isSending ? "Sending..." : "Send Test Progress Email"}
          </Button>

          <Button onClick={scheduleDailyEmails} disabled={isSending} variant="outline" className="w-full gap-2">
            <Clock className="w-4 h-4" />
            {isSending ? "Scheduling..." : "Schedule Daily Emails"}
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
          <p>• Test emails will be sent to your registered email</p>
          <p>• Admin notifications go to info.aviralone@gmail.com</p>
          <p>• Daily emails check for users who haven't received emails in 20+ hours</p>
        </div>
      </CardContent>
    </Card>
  )
}
