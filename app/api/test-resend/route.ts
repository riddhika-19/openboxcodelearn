import { Resend } from "resend"
import { type NextRequest, NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required", success: false }, { status: 400 })
    }

    // Test email sending
    const result = await resend.emails.send({
      from: "OpenBox Test <onboarding@resend.dev>",
      to: [email],
      subject: "🧪 Resend Test Email - OpenBox Platform",
      html: `
        <h1>Test Email Successful! 🎉</h1>
        <p>This is a test email from your OpenBox C++ Learning Platform.</p>
        <p>If you received this email, your Resend integration is working correctly.</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `,
    })

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      data: result,
      config: {
        apiKeySet: !!process.env.RESEND_API_KEY,
        audienceIdSet: !!process.env.RESEND_AUDIENCE_ID,
      },
    })
  } catch (error) {
    console.error("Resend test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to send test email",
        details: error,
        config: {
          apiKeySet: !!process.env.RESEND_API_KEY,
          audienceIdSet: !!process.env.RESEND_AUDIENCE_ID,
        },
      },
      { status: 500 },
    )
  }
}
