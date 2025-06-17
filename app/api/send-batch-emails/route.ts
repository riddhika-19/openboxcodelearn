import { Resend } from "resend"
import { type NextRequest, NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { emails } = await request.json()

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ error: "Emails array is required" }, { status: 400 })
    }

    // Prepare batch emails
    const batchEmails = emails.map((emailData: any) => ({
      from: "OpenBox Community <onboarding@resend.dev>",
      to: [emailData.email],
      subject: emailData.subject || "Update from OpenBox Community",
      html:
        emailData.html ||
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #3b82f6;">Hello ${emailData.name || "there"}!</h2>
          <p>${emailData.message || "Thank you for being part of the OpenBox Community!"}</p>
          <p>Best regards,<br>The OpenBox Team</p>
        </div>
      `,
    }))

    // Send batch emails
    const result = await resend.batch.send(batchEmails)

    return NextResponse.json({
      success: true,
      message: `Batch emails sent successfully to ${emails.length} recipients`,
      data: result,
      emailCount: emails.length,
    })
  } catch (error) {
    console.error("Batch email error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send batch emails",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
