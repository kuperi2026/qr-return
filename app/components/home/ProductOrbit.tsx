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

function Product({
  emoji,
  name,
  position,
}: {
  emoji: string;
  name: string;
  position: React.CSSProperties;
}) {
  return (
    <div
      style={{
        width: "82px",
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...position,
      }}
    >
      <div
        style={{
          width: "62px",
          height: "62px",
          display: "grid",
          placeItems: "center",
          borderRadius: "50%",
          background: "#ffffff",
          fontSize: "28px",
          boxShadow: "0 9px 23px rgba(0,0,0,.12)",
        }}
      >
        {emoji}
      </div>

      <span
        style={{
          marginTop: "7px",
          color: "rgba(255,255,255,.9)",
          fontSize: "9px",
          fontWeight: 800,
        }}
      >
        {name}
      </span>
    </div>
  );
}

export default function ProductOrbit({
  ka,
}: {
  ka: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: "440px",
          textAlign: "center",
        }}
      >
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
          }}
        >
          {ka
            ? "ერთი QR სისტემა თქვენი მნიშვნელოვანი ნივთებისა და ცხოველებისთვის."
            : "One QR system for your belongings and pets."}
        </h2>
      </div>

      <div
        style={{
          width: "450px",
          height: "450px",
          marginTop: "18px",
          position: "relative",
          borderRadius: "50%",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "42px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,.19)",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: "98px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,.1)",
          }}
        />

        <div
          style={{
            width: "138px",
            height: "138px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            background: "#ffffff",
            color: "#1266e9",
            boxShadow: "0 17px 40px rgba(0,0,0,.14)",
          }}
        >
          <QRIcon size={48} />

          <strong
            style={{
              marginTop: "7px",
              color: "#223a55",
              fontSize: "10px",
            }}
          >
            QR RETURN
          </strong>

          <span
            style={{
              marginTop: "3px",
              color: "#8593a4",
              fontSize: "6px",
              fontWeight: 900,
              letterSpacing: "1px",
            }}
          >
            {ka ? "დაასკანერე" : "SCAN"}
          </span>
        </div>

        <Product
          emoji="🐶"
          name={ka ? "ძაღლი" : "Dog"}
          position={{
            top: 0,
            left: "112px",
          }}
        />

        <Product
          emoji="🐱"
          name={ka ? "კატა" : "Cat"}
          position={{
            top: 0,
            right: "112px",
          }}
        />

        <Product
          emoji="👛"
          name={ka ? "საფულე" : "Wallet"}
          position={{
            top: "170px",
            right: 0,
          }}
        />

        <Product
          emoji="🧳"
          name={ka ? "ჩემოდანი" : "Suitcase"}
          position={{
            right: "80px",
            bottom: "2px",
          }}
        />

        <Product
          emoji="👜"
          name={ka ? "ჩანთა" : "Bag"}
          position={{
            left: "80px",
            bottom: "2px",
          }}
        />

        <Product
          emoji="🔑"
          name={ka ? "გასაღები" : "Keys"}
          position={{
            top: "170px",
            left: 0,
          }}
        />
      </div>

      <p
        style={{
          maxWidth: "390px",
          margin: "8px 0 0",
          textAlign: "center",
          color: "rgba(255,255,255,.65)",
          fontSize: "9px",
          lineHeight: 1.55,
        }}
      >
        {ka
          ? "ერთი სკანირება მპოვნელს აძლევს თქვენ მიერ არჩეულ ინფორმაციასა და დაკავშირების გზას."
          : "One scan gives the finder access to the information and contact options you selected."}
      </p>
    </div>
  );
}
