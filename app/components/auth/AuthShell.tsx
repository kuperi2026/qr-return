"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  title: string;
  subtitle?: string;
};

export default function AuthShell({
  children,
  title,
  subtitle,
}: Props) {
  return (
    <>
      <main className="authPage">
        <section className="brandPanel">
          <div className="brandContent">
            <a href="/" className="brand">
              <div className="brandMark">QR</div>

              <div className="brandText">
                <strong>QR RETURN</strong>
                <span>SMART LOST &amp; FOUND</span>
              </div>
            </a>

            <div className="brandMessage">
              <span className="eyebrow">
                ONE ACCOUNT · UNLIMITED PROFILES
              </span>

              <h1>
                ერთი ანგარიში.
                <br />
                ყველა თქვენი QR პროფილი.
              </h1>

              <p>
                შექმენით QR RETURN ანგარიში ერთხელ და მართეთ თქვენი
                პროდუქტების პროფილები ერთი სივრციდან.
              </p>
            </div>

            <div className="featureList">
              <div className="feature">
                <span>01</span>
                <div>
                  <strong>ერთი ანგარიში</strong>
                  <p>ერთი ელფოსტით შესაძლებელია მხოლოდ ერთი ანგარიშის შექმნა.</p>
                </div>
              </div>

              <div className="feature">
                <span>02</span>
                <div>
                  <strong>შეუზღუდავი პროფილები</strong>
                  <p>
                    ერთი ანგარიშიდან შეგიძლიათ მართოთ იმდენი QR პროფილი,
                    რამდენიც გჭირდებათ.
                  </p>
                </div>
              </div>

              <div className="feature">
                <span>03</span>
                <div>
                  <strong>ფიქსირებული კატეგორია</strong>
                  <p>
                    QR-ის კატეგორია რეგისტრაციის შემდეგ აღარ იცვლება,
                    თუმცა პროფილის მონაცემების განახლება შესაძლებელია.
                  </p>
                </div>
              </div>
            </div>

            <div className="productLine">
              <span>🐶</span>
              <span>🐱</span>
              <span>🔑</span>
              <span>👛</span>
              <span>🧳</span>
              <span>👜</span>
            </div>
          </div>
        </section>

        <section className="formPanel">
          <div className="formWrapper">
            <a href="/" className="mobileBrand">
              <div className="mobileMark">QR</div>

              <div>
                <strong>QR RETURN</strong>
                <span>SMART LOST &amp; FOUND</span>
              </div>
            </a>

            <div className="step">
              <span className="stepNumber">01</span>

              <div>
                <strong>ACCOUNT</strong>
                <small>პირველი ნაბიჯი</small>
              </div>
            </div>

            <div className="formHeading">
              <span>ACCOUNT REGISTRATION</span>

              <h2>{title}</h2>

              {subtitle && <p>{subtitle}</p>}
            </div>

            {children}

            <div className="securityNote">
              <div className="securityIcon">✓</div>

              <p>
                თქვენი ანგარიშის მონაცემები გამოიყენება QR პროფილების
                სამართავად და მფლობელთან უსაფრთხო კავშირის შესაქმნელად.
              </p>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .authPage {
          min-height: 100vh;
          display: grid;
          grid-template-columns: minmax(420px, 0.92fr) minmax(520px, 1.08fr);
          background: #ffffff;
        }

        .brandPanel {
          min-height: 100vh;
          position: relative;
          display: flex;
          align-items: center;
          overflow: hidden;
          color: #ffffff;
          background:
            radial-gradient(
              circle at 12% 16%,
              rgba(255, 255, 255, 0.15),
              transparent 24%
            ),
            radial-gradient(
              circle at 88% 84%,
              rgba(255, 255, 255, 0.11),
              transparent 28%
            ),
            linear-gradient(
              145deg,
              #0649ad 0%,
              #1266e9 52%,
              #07439e 100%
            );
        }

        .brandPanel::before,
        .brandPanel::after {
          content: "";
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.12);
          pointer-events: none;
        }

        .brandPanel::before {
          width: 470px;
          height: 470px;
          top: -190px;
          right: -210px;
        }

        .brandPanel::after {
          width: 360px;
          height: 360px;
          left: -180px;
          bottom: -170px;
        }

        .brandContent {
          width: calc(100% - 96px);
          max-width: 570px;
          margin: auto;
          position: relative;
          z-index: 2;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          color: inherit;
          text-decoration: none;
        }

        .brandMark {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: #ffffff;
          color: #1266e9;
          font-size: 12px;
          font-weight: 950;
          box-shadow: 0 12px 30px rgba(0, 35, 90, 0.14);
        }

        .brandText strong,
        .brandText span {
          display: block;
        }

        .brandText strong {
          color: #ffffff;
          font-size: 17px;
          font-weight: 950;
        }

        .brandText span {
          margin-top: 4px;
          color: rgba(255, 255, 255, 0.62);
          font-size: 7px;
          font-weight: 850;
          letter-spacing: 1.6px;
        }

        .brandMessage {
          margin-top: 70px;
        }

        .eyebrow {
          color: rgba(255, 255, 255, 0.62);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1.7px;
        }

        .brandMessage h1 {
          max-width: 520px;
          margin: 15px 0 0;
          color: #ffffff;
          font-size: clamp(39px, 4vw, 58px);
          line-height: 1.03;
          letter-spacing: -2.1px;
        }

        .brandMessage p {
          max-width: 480px;
          margin: 21px 0 0;
          color: rgba(255, 255, 255, 0.76);
          font-size: 13px;
          line-height: 1.75;
        }

        .featureList {
          margin-top: 43px;
          display: grid;
          gap: 9px;
        }

        .feature {
          min-height: 72px;
          padding: 13px 15px;
          display: grid;
          grid-template-columns: 38px 1fr;
          align-items: center;
          gap: 12px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.075);
          backdrop-filter: blur(10px);
        }

        .feature > span {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: rgba(255, 255, 255, 0.13);
          color: #ffffff;
          font-size: 9px;
          font-weight: 900;
        }

        .feature strong {
          display: block;
          color: #ffffff;
          font-size: 11px;
          font-weight: 850;
        }

        .feature p {
          margin: 4px 0 0;
          color: rgba(255, 255, 255, 0.67);
          font-size: 9px;
          line-height: 1.5;
        }

        .productLine {
          margin-top: 25px;
          display: flex;
          gap: 8px;
        }

        .productLine span {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.11);
          font-size: 16px;
        }

        .formPanel {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 55px 40px;
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(18, 102, 233, 0.055),
              transparent 30%
            ),
            linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
        }

        .formWrapper {
          width: 100%;
          max-width: 610px;
          margin: auto;
        }

        .mobileBrand {
          display: none;
          text-decoration: none;
        }

        .step {
          margin-bottom: 31px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .stepNumber {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #eaf2ff;
          color: #1266e9;
          font-size: 9px;
          font-weight: 950;
        }

        .step strong,
        .step small {
          display: block;
        }

        .step strong {
          color: #334961;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .step small {
          margin-top: 2px;
          color: #9aa6b4;
          font-size: 8px;
        }

        .formHeading {
          margin-bottom: 30px;
        }

        .formHeading > span {
          color: #1266e9;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .formHeading h2 {
          margin: 10px 0 0;
          color: #172b43;
          font-size: 35px;
          line-height: 1.1;
          letter-spacing: -1.2px;
        }

        .formHeading p {
          max-width: 530px;
          margin: 12px 0 0;
          color: #718095;
          font-size: 12px;
          line-height: 1.65;
        }

        .securityNote {
          margin-top: 25px;
          padding-top: 20px;
          display: flex;
          align-items: flex-start;
          gap: 9px;
          border-top: 1px solid #e3eaf2;
        }

        .securityIcon {
          width: 22px;
          height: 22px;
          flex: 0 0 22px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #eaf2ff;
          color: #1266e9;
          font-size: 9px;
          font-weight: 950;
        }

        .securityNote p {
          margin: 1px 0 0;
          max-width: 470px;
          color: #8996a6;
          font-size: 9px;
          line-height: 1.55;
        }

        @media (max-width: 1050px) {
          .authPage {
            grid-template-columns: 1fr;
          }

          .brandPanel {
            display: none;
          }

          .formPanel {
            padding: 35px 22px 55px;
          }

          .mobileBrand {
            margin-bottom: 45px;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .mobileMark {
            width: 40px;
            height: 40px;
            display: grid;
            place-items: center;
            border-radius: 10px;
            background: #1266e9;
            color: #ffffff;
            font-size: 10px;
            font-weight: 950;
          }

          .mobileBrand strong,
          .mobileBrand span {
            display: block;
          }

          .mobileBrand strong {
            color: #172b43;
            font-size: 14px;
            font-weight: 950;
          }

          .mobileBrand span {
            margin-top: 3px;
            color: #8995a4;
            font-size: 7px;
            font-weight: 800;
            letter-spacing: 1.2px;
          }
        }

        @media (max-width: 600px) {
          .formPanel {
            align-items: flex-start;
            padding: 23px 17px 45px;
          }

          .mobileBrand {
            margin-bottom: 35px;
          }

          .step {
            margin-bottom: 25px;
          }

          .formHeading {
            margin-bottom: 24px;
          }

          .formHeading h2 {
            font-size: 29px;
          }
        }
      `}</style>
    </>
  );
}
