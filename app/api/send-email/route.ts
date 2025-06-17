import { type NextRequest, NextResponse } from "next/server"
import { EmailTemplate } from "@/components/EmailTemplate"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY || "re_PFVjWRar_Bj6QC6CSbfrMDfyRekRcbjvt")

export async function POST(request: NextRequest) {
  try {
    const { firstName, email, message, subject } = await request.json()

    if (!firstName || !email) {
      return NextResponse.json({ error: "firstName and email are required" }, { status: 400 })
    }

    const { data, error } = await resend.emails.send({
      from: "OpenBox Community <noreply@openboxcommunity.dev>",
      to: [email],
      subject: subject || "Hello from OpenBox!",
      react: EmailTemplate({
        firstName,
        message: message || `Welcome to OpenBox Community! We're excited to have you join us.`,
        subject,
      }),
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data,
      message: `Email sent successfully to ${email}`,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      {
        error: "Failed to send email. Please try again.",
      },
      { status: 500 },
    )
  }
}

// Optional: Add GET method for testing
export async function GET() {
  return NextResponse.json({
    message: "Email API is working. Use POST to send emails.",
    requiredFields: ["firstName", "email"],
    optionalFields: ["message", "subject"],
  })
}
