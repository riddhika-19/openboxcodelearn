import type * as React from "react"

interface EmailTemplateProps {
  firstName: string
  message?: string
  subject?: string
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  message = "Welcome to our platform!",
  subject = "Welcome",
}) => (
  <div
    style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      lineHeight: "1.6",
      color: "#333",
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: "#f8fafc",
    }}
  >
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "40px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            color: "white",
            padding: "12px 24px",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "18px",
            display: "inline-block",
            marginBottom: "20px",
          }}
        >
          📦 OPENBOX
        </div>
        <h1
          style={{
            color: "#1e293b",
            fontSize: "28px",
            fontWeight: "bold",
            margin: "0",
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Hello {firstName}! 👋
        </h1>
      </div>

      <div style={{ margin: "30px 0" }}>
        <p>
          Hi <strong>{firstName}</strong>,
        </p>
        <p>{message}</p>

        <div
          style={{
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            color: "white",
            padding: "30px",
            borderRadius: "12px",
            textAlign: "center",
            margin: "30px 0",
          }}
        >
          <h2>🚀 Ready to Start Your Journey?</h2>
          <p>Begin with our interactive playground or dive into our structured learning plan.</p>

          <a
            href="https://your-domain.com/playground"
            style={{
              background: "white",
              color: "#3b82f6",
              padding: "12px 30px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
              display: "inline-block",
              margin: "15px 10px 0 10px",
            }}
          >
            🚀 Start Coding
          </a>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: "40px",
          paddingTop: "20px",
          borderTop: "1px solid #e2e8f0",
          color: "#64748b",
          fontSize: "14px",
        }}
      >
        <p>
          <strong>Built with ❤️ by the OpenBox Community</strong>
        </p>
        <p>This email was sent to {firstName} from the OpenBox C++ Learning Platform.</p>
      </div>
    </div>
  </div>
)
