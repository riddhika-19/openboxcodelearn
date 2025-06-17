"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  TrendingUp,
  Mail,
  MessageSquare,
  BarChart3,
  Clock,
  Target,
  Brain,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { mistakeTracker } from "@/lib/mistake-tracker"

export function MistakeTrackerPanel() {
  const [userMistakes, setUserMistakes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastReport, setLastReport] = useState<any>(null)

  useEffect(() => {
    loadUserMistakes()
  }, [])

  const loadUserMistakes = () => {
    try {
      const userData = localStorage.getItem("openbox-user")
      if (userData) {
        const user = JSON.parse(userData)
        const mistakes = mistakeTracker.getUserMistakes(user.email)
        setUserMistakes(mistakes)
      }
    } catch (error) {
      console.error("Error loading mistakes:", error)
    }
  }

  const addSampleMistake = () => {
    const userData = localStorage.getItem("openbox-user")
    if (!userData) {
      alert("Please register first to track mistakes")
      return
    }

    const user = JSON.parse(userData)
    const sampleMistakes = [
      {
        userId: user.email,
        userEmail: user.email,
        userName: user.name,
        mistakeType: "syntax" as const,
        errorMessage: "Missing semicolon at end of statement",
        userCode: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello World"  // Missing semicolon
    return 0;
}`,
        difficulty: "beginner" as const,
        topic: "Basic Syntax",
        resolved: false,
        attempts: 3,
        timeSpent: 180,
        hints_used: 1,
        lessonId: 1,
      },
      {
        userId: user.email,
        userEmail: user.email,
        userName: user.name,
        mistakeType: "compilation" as const,
        errorMessage: 'Undefined variable "num"',
        userCode: `#include <iostream>
using namespace std;

int main() {
    cout << num << endl;  // num not declared
    return 0;
}`,
        difficulty: "beginner" as const,
        topic: "Variables & Data Types",
        resolved: true,
        attempts: 2,
        timeSpent: 120,
        hints_used: 0,
        lessonId: 2,
      },
    ]

    const randomMistake = sampleMistakes[Math.floor(Math.random() * sampleMistakes.length)]
    mistakeTracker.addMistake(randomMistake)
    loadUserMistakes()
  }

  const generateReport = async () => {
    setIsLoading(true)
    try {
      const userData = localStorage.getItem("openbox-user")
      if (!userData) {
        alert("Please register first")
        return
      }

      const user = JSON.parse(userData)
      const report = mistakeTracker.generateUserReport(user.email)
      setLastReport(report)

      // Send consultation email
      const success = await mistakeTracker.sendConsultationEmail(user.email)
      if (success) {
        alert("Consultation email sent! Check your inbox.")
      }
    } catch (error) {
      console.error("Error generating report:", error)
      alert("Error generating report. Make sure you have some mistakes recorded.")
    } finally {
      setIsLoading(false)
    }
  }

  const sendWeeklyReport = async () => {
    setIsLoading(true)
    try {
      const userData = localStorage.getItem("openbox-user")
      if (!userData) {
        alert("Please register first")
        return
      }

      const user = JSON.parse(userData)
      const success = await mistakeTracker.sendWeeklyReport(user.email)
      if (success) {
        alert("Weekly report sent to admin!")
      }
    } catch (error) {
      console.error("Error sending weekly report:", error)
      alert("Error sending report.")
    } finally {
      setIsLoading(false)
    }
  }

  const sendTestSMS = async () => {
    setIsLoading(true)
    try {
      const userData = localStorage.getItem("openbox-user")
      if (!userData) {
        alert("Please register first")
        return
      }

      const user = JSON.parse(userData)
      const response = await fetch("/api/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: user.phone || "+1234567890",
          userName: user.name,
          message: `Hi ${user.name}! 👋 Don't give up on your C++ journey. Every expert was once a beginner who made mistakes. Need help? Our community is here for you! 💪 - OpenBox Team`,
        }),
      })

      const result = await response.json()
      if (result.success) {
        alert("SMS notification sent! (Check admin email for simulation)")
      }
    } catch (error) {
      console.error("Error sending SMS:", error)
      alert("Error sending SMS")
    } finally {
      setIsLoading(false)
    }
  }

  const getMistakeTypeColor = (type: string) => {
    const colors = {
      syntax: "bg-red-100 text-red-800",
      logic: "bg-yellow-100 text-yellow-800",
      compilation: "bg-orange-100 text-orange-800",
      runtime: "bg-purple-100 text-purple-800",
      "best-practice": "bg-blue-100 text-blue-800",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Mistake Tracking & Analysis System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="mistakes">Mistakes</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                      <div>
                        <p className="text-2xl font-bold">{userMistakes.length}</p>
                        <p className="text-sm text-gray-600">Total Mistakes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold">{userMistakes.filter((m) => m.resolved).length}</p>
                        <p className="text-sm text-gray-600">Resolved</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold">
                          {userMistakes.length > 0
                            ? Math.round((userMistakes.filter((m) => m.resolved).length / userMistakes.length) * 100)
                            : 0}
                          %
                        </p>
                        <p className="text-sm text-gray-600">Success Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {userMistakes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Learning Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Resolution Rate</span>
                        <span>
                          {Math.round((userMistakes.filter((m) => m.resolved).length / userMistakes.length) * 100)}%
                        </span>
                      </div>
                      <Progress value={(userMistakes.filter((m) => m.resolved).length / userMistakes.length) * 100} />
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="mistakes" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Recent Mistakes</h3>
                <Button onClick={addSampleMistake} variant="outline" size="sm">
                  Add Sample Mistake
                </Button>
              </div>

              {userMistakes.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No mistakes recorded yet</h3>
                    <p className="text-gray-500 mb-4">Start coding to track your learning progress!</p>
                    <Button onClick={addSampleMistake} variant="outline">
                      Add Sample Data
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {userMistakes.slice(0, 5).map((mistake, index) => (
                    <Card key={mistake.id || index}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge className={getMistakeTypeColor(mistake.mistakeType)}>{mistake.mistakeType}</Badge>
                            <Badge variant="outline">{mistake.topic}</Badge>
                            {mistake.resolved ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(mistake.timestamp).toLocaleDateString()}
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 mb-2">{mistake.errorMessage}</p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            {mistake.attempts} attempts
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {Math.round(mistake.timeSpent / 60)} min
                          </span>
                          <span>💡 {mistake.hints_used} hints</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Generate Analysis Report</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Generate a comprehensive analysis of your coding mistakes and get personalized recommendations.
                    </p>
                    <Button
                      onClick={generateReport}
                      disabled={isLoading || userMistakes.length === 0}
                      className="w-full"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      {isLoading ? "Generating..." : "Generate Report & Send Consultation Email"}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Weekly Admin Report</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Send detailed weekly report to admin for tracking and intervention.
                    </p>
                    <Button
                      onClick={sendWeeklyReport}
                      disabled={isLoading || userMistakes.length === 0}
                      variant="outline"
                      className="w-full"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      {isLoading ? "Sending..." : "Send Weekly Report to Admin"}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {lastReport && (
                <Card>
                  <CardHeader>
                    <CardTitle>Latest Report Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-red-600">{lastReport.totalMistakes}</p>
                        <p className="text-sm text-gray-600">Total Mistakes</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{lastReport.strugglingTopics.length}</p>
                        <p className="text-sm text-gray-600">Focus Areas</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">{lastReport.recommendedLessons.length}</p>
                        <p className="text-sm text-gray-600">Recommendations</p>
                      </div>
                      <div>
                        <Badge
                          className={`text-sm ${
                            lastReport.overallProgress === "excellent"
                              ? "bg-green-100 text-green-800"
                              : lastReport.overallProgress === "good"
                                ? "bg-blue-100 text-blue-800"
                                : lastReport.overallProgress === "needs-improvement"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {lastReport.overallProgress.replace("-", " ")}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Send Support SMS</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Send a motivational SMS message to encourage continued learning.
                    </p>
                    <Button onClick={sendTestSMS} disabled={isLoading} className="w-full">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      {isLoading ? "Sending..." : "Send Motivational SMS"}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Email Consultation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">Offer personalized consultation based on learning analysis.</p>
                    <Button
                      onClick={generateReport}
                      disabled={isLoading || userMistakes.length === 0}
                      variant="outline"
                      className="w-full"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      {isLoading ? "Sending..." : "Send Consultation Offer"}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Automated Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>First mistake triggers automatic consultation offer email</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Admin gets notified of first-time user mistakes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Weekly reports can be scheduled for struggling users</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>SMS notifications for motivation and support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
