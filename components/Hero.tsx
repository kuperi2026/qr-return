export default function Hero() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px 24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "18px",
            fontWeight: "900",
            color: "#2563eb",
            letterSpacing: "1px",
          }}
        >
          QR RETURN
        </div>

        <h1
          style={{
            margin: "22px 0 0",
            fontSize: "clamp(42px, 7vw, 72px)",
            lineHeight: "1.08",
            fontWeight: "900",
            letterSpacing: "-2px",
            color: "#111827",
          }}
        >
          დაკარგვა არ ნიშნავს
          <br />
          დამშვიდობებას.
        </h1>

        <p
          style={{
            margin: "24px auto 0",
            maxWidth: "580px",
            fontSize: "18px",
            lineHeight: "1.7",
            color: "#64748b",
          }}
        >
          ერთი QR კოდი ეხმარება მპოვნელს სწრაფად დაგიკავშირდეს.
        </p>

        <div
          style={{
            marginTop: "34px",
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <a
            href="/register"
            style={{
              background: "#111827",
              color: "#ffffff",
              textDecoration: "none",
              padding: "15px 28px",
              borderRadius: "14px",
              fontWeight: "800",
            }}
          >
            რეგისტრაცია
          </a>

          <a
            href="/login"
            style={{
              background: "#ffffff",
              color: "#111827",
              textDecoration: "none",
              padding: "15px 28px",
              borderRadius: "14px",
              border: "1px solid #d1d5db",
              fontWeight: "800",
            }}
          >
            შესვლა
          </a>
        </div>

        <div
          style={{
            marginTop: "70px",
            fontSize: "42px",
            letterSpacing: "12px",
          }}
        >
          🏷️ → 📱
        </div>
      </div>
    </main>
  );
}
