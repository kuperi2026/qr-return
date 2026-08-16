import { items } from "@/data/items";

export default function Items() {
  return (
    <section
      id="items"
      style={{
        background: "#f8fafc",
        padding: "80px 24px 100px",
      }}
    >
      <div
        style={{
          maxWidth: "950px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "42px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(30px, 5vw, 44px)",
              fontWeight: "900",
              color: "#111827",
              letterSpacing: "-1px",
            }}
          >
            რის რეგისტრაციას გსურს?
          </h2>

          <p
            style={{
              margin: "12px 0 0",
              color: "#64748b",
              fontSize: "16px",
            }}
          >
            აირჩიე ცხოველი ან ნივთი
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "18px",
          }}
        >
          {items.map((item) => (
            <a
              key={item.id}
              href={`/register?type=${item.id}`}
              style={{
                textDecoration: "none",
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "24px",
                minHeight: "170px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 25px rgba(15,23,42,0.05)",
              }}
            >
              <div
                style={{
                  fontSize: "48px",
                  lineHeight: 1,
                }}
              >
                {item.icon}
              </div>

              <div
                style={{
                  marginTop: "16px",
                  fontSize: "18px",
                  fontWeight: "800",
                  color: "#111827",
                }}
              >
                {item.nameKa}
              </div>
            </a>
          ))}
        </div>

        <style>{`
          @media (max-width: 700px) {
            #items > div > div:last-of-type {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
