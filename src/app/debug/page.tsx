export default function DebugPage() {
  return (
    <html>
      <head>
        <title>Debug Page</title>
      </head>
      <body
        style={{
          backgroundColor: "#0f172a",
          color: "#f1f5f9",
          padding: "20px",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#3b82f6" }}>
          Debug Page
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#94a3b8" }}>
          This page uses inline styles to test if the issue is with Tailwind
          CSS.
        </p>
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            backgroundColor: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "8px",
          }}
        >
          <h2 style={{ color: "#10b981", marginBottom: "10px" }}>
            Styling Test
          </h2>
          <p style={{ color: "#94a3b8" }}>
            If you can see this with proper styling, the issue is with Tailwind
            CSS configuration.
          </p>
        </div>
      </body>
    </html>
  );
}


