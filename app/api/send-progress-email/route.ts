import { Resend } from "resend"
import { type NextRequest, NextResponse } from "next/server"

const resend = new Resend("re_PFVjWRar_Bj6QC6CSbfrMDfyRekRcbjvt")

export async function POST(request: NextRequest) {
  try {
    const {
      email,
      name,
      progressData,
      personalityType = "motivated",
      currentStreak = 0,
      completedLessons = [],
      totalScore = 0,
      weeklyGoal = "Complete 3 lessons",
    } = await request.json()

    if (!email || !name) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 })
    }

    const progressEmail = await resend.emails.send({
      from: "OpenBox Community <noreply@openboxcommunity.dev>",
      to: [email],
      subject: generatePersonalizedSubject(name, personalityType, currentStreak, completedLessons.length),
      html: generateProgressEmail(
        name,
        progressData,
        personalityType,
        currentStreak,
        completedLessons,
        totalScore,
        weeklyGoal,
      ),
    })

    return NextResponse.json({
      success: true,
      message: "Progress email sent successfully!",
      emailId: progressEmail.data?.id,
    })
  } catch (error) {
    console.error("Progress email error:", error)
    return NextResponse.json({ error: "Failed to send progress email" }, { status: 500 })
  }
}

function generatePersonalizedSubject(
  name: string,
  personalityType: string,
  streak: number,
  completedLessons: number,
): string {
  const subjects = {
    motivated: [
      `🚀 ${name}, you're crushing it! Day ${streak} streak 🔥`,
      `💪 Keep the momentum going, ${name}! Your progress is amazing`,
      `🎯 ${name}, you've completed ${completedLessons} lessons - you're unstoppable!`,
    ],
    encouraging: [
      `🌟 ${name}, every step counts - you're doing great!`,
      `💝 ${name}, your dedication is inspiring the community`,
      `🌱 ${name}, you're growing stronger every day with C++`,
    ],
    analytical: [
      `📊 ${name}, here's your detailed progress analysis`,
      `🔍 ${name}, your learning metrics and next optimization steps`,
      `📈 ${name}, data-driven insights on your C++ journey`,
    ],
    competitive: [
      `🏆 ${name}, you're in the top performers this week!`,
      `⚡ ${name}, challenge accepted - let's level up!`,
      `🥇 ${name}, your ranking and weekly challenges await`,
    ],
  }

  const typeSubjects = subjects[personalityType as keyof typeof subjects] || subjects.motivated
  return typeSubjects[Math.floor(Math.random() * typeSubjects.length)]
}

function generateProgressEmail(
  name: string,
  progressData: any,
  personalityType: string,
  currentStreak: number,
  completedLessons: number[],
  totalScore: number,
  weeklyGoal: string,
): string {
  const personalizedContent = getPersonalizedContent(personalityType, name, currentStreak, completedLessons.length)
  const motivationalQuote = getMotivationalQuote(personalityType)
  const nextSteps = getPersonalizedNextSteps(personalityType, completedLessons.length)

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Daily C++ Progress - OpenBox Community</title>
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
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .content {
            padding: 30px;
        }
        .progress-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 15px;
            margin: 25px 0;
        }
        .progress-item {
            text-align: center;
            padding: 20px;
            background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
            border-radius: 12px;
            border-left: 4px solid #3b82f6;
        }
        .progress-number {
            font-size: 28px;
            font-weight: bold;
            color: #3b82f6;
            margin-bottom: 5px;
        }
        .progress-label {
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .streak-section {
            background: linear-gradient(135deg, #fef3c7, #fde68a);
            border: 2px solid #f59e0b;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        .streak-number {
            font-size: 36px;
            font-weight: bold;
            color: #d97706;
        }
        .quote-section {
            background: #f0f9ff;
            border-left: 4px solid #0ea5e9;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        .quote-text {
            font-style: italic;
            color: #0c4a6e;
            font-size: 16px;
            margin-bottom: 10px;
        }
        .quote-author {
            color: #0369a1;
            font-weight: bold;
            font-size: 14px;
        }
        .next-steps {
            background: #f0fdf4;
            border: 1px solid #22c55e;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .step-item {
            display: flex;
            align-items: center;
            margin: 10px 0;
            padding: 8px;
            background: white;
            border-radius: 6px;
        }
        .step-icon {
            margin-right: 12px;
            font-size: 18px;
        }
        .cta-section {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            color: white;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            margin: 25px 0;
        }
        .cta-button {
            background: white;
            color: #3b82f6;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            display: inline-block;
            margin: 10px;
            transition: transform 0.2s;
        }
        .cta-button:hover {
            transform: translateY(-2px);
        }
        .community-section {
            background: #fef7ff;
            border: 1px solid #d946ef;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #64748b;
            font-size: 14px;
            border-top: 1px solid #e2e8f0;
        }
        @media (max-width: 600px) {
            body { padding: 10px; }
            .content { padding: 20px; }
            .progress-grid { grid-template-columns: repeat(2, 1fr); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">📦 OPENBOX COMMUNITY</div>
            <h1>Your Daily C++ Progress</h1>
            <p>${new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</p>
        </div>

        <div class="content">
            <h2>Hello ${name}! 👋</h2>
            
            ${personalizedContent}

            <div class="progress-grid">
                <div class="progress-item">
                    <div class="progress-number">${currentStreak}</div>
                    <div class="progress-label">Day Streak</div>
                </div>
                <div class="progress-item">
                    <div class="progress-number">${completedLessons.length}</div>
                    <div class="progress-label">Lessons Done</div>
                </div>
                <div class="progress-item">
                    <div class="progress-number">${totalScore}</div>
                    <div class="progress-label">Total Points</div>
                </div>
                <div class="progress-item">
                    <div class="progress-number">${Math.round((completedLessons.length / 10) * 100)}%</div>
                    <div class="progress-label">Progress</div>
                </div>
            </div>

            ${
              currentStreak > 0
                ? `
            <div class="streak-section">
                <div>🔥 STREAK POWER 🔥</div>
                <div class="streak-number">${currentStreak}</div>
                <div>Days of consistent learning!</div>
                <p style="margin-top: 15px; font-size: 14px;">
                    ${
                      currentStreak >= 7
                        ? "You're on fire! A full week of dedication!"
                        : currentStreak >= 3
                          ? "Great momentum! Keep it going!"
                          : "Every day counts - you're building a great habit!"
                    }
                </p>
            </div>
            `
                : ""
            }

            <div class="quote-section">
                <div class="quote-text">"${motivationalQuote.text}"</div>
                <div class="quote-author">— ${motivationalQuote.author}</div>
            </div>

            <div class="next-steps">
                <h3>🎯 Your Personalized Next Steps</h3>
                ${nextSteps
                  .map(
                    (step) => `
                <div class="step-item">
                    <span class="step-icon">${step.icon}</span>
                    <span>${step.text}</span>
                </div>
                `,
                  )
                  .join("")}
            </div>

            <div class="community-section">
                <h3>👥 Community Highlights</h3>
                <p><strong>This Week in OpenBox:</strong></p>
                <ul>
                    <li>🎉 Sarah completed her first C++ project and shared it on GitHub!</li>
                    <li>💡 New community-contributed lesson on "Smart Pointers" is now live</li>
                    <li>🏆 Weekly coding challenge: "Binary Tree Traversal" - 127 participants!</li>
                    <li>📚 Community study group meets every Tuesday at 7 PM EST</li>
                </ul>
            </div>
        </div>

        <div class="cta-section">
            <h2>Ready to Continue Learning? 🚀</h2>
            <p>Your next lesson is waiting, and the community is here to support you!</p>
            
            <a href="https://your-domain.com/lessons" class="cta-button">📚 Continue Learning</a>
            <a href="https://your-domain.com/playground" class="cta-button">💻 Practice Coding</a>
            <a href="https://discord.gg/openbox" class="cta-button">💬 Join Discussion</a>
        </div>

        <div class="footer">
            <p><strong>Built with ❤️ by the OpenBox Community</strong></p>
            <p>You're receiving this because you're part of our amazing learning community.</p>
            <p style="margin-top: 15px; font-size: 12px;">
                Want to change email preferences? <a href="#" style="color: #3b82f6;">Update settings</a> | 
                <a href="#" style="color: #3b82f6;">Unsubscribe</a>
            </p>
        </div>
    </div>
</body>
</html>
  `
}

function getPersonalizedContent(
  personalityType: string,
  name: string,
  streak: number,
  completedLessons: number,
): string {
  const content = {
    motivated: `
      <p>You're absolutely crushing your C++ journey! 🚀 Your dedication and consistency are truly inspiring to the entire OpenBox community.</p>
      <p>With ${completedLessons} lessons completed and a ${streak}-day streak, you're proving that consistent effort leads to extraordinary results. Keep this momentum going!</p>
    `,
    encouraging: `
      <p>Every step you take in your C++ learning journey matters, and we want you to know how proud we are of your progress! 🌟</p>
      <p>Remember, learning programming is like building a muscle - it gets stronger with each practice session. You've completed ${completedLessons} lessons, and that's something to celebrate!</p>
    `,
    analytical: `
      <p>Let's dive into your learning analytics! 📊 Based on your current progress data, you're performing exceptionally well.</p>
      <p>Completion rate: ${Math.round((completedLessons / 10) * 100)}% | Learning velocity: ${streak > 0 ? "Consistent daily engagement" : "Room for improvement in consistency"} | Skill progression: On track for mastery</p>
    `,
    competitive: `
      <p>You're in the game and playing to win! 🏆 Your current performance puts you among the top learners in the OpenBox community.</p>
      <p>Challenge status: ${completedLessons >= 5 ? "Leading the pack" : "Ready to climb the leaderboard"}! Time to show everyone what you're made of!</p>
    `,
  }

  return content[personalityType as keyof typeof content] || content.motivated
}

function getMotivationalQuote(personalityType: string) {
  const quotes = {
    motivated: {
      text: "The expert in anything was once a beginner who refused to give up.",
      author: "Helen Hayes",
    },
    encouraging: {
      text: "Progress, not perfection, is the goal. Every small step forward is a victory.",
      author: "OpenBox Community",
    },
    analytical: {
      text: "In programming, the details are not details. They make the design.",
      author: "Charles Eames",
    },
    competitive: {
      text: "Champions are made when nobody's watching. Your consistency today builds tomorrow's success.",
      author: "OpenBox Community",
    },
  }

  return quotes[personalityType as keyof typeof quotes] || quotes.motivated
}

function getPersonalizedNextSteps(personalityType: string, completedLessons: number) {
  const baseSteps = [
    { icon: "📚", text: `Complete your next lesson: ${getNextLessonTitle(completedLessons)}` },
    { icon: "💻", text: "Practice in the interactive playground for 15 minutes" },
    { icon: "👥", text: "Share your progress with the community on Discord" },
  ]

  const personalizedSteps = {
    motivated: [
      ...baseSteps,
      { icon: "🎯", text: "Set a new personal challenge for this week" },
      { icon: "🏃‍♂️", text: "Try to maintain your learning streak for 7 more days" },
    ],
    encouraging: [
      ...baseSteps,
      { icon: "🌱", text: "Take your time and focus on understanding concepts deeply" },
      { icon: "💝", text: "Celebrate your progress - you're doing amazing!" },
    ],
    analytical: [
      ...baseSteps,
      { icon: "📊", text: "Review your code efficiency and optimization opportunities" },
      { icon: "🔍", text: "Analyze patterns in your learning and identify improvement areas" },
    ],
    competitive: [
      ...baseSteps,
      { icon: "🏆", text: "Join this week's coding challenge to test your skills" },
      { icon: "⚡", text: "Aim to complete 2 lessons today to stay ahead" },
    ],
  }

  return personalizedSteps[personalityType as keyof typeof personalizedSteps] || personalizedSteps.motivated
}

function getNextLessonTitle(completedLessons: number): string {
  const lessons = [
    "Hello World & Basic Syntax",
    "Variables & Data Types",
    "Input/Output Operations",
    "Conditional Statements",
    "Loops & Iterations",
    "Functions & Parameters",
    "Arrays & Vectors",
    "Pointers & References",
    "Classes & Objects",
    "Inheritance & Polymorphism",
  ]

  return lessons[completedLessons] || "Advanced C++ Concepts"
}
