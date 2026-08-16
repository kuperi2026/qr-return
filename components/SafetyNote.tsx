export default function SafetyNote() {
  return (
    <section
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "30px 24px 70px",
      }}
    >
      <div
        style={{
          background: "#eff6ff",
          border: "1px solid #dbeafe",
          borderRadius: "24px",
          padding: "28px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div
          style={{
            width: "54px",
            height: "54px",
            minWidth: "54px",
            borderRadius: "16px",
            background: "#2563eb",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "25px",
          }}
        >
          🔒
        </div>

        <div>
          <h3
            style={{
              margin: 0,
              color: "#111827",
              fontSize: "20px",
              fontWeight: "900",
            }}
          >
            შენი ინფორმაცია — შენი არჩევანია
          </h3>

          <p
            style={{
              margin: "7px 0 0",
              color: "#64748b",
              lineHeight: "1.6",
              fontSize: "15px",
            }}
          >
            თავად ირჩევ, რა საკონტაქტო ინფორმაცია გამოჩნდეს QR კოდის
            დასკანერებისას.
          </p>
        </div>
      </div>
    </section>
  );
}
