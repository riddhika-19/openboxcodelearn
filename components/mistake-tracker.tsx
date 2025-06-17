"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Send, User, Calendar } from "lucide-react"

interface Mistake {
  id: string
  userId: string
  userName: string
  mistakeType: string
  description: string
  code: string
  timestamp: string
  resolved: boolean
}

export function MistakeTracker() {
  const [mistakes, setMistakes] = useState<Mistake[]>([
    {
      id: "1",
      userId: "user123",
      userName: "John Doe",
      mistakeType: "Syntax Error",
      description: "Missing semicolon in C++ code",
      code: 'int main() { cout << "Hello" }',
      timestamp: "2024-01-15T10:30:00Z",
      resolved: false,
    },
    {
      id: "2",
      userId: "user456",
      userName: "Jane Smith",
      mistakeType: "Logic Error",
      description: "Infinite loop in while statement",
      code: "while(true) { /* no break condition */ }",
      timestamp: "2024-01-15T09:15:00Z",
      resolved: true,
    },
  ])

  const [newMistake, setNewMistake] = useState({
    userId: "",
    userName: "",
    mistakeType: "",
    description: "",
    code: "",
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleAddMistake = async () => {
    if (!newMistake.userId || !newMistake.mistakeType || !newMistake.description) {
      return
    }

    setIsLoading(true)

    const mistake: Mistake = {
      id: Date.now().toString(),
      ...newMistake,
      timestamp: new Date().toISOString(),
      resolved: false,
    }

    setMistakes((prev) => [mistake, ...prev])
    setNewMistake({
      userId: "",
      userName: "",
      mistakeType: "",
      description: "",
      code: "",
    })

    // Simulate API call to track mistake
    try {
      await fetch("/api/track-mistake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mistake),
      })
    } catch (error) {
      console.error("Error tracking mistake:", error)
    }

    setIsLoading(false)
  }

  const handleSendConsultation = async (mistake: Mistake) => {
    try {
      await fetch("/api/send-consultation-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: mistake.userId,
          userName: mistake.userName,
          mistakeType: mistake.mistakeType,
          description: mistake.description,
        }),
      })

      // Mark as resolved
      setMistakes((prev) => prev.map((m) => (m.id === mistake.id ? { ...m, resolved: true } : m)))
    } catch (error) {
      console.error("Error sending consultation email:", error)
    }
  }

  const unresolvedCount = mistakes.filter((m) => !m.resolved).length

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Mistake Tracking Dashboard
          </CardTitle>
          <div className="flex gap-4">
            <Badge variant="destructive">{unresolvedCount} Unresolved</Badge>
            <Badge variant="secondary">{mistakes.length - unresolvedCount} Resolved</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                value={newMistake.userId}
                onChange={(e) => setNewMistake((prev) => ({ ...prev, userId: e.target.value }))}
                placeholder="Enter user ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userName">User Name</Label>
              <Input
                id="userName"
                value={newMistake.userName}
                onChange={(e) => setNewMistake((prev) => ({ ...prev, userName: e.target.value }))}
                placeholder="Enter user name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mistakeType">Mistake Type</Label>
            <Input
              id="mistakeType"
              value={newMistake.mistakeType}
              onChange={(e) => setNewMistake((prev) => ({ ...prev, mistakeType: e.target.value }))}
              placeholder="e.g., Syntax Error, Logic Error, Runtime Error"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newMistake.description}
              onChange={(e) => setNewMistake((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the mistake..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Code Snippet (Optional)</Label>
            <Textarea
              id="code"
              value={newMistake.code}
              onChange={(e) => setNewMistake((prev) => ({ ...prev, code: e.target.value }))}
              placeholder="Paste the problematic code here..."
              rows={4}
              className="font-mono text-sm"
            />
          </div>

          <Button
            onClick={handleAddMistake}
            disabled={isLoading || !newMistake.userId || !newMistake.mistakeType}
            className="w-full"
          >
            {isLoading ? "Adding..." : "Track Mistake"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Mistakes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mistakes.map((mistake) => (
              <div key={mistake.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{mistake.userName}</span>
                    <Badge variant="outline">{mistake.userId}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{new Date(mistake.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={mistake.resolved ? "default" : "destructive"}>{mistake.mistakeType}</Badge>
                    {mistake.resolved && <Badge variant="secondary">Resolved</Badge>}
                  </div>
                  <p className="text-sm text-gray-700">{mistake.description}</p>
                  {mistake.code && (
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                      <code>{mistake.code}</code>
                    </pre>
                  )}
                </div>

                {!mistake.resolved && (
                  <Button size="sm" onClick={() => handleSendConsultation(mistake)} className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Consultation Email
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
