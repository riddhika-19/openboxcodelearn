import { Resend } from "resend"
import { type NextRequest, NextResponse } from "next/server"

const resend = new Resend("re_PFVjWRar_Bj6QC6CSbfrMDfyRekRcbjvt")

export async function POST(request: NextRequest) {
  try {
    const { mistake } = await request.json()

    // Send notification to admin
    const adminEmail = await resend.emails.send({
      from: "OpenBox Community <noreply@openboxcommunity.dev>",
      to: ["info.aviralone@gmail.com"],
      subject: "🚨 First Coding Mistake Alert - User Needs Attention",
      html: generateFirstMistakeAdminEmail(mistake),
    })

    // Send consultation offer to user
    const userEmail = await resend.emails.send({
      from: "OpenBox Community <noreply@openboxcommunity.dev>",
      to: [mistake.userEmail],
      subject: "💡 Let's Help You Master C++ - Free Consultation Available!",
      html: generateConsultationOfferEmail(mistake),
    })

    return NextResponse.json({
      success: true,
      message: "First mistake notifications sent",
      adminEmailId: adminEmail.data?.id,
      userEmailId: userEmail.data?.id,
    })
  } catch (error) {
    console.error("First mistake notification error:", error)
    return NextResponse.json({ error: "Failed to send notifications" }, { status: 500 })
  }
}

function generateFirstMistakeAdminEmail(mistake: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>First Mistake Alert - OpenBox</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 20px; border-radius: 8px; text-align: center; }
        .content { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .mistake-details { background: white; padding: 15px; border-left: 4px solid #ef4444; margin: 15px 0; }
        .code-block { background: #1f2937; color: #f9fafb; padding: 15px; border-radius: 6px; font-family: monospace; overflow-x: auto; }
        .alert { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 6px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚨 First Mistake Alert</h1>
        <p>A user just made their first coding mistake and may need help!</p>
    </div>

    <div class="content">
        <h2>👤 User Information</h2>
        <ul>
            <li><strong>Name:</strong> ${mistake.userName}</li>
            <li><strong>Email:</strong> ${mistake.userEmail}</li>
            <li><strong>User ID:</strong> ${mistake.userId}</li>
            <li><strong>Timestamp:</strong> ${new Date(mistake.timestamp).toLocaleString()}</li>
        </ul>
    </div>

    <div class="mistake-details">
        <h3>🐛 Mistake Details</h3>
        <ul>
            <li><strong>Type:</strong> ${mistake.mistakeType}</li>
            <li><strong>Topic:</strong> ${mistake.topic}</li>
            <li><strong>Difficulty:</strong> ${mistake.difficulty}</li>
            <li><strong>Lesson ID:</strong> ${mistake.lessonId || "N/A"}</li>
            <li><strong>Attempts:</strong> ${mistake.attempts}</li>
            <li><strong>Time Spent:</strong> ${Math.round(mistake.timeSpent / 60)} minutes</li>
            <li><strong>Hints Used:</strong> ${mistake.hints_used}</li>
        </ul>

        <h4>Error Message:</h4>
        <div class="alert">
            ${mistake.errorMessage}
        </div>

        <h4>User's Code:</h4>
        <div class="code-block">
            <pre>${mistake.userCode}</pre>
        </div>
    </div>

    <div class="content">
        <h3>🎯 Recommended Actions</h3>
        <ul>
            <li>📧 User has been sent a consultation offer email</li>
            <li>📱 Consider sending a supportive SMS message</li>
            <li>👥 Invite them to join the Discord community for help</li>
            <li>📚 Recommend specific lessons based on their mistake type</li>
        </ul>

        <h3>📊 Early Warning Signs</h3>
        <p>This user is making their first mistake. Early intervention can prevent frustration and dropout. Consider:</p>
        <ul>
            <li>Personal outreach within 24 hours</li>
            <li>Offering a free 1-on-1 session</li>
            <li>Providing additional resources for their struggling topic</li>
        </ul>
    </div>

    <div style="text-align: center; margin-top: 30px; color: #64748b; font-size: 14px;">
        <p>OpenBox Community - Helping developers succeed</p>
        <p>Generated at ${new Date().toLocaleString()}</p>
    </div>
</body>
</html>
  `
}

function generateConsultationOfferEmail(mistake: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Free C++ Consultation - OpenBox Community</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px; border-radius: 12px; text-align: center; }
        .content { padding: 30px; }
        .highlight { background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .cta-button { background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin: 10px 0; }
        .support-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .support-item { background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1>💡 Don't Give Up, ${mistake.userName}!</h1>
        <p>Every expert was once a beginner who made mistakes</p>
    </div>

    <div class="content">
        <p>Hi <strong>${mistake.userName}</strong>,</p>

        <p>We noticed you encountered a challenge while learning C++. That's completely normal and actually a great sign that you're pushing yourself to learn! 🚀</p>

        <div class="highlight">
            <h3>🎯 What happened?</h3>
            <p>You ran into a <strong>${mistake.mistakeType}</strong> error while working on <strong>${mistake.topic}</strong>. This is one of the most common areas where C++ learners need extra support.</p>
        </div>

        <h2>🤝 We're Here to Help!</h2>
        <p>As part of the OpenBox Community, you have access to personalized support. Here's what we're offering:</p>

        <div class="support-grid">
            <div class="support-item">
                <h3>📞 Free 1-on-1 Session</h3>
                <p>15-minute consultation with a C++ expert to review your code and provide guidance</p>
            </div>
            <div class="support-item">
                <h3>📚 Personalized Resources</h3>
                <p>Custom learning materials based on your specific challenges</p>
            </div>
            <div class="support-item">
                <h3>👥 Community Support</h3>
                <p>Direct access to our Discord community where mentors are ready to help</p>
            </div>
        </div>

        <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:info.aviralone@gmail.com?subject=Free C++ Consultation Request - ${mistake.userName}&body=Hi! I'd like to schedule a free consultation to help with my C++ learning. My mistake was related to: ${mistake.mistakeType} in ${mistake.topic}." class="cta-button">
                📅 Schedule Free Consultation
            </a>
        </div>

        <div class="highlight">
            <h3>💪 Remember:</h3>
            <ul>
                <li>Every C++ expert has made thousands of mistakes</li>
                <li>Mistakes are learning opportunities, not failures</li>
                <li>The OpenBox Community is here to support your journey</li>
                <li>You're closer to mastery than you think!</li>
            </ul>
        </div>

        <h3>🚀 Quick Tips for Your Current Challenge:</h3>
        <ul>
            <li>Take a short break and come back with fresh eyes</li>
            <li>Read the error message carefully - it often contains the solution</li>
            <li>Try breaking your code into smaller, testable pieces</li>
            <li>Don't hesitate to ask for help in our community</li>
        </ul>

        <p>Keep coding, keep learning, and remember - we're rooting for you! 🌟</p>

        <p>Best regards,<br>
        <strong>The OpenBox Community Team</strong></p>
    </div>

    <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px;">
        <p style="color: #64748b; font-size: 14px;">
            Need immediate help? Join our Discord community or reply to this email.<br>
            We typically respond within 2 hours during business hours.
        </p>
    </div>
</body>
</html>
  `
}
