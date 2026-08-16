"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const items = [
  { id: "dog", icon: "🐕", nameKa: "ძაღლი", nameEn: "Dog", no: "01" },
  { id: "cat", icon: "🐈", nameKa: "კატა", nameEn: "Cat", no: "02" },
  { id: "keys", icon: "🔑", nameKa: "გასაღები", nameEn: "Keys", no: "03" },
  { id: "wallet", icon: "👛", nameKa: "საფულე", nameEn: "Wallet", no: "04" },
  {
    id: "suitcase",
    icon: "🧳",
    nameKa: "ჩემოდანი",
    nameEn: "Suitcase",
    no: "05",
  },
  { id: "bag", icon: "🎒", nameKa: "ჩანთა", nameEn: "Bag", no: "06" },
];

export default function HomePage() {
  const router = useRouter();
  const [lang, setLang] = useState<"ka" | "en">("ka");

  const ka = lang === "ka";

  const goToRegistration = (type: string) => {
    router.push(`/register/details?type=${type}`);
  };

  return (
    <main
      style={{
        margin: 0,
        minHeight: "100vh",
        background: "#ffffff",
        color: "#0a1020",
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
      }}
    >
      {/* HEADER */}
      <header
        style={{
          width: "100%",
          boxSizing: "border-box",
          borderBottom: "1px solid #eef2f7",
          background: "rgba(255,255,255,.96)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            minHeight: "88px",
            padding: "0 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
          }}
        >
          {/* LOGO */}
          <div
            onClick={() => router.push("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "15px",
                background:
                  "linear-gradient(145deg,#0877ff 0%,#164fc8 100%)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 950,
                fontSize: "21px",
                boxShadow: "0 9px 24px rgba(20,82,205,.25)",
              }}
            >
              QR
            </div>

            <div>
              <div
                style={{
                  color: "#1261d8",
                  fontWeight: 950,
                  fontSize: "25px",
                  letterSpacing: "-0.7px",
                  lineHeight: 1,
                }}
              >
                QR RETURN
              </div>

              <div
                style={{
                  marginTop: "7px",
                  color: "#677386",
                  fontSize: "10px",
                  fontWeight: 800,
                  letterSpacing: "2.4px",
                }}
              >
                SMART LOST & FOUND
              </div>
            </div>
          </div>

          {/* NAVIGATION */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={() => router.push("/login")}
              style={navButton}
            >
              {ka ? "შესვლა" : "Sign in"}
            </button>

            <button
              onClick={() => router.push("/register")}
              style={{
                ...navButton,
                background: "#0b1220",
                color: "#ffffff",
                borderColor: "#0b1220",
              }}
            >
              {ka ? "რეგისტრაცია" : "Register"}
            </button>

            <button
              onClick={() => setLang(ka ? "en" : "ka")}
              style={{
                ...navButton,
                minWidth: "72px",
                color: "#1261d8",
              }}
            >
              {ka ? "EN" : "ქარ"}
            </button>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section
        style={{
          overflow: "hidden",
          position: "relative",
          background:
            "radial-gradient(circle at 82% 35%, rgba(33,118,255,.11), transparent 30%), linear-gradient(180deg,#ffffff 0%,#f7faff 100%)",
        }}
      >
        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            padding: "100px 28px 110px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(330px,1fr))",
            gap: "70px",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                color: "#1261d8",
                fontSize: "13px",
                fontWeight: 950,
                letterSpacing: "3px",
                marginBottom: "22px",
              }}
            >
              QR RETURN
            </div>

            <h1
              style={{
                margin: 0,
                maxWidth: "720px",
                fontSize: "clamp(44px,6vw,78px)",
                lineHeight: "1.03",
                letterSpacing: "-3px",
                fontWeight: 950,
              }}
            >
              {ka ? (
                <>
                  დაკარგვა არ ნიშნავს
                  <br />
                  <span style={{ color: "#1261d8" }}>
                    დამშვიდობებას.
                  </span>
                </>
              ) : (
                <>
                  Lost doesn&apos;t mean
                  <br />
                  <span style={{ color: "#1261d8" }}>
                    gone forever.
                  </span>
                </>
              )}
            </h1>

            <p
              style={{
                maxWidth: "610px",
                margin: "28px 0 0",
                fontSize: "18px",
                lineHeight: 1.75,
                color: "#657083",
              }}
            >
              {ka
                ? "მიაბი QR ტეგი სასურველ ცხოველს ან ნივთს. მპოვნელს ერთი სკანირებით შეუძლია დაგიკავშირდეს და დაგეხმაროს მის დაბრუნებაში."
                : "Attach a QR tag to your pet or personal item. A finder can scan it once, contact you and help return what matters to you."}
            </p>

            <div
              style={{
                marginTop: "36px",
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() =>
                  document
                    .getElementById("choose-item")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                style={primaryButton}
              >
                {ka ? "QR ტეგის მიბმა" : "Activate QR Tag"} →
              </button>

              <button
                onClick={() => router.push("/login")}
                style={secondaryButton}
              >
                {ka ? "შესვლა" : "Sign in"}
              </button>
            </div>
          </div>

          {/* VISUAL MOCKUP - NO EXTRA TEXT */}
          <div
            style={{
              minHeight: "460px",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "490px",
                aspectRatio: "1 / 1",
                borderRadius: "46px",
                background:
                  "linear-gradient(145deg,#eef6ff,#ffffff 60%)",
                border: "1px solid #e2ebf8",
                boxShadow: "0 40px 100px rgba(35,80,150,.14)",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "13px",
                padding: "20px",
                boxSizing: "border-box",
                transform: "rotate(2deg)",
              }}
            >
              {["🐕", "🐈", "🧳", "🔑"].map((icon, index) => (
                <div
                  key={index}
                  style={{
                    borderRadius: "28px",
                    background:
                      index === 0
                        ? "linear-gradient(145deg,#dfeeff,#f7fbff)"
                        : index === 1
                        ? "linear-gradient(145deg,#f3f0ff,#ffffff)"
                        : index === 2
                        ? "linear-gradient(145deg,#eaf7f3,#ffffff)"
                        : "linear-gradient(145deg,#fff4df,#ffffff)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    fontSize: "68px",
                    boxShadow: "inset 0 0 0 1px rgba(20,40,80,.03)",
                  }}
                >
                  {icon}

                  <div
                    style={{
                      position: "absolute",
                      right: "18px",
                      bottom: "18px",
                      width: "42px",
                      height: "42px",
                      background: "#ffffff",
                      borderRadius: "12px",
                      boxShadow: "0 8px 20px rgba(15,30,60,.12)",
                      display: "grid",
                      gridTemplateColumns: "repeat(3,1fr)",
                      gap: "3px",
                      padding: "8px",
                      boxSizing: "border-box",
                    }}
                  >
                    {Array.from({ length: 9 }).map((_, i) => (
                      <span
                        key={i}
                        style={{
                          background:
                            i === 1 || i === 4 || i === 7
                              ? "#1261d8"
                              : "#111827",
                          borderRadius: "1px",
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ITEM SELECTION */}
      <section
        id="choose-item"
        style={{
          background:
            "radial-gradient(circle at 20% 20%,#153d79 0%,transparent 35%), linear-gradient(135deg,#07111f,#0a1a30 55%,#07101d)",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            padding: "95px 28px 110px",
          }}
        >
          <div
            style={{
              color: "#60a5fa",
              fontWeight: 900,
              letterSpacing: "3px",
              fontSize: "12px",
              marginBottom: "18px",
            }}
          >
            QR PROTECTION
          </div>

          <h2
            style={{
              margin: 0,
              maxWidth: "900px",
              fontSize: "clamp(36px,5vw,62px)",
              lineHeight: 1.08,
              letterSpacing: "-2px",
              fontWeight: 950,
            }}
          >
            {ka
              ? "მიაბი QR ტეგი სასურველ ცხოველს ან ნივთს და დაიბრუნე მარტივად."
              : "Connect a QR tag to your pet or item and make returning it simple."}
          </h2>

          <p
            style={{
              marginTop: "22px",
              color: "#9fb0c8",
              fontSize: "17px",
            }}
          >
            {ka
              ? "აირჩიე ქვემოთ, რის რეგისტრაციას აკეთებ."
              : "Choose what you want to register."}
          </p>

          <div
            style={{
              marginTop: "50px",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(280px,1fr))",
              gap: "16px",
            }}
          >
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => goToRegistration(item.id)}
                style={{
                  minHeight: "260px",
                  padding: "25px",
                  borderRadius: "27px",
                  border: "1px solid rgba(125,170,230,.24)",
                  background:
                    "linear-gradient(145deg,rgba(25,66,118,.78),rgba(11,29,55,.76))",
                  color: "#ffffff",
                  cursor: "pointer",
                  position: "relative",
                  textAlign: "left",
                  boxShadow: "0 20px 50px rgba(0,0,0,.13)",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "23px",
                    left: "24px",
                    color: "#b9c9dd",
                    fontWeight: 900,
                    fontSize: "12px",
                  }}
                >
                  {item.no}
                </span>

                <span
                  style={{
                    position: "absolute",
                    top: "21px",
                    right: "24px",
                    color: "#7dd3fc",
                    fontSize: "21px",
                  }}
                >
                  ↗
                </span>

                <div
                  style={{
                    height: "100%",
                    minHeight: "205px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: "96px",
                      height: "96px",
                      borderRadius: "26px",
                      background:
                        "linear-gradient(145deg,rgba(25,125,225,.38),rgba(255,255,255,.05))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "50px",
                      boxShadow: "0 15px 40px rgba(0,0,0,.15)",
                    }}
                  >
                    {item.icon}
                  </div>

                  <div
                    style={{
                      marginTop: "22px",
                      fontWeight: 900,
                      fontSize: "18px",
                    }}
                  >
                    {ka ? item.nameKa : item.nameEn}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SIMPLE QR FLOW */}
      <section
        style={{
          background: "#ffffff",
        }}
      >
        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            padding: "100px 28px",
          }}
        >
          <div
            style={{
              maxWidth: "720px",
            }}
          >
            <div
              style={{
                color: "#1261d8",
                fontWeight: 900,
                letterSpacing: "2.5px",
                fontSize: "12px",
              }}
            >
              QR RETURN
            </div>

            <h2
              style={{
                margin: "16px 0 0",
                fontSize: "clamp(35px,5vw,55px)",
                lineHeight: 1.08,
                letterSpacing: "-2px",
                fontWeight: 950,
              }}
            >
              {ka
                ? "ერთი სკანირება. პირდაპირ შენამდე."
                : "One scan. A direct way back to you."}
            </h2>
          </div>

          <div
            style={{
              marginTop: "52px",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(210px,1fr))",
              gap: "16px",
            }}
          >
            {[
              {
                icon: "🏷️",
                ka: "მიაბი",
                en: "Attach",
                kaText: "მიაბი QR ტეგი ცხოველს ან ნივთს.",
                enText: "Attach your QR tag to a pet or item.",
              },
              {
                icon: "📱",
                ka: "სკანირება",
                en: "Scan",
                kaText: "მპოვნელი ასკანერებს QR კოდს.",
                enText: "The finder scans the QR code.",
              },
              {
                icon: "💬",
                ka: "კონტაქტი",
                en: "Contact",
                kaText: "ირჩევს შენთან დაკავშირების მეთოდს.",
                enText: "They choose how to contact you.",
              },
              {
                icon: "❤️",
                ka: "დაბრუნება",
                en: "Return",
                kaText: "ნივთი ან ცხოველი ბრუნდება პატრონთან.",
                enText: "Your pet or item finds its way home.",
              },
            ].map((step) => (
              <div
                key={step.en}
                style={{
                  padding: "30px",
                  borderRadius: "24px",
                  background: "#f8fafc",
                  border: "1px solid #e8edf4",
                }}
              >
                <div style={{ fontSize: "32px" }}>{step.icon}</div>

                <div
                  style={{
                    marginTop: "20px",
                    fontSize: "19px",
                    fontWeight: 900,
                  }}
                >
                  {ka ? step.ka : step.en}
                </div>

                <p
                  style={{
                    margin: "10px 0 0",
                    color: "#6b7280",
                    lineHeight: 1.6,
                    fontSize: "14px",
                  }}
                >
                  {ka ? step.kaText : step.enText}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "0 28px 90px",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            maxWidth: "1184px",
            margin: "0 auto",
            padding: "65px 50px",
            boxSizing: "border-box",
            borderRadius: "34px",
            background:
              "linear-gradient(135deg,#0d6efd,#1148bd)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "30px",
            flexWrap: "wrap",
            boxShadow: "0 30px 70px rgba(18,91,210,.22)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "clamp(30px,4vw,45px)",
                fontWeight: 950,
                letterSpacing: "-1.5px",
              }}
            >
              {ka ? "გაქვს QR ტეგი?" : "Already have a QR tag?"}
            </div>

            <div
              style={{
                marginTop: "10px",
                color: "rgba(255,255,255,.78)",
              }}
            >
              {ka
                ? "აირჩიე ცხოველი ან ნივთი და გაააქტიურე."
                : "Choose your pet or item and activate it."}
            </div>
          </div>

          <button
            onClick={() =>
              document
                .getElementById("choose-item")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            style={{
              border: 0,
              borderRadius: "14px",
              background: "#ffffff",
              color: "#1157cc",
              padding: "16px 25px",
              fontWeight: 900,
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            {ka ? "რეგისტრაცია" : "Register"} →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid #e9edf3",
          background: "#fafbfc",
        }}
      >
        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            padding: "50px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "30px",
          }}
        >
          <div>
            <div
              style={{
                color: "#1261d8",
                fontWeight: 950,
                fontSize: "22px",
              }}
            >
              QR RETURN
            </div>

            <div
              style={{
                marginTop: "6px",
                color: "#7b8493",
                fontSize: "12px",
                letterSpacing: "1.5px",
              }}
            >
              SMART LOST & FOUND
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "24px",
              flexWrap: "wrap",
              fontSize: "14px",
              fontWeight: 700,
              color: "#4b5563",
            }}
          >
            <span style={{ cursor: "pointer" }}>
              {ka ? "ჩვენ შესახებ" : "About"}
            </span>

            <span style={{ cursor: "pointer" }}>
              {ka ? "კონტაქტი" : "Contact"}
            </span>

            <span style={{ cursor: "pointer" }}>
              {ka ? "კონფიდენციალურობა" : "Privacy"}
            </span>

            <span style={{ cursor: "pointer" }}>
              {ka ? "წესები" : "Terms"}
            </span>
          </div>

          <div
            style={{
              color: "#9ca3af",
              fontSize: "13px",
            }}
          >
            © 2026 QR Return
          </div>
        </div>
      </footer>
    </main>
  );
}

const navButton = {
  border: "1px solid #e3e8ef",
  background: "#ffffff",
  color: "#182033",
  borderRadius: "12px",
  padding: "11px 16px",
  fontWeight: 800,
  cursor: "pointer",
  fontSize: "14px",
};

const primaryButton = {
  border: "none",
  background: "#1261d8",
  color: "#ffffff",
  borderRadius: "14px",
  padding: "16px 24px",
  fontWeight: 900,
  fontSize: "15px",
  cursor: "pointer",
  boxShadow: "0 12px 30px rgba(18,97,216,.23)",
};

const secondaryButton = {
  border: "1px solid #dfe5ed",
  background: "#ffffff",
  color: "#172033",
  borderRadius: "14px",
  padding: "16px 24px",
  fontWeight: 900,
  fontSize: "15px",
  cursor: "pointer",
};
