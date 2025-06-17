import { NextResponse } from "next/server"
import { getUsersForDailyEmails, shouldSendDailyEmail, scheduleProgressEmail } from "@/lib/email-scheduler"

export async function POST() {
  try {
    const users = getUsersForDailyEmails()
    const emailsSent = []
    const errors = []

    for (const user of users) {
      if (shouldSendDailyEmail(user.lastEmailSent)) {
        try {
          const success = await scheduleProgressEmail(user)
          if (success) {
            emailsSent.push(user.email)
            // Update last email sent timestamp
            // In a real app, you'd update this in your database
            console.log(`Daily email sent to ${user.email}`)
          } else {
            errors.push(`Failed to send email to ${user.email}`)
          }
        } catch (error) {
          errors.push(`Error sending email to ${user.email}: ${error}`)
        }
      }
    }

    return NextResponse.json({
      success: true,
      emailsSent: emailsSent.length,
      errors: errors.length,
      details: { emailsSent, errors },
    })
  } catch (error) {
    console.error("Error in daily email scheduling:", error)
    return NextResponse.json({ error: "Failed to schedule daily emails" }, { status: 500 })
  }
}
