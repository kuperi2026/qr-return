"use client";

const PRODUCTS = [
  {
    type: "dog",
    label: "ძაღლი",
    emoji: "🐶",
    description:
      "შექმენით თქვენი ძაღლის QR პროფილი და დაამატეთ საჭირო ინფორმაცია.",
  },
  {
    type: "cat",
    label: "კატა",
    emoji: "🐱",
    description:
      "დაარეგისტრირეთ კატის QR პროფილი და მართეთ ინფორმაცია ერთ სივრცეში.",
  },
  {
    type: "keys",
    label: "გასაღები",
    emoji: "🔑",
    description:
      "მიაბით QR კოდი თქვენს გასაღებს და გაამარტივეთ მპოვნელთან დაკავშირება.",
  },
  {
    type: "wallet",
    label: "საფულე",
    emoji: "👛",
    description:
      "შექმენით საფულის პროფილი და დაამატეთ აღწერა და საკონტაქტო ინფორმაცია.",
  },
  {
    type: "bag",
    label: "ჩანთა",
    emoji: "👜",
    description:
      "დაარეგისტრირეთ ჩანთა და დაამატეთ ფოტო, აღწერა და განმასხვავებელი ნიშნები.",
  },
  {
    type: "suitcase",
    label: "ჩემოდანი",
    emoji: "🧳",
    description:
      "დაარეგისტრირეთ ჩემოდანი და გაამარტივეთ მისი უსაფრთხოდ დაბრუნება.",
  },
] as const;

export default function RegisterPage() {
  return (
    <>
      <main className="page">
        <div className="backgroundShape shapeOne" />
        <div className="backgroundShape shapeTwo" />

        <header className="header">
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

        <section className="hero">
          <span className="heroBadge">
            PRODUCT REGISTRATION
          </span>

          <h1>
            აირჩიეთ პროდუქტი
          </h1>

          <p>
            ერთი ანგარიშიდან შეგიძლიათ შეუზღუდავად
            დაამატოთ და მართოთ სხვადასხვა QR პროფილი.
            აირჩიეთ სასურველი კატეგორია და დაიწყეთ რეგისტრაცია.
          </p>
        </section>

        <section className="selectionPanel">
          <div className="panelHeader">
            <div>
              <span>
                6 PRODUCTS
              </span>

              <h2>
                რისთვის გსურთ QR პროფილის შექმნა?
              </h2>
            </div>

            <p>
              თითოეული QR კოდი ერთ კატეგორიაზე ფიქსირდება.
              პროფილის მონაცემების შეცვლა მოგვიანებით
              შეგიძლიათ, კატეგორია კი აღარ შეიცვლება.
            </p>
          </div>

          <div className="productsGrid">
            {PRODUCTS.map((product) => (
              <a
                key={product.type}
                href={`/register-item/${product.type}`}
                className="productCard"
              >
                <div className="cardHeader">
                  <div className="icon">
                    {product.emoji}
                  </div>

                  <div className="arrow">
                    →
                  </div>
                </div>

                <span className="productLabel">
                  QR PROFILE
                </span>

                <h3>
                  {product.label}
                </h3>

                <p>
                  {product.description}
                </p>

                <div className="cardFooter">
                  <span>
                    რეგისტრაციის დაწყება
                  </span>

                  <strong>
                    →
                  </strong>
                </div>
              </a>
            ))}
          </div>

          <div className="notice">
            <div className="noticeIcon">
              i
            </div>

            <div>
              <strong>
                ერთი ანგარიში — შეუზღუდავი პროფილები
              </strong>

              <p>
                შეგიძლიათ ერთ ანგარიშზე გქონდეთ რამდენიმე
                ძაღლი, კატა, გასაღები, საფულე, ჩანთა და
                ჩემოდანი.
              </p>
            </div>

            <a href="/my-profiles">
              არსებული პროფილები
            </a>
          </div>
        </section>
      </main>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          padding-bottom: 80px;

          background:
            linear-gradient(
              135deg,
              #0757d8 0%,
              #1266e9 48%,
              #0a4fc6 100%
            );
        }

        .backgroundShape {
          position: absolute;

          border-radius: 999px;

          pointer-events: none;
        }

        .shapeOne {
          width: 560px;
          height: 560px;

          top: -270px;
          right: -170px;

          border:
            90px solid
            rgba(255,255,255,.05);
        }

        .shapeTwo {
          width: 430px;
          height: 430px;

          bottom: -220px;
          left: -180px;

          border:
            70px solid
            rgba(255,255,255,.04);
        }

        .header {
          position: relative;
          z-index: 2;

          width: calc(100% - 64px);
          max-width: 1180px;
          min-height: 84px;

          margin: auto;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;

          border-bottom:
            1px solid rgba(255,255,255,.18);
        }

        .brand {
          display: flex;
          align-items: center;

          gap: 11px;

          text-decoration: none;
        }

        .brandMark {
          width: 46px;
          height: 46px;

          display: grid;
          place-items: center;

          border-radius: 13px;

          background: #ffffff;

          color: #1266e9;

          font-size: 13px;
          font-weight: 950;

          box-shadow:
            0 10px 28px
            rgba(0,0,0,.08);
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
          margin-top: 3px;

          color:
            rgba(255,255,255,.72);

          font-size: 11px;
          font-weight: 750;

          letter-spacing: .9px;
        }

        .profilesButton {
          min-height: 46px;

          padding: 0 18px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border:
            1px solid rgba(255,255,255,.28);

          border-radius: 11px;

          background:
            rgba(255,255,255,.12);

          color: #ffffff;

          font-size: 14px;
          font-weight: 850;

          text-decoration: none;

          backdrop-filter: blur(8px);
        }

        .hero {
          position: relative;
          z-index: 2;

          width: calc(100% - 64px);
          max-width: 1180px;

          margin: auto;

          padding: 56px 0 82px;

          text-align: center;
        }

        .heroBadge {
          display: inline-flex;

          padding: 8px 13px;

          border:
            1px solid rgba(255,255,255,.28);

          border-radius: 999px;

          background:
            rgba(255,255,255,.10);

          color: #ffffff;

          font-size: 12px;
          font-weight: 900;

          letter-spacing: 1px;
        }

        .hero h1 {
          margin: 18px 0 0;

          color: #ffffff;

          font-size: 46px;
          line-height: 1.08;

          letter-spacing: -1.2px;
        }

        .hero p {
          max-width: 720px;

          margin: 16px auto 0;

          color:
            rgba(255,255,255,.84);

          font-size: 16px;
          line-height: 1.7;
        }

        .selectionPanel {
          position: relative;
          z-index: 3;

          width: calc(100% - 64px);
          max-width: 1180px;

          margin: -34px auto 0;

          padding: 32px;

          border:
            1px solid rgba(255,255,255,.9);

          border-radius: 24px;

          background: #ffffff;

          box-shadow:
            0 28px 70px
            rgba(1,37,94,.25);
        }

        .panelHeader {
          padding-bottom: 25px;

          display: flex;
          align-items: flex-end;
          justify-content: space-between;

          gap: 30px;

          border-bottom:
            1px solid #e4ebf3;
        }

        .panelHeader span {
          color: #1266e9;

          font-size: 12px;
          font-weight: 900;

          letter-spacing: 1px;
        }

        .panelHeader h2 {
          margin: 7px 0 0;

          color: #203a55;

          font-size: 28px;
          line-height: 1.25;
        }

        .panelHeader > p {
          max-width: 440px;

          margin: 0;

          color: #708196;

          font-size: 14px;
          line-height: 1.65;
        }

        .productsGrid {
          margin-top: 25px;

          display: grid;

          grid-template-columns:
            repeat(3, minmax(0,1fr));

          gap: 16px;
        }

        .productCard {
          min-height: 300px;

          padding: 23px;

          display: flex;
          flex-direction: column;

          border:
            1px solid #d9e5f3;

          border-radius: 18px;

          background:
            linear-gradient(
              180deg,
              #ffffff,
              #f7faff
            );

          text-decoration: none;

          box-shadow:
            0 8px 24px
            rgba(30,70,120,.04);

          transition:
            .2s ease;
        }

        .productCard:hover {
          transform:
            translateY(-5px);

          border-color:
            #1266e9;

          box-shadow:
            0 18px 38px
            rgba(18,102,233,.13);
        }

        .cardHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .icon {
          width: 62px;
          height: 62px;

          display: grid;
          place-items: center;

          border-radius: 17px;

          background:
            linear-gradient(
              135deg,
              #eaf3ff,
              #dceaff
            );

          font-size: 31px;
        }

        .arrow {
          width: 38px;
          height: 38px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #1266e9;

          color: #ffffff;

          font-size: 19px;
          font-weight: 900;
        }

        .productLabel {
          margin-top: 24px;

          color: #1266e9;

          font-size: 11px;
          font-weight: 900;

          letter-spacing: 1px;
        }

        .productCard h3 {
          margin: 8px 0 0;

          color: #243e59;

          font-size: 23px;
          line-height: 1.2;
        }

        .productCard p {
          margin: 10px 0 0;

          color: #728398;

          font-size: 14px;
          line-height: 1.65;
        }

        .cardFooter {
          margin-top: auto;

          padding-top: 22px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          color: #1266e9;

          font-size: 14px;
          font-weight: 900;
        }

        .cardFooter strong {
          font-size: 19px;
        }

        .notice {
          margin-top: 22px;

          padding: 18px;

          display: grid;

          grid-template-columns:
            auto 1fr auto;

          align-items: center;

          gap: 14px;

          border:
            1px solid #bfd5f2;

          border-radius: 15px;

          background:
            linear-gradient(
              135deg,
              #eef5ff,
              #f8fbff
            );
        }

        .noticeIcon {
          width: 40px;
          height: 40px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #1266e9;

          color: #ffffff;

          font-size: 15px;
          font-weight: 900;
        }

        .notice strong {
          display: block;

          color: #29445f;

          font-size: 15px;
        }

        .notice p {
          margin: 5px 0 0;

          color: #718398;

          font-size: 13px;
          line-height: 1.55;
        }

        .notice > a {
          min-height: 44px;

          padding: 0 17px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 10px;

          background: #1266e9;

          color: #ffffff;

          font-size: 14px;
          font-weight: 850;

          text-decoration: none;

          white-space: nowrap;
        }

        @media (max-width: 900px) {
          .productsGrid {
            grid-template-columns:
              repeat(2,minmax(0,1fr));
          }

          .panelHeader {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 650px) {
          .header,
          .hero,
          .selectionPanel {
            width: calc(100% - 28px);
          }

          .header {
            min-height: 72px;
          }

          .brand span {
            display: none;
          }

          .brand strong {
            font-size: 16px;
          }

          .profilesButton {
            padding: 0 12px;

            font-size: 12px;
          }

          .hero {
            padding:
              42px 0 66px;
          }

          .hero h1 {
            font-size: 34px;
          }

          .hero p {
            font-size: 15px;
          }

          .selectionPanel {
            margin-top: -28px;

            padding: 18px;

            border-radius: 19px;
          }

          .panelHeader h2 {
            font-size: 23px;
          }

          .panelHeader > p {
            font-size: 14px;
          }

          .productsGrid {
            grid-template-columns: 1fr;
          }

          .productCard {
            min-height: 260px;
          }

          .notice {
            grid-template-columns:
              auto 1fr;
          }

          .notice > a {
            grid-column:
              1 / -1;

            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
