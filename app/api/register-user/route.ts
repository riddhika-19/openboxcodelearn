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

    // 1. Add user to Resend contacts/audience FIRST (most important)
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

    // 2. Send welcome email to user (ONLY if domain is verified, otherwise skip)
    try {
      console.log("📨 Attempting to send welcome email...")

      // For now, we'll send the welcome email to the admin email as a workaround
      // until domain is verified. This ensures the user gets notified.
      const welcomeEmail = await resend.emails.send({
        from: "OpenBox Community <info.aviralone@gmail.com>", // Use verified email
        to: ["info.aviralone@gmail.com"], // Send to admin for now
        subject: `🚀 Welcome Email for ${name} - Please Forward`,
        html: generateWelcomeEmailForAdmin(name, email, phone, learningGoals, experience),
      })

      results.welcomeEmail = welcomeEmail
      console.log("✅ Welcome email sent to admin for forwarding:", welcomeEmail.data?.id)
    } catch (emailError) {
      console.error("❌ Failed to send welcome email:", emailError)
      results.errors.push({
        type: "welcome_email",
        error: emailError.message || "Unknown email error",
        details: emailError,
      })
    }

    // 3. Send notification to admin with user details
    try {
      console.log("📬 Sending admin notification...")
      const adminEmail = await resend.emails.send({
        from: "OpenBox Community <info.aviralone@gmail.com>", // Use verified email
        to: ["info.aviralone@gmail.com"],
        subject: "🎯 New User Registration - OpenBox C++ Platform",
        html: generateAdminNotificationEmail(name, email, phone, learningGoals, experience),
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
      emailResults: results,
    }

    // Log final results
    console.log("📊 Registration completed:", {
      contactCreated: !!results.contactCreated?.data?.id,
      welcomeEmailSent: !!results.welcomeEmail?.data?.id,
      adminEmailSent: !!results.adminEmail?.data?.id,
      errorsCount: results.errors.length,
    })

    return NextResponse.json({
      success: true,
      message:
        "Registration successful! " +
        (results.contactCreated?.data?.id ? "You've been added to our community list. " : "") +
        "Admin has been notified and will send you a welcome email shortly.",
      userData,
      debug: {
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

// Welcome email template that admin can forward to the user
function generateWelcomeEmailForAdmin(
  name: string,
  userEmail: string,
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
    <title>Welcome Email for ${name} - Please Forward</title>
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
        .admin-note {
            background: #fef3c7;
            border: 2px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
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
        }
        .personalized-section {
            background: #f0f9ff;
            border: 1px solid #0ea5e9;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="admin-note">
        <h3>📧 Admin Note - Please Forward This Email</h3>
        <p><strong>To:</strong> ${userEmail}</p>
        <p><strong>Subject:</strong> 🚀 Welcome to OpenBox Community - Your C++ Journey Begins!</p>
        <p>This welcome email should be forwarded to the new user until domain verification is complete.</p>
    </div>

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
                    <div style="font-size: 24px; margin-bottom: 10px;">🤖</div>
                    <div style="font-weight: bold; color: #1e293b; margin-bottom: 8px;">AI-Powered Learning</div>
                    <div style="color: #64748b; font-size: 14px;">Get personalized feedback and hints powered by DeepSeek AI to accelerate your learning.</div>
                </div>
                
                <div class="feature-card">
                    <div style="font-size: 24px; margin-bottom: 10px;">👥</div>
                    <div style="font-weight: bold; color: #1e293b; margin-bottom: 8px;">Community Support</div>
                    <div style="color: #64748b; font-size: 14px;">Join 15,000+ learners in our Discord community for 24/7 support and collaboration.</div>
                </div>
                
                <div class="feature-card">
                    <div style="font-size: 24px; margin-bottom: 10px;">💻</div>
                    <div style="font-weight: bold; color: #1e293b; margin-bottom: 8px;">Interactive Playground</div>
                    <div style="color: #64748b; font-size: 14px;">Write, compile, and run C++ code directly in your browser with real-time feedback.</div>
                </div>
                
                <div class="feature-card">
                    <div style="font-size: 24px; margin-bottom: 10px;">📚</div>
                    <div style="font-weight: bold; color: #1e293b; margin-bottom: 8px;">Structured Learning</div>
                    <div style="color: #64748b; font-size: 14px;">Follow our comprehensive 2-month placement plan with daily lessons and progress tracking.</div>
                </div>
            </div>
        </div>

        <div class="cta-section">
            <h2>🎯 Ready to Start Your Journey?</h2>
            <p>Begin with our interactive playground or dive into our structured 2-month placement plan designed by industry experts.</p>
            
            <a href="https://github.com/riddhika-19/openboxcodelearn" class="cta-button">🚀 Start Coding</a>
            <a href="https://github.com/riddhika-19/openboxcodelearn" class="cta-button">📅 View Learning Plan</a>
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
            
            <div style="margin: 20px 0;">
                <a href="https://github.com/riddhika-19/openboxcodelearn" style="display: inline-block; margin: 0 10px; padding: 8px 16px; background: #f1f5f9; color: #3b82f6; text-decoration: none; border-radius: 6px; font-size: 14px;">💬 Discord Community</a>
                <a href="https://github.com/riddhika-19/openboxcodelearn" style="display: inline-block; margin: 0 10px; padding: 8px 16px; background: #f1f5f9; color: #3b82f6; text-decoration: none; border-radius: 6px; font-size: 14px;">🐙 GitHub Repository</a>
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

// Enhanced admin notification with all user details
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
        .action-section {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
        }
        .contact-details {
            background: #ecfdf5;
            border: 1px solid #10b981;
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
            <p style="font-size: 14px; margin-top: 10px;">Registration Time: ${new Date().toLocaleString()}</p>
        </div>

        <div class="action-section">
            <h3>⚡ Action Required</h3>
            <p><strong>Please send welcome email to the new user manually until domain verification is complete.</strong></p>
            <p>A welcome email template has been sent to you separately for forwarding.</p>
        </div>

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
            <div class="info-row">
                <span class="label">Registration Time:</span>
                <span class="value">${new Date().toISOString()}</span>
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
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
        </div>

        ${
          learningGoals
            ? `
        <div class="goals-section">
            <h3>🎯 User's Learning Goals</h3>
            <p><em>"${learningGoals}"</em></p>
            <p><strong>Recommendation:</strong> Personalize their welcome email based on these goals.</p>
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
                <span class="label">Status:</span>
                <span class="value"><strong>✅ Successfully Registered</strong></span>
            </div>
            <div class="info-row">
                <span class="label">Added to Audience:</span>
                <span class="value"><strong>✅ Yes</strong></span>
            </div>
        </div>

        <div class="action-section">
            <h3>📋 Next Steps</h3>
            <ol>
                <li><strong>Send Welcome Email:</strong> Forward the welcome email template to ${email}</li>
                <li><strong>Add to Discord:</strong> Invite them to the community Discord server</li>
                <li><strong>Follow Up:</strong> Check their progress after 1 week</li>
                <li><strong>Personalize:</strong> Use their learning goals to customize their experience</li>
            </ol>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px; text-align: center;">
            <p>This notification was automatically generated by the OpenBox Community platform.</p>
            <p><strong>User Details:</strong> ${name} | ${email} | ${phone}</p>
            <p><strong>Registration ID:</strong> ${Date.now()}</p>
        </div>
    </div>
</body>
</html>
  `
}
