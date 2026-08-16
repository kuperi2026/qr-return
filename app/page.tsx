"use client";

import { useState } from "react";

const items = [
  { id: "dog", ka: "ძაღლი", en: "Dog", icon: "🐶" },
  { id: "cat", ka: "კატა", en: "Cat", icon: "🐱" },
  { id: "keys", ka: "გასაღები", en: "Keys", icon: "🔑" },
  { id: "wallet", ka: "საფულე", en: "Wallet", icon: "👛" },
  { id: "suitcase", ka: "ჩემოდანი", en: "Suitcase", icon: "🧳" },
  { id: "bag", ka: "ჩანთა", en: "Bag", icon: "🎒" },
];

export default function HomePage() {
  const [language, setLanguage] = useState<"ka" | "en">("ka");

  const isKa = language === "ka";

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
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "26px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
        {/* BRAND */}
        <a
          href="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "13px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "#2563eb",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: "900",
              boxShadow: "0 8px 22px rgba(37,99,235,.22)",
            }}
          >
            QR
          </div>

          <div>
            <div
              style={{
                color: "#2563eb",
                fontSize: "30px",
                lineHeight: 1,
                fontWeight: "900",
                letterSpacing: "-1.4px",
              }}
            >
              QR RETURN
            </div>

            <div
              style={{
                marginTop: "5px",
                color: "#94a3b8",
                fontSize: "9px",
                fontWeight: "800",
                letterSpacing: "3px",
              }}
            >
              LOST & FOUND
            </div>
          </div>
        </a>

        {/* RIGHT MENU */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              background: "#f1f5f9",
              padding: "4px",
              borderRadius: "11px",
            }}
          >
            <button
              type="button"
              onClick={() => setLanguage("ka")}
              style={{
                border: "none",
                background: isKa ? "#ffffff" : "transparent",
                color: isKa ? "#2563eb" : "#64748b",
                padding: "8px 10px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "800",
                boxShadow: isKa
                  ? "0 2px 8px rgba(15,23,42,.08)"
                  : "none",
              }}
            >
              ქარ
            </button>

            <button
              type="button"
              onClick={() => setLanguage("en")}
              style={{
                border: "none",
                background: !isKa ? "#ffffff" : "transparent",
                color: !isKa ? "#2563eb" : "#64748b",
                padding: "8px 10px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "800",
                boxShadow: !isKa
                  ? "0 2px 8px rgba(15,23,42,.08)"
                  : "none",
              }}
            >
              EN
            </button>
          </div>

          <a
            href="/login"
            style={{
              textDecoration: "none",
              background: "#0f172a",
              color: "#ffffff",
              padding: "11px 18px",
              borderRadius: "11px",
              fontSize: "14px",
              fontWeight: "800",
            }}
          >
            {isKa ? "შესვლა" : "Log in"}
          </a>
        </div>
      </header>

      {/* HERO */}
      <section
        style={{
          maxWidth: "980px",
          margin: "0 auto",
          padding: "90px 24px 65px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            color: "#2563eb",
            background: "#eff6ff",
            padding: "8px 14px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: "900",
            letterSpacing: "2px",
          }}
        >
          QR RETURN
        </div>

        <h1
          style={{
            margin: "22px auto 0",
            fontSize: "clamp(44px, 7vw, 76px)",
            lineHeight: "1.07",
            letterSpacing: "-3px",
            fontWeight: "900",
            maxWidth: "900px",
          }}
        >
          {isKa ? (
            <>
              დაკარგვა არ ნიშნავს
              <br />
              დამშვიდობებას.
            </>
          ) : (
            <>
              Lost doesn't mean
              <br />
              gone forever.
            </>
          )}
        </h1>

        <p
          style={{
            maxWidth: "620px",
            margin: "24px auto 0",
            color: "#64748b",
            fontSize: "18px",
            lineHeight: "1.7",
          }}
        >
          {isKa
            ? "ერთი QR კოდი ეხმარება მპოვნელს სწრაფად დაგიკავშირდეს."
            : "One QR code helps the finder quickly get in touch with you."}
        </p>
      </section>

      {/* REGISTRATION CHOICES */}
      <section
        style={{
          background:
            "linear-gradient(180deg, #f8faff 0%, #f3f7ff 100%)",
          padding: "70px 24px 110px",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              maxWidth: "820px",
              margin: "0 auto",
              textAlign: "center",
              fontSize: "clamp(29px, 4vw, 43px)",
              lineHeight: "1.22",
              letterSpacing: "-1.5px",
              fontWeight: "900",
            }}
          >
            {isKa
              ? "მიაბი QR ტეგი სასურველ ცხოველს ან ნივთს და დაიბრუნე მარტივად."
              : "Attach a QR tag to your pet or item and get it back easily."}
          </h2>

          <p
            style={{
              margin: "15px auto 42px",
              textAlign: "center",
              color: "#64748b",
              fontSize: "15px",
            }}
          >
            {isKa
              ? "აირჩიე ქვემოთ და დაიწყე რეგისტრაცია"
              : "Choose below to start registration"}
          </p>

          <div
            className="item-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "18px",
            }}
          >
            {items.map((item) => (
              <a
                key={item.id}
                href={`/register/details?type=${item.id}&lang=${language}`}
                style={{
                  position: "relative",
                  minHeight: "205px",
                  textDecoration: "none",
                  background: "#ffffff",
                  border: "1px solid #e4eaf3",
                  borderRadius: "27px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0f172a",
                  boxShadow: "0 15px 45px rgba(37,99,235,.07)",
                }}
              >
                {/* QR TAG */}
                <div
                  style={{
                    position: "absolute",
                    top: "17px",
                    right: "17px",
                    width: "37px",
                    height: "37px",
                    borderRadius: "10px",
                    background: "#2563eb",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "9px",
                    fontWeight: "900",
                    boxShadow: "0 6px 15px rgba(37,99,235,.2)",
                  }}
                >
                  QR
                </div>

                <div
                  style={{
                    fontSize: "68px",
                    lineHeight: 1,
                  }}
                >
                  {item.icon}
                </div>

                <div
                  style={{
                    marginTop: "20px",
                    fontSize: "19px",
                    fontWeight: "900",
                  }}
                >
                  {isKa ? item.ka : item.en}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer
        style={{
          padding: "35px 24px",
          textAlign: "center",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            color: "#2563eb",
            fontWeight: "900",
            fontSize: "17px",
          }}
        >
          QR RETURN
        </div>
      </footer>

      <style>{`
        @media (max-width: 700px) {
          .item-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 520px) {
          header {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
        }
      `}</style>
    </main>
  );
}
