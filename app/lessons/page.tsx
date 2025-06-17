"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { BookOpen, Search, Filter, Home, Star } from "lucide-react"
import Link from "next/link"

interface Lesson {
  id: number
  title: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  points: number
  topics: string[]
  estimatedTime: string
}

export default function LessonsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All")
  const [completedLessons, setCompletedLessons] = useState<number[]>([])

  useEffect(() => {
    const savedProgress = localStorage.getItem("cpp-learning-progress")
    if (savedProgress) {
      const progress = JSON.parse(savedProgress)
      setCompletedLessons(progress.completedLessons || [])
    }
  }, [])

  const lessons: Lesson[] = [
    {
      id: 1,
      title: "Hello World & Basic Syntax",
      description: "Learn the fundamental structure of a C++ program and write your first code.",
      difficulty: "Beginner",
      points: 100,
      topics: ["Basic syntax", "cout", "main function", "Comments"],
      estimatedTime: "30 min",
    },
    {
      id: 2,
      title: "Variables & Data Types",
      description: "Understand different data types and how to declare and use variables.",
      difficulty: "Beginner",
      points: 150,
      topics: ["int", "float", "char", "string", "bool", "Variable declaration"],
      estimatedTime: "45 min",
    },
    {
      id: 3,
      title: "Input/Output Operations",
      description: "Master cin and cout for user interaction and data display.",
      difficulty: "Beginner",
      points: 120,
      topics: ["cin", "cout", "getline", "Input validation"],
      estimatedTime: "35 min",
    },
    {
      id: 4,
      title: "Conditional Statements",
      description: "Learn to make decisions in your code with if, else, and switch statements.",
      difficulty: "Beginner",
      points: 180,
      topics: ["if-else", "switch-case", "Logical operators", "Nested conditions"],
      estimatedTime: "50 min",
    },
    {
      id: 5,
      title: "Loops & Iterations",
      description: "Understand how to repeat code execution with for, while, and do-while loops.",
      difficulty: "Beginner",
      points: 200,
      topics: ["for loop", "while loop", "do-while", "break", "continue"],
      estimatedTime: "60 min",
    },
    {
      id: 6,
      title: "Functions & Parameters",
      description: "Create reusable code blocks and understand parameter passing.",
      difficulty: "Intermediate",
      points: 250,
      topics: ["Function declaration", "Parameters", "Return values", "Function overloading"],
      estimatedTime: "75 min",
    },
    {
      id: 7,
      title: "Arrays & Vectors",
      description: "Work with collections of data using arrays and dynamic vectors.",
      difficulty: "Intermediate",
      points: 300,
      topics: ["Static arrays", "Dynamic arrays", "Vectors", "Array manipulation"],
      estimatedTime: "90 min",
    },
    {
      id: 8,
      title: "Pointers & References",
      description: "Master memory management and understand pointer arithmetic.",
      difficulty: "Intermediate",
      points: 350,
      topics: ["Pointer basics", "Pointer arithmetic", "References", "Memory management"],
      estimatedTime: "120 min",
    },
    {
      id: 9,
      title: "Classes & Objects",
      description: "Introduction to Object-Oriented Programming with classes and objects.",
      difficulty: "Advanced",
      points: 400,
      topics: ["Class definition", "Objects", "Constructors", "Destructors", "Access modifiers"],
      estimatedTime: "150 min",
    },
    {
      id: 10,
      title: "Inheritance & Polymorphism",
      description: "Advanced OOP concepts including inheritance and polymorphism.",
      difficulty: "Advanced",
      points: 500,
      topics: ["Inheritance", "Virtual functions", "Polymorphism", "Abstract classes"],
      estimatedTime: "180 min",
    },
  ]

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.topics.some((topic) => topic.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesDifficulty = selectedDifficulty === "All" || lesson.difficulty === selectedDifficulty

    return matchesSearch && matchesDifficulty
  })

  const totalProgress = (completedLessons.length / lessons.length) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">C++ Lessons</h1>
            <p className="text-gray-600">Master C++ step by step with interactive lessons</p>
          </div>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <Home className="w-4 h-4" />
              Home
            </Button>
          </Link>
        </div>

        {/* Progress Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600">
                {completedLessons.length}/{lessons.length} lessons
              </span>
            </div>
            <Progress value={totalProgress} className="mb-4" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{completedLessons.length}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{lessons.length - completedLessons.length}</div>
                <div className="text-sm text-gray-600">Remaining</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {completedLessons.reduce((sum, id) => sum + (lessons.find((l) => l.id === id)?.points || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Points Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search lessons, topics, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {["All", "Beginner", "Intermediate", "Advanced"].map((difficulty) => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDifficulty(difficulty)}
                className="gap-2"
              >
                <Filter className="w-4 h-4" />
                {difficulty}
              </Button>
            ))}
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge
                    variant={
                      lesson.difficulty === "Beginner"
                        ? "default"
                        : lesson.difficulty === "Intermediate"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {lesson.difficulty}
                  </Badge>
                  {completedLessons.includes(lesson.id) && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Completed
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{lesson.title}</CardTitle>
                <CardDescription>{lesson.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration: {lesson.estimatedTime}</span>
                    <span className="font-medium text-blue-600">{lesson.points} points</span>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">Topics covered:</div>
                    <div className="flex flex-wrap gap-1">
                      {lesson.topics.slice(0, 3).map((topic, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {lesson.topics.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{lesson.topics.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Link href={`/lesson/${lesson.id}`} className="block">
                    <Button className="w-full">
                      {completedLessons.includes(lesson.id) ? "Review Lesson" : "Start Lesson"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLessons.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
