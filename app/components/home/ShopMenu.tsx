"use client";

export default function ShopMenu({
  ka,
}: {
  ka: boolean;
}) {
  return (
    <section
      style={{
        background: "#F3F3F5",
        borderBottom: "1px solid #DFDFE2",
        boxShadow: "0 20px 45px rgba(23, 25, 35, 0.1)",
      }}
    >
      <div
        style={{
          width: "calc(100% - 80px)",
          maxWidth: "1240px",
          margin: "auto",
          padding: "38px 0 45px",
        }}
      >
        <div
          style={{
            maxWidth: "620px",
            marginBottom: "23px",
          }}
        >
          <span
            style={{
              color: "#2F3039",
              fontSize: "9px",
              fontWeight: 900,
              letterSpacing: "1px",
            }}
          >
            02 · {ka ? "ონლაინ შეძენა" : "ONLINE SHOP"}
          </span>

          <h2
            style={{
              margin: "8px 0 0",
              color: "#2F3039",
              fontSize: "25px",
              lineHeight: 1.15,
            }}
          >
            {ka
              ? "აირჩიეთ QR RETURN თქვენი საჭიროებისთვის."
              : "Choose QR RETURN for your needs."}
          </h2>
        </div>

        <div
          style={{
            maxWidth: "900px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px",
          }}
        >
          <a
            href="#how-to-order"
            style={cardStyle}
          >
            <span style={numberStyle}>01</span>

            <h3 style={headingStyle}>
              {ka ? "როგორ შევუკვეთო" : "How to order"}
            </h3>

            <p style={paragraphStyle}>
              {ka
                ? "აირჩიეთ თქვენთვის საჭირო QR პროდუქტი, შეიძინეთ ონლაინ და მიღების შემდეგ დაარეგისტრირეთ თქვენს ანგარიშზე."
                : "Choose your QR product, purchase it online and register it to your account after delivery."}
            </p>

            <strong style={linkStyle}>
              {ka ? "გაიგეთ მეტი" : "Learn more"} →
            </strong>
          </a>

          <a
            href="/store"
            style={cardStyle}
          >
            <span style={numberStyle}>02</span>

            <h3 style={headingStyle}>
              {ka ? "მაღაზია" : "Store"}
            </h3>

            <p style={paragraphStyle}>
              {ka
                ? "იხილეთ QR RETURN-ის პროდუქტები ნივთებისთვის, ცხოველებისა და Emergency გამოყენებისთვის."
                : "Explore QR RETURN products for belongings, pets and Emergency use."}
            </p>

            <strong style={linkStyle}>
              {ka ? "პროდუქტების ნახვა" : "View products"} →
            </strong>
          </a>
        </div>
      </div>
    </section>
  );
}

const cardStyle = {
  minHeight: "205px",
  padding: "24px",
  border: "1px solid #DFDFE2",
  borderRadius: "15px",
  background: "#ffffff",
  color: "inherit",
  textDecoration: "none",
};

const numberStyle = {
  color: "#2F3039",
  fontSize: "10px",
  fontWeight: 900,
};

const headingStyle = {
  margin: "17px 0 0",
  color: "#2F3039",
  fontSize: "17px",
};

const paragraphStyle = {
  margin: "9px 0 0",
  color: "#63636C",
  fontSize: "12px",
  lineHeight: 1.68,
};

const linkStyle = {
  display: "block",
  marginTop: "19px",
  color: "#2F3039",
  fontSize: "11px",
};
