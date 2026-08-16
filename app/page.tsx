const items = [
  {
    id: "dog",
    name: "ძაღლი",
    icon: "🐶",
  },
  {
    id: "cat",
    name: "კატა",
    icon: "🐱",
  },
  {
    id: "keys",
    name: "გასაღები",
    icon: "🔑",
  },
  {
    id: "wallet",
    name: "საფულე",
    icon: "👛",
  },
  {
    id: "suitcase",
    name: "ჩემოდანი",
    icon: "🧳",
  },
  {
    id: "bag",
    name: "ჩანთა",
    icon: "🎒",
  },
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
      {/* COMPANY */}
      <header
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "32px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <a
          href="/"
          style={{
            textDecoration: "none",
          }}
        >
          <div
            style={{
              color: "#2563eb",
              fontSize: "32px",
              fontWeight: "900",
              letterSpacing: "-1.5px",
            }}
          >
            QR RETURN
          </div>

          <div
            style={{
              marginTop: "3px",
              color: "#94a3b8",
              fontSize: "10px",
              fontWeight: "800",
              letterSpacing: "3px",
            }}
          >
            LOST & FOUND
          </div>
        </a>

        <a
          href="/login"
          style={{
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: "800",
            fontSize: "15px",
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
          padding: "90px 24px 55px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: "#2563eb",
            fontSize: "18px",
            fontWeight: "900",
            letterSpacing: "4px",
          }}
        >
          QR RETURN
        </div>

        <h1
          style={{
            margin: "20px 0 0",
            fontSize: "clamp(45px, 7vw, 76px)",
            lineHeight: "1.06",
            letterSpacing: "-3px",
            fontWeight: "900",
          }}
        >
          დაკარგვა არ ნიშნავს
          <br />
          დამშვიდობებას.
        </h1>

        <p
          style={{
            margin: "22px auto 0",
            maxWidth: "600px",
            color: "#64748b",
            fontSize: "18px",
            lineHeight: "1.7",
          }}
        >
          მიაბი QR ტეგი სასურველ ცხოველს ან ნივთს და დაიბრუნე მარტივად.
        </p>
      </section>

      {/* DIRECT REGISTRATION */}
      <section
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "25px 24px 110px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            margin: "0 0 38px",
            fontSize: "28px",
            fontWeight: "900",
          }}
        >
          რის რეგისტრაციას გსურს?
        </h2>

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
              href={`/register/details?type=${item.id}`}
              style={{
                position: "relative",
                minHeight: "185px",
                background:
                  "linear-gradient(145deg, #ffffff 0%, #f5f8ff 100%)",
                border: "1px solid #e5eaf2",
                borderRadius: "26px",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 14px 40px rgba(37,99,235,0.07)",
                color: "#0f172a",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "18px",
                  right: "18px",
                  width: "35px",
                  height: "35px",
                  borderRadius: "9px",
                  background: "#2563eb",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "9px",
                  fontWeight: "900",
                }}
              >
                QR
              </div>

              <div
                style={{
                  fontSize: "62px",
                  lineHeight: 1,
                }}
              >
                {item.icon}
              </div>

              <div
                style={{
                  marginTop: "18px",
                  fontSize: "18px",
                  fontWeight: "900",
                }}
              >
                {item.name}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        style={{
          background: "#f7f9fc",
          padding: "90px 24px 110px",
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
              margin: "0 0 45px",
              textAlign: "center",
              fontSize: "40px",
              fontWeight: "900",
            }}
          >
            როგორ მუშაობს?
          </h2>

          <div
            className="steps-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "18px",
            }}
          >
            {[
              ["01", "მიაბი", "QR ტეგი მიაბი ცხოველს ან ნივთს."],
              ["02", "დაასკანერებენ", "მპოვნელი QR კოდს ტელეფონით დაასკანერებს."],
              ["03", "დაიბრუნე", "მპოვნელი დაგიკავშირდება."],
            ].map(([number, title, text]) => (
              <div
                key={number}
                style={{
                  background: "#ffffff",
                  borderRadius: "22px",
                  padding: "30px",
                  border: "1px solid #e8edf5",
                }}
              >
                <div
                  style={{
                    color: "#2563eb",
                    fontSize: "14px",
                    fontWeight: "900",
                  }}
                >
                  {number}
                </div>

                <h3
                  style={{
                    margin: "18px 0 8px",
                    fontSize: "21px",
                  }}
                >
                  {title}
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: "#64748b",
                    lineHeight: "1.6",
                    fontSize: "14px",
                  }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 700px) {
          .item-grid {
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
