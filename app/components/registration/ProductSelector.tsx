"use client";

const products = [
  {
    id: "dog",
    emoji: "🐶",
    titleKa: "ძაღლი",
    titleEn: "Dog",
    textKa: "QR პროფილი თქვენი ძაღლისთვის.",
    textEn: "QR profile for your dog.",
  },
  {
    id: "cat",
    emoji: "🐱",
    titleKa: "კატა",
    titleEn: "Cat",
    textKa: "QR პროფილი თქვენი კატისთვის.",
    textEn: "QR profile for your cat.",
  },
  {
    id: "keys",
    emoji: "🔑",
    titleKa: "გასაღები",
    titleEn: "Keys",
    textKa: "QR პროფილი თქვენი გასაღებებისთვის.",
    textEn: "QR profile for your keys.",
  },
  {
    id: "wallet",
    emoji: "👛",
    titleKa: "საფულე",
    titleEn: "Wallet",
    textKa: "QR პროფილი თქვენი საფულისთვის.",
    textEn: "QR profile for your wallet.",
  },
  {
    id: "suitcase",
    emoji: "🧳",
    titleKa: "ჩემოდანი",
    titleEn: "Suitcase",
    textKa: "QR პროფილი თქვენი ჩემოდნისთვის.",
    textEn: "QR profile for your suitcase.",
  },
  {
    id: "bag",
    emoji: "👜",
    titleKa: "ჩანთა",
    titleEn: "Bag",
    textKa: "QR პროფილი თქვენი ჩანთისთვის.",
    textEn: "QR profile for your bag.",
  },
];

export default function ProductSelector({
  ka = true,
}: {
  ka?: boolean;
}) {
  return (
    <>
      <section className="selector">
        <div className="top">
          <span>STEP 02 · PRODUCT</span>

          <h1>
            {ka
              ? "რომელი პროდუქტის რეგისტრაცია გსურთ?"
              : "Which product would you like to register?"}
          </h1>

          <p>
            {ka
              ? "აირჩიეთ კატეგორია. ერთი ანგარიშიდან შეგიძლიათ შეუზღუდავი რაოდენობის QR პროფილის მართვა."
              : "Choose a category. You can manage unlimited QR profiles from one account."}
          </p>
        </div>

        <div className="notice">
          <div className="noticeIcon">!</div>

          <div>
            <strong>
              {ka ? "კატეგორია ფიქსირდება" : "Category is locked"}
            </strong>

            <p>
              {ka
                ? "პროფილის შექმნის შემდეგ კატეგორიის შეცვლა შეუძლებელია. მაგალითად, ძაღლის QR პროფილი ვერ გადაიქცევა კატად. თუმცა იმავე ძაღლის მონაცემების შეცვლა მოგვიანებით შესაძლებელია."
                : "After the profile is created, the category cannot be changed. A dog QR profile cannot later become a cat profile, but its profile information can still be updated."}
            </p>
          </div>
        </div>

        <div className="grid">
          {products.map((product, index) => (
            <a
              key={product.id}
              href={`/register-item/${product.id}`}
              className="card"
            >
              <div className="cardTop">
                <span className="number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="arrow">→</span>
              </div>

              <div className="emoji">{product.emoji}</div>

              <h2>
                {ka ? product.titleKa : product.titleEn}
              </h2>

              <p>
                {ka ? product.textKa : product.textEn}
              </p>

              <strong className="action">
                {ka ? "პროფილის შექმნა" : "Create profile"} →
              </strong>
            </a>
          ))}
        </div>

        <div className="bottom">
          <span>QR RETURN</span>

          <p>
            {ka
              ? "შეგიძლიათ დაბრუნდეთ ამ გვერდზე ნებისმიერ დროს და დაამატოთ ახალი პროფილი."
              : "You can return to this page anytime to add another profile."}
          </p>
        </div>
      </section>

      <style jsx>{`
        .selector {
          min-height: 100vh;
          padding: 70px 30px 80px;
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(18, 102, 233, 0.07),
              transparent 28%
            ),
            linear-gradient(
              180deg,
              #ffffff 0%,
              #f7faff 100%
            );
        }

        .top {
          width: 100%;
          max-width: 820px;
          margin: 0 auto;
          text-align: center;
        }

        .top > span {
          color: #1266e9;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.6px;
        }

        .top h1 {
          margin: 13px 0 0;
          color: #172b43;
          font-size: clamp(33px, 4vw, 48px);
          line-height: 1.08;
          letter-spacing: -1.6px;
        }

        .top p {
          max-width: 650px;
          margin: 16px auto 0;
          color: #748295;
          font-size: 12px;
          line-height: 1.7;
        }

        .notice {
          width: 100%;
          max-width: 900px;
          margin: 32px auto 0;
          padding: 15px 17px;
          display: flex;
          align-items: flex-start;
          gap: 11px;
          border: 1px solid #cfe0f8;
          border-radius: 13px;
          background: #f5f9ff;
        }

        .noticeIcon {
          width: 28px;
          height: 28px;
          flex: 0 0 28px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #1266e9;
          color: #ffffff;
          font-size: 10px;
          font-weight: 900;
        }

        .notice strong {
          display: block;
          color: #27415f;
          font-size: 10px;
          font-weight: 900;
        }

        .notice p {
          margin: 4px 0 0;
          color: #718197;
          font-size: 9px;
          line-height: 1.55;
        }

        .grid {
          width: 100%;
          max-width: 1120px;
          margin: 36px auto 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }

        .card {
          min-height: 260px;
          padding: 21px;
          position: relative;
          display: flex;
          flex-direction: column;
          border: 1px solid #dce6f1;
          border-radius: 16px;
          background: #ffffff;
          color: inherit;
          text-decoration: none;
          box-shadow: 0 12px 30px rgba(30, 70, 120, 0.06);
          transition:
            transform 0.18s ease,
            border-color 0.18s ease,
            box-shadow 0.18s ease;
        }

        .card:hover {
          transform: translateY(-3px);
          border-color: #bdd3f2;
          box-shadow: 0 17px 34px rgba(30, 70, 120, 0.1);
        }

        .cardTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .number {
          color: #9aa7b7;
          font-size: 9px;
          font-weight: 900;
        }

        .arrow {
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #edf4ff;
          color: #1266e9;
          font-size: 13px;
          font-weight: 900;
        }

        .emoji {
          width: 58px;
          height: 58px;
          margin-top: 28px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: #f3f7fd;
          font-size: 28px;
        }

        .card h2 {
          margin: 18px 0 0;
          color: #223951;
          font-size: 19px;
        }

        .card p {
          margin: 8px 0 0;
          color: #7b8999;
          font-size: 10px;
          line-height: 1.55;
        }

        .action {
          margin-top: auto;
          padding-top: 20px;
          color: #1266e9;
          font-size: 9px;
          font-weight: 900;
        }

        .bottom {
          width: 100%;
          max-width: 720px;
          margin: 38px auto 0;
          text-align: center;
        }

        .bottom span {
          color: #1266e9;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1.3px;
        }

        .bottom p {
          margin: 7px 0 0;
          color: #8a97a6;
          font-size: 9px;
          line-height: 1.55;
        }

        @media (max-width: 900px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .selector {
            padding: 45px 16px 60px;
          }

          .top h1 {
            font-size: 31px;
          }

          .grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .card {
            min-height: 220px;
          }
        }
      `}</style>
    </>
  );
}
