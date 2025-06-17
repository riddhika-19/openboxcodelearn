import { createDeepSeek } from "@ai-sdk/deepseek"

// Create a DeepSeek provider with the API key
export const deepseekProvider = createDeepSeek({
  apiKey: "sk-345d6c2034454b25a53b0928bc28306c",
})

// Helper function to generate prompts for different scenarios
export function generatePromptForCode(code: string, scenario: string): string {
  switch (scenario) {
    case "explain":
      return `
Explain this C++ code in simple terms for a beginner:

\`\`\`cpp
${code}
\`\`\`

Break down each part and explain what it does in an educational way.
      `
    case "debug":
      return `
Debug this C++ code and identify any issues:

\`\`\`cpp
${code}
\`\`\`

Explain what's wrong and how to fix it in a way that helps the user learn.
      `
    case "optimize":
      return `
Review this C++ code and suggest optimizations:

\`\`\`cpp
${code}
\`\`\`

Suggest improvements while explaining why they're better in an educational way.
      `
    case "hint":
      return `
The user is working on this C++ code and needs a hint:

\`\`\`cpp
${code}
\`\`\`

Provide a helpful hint without giving away the complete solution. Be encouraging and educational.
      `
    default:
      return `
Provide feedback on this C++ code:

\`\`\`cpp
${code}
\`\`\`

Give constructive feedback that helps the user learn and improve.
      `
  }
}
