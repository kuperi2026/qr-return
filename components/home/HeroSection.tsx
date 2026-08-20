"use client";

import EmergencyBracelet from "./EmergencyBracelet";
import EmergencyProfileCard from "./EmergencyProfileCard";
import PhonePreview from "./PhonePreview";
import ProductOrbit from "./ProductOrbit";

type Props = {
  language?: "ka" | "en";
};

export default function HeroSection({
  language = "ka",
}: Props) {
  const ka = language === "ka";

  return (
    <section className="hero">
      <div className="heroInner">

        {/* LEFT — EMERGENCY */}
        <div className="left">
          <div className="eyebrow">
            QR RETURN • EMERGENCY ID
          </div>

          <h1>
            {ka ? (
              <>
                როცა სიტყვების თქმა შეუძლებელია,
                <br />
                <span>
                  ინფორმაცია მაინც ხელმისაწვდომია.
                </span>
              </>
            ) : (
              <>
                When words are not possible,
                <br />
                <span>
                  information can still be available.
                </span>
              </>
            )}
          </h1>

          <p className="description">
            {ka
              ? "ერთი სკანი შეიძლება საკმარისი იყოს, რომ დამხმარემ ნახოს თქვენ მიერ ნებადართული მნიშვნელოვანი ინფორმაცია."
              : "One scan can give a helper access to the important information you choose to share."}
          </p>

          <div className="braceletArea">
            <EmergencyBracelet />
          </div>

          <EmergencyProfileCard
            language={language}
          />
        </div>

        {/* RIGHT — QR RETURN ECOSYSTEM */}
        <div className="right">
          <div className="ecosystemHeading">
            <span>QR RETURN</span>

            <strong>
              {ka
                ? "ერთი კოდი. ბევრი მნიშვნელოვანი ნივთი."
                : "One code. What matters to you."}
            </strong>
          </div>

          <div className="visual">
            <ProductOrbit />

            <PhonePreview
              language={language}
            />
          </div>
        </div>

      </div>

      <style jsx>{`
        .hero {
          width: 100%;

          overflow: hidden;

          background:
            radial-gradient(
              circle at 80% 40%,
              rgba(205, 215, 224, 0.24),
              transparent 35%
            ),
            #f8f8f5;
        }

        .heroInner {
          width: calc(100% - 56px);
          max-width: 1280px;

          min-height: 720px;

          margin: 0 auto;
          padding: 72px 0 60px;

          display: grid;
          grid-template-columns:
            minmax(0, 0.92fr)
            minmax(520px, 1.08fr);

          align-items: center;

          gap: 46px;
        }

        .left {
          min-width: 0;
          position: relative;
          z-index: 2;
        }

        .eyebrow {
          margin-bottom: 16px;

          color: #c94a50;

          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        h1 {
          max-width: 620px;

          margin: 0;

          color: #202b37;

          font-size: clamp(
            38px,
            4vw,
            58px
          );

          font-weight: 800;
          line-height: 1.02;

          letter-spacing: -2.4px;
        }

        h1 span {
          color: #5d6874;
          font-weight: 600;
        }

        .description {
          max-width: 500px;

          margin: 22px 0 0;

          color: #727d88;

          font-size: 12px;
          line-height: 1.75;
        }

        .braceletArea {
          min-height: 145px;

          margin-top: 29px;

          display: flex;
          align-items: center;
        }

        .right {
          min-width: 0;

          position: relative;
        }

        .ecosystemHeading {
          position: absolute;

          top: 10px;
          left: 50%;

          z-index: 8;

          width: 100%;

          text-align: center;

          transform:
            translateX(-50%);
        }

        .ecosystemHeading span,
        .ecosystemHeading strong {
          display: block;
        }

        .ecosystemHeading span {
          color: #c94a50;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        .ecosystemHeading strong {
          margin-top: 6px;

          color: #4b5763;

          font-size: 11px;
          font-weight: 800;
        }

        .visual {
          width: 100%;
          min-height: 600px;

          position: relative;

          display: grid;
          place-items: center;
        }

        @media (max-width: 1050px) {
          .heroInner {
            grid-template-columns: 1fr;

            padding-top: 55px;

            gap: 30px;
          }

          .left {
            max-width: 720px;
          }

          .right {
            width: 100%;
          }

          .visual {
            min-height: 620px;
          }
        }

        @media (max-width: 650px) {
          .heroInner {
            width: calc(100% - 28px);

            padding-top: 38px;

            gap: 20px;
          }

          h1 {
            font-size: 37px;
            letter-spacing: -1.7px;
          }

          .description {
            font-size: 11px;
          }

          .braceletArea {
            min-height: 120px;

            overflow: visible;

            transform:
              scale(0.7);

            transform-origin:
              left center;
          }

          .visual {
            min-height: 600px;
          }
        }
      `}</style>
    </section>
  );
}
