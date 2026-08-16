"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const items = [
    { icon: "🐶", label: "Dog" },
    { icon: "🐱", label: "Cat" },
    { icon: "🔑", label: "Keys" },
    { icon: "👛", label: "Wallet" },
    { icon: "🧳", label: "Suitcase" },
    { icon: "🎒", label: "Bag" },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #ffffff 0%, #f7faff 55%, #ffffff 100%)",
        color: "#0f172a",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "28px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "27px",
              fontWeight: 950,
              letterSpacing: "-1px",
              color: "#0f172a",
            }}
          >
            QR RETURN
          </div>

          <div
            style={{
              fontSize: "11px",
              color: "#64748b",
              marginTop: "2px",
              letterSpacing: "1px",
            }}
          >
            LOST & FOUND
          </div>
        </div>

        <button
          onClick={() => router.push("/login")}
          style={{
            background: "transparent",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "10px 18px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          შესვლა
        </button>
      </header>

      {/* HERO */}
      <section
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "95px 24px 65px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: "#2563eb",
            fontSize: "14px",
            fontWeight: 900,
            letterSpacing: "3px",
          }}
        >
          QR RETURN
        </div>

        <h1
          style={{
            fontSize: "clamp(45px, 7vw, 78px)",
            lineHeight: 1.05,
            letterSpacing: "-3px",
            margin: "22px auto 20px",
            maxWidth: "900px",
            fontWeight: 950,
          }}
        >
          დაკარგვა არ ნიშნავს
          <br />
          დამშვიდობებას.
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "#64748b",
            margin: "0 auto",
            maxWidth: "620px",
            lineHeight: 1.7,
          }}
        >
          ერთი QR კოდი ეხმარება მპოვნელს სწრაფად დაგიკავშირდეს.
        </p>

        <button
          onClick={() => router.push("/register")}
          style={{
            marginTop: "34px",
            background: "#2563eb",
            color: "white",
            border: 0,
            borderRadius: "15px",
            padding: "16px 34px",
            fontSize: "16px",
            fontWeight: 900,
            cursor: "pointer",
            boxShadow: "0 12px 30px rgba(37,99,235,.22)",
          }}
        >
          რეგისტრაცია →
        </button>
      </section>

      {/* VISUAL ITEMS */}
      <section
        style={{
          maxWidth: "1050px",
          margin: "0 auto",
          padding: "25px 24px 100px",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #eef2f7",
            borderRadius: "32px",
            padding: "48px 30px",
            boxShadow: "0 25px 70px rgba(15,23,42,.06)",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "22px",
          }}
        >
          {items.map((item) => (
            <div
              key={item.label}
              style={{
                height: "150px",
                borderRadius: "24px",
                background:
                  "linear-gradient(145deg, #f8fafc, #eef4ff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "64px",
                border: "1px solid #eef2f7",
              }}
            >
              {item.icon}
            </div>
          ))}
        </div>
      </section>

      {/* MESSAGE */}
      <section
        style={{
          padding: "95px 24px",
          background: "#f5f8ff",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: "#2563eb",
            fontWeight: 900,
            fontSize: "13px",
            letterSpacing: "2px",
          }}
        >
          მარტივი და სწრაფი
        </div>

        <h2
          style={{
            maxWidth: "850px",
            margin: "18px auto 0",
            fontSize: "clamp(34px, 5vw, 55px)",
            lineHeight: 1.15,
            letterSpacing: "-2px",
          }}
        >
          მიაბი QR ტეგი სასურველ ცხოველს ან ნივთს და დაიბრუნე მარტივად.
        </h2>
      </section>

      {/* HOW IT WORKS */}
      <section
        style={{
          maxWidth: "1050px",
          margin: "0 auto",
          padding: "100px 24px 120px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: "#2563eb",
            fontWeight: 900,
            fontSize: "13px",
            letterSpacing: "2px",
          }}
        >
          მარტივი პროცესი
        </div>

        <h2
          style={{
            fontSize: "clamp(38px, 5vw, 55px)",
            margin: "14px 0 50px",
          }}
        >
          როგორ მუშაობს?
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
          }}
        >
          {[
            ["01", "დაარეგისტრირე", "აირჩიე ცხოველი ან ნივთი და მიაბი QR კოდი."],
            ["02", "მპოვნელი ასკანერებს", "QR კოდის სკანირება შესაძლებელია ტელეფონით."],
            ["03", "დაგიკავშირდება", "მპოვნელი შეძლებს შენთან სწრაფად დაკავშირებას."],
          ].map(([number, title, text]) => (
            <div
              key={number}
              style={{
                padding: "35px 28px",
                border: "1px solid #e8edf5",
                borderRadius: "25px",
                textAlign: "left",
                background: "#ffffff",
              }}
            >
              <div
                style={{
                  color: "#2563eb",
                  fontWeight: 900,
                  fontSize: "14px",
                }}
              >
                {number}
              </div>

              <h3 style={{ fontSize: "22px", margin: "20px 0 10px" }}>
                {title}
              </h3>

              <p
                style={{
                  color: "#64748b",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
