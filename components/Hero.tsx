export default function Hero() {
  return (
    <section
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "80px 24px 90px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "50px",
        alignItems: "center",
      }}
    >
      {/* LEFT SIDE */}
      <div>
        <div
          style={{
            display: "inline-block",
            padding: "8px 14px",
            borderRadius: "999px",
            background: "#eff6ff",
            color: "#2563eb",
            fontWeight: "700",
            fontSize: "14px",
            marginBottom: "20px",
          }}
        >
          QR Lost & Found
        </div>

        <h1
          style={{
            fontSize: "clamp(44px, 7vw, 76px)",
            lineHeight: "1.05",
            margin: "0",
            color: "#111827",
            fontWeight: "900",
            letterSpacing: "-2px",
          }}
        >
          დაკარგვა არ ნიშნავს
          <span
            style={{
              display: "block",
              color: "#2563eb",
            }}
          >
            დამშვიდობებას.
          </span>
        </h1>

        <p
          style={{
            marginTop: "26px",
            fontSize: "18px",
            lineHeight: "1.7",
            color: "#6b7280",
            maxWidth: "600px",
          }}
        >
          ერთი პატარა QR კოდი დაგეხმარება დაიბრუნო შენი ნივთი ან საყვარელი
          ცხოველი. მპოვნელს მხოლოდ კოდის დასკანერება სჭირდება.
        </p>

        <div
          style={{
            marginTop: "32px",
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <a
            href="/register"
            style={{
              background: "#2563eb",
              color: "white",
              padding: "15px 24px",
              borderRadius: "14px",
              textDecoration: "none",
              fontWeight: "800",
            }}
          >
            QR-ის რეგისტრაცია →
          </a>

          <a
            href="#how"
            style={{
              background: "white",
              color: "#111827",
              padding: "15px 24px",
              borderRadius: "14px",
              textDecoration: "none",
              fontWeight: "700",
              border: "1px solid #e5e7eb",
            }}
          >
            როგორ მუშაობს?
          </a>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div
        style={{
          background: "white",
          borderRadius: "32px",
          padding: "18px",
          boxShadow: "0 25px 60px rgba(15,23,42,0.10)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px",
          }}
        >
          <div
            style={{
              background: "#eff6ff",
              borderRadius: "24px",
              padding: "28px",
              minHeight: "180px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontSize: "54px" }}>🐶</div>
            <div>
              <strong style={{ fontSize: "18px" }}>ძაღლი</strong>
              <div style={{ color: "#6b7280", marginTop: "5px" }}>
                QR ID #00128
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#fff7ed",
              borderRadius: "24px",
              padding: "28px",
              minHeight: "180px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontSize: "54px" }}>🐱</div>
            <div>
              <strong style={{ fontSize: "18px" }}>კატა</strong>
              <div style={{ color: "#6b7280", marginTop: "5px" }}>
                QR ID #00352
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#f5f3ff",
              borderRadius: "24px",
              padding: "28px",
              minHeight: "150px",
            }}
          >
            <div style={{ fontSize: "46px" }}>🔑 👛</div>
            <div
              style={{
                marginTop: "22px",
                fontWeight: "800",
                fontSize: "17px",
              }}
            >
              გასაღები · საფულე
            </div>
          </div>

          <div
            style={{
              background: "#ecfdf5",
              borderRadius: "24px",
              padding: "28px",
              minHeight: "150px",
            }}
          >
            <div style={{ fontSize: "46px" }}>🧳 🎒</div>
            <div
              style={{
                marginTop: "22px",
                fontWeight: "800",
                fontSize: "17px",
              }}
            >
              ჩემოდანი · ჩანთა
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
