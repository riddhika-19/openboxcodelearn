import { Resend } from "resend"
import { type NextRequest, NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Send test email using verified domain
    const result = await resend.emails.send({
      from: "OpenBox Community <info.aviralone@gmail.com>", // Use your verified email
      to: ["info.aviralone@gmail.com"], // Can only send to verified email in testing
      subject: "🧪 Test Email from OpenBox Community",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #3b82f6;">✅ Test Email Successful!</h2>
          <p>This is a test email from the OpenBox Community platform.</p>
          
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Test Details:</h3>
            <p><strong>Requested for:</strong> ${email}</p>
            <p><strong>Sent to:</strong> info.aviralone@gmail.com (verified email)</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border: 1px solid #f59e0b;">
            <h4>📝 Note:</h4>
            <p>In testing mode, emails can only be sent to your verified email address. To send to other recipients, please verify a domain at <a href="https://resend.com/domains">resend.com/domains</a>.</p>
          </div>
          
          <p style="margin-top: 20px;">
            <strong>OpenBox Community</strong><br>
            C++ Learning Platform
          </p>
        </div>
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
    console.error("Test email error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send test email",
        details: error.message,
        config: {
          apiKeySet: !!process.env.RESEND_API_KEY,
          audienceIdSet: !!process.env.RESEND_AUDIENCE_ID,
        },
      },
      { status: 500 },
    )
  }
}
