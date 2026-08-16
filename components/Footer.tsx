export default function Footer() {
  return (
    <footer
      style={{
        background: "#0f172a",
        color: "#ffffff",
        padding: "55px 24px 30px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "40px",
            paddingBottom: "40px",
          }}
        >
          {/* BRAND */}
          <div style={{ maxWidth: "350px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "13px",
                  background: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "900",
                }}
              >
                QR
              </div>

              <div>
                <div
                  style={{
                    fontSize: "19px",
                    fontWeight: "900",
                  }}
                >
                  QR Return
                </div>

                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: "12px",
                  }}
                >
                  Lost & Found
                </div>
              </div>
            </div>

            <p
              style={{
                color: "#94a3b8",
                lineHeight: "1.7",
                marginTop: "20px",
                fontSize: "14px",
              }}
            >
              მარტივი გზა დაკარგული ნივთებისა და საყვარელი ცხოველების
              პატრონთან დასაბრუნებლად.
            </p>
          </div>

          {/* LINKS */}
          <div>
            <div
              style={{
                fontWeight: "800",
                marginBottom: "15px",
              }}
            >
              QR Return
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "11px",
              }}
            >
              <a
                href="#how"
                style={{
                  color: "#94a3b8",
                  textDecoration: "none",
                }}
              >
                როგორ მუშაობს
              </a>

              <a
                href="#items"
                style={{
                  color: "#94a3b8",
                  textDecoration: "none",
                }}
              >
                ნივთები
              </a>

              <a
                href="/register"
                style={{
                  color: "#94a3b8",
                  textDecoration: "none",
                }}
              >
                რეგისტრაცია
              </a>

              <a
                href="/login"
                style={{
                  color: "#94a3b8",
                  textDecoration: "none",
                }}
              >
                შესვლა
              </a>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid #1e293b",
            paddingTop: "25px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "15px",
            color: "#64748b",
            fontSize: "13px",
          }}
        >
          <div>© 2026 QR Return</div>

          <div>Lost & Found QR Platform</div>
        </div>
      </div>
    </footer>
  );
}
