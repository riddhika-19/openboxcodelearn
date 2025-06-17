import { Resend } from "resend"
import { type NextRequest, NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email || !name) {
      return NextResponse.json({ error: "Email and name are required", success: false }, { status: 400 })
    }

    if (!process.env.RESEND_AUDIENCE_ID) {
      return NextResponse.json(
        {
          success: false,
          error: "RESEND_AUDIENCE_ID environment variable is not set",
          config: {
            apiKeySet: !!process.env.RESEND_API_KEY,
            audienceIdSet: false,
          },
        },
        { status: 500 },
      )
    }

    // Test contact creation
    const result = await resend.contacts.create({
      email: email,
      firstName: name.split(" ")[0],
      lastName: name.split(" ").slice(1).join(" ") || "",
      unsubscribed: false,
      audienceId: process.env.RESEND_AUDIENCE_ID,
    })

    return NextResponse.json({
      success: true,
      message: "Test contact created successfully",
      data: result,
      config: {
        apiKeySet: !!process.env.RESEND_API_KEY,
        audienceIdSet: !!process.env.RESEND_AUDIENCE_ID,
        audienceId: process.env.RESEND_AUDIENCE_ID,
      },
    })
  } catch (error) {
    console.error("Resend contact test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create test contact",
        details: error,
        config: {
          apiKeySet: !!process.env.RESEND_API_KEY,
          audienceIdSet: !!process.env.RESEND_AUDIENCE_ID,
          audienceId: process.env.RESEND_AUDIENCE_ID,
        },
      },
      { status: 500 },
    )
  }
}
