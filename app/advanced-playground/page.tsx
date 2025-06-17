"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Lightbulb, RotateCcw, Save, Home, Code, Bug, Zap, BookOpen } from "lucide-react"
import Link from "next/link"

export default function AdvancedPlaygroundPage() {
  const [code, setCode] = useState(`#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`)

  const [output, setOutput] = useState("")
  const [feedback, setFeedback] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [feedbackType, setFeedbackType] = useState("run")
  const [savedCodes, setSavedCodes] = useState<{ name: string; code: string }[]>([])

  useEffect(() => {
    const savedCode = localStorage.getItem("cpp-playground-code")
    if (savedCode) {
      setCode(savedCode)
    }

    const savedSnippets = localStorage.getItem("cpp-saved-snippets")
    if (savedSnippets) {
      setSavedCodes(JSON.parse(savedSnippets))
    }
  }, [])

  const saveCode = () => {
    localStorage.setItem("cpp-playground-code", code)

    const snippetName = prompt("Enter a name for this code snippet:", "My Code Snippet")
    if (snippetName) {
      const newSnippets = [...savedCodes, { name: snippetName, code }]
      setSavedCodes(newSnippets)
      localStorage.setItem("cpp-saved-snippets", JSON.stringify(newSnippets))
      alert("Code saved successfully!")
    }
  }

  const loadCode = (savedCode: string) => {
    setCode(savedCode)
  }

  const runCode = async () => {
    setIsLoading(true)
    setOutput("")
    setFeedback("")
    setFeedbackType("run")

    try {
      // Simulate code compilation and execution
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Basic syntax checking
      if (!code.includes("#include") || !code.includes("main()")) {
        setOutput("Compilation Error: Missing required includes or main function")
        await getAIFeedback(code, "debug")
      } else if (code.includes("cout") && !code.includes("#include <iostream>")) {
        setOutput("Compilation Error: iostream header not included for cout")
        await getAIFeedback(code, "debug")
      } else {
        setOutput("Program executed successfully!\n\nOutput:\n" + simulateOutput(code))
      }
    } catch (error) {
      setOutput("Runtime Error: Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const simulateOutput = (code: string): string => {
    // Very basic output simulation
    if (code.includes('cout << "Hello, World!"')) {
      return "Hello, World!"
    } else if (code.includes("cout <<")) {
      const match = code.match(/cout << "(.*?)"/)
      return match ? match[1] : "Output simulation not available"
    }
    return "Output simulation not available"
  }

  const getAIFeedback = async (userCode: string, type: string) => {
    setIsLoading(true)
    setFeedbackType(type)

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
    } finally {
      setIsLoading(false)
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
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Advanced C++ Playground</h1>
            <p className="text-gray-600">Write, compile, and get AI-powered feedback on your C++ code</p>
          </div>
          <div className="flex gap-2">
            <Link href="/playground">
              <Button variant="outline" className="gap-2">
                <Code className="w-4 h-4" />
                Basic Playground
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <Home className="w-4 h-4" />
                Home
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor */}
          <div className="space-y-6">
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
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button onClick={runCode} disabled={isLoading && feedbackType === "run"} className="gap-2">
                    <Play className="w-4 h-4" />
                    {isLoading && feedbackType === "run" ? "Running..." : "Run Code"}
                  </Button>
                  <Button
                    onClick={() => getAIFeedback(code, "hint")}
                    disabled={isLoading && feedbackType === "hint"}
                    variant="outline"
                    className="gap-2"
                  >
                    <Lightbulb className="w-4 h-4" />
                    {isLoading && feedbackType === "hint" ? "Getting Hint..." : "Get Hint"}
                  </Button>
                  <Button
                    onClick={() => getAIFeedback(code, "debug")}
                    disabled={isLoading && feedbackType === "debug"}
                    variant="outline"
                    className="gap-2"
                  >
                    <Bug className="w-4 h-4" />
                    {isLoading && feedbackType === "debug" ? "Debugging..." : "Debug"}
                  </Button>
                  <Button
                    onClick={() => getAIFeedback(code, "optimize")}
                    disabled={isLoading && feedbackType === "optimize"}
                    variant="outline"
                    className="gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    {isLoading && feedbackType === "optimize" ? "Optimizing..." : "Optimize"}
                  </Button>
                  <Button
                    onClick={() => getAIFeedback(code, "explain")}
                    disabled={isLoading && feedbackType === "explain"}
                    variant="outline"
                    className="gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    {isLoading && feedbackType === "explain" ? "Explaining..." : "Explain"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Saved Snippets */}
            {savedCodes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Saved Snippets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {savedCodes.map((snippet, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="justify-start overflow-hidden text-ellipsis whitespace-nowrap"
                        onClick={() => loadCode(snippet.code)}
                      >
                        <Code className="w-4 h-4 mr-2" />
                        {snippet.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Output and Feedback */}
          <div className="space-y-6">
            <Tabs defaultValue="output" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="output">Output</TabsTrigger>
                <TabsTrigger value="feedback">AI Feedback</TabsTrigger>
              </TabsList>
              <TabsContent value="output">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Program Output</CardTitle>
                      {output &&
                        (output.includes("Error") ? (
                          <Badge variant="destructive">Error</Badge>
                        ) : (
                          <Badge variant="default">Success</Badge>
                        ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`font-mono text-sm p-4 rounded-md min-h-[200px] ${
                        output && output.includes("Error") ? "bg-red-50 text-red-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {output || 'Click "Run Code" to see output here...'}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="feedback">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        {feedbackType === "hint" && <Lightbulb className="w-5 h-5 text-yellow-500" />}
                        {feedbackType === "debug" && <Bug className="w-5 h-5 text-red-500" />}
                        {feedbackType === "optimize" && <Zap className="w-5 h-5 text-purple-500" />}
                        {feedbackType === "explain" && <BookOpen className="w-5 h-5 text-blue-500" />}
                        DeepSeek AI Assistant
                      </CardTitle>
                      {isLoading && <Badge variant="outline">Processing...</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 p-4 rounded-md min-h-[200px]">
                      {feedback ? (
                        <p className="text-blue-800 whitespace-pre-line">{feedback}</p>
                      ) : (
                        <p className="text-blue-800">
                          Use the buttons below the code editor to get AI-powered feedback on your code.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Learning Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Common C++ Patterns</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start"
                        onClick={() =>
                          setCode(`#include <iostream>
using namespace std;

int main() {
    // Variables
    int number;
    
    // Input
    cout << "Enter a number: ";
    cin >> number;
    
    // Processing & Output
    if (number % 2 == 0) {
        cout << number << " is even." << endl;
    } else {
        cout << number << " is odd." << endl;
    }
    
    return 0;
}`)
                        }
                      >
                        Input/Output Example
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start"
                        onClick={() =>
                          setCode(`#include <iostream>
using namespace std;

int main() {
    // For loop example
    cout << "Counting from 1 to 5:" << endl;
    for (int i = 1; i <= 5; i++) {
        cout << i << " ";
    }
    cout << endl;
    
    return 0;
}`)
                        }
                      >
                        Loop Example
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start"
                        onClick={() =>
                          setCode(`#include <iostream>
using namespace std;

// Function declaration
int add(int a, int b) {
    return a + b;
}

int main() {
    int num1 = 5, num2 = 7;
    int sum = add(num1, num2);
    
    cout << num1 << " + " << num2 << " = " << sum << endl;
    
    return 0;
}`)
                        }
                      >
                        Function Example
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start"
                        onClick={() =>
                          setCode(`#include <iostream>
#include <vector>
using namespace std;

int main() {
    // Vector example
    vector<int> numbers = {1, 2, 3, 4, 5};
    
    cout << "Vector elements: ";
    for (int num : numbers) {
        cout << num << " ";
    }
    cout << endl;
    
    return 0;
}`)
                        }
                      >
                        Vector Example
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Learning Path</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Continue your C++ learning journey with our structured lessons:
                    </p>
                    <Link href="/lessons">
                      <Button className="w-full">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Browse All Lessons
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
