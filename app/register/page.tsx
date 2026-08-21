"use client";

const PRODUCTS = [
  {
    type: "dog",
    label: "ძაღლი",
    emoji: "🐶",
    description:
      "დაარეგისტრირეთ თქვენი ძაღლის QR პროფილი და მიუთითეთ მნიშვნელოვანი ინფორმაცია.",
  },
  {
    type: "cat",
    label: "კატა",
    emoji: "🐱",
    description:
      "შექმენით კატის QR პროფილი და მართეთ საკონტაქტო და უსაფრთხოების ინფორმაცია.",
  },
  {
    type: "keys",
    label: "გასაღები",
    emoji: "🔑",
    description:
      "დაარეგისტრირეთ გასაღების QR კოდი და დაეხმარეთ მპოვნელს თქვენთან დაკავშირებაში.",
  },
  {
    type: "wallet",
    label: "საფულე",
    emoji: "👛",
    description:
      "შექმენით საფულის პროფილი და დაამატეთ მფლობელის საკონტაქტო ინფორმაცია.",
  },
  {
    type: "bag",
    label: "ჩანთა",
    emoji: "👜",
    description:
      "დაარეგისტრირეთ ჩანთა და დაამატეთ აღწერა, ფოტო და განმასხვავებელი ნიშნები.",
  },
  {
    type: "suitcase",
    label: "ჩემოდანი",
    emoji: "🧳",
    description:
      "დაარეგისტრირეთ ჩემოდნის QR პროფილი მოგზაურობისას უფრო სწრაფი დაბრუნებისთვის.",
  },
] as const;

export default function RegisterPage() {
  return (
    <>
      <main className="page">
        <header className="header">
          <a href="/" className="brand">
            <div className="brandMark">QR</div>

            <div>
              <strong>QR RETURN</strong>
              <span>SMART LOST &amp; FOUND</span>
            </div>
          </a>

          <a href="/my-profiles" className="profilesLink">
            ჩემი პროფილები
          </a>
        </header>

        <section className="hero">
          <span>REGISTER PRODUCT</span>

          <h1>
            აირჩიეთ პროდუქტი
          </h1>

          <p>
            ერთი ანგარიშიდან შეგიძლიათ შეუზღუდავად მართოთ
            სხვადასხვა QR პროფილი. აირჩიეთ კატეგორია და დაიწყეთ
            რეგისტრაცია.
          </p>
        </section>

        <section className="productsGrid">
          {PRODUCTS.map((product) => (
            <a
              key={product.type}
              href={`/register-item/${product.type}`}
              className="productCard"
            >
              <div className="top">
                <div className="icon">
                  {product.emoji}
                </div>

                <span className="arrow">
                  →
                </span>
              </div>

              <span className="category">
                QR PROFILE
              </span>

              <h2>
                {product.label}
              </h2>

              <p>
                {product.description}
              </p>

              <div className="bottom">
                <span>
                  რეგისტრაციის დაწყება
                </span>

                <b>→</b>
              </div>
            </a>
          ))}
        </section>

        <section className="infoCard">
          <div className="infoIcon">
            i
          </div>

          <div>
            <strong>
              ერთი Owner Account — რამდენიმე QR პროფილი
            </strong>

            <p>
              თითოეული QR კოდი ერთ კატეგორიაზე ფიქსირდება.
              პროფილის მონაცემების შეცვლა მოგვიანებით შეგიძლიათ,
              მაგრამ კატეგორია აღარ შეიცვლება.
            </p>
          </div>
        </section>
      </main>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          padding-bottom: 70px;

          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(18, 102, 233, 0.08),
              transparent 28%
            ),
            linear-gradient(
              180deg,
              #ffffff 0%,
              #f5f9ff 100%
            );
        }

        .header {
          width: calc(100% - 60px);
          max-width: 1180px;
          min-height: 80px;
          margin: auto;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;

          border-bottom: 1px solid #e3eaf2;
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

          background: #1266e9;
          color: #ffffff;

          font-size: 10px;
          font-weight: 950;
        }

        .brand strong,
        .brand span {
          display: block;
        }

        .brand strong {
          color: #1d3650;
          font-size: 14px;
          font-weight: 950;
        }

        .brand span {
          margin-top: 3px;

          color: #8c98a7;

          font-size: 6px;
          font-weight: 850;

          letter-spacing: 1.2px;
        }

        .profilesLink {
          min-height: 42px;

          padding: 0 14px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border: 1px solid #ccdae9;
          border-radius: 10px;

          background: #ffffff;

          color: #526b84;

          font-size: 9px;
          font-weight: 900;

          text-decoration: none;
        }

        .hero {
          width: calc(100% - 60px);
          max-width: 1180px;

          margin: 65px auto 0;

          text-align: center;
        }

        .hero > span {
          color: #1266e9;

          font-size: 8px;
          font-weight: 900;

          letter-spacing: 1.4px;
        }

        .hero h1 {
          margin: 10px 0 0;

          color: #1f3852;

          font-size: 42px;
          line-height: 1.08;

          letter-spacing: -1px;
        }

        .hero p {
          max-width: 650px;

          margin: 13px auto 0;

          color: #78889b;

          font-size: 11px;
          line-height: 1.7;
        }

        .productsGrid {
          width: calc(100% - 60px);
          max-width: 1180px;

          margin: 40px auto 0;

          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 15px;
        }

        .productCard {
          min-height: 285px;

          padding: 22px;

          display: flex;
          flex-direction: column;

          border: 1px solid #dce6f1;
          border-radius: 17px;

          background: #ffffff;

          text-decoration: none;

          box-shadow:
            0 12px 30px
            rgba(30, 70, 120, 0.05);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }

        .productCard:hover {
          transform: translateY(-3px);

          border-color: #bfd4ef;

          box-shadow:
            0 18px 38px
            rgba(30, 70, 120, 0.09);
        }

        .top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .icon {
          width: 56px;
          height: 56px;

          display: grid;
          place-items: center;

          border-radius: 15px;

          background: #edf4ff;

          font-size: 28px;
        }

        .arrow {
          width: 32px;
          height: 32px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #f1f5fa;

          color: #1266e9;

          font-size: 14px;
          font-weight: 900;
        }

        .category {
          margin-top: 24px;

          color: #1266e9;

          font-size: 7px;
          font-weight: 900;

          letter-spacing: 1.2px;
        }

        .productCard h2 {
          margin: 7px 0 0;

          color: #263e57;

          font-size: 20px;
        }

        .productCard p {
          margin: 8px 0 0;

          color: #7e8da0;

          font-size: 9px;
          line-height: 1.6;
        }

        .bottom {
          margin-top: auto;
          padding-top: 20px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          color: #1266e9;

          font-size: 8px;
          font-weight: 900;
        }

        .bottom b {
          font-size: 14px;
        }

        .infoCard {
          width: calc(100% - 60px);
          max-width: 1180px;

          margin: 18px auto 0;

          padding: 17px;

          display: flex;
          align-items: flex-start;

          gap: 11px;

          border: 1px solid #cfe0f6;
          border-radius: 14px;

          background: #f7faff;
        }

        .infoIcon {
          width: 28px;
          height: 28px;

          flex: 0 0 28px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #1266e9;

          color: #ffffff;

          font-size: 9px;
          font-weight: 950;
        }

        .infoCard strong {
          display: block;

          color: #405a74;

          font-size: 10px;
        }

        .infoCard p {
          margin: 5px 0 0;

          color: #7d8c9d;

          font-size: 8px;
          line-height: 1.55;
        }

        @media (max-width: 900px) {
          .productsGrid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 600px) {
          .header,
          .hero,
          .productsGrid,
          .infoCard {
            width: calc(100% - 30px);
          }

          .hero {
            margin-top: 45px;
          }

          .hero h1 {
            font-size: 32px;
          }

          .productsGrid {
            grid-template-columns: 1fr;
          }

          .profilesLink {
            padding: 0 10px;
            font-size: 7px;
          }
        }
      `}</style>
    </>
  );
}
