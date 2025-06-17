"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Calendar,
  Clock,
  BookOpen,
  Code,
  CheckCircle,
  Target,
  Trophy,
  Home,
  ChevronDown,
  ChevronRight,
  FileText,
  Video,
  Play,
  Star,
  Award,
  Users,
  Smartphone,
  Monitor,
  Tablet,
  Heart,
  Github,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface DayProgress {
  weekId: number
  dayId: number
  completed: boolean
  theoryCompleted: boolean
  videoCompleted: boolean
  practiceCompleted: boolean
  score: number
}

interface PlacementProgress {
  completedDays: DayProgress[]
  currentWeek: number
  currentDay: number
  totalScore: number
  startDate: string
}

export default function PlacementPlanPage() {
  const [progress, setProgress] = useState<PlacementProgress>({
    completedDays: [],
    currentWeek: 1,
    currentDay: 1,
    totalScore: 0,
    startDate: new Date().toISOString(),
  })
  const [openWeeks, setOpenWeeks] = useState<number[]>([1])
  const [selectedDay, setSelectedDay] = useState<{ weekId: number; dayId: number } | null>(null)

  useEffect(() => {
    const savedProgress = localStorage.getItem("cpp-placement-progress")
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress))
    }
  }, [])

  const saveProgress = (newProgress: PlacementProgress) => {
    setProgress(newProgress)
    localStorage.setItem("cpp-placement-progress", JSON.stringify(newProgress))
  }

  const toggleWeek = (weekId: number) => {
    setOpenWeeks((prev) => (prev.includes(weekId) ? prev.filter((id) => id !== weekId) : [...prev, weekId]))
  }

  const markDayCompleted = (weekId: number, dayId: number, component: "theory" | "video" | "practice") => {
    const existingDay = progress.completedDays.find((d) => d.weekId === weekId && d.dayId === dayId)

    let updatedDay: DayProgress
    if (existingDay) {
      updatedDay = {
        ...existingDay,
        [`${component}Completed`]: true,
      }
    } else {
      updatedDay = {
        weekId,
        dayId,
        completed: false,
        theoryCompleted: component === "theory",
        videoCompleted: component === "video",
        practiceCompleted: component === "practice",
        score: 0,
      }
    }

    if (updatedDay.theoryCompleted && updatedDay.videoCompleted && updatedDay.practiceCompleted) {
      updatedDay.completed = true
      updatedDay.score = 100
    }

    const newCompletedDays = progress.completedDays.filter((d) => !(d.weekId === weekId && d.dayId === dayId))
    newCompletedDays.push(updatedDay)

    const newProgress = {
      ...progress,
      completedDays: newCompletedDays,
      totalScore: newCompletedDays.reduce((sum, day) => sum + day.score, 0),
    }

    saveProgress(newProgress)
  }

  const getDayProgress = (weekId: number, dayId: number): DayProgress | null => {
    return progress.completedDays.find((d) => d.weekId === weekId && d.dayId === dayId) || null
  }

  const getWeekProgress = (weekId: number): number => {
    const weekDays = placementPlan.find((w) => w.id === weekId)?.days.length || 0
    const completedDays = progress.completedDays.filter((d) => d.weekId === weekId && d.completed).length
    return weekDays > 0 ? (completedDays / weekDays) * 100 : 0
  }

  const getTotalProgress = (): number => {
    const totalDays = placementPlan.reduce((sum, week) => sum + week.days.length, 0)
    const completedDays = progress.completedDays.filter((d) => d.completed).length
    return totalDays > 0 ? (completedDays / totalDays) * 100 : 0
  }

  const placementPlan = [
    {
      id: 1,
      title: "Foundation of C++",
      goal: "Master the fundamental building blocks of C++ programming",
      description: "Build a solid foundation with C++ basics, syntax, and core concepts",
      color: "from-blue-500 to-cyan-500",
      icon: "🚀",
      days: [
        {
          id: 1,
          title: "C++ Introduction & Evolution",
          topics: ["C++ History", "Programming Paradigms", "Compilation Process", "Development Environment"],
          difficulty: "Beginner",
          estimatedTime: "45 min",
          mcqs: 8,
          programs: 3,
        },
        // Add more days here...
      ],
    },
    // Add more weeks here...
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Mobile-First Header with OpenBox Branding */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/openbox-logo.png"
                alt="OpenBox Community"
                width={100}
                height={26}
                className="h-6 w-auto"
              />
              <div className="hidden sm:block w-px h-6 bg-gray-300" />
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  C++ Placement Plan
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>8 Weeks • Interview Ready</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-red-500" />
                    <span>OpenBox Community</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">Contribute</span>
              </Button>
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

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* OpenBox Community Banner */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-lg font-bold text-blue-900 mb-1">Community-Driven Learning Plan</h2>
                <p className="text-blue-700 text-sm">
                  This comprehensive 2-month plan was created by the OpenBox Community with input from industry experts
                  and successful placement candidates.
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm text-blue-600">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>Open Source</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>50+ Contributors</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hero Stats - Mobile Optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 group-hover:from-blue-500/20 group-hover:to-cyan-500/20 transition-all duration-300" />
            <CardContent className="p-4 sm:p-6 relative">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <Badge variant="secondary" className="text-xs">
                  {Math.round(getTotalProgress())}%
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Overall Progress</p>
                <Progress value={getTotalProgress()} className="h-2" />
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{Math.round(getTotalProgress())}%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 group-hover:from-green-500/20 group-hover:to-emerald-500/20 transition-all duration-300" />
            <CardContent className="p-4 sm:p-6 relative">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                <Badge variant="outline" className="text-xs">
                  Week {progress.currentWeek}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Current Progress</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">Day {progress.currentDay}</p>
                <p className="text-xs text-gray-500">Keep going!</p>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all duration-300" />
            <CardContent className="p-4 sm:p-6 relative">
              <div className="flex items-center justify-between mb-2">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                <Badge variant="secondary" className="text-xs">
                  {progress.totalScore}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Score</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{progress.totalScore}</p>
                <p className="text-xs text-gray-500">Points earned</p>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 group-hover:from-orange-500/20 group-hover:to-red-500/20 transition-all duration-300" />
            <CardContent className="p-4 sm:p-6 relative">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                <Badge variant="outline" className="text-xs">
                  {progress.completedDays.filter((d) => d.completed).length}/56
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Days Completed</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {progress.completedDays.filter((d) => d.completed).length}
                </p>
                <p className="text-xs text-gray-500">of 56 days</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Format - Enhanced Mobile Design */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6" />
              <h2 className="text-xl sm:text-2xl font-bold">Daily Learning Format</h2>
              <Badge variant="outline" className="border-white text-white text-xs">
                Community Designed
              </Badge>
            </div>
            <p className="text-blue-100 mb-6">
              Structured 2-hour daily sessions designed by experienced developers for maximum learning efficiency
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Theory</h3>
                    <p className="text-sm text-blue-100">30 minutes</p>
                  </div>
                </div>
                <p className="text-sm text-blue-100">Community-curated conceptual learning</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Videos</h3>
                    <p className="text-sm text-blue-100">30 minutes</p>
                  </div>
                </div>
                <p className="text-sm text-blue-100">Expert-created visual learning content</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Code className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Practice</h3>
                    <p className="text-sm text-blue-100">60 minutes</p>
                  </div>
                </div>
                <p className="text-sm text-blue-100">Industry-standard coding challenges</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Weekly Plan - Mobile-First Design */}
        <div className="space-y-4">
          {placementPlan.map((week) => (
            <Card key={week.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <Collapsible open={openWeeks.includes(week.id)} onOpenChange={() => toggleWeek(week.id)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50/50 transition-colors p-4 sm:p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div
                          className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r ${week.color} flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg`}
                        >
                          {week.icon}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            Week {week.id}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {Math.round(getWeekProgress(week.id))}% Complete
                          </Badge>
                          <Badge variant="outline" className="text-xs border-green-500 text-green-700">
                            <Heart className="w-3 h-3 mr-1" />
                            Community
                          </Badge>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">{week.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">🎯 {week.goal}</p>
                        <Progress value={getWeekProgress(week.id)} className="h-2" />
                      </div>

                      <div className="flex-shrink-0">
                        {openWeeks.includes(week.id) ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0 p-4 sm:p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                      {week.days.map((day) => {
                        const dayProgress = getDayProgress(week.id, day.id)
                        const isSelected = selectedDay?.weekId === week.id && selectedDay?.dayId === day.id

                        return (
                          <Card
                            key={day.id}
                            className={`group hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 ${
                              dayProgress?.completed
                                ? "border-l-green-500 bg-green-50/50"
                                : "border-l-blue-500 hover:border-l-blue-600"
                            } ${isSelected ? "ring-2 ring-blue-500" : ""}`}
                            onClick={() => setSelectedDay({ weekId: week.id, dayId: day.id })}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary" className="text-xs">
                                    Day {day.id}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${
                                      day.difficulty === "Beginner"
                                        ? "border-green-500 text-green-700"
                                        : day.difficulty === "Intermediate"
                                          ? "border-yellow-500 text-yellow-700"
                                          : "border-red-500 text-red-700"
                                    }`}
                                  >
                                    {day.difficulty}
                                  </Badge>
                                </div>
                                {dayProgress?.completed && (
                                  <div className="flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  </div>
                                )}
                              </div>
                              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {day.title}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>{day.estimatedTime}</span>
                                <span>•</span>
                                <span>{day.mcqs} MCQs</span>
                                <span>•</span>
                                <span>{day.programs} Programs</span>
                              </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                              <div>
                                <p className="text-xs font-medium text-gray-600 mb-2">Topics:</p>
                                <div className="flex flex-wrap gap-1">
                                  {day.topics.slice(0, 2).map((topic, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {topic}
                                    </Badge>
                                  ))}
                                  {day.topics.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{day.topics.length - 2} more
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm">Theory</span>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant={dayProgress?.theoryCompleted ? "default" : "outline"}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      markDayCompleted(week.id, day.id, "theory")
                                    }}
                                    className="h-8 px-3"
                                  >
                                    {dayProgress?.theoryCompleted ? (
                                      <CheckCircle className="w-3 h-3" />
                                    ) : (
                                      <Play className="w-3 h-3" />
                                    )}
                                  </Button>
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Video className="w-4 h-4 text-purple-600" />
                                    <span className="text-sm">Video</span>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant={dayProgress?.videoCompleted ? "default" : "outline"}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      markDayCompleted(week.id, day.id, "video")
                                    }}
                                    className="h-8 px-3"
                                  >
                                    {dayProgress?.videoCompleted ? (
                                      <CheckCircle className="w-3 h-3" />
                                    ) : (
                                      <Play className="w-3 h-3" />
                                    )}
                                  </Button>
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Code className="w-4 h-4 text-green-600" />
                                    <span className="text-sm">Practice</span>
                                  </div>
                                  <Link href={`/practice/${week.id}/${day.id}`}>
                                    <Button
                                      size="sm"
                                      variant={dayProgress?.practiceCompleted ? "default" : "outline"}
                                      onClick={(e) => e.stopPropagation()}
                                      className="h-8 px-3"
                                    >
                                      {dayProgress?.practiceCompleted ? (
                                        <CheckCircle className="w-3 h-3" />
                                      ) : (
                                        <Code className="w-3 h-3" />
                                      )}
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>

        {/* Success Tips - Enhanced with Community Focus */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6" />
              <h2 className="text-xl sm:text-2xl font-bold">Community Success Tips</h2>
              <Badge variant="outline" className="border-white text-white text-xs">
                From 1000+ Successful Students
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-white/20 rounded-lg mt-1">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Join Study Groups</h3>
                    <p className="text-sm text-green-100">
                      Connect with fellow learners in our Discord community for daily motivation and doubt solving
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 bg-white/20 rounded-lg mt-1">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Contribute Back</h3>
                    <p className="text-sm text-green-100">
                      Help improve lessons and share your solutions with the community on GitHub
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-white/20 rounded-lg mt-1">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Track Progress</h3>
                    <p className="text-sm text-green-100">
                      Use our community-built progress tracker and share milestones with peers
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 bg-white/20 rounded-lg mt-1">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Mentor Others</h3>
                    <p className="text-sm text-green-100">
                      Teaching others reinforces your learning - help newcomers in the community
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button className="bg-white text-green-600 hover:bg-gray-100 gap-2">
                <Users className="w-4 h-4" />
                Join Discord Community
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 gap-2">
                <Github className="w-4 h-4" />
                View on GitHub
              </Button>
            </div>
          </div>
        </Card>

        {/* Device Compatibility Info - Enhanced */}
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Smartphone className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-indigo-900">Multi-Device Learning</h3>
              <Badge variant="outline" className="border-indigo-500 text-indigo-700 text-xs">
                OpenBox Optimized
              </Badge>
            </div>

            <p className="text-indigo-700 mb-4">
              Access your learning progress seamlessly across all devices. Built by the community, for the community.
              Your progress is automatically saved locally.
            </p>

            <div className="flex items-center gap-6 text-sm text-indigo-600">
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
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span>Open Source</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
