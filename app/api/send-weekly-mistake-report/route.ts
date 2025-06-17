import { Resend } from "resend"
import { type NextRequest, NextResponse } from "next/server"

const resend = new Resend("re_PFVjWRar_Bj6QC6CSbfrMDfyRekRcbjvt")

export async function POST(request: NextRequest) {
  try {
    const { report } = await request.json()

    // Send detailed report to admin
    const adminEmail = await resend.emails.send({
      from: "OpenBox Community <noreply@openboxcommunity.dev>",
      to: ["info.aviralone@gmail.com"],
      subject: `📊 Weekly Mistake Report - ${report.userName} (${report.overallProgress})`,
      html: generateAdminWeeklyReport(report),
    })

    return NextResponse.json({
      success: true,
      message: "Weekly report sent to admin",
      emailId: adminEmail.data?.id,
    })
  } catch (error) {
    console.error("Weekly report error:", error)
    return NextResponse.json({ error: "Failed to send weekly report" }, { status: 500 })
  }
}

function generateAdminWeeklyReport(report: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Weekly Mistake Report - ${report.userName}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1f2937, #374151); color: white; padding: 30px; border-radius: 12px; }
        .stats-section { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
        .stat-card { background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; }
        .mistake-breakdown { background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .recommendations { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .progress-indicator { padding: 10px 20px; border-radius: 20px; color: white; font-weight: bold; display: inline-block; }
        .excellent { background: #10b981; }
        .good { background: #3b82f6; }
        .needs-improvement { background: #f59e0b; }
        .struggling { background: #ef4444; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Weekly Learning Analysis Report</h1>
        <h2>${report.userName} (${report.userEmail})</h2>
        <div class="progress-indicator ${report.overallProgress.replace("-", "")}">
            Status: ${report.overallProgress.replace("-", " ").toUpperCase()}
        </div>
        <p>Report Generated: ${new Date(report.reportDate).toLocaleDateString()}</p>
    </div>

    <div class="stats-section">
        <div class="stat-card">
            <h3 style="color: #ef4444; margin: 0; font-size: 2.5em;">${report.totalMistakes}</h3>
            <p style="margin: 5px 0;">Total Mistakes This Week</p>
        </div>
        <div class="stat-card">
            <h3 style="color: #8b5cf6; margin: 0; font-size: 2.5em;">${Object.keys(report.mistakesByType).length}</h3>
            <p style="margin: 5px 0;">Different Mistake Types</p>
        </div>
        <div class="stat-card">
            <h3 style="color: #f59e0b; margin: 0; font-size: 2.5em;">${report.strugglingTopics.length}</h3>
            <p style="margin: 5px 0;">Struggling Topics</p>
        </div>
        <div class="stat-card">
            <h3 style="color: #10b981; margin: 0; font-size: 2.5em;">${report.recommendedLessons.length}</h3>
            <p style="margin: 5px 0;">Recommended Actions</p>
        </div>
    </div>

    <div class="mistake-breakdown">
        <h3>🔍 Detailed Mistake Breakdown</h3>
        
        <h4>Mistake Types Distribution:</h4>
        <ul>
            ${Object.entries(report.mistakesByType)
              .map(
                ([type, count]) =>
                  `<li><strong>${type.charAt(0).toUpperCase() + type.slice(1)}:</strong> ${count} occurrences</li>`,
              )
              .join("")}
        </ul>

        <h4>Most Challenging Topics:</h4>
        <ol>
            ${report.strugglingTopics
              .map(
                (topic: string, index: number) =>
                  `<li><strong>${topic}</strong> ${index === 0 ? "(Highest Priority)" : ""}</li>`,
              )
              .join("")}
        </ol>

        <h4>Common Mistake Patterns:</h4>
        <ul>
            ${report.mostCommonMistakes
              .map((mistake: string) => `<li>${mistake.charAt(0).toUpperCase() + mistake.slice(1)} errors</li>`)
              .join("")}
        </ul>
    </div>

    <div class="recommendations">
        <h3>🎯 Recommended Interventions</h3>
        
        <h4>Immediate Actions:</h4>
        <ul>
            ${
              report.overallProgress === "struggling"
                ? "<li>🚨 <strong>HIGH PRIORITY:</strong> Schedule immediate 1-on-1 consultation</li>"
                : ""
            }
            ${
              report.overallProgress === "needs-improvement"
                ? "<li>📞 Consider reaching out with additional support resources</li>"
                : ""
            }
            <li>📧 User has been sent personalized consultation offer</li>
            <li>📱 Consider sending supportive SMS message</li>
        </ul>

        <h4>Suggested Learning Resources:</h4>
        <ul>
            ${report.recommendedLessons.map((lesson: string) => `<li>${lesson}</li>`).join("")}
        </ul>

        <h4>Improvement Areas to Address:</h4>
        <ul>
            ${report.improvementAreas.map((area: string) => `<li>${area}</li>`).join("")}
        </ul>
    </div>

    <div style="background: #1f2937; color: white; padding: 20px; border-radius: 8px; margin: 30px 0;">
        <h3>📈 Progress Tracking Recommendations</h3>
        <ul>
            <li><strong>Follow-up Timeline:</strong> ${report.overallProgress === "struggling" ? "24-48 hours" : "1 week"}</li>
            <li><strong>Success Metrics:</strong> Reduction in ${report.mostCommonMistakes[0]} errors</li>
            <li><strong>Next Milestone:</strong> Completion of ${report.strugglingTopics[0]} topic</li>
            <li><strong>Engagement Level:</strong> ${report.totalMistakes > 10 ? "High (Very Active)" : report.totalMistakes > 5 ? "Medium (Active)" : "Low (Needs Motivation)"}</li>
        </ul>
    </div>

    <div style="text-align: center; margin-top: 40px; padding: 20px; background: #f8fafc; border-radius: 8px;">
        <p style="color: #64748b; font-size: 14px;">
            <strong>OpenBox Community - Learning Analytics Dashboard</strong><br>
            This report helps identify students who need additional support and personalized intervention.
        </p>
    </div>
</body>
</html>
  `
}
