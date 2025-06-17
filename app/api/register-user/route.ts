import { Resend } from "resend"
import { type NextRequest, NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, learningGoals, experience, personalityType } = await request.json()

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Name, email, and phone are required" }, { status: 400 })
    }

    console.log("🚀 Processing registration for:", { name, email, phone })

    // Initialize results tracking
    const results = {
      welcomeEmail: null,
      adminEmail: null,
      contactCreated: null,
      errors: [],
    }

    // 1. Send welcome email to user FIRST (highest priority)
    try {
      console.log("📨 Sending welcome email to user:", email)
      const welcomeEmail = await resend.emails.send({
        from: "OpenBox Community <onboarding@resend.dev>",
        to: [email],
        subject: "🚀 Welcome to OpenBox Community - Your C++ Journey Begins!",
        html: generateWelcomeEmail(name, learningGoals, experience),
      })

      results.welcomeEmail = welcomeEmail
      console.log("✅ Welcome email sent successfully to user:", welcomeEmail.data?.id)
    } catch (emailError) {
      console.error("❌ Failed to send welcome email:", emailError)
      results.errors.push({
        type: "welcome_email",
        error: emailError.message || "Unknown email error",
        details: emailError,
      })
    }

    // 2. Add user to Resend contacts/audience
    try {
      console.log("📧 Adding contact to Resend audience...")
      const contactResult = await resend.contacts.create({
        email: email,
        firstName: name.split(" ")[0] || name,
        lastName: name.split(" ").slice(1).join(" ") || "",
        unsubscribed: false,
        audienceId: process.env.RESEND_AUDIENCE_ID,
      })

      results.contactCreated = contactResult
      console.log("✅ Contact added to Resend audience successfully:", contactResult.data?.id)
    } catch (contactError) {
      console.error("❌ Failed to add contact to Resend audience:", contactError)
      results.errors.push({
        type: "contact_creation",
        error: contactError.message || "Unknown contact creation error",
        details: contactError,
      })
    }

    // 3. Send notification to admin
    try {
      console.log("📬 Sending admin notification...")
      const adminEmail = await resend.emails.send({
        from: "OpenBox Community <onboarding@resend.dev>",
        to: ["info.aviralone@gmail.com"],
        subject: "🎯 New User Registration - OpenBox C++ Platform",
        html: generateAdminNotificationEmail(
          name,
          email,
          phone,
          learningGoals,
          experience,
          results.welcomeEmail?.data?.id,
        ),
      })

      results.adminEmail = adminEmail
      console.log("✅ Admin email sent successfully:", adminEmail.data?.id)
    } catch (emailError) {
      console.error("❌ Failed to send admin email:", emailError)
      results.errors.push({
        type: "admin_email",
        error: emailError.message || "Unknown admin email error",
        details: emailError,
      })
    }

    // Store user data (in a real app, this would go to a database)
    const userData = {
      name,
      email,
      phone,
      learningGoals,
      experience,
      personalityType,
      registrationDate: new Date().toISOString(),
      lastProgressEmail: null,
      currentStreak: 0,
      completedLessons: [],
      totalScore: 0,
      resendContactId: results.contactCreated?.data?.id || null,
      addedToResendAudience: !!results.contactCreated?.data?.id,
      welcomeEmailSent: !!results.welcomeEmail?.data?.id,
      welcomeEmailId: results.welcomeEmail?.data?.id,
      emailResults: results,
    }

    // Log final results
    console.log("📊 Registration completed:", {
      welcomeEmailSent: !!results.welcomeEmail?.data?.id,
      contactCreated: !!results.contactCreated?.data?.id,
      adminEmailSent: !!results.adminEmail?.data?.id,
      errorsCount: results.errors.length,
    })

    // Determine success message based on what worked
    let message = "Registration successful! "
    if (results.welcomeEmail?.data?.id) {
      message += "Welcome email sent - check your inbox! "
    } else {
      message += "Welcome email may be delayed. "
    }
    if (results.contactCreated?.data?.id) {
      message += "You've been added to our community list."
    }

    return NextResponse.json({
      success: true,
      message,
      userData,
      debug: {
        welcomeEmailSent: !!results.welcomeEmail?.data?.id,
        welcomeEmailId: results.welcomeEmail?.data?.id,
        contactCreated: !!results.contactCreated?.data?.id,
        contactId: results.contactCreated?.data?.id,
        emailsSent: {
          welcome: !!results.welcomeEmail?.data?.id,
          admin: !!results.adminEmail?.data?.id,
        },
        errors: results.errors.length > 0 ? results.errors : undefined,
      },
    })
  } catch (error) {
    console.error("💥 Registration error:", error)
    return NextResponse.json(
      {
        error: "Failed to register user. Please try again.",
        details: error.message,
      },
      { status: 500 },
    )
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
        .welcome-badge {
            background: #dcfce7;
            color: #166534;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            display: inline-block;
            margin-bottom: 20px;
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
            <div class="welcome-badge">🎉 Welcome New Member!</div>
            <h1 class="welcome-title">Welcome to the Community, ${name}! 🚀</h1>
            <p class="subtitle">Your C++ mastery journey starts now</p>
        </div>

        <div class="content">
            <p>Hi <strong>${name}</strong>,</p>
            
            <p><strong>🎉 Congratulations!</strong> You've successfully joined the <strong>OpenBox Community</strong>! We're absolutely thrilled to have you as part of our growing family of passionate C++ developers.</p>

            <p>You've just taken the first step towards mastering one of the most powerful and in-demand programming languages in the world. Whether you're aiming for your dream job, building amazing projects, or just exploring the world of programming, we're here to support you every step of the way!</p>

            ${
              learningGoals
                ? `
            <div class="personalized-section">
                <h3>🎯 Your Learning Goals</h3>
                <p>We noticed you mentioned: <em>"${learningGoals}"</em></p>
                <p>Perfect! Our community-driven curriculum and personalized learning path are designed to help you achieve exactly these goals. We'll send you targeted progress updates and recommendations based on your objectives.</p>
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
                <p>Great! We've tailored your learning journey to match your current skill level. You'll receive content that challenges you appropriately while building a solid foundation for advanced concepts.</p>
            </div>
            `
                : ""
            }

            <h2>🚀 What Makes OpenBox Special?</h2>
            
            <div class="feature-grid">
                <div class="feature-card">
                    <div class="feature-icon">🤖</div>
                    <div class="feature-title">AI-Powered Learning</div>
                    <div class="feature-desc">Get personalized feedback, hints, and code reviews powered by DeepSeek AI to accelerate your learning journey.</div>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">👥</div>
                    <div class="feature-title">Vibrant Community</div>
                    <div class="feature-desc">Join 15,000+ active learners in our Discord community for 24/7 support, collaboration, and networking.</div>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">💻</div>
                    <div class="feature-title">Interactive Playground</div>
                    <div class="feature-desc">Write, compile, and run C++ code directly in your browser with real-time feedback and debugging tools.</div>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">📚</div>
                    <div class="feature-title">Structured Learning Path</div>
                    <div class="feature-desc">Follow our comprehensive 2-month placement-ready plan with daily lessons, projects, and progress tracking.</div>
                </div>
            </div>

            <h2>📈 Join a Thriving Community</h2>
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
            <p>Don't wait! Begin with our interactive playground or dive into our structured learning plan designed by industry experts and successful developers.</p>
            
            <a href="https://github.com/riddhika-19/openboxcodelearn" class="cta-button">🚀 Start Coding Now</a>
            <a href="https://github.com/riddhika-19/openboxcodelearn" class="cta-button">📅 View Learning Plan</a>
        </div>

        <div class="content">
            <h3>📧 What to Expect Next</h3>
            <ul>
                <li><strong>Daily Progress Updates:</strong> Personalized emails tracking your learning journey and celebrating milestones</li>
                <li><strong>Weekly Challenges:</strong> Community-created coding challenges to test and improve your skills</li>
                <li><strong>Milestone Celebrations:</strong> Recognition and rewards when you complete major learning objectives</li>
                <li><strong>Community Highlights:</strong> Success stories, tips, and insights from fellow learners and mentors</li>
                <li><strong>Expert Guidance:</strong> Access to experienced developers and industry professionals</li>
            </ul>

            <h3>🤝 Connect with Our Community</h3>
            <p>Don't learn alone! Connect with fellow learners, get help from mentors, and contribute to our open-source mission:</p>
            
            <div class="social-links">
                <a href="https://github.com/riddhika-19/openboxcodelearn" class="social-link">💬 Discord Community</a>
                <a href="https://github.com/riddhika-19/openboxcodelearn" class="social-link">🐙 GitHub Repository</a>
                <a href="https://github.com/riddhika-19/openboxcodelearn" class="social-link">📱 Mobile App</a>
            </div>

            <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <h4 style="margin: 0 0 10px 0; color: #92400e;">💡 Pro Tip for Success</h4>
                <p style="margin: 0; color: #92400e;">Set aside 30 minutes daily for consistent practice. Small, regular efforts lead to massive results in programming!</p>
            </div>
        </div>

        <div class="footer">
            <p><strong>Built with ❤️ by the OpenBox Community</strong></p>
            <p>This email was sent to <strong>${name}</strong> because you just registered for the OpenBox C++ Learning Platform.</p>
            <p>Questions? Simply reply to this email or reach out to our community support team.</p>
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
  welcomeEmailId?: string,
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
            text-align: center;
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
            min-width: 120px;
        }
        .value {
            color: #1e293b;
            flex: 1;
            text-align: right;
        }
        .goals-section {
            background: #f0f9ff;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            margin: 15px 0;
        }
        .contact-details {
            background: #ecfdf5;
            border: 1px solid #10b981;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
        }
        .success-badge {
            background: #dcfce7;
            color: #166534;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            display: inline-block;
        }
        .email-status {
            background: #dbeafe;
            border: 1px solid #3b82f6;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 New User Registration Alert</h1>
            <p>OpenBox Community C++ Learning Platform</p>
            <div class="success-badge">✅ Registration & Email Sent Successfully</div>
        </div>

        ${
          welcomeEmailId
            ? `
        <div class="email-status">
            <h3>📧 Welcome Email Status</h3>
            <p><strong>✅ Welcome email sent successfully to user!</strong></p>
            <p><strong>Email ID:</strong> ${welcomeEmailId}</p>
            <p><strong>Recipient:</strong> ${email}</p>
            <p>The user should receive their welcome email within a few minutes.</p>
        </div>
        `
            : `
        <div class="email-status">
            <h3>⚠️ Welcome Email Status</h3>
            <p><strong>❌ Welcome email failed to send</strong></p>
            <p><strong>Action Required:</strong> Please manually send welcome email to ${email}</p>
        </div>
        `
        }

        <div class="user-info">
            <h3>👤 New User Information</h3>
            <div class="info-row">
                <span class="label">Full Name:</span>
                <span class="value"><strong>${name}</strong></span>
            </div>
            <div class="info-row">
                <span class="label">Email Address:</span>
                <span class="value"><strong>${email}</strong></span>
            </div>
            <div class="info-row">
                <span class="label">Phone Number:</span>
                <span class="value"><strong>${phone}</strong></span>
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
                <span class="value"><strong>${experience}</strong></span>
            </div>
            `
                : ""
            }
        </div>

        <div class="contact-details">
            <h3>📞 Quick Contact Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #3b82f6;">${email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${phone}" style="color: #3b82f6;">${phone}</a></p>
        </div>

        ${
          learningGoals
            ? `
        <div class="goals-section">
            <h3>🎯 User's Learning Goals</h3>
            <p><em>"${learningGoals}"</em></p>
            <p><strong>Recommendation:</strong> Consider personalizing their learning path based on these specific goals.</p>
        </div>
        `
            : ""
        }

        <div class="user-info">
            <h3>📊 Registration Summary</h3>
            <div class="info-row">
                <span class="label">Platform:</span>
                <span class="value">OpenBox C++ Learning Platform</span>
            </div>
            <div class="info-row">
                <span class="label">Source:</span>
                <span class="value">Website Registration Form</span>
            </div>
            <div class="info-row">
                <span class="label">Welcome Email:</span>
                <span class="value"><strong>${welcomeEmailId ? "✅ Sent Successfully" : "❌ Failed"}</strong></span>
            </div>
            <div class="info-row">
                <span class="label">Added to Audience:</span>
                <span class="value"><strong>✅ Yes</strong></span>
            </div>
        </div>

        <div style="background: #f0f9ff; border: 1px solid #3b82f6; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <h3>📋 Recommended Next Steps</h3>
            <ul>
                <li><strong>Monitor Welcome Email:</strong> ${
                  welcomeEmailId ? "Email sent successfully - no action needed" : "Send manual welcome email"
                }</li>
                <li><strong>Discord Invitation:</strong> Consider inviting them to the community Discord server</li>
                <li><strong>Progress Check:</strong> Follow up on their learning progress after 1 week</li>
                <li><strong>Personalization:</strong> Use their learning goals to customize their experience</li>
                <li><strong>Community Introduction:</strong> Help them connect with other learners at similar levels</li>
            </ul>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px; text-align: center;">
            <p>This notification was automatically generated by the OpenBox Community platform.</p>
            <p><strong>User Details:</strong> ${name} | ${email} | ${phone}</p>
            <p><strong>Registration Time:</strong> ${new Date().toISOString()}</p>
            ${welcomeEmailId ? `<p><strong>Welcome Email ID:</strong> ${welcomeEmailId}</p>` : ""}
        </div>
    </div>
</body>
</html>
  `
}
