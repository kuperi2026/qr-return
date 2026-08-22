"use client";

const PRODUCTS = [
  {
    type: "dog",
    label: "ძაღლი",
    emoji: "🐶",
    description:
      "შექმენით თქვენი ძაღლის QR პროფილი და დაამატეთ მნიშვნელოვანი ინფორმაცია.",
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
      "შექმენით საფულის პროფილი საკონტაქტო და განმასხვავებელი ინფორმაციით.",
  },
  {
    type: "bag",
    label: "ჩანთა",
    emoji: "👜",
    description:
      "დაამატეთ ჩანთის ფოტო, აღწერა და საჭირო ინფორმაცია მპოვნელისთვის.",
  },
  {
    type: "suitcase",
    label: "ჩემოდანი",
    emoji: "🧳",
    description:
      "დაარეგისტრირეთ სამგზავრო ჩემოდანი და გაამარტივეთ მისი დაბრუნება.",
  },
] as const;

export default function RegisterPage() {
  return (
    <>
      <main className="page">
        <header className="header">
          <a href="/" className="brand">
            <div className="brandMark">
              QR
            </div>

            <div className="brandText">
              <strong>
                QR RETURN
              </strong>

              <span>
                SMART LOST &amp; FOUND
              </span>
            </div>
          </a>

          <div className="headerActions">
            <a
              href="/my-profiles"
              className="profilesButton"
            >
              ჩემი პროფილები
            </a>
          </div>
        </header>

        <section className="hero">
          <div className="heroBadge">
            PRODUCT REGISTRATION
          </div>

          <h1>
            რომელი პროფილის დამატება გსურთ?
          </h1>

          <p>
            ერთი QR RETURN ანგარიშიდან შეგიძლიათ
            შეუზღუდავად დაამატოთ და მართოთ სხვადასხვა
            ნივთისა და ცხოველის პროფილი.
          </p>

          <div className="accountNote">
            <span>✓</span>

            <p>
              თუ ანგარიში უკვე გაქვთ, ახალი ანგარიშის
              შექმნა აღარ გჭირდებათ — უბრალოდ აირჩიეთ
              ახალი პროდუქტი.
            </p>
          </div>
        </section>

        <section className="productsSection">
          <div className="sectionTop">
            <div>
              <span>
                6 CATEGORIES
              </span>

              <h2>
                აირჩიეთ პროდუქტი
              </h2>
            </div>

            <p>
              თითოეული QR კოდი ერთ კატეგორიაზე
              ფიქსირდება. კატეგორია შექმნის შემდეგ
              აღარ შეიცვლება.
            </p>
          </div>

          <div className="productsGrid">
            {PRODUCTS.map((product) => (
              <a
                key={product.type}
                href={`/register-item/${product.type}`}
                className="productCard"
              >
                <div className="cardTop">
                  <div className="productIcon">
                    {product.emoji}
                  </div>

                  <div className="arrow">
                    →
                  </div>
                </div>

                <div className="productType">
                  QR PROFILE
                </div>

                <h3>
                  {product.label}
                </h3>

                <p>
                  {product.description}
                </p>

                <div className="registerLink">
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
        </section>

        <section className="bottomCard">
          <div className="bottomIcon">
            +
          </div>

          <div className="bottomText">
            <span>
              ONE ACCOUNT
            </span>

            <h2>
              შეუზღუდავი პროფილების დამატება
            </h2>

            <p>
              შეგიძლიათ გქონდეთ რამდენიმე ძაღლი,
              კატა, გასაღები, საფულე, ჩანთა ან
              ჩემოდანი ერთ ანგარიშზე.
            </p>
          </div>

          <a href="/my-profiles">
            არსებული პროფილების ნახვა
          </a>
        </section>
      </main>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          padding-bottom: 80px;

          background:
            linear-gradient(
              180deg,
              #0f5fd7 0px,
              #1266e9 360px,
              #f4f8fd 360px,
              #f4f8fd 100%
            );
        }

        .header {
          width: calc(100% - 64px);
          max-width: 1180px;
          min-height: 82px;

          margin: 0 auto;

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
          width: 44px;
          height: 44px;

          display: grid;
          place-items: center;

          border-radius: 12px;

          background: #ffffff;

          color: #1266e9;

          font-size: 13px;
          font-weight: 900;
        }

        .brandText strong,
        .brandText span {
          display: block;
        }

        .brandText strong {
          color: #ffffff;

          font-size: 18px;
          font-weight: 900;
        }

        .brandText span {
          margin-top: 3px;

          color:
            rgba(255,255,255,.72);

          font-size: 11px;
          font-weight: 700;

          letter-spacing: .8px;
        }

        .profilesButton {
          min-height: 44px;

          padding: 0 18px;

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
          font-weight: 800;

          text-decoration: none;
        }

        .hero {
          width: calc(100% - 64px);
          max-width: 1180px;

          margin: 0 auto;

          padding: 55px 0 72px;

          color: #ffffff;
        }

        .heroBadge {
          display: inline-flex;

          padding: 8px 12px;

          border:
            1px solid rgba(255,255,255,.25);

          border-radius: 999px;

          background:
            rgba(255,255,255,.10);

          font-size: 12px;
          font-weight: 800;

          letter-spacing: .8px;
        }

        .hero h1 {
          max-width: 760px;

          margin: 18px 0 0;

          font-size: 44px;
          line-height: 1.08;

          letter-spacing: -1px;
        }

        .hero > p {
          max-width: 680px;

          margin: 18px 0 0;

          color:
            rgba(255,255,255,.82);

          font-size: 16px;
          line-height: 1.7;
        }

        .accountNote {
          max-width: 650px;

          margin-top: 22px;

          padding: 14px 16px;

          display: flex;
          align-items: flex-start;

          gap: 10px;

          border:
            1px solid rgba(255,255,255,.22);

          border-radius: 12px;

          background:
            rgba(255,255,255,.10);
        }

        .accountNote span {
          width: 24px;
          height: 24px;

          flex: 0 0 24px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #ffffff;

          color: #1266e9;

          font-size: 13px;
          font-weight: 900;
        }

        .accountNote p {
          margin: 1px 0 0;

          color:
            rgba(255,255,255,.9);

          font-size: 14px;
          line-height: 1.55;
        }

        .productsSection {
          width: calc(100% - 64px);
          max-width: 1180px;

          margin: -34px auto 0;

          padding: 30px;

          border-radius: 22px;

          background: #ffffff;

          box-shadow:
            0 20px 55px
            rgba(26,61,102,.12);
        }

        .sectionTop {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;

          gap: 30px;

          margin-bottom: 24px;
        }

        .sectionTop span {
          color: #1266e9;

          font-size: 12px;
          font-weight: 900;

          letter-spacing: 1px;
        }

        .sectionTop h2 {
          margin: 6px 0 0;

          color: #20384f;

          font-size: 28px;
        }

        .sectionTop > p {
          max-width: 430px;

          margin: 0;

          color: #748498;

          font-size: 14px;
          line-height: 1.6;
        }

        .productsGrid {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0,1fr));

          gap: 15px;
        }

        .productCard {
          min-height: 290px;

          padding: 22px;

          display: flex;
          flex-direction: column;

          border: 1px solid #dce6f1;

          border-radius: 16px;

          background:
            linear-gradient(
              180deg,
              #ffffff,
              #f9fbfe
            );

          text-decoration: none;

          transition:
            transform .2s ease,
            box-shadow .2s ease,
            border-color .2s ease;
        }

        .productCard:hover {
          transform:
            translateY(-4px);

          border-color:
            #a9c8f3;

          box-shadow:
            0 15px 32px
            rgba(18,102,233,.11);
        }

        .cardTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .productIcon {
          width: 58px;
          height: 58px;

          display: grid;
          place-items: center;

          border-radius: 15px;

          background: #edf4ff;

          font-size: 29px;
        }

        .arrow {
          width: 36px;
          height: 36px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #1266e9;

          color: #ffffff;

          font-size: 18px;
          font-weight: 900;
        }

        .productType {
          margin-top: 23px;

          color: #1266e9;

          font-size: 11px;
          font-weight: 900;

          letter-spacing: .8px;
        }

        .productCard h3 {
          margin: 7px 0 0;

          color: #243c55;

          font-size: 22px;
        }

        .productCard p {
          margin: 10px 0 0;

          color: #758599;

          font-size: 14px;
          line-height: 1.6;
        }

        .registerLink {
          margin-top: auto;
          padding-top: 22px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          color: #1266e9;

          font-size: 14px;
          font-weight: 850;
        }

        .registerLink strong {
          font-size: 18px;
        }

        .bottomCard {
          width: calc(100% - 64px);
          max-width: 1180px;

          margin: 20px auto 0;

          padding: 22px 25px;

          display: grid;

          grid-template-columns:
            auto 1fr auto;

          align-items: center;

          gap: 16px;

          border: 1px solid #d6e3f2;

          border-radius: 16px;

          background: #ffffff;
        }

        .bottomIcon {
          width: 48px;
          height: 48px;

          display: grid;
          place-items: center;

          border-radius: 13px;

          background: #edf4ff;

          color: #1266e9;

          font-size: 23px;
          font-weight: 700;
        }

        .bottomText span {
          color: #1266e9;

          font-size: 11px;
          font-weight: 900;

          letter-spacing: .8px;
        }

        .bottomText h2 {
          margin: 5px 0 0;

          color: #29435d;

          font-size: 18px;
        }

        .bottomText p {
          margin: 5px 0 0;

          color: #7d8c9d;

          font-size: 13px;
          line-height: 1.5;
        }

        .bottomCard > a {
          min-height: 44px;

          padding: 0 17px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 10px;

          background: #1266e9;

          color: #ffffff;

          font-size: 14px;
          font-weight: 800;

          text-decoration: none;
        }

        @media (max-width: 900px) {
          .productsGrid {
            grid-template-columns:
              repeat(2,minmax(0,1fr));
          }

          .sectionTop {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 650px) {
          .header,
          .hero,
          .productsSection,
          .bottomCard {
            width: calc(100% - 28px);
          }

          .header {
            min-height: 72px;
          }

          .brandText span {
            display: none;
          }

          .profilesButton {
            padding: 0 11px;
            font-size: 12px;
          }

          .hero {
            padding:
              40px 0 62px;
          }

          .hero h1 {
            font-size: 34px;
          }

          .hero > p {
            font-size: 15px;
          }

          .productsSection {
            padding: 18px;

            margin-top: -28px;
          }

          .productsGrid {
            grid-template-columns: 1fr;
          }

          .productCard {
            min-height: 250px;
          }

          .bottomCard {
            grid-template-columns:
              auto 1fr;
          }

          .bottomCard > a {
            grid-column:
              1 / -1;

            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
