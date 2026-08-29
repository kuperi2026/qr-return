"use client";

import { QRIcon } from "./HomeIcons";

function Product({
  emoji,
  name,
  className,
}: {
  emoji: string;
  name: string;
  className: string;
}) {
  return (
    <div className={`product ${className}`}>
      <div className="productEmoji">{emoji}</div>

      <span className="productName">
        {name}
      </span>
    </div>
  );
}

export default function ProductOrbit({
  ka,
}: {
  ka: boolean;
}) {
  return (
    <>
      <div className="productsArea">

        <div className="productIntro">
          <span>QR RETURN</span>

          <h2>
            {ka
              ? "მყისიერი კავშირი — საჭირო დროს, საჭირო ადამიანთან"
              : "Instant connection — at the right time, with the right person"}
          </h2>
        </div>

        <div className="productCircle">

          <div className="ring ringOne" />
          <div className="ring ringTwo" />

          <div className="emergencyCenter">
            <span className="emergencyLabel">EMERGENCY</span>
            <div className="bracelet">
              <i />
              <div><QRIcon size={28} /></div>
              <i />
            </div>
            <strong>{ka ? "სამაჯური" : "Bracelet"}</strong>
            <small>{ka ? "ინფორმაცია · კონტაქტი · 112" : "Information · Contact · 911"}</small>
          </div>

          <Product
            emoji="🐶"
            name={ka ? "ძაღლი" : "Dog"}
            className="p1"
          />

          <Product
            emoji="🐱"
            name={ka ? "კატა" : "Cat"}
            className="p2"
          />

          <Product
            emoji="👛"
            name={ka ? "საფულე" : "Wallet"}
            className="p3"
          />

          <Product
            emoji="🧳"
            name={ka ? "ჩემოდანი" : "Suitcase"}
            className="p4"
          />

          <Product
            emoji="👜"
            name={ka ? "ჩანთა" : "Bag"}
            className="p5"
          />

          <Product
            emoji="🔑"
            name={ka ? "გასაღები" : "Keys"}
            className="p6"
          />

        </div>

      </div>

      <style jsx>{`

        .productsArea {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .productIntro {
          max-width: 520px;

          text-align: center;
        }

        .productIntro > span {
          color: #1266e9;

          font-size: 8px;
          font-weight: 900;

          letter-spacing: 1.4px;
        }

        .productIntro h2 {
          margin: 8px 0 0;

          color: #17324d;

          font-size: 22px;
          line-height: 1.4;
        }


        /* ORBIT */

        .productCircle {
          width: 480px;
          height: 480px;

          margin-top: 18px;

          position: relative;

          border-radius: 50%;
        }

        .ring {
          position: absolute;

          border-radius: 50%;

          border:
            1px solid rgba(18,102,233,.2);
        }

        .ringOne {
          inset: 45px;
        }

        .ringTwo {
          inset: 104px;

          border-color:
            rgba(18,102,233,.1);
        }


        /* EMERGENCY CENTER */

        .emergencyCenter {
          width: 150px;
          height: 150px;

          position: absolute;

          top: 50%;
          left: 50%;

          transform:
            translate(-50%, -50%);

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #1266e9;

          color: #ffffff;

          box-shadow:
            0 17px 40px rgba(18,79,165,.22);
        }

        .emergencyLabel {
          color: rgba(255,255,255,.76);
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .bracelet {
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bracelet i {
          width: 26px;
          height: 13px;
          display: block;
          background: #ffffff;
        }

        .bracelet div {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          border: 2px solid #ffffff;
          border-radius: 9px;
          color: #1266e9;
          background: #ffffff;
        }

        .emergencyCenter strong {
          margin-top: 7px;
          color: #ffffff;
          font-size: 11px;
        }

        .emergencyCenter small {
          max-width: 118px;
          margin-top: 3px;
          color: rgba(255,255,255,.72);
          font-size: 7px;
          font-weight: 800;
          text-align: center;
        }


        /* PRODUCTS */

        .productCircle :global(.product) {
          width: 92px;

          position: absolute;

          display: flex;
          flex-direction: column;

          align-items: center;
        }

        .productCircle :global(.productEmoji) {
          width: 64px;
          height: 64px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          border: 1px solid #dbe4ee;

          background: #ffffff;

          font-size: 30px;

          box-shadow:
            0 9px 23px rgba(28,67,112,.1);
        }

        .productCircle :global(.productName) {
          margin-top: 8px;

          color:
            #29445f;

          font-size: 13px;
          font-weight: 850;
        }


        /* POSITIONS */

        .productCircle :global(.p1) {
          top: 0;
          left: 120px;
        }

        .productCircle :global(.p2) {
          top: 0;
          right: 120px;
        }

        .productCircle :global(.p3) {
          top: 180px;
          right: 0;
        }

        .productCircle :global(.p4) {
          right: 84px;
          bottom: 2px;
        }

        .productCircle :global(.p5) {
          left: 84px;
          bottom: 2px;
        }

        .productCircle :global(.p6) {
          top: 180px;
          left: 0;
        }


        /* CAPTION */

        .productsCaption {
          max-width: 460px;

          margin: 10px 0 0;

          text-align: center;

          color:
            rgba(255,255,255,.65);

          font-size: 10px;
          line-height: 1.6;
        }


        /* MOBILE */

        @media (max-width: 760px) {

          .productIntro {
            max-width: 330px;
          }

          .productIntro h2 {
            font-size: 16px;
          }

          .productCircle {
            width: 340px;
            height: 340px;

            margin-top: 24px;
          }

          .ringOne {
            inset: 34px;
          }

          .ringTwo {
            inset: 76px;
          }

          .emergencyCenter {
            width: 105px;
            height: 105px;
          }

          .bracelet { margin-top: 5px; }
          .bracelet i { width: 17px; height: 9px; }
          .bracelet div { width: 31px; height: 31px; border-radius: 7px; }
          .emergencyCenter :global(svg) { width: 20px; height: 20px; }
          .emergencyCenter small { max-width: 86px; font-size: 5px; }

          .emergencyCenter strong {
            font-size: 8px;
          }

          .productCircle :global(.product) {
            width: 62px;
          }

          .productCircle :global(.productEmoji) {
            width: 48px;
            height: 48px;

            font-size: 22px;
          }

          .productCircle :global(.productName) {
            font-size: 8px;
          }

          .productCircle :global(.p1) {
            left: 83px;
          }

          .productCircle :global(.p2) {
            right: 83px;
          }

          .productCircle :global(.p3) {
            top: 127px;
          }

          .productCircle :global(.p4) {
            right: 56px;
          }

          .productCircle :global(.p5) {
            left: 56px;
          }

          .productCircle :global(.p6) {
            top: 127px;
          }

        }


        /* VERY SMALL PHONE */

        @media (max-width: 390px) {

          .productCircle {
            width: 310px;
            height: 310px;
          }

          .ringOne {
            inset: 31px;
          }

          .ringTwo {
            inset: 70px;
          }

          .emergencyCenter {
            width: 94px;
            height: 94px;
          }
          .emergencyLabel { font-size: 5px; }
          .bracelet i { width: 14px; }
          .bracelet div { width: 28px; height: 28px; }
          .emergencyCenter small { display: none; }

          .productCircle :global(.productEmoji) {
            width: 44px;
            height: 44px;

            font-size: 20px;
          }

          .productCircle :global(.p1) {
            left: 74px;
          }

          .productCircle :global(.p2) {
            right: 74px;
          }

          .productCircle :global(.p3) {
            top: 116px;
          }

          .productCircle :global(.p4) {
            right: 49px;
          }

          .productCircle :global(.p5) {
            left: 49px;
          }

          .productCircle :global(.p6) {
            top: 116px;
          }

        }

      `}</style>
    </>
  );
}
