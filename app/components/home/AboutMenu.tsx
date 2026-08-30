"use client";

export default function AboutMenu({
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
            01 · QR RETURN
          </span>

          <h2
            style={{
              margin: "8px 0 0",
              color: "#2F3039",
              fontSize: "25px",
              lineHeight: 1.15,
            }}
          >
            {ka ? "ჩვენ შესახებ" : "About QR RETURN"}
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.25fr .875fr .875fr",
            gap: "13px",
          }}
        >
          <article style={cardStyle}>
            <span style={numberStyle}>01</span>

            <div
              style={{
                marginTop: "14px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "50%",
                  color: "#2F3039",
                  background: "#ffffff",
                  fontSize: "10px",
                  fontWeight: 900,
                }}
              >
                NK
              </div>

              <div>
                <strong
                  style={{
                    display: "block",
                    fontSize: "12px",
                  }}
                >
                  Nino Kuprava
                </strong>

                <span
                  style={{
                    display: "block",
                    marginTop: "2px",
                    fontSize: "9px",
                    opacity: 0.8,
                  }}
                >
                  Founder &amp; CEO
                </span>

                <small
                  style={{
                    display: "block",
                    marginTop: "2px",
                    fontSize: "7px",
                    opacity: 0.65,
                  }}
                >
                  QR RETURN
                </small>
              </div>
            </div>

            <h3 style={headingStyle}>
              {ka ? "დამფუძნებლის სიტყვა" : "Founder’s Message"}
            </h3>

            <p style={paragraphStyle}>
              {ka
                ? "QR RETURN-ის იდეა ერთი მარტივი შეკითხვიდან გაჩნდა: რა ხდება მაშინ, როდესაც ადამიანი კარგავს მისთვის მნიშვნელოვან ნივთს, საყვარელ ცხოველს, ან როდესაც გადაუდებელ სიტუაციაში მის შესახებ აუცილებელი ინფორმაცია ხელმისაწვდომი არ არის?"
                : "QR RETURN began with one simple question: how can we create the right connection when something important is lost or urgent information is needed?"}
            </p>

            <p style={paragraphStyle}>
              {ka
                ? "ხშირად მპოვნელს დახმარება ნამდვილად სურს, მაგრამ არ იცის, ვის დაუკავშირდეს. სწორედ ამ პრობლემაზე ფიქრისას გაჩნდა QR RETURN-ის შექმნის იდეა — საჭირო მომენტში ადამიანებს შორის სწორი კავშირი სწრაფად და უსაფრთხოდ შეიქმნას."
                : "The idea was to create a simple system that connects people quickly and securely when it matters."}
            </p>

            <div
              style={{
                margin: "14px 0",
                padding: "12px",
                borderRadius: "9px",
                border: "1px solid rgba(255,255,255,.18)",
                background: "rgba(255,255,255,.1)",
                fontSize: "11px",
                fontWeight: 700,
                lineHeight: 1.6,
              }}
            >
              {ka
                ? "ზოგჯერ დასაბრუნებლად ან დასახმარებლად მხოლოდ ერთი სწორი კავშირია საჭირო."
                : "Sometimes one right connection is all that is needed."}
            </div>

            <p style={paragraphStyle}>
              {ka
                ? "ჩემთვის განსაკუთრებით მნიშვნელოვანია, რომ მომხმარებელი თავად აკონტროლებდეს საკუთარ ინფორმაციას — რას აჩვენებს, ვის აჩვენებს და რა გზით შეიძლება მასთან დაკავშირება."
                : "Users should remain in control of what information they share and how they can be contacted."}
            </p>
          </article>

          <article style={cardStyle}>
            <span style={numberStyle}>02</span>

            <h3 style={headingStyle}>
              {ka ? "ჩვენი მისია" : "Our Mission"}
            </h3>

            <p style={paragraphStyle}>
              {ka
                ? "ჩვენი მისიაა ერთი QR სკანირებით მპოვნელსა და მფლობელს შორის უსაფრთხო და მარტივი კავშირის შექმნა."
                : "Our mission is to create a simple and secure connection between finder and owner through one QR scan."}
            </p>

            <p style={paragraphStyle}>
              {ka
                ? "მომხმარებელი თავად განსაზღვრავს, რა ინფორმაცია იყოს ხელმისაწვდომი და რა გზით შეძლოს სხვა ადამიანმა მასთან დაკავშირება."
                : "Users decide what information is available and how they can be contacted."}
            </p>

            <strong
              style={{
                display: "block",
                marginTop: "18px",
                fontSize: "10px",
              }}
            >
              {ka
                ? "მარტივი. სწრაფი. უსაფრთხო."
                : "Simple. Fast. Secure."}
            </strong>
          </article>

          <article style={cardStyle}>
            <span style={numberStyle}>03</span>

            <h3 style={headingStyle}>
              {ka ? "ჩვენი ხედვა" : "Our Vision"}
            </h3>

            <p style={paragraphStyle}>
              {ka
                ? "ჩვენი ხედვაა QR RETURN გახდეს უნივერსალური სისტემა ნივთების, ცხოველებისა და Emergency პროფილების დასაცავად."
                : "Our vision is for QR RETURN to become a universal system for belongings, pets and Emergency profiles."}
            </p>

            <p style={paragraphStyle}>
              {ka
                ? "ერთი სისტემა, რომელიც საჭირო მომენტში ერთმანეთთან აკავშირებს ადამიანს, მნიშვნელოვან ინფორმაციასა და სწორ საკონტაქტო პირს."
                : "One system connecting people, essential information and the right contact at the right moment."}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

const cardStyle = {
  padding: "23px",
  borderRadius: "16px",
  background: "#2F3039",
  color: "#ffffff",
  boxShadow: "0 12px 25px rgba(23,25,35,.14)",
};

const numberStyle = {
  fontSize: "9px",
  fontWeight: 900,
  color: "rgba(255,255,255,.7)",
};

const headingStyle = {
  margin: "17px 0 0",
  color: "#ffffff",
  fontSize: "16px",
};

const paragraphStyle = {
  margin: "9px 0 0",
  color: "rgba(255,255,255,.88)",
  fontSize: "11px",
  lineHeight: 1.67,
};
