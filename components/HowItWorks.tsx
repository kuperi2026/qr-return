const steps = [
  {
    number: "01",
    icon: "🏷️",
    title: "დაარეგისტრირე QR",
    text: "შექმენი ანგარიში და მიაბი QR კოდი შენს ნივთს ან საყვარელ ცხოველს.",
  },
  {
    number: "02",
    icon: "📱",
    title: "მპოვნელი ასკანერებს",
    text: "მპოვნელს აპლიკაცია არ სჭირდება — საკმარისია QR კოდის ერთხელ დასკანერება.",
  },
  {
    number: "03",
    icon: "💬",
    title: "დაგიკავშირდება",
    text: "მპოვნელს შეუძლია დაგიკავშირდეს და სურვილის შემთხვევაში გაგიზიაროს თავისი ლოკაცია.",
  },
  {
    number: "04",
    icon: "❤️",
    title: "დაიბრუნე",
    text: "დაუკავშირდი მპოვნელს და დაიბრუნე შენი ნივთი ან საყვარელი ცხოველი.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how"
      style={{
        background: "#f8fafc",
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
            maxWidth: "680px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              color: "#2563eb",
              fontWeight: "800",
              fontSize: "14px",
              marginBottom: "12px",
            }}
          >
            მარტივი და სწრაფი
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: "clamp(34px, 5vw, 48px)",
              fontWeight: "900",
              color: "#111827",
            }}
          >
            როგორ მუშაობს?
          </h2>

          <p
            style={{
              marginTop: "16px",
              color: "#6b7280",
              fontSize: "18px",
              lineHeight: "1.7",
            }}
          >
            ოთხი მარტივი ნაბიჯი დაკარგული ნივთის ან ცხოველის
            პატრონთან დასაბრუნებლად.
          </p>
        </div>

        <div
          style={{
            marginTop: "50px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "18px",
          }}
        >
          {steps.map((step) => (
            <div
              key={step.number}
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "26px",
                padding: "28px",
                minHeight: "260px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "55px",
                    height: "55px",
                    borderRadius: "17px",
                    background: "#eff6ff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "27px",
                  }}
                >
                  {step.icon}
                </div>

                <div
                  style={{
                    color: "#cbd5e1",
                    fontSize: "14px",
                    fontWeight: "900",
                  }}
                >
                  {step.number}
                </div>
              </div>

              <h3
                style={{
                  marginTop: "26px",
                  marginBottom: "10px",
                  fontSize: "20px",
                  color: "#111827",
                }}
              >
                {step.title}
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#6b7280",
                  lineHeight: "1.7",
                  fontSize: "15px",
                }}
              >
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
