"use client";

import { useState } from "react";

type Language = "ka" | "en";

const items = [
  { id: "dog", ka: "ძაღლი", en: "Dog", icon: "🐶" },
  { id: "cat", ka: "კატა", en: "Cat", icon: "🐱" },
  { id: "keys", ka: "გასაღები", en: "Keys", icon: "🔑" },
  { id: "wallet", ka: "საფულე", en: "Wallet", icon: "👛" },
  { id: "suitcase", ka: "ჩემოდანი", en: "Suitcase", icon: "🧳" },
  { id: "bag", ka: "ჩანთა", en: "Bag", icon: "🎒" },
];

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("ka");

  const ka = language === "ka";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#0f172a",
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* HEADER */}
      <header
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "26px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
            gap: "14px",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "15px",
              background: "#2563eb",
              color: "#ffffff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: 900,
              fontSize: "15px",
              boxShadow: "0 10px 25px rgba(37,99,235,.25)",
            }}
          >
            QR
          </div>

          <div>
            <div
              style={{
                color: "#2563eb",
                fontSize: "32px",
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-1.6px",
              }}
            >
              QR RETURN
            </div>

            <div
              style={{
                marginTop: "6px",
                color: "#64748b",
                fontSize: "9px",
                fontWeight: 800,
                letterSpacing: "3.5px",
              }}
            >
              LOST & FOUND
            </div>
          </div>
        </a>

        {/* HEADER CONTROLS */}
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
              padding: "4px",
              background: "#f1f5f9",
              borderRadius: "12px",
            }}
          >
            <button
              type="button"
              onClick={() => setLanguage("ka")}
              style={{
                border: 0,
                padding: "8px 11px",
                borderRadius: "9px",
                cursor: "pointer",
                fontWeight: 800,
                background: ka ? "#ffffff" : "transparent",
                color: ka ? "#2563eb" : "#64748b",
                boxShadow: ka
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
                border: 0,
                padding: "8px 11px",
                borderRadius: "9px",
                cursor: "pointer",
                fontWeight: 800,
                background: !ka ? "#ffffff" : "transparent",
                color: !ka ? "#2563eb" : "#64748b",
                boxShadow: !ka
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
              padding: "11px 19px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 800,
            }}
          >
            {ka ? "შესვლა" : "Log in"}
          </a>
        </div>
      </header>

      {/* HERO */}
      <section
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "95px 24px 75px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "#2563eb",
            fontWeight: 900,
            fontSize: "13px",
            letterSpacing: "3px",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#2563eb",
            }}
          />
          QR RETURN
        </div>

        <h1
          style={{
            margin: "23px auto 0",
            maxWidth: "920px",
            fontSize: "clamp(46px, 7vw, 78px)",
            lineHeight: 1.05,
            fontWeight: 900,
            letterSpacing: "-3.2px",
          }}
        >
          {ka ? (
            <>
              დაკარგვა არ ნიშნავს
              <br />
              დამშვიდობებას.
            </>
          ) : (
            <>
              Lost doesn&apos;t mean
              <br />
              gone forever.
            </>
          )}
        </h1>

        <p
          style={{
            margin: "25px auto 0",
            maxWidth: "650px",
            color: "#64748b",
            fontSize: "18px",
            lineHeight: 1.7,
          }}
        >
          {ka
            ? "ერთი QR კოდი ეხმარება მპოვნელს სწრაფად დაგიკავშირდეს — პირადი ინფორმაციის ზედმეტად გამჟღავნების გარეშე."
            : "One QR code helps a finder quickly reach you without unnecessarily exposing your personal information."}
        </p>
      </section>

      {/* DIRECT REGISTRATION */}
      <section
        style={{
          padding: "75px 24px 115px",
          background:
            "linear-gradient(180deg, #f8faff 0%, #f2f6ff 100%)",
        }}
      >
        <div
          style={{
            maxWidth: "1020px",
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              maxWidth: "820px",
              margin: "0 auto",
              textAlign: "center",
              fontSize: "clamp(30px, 4vw, 45px)",
              lineHeight: 1.2,
              fontWeight: 900,
              letterSpacing: "-1.6px",
            }}
          >
            {ka
              ? "მიაბი QR ტეგი სასურველ ცხოველს ან ნივთს და დაიბრუნე მარტივად."
              : "Attach a QR tag to your pet or item and get it back easily."}
          </h2>

          <p
            style={{
              textAlign: "center",
              color: "#64748b",
              margin: "15px auto 44px",
              fontSize: "15px",
            }}
          >
            {ka
              ? "აირჩიე ქვემოთ — რეგისტრაცია პირდაპირ დაიწყება."
              : "Choose below to start registration immediately."}
          </p>

          <div
            className="qr-item-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
            }}
          >
            {items.map((item) => (
              <a
                key={item.id}
                href={`/register/details?type=${item.id}&lang=${language}`}
                style={{
                  minHeight: "220px",
                  position: "relative",
                  textDecoration: "none",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "28px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0f172a",
                  boxShadow: "0 15px 45px rgba(37,99,235,.07)",
                  overflow: "hidden",
                }}
              >
                {/* decorative QR tag */}
                <div
                  style={{
                    position: "absolute",
                    top: "18px",
                    right: "18px",
                    width: "40px",
                    height: "40px",
                    borderRadius: "11px",
                    background: "#2563eb",
                    color: "#ffffff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "10px",
                    fontWeight: 900,
                    boxShadow: "0 7px 18px rgba(37,99,235,.2)",
                  }}
                >
                  QR
                </div>

                <div
                  style={{
                    width: "105px",
                    height: "105px",
                    borderRadius: "28px",
                    background:
                      "linear-gradient(145deg,#f8fafc,#eef4ff)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "64px",
                  }}
                >
                  {item.icon}
                </div>

                <div
                  style={{
                    marginTop: "20px",
                    fontSize: "19px",
                    fontWeight: 900,
                  }}
                >
                  {ka ? item.ka : item.en}
                </div>

                <div
                  style={{
                    marginTop: "7px",
                    color: "#2563eb",
                    fontSize: "12px",
                    fontWeight: 800,
                  }}
                >
                  {ka ? "რეგისტრაცია →" : "Register →"}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section
        style={{
          padding: "32px 24px",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            maxWidth: "850px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            gap: "35px",
            flexWrap: "wrap",
            color: "#64748b",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          <span>✓ QR Tag</span>
          <span>✓ Live Chat</span>
          <span>✓ Location Share</span>
          <span>✓ Finder Reward</span>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid #f1f5f9",
          padding: "35px 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: "#2563eb",
            fontWeight: 900,
            fontSize: "20px",
          }}
        >
          QR RETURN
        </div>

        <div
          style={{
            marginTop: "5px",
            color: "#94a3b8",
            fontSize: "10px",
            letterSpacing: "2px",
          }}
        >
          LOST & FOUND
        </div>
      </footer>

      <style>{`
        @media (max-width: 720px) {
          .qr-item-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 500px) {
          header {
            padding-left: 15px !important;
            padding-right: 15px !important;
          }

          .qr-item-grid > a {
            min-height: 190px !important;
          }
        }
      `}</style>
    </main>
  );
}
