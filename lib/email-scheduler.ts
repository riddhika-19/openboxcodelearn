// Email scheduling utility for progress emails
export interface UserEmailData {
  email: string
  name: string
  personalityType: string
  currentStreak: number
  completedLessons: number[]
  totalScore: number
  lastEmailSent?: string
}

export async function scheduleProgressEmail(userData: UserEmailData) {
  try {
    const response = await fetch("/api/send-progress-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userData.email,
        name: userData.name,
        personalityType: userData.personalityType,
        currentStreak: userData.currentStreak,
        completedLessons: userData.completedLessons,
        totalScore: userData.totalScore,
      }),
    })

    const result = await response.json()

    if (result.success) {
      console.log(`Progress email sent to ${userData.email}`)
      return true
    } else {
      console.error("Failed to send progress email:", result.error)
      return false
    }
  } catch (error) {
    console.error("Error scheduling progress email:", error)
    return false
  }
}

// Function to check if user should receive daily email
export function shouldSendDailyEmail(lastEmailSent?: string): boolean {
  if (!lastEmailSent) return true

  const lastSent = new Date(lastEmailSent)
  const now = new Date()
  const hoursSinceLastEmail = (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60)

  // Send email if it's been more than 20 hours (allows for some flexibility)
  return hoursSinceLastEmail >= 20
}

// Function to get all users who need daily emails
export function getUsersForDailyEmails(): UserEmailData[] {
  // In a real app, this would query your database
  // For now, we'll get from localStorage (demo purposes)
  const users: UserEmailData[] = []

  try {
    const userData = localStorage.getItem("openbox-user")
    if (userData) {
      const user = JSON.parse(userData)
      const progressData = localStorage.getItem("cpp-learning-progress")
      const progress = progressData
        ? JSON.parse(progressData)
        : { completedLessons: [], totalScore: 0, currentStreak: 0 }

      users.push({
        email: user.email,
        name: user.name,
        personalityType: user.personalityType || "motivated",
        currentStreak: progress.currentStreak || 0,
        completedLessons: progress.completedLessons || [],
        totalScore: progress.totalScore || 0,
        lastEmailSent: user.lastProgressEmail,
      })
    }
  } catch (error) {
    console.error("Error getting users for daily emails:", error)
  }

  return users
}
