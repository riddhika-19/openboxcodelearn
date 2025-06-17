import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, userId, userName, mistakeType, description, code, timestamp } = body

    // Here you would typically save to a database
    // For now, we'll just log it and return success
    console.log("Mistake tracked:", {
      id,
      userId,
      userName,
      mistakeType,
      description,
      code,
      timestamp,
    })

    // You could also trigger additional actions here:
    // - Send notification to admin
    // - Update user's mistake count
    // - Schedule follow-up emails

    return NextResponse.json({
      success: true,
      message: "Mistake tracked successfully",
      mistakeId: id,
    })
  } catch (error) {
    console.error("Error tracking mistake:", error)
    return NextResponse.json({ success: false, error: "Failed to track mistake" }, { status: 500 })
  }
}
