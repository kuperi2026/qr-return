const items = [
  { id: "dog", name: "ძაღლი", icon: "🐶" },
  { id: "cat", name: "კატა", icon: "🐱" },
  { id: "keys", name: "გასაღები", icon: "🔑" },
  { id: "wallet", name: "საფულე", icon: "👛" },
  { id: "suitcase", name: "ჩემოდანი", icon: "🧳" },
  { id: "bag", name: "ჩანთა", icon: "🎒" },
];

export default function HomePage() {
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
          padding: "30px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <a
          href="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "13px",
              background: "#2563eb",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "15px",
              fontWeight: "900",
            }}
          >
            QR
          </div>

          <div>
            <div
              style={{
                color: "#2563eb",
                fontSize: "31px",
                lineHeight: 1,
                fontWeight: "900",
                letterSpacing: "-1.5px",
              }}
            >
              QR RETURN
            </div>

            <div
              style={{
                color: "#64748b",
                fontSize: "10px",
                fontWeight: "800",
                letterSpacing: "3px",
                marginTop: "5px",
              }}
            >
              LOST & FOUND
            </div>
          </div>
        </a>

        <a
          href="/login"
          style={{
            textDecoration: "none",
            color: "#2563eb",
            fontSize: "15px",
            fontWeight: "800",
            border: "1px solid #dbeafe",
            padding: "11px 19px",
            borderRadius: "12px",
          }}
        >
          შესვლა
        </a>
      </header>

      {/* HERO */}
      <section
        style={{
          maxWidth: "950px",
          margin: "0 auto",
          padding: "95px 24px 70px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: "#2563eb",
            fontWeight: "900",
            fontSize: "20px",
            letterSpacing: "4px",
          }}
        >
          QR RETURN
        </div>

        <h1
          style={{
            margin: "20px 0 0",
            fontSize: "clamp(46px, 7vw, 78px)",
            lineHeight: "1.05",
            fontWeight: "900",
            letterSpacing: "-3px",
            color: "#0f172a",
          }}
        >
          დაკარგვა არ ნიშნავს
          <br />
          დამშვიდობებას.
        </h1>

        <p
          style={{
            margin: "24px auto 0",
            maxWidth: "590px",
            color: "#64748b",
            fontSize: "18px",
            lineHeight: "1.7",
          }}
        >
          ერთი QR კოდი ეხმარება მპოვნელს სწრაფად დაგიკავშირდეს.
        </p>
      </section>

      {/* ITEMS */}
      <section
        style={{
          background: "#f8faff",
          padding: "75px 24px 110px",
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
              maxWidth: "780px",
              margin: "0 auto 48px",
              textAlign: "center",
              color: "#0f172a",
              fontSize: "clamp(30px, 4vw, 44px)",
              lineHeight: "1.2",
              fontWeight: "900",
              letterSpacing: "-1.5px",
            }}
          >
            მიაბი QR ტეგი სასურველ ცხოველს ან ნივთს და დაიბრუნე მარტივად.
          </h2>

          <div
            className="item-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
            }}
          >
            {items.map((item) => (
              <a
                key={item.id}
                href={`/register/details?type=${item.id}`}
                style={{
                  position: "relative",
                  minHeight: "210px",
                  textDecoration: "none",
                  background: "#ffffff",
                  border: "1px solid #e5eaf2",
                  borderRadius: "28px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0f172a",
                  boxShadow: "0 15px 45px rgba(37,99,235,0.07)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "18px",
                    right: "18px",
                    width: "37px",
                    height: "37px",
                    borderRadius: "10px",
                    background: "#2563eb",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    fontWeight: "900",
                  }}
                >
                  QR
                </div>

                <div
                  style={{
                    fontSize: "70px",
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
                  {item.name}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SIMPLE FOOTER */}
      <footer
        style={{
          background: "#ffffff",
          padding: "38px 24px",
          textAlign: "center",
          borderTop: "1px solid #f1f5f9",
        }}
      >
        <div
          style={{
            color: "#2563eb",
            fontSize: "19px",
            fontWeight: "900",
            letterSpacing: "-0.5px",
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
      `}</style>
    </main>
  );
}
