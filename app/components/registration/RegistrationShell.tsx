"use client";

import type { ReactNode } from "react";

type RegistrationShellProps = {
  title: string;
  subtitle: string;
  categoryLabel: string;
  categoryEmoji: string;
  children: ReactNode;
};

export default function RegistrationShell({
  title,
  subtitle,
  categoryLabel,
  categoryEmoji,
  children,
}: RegistrationShellProps) {
  return (
    <>
      <main className="registrationPage">
        <aside className="sidePanel">
          <div className="sideInner">
            <a href="/" className="brand">
              <div className="brandMark">QR</div>

              <div>
                <strong>QR RETURN</strong>
                <span>SMART LOST &amp; FOUND</span>
              </div>
            </a>

            <div className="categoryBox">
              <span className="stepLabel">
                STEP 03 · PROFILE REGISTRATION
              </span>

              <div className="categoryIcon">
                {categoryEmoji}
              </div>

              <h1>{categoryLabel}</h1>

              <p>
                ეს QR პროფილი იქმნება არჩეული კატეგორიისთვის.
                შექმნის შემდეგ კატეგორიის შეცვლა შეუძლებელია,
                თუმცა პროფილის მონაცემების განახლება ყოველთვის შეგეძლებათ.
              </p>
            </div>

            <div className="rules">
              <div className="rule">
                <span>01</span>

                <div>
                  <strong>ფიქსირებული კატეგორია</strong>
                  <p>
                    პროფილის ტიპი შექმნის შემდეგ აღარ შეიცვლება.
                  </p>
                </div>
              </div>

              <div className="rule">
                <span>02</span>

                <div>
                  <strong>რედაქტირებადი მონაცემები</strong>
                  <p>
                    სახელი, ფოტო, აღწერა და სხვა ინფორმაცია მოგვიანებით შეგიძლიათ შეცვალოთ.
                  </p>
                </div>
              </div>

              <div className="rule">
                <span>03</span>

                <div>
                  <strong>Finder View</strong>
                  <p>
                    მპოვნელს გამოუჩნდება მხოლოდ ის ინფორმაცია, რომელიც შესაბამის პროფილშია დაშვებული.
                  </p>
                </div>
              </div>
            </div>

            <a
              href="/register"
              className="backLink"
            >
              ← სხვა კატეგორიის არჩევა
            </a>
          </div>
        </aside>

        <section className="formArea">
          <div className="formContainer">
            <div className="mobileBrand">
              <a href="/">
                <div className="mobileMark">QR</div>

                <div>
                  <strong>QR RETURN</strong>
                  <span>SMART LOST &amp; FOUND</span>
                </div>
              </a>
            </div>

            <div className="mobileCategory">
              <div className="mobileCategoryIcon">
                {categoryEmoji}
              </div>

              <div>
                <span>PROFILE TYPE</span>
                <strong>{categoryLabel}</strong>
              </div>
            </div>

            <header className="formHeader">
              <span>QR PROFILE</span>

              <h2>{title}</h2>

              <p>{subtitle}</p>
            </header>

            <div className="formContent">
              {children}
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .registrationPage {
          min-height: 100vh;

          display: grid;
          grid-template-columns:
            minmax(350px, 0.78fr)
            minmax(600px, 1.22fr);

          background: #f8fbff;
        }

        .sidePanel {
          min-height: 100vh;

          position: relative;

          display: flex;
          align-items: stretch;

          overflow: hidden;

          background:
            radial-gradient(
              circle at 12% 15%,
              rgba(255,255,255,.14),
              transparent 25%
            ),
            radial-gradient(
              circle at 88% 85%,
              rgba(255,255,255,.10),
              transparent 28%
            ),
            linear-gradient(
              145deg,
              #0649ad 0%,
              #1266e9 52%,
              #07439e 100%
            );

          color: #ffffff;
        }

        .sidePanel::before,
        .sidePanel::after {
          content: "";

          position: absolute;

          border-radius: 50%;

          border:
            1px solid rgba(255,255,255,.11);

          pointer-events: none;
        }

        .sidePanel::before {
          width: 430px;
          height: 430px;

          top: -190px;
          right: -210px;
        }

        .sidePanel::after {
          width: 320px;
          height: 320px;

          left: -160px;
          bottom: -140px;
        }

        .sideInner {
          width: calc(100% - 70px);

          max-width: 470px;

          margin: 0 auto;

          padding: 45px 0;

          position: relative;
          z-index: 2;

          display: flex;
          flex-direction: column;
        }

        .brand {
          display: inline-flex;
          align-items: center;

          gap: 10px;

          color: inherit;

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

          font-size: 11px;
          font-weight: 950;
        }

        .brand strong,
        .brand span {
          display: block;
        }

        .brand strong {
          color: #ffffff;

          font-size: 15px;
          font-weight: 950;
        }

        .brand span {
          margin-top: 3px;

          color:
            rgba(255,255,255,.62);

          font-size: 7px;
          font-weight: 850;

          letter-spacing: 1.5px;
        }

        .categoryBox {
          margin-top: 70px;
        }

        .stepLabel {
          color:
            rgba(255,255,255,.6);

          font-size: 8px;
          font-weight: 900;

          letter-spacing: 1.5px;
        }

        .categoryIcon {
          width: 74px;
          height: 74px;

          margin-top: 22px;

          display: grid;
          place-items: center;

          border-radius: 20px;

          background:
            rgba(255,255,255,.12);

          border:
            1px solid rgba(255,255,255,.16);

          font-size: 36px;

          backdrop-filter:
            blur(8px);
        }

        .categoryBox h1 {
          margin: 20px 0 0;

          color: #ffffff;

          font-size: 38px;
          line-height: 1.05;

          letter-spacing: -1.3px;
        }

        .categoryBox p {
          max-width: 430px;

          margin: 16px 0 0;

          color:
            rgba(255,255,255,.74);

          font-size: 11px;
          line-height: 1.7;
        }

        .rules {
          margin-top: 38px;

          display: grid;

          gap: 9px;
        }

        .rule {
          min-height: 66px;

          padding: 12px 13px;

          display: grid;

          grid-template-columns:
            34px 1fr;

          align-items: center;

          gap: 10px;

          border:
            1px solid rgba(255,255,255,.13);

          border-radius: 12px;

          background:
            rgba(255,255,255,.07);

          backdrop-filter: blur(7px);
        }

        .rule > span {
          width: 30px;
          height: 30px;

          display: grid;
          place-items: center;

          border-radius: 8px;

          background:
            rgba(255,255,255,.12);

          color: #ffffff;

          font-size: 8px;
          font-weight: 900;
        }

        .rule strong {
          display: block;

          color: #ffffff;

          font-size: 10px;
          font-weight: 850;
        }

        .rule p {
          margin: 3px 0 0;

          color:
            rgba(255,255,255,.64);

          font-size: 8px;
          line-height: 1.45;
        }

        .backLink {
          margin-top: auto;

          padding-top: 40px;

          color:
            rgba(255,255,255,.78);

          font-size: 9px;
          font-weight: 800;

          text-decoration: none;
        }

        .formArea {
          min-height: 100vh;

          padding:
            50px 35px 70px;

          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(18,102,233,.055),
              transparent 27%
            ),
            linear-gradient(
              180deg,
              #ffffff 0%,
              #f8fbff 100%
            );
        }

        .formContainer {
          width: 100%;
          max-width: 760px;

          margin: auto;
        }

        .mobileBrand,
        .mobileCategory {
          display: none;
        }

        .formHeader {
          margin-bottom: 28px;
        }

        .formHeader > span {
          color: #1266e9;

          font-size: 8px;
          font-weight: 900;

          letter-spacing: 1.5px;
        }

        .formHeader h2 {
          margin: 9px 0 0;

          color: #172b43;

          font-size: 34px;
          line-height: 1.12;

          letter-spacing: -1px;
        }

        .formHeader p {
          max-width: 650px;

          margin: 11px 0 0;

          color: #718095;

          font-size: 11px;
          line-height: 1.65;
        }

        .formContent {
          width: 100%;
        }

        @media (max-width: 1050px) {
          .registrationPage {
            grid-template-columns: 1fr;
          }

          .sidePanel {
            display: none;
          }

          .formArea {
            padding:
              30px 22px 60px;
          }

          .mobileBrand {
            margin-bottom: 32px;

            display: block;
          }

          .mobileBrand a {
            display: flex;
            align-items: center;

            gap: 9px;

            text-decoration: none;
          }

          .mobileMark {
            width: 39px;
            height: 39px;

            display: grid;
            place-items: center;

            border-radius: 10px;

            background: #1266e9;

            color: #ffffff;

            font-size: 9px;
            font-weight: 950;
          }

          .mobileBrand strong,
          .mobileBrand span {
            display: block;
          }

          .mobileBrand strong {
            color: #172b43;

            font-size: 13px;
            font-weight: 950;
          }

          .mobileBrand span {
            margin-top: 3px;

            color: #8995a4;

            font-size: 6px;
            font-weight: 850;

            letter-spacing: 1.2px;
          }

          .mobileCategory {
            margin-bottom: 27px;

            padding: 12px 13px;

            display: flex;
            align-items: center;

            gap: 10px;

            border:
              1px solid #d9e5f3;

            border-radius: 12px;

            background: #ffffff;
          }

          .mobileCategoryIcon {
            width: 42px;
            height: 42px;

            display: grid;
            place-items: center;

            border-radius: 10px;

            background: #f0f5fd;

            font-size: 22px;
          }

          .mobileCategory span,
          .mobileCategory strong {
            display: block;
          }

          .mobileCategory span {
            color: #9aa6b4;

            font-size: 7px;
            font-weight: 900;

            letter-spacing: 1px;
          }

          .mobileCategory strong {
            margin-top: 3px;

            color: #273d55;

            font-size: 11px;
          }
        }

        @media (max-width: 600px) {
          .formArea {
            padding:
              22px 16px 45px;
          }

          .formHeader h2 {
            font-size: 29px;
          }

          .formHeader p {
            font-size: 10px;
          }
        }
      `}</style>
    </>
  );
}
