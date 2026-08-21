"use client";

import {
  PhoneIcon,
  QRIcon,
  ShieldIcon,
} from "./HomeIcons";

export default function EmergencySection({
  ka,
}: {
  ka: boolean;
}) {
  return (
    <>
      <div className="emergencySection">
        <span className="eyebrow">
          QR RETURN · EMERGENCY
        </span>

        <h1>
          {ka
            ? "გადაუდებელ სიტუაციაში საჭირო ინფორმაცია — ერთი სკანირებით."
            : "Essential information in an emergency — one scan away."}
        </h1>

        <p className="lead">
          {ka
            ? "Emergency პროფილი სწრაფად აჩვენებს თქვენ მიერ წინასწარ შერჩეულ მნიშვნელოვან ინფორმაციას და საგანგებო საკონტაქტო პირებს, რათა დახმარების აღმოჩენა უფრო სწრაფად და ორგანიზებულად მოხდეს."
            : "An Emergency profile provides quick access to the essential information and emergency contacts you have chosen in advance."}
        </p>

        <div className="flow">

          <div className="flowStep">
            <span className="stepNumber">01</span>

            <div className="braceletVisual">
              <div className="band" />

              <div className="braceletQR">
                <QRIcon size={28} />
              </div>

              <div className="band" />
            </div>

            <div>
              <strong>
                {ka
                  ? "Emergency სამაჯური"
                  : "Emergency Bracelet"}
              </strong>

              <p>
                {ka
                  ? "QR კოდი ყოველთვის ხელმისაწვდომია სამაჯურზე."
                  : "The QR code is available directly on the bracelet."}
              </p>
            </div>
          </div>

          <div className="flowArrow">→</div>

          <div className="flowStep">
            <span className="stepNumber">02</span>

            <div className="phoneVisual">
              <div className="phoneTop" />

              <QRIcon size={32} />

              <div className="scanLine" />
            </div>

            <div>
              <strong>
                {ka
                  ? "QR-ის სკანირება"
                  : "Scan QR"}
              </strong>

              <p>
                {ka
                  ? "დამხმარე ადამიანი ასკანირებს კოდს ტელეფონით."
                  : "A helper scans the QR code using a phone."}
              </p>
            </div>
          </div>

          <div className="flowArrow">→</div>

          <div className="flowStep">
            <span className="stepNumber">03</span>

            <div className="callIcon">
              <PhoneIcon />
            </div>

            <div>
              <strong>
                {ka
                  ? "საჭირო მოქმედება"
                  : "Take action"}
              </strong>

              <p>
                {ka
                  ? "პროფილიდან შესაძლებელია საგანგებო საკონტაქტო პირთან დაკავშირება ან საჭიროების შემთხვევაში 112-ზე დარეკვა."
                  : "Contact the emergency person or call 911 when emergency services are needed."}
              </p>

              <div className="emergencyNumber">
                {ka ? "112" : "911"}
              </div>
            </div>
          </div>

        </div>

        <div className="privacyNote">
          <ShieldIcon />

          <span>
            {ka
              ? "პროფილში ჩანს მხოლოდ ის ინფორმაცია, რომლის გაზიარებაც მომხმარებელმა წინასწარ აირჩია."
              : "Only information selected by the user is visible in the profile."}
          </span>
        </div>
      </div>

      <style jsx>{`

        .emergencySection {
          max-width: 640px;
        }

        .eyebrow {
          color: rgba(255,255,255,.72);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        h1 {
          max-width: 610px;

          margin: 14px 0 0;

          color: #ffffff;

          font-size: clamp(35px, 3.5vw, 49px);
          line-height: 1.08;

          letter-spacing: -1.7px;
        }

        .lead {
          max-width: 590px;

          margin: 18px 0 0;

          color: rgba(255,255,255,.82);

          font-size: 13px;
          line-height: 1.72;
        }


        /* FLOW */

        .flow {
          margin-top: 30px;

          display: grid;
          grid-template-columns:
            1fr 25px 1fr 25px 1fr;

          align-items: stretch;

          gap: 6px;
        }

        .flowStep {
          min-height: 205px;

          padding: 16px;

          display: flex;
          flex-direction: column;
          justify-content: space-between;

          border:
            1px solid rgba(255,255,255,.18);

          border-radius: 14px;

          background:
            rgba(255,255,255,.1);

          backdrop-filter: blur(8px);
        }

        .stepNumber {
          color: rgba(255,255,255,.58);

          font-size: 8px;
          font-weight: 900;
        }

        .flowStep strong {
          display: block;

          margin-top: 11px;

          color: #ffffff;

          font-size: 11px;
        }

        .flowStep p {
          margin: 5px 0 0;

          color: rgba(255,255,255,.7);

          font-size: 9px;
          line-height: 1.55;
        }

        .flowArrow {
          display: grid;
          place-items: center;

          color: rgba(255,255,255,.55);

          font-size: 17px;
        }


        /* BRACELET */

        .braceletVisual {
          height: 65px;

          margin-top: 12px;

          display: flex;

          align-items: center;
          justify-content: center;
        }

        .band {
          width: 29px;
          height: 19px;

          background: #ffffff;
        }

        .braceletQR {
          width: 51px;
          height: 51px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          background: #ffffff;

          color: #1266e9;

          box-shadow:
            0 6px 14px rgba(0,0,0,.08);
        }


        /* PHONE */

        .phoneVisual {
          width: 55px;
          height: 88px;

          margin: 8px auto 0;

          position: relative;

          display: grid;
          place-items: center;

          border: 2px solid #ffffff;

          border-radius: 10px;

          color: #ffffff;
        }

        .phoneTop {
          width: 16px;
          height: 2px;

          position: absolute;

          top: 5px;

          border-radius: 2px;

          background:
            rgba(255,255,255,.7);
        }

        .scanLine {
          width: 37px;
          height: 1px;

          position: absolute;

          background: #9fd1ff;

          box-shadow:
            0 0 7px #ffffff;
        }


        /* CALL */

        .callIcon {
          width: 52px;
          height: 52px;

          margin: 12px auto 0;

          display: grid;
          place-items: center;

          border-radius: 50%;

          color: #1266e9;

          background: #ffffff;
        }

        .emergencyNumber {
          margin-top: 8px;

          display: inline-flex;

          padding: 5px 10px;

          border-radius: 7px;

          color: #1266e9;

          background: #ffffff;

          font-size: 11px;
          font-weight: 900;
        }


        /* PRIVACY */

        .privacyNote {
          margin-top: 18px;

          display: flex;

          align-items: center;

          gap: 8px;

          color: rgba(255,255,255,.72);

          font-size: 9px;
          line-height: 1.5;
        }


        /* MOBILE */

        @media (max-width: 650px) {

          .emergencySection {
            max-width: 100%;
          }

          h1 {
            font-size: 35px;
          }

          .lead {
            font-size: 12px;
          }

          .flow {
            grid-template-columns: 1fr;

            gap: 0;
          }

          .flowStep {
            min-height: 190px;
          }

          .flowArrow {
            height: 32px;

            transform: rotate(90deg);
          }

        }

      `}</style>
    </>
  );
}
