"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Play, Lightbulb, RotateCcw, Save, Home } from "lucide-react"
import Link from "next/link"

export default function PlaygroundPage() {
  const [code, setCode] = useState(`#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`)

  const [output, setOutput] = useState("")
  const [feedback, setFeedback] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [isGettingHint, setIsGettingHint] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const savedCode = localStorage.getItem("cpp-playground-code")
    if (savedCode) {
      setCode(savedCode)
    }
  }, [])

  const saveCode = () => {
    localStorage.setItem("cpp-playground-code", code)
    alert("Code saved locally!")
  }

  const runCode = async () => {
    setIsRunning(true)
    setOutput("")
    setFeedback("")
    setHasError(false)

    try {
      // Simulate code compilation and execution
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Basic syntax checking
      if (!code.includes("#include") || !code.includes("main()")) {
        setHasError(true)
        setOutput("Compilation Error: Missing required includes or main function")
        await getAIFeedback(code, "compilation_error")
      } else if (code.includes("cout") && !code.includes("#include <iostream>")) {
        setHasError(true)
        setOutput("Compilation Error: iostream header not included for cout")
        await getAIFeedback(code, "missing_header")
      } else {
        setOutput("Hello, World!\n\nProgram executed successfully!")
      }
    } catch (error) {
      setOutput("Runtime Error: Something went wrong")
      setHasError(true)
    } finally {
      setIsRunning(false)
    }
  }

  const getHint = async () => {
    setIsGettingHint(true)
    await getAIFeedback(code, "hint_request")
    setIsGettingHint(false)
  }

  const getAIFeedback = async (userCode: string, type: string) => {
    try {
      const response = await fetch("/api/ai-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: userCode, type }),
      })

      const data = await response.json()
      setFeedback(data.feedback)
    } catch (error) {
      setFeedback("Unable to get AI feedback at the moment. Please try again.")
    }
  }

  const resetCode = () => {
    setCode(`#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`)
    setOutput("")
    setFeedback("")
    setHasError(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">C++ Playground</h1>
            <p className="text-gray-600">Write, compile, and run C++ code with AI assistance</p>
          </div>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <Home className="w-4 h-4" />
              Home
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Code Editor</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={saveCode} size="sm" variant="outline" className="gap-2">
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                  <Button onClick={resetCode} size="sm" variant="outline" className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-mono text-sm min-h-[400px] resize-none"
                placeholder="Write your C++ code here..."
              />
              <div className="flex gap-2 mt-4">
                <Button onClick={runCode} disabled={isRunning} className="gap-2">
                  <Play className="w-4 h-4" />
                  {isRunning ? "Running..." : "Run Code"}
                </Button>
                <Button onClick={getHint} disabled={isGettingHint} variant="outline" className="gap-2">
                  <Lightbulb className="w-4 h-4" />
                  {isGettingHint ? "Getting Hint..." : "Get Hint"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Output and Feedback */}
          <div className="space-y-6">
            {/* Output */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Output</CardTitle>
                  {hasError && <Badge variant="destructive">Error</Badge>}
                  {output && !hasError && <Badge variant="default">Success</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className={`font-mono text-sm p-4 rounded-md min-h-[100px] ${
                    hasError ? "bg-red-50 text-red-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {output || 'Click "Run Code" to see output here...'}
                </div>
              </CardContent>
            </Card>

            {/* AI Feedback */}
            {feedback && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    AI Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 p-4 rounded-md">
                    <p className="text-blue-800">{feedback}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <strong>💡 Learning Approach:</strong>
                  <ul className="mt-2 space-y-1 text-gray-600">
                    <li>• Write code and run it to see what happens</li>
                    <li>• Make mistakes - they're part of learning!</li>
                    <li>• Use the "Get Hint" button when stuck</li>
                    <li>• Try different approaches to solve problems</li>
                  </ul>
                </div>
                <Separator />
                <div className="text-sm">
                  <strong>🔧 Common Issues:</strong>
                  <ul className="mt-2 space-y-1 text-gray-600">
                    <li>• Missing semicolons at end of statements</li>
                    <li>• Forgetting to include necessary headers</li>
                    <li>• Mismatched brackets or parentheses</li>
                    <li>• Case sensitivity in variable names</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
