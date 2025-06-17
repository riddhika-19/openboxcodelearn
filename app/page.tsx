"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RegistrationModal } from "@/components/registration-modal"
import { FirstTimePopup } from "@/components/first-time-popup"
import {
  BookOpen,
  Code,
  Trophy,
  Target,
  Zap,
  Brain,
  Calendar,
  Smartphone,
  Monitor,
  Tablet,
  Star,
  TrendingUp,
  Users,
  Heart,
  Github,
  Globe,
  UserPlus,
  Mail,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface UserProgress {
  completedLessons: number[]
  totalScore: number
  currentStreak: number
  lastAccessed: string
}

export default function HomePage() {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedLessons: [],
    totalScore: 0,
    currentStreak: 0,
    lastAccessed: new Date().toISOString(),
  })
  const [isRegistered, setIsRegistered] = useState(false)
  const [showFirstTimeModal, setShowFirstTimeModal] = useState(false)

  useEffect(() => {
    const savedProgress = localStorage.getItem("cpp-learning-progress")
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress))
    }

    const userData = localStorage.getItem("openbox-user")
    if (userData) {
      setIsRegistered(true)
    }

    // Check if this is a first-time user
    const hasVisited = localStorage.getItem("openbox-first-visit")
    if (hasVisited === null && !userData) {
      // Show popup after a short delay for better UX
      setTimeout(() => {
        setShowFirstTimeModal(true)
      }, 1500) // Reduced delay for faster appearance
    }
  }, [])

  const handleCloseFirstTimeModal = () => {
    setShowFirstTimeModal(false)
    // Check if user registered during the modal
    const userData = localStorage.getItem("openbox-user")
    if (userData) {
      setIsRegistered(true)
    }
  }

  const lessons = [
    { id: 1, title: "Hello World & Basic Syntax", difficulty: "Beginner", points: 100 },
    { id: 2, title: "Variables & Data Types", difficulty: "Beginner", points: 150 },
    { id: 3, title: "Input/Output Operations", difficulty: "Beginner", points: 120 },
    { id: 4, title: "Conditional Statements", difficulty: "Beginner", points: 180 },
    { id: 5, title: "Loops & Iterations", difficulty: "Beginner", points: 200 },
    { id: 6, title: "Functions & Parameters", difficulty: "Intermediate", points: 250 },
    { id: 7, title: "Arrays & Vectors", difficulty: "Intermediate", points: 300 },
    { id: 8, title: "Pointers & References", difficulty: "Intermediate", points: 350 },
    { id: 9, title: "Classes & Objects", difficulty: "Advanced", points: 400 },
    { id: 10, title: "Inheritance & Polymorphism", difficulty: "Advanced", points: 500 },
  ]

  const progressPercentage = (userProgress.completedLessons.length / lessons.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* First Time User Popup */}
      <FirstTimePopup isOpen={showFirstTimeModal} onClose={handleCloseFirstTimeModal} />

      {/* Header with OpenBox Branding */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/images/openbox-logo.png"
                alt="OpenBox Community"
                width={120}
                height={32}
                className="h-8 w-auto"
              />
              <div className="hidden sm:block w-px h-8 bg-gray-300" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900">C++ Mastery Platform</h1>
                <p className="text-xs text-gray-600">Community-driven learning</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!isRegistered && (
                <RegistrationModal>
                  <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <UserPlus className="w-4 h-4" />
                    <span className="hidden sm:inline">Join Community</span>
                    <span className="sm:hidden">Join</span>
                  </Button>
                </RegistrationModal>
              )}
              <Badge variant="outline" className="hidden sm:flex items-center gap-1 text-xs">
                <Heart className="w-3 h-3 text-red-500" />
                Open Source
              </Badge>
              <Button variant="outline" size="sm" className="gap-2">
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">GitHub</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - Enhanced with Registration CTA */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <Brain className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 mb-4">
              <Badge variant="outline" className="text-sm px-3 py-1">
                <Globe className="w-4 h-4 mr-2" />
                OpenBox Community Project
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              C++ Mastery Platform
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed">
              Master C++ from zero to advanced with AI-powered feedback, interactive coding, and personalized daily
              progress emails
            </p>

            <div className="flex items-center justify-center gap-2 mb-8 text-sm text-gray-600">
              <span>Built with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>by the OpenBox Community</span>
            </div>

            {/* Enhanced CTA with Registration */}
            {!isRegistered ? (
              <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Get Personalized Learning Emails</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Join 15,000+ learners receiving daily progress updates, personalized recommendations, and motivation
                  emails tailored to your learning style.
                </p>
                <RegistrationModal>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                  >
                    <UserPlus className="w-5 h-5" />
                    Start Your Personalized Journey
                  </Button>
                </RegistrationModal>
                <p className="text-xs text-gray-500 mt-2">Free forever • Unsubscribe anytime • Open source</p>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-900">Welcome Back to OpenBox!</h3>
                </div>
                <p className="text-green-700 mb-4">
                  You're all set up with personalized daily emails and progress tracking. Continue your C++ mastery
                  journey!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/lessons">
                    <Button size="lg" className="w-full sm:w-auto gap-3">
                      <BookOpen className="w-5 h-5" />
                      Continue Learning
                    </Button>
                  </Link>
                  <Link href="/playground">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto gap-3">
                      <Code className="w-5 h-5" />
                      Practice Coding
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Regular CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link href="/playground" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto gap-3 border-2 hover:bg-blue-50">
                    <Code className="w-5 h-5" />
                    Try Playground
                  </Button>
                </Link>
                <Link href="/advanced-playground" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto gap-3 border-2 hover:bg-blue-50">
                    <Zap className="w-5 h-5" />
                    Advanced Playground
                  </Button>
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link href="/placement-plan" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full sm:w-auto gap-3 bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 shadow-lg"
                  >
                    <Calendar className="w-5 h-5" />
                    2-Month Plan
                  </Button>
                </Link>
                <Link href="/lessons" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto gap-3 border-2 hover:bg-green-50">
                    <BookOpen className="w-5 h-5" />
                    Browse Lessons
                  </Button>
                </Link>
              </div>
            </div>

            {/* Device Compatibility Badges */}
            <div className="flex justify-center items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                <span>Mobile</span>
              </div>
              <div className="flex items-center gap-2">
                <Tablet className="w-4 h-4" />
                <span>Tablet</span>
              </div>
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                <span>Desktop</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Email Features Highlight */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-purple-900 mb-2 flex items-center justify-center gap-2">
                <Mail className="w-6 h-6" />📧 Personalized Learning Emails
              </h2>
              <p className="text-purple-700">Stay motivated with daily progress updates tailored to your personality</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-2xl mb-2">🚀</div>
                <div className="font-semibold text-purple-900">Motivational</div>
                <div className="text-sm text-purple-700">High-energy progress updates</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-2xl mb-2">🌟</div>
                <div className="font-semibold text-purple-900">Encouraging</div>
                <div className="text-sm text-purple-700">Gentle and supportive tone</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-2xl mb-2">📊</div>
                <div className="font-semibold text-purple-900">Analytical</div>
                <div className="text-sm text-purple-700">Data-driven insights</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-2xl mb-2">🏆</div>
                <div className="font-semibold text-purple-900">Competitive</div>
                <div className="text-sm text-purple-700">Challenge-focused updates</div>
              </div>
            </div>
            {!isRegistered && (
              <div className="text-center mt-6">
                <RegistrationModal>
                  <Button className="gap-2">
                    <Mail className="w-4 h-4" />
                    Get Your Personalized Emails
                  </Button>
                </RegistrationModal>
              </div>
            )}
          </CardContent>
        </Card>

        {/* OpenBox Community Stats */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-2">🌟 OpenBox Community Impact</h2>
              <p className="text-blue-700">Building the future of open-source education together</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">15,000+</div>
                <div className="text-sm text-blue-700">Active Learners</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">50+</div>
                <div className="text-sm text-blue-700">Contributors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">100%</div>
                <div className="text-sm text-blue-700">Free & Open</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">24/7</div>
                <div className="text-sm text-blue-700">Community Support</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Dashboard - Enhanced Mobile Design */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 group-hover:from-blue-500/20 group-hover:to-cyan-500/20 transition-all duration-300" />
            <CardContent className="p-4 sm:p-6 relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {Math.round(progressPercentage)}%
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Learning Progress</p>
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{Math.round(progressPercentage)}%</p>
                <p className="text-xs text-gray-500">Keep going!</p>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all duration-300" />
            <CardContent className="p-4 sm:p-6 relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <Badge variant="outline" className="text-xs">
                  {userProgress.totalScore}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Score</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{userProgress.totalScore}</p>
                <p className="text-xs text-gray-500">Points earned</p>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 group-hover:from-green-500/20 group-hover:to-emerald-500/20 transition-all duration-300" />
            <CardContent className="p-4 sm:p-6 relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <Badge variant="outline" className="text-xs">
                  {userProgress.currentStreak}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Current Streak</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{userProgress.currentStreak}</p>
                <p className="text-xs text-gray-500">Days in a row</p>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 group-hover:from-orange-500/20 group-hover:to-red-500/20 transition-all duration-300" />
            <CardContent className="p-4 sm:p-6 relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                </div>
                <Badge variant="outline" className="text-xs">
                  {userProgress.completedLessons.length}/{lessons.length}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Lessons Done</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{userProgress.completedLessons.length}</p>
                <p className="text-xs text-gray-500">of {lessons.length} lessons</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Lessons - Mobile Enhanced */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">🎯 Your Learning Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Progress through carefully crafted lessons designed by the OpenBox Community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {lessons.slice(0, 6).map((lesson) => (
              <Card key={lesson.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <Badge
                      variant={
                        lesson.difficulty === "Beginner"
                          ? "default"
                          : lesson.difficulty === "Intermediate"
                            ? "secondary"
                            : "destructive"
                      }
                      className="text-xs"
                    >
                      {lesson.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-600">{lesson.points}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                    {lesson.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {lesson.points} points • Community-created content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {userProgress.completedLessons.includes(lesson.id) ? (
                        <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                          ✓ Completed
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          Not Started
                        </Badge>
                      )}
                    </div>
                    <Link href={`/lesson/${lesson.id}`}>
                      <Button size="sm" className="gap-2">
                        {userProgress.completedLessons.includes(lesson.id) ? (
                          <>
                            <TrendingUp className="w-4 h-4" />
                            Review
                          </>
                        ) : (
                          <>
                            <BookOpen className="w-4 h-4" />
                            Start
                          </>
                        )}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Section - Enhanced with Community Focus */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">🚀 OpenBox Community Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the power of community-driven open-source education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="text-center group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="mx-auto p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Interactive Playground</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Write, compile, and run C++ code directly in your browser with real-time feedback. Built by
                  developers, for developers.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="mx-auto p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Personalized Emails</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Receive daily progress updates, motivational content, and learning recommendations tailored to your
                  personality and goals.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="mx-auto p-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Open Source</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  100% free and open source. Contribute lessons, fix bugs, or suggest features. Education should be
                  accessible to everyone.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Community Contribution Section */}
        <Card className="overflow-hidden border-0 shadow-xl">
          <div className="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 p-8 sm:p-12 text-white">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">🤝 Join the OpenBox Community</h2>
                <p className="text-lg sm:text-xl text-green-100 leading-relaxed">
                  Help us build the future of open-source education. Every contribution makes a difference!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="p-3 bg-white/20 rounded-xl w-fit mx-auto mb-3">
                    <Github className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Contribute Code</h3>
                  <p className="text-sm text-green-100">Add features, fix bugs, improve the platform</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-white/20 rounded-xl w-fit mx-auto mb-3">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Create Content</h3>
                  <p className="text-sm text-green-100">Write lessons, tutorials, and practice problems</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-white/20 rounded-xl w-fit mx-auto mb-3">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Help Others</h3>
                  <p className="text-sm text-green-100">Answer questions, mentor newcomers</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-green-600 hover:bg-gray-100 gap-3 shadow-lg"
                >
                  <Github className="w-5 h-5" />
                  View on GitHub
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white text-white hover:bg-white/10 gap-3"
                >
                  <Users className="w-5 h-5" />
                  Join Discord
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Call to Action - Enhanced */}
        <Card className="overflow-hidden border-0 shadow-xl">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 sm:p-12 text-white text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Ready to Master C++? 🎯</h2>
              <p className="text-lg sm:text-xl text-indigo-100 mb-4 leading-relaxed">
                Join thousands of students learning C++ with our community-driven platform. Start your journey today and
                become interview-ready in just 2 months!
              </p>

              <div className="flex items-center justify-center gap-2 mb-8 text-sm text-indigo-200">
                <span>Proudly powered by</span>
                <Image
                  src="/images/openbox-logo.png"
                  alt="OpenBox Community"
                  width={80}
                  height={20}
                  className="h-5 w-auto brightness-0 invert"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                {!isRegistered ? (
                  <RegistrationModal>
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-gray-100 gap-3 shadow-lg"
                    >
                      <Mail className="w-5 h-5" />
                      Get Personalized Emails
                    </Button>
                  </RegistrationModal>
                ) : (
                  <Link href="/placement-plan">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-gray-100 gap-3 shadow-lg"
                    >
                      <Calendar className="w-5 h-5" />
                      Start 2-Month Plan
                    </Button>
                  </Link>
                )}
                <Link href="/playground">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-white text-white hover:bg-white/10 gap-3"
                  >
                    <Code className="w-5 h-5" />
                    Try Playground
                  </Button>
                </Link>
              </div>

              <div className="flex justify-center items-center gap-8 text-sm text-indigo-200">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>15,000+ Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>Open Source</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span>Mobile Friendly</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
