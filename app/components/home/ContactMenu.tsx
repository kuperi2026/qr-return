"use client";

export default function ContactMenu({
  ka,
}: {
  ka: boolean;
}) {
  return (
    <section
      style={{
        background: "#f5faff",
        borderBottom: "1px solid #d4e3ee",
        boxShadow: "0 8px 22px rgba(10, 76, 138, 0.06)",
      }}
    >
      <div
        style={{
          width: "calc(100% - 80px)",
          maxWidth: "1240px",
          margin: "auto",
          padding: "38px 0 45px",
          display: "grid",
          gridTemplateColumns: ".7fr 1.3fr",
          gap: "55px",
        }}
      >
        <div
          style={{
            maxWidth: "620px",
          }}
        >
          <span
            style={{
              color: "#0876bb",
              fontSize: "9px",
              fontWeight: 900,
              letterSpacing: "1px",
            }}
          >
            04 · QR RETURN SUPPORT
          </span>

          <h2
            style={{
              margin: "8px 0 0",
              color: "#173b5c",
              fontSize: "25px",
              lineHeight: 1.15,
            }}
          >
            {ka ? "როგორ დაგეხმაროთ?" : "How can we help?"}
          </h2>

          <p
            style={{
              margin: "8px 0 0",
              color: "#526b80",
              fontSize: "12px",
              lineHeight: 1.6,
            }}
          >
            {ka
              ? "დაგვიკავშირდით ანგარიშის, QR პროფილის, შეკვეთის ან პროდუქტის შესახებ. აირჩიეთ დახმარების ტიპი."
              : "Contact us about your account, QR profile, order or product."}
          </p>
        </div>

        <div
          style={{
            maxWidth: "900px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px",
          }}
        >
          <a href="/support" style={cardStyle}>
            <span style={numberStyle}>LIVE CHAT</span>

            <h3 style={headingStyle}>
              {ka ? "მოგვწერეთ პირდაპირ" : "Chat with us"}
            </h3>

            <p style={paragraphStyle}>
              {ka
                ? "გახსენით QR RETURN-ის მხარდაჭერის Live Chat და მოგვწერეთ თქვენი საკითხის შესახებ."
                : "Open QR RETURN Support Live Chat."}
            </p>

            <strong style={linkStyle}>
              {ka ? "Live Chat-ის გახსნა" : "Open Live Chat"} →
            </strong>
          </a>

          <div style={cardStyle}>
            <span style={numberStyle}>
              {ka ? "ტელეფონი" : "PHONE"}
            </span>

            <h3 style={headingStyle}>
              QR RETURN Support
            </h3>

            <p style={paragraphStyle}>
              {ka
                ? "QR RETURN-ის მხარდაჭერის საკონტაქტო ტელეფონის ნომერი აქ განთავსდება."
                : "QR RETURN support phone number will appear here."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const cardStyle = {
  minHeight: "205px",
  padding: "24px",
  border: "1px solid #d4e3ee",
  borderRadius: "15px",
  background: "#ffffff",
  color: "inherit",
  textDecoration: "none",
};

const numberStyle = {
  color: "#0876bb",
  fontSize: "10px",
  fontWeight: 900,
};

const headingStyle = {
  margin: "17px 0 0",
  color: "#173b5c",
  fontSize: "17px",
};

const paragraphStyle = {
  margin: "9px 0 0",
  color: "#526b80",
  fontSize: "12px",
  lineHeight: 1.68,
};

const linkStyle = {
  display: "block",
  marginTop: "19px",
  color: "#0876bb",
  fontSize: "11px",
};
