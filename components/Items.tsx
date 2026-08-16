const items = [
  { icon: "🐶", name: "ძაღლი", description: "QR ტეგი საყელოსთვის" },
  { icon: "🐱", name: "კატა", description: "QR ტეგი საყელოსთვის" },
  { icon: "🔑", name: "გასაღები", description: "პატარა QR ტეგი გასაღებისთვის" },
  { icon: "👛", name: "საფულე", description: "QR ბარათი საფულისთვის" },
  { icon: "🧳", name: "ჩემოდანი", description: "QR ტეგი მოგზაურობისთვის" },
  { icon: "🎒", name: "ჩანთა", description: "QR ტეგი ყოველდღიური ჩანთისთვის" },
];

export default function Items() {
  return (
    <section
      id="items"
      style={{
        background: "#ffffff",
        padding: "80px 24px",
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
            maxWidth: "700px",
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(32px, 5vw, 48px)",
              margin: "0",
              color: "#111827",
              fontWeight: "900",
            }}
          >
            ერთი QR — ბევრი შესაძლებლობა
          </h2>

          <p
            style={{
              marginTop: "16px",
              fontSize: "18px",
              lineHeight: "1.7",
              color: "#6b7280",
            }}
          >
            აირჩიე ნივთი ან ცხოველი, რომლის QR კოდის რეგისტრაციაც გინდა.
          </p>
        </div>

        <div
          style={{
            marginTop: "45px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "18px",
          }}
        >
          {items.map((item) => (
            <a
              key={item.name}
              href={`/register?type=${encodeURIComponent(item.name)}`}
              style={{
                textDecoration: "none",
                color: "#111827",
                border: "1px solid #e5e7eb",
                borderRadius: "24px",
                padding: "28px 20px",
                background: "#f9fafb",
                textAlign: "center",
                minHeight: "190px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontSize: "52px",
                }}
              >
                {item.icon}
              </div>

              <div
                style={{
                  marginTop: "15px",
                  fontSize: "18px",
                  fontWeight: "800",
                }}
              >
                {item.name}
              </div>

              <div
                style={{
                  marginTop: "8px",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  color: "#6b7280",
                }}
              >
                {item.description}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
