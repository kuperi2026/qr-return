"use client";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#1266e9",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>
          QR RETURN
        </h1>

        <p style={{ fontSize: "14px", letterSpacing: "2px" }}>
          SMART LOST &amp; FOUND
        </p>
      </div>
    </main>
  );
}
