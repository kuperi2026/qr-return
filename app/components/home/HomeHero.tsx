"use client";

import EmergencySection from "./EmergencySection";

export default function HomeHero({
  ka,
}: {
  ka: boolean;
}) {
  return (
    <section
      style={{
        minHeight: "720px",
        color: "#ffffff",
        background:
          "radial-gradient(circle at 79% 48%, rgba(255,255,255,.14), transparent 31%), linear-gradient(135deg, #0750ba 0%, #1266e9 48%, #0748aa 100%)",
      }}
    >
      <div
        style={{
          width: "calc(100% - 80px)",
          maxWidth: "1280px",
          margin: "auto",
          padding: "72px 0 82px",
          display: "grid",
          gridTemplateColumns: "1.03fr .97fr",
          gap: "75px",
          alignItems: "center",
        }}
      >
        <EmergencySection ka={ka} />

        <div
          style={{
            minHeight: "450px",
            display: "grid",
            placeItems: "center",
            textAlign: "center",
          }}
        >
          <div>
            <span
              style={{
                color: "rgba(255,255,255,.65)",
                fontSize: "8px",
                fontWeight: 900,
                letterSpacing: "1.4px",
              }}
            >
              QR RETURN
            </span>

            <h2
              style={{
                margin: "8px 0 0",
                color: "#ffffff",
                fontSize: "18px",
                lineHeight: 1.4,
                maxWidth: "440px",
              }}
            >
              {ka
                ? "ერთი QR სისტემა თქვენი მნიშვნელოვანი ნივთებისა და ცხოველებისთვის."
                : "One QR system for your belongings and pets."}
            </h2>

            <div
              style={{
                width: "260px",
                height: "260px",
                margin: "30px auto 0",
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,.25)",
                display: "grid",
                placeItems: "center",
                background: "rgba(255,255,255,.06)",
              }}
            >
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  background: "#ffffff",
                  color: "#1266e9",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 900,
                  fontSize: "14px",
                }}
              >
                QR RETURN
              </div>
            </div>

            <p
              style={{
                maxWidth: "390px",
                margin: "18px auto 0",
                color: "rgba(255,255,255,.65)",
                fontSize: "9px",
                lineHeight: 1.55,
              }}
            >
              {ka
                ? "პროდუქტების სრული წრე შემდეგ ეტაპზე აქ ჩაიტვირთება."
                : "The full product orbit will load here next."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
