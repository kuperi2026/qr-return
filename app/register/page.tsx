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
            <div className="brandMark">
              QR
            </div>

            <div>
              <strong>
                QR RETURN
              </strong>

              <span>
                SMART LOST &amp; FOUND
              </span>
            </div>
          </a>

          <a
            href="/my-profiles"
            className="profilesButton"
          >
            ჩემი პროფილები
          </a>
        </header>

        <section className="mainCard">
          <div className="intro">
            <span className="eyebrow">
              PRODUCT REGISTRATION
            </span>

            <h1>
              აირჩიეთ პროდუქტი
            </h1>

            <p>
              ერთი ანგარიშიდან შეგიძლიათ შეუზღუდავად
              დაამატოთ და მართოთ სხვადასხვა QR პროფილი.
            </p>
          </div>

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

                  <div className="arrow">
                    →
                  </div>
                </div>

                <h2>
                  {product.label}
                </h2>

                <p>
                  {product.description}
                </p>

                <span className="start">
                  რეგისტრაციის დაწყება
                </span>
              </a>
            ))}
          </div>

          <div className="bottomInfo">
            <div className="infoIcon">
              i
            </div>

            <div>
              <strong>
                ერთი ანგარიში — შეუზღუდავი პროფილები
              </strong>

              <p>
                თითოეული QR კოდი ერთ კატეგორიაზე ფიქსირდება.
                მონაცემების შეცვლა მოგვიანებით შეგიძლიათ,
                კატეგორია კი აღარ შეიცვლება.
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

        .topbar {
          width: 100%;
          max-width: 1180px;

          height: 72px;

          margin: 0 auto;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border-bottom:
            1px solid rgba(255,255,255,.2);
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

          color:
            rgba(255,255,255,.74);

          font-size: 11px;
          font-weight: 700;

          letter-spacing: .8px;
        }

        .profilesButton {
          min-height: 42px;

          padding: 0 17px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border:
            1px solid rgba(255,255,255,.35);

          border-radius: 10px;

          background:
            rgba(255,255,255,.10);

          color: #ffffff;

          font-size: 14px;
          font-weight: 850;

          text-decoration: none;
        }

        .mainCard {
          width: 100%;
          max-width: 1180px;

          height:
            calc(100vh - 96px);

          margin: 0 auto;

          padding: 24px 28px 22px;

          display: flex;
          flex-direction: column;

          border-radius: 22px;

          background: #ffffff;

          box-shadow:
            0 24px 60px
            rgba(0, 25, 78, .26);
        }

        .intro {
          text-align: center;
        }

        .eyebrow {
          color: #0747c9;

          font-size: 12px;
          font-weight: 900;

          letter-spacing: 1px;
        }

        .intro h1 {
          margin: 5px 0 0;

          color: #17324f;

          font-size: 32px;
          line-height: 1.1;
        }

        .intro p {
          max-width: 680px;

          margin: 8px auto 0;

          color: #667b92;

          font-size: 15px;
          line-height: 1.5;
        }

        .productsGrid {
          flex: 1;

          min-height: 0;

          margin-top: 18px;

          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          grid-template-rows:
            repeat(2, minmax(0, 1fr));

          gap: 13px;
        }

        .productCard {
          min-height: 0;

          padding: 17px 18px;

          display: flex;
          flex-direction: column;

          border:
            1px solid rgba(255,255,255,.18);

          border-radius: 16px;

          background: #0b52d6;

          color: #ffffff;

          text-decoration: none;

          box-shadow:
            0 10px 22px
            rgba(7,71,201,.14);

          transition:
            transform .18s ease,
            background .18s ease,
            box-shadow .18s ease;
        }

        .productCard:hover {
          transform: translateY(-3px);

          background: #063fae;

          box-shadow:
            0 16px 28px
            rgba(7,71,201,.22);
        }

        .productTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .productIcon {
          width: 48px;
          height: 48px;

          display: grid;
          place-items: center;

          border-radius: 13px;

          background: #ffffff;

          font-size: 25px;
        }

        .arrow {
          width: 34px;
          height: 34px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background:
            rgba(255,255,255,.14);

          border:
            1px solid rgba(255,255,255,.3);

          color: #ffffff;

          font-size: 17px;
          font-weight: 900;
        }

        .productCard h2 {
          margin: 14px 0 0;

          color: #ffffff;

          font-size: 21px;
          line-height: 1.15;
        }

        .productCard p {
          margin: 7px 0 0;

          color:
            rgba(255,255,255,.82);

          font-size: 13px;
          line-height: 1.45;
        }

        .start {
          margin-top: auto;

          padding-top: 10px;

          color: #ffffff;

          font-size: 13px;
          font-weight: 850;
        }

        .bottomInfo {
          margin-top: 14px;

          min-height: 62px;

          padding: 11px 14px;

          display: flex;
          align-items: center;

          gap: 11px;

          border:
            1px solid #cbdcf4;

          border-radius: 13px;

          background: #f2f6fc;
        }

        .infoIcon {
          width: 34px;
          height: 34px;

          flex: 0 0 34px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #0747c9;

          color: #ffffff;

          font-size: 13px;
          font-weight: 900;
        }

        .bottomInfo strong {
          display: block;

          color: #29445f;

          font-size: 14px;
        }

        .bottomInfo p {
          margin: 3px 0 0;

          color: #6b7e92;

          font-size: 12px;
          line-height: 1.4;
        }

        @media (max-width: 900px) {
          .page {
            height: auto;
            min-height: 100vh;

            overflow: auto;
          }

          .mainCard {
            height: auto;
          }

          .productsGrid {
            grid-template-columns:
              repeat(2, minmax(0,1fr));

            grid-template-rows: auto;
          }

          .productCard {
            min-height: 210px;
          }
        }

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
            padding: 20px 15px;

            border-radius: 17px;
          }

          .intro h1 {
            font-size: 27px;
          }

          .intro p {
            font-size: 14px;
          }

          .productsGrid {
            grid-template-columns: 1fr;
          }

          .productCard {
            min-height: 190px;
          }
        }
      `}</style>
    </>
  );
}
