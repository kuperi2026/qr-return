"use client";

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
        <div
          style={{
            maxWidth: "640px",
          }}
        >
          <span
            style={{
              fontSize: "9px",
              fontWeight: 900,
              letterSpacing: "1.5px",
              color: "rgba(255,255,255,.72)",
            }}
          >
            QR RETURN · EMERGENCY
          </span>

          <h1
            style={{
              maxWidth: "610px",
              margin: "14px 0 0",
              fontSize: "clamp(35px, 3.5vw, 49px)",
              lineHeight: 1.08,
              letterSpacing: "-1.7px",
              color: "#ffffff",
            }}
          >
            {ka
              ? "გადაუდებელ სიტუაციაში საჭირო ინფორმაცია — ერთი სკანირებით."
              : "Essential information in an emergency — one scan away."}
          </h1>

          <p
            style={{
              maxWidth: "590px",
              margin: "18px 0 0",
              color: "rgba(255,255,255,.82)",
              fontSize: "13px",
              lineHeight: 1.72,
            }}
          >
            {ka
              ? "Emergency პროფილი სწრაფად აჩვენებს თქვენ მიერ წინასწარ შერჩეულ მნიშვნელოვან ინფორმაციას და საგანგებო საკონტაქტო პირებს, რათა დახმარების აღმოჩენა უფრო სწრაფად და ორგანიზებულად მოხდეს."
              : "An Emergency profile provides quick access to the essential information and emergency contacts you have chosen in advance."}
          </p>

          <div
            style={{
              marginTop: "30px",
              minHeight: "205px",
              border: "1px solid rgba(255,255,255,.18)",
              borderRadius: "14px",
              background: "rgba(255,255,255,.1)",
              display: "grid",
              placeItems: "center",
              padding: "24px",
              textAlign: "center",
            }}
          >
            <strong
              style={{
                fontSize: "16px",
              }}
            >
              {ka
                ? "Emergency ნაწილი შემდეგ ეტაპზე აქ ჩაიტვირთება."
                : "The Emergency section will load here next."}
            </strong>
          </div>
        </div>

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
