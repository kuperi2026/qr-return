"use client";

export default function AboutMenu({ ka }: { ka: boolean }) {
  return (
    <section
      aria-label={ka ? "ჩვენ შესახებ" : "About QR RETURN"}
      style={{
        background: "var(--qr-background)",
        borderBottom: "1px solid var(--qr-border)",
        boxShadow: "0 8px 22px rgba(10, 76, 138, 0.06)",
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
        <span style={{ color: "var(--qr-secondary-ink)", fontSize: "12px", fontWeight: 900 }}>
          QR RETURN
        </span>
        <h2 style={{ margin: "8px 0 12px", color: "var(--qr-primary)", fontSize: "25px" }}>
          {ka ? "ჩვენ შესახებ" : "About QR RETURN"}
        </h2>
        <p style={{ margin: 0, color: "var(--qr-text-secondary)", fontSize: "16px" }}>
          {ka ? "ინფორმაცია მალე დაემატება." : "Information coming soon."}
        </p>
      </div>
    </section>
  );
}
