import { createDeepSeek } from "@ai-sdk/deepseek"
import { generateText } from "ai"

// Create a custom DeepSeek provider with the provided API key
const deepseek = createDeepSeek({
  apiKey: "sk-345d6c2034454b25a53b0928bc28306c",
})

export async function POST(request: Request) {
  try {
    const { code, type } = await request.json()

    let prompt = ""

    switch (type) {
      case "compilation_error":
        prompt = `The user wrote this C++ code that has compilation errors:

${code}

Please provide helpful feedback to fix the compilation errors. Be encouraging and educational. Explain what's wrong and how to fix it in simple terms suitable for a beginner learning C++.`
        break

      case "missing_header":
        prompt = `The user wrote this C++ code but forgot to include necessary headers:

${code}

Please explain what header files are needed and why they're important. Be encouraging and educational.`
        break

      case "hint_request":
        prompt = `The user is working on this C++ code and needs a hint:

${code}

Please provide a helpful hint to guide them in the right direction. Don't give away the complete solution, but help them understand what they should do next. Be encouraging and educational.`
        break

      default:
        prompt = `Please provide helpful feedback for this C++ code:

${code}

Give constructive feedback that helps the user learn and improve.`
    }

    const { text } = await generateText({
      model: deepseek("deepseek-chat"),
      prompt,
      maxTokens: 300,
    })

    return Response.json({ feedback: text })
  } catch (error) {
    console.error("AI feedback error:", error)
    return Response.json(
      { feedback: "Sorry, I cannot provide feedback at the moment. Please try again later." },
      { status: 500 },
    )
  }
}
