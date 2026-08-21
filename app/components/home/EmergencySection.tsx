"use client";

function QRIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="15" width="6" height="6" rx="1" />
      <path d="M14 14h3v3h4" />
      <path d="M14 21v-4" />
      <path d="M18 18h3v3" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6 19.7 19.7 0 0 1-3.1-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.4 2.1L8 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 2 2.3Z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default function EmergencySection({
  ka,
}: {
  ka: boolean;
}) {
  return (
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
          display: "grid",
          gridTemplateColumns: "1fr 25px 1fr 25px 1fr",
          alignItems: "stretch",
          gap: "6px",
        }}
      >
        <div style={flowStepStyle}>
          <span style={stepNumberStyle}>01</span>

          <div
            style={{
              height: "65px",
              marginTop: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "29px",
                height: "19px",
                background: "#ffffff",
              }}
            />

            <div
              style={{
                width: "51px",
                height: "51px",
                display: "grid",
                placeItems: "center",
                borderRadius: "10px",
                background: "#ffffff",
                color: "#1266e9",
                boxShadow: "0 6px 14px rgba(0,0,0,.08)",
              }}
            >
              <QRIcon size={28} />
            </div>

            <div
              style={{
                width: "29px",
                height: "19px",
                background: "#ffffff",
              }}
            />
          </div>

          <div>
            <strong style={strongStyle}>
              {ka ? "Emergency სამაჯური" : "Emergency Bracelet"}
            </strong>

            <p style={smallTextStyle}>
              {ka
                ? "QR კოდი ყოველთვის ხელმისაწვდომია სამაჯურზე."
                : "The QR code is available directly on the bracelet."}
            </p>
          </div>
        </div>

        <div style={arrowStyle}>→</div>

        <div style={flowStepStyle}>
          <span style={stepNumberStyle}>02</span>

          <div
            style={{
              width: "55px",
              height: "88px",
              margin: "8px auto 0",
              position: "relative",
              display: "grid",
              placeItems: "center",
              border: "2px solid #ffffff",
              borderRadius: "10px",
              color: "#ffffff",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "2px",
                position: "absolute",
                top: "5px",
                borderRadius: "2px",
                background: "rgba(255,255,255,.7)",
              }}
            />

            <QRIcon size={32} />

            <div
              style={{
                width: "37px",
                height: "1px",
                position: "absolute",
                background: "#9fd1ff",
                boxShadow: "0 0 7px #ffffff",
              }}
            />
          </div>

          <div>
            <strong style={strongStyle}>
              {ka ? "QR-ის სკანირება" : "Scan QR"}
            </strong>

            <p style={smallTextStyle}>
              {ka
                ? "დამხმარე ადამიანი ასკანირებს კოდს ტელეფონით."
                : "A helper scans the QR code using a phone."}
            </p>
          </div>
        </div>

        <div style={arrowStyle}>→</div>

        <div style={flowStepStyle}>
          <span style={stepNumberStyle}>03</span>

          <div
            style={{
              width: "52px",
              height: "52px",
              margin: "12px auto 0",
              display: "grid",
              placeItems: "center",
              borderRadius: "50%",
              color: "#1266e9",
              background: "#ffffff",
            }}
          >
            <PhoneIcon />
          </div>

          <div>
            <strong style={strongStyle}>
              {ka ? "საჭირო მოქმედება" : "Take action"}
            </strong>

            <p style={smallTextStyle}>
              {ka
                ? "პროფილიდან შესაძლებელია საგანგებო საკონტაქტო პირთან დაკავშირება ან საჭიროების შემთხვევაში 112-ზე დარეკვა."
                : "Contact the emergency person or call 911 when emergency services are needed."}
            </p>

            <div
              style={{
                marginTop: "8px",
                display: "inline-flex",
                padding: "5px 10px",
                borderRadius: "7px",
                color: "#1266e9",
                background: "#ffffff",
                fontSize: "11px",
                fontWeight: 900,
              }}
            >
              {ka ? "112" : "911"}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "18px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "rgba(255,255,255,.72)",
          fontSize: "9px",
          lineHeight: 1.5,
        }}
      >
        <ShieldIcon />

        <span>
          {ka
            ? "პროფილში ჩანს მხოლოდ ის ინფორმაცია, რომლის გაზიარებაც მომხმარებელმა წინასწარ აირჩია."
            : "Only information selected by the user is visible in the profile."}
        </span>
      </div>
    </div>
  );
}

const flowStepStyle = {
  minHeight: "205px",
  padding: "16px",
  position: "relative" as const,
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "space-between",
  border: "1px solid rgba(255,255,255,.18)",
  borderRadius: "14px",
  background: "rgba(255,255,255,.1)",
  backdropFilter: "blur(8px)",
};

const stepNumberStyle = {
  color: "rgba(255,255,255,.58)",
  fontSize: "8px",
  fontWeight: 900,
};

const strongStyle = {
  display: "block",
  marginTop: "11px",
  color: "#ffffff",
  fontSize: "11px",
};

const smallTextStyle = {
  margin: "5px 0 0",
  color: "rgba(255,255,255,.7)",
  fontSize: "9px",
  lineHeight: 1.55,
};

const arrowStyle = {
  display: "grid",
  placeItems: "center",
  color: "rgba(255,255,255,.55)",
  fontSize: "17px",
};
