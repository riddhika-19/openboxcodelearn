import { Resend } from "resend"
import { type NextRequest, NextResponse } from "next/server"

const resend = new Resend("re_PFVjWRar_Bj6QC6CSbfrMDfyRekRcbjvt")

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, learningGoals, experience } = await request.json()

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Name, email, and phone are required" }, { status: 400 })
    }

    // Send welcome email to user
    const welcomeEmail = await resend.emails.send({
      from: "OpenBox Community <noreply@openboxcommunity.dev>",
      to: [email],
      subject: "🚀 Welcome to OpenBox Community - Your C++ Journey Begins!",
      html: generateWelcomeEmail(name, learningGoals, experience),
    })

    // Send notification to admin
    const adminEmail = await resend.emails.send({
      from: "OpenBox Community <noreply@openboxcommunity.dev>",
      to: ["info.aviralone@gmail.com"],
      subject: "🎯 New User Registration - OpenBox C++ Platform",
      html: generateAdminNotificationEmail(name, email, phone, learningGoals, experience),
    })

    // Add user to Resend contacts/audience
    try {
      const contactResult = await resend.contacts.create({
        email: email,
        firstName: name.split(" ")[0], // First name from full name
        lastName: name.split(" ").slice(1).join(" ") || "", // Last name(s) from full name
        unsubscribed: false,
        audienceId: process.env.RESEND_AUDIENCE_ID || "fa7e26bc-445c-43ff-922b-71aa1c9a3787", // Use env variable or fallback
      })

      console.log("Contact added to Resend audience:", contactResult)
    } catch (contactError) {
      console.error("Failed to add contact to Resend audience:", contactError)
      // Don't fail the registration if contact creation fails
    }

    // Store user data (in a real app, this would go to a database)
    const userData = {
      name,
      email,
      phone,
      learningGoals,
      experience,
      registrationDate: new Date().toISOString(),
      lastProgressEmail: null,
      currentStreak: 0,
      completedLessons: [],
      totalScore: 0,
      addedToResendAudience: true, // Track that they were added
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful! Check your email for welcome message.",
      userData,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Failed to register user. Please try again." }, { status: 500 })
  }
}

function generateWelcomeEmail(name: string, learningGoals?: string, experience?: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to OpenBox Community</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
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
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 18px;
            display: inline-block;
            margin-bottom: 20px;
        }
        .welcome-title {
            color: #1e293b;
            font-size: 28px;
            font-weight: bold;
            margin: 0;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .subtitle {
            color: #64748b;
            font-size: 16px;
            margin: 10px 0 0 0;
        }
        .content {
            margin: 30px 0;
        }
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .feature-card {
            background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #3b82f6;
        }
        .feature-icon {
            font-size: 24px;
            margin-bottom: 10px;
        }
        .feature-title {
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 8px;
        }
        .feature-desc {
            color: #64748b;
            font-size: 14px;
        }
        .cta-section {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            color: white;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            margin: 30px 0;
        }
        .cta-button {
            background: white;
            color: #3b82f6;
            padding: 12px 30px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            display: inline-block;
            margin: 15px 10px 0 10px;
            transition: transform 0.2s;
        }
        .cta-button:hover {
            transform: translateY(-2px);
        }
        .personalized-section {
            background: #f0f9ff;
            border: 1px solid #0ea5e9;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .stat-item {
            text-align: center;
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
        }
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #3b82f6;
        }
        .stat-label {
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 14px;
        }
        .social-links {
            margin: 20px 0;
        }
        .social-link {
            display: inline-block;
            margin: 0 10px;
            padding: 8px 16px;
            background: #f1f5f9;
            color: #3b82f6;
            text-decoration: none;
            border-radius: 6px;
            font-size: 14px;
        }
        @media (max-width: 600px) {
            body { padding: 10px; }
            .container { padding: 20px; }
            .feature-grid { grid-template-columns: 1fr; }
            .stats { grid-template-columns: repeat(2, 1fr); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">📦 OPENBOX</div>
            <h1 class="welcome-title">Welcome to the Community, ${name}! 🎉</h1>
            <p class="subtitle">Your C++ mastery journey starts now</p>
        </div>

        <div class="content">
            <p>Hi <strong>${name}</strong>,</p>
            
            <p>Welcome to the <strong>OpenBox Community</strong>! We're thrilled to have you join our growing family of passionate C++ developers. You've just taken the first step towards mastering one of the most powerful programming languages in the world.</p>

            ${
              learningGoals
                ? `
            <div class="personalized-section">
                <h3>🎯 Your Learning Goals</h3>
                <p>We noticed you mentioned: <em>"${learningGoals}"</em></p>
                <p>Our community-driven curriculum is designed to help you achieve exactly these goals. We'll send you personalized progress updates and recommendations based on your objectives.</p>
            </div>
            `
                : ""
            }

            ${
              experience
                ? `
            <div class="personalized-section">
                <h3>📊 Your Experience Level</h3>
                <p>Experience Level: <strong>${experience}</strong></p>
                <p>We've tailored your learning path to match your current skill level. You'll receive content that challenges you appropriately while building a solid foundation.</p>
            </div>
            `
                : ""
            }

            <h2>🚀 What Makes OpenBox Special?</h2>
            
            <div class="feature-grid">
                <div class="feature-card">
                    <div class="feature-icon">🤖</div>
                    <div class="feature-title">AI-Powered Learning</div>
                    <div class="feature-desc">Get personalized feedback and hints powered by DeepSeek AI to accelerate your learning.</div>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">👥</div>
                    <div class="feature-title">Community Support</div>
                    <div class="feature-desc">Join 15,000+ learners in our Discord community for 24/7 support and collaboration.</div>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">💻</div>
                    <div class="feature-title">Interactive Playground</div>
                    <div class="feature-desc">Write, compile, and run C++ code directly in your browser with real-time feedback.</div>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">📚</div>
                    <div class="feature-title">Structured Learning</div>
                    <div class="feature-desc">Follow our comprehensive 2-month placement plan with daily lessons and progress tracking.</div>
                </div>
            </div>

            <h2>📈 Community Impact</h2>
            <div class="stats">
                <div class="stat-item">
                    <div class="stat-number">15,000+</div>
                    <div class="stat-label">Active Learners</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">50+</div>
                    <div class="stat-label">Contributors</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">100%</div>
                    <div class="stat-label">Free & Open</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">24/7</div>
                    <div class="stat-label">Support</div>
                </div>
            </div>
        </div>

        <div class="cta-section">
            <h2>🎯 Ready to Start Your Journey?</h2>
            <p>Begin with our interactive playground or dive into our structured 2-month placement plan designed by industry experts.</p>
            
            <a href="https://your-domain.com/playground" class="cta-button">🚀 Start Coding</a>
            <a href="https://your-domain.com/placement-plan" class="cta-button">📅 View Learning Plan</a>
        </div>

        <div class="content">
            <h3>📧 What to Expect Next</h3>
            <ul>
                <li><strong>Daily Progress Updates:</strong> Personalized emails tracking your learning journey</li>
                <li><strong>Weekly Challenges:</strong> Community-created coding challenges to test your skills</li>
                <li><strong>Milestone Celebrations:</strong> Recognition when you complete major learning objectives</li>
                <li><strong>Community Highlights:</strong> Success stories and tips from fellow learners</li>
            </ul>

            <h3>🤝 Join Our Community</h3>
            <p>Connect with fellow learners, get help from mentors, and contribute to our open-source mission:</p>
            
            <div class="social-links">
                <a href="#" class="social-link">💬 Discord Community</a>
                <a href="#" class="social-link">🐙 GitHub Repository</a>
                <a href="#" class="social-link">📱 Mobile App</a>
            </div>
        </div>

        <div class="footer">
            <p><strong>Built with ❤️ by the OpenBox Community</strong></p>
            <p>This email was sent to ${name} because you registered for the OpenBox C++ Learning Platform.</p>
            <p>Questions? Reply to this email or reach out to our community support.</p>
            <p style="margin-top: 20px; font-size: 12px; color: #94a3b8;">
                OpenBox Community • Open Source Education • Making Programming Accessible to Everyone
            </p>
        </div>
    </div>
</body>
</html>
  `
}

function generateAdminNotificationEmail(
  name: string,
  email: string,
  phone: string,
  learningGoals?: string,
  experience?: string,
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New User Registration - OpenBox Community</title>
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
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .user-info {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 15px 0;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .label {
            font-weight: bold;
            color: #64748b;
        }
        .value {
            color: #1e293b;
        }
        .goals-section {
            background: #f0f9ff;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 New User Registration</h1>
            <p>OpenBox Community C++ Learning Platform</p>
        </div>

        <p><strong>A new user has registered for the OpenBox C++ Learning Platform!</strong></p>

        <div class="user-info">
            <h3>👤 User Information</h3>
            <div class="info-row">
                <span class="label">Name:</span>
                <span class="value">${name}</span>
            </div>
            <div class="info-row">
                <span class="label">Email:</span>
                <span class="value">${email}</span>
            </div>
            <div class="info-row">
                <span class="label">Phone:</span>
                <span class="value">${phone}</span>
            </div>
            <div class="info-row">
                <span class="label">Registration Date:</span>
                <span class="value">${new Date().toLocaleString()}</span>
            </div>
            ${
              experience
                ? `
            <div class="info-row">
                <span class="label">Experience Level:</span>
                <span class="value">${experience}</span>
            </div>
            `
                : ""
            }
        </div>

        ${
          learningGoals
            ? `
        <div class="goals-section">
            <h3>🎯 Learning Goals</h3>
            <p><em>"${learningGoals}"</em></p>
        </div>
        `
            : ""
        }

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
            <p>This notification was automatically generated by the OpenBox Community platform.</p>
            <p>Registration timestamp: ${new Date().toISOString()}</p>
        </div>
    </div>
</body>
</html>
  `
}
