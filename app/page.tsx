"use client";

import { useRouter } from "next/navigation";

const products = [
  { name: "ძაღლი", icon: "🐶", tag: "QR" },
  { name: "კატა", icon: "🐱", tag: "QR" },
  { name: "გასაღები", icon: "🔑", tag: "QR" },
  { name: "საფულე", icon: "👛", tag: "QR" },
  { name: "ჩემოდანი", icon: "🧳", tag: "QR" },
  { name: "ჩანთა", icon: "🎒", tag: "QR" },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#0f172a",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          width: "100%",
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "28px 24px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "30px",
              fontWeight: 900,
              letterSpacing: "-1.5px",
              color: "#0f172a",
            }}
          >
            QR RETURN
          </div>

          <div
            style={{
              marginTop: "3px",
              color: "#2563eb",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "2.5px",
            }}
          >
            LOST & FOUND
          </div>
        </div>

        <button
          onClick={() => router.push("/login")}
          style={{
            border: "1px solid #e2e8f0",
            background: "#ffffff",
            color: "#0f172a",
            padding: "11px 20px",
            borderRadius: "12px",
            fontWeight: 800,
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
          padding: "90px 24px 65px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: "#2563eb",
            fontSize: "15px",
            fontWeight: 900,
            letterSpacing: "4px",
          }}
        >
          QR RETURN
        </div>

        <h1
          style={{
            margin: "22px 0 0",
            fontSize: "clamp(46px, 7vw, 78px)",
            lineHeight: 1.05,
            letterSpacing: "-3px",
            fontWeight: 900,
          }}
        >
          დაკარგვა არ ნიშნავს
          <br />
          დამშვიდობებას.
        </h1>

        <p
          style={{
            maxWidth: "600px",
            margin: "24px auto 0",
            color: "#64748b",
            fontSize: "18px",
            lineHeight: 1.7,
          }}
        >
          ერთი QR კოდი ეხმარება მპოვნელს სწრაფად დაგიკავშირდეს.
        </p>

        <button
          onClick={() => router.push("/register")}
          style={{
            marginTop: "34px",
            border: "none",
            background: "#2563eb",
            color: "#ffffff",
            padding: "16px 34px",
            borderRadius: "14px",
            fontSize: "16px",
            fontWeight: 900,
            cursor: "pointer",
            boxShadow: "0 12px 30px rgba(37,99,235,0.22)",
          }}
        >
          რეგისტრაცია →
        </button>
      </section>

      {/* PRODUCT VISUALS */}
      <section
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "20px 24px 100px",
        }}
      >
        <div
          className="product-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "18px",
          }}
        >
          {products.map((product) => (
            <div
              key={product.name}
              style={{
                position: "relative",
                minHeight: "190px",
                background:
                  "linear-gradient(145deg, #ffffff 0%, #f4f7fb 100%)",
                border: "1px solid #e8edf5",
                borderRadius: "26px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 14px 40px rgba(15,23,42,0.06)",
              }}
            >
              {/* QR TAG IMITATION */}
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: "#0f172a",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  fontWeight: 900,
                  letterSpacing: "0.5px",
                  transform: "rotate(5deg)",
                  boxShadow: "0 6px 14px rgba(15,23,42,0.16)",
                }}
              >
                QR
              </div>

              <div
                style={{
                  fontSize: "67px",
                  lineHeight: 1,
                }}
              >
                {product.icon}
              </div>

              <div
                style={{
                  marginTop: "20px",
                  fontSize: "18px",
                  fontWeight: 850,
                  color: "#0f172a",
                }}
              >
                {product.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN MESSAGE */}
      <section
        style={{
          background:
            "linear-gradient(180deg, #f5f8ff 0%, #eef4ff 100%)",
          padding: "100px 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              color: "#2563eb",
              fontSize: "13px",
              fontWeight: 900,
              letterSpacing: "2.5px",
            }}
          >
            QR RETURN
          </div>

          <h2
            style={{
              margin: "18px auto 0",
              fontSize: "clamp(34px, 5vw, 54px)",
              lineHeight: 1.18,
              letterSpacing: "-2px",
              fontWeight: 900,
            }}
          >
            მიაბი QR ტეგი სასურველ ცხოველს ან ნივთს და დაიბრუნე მარტივად.
          </h2>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        style={{
          maxWidth: "1050px",
          margin: "0 auto",
          padding: "100px 24px 120px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              color: "#2563eb",
              fontSize: "13px",
              fontWeight: 900,
              letterSpacing: "2px",
            }}
          >
            მარტივი პროცესი
          </div>

          <h2
            style={{
              margin: "14px 0 50px",
              fontSize: "clamp(38px, 5vw, 54px)",
              letterSpacing: "-2px",
            }}
          >
            როგორ მუშაობს?
          </h2>
        </div>

        <div
          className="steps-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "18px",
          }}
        >
          {[
            {
              number: "01",
              title: "დაარეგისტრირე",
              text: "მიაბი QR კოდი შენს ცხოველს ან ნივთს.",
            },
            {
              number: "02",
              title: "მპოვნელი ასკანერებს",
              text: "საკმარისია QR კოდის ტელეფონით დასკანერება.",
            },
            {
              number: "03",
              title: "დაიბრუნე",
              text: "მპოვნელი დაგიკავშირდება და ნივთს მარტივად დაიბრუნებ.",
            },
          ].map((step) => (
            <div
              key={step.number}
              style={{
                background: "#ffffff",
                border: "1px solid #e8edf5",
                borderRadius: "24px",
                padding: "32px",
              }}
            >
              <div
                style={{
                  color: "#2563eb",
                  fontWeight: 900,
                  fontSize: "14px",
                }}
              >
                {step.number}
              </div>

              <h3
                style={{
                  margin: "18px 0 10px",
                  fontSize: "21px",
                }}
              >
                {step.title}
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  lineHeight: 1.65,
                  fontSize: "15px",
                }}
              >
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @media (max-width: 700px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }

          .steps-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
