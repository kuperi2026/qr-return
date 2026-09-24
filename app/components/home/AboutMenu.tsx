"use client";

export default function AboutMenu({ ka }: { ka: boolean }) {
  return (
    <section
      aria-label={ka ? "ჩვენ შესახებ" : "About QR RETURN"}
      style={{
        background: "#f7faff",
        borderBottom: "1px solid #dfe7f1",
        boxShadow: "0 20px 45px rgba(10, 48, 100, 0.1)",
      }}
    >
      <div
        style={{
          width: "calc(100% - 32px)",
          maxWidth: "1240px",
          margin: "auto",
          padding: "38px 0 45px",
        }}
      >
        <span style={{ color: "#1266e9", fontSize: "12px", fontWeight: 900 }}>
          QR RETURN
        </span>
        <h2 style={{ margin: "8px 0 12px", color: "#1c324d", fontSize: "25px" }}>
          {ka ? "ჩვენ შესახებ" : "About QR RETURN"}
        </h2>
        <p style={{ margin: 0, color: "#60758a", fontSize: "16px" }}>
          {ka ? "ინფორმაცია მალე დაემატება." : "Information coming soon."}
        </p>
      </div>
    </section>
  );
}
