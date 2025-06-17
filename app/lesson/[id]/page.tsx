"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Play, Lightbulb, CheckCircle, ArrowLeft, ArrowRight, Home } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface LessonContent {
  id: number
  title: string
  theory: string
  example: string
  exercise: string
  solution: string
  hints: string[]
}

export default function LessonPage() {
  const params = useParams()
  const lessonId = Number.parseInt(params.id as string)

  const [currentStep, setCurrentStep] = useState(0)
  const [userCode, setUserCode] = useState("")
  const [output, setOutput] = useState("")
  const [feedback, setFeedback] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [currentHint, setCurrentHint] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  const lessonContent: LessonContent = {
    id: lessonId,
    title: "Hello World & Basic Syntax",
    theory: `Welcome to your first C++ lesson! Every C++ program follows a basic structure:

1. **Include statements**: Tell the compiler which libraries to use
2. **Namespace**: Avoid typing std:: before standard functions
3. **Main function**: Where your program starts executing
4. **Statements**: Instructions that end with semicolons
5. **Return statement**: Indicates successful program completion

The basic structure looks like this:
- #include <iostream> - includes input/output stream library
- using namespace std; - allows us to use cout without std::
- int main() - the main function that returns an integer
- cout << "text" - outputs text to the console
- return 0; - indicates successful program execution`,

    example: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,

    exercise: `Now it's your turn! Write a C++ program that:
1. Includes the iostream library
2. Uses the standard namespace
3. Has a main function
4. Prints "Welcome to C++ Programming!" to the console
5. Returns 0

Try writing the code in the editor below:`,

    solution: `#include <iostream>
using namespace std;

int main() {
    cout << "Welcome to C++ Programming!" << endl;
    return 0;
}`,

    hints: [
      "Start with #include <iostream> to include the input/output library",
      "Add 'using namespace std;' to use standard functions without std:: prefix",
      "Create the main function: int main() { }",
      'Use cout << "your message" << endl; to print text',
      "Don't forget to return 0; at the end of main function",
    ],
  }

  const steps = ["Theory", "Example", "Practice", "Complete"]

  useEffect(() => {
    if (currentStep === 2) {
      setUserCode(`#include <iostream>
using namespace std;

int main() {
    // Write your code here
    
    return 0;
}`)
    }
  }, [currentStep])

  const runCode = async () => {
    setIsRunning(true)
    setOutput("")
    setFeedback("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (userCode.includes("Welcome to C++ Programming!")) {
        setOutput("Welcome to C++ Programming!\n\nProgram executed successfully!")
        setFeedback(
          "🎉 Excellent! You've successfully completed the exercise. Your code follows the correct C++ structure and produces the expected output.",
        )
        setIsCompleted(true)
      } else if (userCode.includes("cout")) {
        setOutput("Your output here...\n\nProgram executed, but output doesn't match expected result.")
        setFeedback(
          'Good attempt! Your code runs, but the output message should be exactly "Welcome to C++ Programming!". Check your cout statement.',
        )
      } else {
        setOutput("Compilation Error: Missing cout statement")
        setFeedback(
          'It looks like you haven\'t added the cout statement yet. Remember to use cout << "message" to print text to the console.',
        )
      }
    } catch (error) {
      setOutput("Error occurred while running code")
    } finally {
      setIsRunning(false)
    }
  }

  const nextHint = () => {
    if (currentHint < lessonContent.hints.length - 1) {
      setCurrentHint(currentHint + 1)
    }
    setShowHint(true)
  }

  const completeLesson = () => {
    const savedProgress = localStorage.getItem("cpp-learning-progress")
    const progress = savedProgress ? JSON.parse(savedProgress) : { completedLessons: [], totalScore: 0 }

    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId)
      progress.totalScore += 100
      localStorage.setItem("cpp-learning-progress", JSON.stringify(progress))
    }

    setCurrentStep(3)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{lessonContent.title}</h1>
            <p className="text-gray-600">Lesson {lessonId} • Interactive C++ Learning</p>
          </div>
          <div className="flex gap-2">
            <Link href="/lessons">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Lessons
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

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium">Lesson Progress</span>
              <span className="text-sm text-gray-600">
                {currentStep + 1}/{steps.length}
              </span>
            </div>
            <Progress value={((currentStep + 1) / steps.length) * 100} className="mb-4" />
            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`text-sm ${index <= currentStep ? "text-blue-600 font-medium" : "text-gray-400"}`}
                >
                  {step}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Content */}
          <div className="space-y-6">
            {currentStep === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>📚 Theory</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">{lessonContent.theory}</pre>
                  </div>
                  <Button onClick={() => setCurrentStep(1)} className="mt-4">
                    Continue to Example
                  </Button>
                </CardContent>
              </Card>
            )}

            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>💡 Example</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Here's a complete example of a basic C++ program:</p>
                  <div className="bg-gray-100 p-4 rounded-md font-mono text-sm mb-4">
                    <pre>{lessonContent.example}</pre>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    This program will output "Hello, World!" to the console. Notice the structure and syntax.
                  </p>
                  <Button onClick={() => setCurrentStep(2)} className="mt-4">
                    Start Practice
                  </Button>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>🚀 Practice Exercise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none mb-4">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">{lessonContent.exercise}</pre>
                  </div>
                  {isCompleted && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Exercise Completed!</span>
                      </div>
                      <p className="text-green-700 mt-1">Great job! You can now proceed to complete the lesson.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    Lesson Complete!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-xl font-bold mb-2">Congratulations!</h3>
                    <p className="text-gray-600 mb-6">
                      You've successfully completed "{lessonContent.title}". You earned 100 points!
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Link href="/lessons">
                        <Button>Back to Lessons</Button>
                      </Link>
                      <Link href={`/lesson/${lessonId + 1}`}>
                        <Button variant="outline" className="gap-2">
                          Next Lesson
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Code Editor (only in practice step) */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Code Editor</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    className="font-mono text-sm min-h-[300px] resize-none"
                    placeholder="Write your C++ code here..."
                  />
                  <div className="flex gap-2 mt-4">
                    <Button onClick={runCode} disabled={isRunning} className="gap-2">
                      <Play className="w-4 h-4" />
                      {isRunning ? "Running..." : "Run Code"}
                    </Button>
                    <Button onClick={nextHint} variant="outline" className="gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Get Hint
                    </Button>
                    {isCompleted && (
                      <Button onClick={completeLesson} className="gap-2 ml-auto">
                        <CheckCircle className="w-4 h-4" />
                        Complete Lesson
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Output */}
              {output && (
                <Card>
                  <CardHeader>
                    <CardTitle>Output</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 p-4 rounded-md font-mono text-sm">{output}</div>
                  </CardContent>
                </Card>
              )}

              {/* Feedback */}
              {feedback && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      AI Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 p-4 rounded-md">
                      <p className="text-blue-800">{feedback}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Hints */}
              {showHint && (
                <Card>
                  <CardHeader>
                    <CardTitle>💡 Hint {currentHint + 1}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{lessonContent.hints[currentHint]}</p>
                    {currentHint < lessonContent.hints.length - 1 && (
                      <Button onClick={nextHint} variant="outline" size="sm" className="mt-3">
                        Next Hint
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
