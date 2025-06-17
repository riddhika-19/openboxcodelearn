import { Resend } from "resend"
import { type NextRequest, NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, audienceId } = await request.json()

    // Validate required fields
    if (!email || !firstName) {
      return NextResponse.json({ error: "Email and firstName are required" }, { status: 400 })
    }

    // Add contact to Resend audience
    const contactResult = await resend.contacts.create({
      email: email,
      firstName: firstName,
      lastName: lastName || "",
      unsubscribed: false,
      audienceId: audienceId || process.env.RESEND_AUDIENCE_ID || "fa7e26bc-445c-43ff-922b-71aa1c9a3787",
    })

    return NextResponse.json({
      success: true,
      message: "Contact added to Resend audience successfully",
      contactId: contactResult.id,
      data: contactResult,
    })
  } catch (error) {
    console.error("Resend contact creation error:", error)
    return NextResponse.json(
      {
        error: "Failed to add contact to audience",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// GET route to retrieve contact information
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const contactId = searchParams.get("contactId")

    if (!email && !contactId) {
      return NextResponse.json({ error: "Email or contactId parameter is required" }, { status: 400 })
    }

    // Note: Resend doesn't have a direct get contact by email API
    // This would typically require storing the contact ID when creating
    return NextResponse.json({
      message: "Contact retrieval not directly supported by Resend API",
      suggestion: "Store contact IDs when creating contacts for future reference",
    })
  } catch (error) {
    console.error("Resend contact retrieval error:", error)
    return NextResponse.json({ error: "Failed to retrieve contact" }, { status: 500 })
  }
}

// DELETE route to remove contact from audience
export async function DELETE(request: NextRequest) {
  try {
    const { contactId, audienceId } = await request.json()

    if (!contactId || !audienceId) {
      return NextResponse.json({ error: "contactId and audienceId are required" }, { status: 400 })
    }

    // Remove contact from audience
    await resend.contacts.remove({
      id: contactId,
      audienceId: audienceId,
    })

    return NextResponse.json({
      success: true,
      message: "Contact removed from audience successfully",
    })
  } catch (error) {
    console.error("Resend contact removal error:", error)
    return NextResponse.json({ error: "Failed to remove contact from audience" }, { status: 500 })
  }
}
