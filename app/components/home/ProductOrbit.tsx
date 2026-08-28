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
              ? "7 QR პროდუქტი ნივთების, ცხოველებისა და უსაფრთხოებისთვის."
              : "7 QR products for belongings, pets and safety."}
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

        <p className="productsCaption">
          {ka
            ? "6 კატეგორია და Emergency სამაჯური — ერთი დაცული QR RETURN სისტემით."
            : "6 categories and an Emergency bracelet — one secure QR RETURN system."}
        </p>

      </div>

      <style jsx>{`

        .productsArea {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .productIntro {
          max-width: 440px;

          text-align: center;
        }

        .productIntro > span {
          color: rgba(255,255,255,.65);

          font-size: 8px;
          font-weight: 900;

          letter-spacing: 1.4px;
        }

        .productIntro h2 {
          margin: 8px 0 0;

          color: #ffffff;

          font-size: 18px;
          line-height: 1.4;
        }


        /* ORBIT */

        .productCircle {
          width: 450px;
          height: 450px;

          margin-top: 18px;

          position: relative;

          border-radius: 50%;
        }

        .ring {
          position: absolute;

          border-radius: 50%;

          border:
            1px solid rgba(255,255,255,.19);
        }

        .ringOne {
          inset: 42px;
        }

        .ringTwo {
          inset: 98px;

          border-color:
            rgba(255,255,255,.1);
        }


        /* EMERGENCY CENTER */

        .emergencyCenter {
          width: 154px;
          height: 154px;

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

          background: #ffffff;

          color: #1266e9;

          box-shadow:
            0 17px 40px rgba(0,0,0,.14);
        }

        .emergencyLabel {
          color: #1266e9;
          font-size: 6px;
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
          width: 25px;
          height: 13px;
          display: block;
          background: #1266e9;
        }

        .bracelet div {
          width: 45px;
          height: 45px;
          display: grid;
          place-items: center;
          border: 2px solid #1266e9;
          border-radius: 9px;
          color: #1266e9;
          background: #ffffff;
        }

        .emergencyCenter strong {
          margin-top: 7px;
          color: #223a55;
          font-size: 9px;
        }

        .emergencyCenter small {
          max-width: 116px;
          margin-top: 3px;
          color: #8593a4;
          font-size: 6px;
          font-weight: 800;
          text-align: center;
        }


        /* PRODUCTS */

        .productCircle :global(.product) {
          width: 82px;

          position: absolute;

          display: flex;
          flex-direction: column;

          align-items: center;
        }

        .productCircle :global(.productEmoji) {
          width: 62px;
          height: 62px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #ffffff;

          font-size: 28px;

          box-shadow:
            0 9px 23px rgba(0,0,0,.12);
        }

        .productCircle :global(.productName) {
          margin-top: 7px;

          color:
            rgba(255,255,255,.9);

          font-size: 9px;
          font-weight: 800;
        }


        /* POSITIONS */

        .productCircle :global(.p1) {
          top: 0;
          left: 112px;
        }

        .productCircle :global(.p2) {
          top: 0;
          right: 112px;
        }

        .productCircle :global(.p3) {
          top: 170px;
          right: 0;
        }

        .productCircle :global(.p4) {
          right: 80px;
          bottom: 2px;
        }

        .productCircle :global(.p5) {
          left: 80px;
          bottom: 2px;
        }

        .productCircle :global(.p6) {
          top: 170px;
          left: 0;
        }


        /* CAPTION */

        .productsCaption {
          max-width: 390px;

          margin: 8px 0 0;

          text-align: center;

          color:
            rgba(255,255,255,.65);

          font-size: 9px;
          line-height: 1.55;
        }


        /* MOBILE */

        @media (max-width: 650px) {

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
