import { Resend } from "resend"
import { type NextRequest, NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, name, progress, streak, completedLessons } = await request.json()

    if (!email || !name) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 })
    }

    const progressEmail = await resend.emails.send({
      from: "OpenBox Community <onboarding@resend.dev>", // Use Resend's verified domain
      to: [email],
      subject: `🚀 Your C++ Progress Update - Day ${streak || 1}`,
      html: generateProgressEmail(name, progress, streak, completedLessons),
    })

    return NextResponse.json({
      success: true,
      message: "Progress email sent successfully",
      emailId: progressEmail.data?.id,
    })
  } catch (error) {
    console.error("Progress email error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send progress email",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

function generateProgressEmail(name: string, progress?: number, streak?: number, completedLessons?: string[]): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your C++ Progress Update</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .progress-card {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            margin: 20px 0;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .stat-card {
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #3b82f6;
        }
        .lessons-list {
            background: #f0f9ff;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Your C++ Progress Update</h1>
            <p>Hi ${name}, here's how you're doing!</p>
        </div>

        <div class="progress-card">
            <h2>Keep up the great work! 🎉</h2>
            <p>You're making excellent progress on your C++ journey</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${progress || 0}%</div>
                <div>Overall Progress</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${streak || 0}</div>
                <div>Day Streak</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${completedLessons?.length || 0}</div>
                <div>Lessons Completed</div>
            </div>
        </div>

        ${
          completedLessons && completedLessons.length > 0
            ? `
        <div class="lessons-list">
            <h3>📚 Recently Completed Lessons</h3>
            <ul>
                ${completedLessons.map((lesson) => `<li>${lesson}</li>`).join("")}
            </ul>
        </div>
        `
            : ""
        }

        <div style="text-align: center; margin: 30px 0;">
            <a href="https://github.com/riddhika-19/openboxcodelearn" 
               style="background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                Continue Learning
            </a>
        </div>

        <div style="text-align: center; margin-top: 30px; color: #64748b; font-size: 14px;">
            <p>Keep coding, keep growing! 💪</p>
            <p>The OpenBox Community Team</p>
        </div>
    </div>
</body>
</html>
  `
}
