// Mistake tracking and analysis system
export interface CodingMistake {
  id: string
  userId: string
  userEmail: string
  userName: string
  timestamp: string
  lessonId?: number
  mistakeType: "syntax" | "logic" | "compilation" | "runtime" | "best-practice"
  errorMessage: string
  userCode: string
  correctCode?: string
  difficulty: "beginner" | "intermediate" | "advanced"
  topic: string
  resolved: boolean
  attempts: number
  timeSpent: number // in seconds
  hints_used: number
}

export interface MistakeReport {
  userId: string
  userEmail: string
  userName: string
  totalMistakes: number
  mistakesByType: Record<string, number>
  mostCommonMistakes: string[]
  strugglingTopics: string[]
  improvementAreas: string[]
  recommendedLessons: string[]
  overallProgress: "excellent" | "good" | "needs-improvement" | "struggling"
  reportDate: string
}

class MistakeTracker {
  private mistakes: CodingMistake[] = []

  constructor() {
    this.loadMistakes()
  }

  private loadMistakes() {
    try {
      const saved = localStorage.getItem("coding-mistakes")
      if (saved) {
        this.mistakes = JSON.parse(saved)
      }
    } catch (error) {
      console.error("Error loading mistakes:", error)
    }
  }

  private saveMistakes() {
    try {
      localStorage.setItem("coding-mistakes", JSON.stringify(this.mistakes))
    } catch (error) {
      console.error("Error saving mistakes:", error)
    }
  }

  addMistake(mistake: Omit<CodingMistake, "id" | "timestamp">) {
    const newMistake: CodingMistake = {
      ...mistake,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    }

    this.mistakes.push(newMistake)
    this.saveMistakes()

    // Check if this is the user's first mistake - send admin notification
    const userMistakes = this.getUserMistakes(mistake.userId)
    if (userMistakes.length === 1) {
      this.sendFirstMistakeNotification(newMistake)
    }

    return newMistake
  }

  getUserMistakes(userId: string): CodingMistake[] {
    return this.mistakes.filter((m) => m.userId === userId)
  }

  generateUserReport(userId: string): MistakeReport {
    const userMistakes = this.getUserMistakes(userId)
    const user = userMistakes[0] // Get user info from first mistake

    if (!user) {
      throw new Error("No mistakes found for user")
    }

    const mistakesByType = userMistakes.reduce(
      (acc, mistake) => {
        acc[mistake.mistakeType] = (acc[mistake.mistakeType] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const topicCounts = userMistakes.reduce(
      (acc, mistake) => {
        acc[mistake.topic] = (acc[mistake.topic] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const strugglingTopics = Object.entries(topicCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([topic]) => topic)

    const mostCommonMistakes = Object.entries(mistakesByType)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type)

    const overallProgress = this.calculateProgress(userMistakes)
    const recommendedLessons = this.getRecommendedLessons(strugglingTopics, mostCommonMistakes)

    return {
      userId,
      userEmail: user.userEmail,
      userName: user.userName,
      totalMistakes: userMistakes.length,
      mistakesByType,
      mostCommonMistakes,
      strugglingTopics,
      improvementAreas: this.getImprovementAreas(mostCommonMistakes),
      recommendedLessons,
      overallProgress,
      reportDate: new Date().toISOString(),
    }
  }

  private calculateProgress(mistakes: CodingMistake[]): MistakeReport["overallProgress"] {
    const recentMistakes = mistakes.filter(
      (m) => new Date(m.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    )

    const avgAttempts = mistakes.reduce((sum, m) => sum + m.attempts, 0) / mistakes.length
    const resolvedRate = mistakes.filter((m) => m.resolved).length / mistakes.length

    if (recentMistakes.length <= 2 && resolvedRate > 0.8 && avgAttempts <= 3) {
      return "excellent"
    } else if (recentMistakes.length <= 5 && resolvedRate > 0.6 && avgAttempts <= 5) {
      return "good"
    } else if (recentMistakes.length <= 10 && resolvedRate > 0.4) {
      return "needs-improvement"
    } else {
      return "struggling"
    }
  }

  private getRecommendedLessons(topics: string[], mistakes: string[]): string[] {
    const recommendations = []

    if (topics.includes("Variables & Data Types")) {
      recommendations.push("Review: C++ Data Types and Variable Declaration")
    }
    if (topics.includes("Loops & Iterations")) {
      recommendations.push("Practice: Loop Control and Iteration Patterns")
    }
    if (mistakes.includes("syntax")) {
      recommendations.push("C++ Syntax Fundamentals Refresher")
    }
    if (mistakes.includes("compilation")) {
      recommendations.push("Understanding Compiler Errors and Debugging")
    }

    return recommendations.slice(0, 3)
  }

  private getImprovementAreas(mistakes: string[]): string[] {
    const areas = []

    if (mistakes.includes("syntax")) {
      areas.push("Focus on C++ syntax rules and proper formatting")
    }
    if (mistakes.includes("logic")) {
      areas.push("Practice problem-solving and algorithm thinking")
    }
    if (mistakes.includes("compilation")) {
      areas.push("Learn to read and understand compiler error messages")
    }

    return areas
  }

  private async sendFirstMistakeNotification(mistake: CodingMistake) {
    try {
      await fetch("/api/send-first-mistake-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mistake }),
      })
    } catch (error) {
      console.error("Error sending first mistake notification:", error)
    }
  }

  async sendConsultationEmail(userId: string) {
    try {
      const report = this.generateUserReport(userId)

      await fetch("/api/send-consultation-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report }),
      })

      return true
    } catch (error) {
      console.error("Error sending consultation email:", error)
      return false
    }
  }

  async sendWeeklyReport(userId: string) {
    try {
      const report = this.generateUserReport(userId)

      await fetch("/api/send-weekly-mistake-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report }),
      })

      return true
    } catch (error) {
      console.error("Error sending weekly report:", error)
      return false
    }
  }
}

export const mistakeTracker = new MistakeTracker()
