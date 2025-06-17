"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  CheckCircle,
  Brain,
  ArrowLeft,
  Home,
  Play,
  Lightbulb,
  Code,
  BookOpen,
  Target,
  Trophy,
  Timer,
  Smartphone,
  Monitor,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface MCQ {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
  difficulty: "Easy" | "Medium" | "Hard"
}

interface ProgramChallenge {
  id: number
  title: string
  description: string
  starterCode: string
  expectedOutput: string
  hints: string[]
  difficulty: "Easy" | "Medium" | "Hard"
  points: number
}

export default function PracticePage() {
  const params = useParams()
  const weekId = Number.parseInt(params.weekId as string)
  const dayId = Number.parseInt(params.dayId as string)

  const [currentMCQ, setCurrentMCQ] = useState(0)
  const [mcqAnswers, setMcqAnswers] = useState<number[]>([])
  const [mcqScore, setMcqScore] = useState(0)
  const [showMCQResults, setShowMCQResults] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)

  const [currentProgram, setCurrentProgram] = useState(0)
  const [userCode, setUserCode] = useState("")
  const [programResults, setProgramResults] = useState<boolean[]>([])
  const [showHints, setShowHints] = useState(false)
  const [currentHint, setCurrentHint] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState("")

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Sample MCQs for Week 1, Day 1
  const mcqs: MCQ[] = [
    {
      id: 1,
      question: "Which of the following is the correct way to include the iostream library in C++?",
      options: ["#include <iostream.h>", "#include <iostream>", "#include iostream", "include <iostream>"],
      correct: 1,
      explanation: "In modern C++, we use #include <iostream> without the .h extension.",
      difficulty: "Easy",
    },
    {
      id: 2,
      question: "What does the 'using namespace std;' statement do?",
      options: [
        "It includes the standard library",
        "It allows us to use standard library functions without std:: prefix",
        "It defines a new namespace",
        "It imports all header files",
      ],
      correct: 1,
      explanation:
        "The 'using namespace std;' statement allows us to use standard library functions like cout, cin without the std:: prefix.",
      difficulty: "Easy",
    },
    {
      id: 3,
      question: "Which function is the entry point of a C++ program?",
      options: ["start()", "begin()", "main()", "init()"],
      correct: 2,
      explanation: "The main() function is the entry point where program execution begins.",
      difficulty: "Easy",
    },
    {
      id: 4,
      question: "What is the correct syntax for single-line comments in C++?",
      options: ["/* comment */", "// comment", "# comment", "<!-- comment -->"],
      correct: 1,
      explanation: "Single-line comments in C++ start with // and continue to the end of the line.",
      difficulty: "Easy",
    },
    {
      id: 5,
      question: "What does 'return 0;' indicate in the main function?",
      options: [
        "The program failed",
        "The program executed successfully",
        "The program is incomplete",
        "The program needs more memory",
      ],
      correct: 1,
      explanation: "return 0; indicates that the program executed successfully without errors.",
      difficulty: "Easy",
    },
  ]

  // Sample Programming Challenges
  const programs: ProgramChallenge[] = [
    {
      id: 1,
      title: "Hello World Program",
      description: "Write a C++ program that prints 'Hello, World!' to the console.",
      starterCode: `#include <iostream>
using namespace std;

int main() {
    // Write your code here
    
    return 0;
}`,
      expectedOutput: "Hello, World!",
      hints: [
        "Use cout to print output to the console",
        "Don't forget to use << operator with cout",
        "The exact text should be 'Hello, World!'",
      ],
      difficulty: "Easy",
      points: 100,
    },
    {
      id: 2,
      title: "Personal Introduction",
      description: "Write a program that prints your name and a welcome message.",
      starterCode: `#include <iostream>
using namespace std;

int main() {
    // Print your name and a welcome message
    
    return 0;
}`,
      expectedOutput: "My name is [Your Name]\nWelcome to C++ Programming!",
      hints: [
        "Use cout for each line of output",
        "Use endl or \\n for new lines",
        "You can use multiple cout statements",
      ],
      difficulty: "Easy",
      points: 150,
    },
  ]

  useEffect(() => {
    if (programs[currentProgram]) {
      setUserCode(programs[currentProgram].starterCode)
    }
  }, [currentProgram])

  const handleMCQAnswer = (questionIndex: number, answer: number) => {
    const newAnswers = [...mcqAnswers]
    newAnswers[questionIndex] = answer
    setMcqAnswers(newAnswers)
  }

  const submitMCQs = () => {
    let score = 0
    mcqs.forEach((mcq, index) => {
      if (mcqAnswers[index] === mcq.correct) {
        score++
      }
    })
    setMcqScore(score)
    setShowMCQResults(true)
  }

  const runProgram = async () => {
    setIsRunning(true)
    setOutput("")

    // Simulate program execution
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const isCorrect = userCode.includes("Hello, World!") || userCode.includes("cout")
    const newResults = [...programResults]
    newResults[currentProgram] = isCorrect
    setProgramResults(newResults)

    if (isCorrect) {
      setOutput("Hello, World!\n\nProgram executed successfully! ✅")
    } else {
      setOutput("Compilation Error: Missing required output statement.\nHint: Use cout to print the message.")
    }

    setIsRunning(false)
  }

  const nextHint = () => {
    if (currentHint < programs[currentProgram].hints.length - 1) {
      setCurrentHint(currentHint + 1)
    }
    setShowHints(true)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600 bg-green-50 border-green-200"
      case "Medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "Hard":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Mobile-First Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  Week {weekId} - Day {dayId} Practice
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Timer className="w-4 h-4" />
                    <span>{formatTime(timeSpent)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    <span>MCQs + Programs</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/placement-plan">
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back to Plan</span>
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm" className="gap-2">
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Home</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Progress Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">MCQs</p>
                <p className="text-lg font-bold">{mcqs.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Code className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Programs</p>
                <p className="text-lg font-bold">{programs.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Score</p>
                <p className="text-lg font-bold">{showMCQResults ? `${mcqScore}/${mcqs.length}` : "-"}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Timer className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Time</p>
                <p className="text-lg font-bold">{formatTime(timeSpent)}</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="mcqs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="mcqs" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>MCQs ({mcqs.length})</span>
            </TabsTrigger>
            <TabsTrigger value="programs" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span>Programs ({programs.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* MCQs Tab */}
          <TabsContent value="mcqs">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="h-fit">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                          Multiple Choice Questions
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">Test your understanding of C++ concepts</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-sm">
                          {currentMCQ + 1} of {mcqs.length}
                        </Badge>
                        <Badge
                          className={`text-sm ${getDifficultyColor(mcqs[currentMCQ]?.difficulty || "Easy")}`}
                          variant="outline"
                        >
                          {mcqs[currentMCQ]?.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={((currentMCQ + 1) / mcqs.length) * 100} className="mt-4" />
                  </CardHeader>

                  <CardContent>
                    {!showMCQResults ? (
                      <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h3 className="text-lg font-medium mb-4 text-blue-900">{mcqs[currentMCQ].question}</h3>
                          <RadioGroup
                            value={mcqAnswers[currentMCQ]?.toString()}
                            onValueChange={(value) => handleMCQAnswer(currentMCQ, Number.parseInt(value))}
                            className="space-y-3"
                          >
                            {mcqs[currentMCQ].options.map((option, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-3 p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors"
                              >
                                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                                <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1 text-sm">
                                  <span className="font-medium text-gray-700 mr-2">
                                    {String.fromCharCode(65 + index)}.
                                  </span>
                                  {option}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between gap-3">
                          <Button
                            variant="outline"
                            onClick={() => setCurrentMCQ(Math.max(0, currentMCQ - 1))}
                            disabled={currentMCQ === 0}
                            className="flex items-center gap-2"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            Previous
                          </Button>

                          {currentMCQ === mcqs.length - 1 ? (
                            <Button
                              onClick={submitMCQs}
                              disabled={mcqAnswers.length !== mcqs.length}
                              className="flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Submit All
                            </Button>
                          ) : (
                            <Button
                              onClick={() => setCurrentMCQ(Math.min(mcqs.length - 1, currentMCQ + 1))}
                              className="flex items-center gap-2"
                            >
                              Next
                              <ArrowLeft className="w-4 h-4 rotate-180" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <ScrollArea className="h-96">
                        <div className="space-y-4">
                          <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border">
                            <div className="text-4xl font-bold text-green-600 mb-2">
                              {mcqScore}/{mcqs.length}
                            </div>
                            <p className="text-gray-600 mb-2">
                              You scored {Math.round((mcqScore / mcqs.length) * 100)}%
                            </p>
                            <Badge
                              variant={mcqScore >= mcqs.length * 0.8 ? "default" : "secondary"}
                              className="text-sm"
                            >
                              {mcqScore >= mcqs.length * 0.8 ? "Excellent!" : "Good effort!"}
                            </Badge>
                          </div>

                          <div className="space-y-4">
                            {mcqs.map((mcq, index) => (
                              <div key={index} className="border rounded-lg p-4 bg-white">
                                <div className="flex items-center gap-2 mb-3">
                                  {mcqAnswers[index] === mcq.correct ? (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                  ) : (
                                    <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                                      <span className="text-red-600 text-xs">✗</span>
                                    </div>
                                  )}
                                  <span className="font-medium">Question {index + 1}</span>
                                  <Badge variant="outline" className={`text-xs ${getDifficultyColor(mcq.difficulty)}`}>
                                    {mcq.difficulty}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-700 mb-3">{mcq.question}</p>
                                <div className="bg-green-50 border border-green-200 rounded p-3 mb-2">
                                  <p className="text-sm">
                                    <strong className="text-green-800">Correct Answer:</strong>{" "}
                                    {mcq.options[mcq.correct]}
                                  </p>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                                  <p className="text-sm text-blue-800">
                                    <strong>Explanation:</strong> {mcq.explanation}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </ScrollArea>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* MCQ Progress Sidebar */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Progress Tracker</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Questions Answered</span>
                        <span className="font-medium">
                          {mcqAnswers.length}/{mcqs.length}
                        </span>
                      </div>
                      <Progress value={(mcqAnswers.length / mcqs.length) * 100} className="h-2" />
                    </div>

                    {showMCQResults && (
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Accuracy</span>
                          <span className="font-medium">{Math.round((mcqScore / mcqs.length) * 100)}%</span>
                        </div>
                        <Progress value={(mcqScore / mcqs.length) * 100} className="h-2" />
                      </div>
                    )}

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Quick Stats</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Time Spent:</span>
                          <span className="font-medium">{formatTime(timeSpent)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg. per Question:</span>
                          <span className="font-medium">
                            {mcqAnswers.length > 0 ? formatTime(Math.floor(timeSpent / mcqAnswers.length)) : "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Device Compatibility */}
                <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Smartphone className="w-4 h-4 text-indigo-600" />
                      <h4 className="font-medium text-indigo-900">Mobile Optimized</h4>
                    </div>
                    <p className="text-xs text-indigo-700 mb-3">
                      This interface adapts perfectly to your device size for the best learning experience.
                    </p>
                    <div className="flex items-center gap-3 text-xs text-indigo-600">
                      <Smartphone className="w-3 h-3" />
                      <Monitor className="w-3 h-3" />
                      <span>All devices supported</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Programs Tab */}
          <TabsContent value="programs">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Problem Description */}
              <Card className="h-fit">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="w-5 h-5 text-purple-600" />
                        {programs[currentProgram].title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Programming Challenge {currentProgram + 1} of {programs.length}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-sm">
                        {currentProgram + 1}/{programs.length}
                      </Badge>
                      <Badge
                        className={`text-sm ${getDifficultyColor(programs[currentProgram].difficulty)}`}
                        variant="outline"
                      >
                        {programs[currentProgram].difficulty}
                      </Badge>
                      <Badge variant="secondary" className="text-sm">
                        {programs[currentProgram].points} pts
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-medium mb-3 text-purple-900">Problem Description:</h3>
                    <p className="text-purple-800">{programs[currentProgram].description}</p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-medium mb-3 text-green-900">Expected Output:</h3>
                    <div className="bg-white border rounded p-3 font-mono text-sm text-green-800">
                      {programs[currentProgram].expectedOutput}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentProgram(Math.max(0, currentProgram - 1))}
                      disabled={currentProgram === 0}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentProgram(Math.min(programs.length - 1, currentProgram + 1))}
                      disabled={currentProgram === programs.length - 1}
                      className="flex items-center gap-2"
                    >
                      Next
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Code Editor and Output */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5 text-blue-600" />
                      Code Editor
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="font-mono text-sm min-h-[300px] resize-none bg-gray-50"
                      placeholder="Write your C++ code here..."
                    />
                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                      <Button onClick={runProgram} disabled={isRunning} className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        {isRunning ? "Running..." : "Run Code"}
                      </Button>
                      <Button onClick={nextHint} variant="outline" className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Get Hint
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Output Display */}
                {output && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-green-600" />
                        Program Output
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`p-4 rounded-lg font-mono text-sm ${
                          output.includes("Error")
                            ? "bg-red-50 border border-red-200 text-red-800"
                            : "bg-green-50 border border-green-200 text-green-800"
                        }`}
                      >
                        <pre className="whitespace-pre-wrap">{output}</pre>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Hints Display */}
                {showHints && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-yellow-500" />
                        Hint {currentHint + 1}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800">{programs[currentProgram].hints[currentHint]}</p>
                        {currentHint < programs[currentProgram].hints.length - 1 && (
                          <Button onClick={nextHint} variant="outline" size="sm" className="mt-3">
                            Next Hint
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Mobile-Friendly Tips */}
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-4 h-4 text-blue-600" />
                      <h4 className="font-medium text-blue-900">Coding Tips</h4>
                    </div>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Start with the basic structure: #include, using namespace, main()</li>
                      <li>• Use cout &lt;&lt; "text" to print output</li>
                      <li>• Don't forget semicolons at the end of statements</li>
                      <li>• Test your code frequently as you write</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
