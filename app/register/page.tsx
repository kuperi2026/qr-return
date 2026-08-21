"use client";

import { useState } from "react";

type Language = "ka" | "en";

const categories = [
  { id: "dog", icon: "🐕", ka: "ძაღლი", en: "Dog", number: "01" },
  { id: "cat", icon: "🐈", ka: "კატა", en: "Cat", number: "02" },
  { id: "keys", icon: "🔑", ka: "გასაღები", en: "Keys", number: "03" },
  { id: "wallet", icon: "👛", ka: "საფულე", en: "Wallet", number: "04" },
  { id: "suitcase", icon: "🧳", ka: "ჩემოდანი", en: "Suitcase", number: "05" },
  { id: "bag", icon: "🎒", ka: "ჩანთა", en: "Bag", number: "06" },
];

export default function RegisterPage() {
  const [language, setLanguage] = useState<Language>("ka");

  const ka = language === "ka";

  return (
    <main className="page">
      <header className="header">
        <a href="/" className="brand">
          <div className="brandMark">QR</div>

          <div>
            <div className="brandName">QR RETURN</div>
            <div className="brandSub">SMART LOST & FOUND</div>
          </div>
        </a>

        <div className="headerRight">
          <a href="/" className="back">
            ← {ka ? "მთავარი" : "Home"}
          </a>

          <a href="/login" className="login">
            {ka ? "შესვლა" : "Sign in"}
          </a>

          <div className="language">
            <button
              type="button"
              className={ka ? "selected" : ""}
              onClick={() => setLanguage("ka")}
            >
              GEO
            </button>

            <button
              type="button"
              className={!ka ? "selected" : ""}
              onClick={() => setLanguage("en")}
            >
              ENG
            </button>
          </div>
        </div>
      </header>

      <section className="registration">
        <div className="inner">
          <div className="label">QR RETURN</div>

          <h1>
            {ka
              ? "დაარეგისტრირეთ სასურველი ნივთი ან ცხოველი."
              : "Register your item or pet."}
          </h1>

          <div className="grid">
            {categories.map((item) => (
              <a
                key={item.id}
                href={`/register/${item.id}`}
                className="card"
              >
                <div className="cardTop">
                  <span>{item.number}</span>
                  <span className="arrow">↗</span>
                </div>

                <div className="iconWrap">
                  <div className="icon">{item.icon}</div>

                  <div className="qrTag">
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                </div>

                <div className="name">
                  {ka ? item.ka : item.en}
                </div>
              </a>
            ))}
          </div>
        </div>
      <div className="emergencyBanner">
        <div className="emergencyIcon">✚</div>
        <div>
          <div className="emergencyEyebrow">QR RETURN EMERGENCY</div>
          <h2>Emergency Bracelet ადამიანებისთვის</h2>
          <p>ცალკე უსაფრთხოების პროფილი, საგანგებო კონტაქტები და ლოკაციის გაზიარება.</p>
        </div>
        <a href="/emergency/register" className="emergencyButton">რეგისტრაცია →</a>
      </div>
      </section>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          background: #071321;
          color: white;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Arial,
            sans-serif;
        }

        .emergencyBanner {
          max-width: 1132px;
          margin: 0 auto 32px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          border: 1px solid rgba(255, 151, 80, 0.35);
          border-radius: 20px;
          background: linear-gradient(135deg, #32191b, #1d1720);
        }

        .emergencyIcon {
          width: 44px;
          height: 44px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          border-radius: 14px;
          color: #2a1715;
          background: #ffb36b;
          font-size: 22px;
          font-weight: 900;
        }

        .emergencyEyebrow {
          color: #ffb36b;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .emergencyBanner h2 {
          margin: 5px 0 0;
          color: #fff7ed;
          font-size: 18px;
        }

        .emergencyBanner p {
          margin: 5px 0 0;
          color: #e9cfc3;
          font-size: 12px;
        }

        .emergencyButton {
          margin-left: auto;
          flex: 0 0 auto;
          padding: 12px 16px;
          border-radius: 11px;
          color: #2a1715;
          background: #ffb36b;
          text-decoration: none;
          font-size: 12px;
          font-weight: 900;
        }

        .header {
          max-width: 1180px;
          min-height: 92px;
          margin: auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 13px;
          text-decoration: none;
        }

        .brandMark {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #1465e8;
          color: white;
          font-size: 15px;
          font-weight: 900;
        }

        .brandName {
          color: #5b9cff;
          font-size: 24px;
          font-weight: 950;
          letter-spacing: -1px;
        }

        .brandSub {
          margin-top: 5px;
          color: #64748b;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 2.3px;
        }

        .headerRight,
        .language {
          display: flex;
          align-items: center;
        }

        .headerRight {
          gap: 11px;
        }

        .back,
        .login {
          color: #c2ccda;
          text-decoration: none;
          font-size: 12px;
          font-weight: 800;
          padding: 9px 12px;
        }

        .login {
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 10px;
        }

        .language {
          padding: 4px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 10px;
        }

        .language button {
          border: 0;
          background: transparent;
          color: #71839a;
          padding: 7px 9px;
          border-radius: 8px;
          font-size: 9px;
          font-weight: 900;
          cursor: pointer;
        }

        .language .selected {
          background: #1465e8;
          color: white;
        }

        .registration {
          background:
            radial-gradient(
              circle at 15% 15%,
              #153c6e 0%,
              transparent 34%
            ),
            radial-gradient(
              circle at 88% 70%,
              #102a50 0%,
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #071321,
              #091b30
            );
          min-height: calc(100vh - 92px);
          padding: 90px 24px 120px;
        }

        .inner {
          max-width: 1100px;
          margin: auto;
        }

        .label {
          color: #61a0ff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 3px;
        }

        h1 {
          max-width: 800px;
          margin: 20px 0 55px;
          font-size: clamp(40px, 6vw, 68px);
          line-height: 1.04;
          letter-spacing: -3px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .card {
          min-height: 270px;
          padding: 25px;
          border-radius: 25px;
          border: 1px solid rgba(120, 170, 230, 0.23);
          background:
            linear-gradient(
              145deg,
              rgba(24, 64, 112, 0.75),
              rgba(12, 30, 53, 0.8)
            );
          box-shadow:
            0 22px 55px rgba(0, 0, 0, 0.13);

          text-decoration: none;
          color: white;
          cursor: pointer;

          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease;
        }

        .card:hover {
          transform: translateY(-4px);
          border-color: #5fa2ff;
          background:
            linear-gradient(
              145deg,
              rgba(32, 78, 135, 0.88),
              rgba(14, 36, 65, 0.9)
            );
        }

        .cardTop {
          display: flex;
          justify-content: space-between;
          color: #8ea3bd;
          font-size: 11px;
          font-weight: 850;
        }

        .arrow {
          color: #5fa2ff;
          font-size: 20px;
        }

        .iconWrap {
          width: 115px;
          height: 115px;
          margin: 30px auto 22px;
          border-radius: 31px;
          background:
            linear-gradient(
              145deg,
              #173d69,
              #0c213b
            );
          display: grid;
          place-items: center;
          position: relative;
        }

        .icon {
          font-size: 60px;
        }

        .qrTag {
          width: 39px;
          height: 39px;
          position: absolute;
          right: -5px;
          bottom: 5px;
          padding: 7px;
          border-radius: 9px;
          background: white;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3px;
        }

        .qrTag i {
          background: #071321;
        }

        .name {
          text-align: center;
          font-size: 18px;
          font-weight: 850;
        }

        @media (max-width: 760px) {
          .brandSub {
            display: none;
          }

          .grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .back {
            display: none;
          }

          .card {
            min-height: 220px;
            padding: 18px;
          }

          .iconWrap {
            width: 90px;
            height: 90px;
          }

          .icon {
            font-size: 48px;
          }
        }
      `}</style>
    </main>
  );
}
