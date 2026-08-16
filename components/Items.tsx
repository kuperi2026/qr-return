import { items } from "@/data/items";

export default function Items() {
  return (
    <section
      id="items"
      style={{
        background: "#ffffff",
        padding: "90px 24px",
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
            textAlign: "center",
            maxWidth: "760px",
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(34px, 5vw, 52px)",
              margin: 0,
              color: "#111827",
              fontWeight: "900",
              letterSpacing: "-1px",
            }}
          >
            ერთი QR — ბევრი შესაძლებლობა
          </h2>

          <p
            style={{
              marginTop: "18px",
              fontSize: "18px",
              lineHeight: "1.7",
              color: "#6b7280",
            }}
          >
            QR კოდი შეგიძლია გამოიყენო როგორც ცხოველისთვის, ასევე ყოველდღიური
            ნივთებისთვის.
          </p>
        </div>

        <div
          style={{
            marginTop: "55px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {items.map((item) => (
            <a
              key={item.id}
              href={`/register?type=${item.id}`}
              style={{
                textDecoration: "none",
                color: "#111827",
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "30px",
                minHeight: "310px",
                padding: "30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 16px 40px rgba(15, 23, 42, 0.07)",
                transition: "0.25s ease",
              }}
            >
              <div
                style={{
                  borderRadius: "24px",
                  background: "#f8fafc",
                  padding: "30px 20px",
                  minHeight: "150px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "20px",
                }}
              >
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
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "54px",
                      height: "54px",
                      borderRadius: "14px",
                      background: "#111827",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "900",
                      fontSize: "15px",
                    }}
                  >
                    QR
                  </div>

                  <div
                    style={{
                      fontSize: "44px",
                    }}
                  >
                    📱
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: "26px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    fontWeight: "900",
                  }}
                >
                  {item.nameKa}
                </h3>

                <p
                  style={{
                    marginTop: "9px",
                    marginBottom: 0,
                    fontSize: "15px",
                    lineHeight: "1.6",
                    color: "#6b7280",
                  }}
                >
                  QR ტეგის სკანირება ტელეფონით
                </p>
              </div>

              <div
                style={{
                  marginTop: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  color: "#2563eb",
                  fontWeight: "800",
                  fontSize: "14px",
                }}
              >
                <span>QR-ის რეგისტრაცია</span>
                <span style={{ fontSize: "20px" }}>→</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
