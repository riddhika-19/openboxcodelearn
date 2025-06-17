import { Resend } from "resend"
import { type NextRequest, NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Send test email using Resend's verified domain
    const result = await resend.emails.send({
      from: "OpenBox Community <onboarding@resend.dev>", // Use Resend's verified domain
      to: [email], // Can now send to any email
      subject: "🧪 Test Email from OpenBox Community",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #3b82f6;">✅ Test Email Successful!</h2>
          <p>This is a test email from the OpenBox Community platform.</p>
          
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Test Details:</h3>
            <p><strong>Sent to:</strong> ${email}</p>
            <p><strong>From:</strong> OpenBox Community &lt;onboarding@resend.dev&gt;</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Status:</strong> ✅ Delivered successfully</p>
          </div>
          
          <div style="background: #dcfce7; padding: 15px; border-radius: 8px; border: 1px solid #16a34a;">
            <h4>🎉 Great News!</h4>
            <p>Your Resend integration is working perfectly! Users will now receive welcome emails directly when they register.</p>
          </div>
          
          <p style="margin-top: 20px;">
            <strong>OpenBox Community</strong><br>
            C++ Learning Platform<br>
            <a href="https://github.com/riddhika-19/openboxcodelearn" style="color: #3b82f6;">GitHub Repository</a>
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
        fromDomain: "onboarding@resend.dev",
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
          fromDomain: "onboarding@resend.dev",
        },
      },
      { status: 500 },
    )
  }
}
