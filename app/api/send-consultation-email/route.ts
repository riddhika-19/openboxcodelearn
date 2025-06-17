import { Resend } from "resend"
import { type NextRequest, NextResponse } from "next/server"

const resend = new Resend("re_PFVjWRar_Bj6QC6CSbfrMDfyRekRcbjvt")

export async function POST(request: NextRequest) {
  try {
    const { report } = await request.json()

    const consultationEmail = await resend.emails.send({
      from: "OpenBox Community <noreply@openboxcommunity.dev>",
      to: [report.userEmail],
      subject: `📊 Your C++ Learning Analysis & Free Consultation Offer - ${report.userName}`,
      html: generateConsultationEmail(report),
    })

    return NextResponse.json({
      success: true,
      message: "Consultation email sent successfully",
      emailId: consultationEmail.data?.id,
    })
  } catch (error) {
    console.error("Consultation email error:", error)
    return NextResponse.json({ error: "Failed to send consultation email" }, { status: 500 })
  }
}

function generateConsultationEmail(report: any): string {
  const progressColor = {
    excellent: "#10b981",
    good: "#3b82f6",
    "needs-improvement": "#f59e0b",
    struggling: "#ef4444",
  }[report.overallProgress]

  const progressEmoji = {
    excellent: "🌟",
    good: "👍",
    "needs-improvement": "📈",
    struggling: "💪",
  }[report.overallProgress]

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Your C++ Learning Analysis - OpenBox</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px; border-radius: 12px; text-align: center; }
        .content { padding: 20px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }
        .stat-item { background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #3b82f6; }
        .progress-badge { background: ${progressColor}; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; display: inline-block; }
        .mistake-chart { background: #fef7ff; border: 1px solid #e879f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .recommendations { background: #f0fdf4; border: 1px solid #22c55e; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .cta-section { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; }
        .cta-button { background: white; color: #059669; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Your C++ Learning Analysis</h1>
        <p>Personalized insights and recommendations for ${report.userName}</p>
        <div class="progress-badge">${progressEmoji} ${report.overallProgress.replace("-", " ").toUpperCase()}</div>
    </div>

    <div class="content">
        <p>Hi <strong>${report.userName}</strong>,</p>

        <p>We've analyzed your C++ learning journey and prepared a comprehensive report to help you improve faster. Here's what we discovered:</p>

        <div class="stats-grid">
            <div class="stat-item">
                <h3 style="color: #3b82f6; margin: 0; font-size: 2em;">${report.totalMistakes}</h3>
                <p style="margin: 5px 0; color: #64748b;">Total Learning Challenges</p>
            </div>
            <div class="stat-item">
                <h3 style="color: #8b5cf6; margin: 0; font-size: 2em;">${report.strugglingTopics.length}</h3>
                <p style="margin: 5px 0; color: #64748b;">Focus Areas</p>
            </div>
            <div class="stat-item">
                <h3 style="color: #10b981; margin: 0; font-size: 2em;">${report.recommendedLessons.length}</h3>
                <p style="margin: 5px 0; color: #64748b;">Recommended Lessons</p>
            </div>
        </div>

        <div class="mistake-chart">
            <h3>🔍 Your Learning Pattern Analysis</h3>
            <p><strong>Most Common Challenge Areas:</strong></p>
            <ul>
                ${report.mostCommonMistakes.map((mistake: string) => `<li><strong>${mistake.charAt(0).toUpperCase() + mistake.slice(1)}:</strong> ${report.mistakesByType[mistake]} occurrences</li>`).join("")}
            </ul>

            <p><strong>Topics That Need Extra Attention:</strong></p>
            <ul>
                ${report.strugglingTopics.map((topic: string) => `<li>${topic}</li>`).join("")}
            </ul>
        </div>

        <div class="recommendations">
            <h3>🎯 Personalized Improvement Plan</h3>
            
            <h4>📚 Recommended Next Steps:</h4>
            <ul>
                ${report.recommendedLessons.map((lesson: string) => `<li>${lesson}</li>`).join("")}
            </ul>

            <h4>💡 Key Areas for Improvement:</h4>
            <ul>
                ${report.improvementAreas.map((area: string) => `<li>${area}</li>`).join("")}
            </ul>
        </div>

        <div class="cta-section">
            <h2>🚀 Ready to Accelerate Your Learning?</h2>
            <p>Based on your analysis, we believe a personalized consultation could help you overcome these challenges 3x faster!</p>
            
            <p><strong>What you'll get in your FREE 30-minute consultation:</strong></p>
            <ul style="text-align: left; max-width: 400px; margin: 20px auto;">
                <li>✅ Personalized learning roadmap</li>
                <li>✅ Code review of your challenging areas</li>
                <li>✅ Expert tips to avoid common pitfalls</li>
                <li>✅ Direct access to our mentor community</li>
            </ul>

            <a href="mailto:info.aviralone@gmail.com?subject=Free C++ Consultation Request - ${report.userName}&body=Hi! I received my learning analysis and would like to schedule a free consultation. My main challenges are: ${report.strugglingTopics.join(", ")}. Best time to reach me: [Please specify your preferred time]" class="cta-button">
                📅 Book Your FREE Consultation
            </a>

            <p style="font-size: 14px; margin-top: 20px;">
                No commitment required • 100% personalized • Expert C++ developers
            </p>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>🌟 Success Stories</h3>
            <blockquote style="font-style: italic; color: #64748b; border-left: 4px solid #3b82f6; padding-left: 15px;">
                "The personalized consultation helped me understand my mistakes and gave me a clear path forward. I went from struggling with basic syntax to building my first C++ project in just 2 weeks!" 
                <br><strong>- Sarah K., OpenBox Community Member</strong>
            </blockquote>
        </div>

        <p>Remember, every expert was once a beginner. Your challenges today are stepping stones to your success tomorrow! 💪</p>

        <p>Keep coding and keep growing!</p>

        <p>Best regards,<br>
        <strong>The OpenBox Community Team</strong></p>
    </div>

    <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px; color: #64748b; font-size: 14px;">
        <p>This analysis was generated on ${new Date(report.reportDate).toLocaleDateString()}</p>
        <p>Questions? Reply to this email or join our Discord community for instant help!</p>
    </div>
</body>
</html>
  `
}
