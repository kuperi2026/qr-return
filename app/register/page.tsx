"use client";

const PRODUCTS = [
  {
    type: "dog",
    label: "ძაღლი",
    emoji: "🐶",
    description:
      "QR პროფილი თქვენი ძაღლის უსაფრთხო დაბრუნებისთვის.",
  },
  {
    type: "cat",
    label: "კატა",
    emoji: "🐱",
    description:
      "შექმენით კატის პროფილი და დაამატეთ საჭირო ინფორმაცია.",
  },
  {
    type: "keys",
    label: "გასაღები",
    emoji: "🔑",
    description:
      "მიაბით QR კოდი გასაღებს და გაამარტივეთ დაბრუნება.",
  },
  {
    type: "wallet",
    label: "საფულე",
    emoji: "👛",
    description:
      "საფულის QR პროფილი სწრაფი დაკავშირებისთვის.",
  },
  {
    type: "bag",
    label: "ჩანთა",
    emoji: "👜",
    description:
      "დაარეგისტრირეთ ჩანთა და მისი განმასხვავებელი ინფორმაცია.",
  },
  {
    type: "suitcase",
    label: "ჩემოდანი",
    emoji: "🧳",
    description:
      "QR პროფილი თქვენი სამგზავრო ჩემოდნისთვის.",
  },
] as const;

export default function RegisterPage() {
  return (
    <>
      <main className="page">
        <header className="topbar">
          <a href="/" className="brand">
            <div className="brandMark">QR</div>

            <div>
              <strong>QR RETURN</strong>
              <span>SMART LOST &amp; FOUND</span>
            </div>
          </a>

          <a href="/my-profiles" className="profilesButton">
            ჩემი პროფილები
          </a>
        </header>

        <section className="mainCard">
          <div className="intro">
            <span className="eyebrow">
              PRODUCT REGISTRATION
            </span>

            <h1>აირჩიეთ პროდუქტი</h1>

            <p>
              ერთი ანგარიშიდან შეგიძლიათ შეუზღუდავად
              დაამატოთ და მართოთ ყველა თქვენი QR პროფილი.
            </p>
          </div>

          <div className="selectionLayout">
            {/* EMERGENCY — LEFT */}

            <a
              href="/register/emergency-bracelet"
              className="emergencyCard"
            >
              <div className="emergencyTop">
                <div className="emergencyIcon">
                  <span className="medicalCross">+</span>
                </div>

                <div className="emergencyArrow">→</div>
              </div>

              <div className="emergencyContent">
                <span className="emergencyEyebrow">
                  EMERGENCY
                </span>

                <h2>
                  Emergency
                  <br />
                  Bracelet
                </h2>

                <p>
                  მნიშვნელოვანი ინფორმაციის სწრაფი წვდომა
                  გადაუდებელ სიტუაციაში.
                </p>

                <div className="featureList">
                  <div>
                    <span className="check">✓</span>
                    სამედიცინო ინფორმაცია
                  </div>

                  <div>
                    <span className="check">✓</span>
                    Emergency Contact
                  </div>

                  <div>
                    <span className="check">✓</span>
                    სწრაფი QR წვდომა
                  </div>
                </div>
              </div>

              <span className="emergencyStart">
                რეგისტრაციის დაწყება
              </span>
            </a>

            {/* SIX EXISTING PRODUCTS — RIGHT */}

            <div className="productsGrid">
              {PRODUCTS.map((product) => (
                <a
                  key={product.type}
                  href={`/register-item/${product.type}`}
                  className="productCard"
                >
                  <div className="productTop">
                    <div className="productIcon">
                      {product.emoji}
                    </div>

                    <div className="arrow">→</div>
                  </div>

                  <h2>{product.label}</h2>

                  <p>{product.description}</p>

                  <span className="start">
                    რეგისტრაციის დაწყება
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="bottomInfo">
            <div className="infoIcon">i</div>

            <div>
              <strong>
                ერთი ანგარიში — შეუზღუდავი პროფილები
              </strong>

              <p>
                Lost &amp; Found პროდუქტები და Emergency
                Bracelet ერთი ანგარიშიდან იმართება.
                თითოეული QR კოდი საკუთარ პროფილზე ფიქსირდება.
              </p>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          height: 100vh;
          overflow: hidden;
          padding: 0 28px 24px;
          background: #0747c9;
        }

        /* HEADER */

        .topbar {
          width: 100%;
          max-width: 1180px;
          height: 72px;
          margin: 0 auto;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .brandMark {
          width: 42px;
          height: 42px;

          display: grid;
          place-items: center;

          border-radius: 11px;
          background: #ffffff;
          color: #0747c9;

          font-size: 13px;
          font-weight: 950;
        }

        .brand strong,
        .brand span {
          display: block;
        }

        .brand strong {
          color: #ffffff;
          font-size: 18px;
          font-weight: 950;
        }

        .brand span {
          margin-top: 2px;

          color: rgba(255, 255, 255, 0.74);

          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.8px;
        }

        .profilesButton {
          min-height: 42px;
          padding: 0 17px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border: 1px solid rgba(255, 255, 255, 0.35);
          border-radius: 10px;

          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;

          font-size: 14px;
          font-weight: 850;
          text-decoration: none;
        }

        /* MAIN WHITE CARD */

        .mainCard {
          width: 100%;
          max-width: 1180px;

          height: calc(100vh - 96px);
          margin: 0 auto;

          padding: 20px 24px 18px;

          display: flex;
          flex-direction: column;

          border-radius: 22px;
          background: #ffffff;

          box-shadow: 0 24px 60px rgba(0, 25, 78, 0.26);
        }

        .intro {
          flex: 0 0 auto;
          text-align: center;
        }

        .eyebrow {
          color: #0747c9;

          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .intro h1 {
          margin: 4px 0 0;

          color: #17324f;

          font-size: 29px;
          line-height: 1.1;
        }

        .intro p {
          max-width: 680px;
          margin: 6px auto 0;

          color: #667b92;

          font-size: 13px;
          line-height: 1.45;
        }

        /* TWO SIDES */

        .selectionLayout {
          flex: 1;
          min-height: 0;

          margin-top: 15px;

          display: grid;

          grid-template-columns:
            minmax(235px, 0.72fr)
            minmax(0, 2fr);

          gap: 13px;
        }

        /* EMERGENCY */

        .emergencyCard {
          min-height: 0;
          padding: 18px;

          display: flex;
          flex-direction: column;

          position: relative;
          overflow: hidden;

          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 16px;

          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(255, 255, 255, 0.13),
              transparent 34%
            ),
            #0b52d6;

          color: #ffffff;
          text-decoration: none;

          box-shadow: 0 10px 22px rgba(7, 71, 201, 0.14);

          transition:
            transform 0.18s ease,
            background 0.18s ease,
            box-shadow 0.18s ease;
        }

        .emergencyCard:hover {
          transform: translateY(-3px);
          background: #063fae;

          box-shadow: 0 16px 28px rgba(7, 71, 201, 0.22);
        }

        .emergencyTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .emergencyIcon {
          width: 52px;
          height: 52px;

          display: grid;
          place-items: center;

          border-radius: 13px;

          background: #ffffff;
        }

        .medicalCross {
          color: #0747c9;

          font-size: 30px;
          font-weight: 500;
          line-height: 1;
        }

        .emergencyArrow {
          width: 34px;
          height: 34px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          border: 1px solid rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.14);

          color: #ffffff;

          font-size: 17px;
          font-weight: 900;
        }

        .emergencyContent {
          margin-top: 22px;
        }

        .emergencyEyebrow {
          color: rgba(255, 255, 255, 0.7);

          font-size: 9px;
          font-weight: 900;

          letter-spacing: 1.4px;
        }

        .emergencyCard h2 {
          margin: 6px 0 0;

          color: #ffffff;

          font-size: 27px;
          line-height: 1.02;

          letter-spacing: -0.5px;
        }

        .emergencyCard p {
          margin: 10px 0 0;

          max-width: 250px;

          color: rgba(255, 255, 255, 0.82);

          font-size: 12px;
          line-height: 1.45;
        }

        .featureList {
          margin-top: 17px;

          display: grid;
          gap: 8px;
        }

        .featureList div {
          display: flex;
          align-items: center;
          gap: 7px;

          color: rgba(255, 255, 255, 0.9);

          font-size: 11px;
          font-weight: 700;
        }

        .check {
          width: 19px;
          height: 19px;

          flex: 0 0 19px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: rgba(255, 255, 255, 0.14);
          border: 1px solid rgba(255, 255, 255, 0.25);

          color: #ffffff;

          font-size: 9px;
          font-weight: 900;
        }

        .emergencyStart {
          margin-top: auto;
          padding-top: 12px;

          color: #ffffff;

          font-size: 12px;
          font-weight: 850;
        }

        /* SIX PRODUCT GRID */

        .productsGrid {
          min-width: 0;
          min-height: 0;

          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          grid-template-rows:
            repeat(2, minmax(0, 1fr));

          gap: 11px;
        }

        .productCard {
          min-width: 0;
          min-height: 0;

          padding: 14px 15px;

          display: flex;
          flex-direction: column;

          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 14px;

          background: #0b52d6;

          color: #ffffff;
          text-decoration: none;

          box-shadow: 0 8px 18px rgba(7, 71, 201, 0.12);

          transition:
            transform 0.18s ease,
            background 0.18s ease,
            box-shadow 0.18s ease;
        }

        .productCard:hover {
          transform: translateY(-3px);

          background: #063fae;

          box-shadow: 0 13px 24px rgba(7, 71, 201, 0.2);
        }

        .productTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .productIcon {
          width: 41px;
          height: 41px;

          display: grid;
          place-items: center;

          border-radius: 11px;

          background: #ffffff;

          font-size: 21px;
        }

        .arrow {
          width: 28px;
          height: 28px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: rgba(255, 255, 255, 0.14);

          border: 1px solid rgba(255, 255, 255, 0.3);

          color: #ffffff;

          font-size: 14px;
          font-weight: 900;
        }

        .productCard h2 {
          margin: 10px 0 0;

          color: #ffffff;

          font-size: 17px;
          line-height: 1.15;
        }

        .productCard p {
          margin: 5px 0 0;

          color: rgba(255, 255, 255, 0.82);

          font-size: 10px;
          line-height: 1.4;
        }

        .start {
          margin-top: auto;
          padding-top: 7px;

          color: #ffffff;

          font-size: 10px;
          font-weight: 850;
        }

        /* INFO */

        .bottomInfo {
          flex: 0 0 auto;

          margin-top: 12px;

          min-height: 56px;

          padding: 9px 13px;

          display: flex;
          align-items: center;

          gap: 10px;

          border: 1px solid #cbdcf4;
          border-radius: 13px;

          background: #f2f6fc;
        }

        .infoIcon {
          width: 31px;
          height: 31px;

          flex: 0 0 31px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #0747c9;

          color: #ffffff;

          font-size: 12px;
          font-weight: 900;
        }

        .bottomInfo strong {
          display: block;

          color: #29445f;

          font-size: 12px;
        }

        .bottomInfo p {
          margin: 2px 0 0;

          color: #6b7e92;

          font-size: 10px;
          line-height: 1.35;
        }

        /* TABLET */

        @media (max-width: 900px) {
          .page {
            height: auto;
            min-height: 100vh;

            overflow: auto;
          }

          .mainCard {
            height: auto;
          }

          .selectionLayout {
            grid-template-columns: 1fr;
          }

          .emergencyCard {
            min-height: 270px;
          }

          .productsGrid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));

            grid-template-rows: auto;
          }

          .productCard {
            min-height: 190px;
          }
        }

        /* MOBILE */

        @media (max-width: 600px) {
          .page {
            padding: 0 14px 18px;
          }

          .topbar {
            height: 66px;
          }

          .brand span {
            display: none;
          }

          .brand strong {
            font-size: 16px;
          }

          .profilesButton {
            padding: 0 11px;
            font-size: 12px;
          }

          .mainCard {
            padding: 19px 14px;
            border-radius: 17px;
          }

          .intro h1 {
            font-size: 27px;
          }

          .intro p {
            font-size: 13px;
          }

          .emergencyCard {
            min-height: 300px;
          }

          .productsGrid {
            grid-template-columns: 1fr;
          }

          .productCard {
            min-height: 175px;
          }
        }
      `}</style>
    </>
  );
}
