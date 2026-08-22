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
              ? "აირჩიეთ პროდუქტი ან Emergency Bracelet. ყველაფერი ერთი QR RETURN ანგარიშიდან იმართება."
              : "Choose a product or Emergency Bracelet. Everything is managed from one QR RETURN account."}
          </p>
        </div>

        <div className="notice">
          <div className="noticeIcon">
            !
          </div>

          <div>
            <strong>
              {ka
                ? "კატეგორია ფიქსირდება"
                : "Category is locked"}
            </strong>

            <p>
              {ka
                ? "პროფილის შექმნის შემდეგ კატეგორიის შეცვლა შეუძლებელია. მონაცემების განახლება მოგვიანებით ყოველთვის შეგიძლიათ."
                : "After the profile is created, its category cannot be changed. Profile information can still be updated later."}
            </p>
          </div>
        </div>

        <div className="productLayout">
          {/* EMERGENCY */}

          <a
            href="/register/emergency-bracelet"
            className="emergencyCard"
          >
            <div className="emergencyTop">
              <span className="emergencyNumber">
                07
              </span>

              <span className="emergencyArrow">
                →
              </span>
            </div>

            <div className="emergencyIcon">
              🩺
            </div>

            <span className="emergencyLabel">
              EMERGENCY PROFILE
            </span>

            <h2>
              {ka
                ? "Emergency Bracelet"
                : "Emergency Bracelet"}
            </h2>

            <p>
              {ka
                ? "სასწრაფო სიტუაციაში მნიშვნელოვანი ინფორმაციის სწრაფი წვდომა."
                : "Fast access to essential information in an emergency."}
            </p>

            <div className="emergencyFeatures">
              <span>
                Medical Information
              </span>

              <span>
                Emergency Contacts
              </span>

              <span>
                QR Access
              </span>
            </div>

            <strong className="emergencyAction">
              {ka
                ? "სამაჯურის რეგისტრაცია"
                : "Register bracelet"}{" "}
              →
            </strong>
          </a>

          {/* STANDARD PRODUCTS */}

          <div className="productsGrid">
            {products.map(
              (
                product,
                index
              ) => (
                <a
                  key={product.id}
                  href={`/register-item/${product.id}`}
                  className="card"
                >
                  <div className="cardTop">
                    <span className="number">
                      {String(
                        index +
                          1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <span className="arrow">
                      →
                    </span>
                  </div>

                  <div className="emoji">
                    {product.emoji}
                  </div>

                  <h2>
                    {ka
                      ? product.titleKa
                      : product.titleEn}
                  </h2>

                  <p>
                    {ka
                      ? product.textKa
                      : product.textEn}
                  </p>

                  <strong className="action">
                    {ka
                      ? "პროფილის შექმნა"
                      : "Create profile"}{" "}
                    →
                  </strong>
                </a>
              )
            )}
          </div>
        </div>

        <div className="bottom">
          <span>
            QR RETURN
          </span>

          <p>
            {ka
              ? "ერთი ანგარიშიდან შეგიძლიათ მართოთ ყველა თქვენი QR პროფილი."
              : "Manage all of your QR profiles from one account."}
          </p>
        </div>
      </section>

      <style jsx>{`
        .selector {
          min-height: 100vh;

          padding:
            54px 28px
            66px;

          background:
            radial-gradient(
              circle at
                100% 0%,
              rgba(
                18,
                102,
                233,
                0.07
              ),
              transparent
                28%
            ),
            linear-gradient(
              180deg,
              #ffffff
                0%,
              #f7faff
                100%
            );
        }

        .top {
          width: 100%;

          max-width: 820px;

          margin: 0 auto;

          text-align:
            center;
        }

        .top > span {
          color: #1266e9;

          font-size: 9px;

          font-weight:
            900;

          letter-spacing:
            1.6px;
        }

        .top h1 {
          margin:
            11px 0 0;

          color:
            #172b43;

          font-size:
            clamp(
              31px,
              4vw,
              44px
            );

          line-height:
            1.08;

          letter-spacing:
            -1.4px;
        }

        .top p {
          max-width:
            650px;

          margin:
            13px auto 0;

          color:
            #748295;

          font-size:
            11px;

          line-height:
            1.65;
        }

        .notice {
          width: 100%;

          max-width:
            980px;

          margin:
            25px auto 0;

          padding:
            12px 14px;

          display: flex;

          align-items:
            flex-start;

          gap: 10px;

          box-sizing:
            border-box;

          border:
            1px solid
            #cfe0f8;

          border-radius:
            12px;

          background:
            #f5f9ff;
        }

        .noticeIcon {
          width: 26px;
          height: 26px;

          flex:
            0 0 26px;

          display: grid;

          place-items:
            center;

          border-radius:
            50%;

          background:
            #1266e9;

          color:
            #ffffff;

          font-size:
            9px;

          font-weight:
            900;
        }

        .notice strong {
          display: block;

          color:
            #27415f;

          font-size:
            10px;

          font-weight:
            900;
        }

        .notice p {
          margin:
            3px 0 0;

          color:
            #718197;

          font-size:
            9px;

          line-height:
            1.5;
        }

        /* MAIN TWO-SIDE LAYOUT */

        .productLayout {
          width: 100%;

          max-width:
            1120px;

          margin:
            28px auto 0;

          display: grid;

          grid-template-columns:
            0.78fr
            1.72fr;

          gap: 15px;

          align-items:
            stretch;
        }

        /* EMERGENCY */

        .emergencyCard {
          min-height:
            100%;

          padding:
            22px;

          position:
            relative;

          display: flex;

          flex-direction:
            column;

          box-sizing:
            border-box;

          overflow:
            hidden;

          border:
            1px solid
            #cbdcf5;

          border-radius:
            17px;

          background:
            linear-gradient(
              145deg,
              #ffffff
                0%,
              #f3f7ff
                62%,
              #eaf2ff
                100%
            );

          color: inherit;

          text-decoration:
            none;

          box-shadow:
            0 14px
            32px
            rgba(
              30,
              70,
              120,
              0.07
            );

          transition:
            transform
              0.18s ease,
            border-color
              0.18s ease,
            box-shadow
              0.18s ease;
        }

        .emergencyCard:hover {
          transform:
            translateY(
              -3px
            );

          border-color:
            #9fc0ed;

          box-shadow:
            0 18px
            38px
            rgba(
              30,
              70,
              120,
              0.11
            );
        }

        .emergencyTop {
          display: flex;

          align-items:
            center;

          justify-content:
            space-between;
        }

        .emergencyNumber {
          color:
            #8fa0b2;

          font-size:
            9px;

          font-weight:
            900;
        }

        .emergencyArrow {
          width: 30px;
          height: 30px;

          display: grid;

          place-items:
            center;

          border-radius:
            50%;

          background:
            #1266e9;

          color:
            #ffffff;

          font-size:
            14px;

          font-weight:
            900;
        }

        .emergencyIcon {
          width: 66px;
          height: 66px;

          margin-top:
            31px;

          display: grid;

          place-items:
            center;

          border-radius:
            17px;

          background:
            #ffffff;

          box-shadow:
            0 8px 20px
            rgba(
              20,
              70,
              150,
              0.08
            );

          font-size:
            31px;
        }

        .emergencyLabel {
          margin-top:
            24px;

          color:
            #1266e9;

          font-size:
            8px;

          font-weight:
            900;

          letter-spacing:
            1.2px;
        }

        .emergencyCard h2 {
          margin:
            6px 0 0;

          color:
            #203951;

          font-size:
            24px;

          line-height:
            1.15;
        }

        .emergencyCard p {
          margin:
            10px 0 0;

          color:
            #6f8092;

          font-size:
            10px;

          line-height:
            1.6;
        }

        .emergencyFeatures {
          margin-top:
            19px;

          display: flex;

          flex-wrap: wrap;

          gap: 6px;
        }

        .emergencyFeatures
        span {
          padding:
            5px 7px;

          border:
            1px solid
            #d8e5f5;

          border-radius:
            999px;

          background:
            rgba(
              255,
              255,
              255,
              0.76
            );

          color:
            #58718a;

          font-size:
            7px;

          font-weight:
            800;
        }

        .emergencyAction {
          margin-top:
            auto;

          padding-top:
            26px;

          color:
            #1266e9;

          font-size:
            9px;

          font-weight:
            900;
        }

        /* 6 PRODUCTS */

        .productsGrid {
          display: grid;

          grid-template-columns:
            repeat(
              3,
              minmax(
                0,
                1fr
              )
            );

          gap: 12px;
        }

        .card {
          min-height:
            210px;

          padding:
            16px;

          position:
            relative;

          display: flex;

          flex-direction:
            column;

          box-sizing:
            border-box;

          border:
            1px solid
            #dce6f1;

          border-radius:
            14px;

          background:
            #ffffff;

          color:
            inherit;

          text-decoration:
            none;

          box-shadow:
            0 9px
            24px
            rgba(
              30,
              70,
              120,
              0.05
            );

          transition:
            transform
              0.18s ease,
            border-color
              0.18s ease,
            box-shadow
              0.18s ease;
        }

        .card:hover {
          transform:
            translateY(
              -3px
            );

          border-color:
            #bdd3f2;

          box-shadow:
            0 14px
            30px
            rgba(
              30,
              70,
              120,
              0.09
            );
        }

        .cardTop {
          display: flex;

          justify-content:
            space-between;

          align-items:
            center;
        }

        .number {
          color:
            #9aa7b7;

          font-size:
            8px;

          font-weight:
            900;
        }

        .arrow {
          width: 25px;
          height: 25px;

          display: grid;

          place-items:
            center;

          border-radius:
            50%;

          background:
            #edf4ff;

          color:
            #1266e9;

          font-size:
            12px;

          font-weight:
            900;
        }

        .emoji {
          width: 47px;
          height: 47px;

          margin-top:
            18px;

          display: grid;

          place-items:
            center;

          border-radius:
            13px;

          background:
            #f3f7fd;

          font-size:
            23px;
        }

        .card h2 {
          margin:
            13px 0 0;

          color:
            #223951;

          font-size:
            16px;
        }

        .card p {
          margin:
            6px 0 0;

          color:
            #7b8999;

          font-size:
            9px;

          line-height:
            1.45;
        }

        .action {
          margin-top:
            auto;

          padding-top:
            14px;

          color:
            #1266e9;

          font-size:
            8px;

          font-weight:
            900;
        }

        .bottom {
          width: 100%;

          max-width:
            720px;

          margin:
            28px auto 0;

          text-align:
            center;
        }

        .bottom span {
          color:
            #1266e9;

          font-size:
            8px;

          font-weight:
            900;

          letter-spacing:
            1.3px;
        }

        .bottom p {
          margin:
            6px 0 0;

          color:
            #8a97a6;

          font-size:
            9px;

          line-height:
            1.5;
        }

        @media (
          max-width:
            980px
        ) {
          .productLayout {
            grid-template-columns:
              1fr;
          }

          .emergencyCard {
            min-height:
              230px;
          }

          .emergencyIcon {
            margin-top:
              20px;
          }

          .productsGrid {
            grid-template-columns:
              repeat(
                3,
                minmax(
                  0,
                  1fr
                )
              );
          }
        }

        @media (
          max-width:
            760px
        ) {
          .productsGrid {
            grid-template-columns:
              repeat(
                2,
                minmax(
                  0,
                  1fr
                )
              );
          }
        }

        @media (
          max-width:
            600px
        ) {
          .selector {
            padding:
              40px 14px
              52px;
          }

          .top h1 {
            font-size:
              29px;
          }

          .productLayout {
            gap: 12px;
          }

          .emergencyCard {
            min-height:
              240px;

            padding:
              18px;
          }

          .emergencyCard h2 {
            font-size:
              21px;
          }

          .productsGrid {
            grid-template-columns:
              1fr;

            gap: 10px;
          }

          .card {
            min-height:
              185px;

            padding:
              15px;
          }

          .emoji {
            margin-top:
              14px;
          }
        }
      `}</style>
    </>
  );
}
