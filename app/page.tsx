"use client";

import { useState } from "react";
import HomeHeader from "./components/home/HomeHeader";

type Lang = "ka" | "en";

export default function HomePage() {
  const [language, setLanguage] = useState<Lang>("ka");

  const ka = language === "ka";

  return (
    <>
      <HomeHeader
        language={language}
        onLanguageChange={setLanguage}
      />

      <main>
        <section className="protectSection">
          <div className="protectInner">

            {/* LEFT — EMERGENCY */}
            <div className="emergencySide">
              <div className="sectionLabel">
                <span className="labelLine" />
                <span>EMERGENCY</span>
              </div>

              <h1>
                {ka
                  ? "საჭირო ინფორმაცია მაშინ, როცა ყოველი წამი მნიშვნელოვანია."
                  : "Essential information when every second matters."}
              </h1>

              <p className="introText">
                {ka
                  ? "QR RETURN Emergency პროფილი საშუალებას აძლევს დამხმარე ადამიანს ერთი სკანირებით ნახოს თქვენ მიერ წინასწარ არჩეული მნიშვნელოვანი ინფორმაცია."
                  : "A QR RETURN Emergency profile lets a helper access the important information you choose to share with one scan."}
              </p>

              <div className="emergencyCard">
                <div className="medicalIcon">
                  <MedicalIcon />
                </div>

                <div>
                  <span className="smallLabel">
                    QR RETURN
                  </span>

                  <h3>
                    {ka
                      ? "Emergency პროფილი"
                      : "Emergency Profile"}
                  </h3>

                  <p>
                    {ka
                      ? "საკონტაქტო პირი და აუცილებელი ინფორმაცია ხელმისაწვდომია ერთი QR სკანირებით."
                      : "Emergency contacts and essential information available with one QR scan."}
                  </p>
                </div>
              </div>

              <div className="emergencyActions">
                <a href="/store" className="primaryButton">
                  {ka
                    ? "Emergency პროდუქტის ნახვა"
                    : "View Emergency Product"}
                </a>

                <a href="#how-it-works" className="textButton">
                  {ka ? "როგორ მუშაობს" : "How it works"}
                  <span>→</span>
                </a>
              </div>

              <div className="miniFeatures">
                <div>
                  <CheckIcon />
                  <span>
                    {ka ? "სწრაფი წვდომა" : "Fast access"}
                  </span>
                </div>

                <div>
                  <CheckIcon />
                  <span>
                    {ka ? "თქვენი კონტროლი" : "Your control"}
                  </span>
                </div>

                <div>
                  <CheckIcon />
                  <span>
                    {ka ? "აპლიკაციის გარეშე" : "No app required"}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT — QR CIRCLE */}
            <div className="qrSide">
              <div className="productCircle">

                <div className="orbit orbitOne" />
                <div className="orbit orbitTwo" />

                {/* CENTER */}
                <div className="qrCenter">
                  <div className="qrIcon">
                    <QRIcon />
                  </div>

                  <strong>QR RETURN</strong>

                  <span>
                    {ka
                      ? "ერთი სკანირება"
                      : "ONE SCAN"}
                  </span>
                </div>

                {/* DOG */}
                <div className="product productDog">
                  <div className="productIcon">
                    <DogIcon />
                  </div>
                  <span>{ka ? "ძაღლი" : "Dog"}</span>
                </div>

                {/* CAT */}
                <div className="product productCat">
                  <div className="productIcon">
                    <CatIcon />
                  </div>
                  <span>{ka ? "კატა" : "Cat"}</span>
                </div>

                {/* WALLET */}
                <div className="product productWallet">
                  <div className="productIcon">
                    <WalletIcon />
                  </div>
                  <span>{ka ? "საფულე" : "Wallet"}</span>
                </div>

                {/* KEYS */}
                <div className="product productKeys">
                  <div className="productIcon">
                    <KeyIcon />
                  </div>
                  <span>{ka ? "გასაღები" : "Keys"}</span>
                </div>

                {/* BAG */}
                <div className="product productBag">
                  <div className="productIcon">
                    <BagIcon />
                  </div>
                  <span>{ka ? "ჩანთა" : "Bag"}</span>
                </div>

                {/* SUITCASE */}
                <div className="product productSuitcase">
                  <div className="productIcon">
                    <SuitcaseIcon />
                  </div>
                  <span>{ka ? "ჩემოდანი" : "Suitcase"}</span>
                </div>

              </div>

              <p className="circleCaption">
                {ka
                  ? "ერთი სისტემა თქვენი მნიშვნელოვანი ნივთებისა და საყვარელი ცხოველებისთვის."
                  : "One system for your important belongings and pets."}
              </p>
            </div>

          </div>
        </section>
      </main>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .protectSection {
          width: 100%;
          overflow: hidden;
          background: #ffffff;
          border-bottom: 1px solid #edf1f5;
        }

        .protectInner {
          width: calc(100% - 80px);
          max-width: 1240px;
          min-height: 650px;
          margin: 0 auto;
          padding: 75px 0 80px;

          display: grid;
          grid-template-columns: 0.92fr 1.08fr;
          align-items: center;
          gap: 85px;
        }

        /* LEFT */

        .emergencySide {
          max-width: 520px;
        }

        .sectionLabel {
          display: flex;
          align-items: center;
          gap: 10px;

          color: #1266e9;

          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1.2px;
        }

        .labelLine {
          width: 28px;
          height: 1px;
          background: #1266e9;
        }

        h1 {
          margin: 18px 0 0;

          color: #172b43;

          font-size: clamp(38px, 4vw, 52px);
          font-weight: 780;
          line-height: 1.08;
          letter-spacing: -1.9px;
        }

        .introText {
          max-width: 500px;
          margin: 21px 0 0;

          color: #6a788a;

          font-size: 15px;
          line-height: 1.75;
        }

        /* EMERGENCY CARD */

        .emergencyCard {
          margin-top: 29px;
          padding: 19px;

          display: grid;
          grid-template-columns: 48px 1fr;
          gap: 15px;
          align-items: start;

          border: 1px solid #e0e8f2;
          border-radius: 14px;

          background: #f9fbfe;
        }

        .medicalIcon {
          width: 48px;
          height: 48px;

          display: grid;
          place-items: center;

          border-radius: 11px;

          color: #1266e9;
          background: #eaf3ff;
        }

        .smallLabel {
          color: #1266e9;

          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .emergencyCard h3 {
          margin: 5px 0 0;

          color: #263b53;

          font-size: 15px;
          font-weight: 800;
        }

        .emergencyCard p {
          max-width: 380px;
          margin: 7px 0 0;

          color: #758397;

          font-size: 12px;
          line-height: 1.6;
        }

        /* BUTTONS */

        .emergencyActions {
          margin-top: 22px;

          display: flex;
          align-items: center;
          gap: 19px;
        }

        .primaryButton {
          min-height: 45px;
          padding: 0 17px;

          display: inline-flex;
          align-items: center;

          border-radius: 9px;

          color: #ffffff;
          background: #1266e9;

          text-decoration: none;

          font-size: 11px;
          font-weight: 850;
        }

        .textButton {
          display: inline-flex;
          align-items: center;
          gap: 7px;

          color: #53657a;

          text-decoration: none;

          font-size: 11px;
          font-weight: 800;
        }

        .textButton span {
          color: #1266e9;
        }

        /* MINI FEATURES */

        .miniFeatures {
          margin-top: 27px;

          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }

        .miniFeatures div {
          display: flex;
          align-items: center;
          gap: 6px;

          color: #718095;

          font-size: 10px;
          font-weight: 700;
        }

        /* RIGHT */

        .qrSide {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .productCircle {
          width: 510px;
          height: 510px;

          position: relative;

          border-radius: 50%;

          background:
            radial-gradient(
              circle at center,
              #f4f8ff 0%,
              #ffffff 64%
            );
        }

        .orbit {
          position: absolute;
          border-radius: 50%;
          border: 1px solid #dce9fa;
        }

        .orbitOne {
          inset: 52px;
        }

        .orbitTwo {
          inset: 100px;
          border-color: #edf3fb;
        }

        /* CENTER QR */

        .qrCenter {
          width: 150px;
          height: 150px;

          position: absolute;
          z-index: 4;

          top: 50%;
          left: 50%;

          transform: translate(-50%, -50%);

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          border: 1px solid #cfe0f7;
          border-radius: 50%;

          background: #ffffff;

          box-shadow:
            0 14px 35px
            rgba(32, 79, 140, 0.09);
        }

        .qrIcon {
          color: #1266e9;
        }

        .qrCenter strong {
          margin-top: 8px;

          color: #20364f;

          font-size: 12px;
          font-weight: 900;
        }

        .qrCenter span {
          margin-top: 3px;

          color: #8a97a6;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        /* PRODUCTS */

        .product {
          width: 86px;

          position: absolute;
          z-index: 5;

          display: flex;
          flex-direction: column;
          align-items: center;

          text-align: center;
        }

        .productIcon {
          width: 64px;
          height: 64px;

          display: grid;
          place-items: center;

          border: 1px solid #dce7f5;
          border-radius: 50%;

          color: #1266e9;
          background: #ffffff;

          box-shadow:
            0 8px 20px
            rgba(31, 73, 125, 0.07);
        }

        .product span {
          margin-top: 7px;

          color: #516276;

          font-size: 9px;
          font-weight: 800;
        }

        .productDog {
          top: 5px;
          left: 137px;
        }

        .productCat {
          top: 5px;
          right: 137px;
        }

        .productWallet {
          top: 195px;
          right: 0;
        }

        .productKeys {
          bottom: 15px;
          right: 95px;
        }

        .productBag {
          bottom: 15px;
          left: 95px;
        }

        .productSuitcase {
          top: 195px;
          left: 0;
        }

        .circleCaption {
          max-width: 420px;
          margin: 9px auto 0;

          color: #8793a1;

          text-align: center;

          font-size: 10px;
          line-height: 1.55;
        }

        /* RESPONSIVE */

        @media (max-width: 1000px) {
          .protectInner {
            grid-template-columns: 1fr;
            gap: 55px;
          }

          .emergencySide {
            max-width: 650px;
            margin: 0 auto;
            text-align: center;
          }

          .sectionLabel,
          .emergencyActions,
          .miniFeatures {
            justify-content: center;
          }

          .emergencyCard {
            text-align: left;
          }
        }

        @media (max-width: 620px) {
          .protectInner {
            width: calc(100% - 28px);
            padding: 55px 0 65px;
          }

          h1 {
            font-size: 38px;
            letter-spacing: -1.4px;
          }

          .introText {
            font-size: 14px;
          }

          .productCircle {
            width: 350px;
            height: 350px;
          }

          .orbitOne {
            inset: 38px;
          }

          .orbitTwo {
            inset: 75px;
          }

          .qrCenter {
            width: 112px;
            height: 112px;
          }

          .product {
            width: 65px;
          }

          .productIcon {
            width: 48px;
            height: 48px;
          }

          .productDog {
            top: 0;
            left: 92px;
          }

          .productCat {
            top: 0;
            right: 92px;
          }

          .productWallet {
            top: 132px;
            right: 0;
          }

          .productKeys {
            right: 63px;
            bottom: 5px;
          }

          .productBag {
            left: 63px;
            bottom: 5px;
          }

          .productSuitcase {
            top: 132px;
            left: 0;
          }

          .emergencyActions {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}

/* ICONS */

function QRIcon() {
  return (
    <svg
      width="43"
      height="43"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="15" width="6" height="6" rx="1" />
      <path d="M14 14h3v3h4M14 21v-4M18 18h3v3" />
    </svg>
  );
}

function MedicalIcon() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1266e9"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  );
}

function DogIcon() {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M6 8 3 5v7l3 3" />
      <path d="m18 8 3-3v7l-3 3" />
      <path d="M6 8c1-2 3-3 6-3s5 1 6 3v7c0 3-2 5-6 5s-6-2-6-5V8Z" />
      <circle cx="9" cy="12" r=".7" fill="currentColor" />
      <circle cx="15" cy="12" r=".7" fill="currentColor" />
      <path d="M10 16h4" />
    </svg>
  );
}

function CatIcon() {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="m6 8-2-5 5 3" />
      <path d="m18 8 2-5-5 3" />
      <path d="M6 8c1-2 3-3 6-3s5 1 6 3v7c0 3-2 5-6 5s-6-2-6-5V8Z" />
      <circle cx="9" cy="12" r=".7" fill="currentColor" />
      <circle cx="15" cy="12" r=".7" fill="currentColor" />
      <path d="m11 15 1 1 1-1" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 9h18" />
      <path d="M16 12h5v4h-5a2 2 0 0 1 0-4Z" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <circle cx="8" cy="12" r="4" />
      <path d="M12 12h9M18 12v3M15 12v2" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M5 8h14l1 12H4L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function SuitcaseIcon() {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect x="5" y="6" width="14" height="14" rx="2" />
      <path d="M9 6V4h6v2M9 10v6M15 10v6" />
      <path d="M8 22h1M15 22h1" />
    </svg>
  );
}
