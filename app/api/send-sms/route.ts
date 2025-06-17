import { Resend } from "resend"
import { type NextRequest, NextResponse } from "next/server"

const resend = new Resend("re_PFVjWRar_Bj6QC6CSbfrMDfyRekRcbjvt")

export async function POST(request: NextRequest) {
  try {
    const { phone, message, userName } = await request.json()

    if (!phone || !message) {
      return NextResponse.json({ error: "Phone and message are required" }, { status: 400 })
    }

    // Note: Resend doesn't support SMS directly, but we can simulate it
    // In production, you'd use Twilio, AWS SNS, or another SMS service
    // For now, we'll send an email notification about the SMS

    const smsNotification = await resend.emails.send({
      from: "OpenBox Community <noreply@openboxcommunity.dev>",
      to: ["info.aviralone@gmail.com"],
      subject: "📱 SMS Notification - OpenBox Platform",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #3b82f6;">📱 SMS Notification</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>To:</strong> ${phone}</p>
            <p><strong>User:</strong> ${userName || "Unknown"}</p>
            <p><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-left: 4px solid #3b82f6; margin: 10px 0;">
              ${message}
            </div>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p style="color: #64748b; font-size: 14px;">
            Note: This is a simulated SMS notification. In production, integrate with Twilio or similar SMS service.
          </p>
        </div>
      `,
    })

    // Simulate SMS sending (replace with actual SMS service in production)
    console.log(`SMS would be sent to ${phone}: ${message}`)

    return NextResponse.json({
      success: true,
      message: "SMS notification processed",
      smsId: smsNotification.data?.id,
    })
  } catch (error) {
    console.error("SMS error:", error)
    return NextResponse.json({ error: "Failed to send SMS notification" }, { status: 500 })
  }
}
