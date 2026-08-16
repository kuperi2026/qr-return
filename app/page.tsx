"use client";

import { useState } from "react";

type Lang = "ka" | "en";

const items = [
  { id: "dog", icon: "🐕", ka: "ძაღლი", en: "Dog" },
  { id: "cat", icon: "🐈", ka: "კატა", en: "Cat" },
  { id: "keys", icon: "🔑", ka: "გასაღები", en: "Keys" },
  { id: "wallet", icon: "◫", ka: "საფულე", en: "Wallet" },
  { id: "suitcase", icon: "▣", ka: "ჩემოდანი", en: "Luggage" },
  { id: "bag", icon: "◒", ka: "ჩანთა", en: "Bag" },
];

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("ka");

  const ka = lang === "ka";

  return (
    <main className="site">
      <header className="nav">
        <a href="/" className="brand">
          <span className="brandMark">Q</span>

          <span className="brandText">
            <strong>QR RETURN</strong>
            <small>SMART LOST & FOUND</small>
          </span>
        </a>

        <div className="navRight">
          <div className="language">
            <button
              className={ka ? "active" : ""}
              onClick={() => setLang("ka")}
            >
              GEO
            </button>

            <button
              className={!ka ? "active" : ""}
              onClick={() => setLang("en")}
            >
              ENG
            </button>
          </div>

          <a href="/login" className="login">
            {ka ? "შესვლა" : "Sign in"}
          </a>
        </div>
      </header>

      <section className="hero">
        <div className="eyebrow">
          <span />
          QR RETURN
        </div>

        <h1>
          {ka ? (
            <>
              რაც შენთვის მნიშვნელოვანია,
              <br />
              <em>დაბრუნების გზა აქვს.</em>
            </>
          ) : (
            <>
              What matters to you
              <br />
              <em>has a way back.</em>
            </>
          )}
        </h1>

        <p>
          {ka
            ? "QR ტეგი აკავშირებს მპოვნელს შენთან — სწრაფად, მარტივად და შენ მიერ არჩეული საკონტაქტო ინფორმაციის საშუალებით."
            : "A QR tag connects the finder with you — quickly, simply, and through the contact information you choose."}
        </p>

        <div className="miniProof">
          <span>● No app required</span>
          <span>● Private contact</span>
          <span>● One scan</span>
        </div>
      </section>

      <section className="registerArea">
        <div className="registerHeading">
          <span>QR PROTECTION</span>

          <h2>
            {ka
              ? "მიაბი QR ტეგი სასურველ ცხოველს ან ნივთს და დაიბრუნე მარტივად."
              : "Attach a QR tag to your pet or item and make its way home simple."}
          </h2>
        </div>

        <div className="itemGrid">
          {items.map((item, index) => (
            <a
              key={item.id}
              href={`/register/details?type=${item.id}&lang=${lang}`}
              className="item"
            >
              <div className="itemTop">
                <span className="number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="arrow">↗</span>
              </div>

              <div className="object">
                <span className="objectIcon">{item.icon}</span>

                <span className="qrTag">
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
              </div>

              <strong>{ka ? item.ka : item.en}</strong>
            </a>
          ))}
        </div>
      </section>

      <section className="featureBar">
        <div>
          <strong>01</strong>
          <span>{ka ? "ერთი QR ტეგი" : "One QR tag"}</span>
        </div>

        <div>
          <strong>02</strong>
          <span>{ka ? "შენი არჩევანი" : "Your privacy"}</span>
        </div>

        <div>
          <strong>03</strong>
          <span>{ka ? "სწრაფი დაბრუნება" : "Faster return"}</span>
        </div>
      </section>

      <footer>
        <div className="footerBrand">QR RETURN</div>
        <span>Lost & Found, redesigned.</span>
      </footer>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .site {
          min-height: 100vh;
          background: #fbfcff;
          color: #081426;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .nav {
          width: calc(100% - 48px);
          max-width: 1240px;
          height: 92px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e8edf5;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
        }

        .brandMark {
          width: 47px;
          height: 47px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #155eef;
          color: white;
          font-size: 23px;
          font-weight: 900;
          box-shadow: 0 10px 30px rgba(21, 94, 239, 0.2);
        }

        .brandText {
          display: flex;
          flex-direction: column;
        }

        .brandText strong {
          color: #155eef;
          font-size: 24px;
          letter-spacing: -1px;
        }

        .brandText small {
          margin-top: 3px;
          color: #8793a7;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 2.6px;
        }

        .navRight {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .language {
          display: flex;
          padding: 4px;
          border-radius: 12px;
          background: #eef2f8;
        }

        .language button {
          border: 0;
          padding: 8px 10px;
          border-radius: 9px;
          background: transparent;
          color: #78859a;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
        }

        .language button.active {
          background: white;
          color: #155eef;
          box-shadow: 0 2px 10px rgba(8, 20, 38, 0.08);
        }

        .login {
          padding: 11px 18px;
          border-radius: 11px;
          background: #081426;
          color: white;
          text-decoration: none;
          font-size: 13px;
          font-weight: 800;
        }

        .hero {
          max-width: 1100px;
          margin: auto;
          padding: 120px 24px 115px;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #155eef;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 2.5px;
        }

        .eyebrow span {
          width: 28px;
          height: 2px;
          background: #155eef;
        }

        h1 {
          max-width: 1000px;
          margin: 25px 0 0;
          color: #081426;
          font-size: clamp(50px, 7vw, 88px);
          line-height: 0.99;
          letter-spacing: -5px;
          font-weight: 800;
        }

        h1 em {
          color: #155eef;
          font-style: normal;
        }

        .hero p {
          max-width: 650px;
          margin: 35px 0 0;
          color: #64748b;
          font-size: 18px;
          line-height: 1.75;
        }

        .miniProof {
          display: flex;
          gap: 25px;
          margin-top: 32px;
          color: #8190a5;
          font-size: 11px;
          font-weight: 700;
        }

        .miniProof span::first-letter {
          color: #155eef;
        }

        .registerArea {
          padding: 100px 24px 120px;
          background: #071426;
        }

        .registerHeading {
          max-width: 1100px;
          margin: auto;
        }

        .registerHeading > span {
          color: #6ea1ff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 2.5px;
        }

        .registerHeading h2 {
          max-width: 900px;
          margin: 18px 0 55px;
          color: white;
          font-size: clamp(32px, 4vw, 51px);
          line-height: 1.16;
          letter-spacing: -2.2px;
        }

        .itemGrid {
          max-width: 1100px;
          margin: auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .item {
          min-height: 270px;
          padding: 25px;
          border: 1px solid #243247;
          border-radius: 22px;
          background: #0d1b2e;
          color: white;
          text-decoration: none;
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease;
        }

        .item:hover {
          transform: translateY(-4px);
          border-color: #377dff;
          background: #11233c;
        }

        .itemTop {
          display: flex;
          justify-content: space-between;
        }

        .number {
          color: #61718a;
          font-size: 11px;
          font-weight: 800;
        }

        .arrow {
          color: #6ea1ff;
          font-size: 18px;
        }

        .object {
          position: relative;
          width: 125px;
          height: 125px;
          margin: 28px auto 22px;
          display: grid;
          place-items: center;
          border-radius: 35px;
          background: linear-gradient(145deg, #162941, #0a1728);
        }

        .objectIcon {
          font-size: 63px;
        }

        .qrTag {
          position: absolute;
          right: -5px;
          bottom: 7px;
          width: 38px;
          height: 38px;
          padding: 7px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3px;
          border-radius: 9px;
          background: white;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
        }

        .qrTag i {
          display: block;
          background: #071426;
          border-radius: 1px;
        }

        .item strong {
          display: block;
          text-align: center;
          font-size: 18px;
        }

        .featureBar {
          max-width: 1100px;
          margin: auto;
          padding: 55px 24px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-bottom: 1px solid #e6ebf2;
        }

        .featureBar div {
          display: flex;
          align-items: center;
          gap: 15px;
          justify-content: center;
        }

        .featureBar strong {
          color: #155eef;
          font-size: 11px;
        }

        .featureBar span {
          color: #42526a;
          font-size: 13px;
          font-weight: 800;
        }

        footer {
          max-width: 1100px;
          margin: auto;
          padding: 45px 24px 60px;
          display: flex;
          justify-content: space-between;
          color: #94a3b8;
          font-size: 11px;
        }

        .footerBrand {
          color: #155eef;
          font-size: 16px;
          font-weight: 900;
        }

        @media (max-width: 720px) {
          .nav {
            width: calc(100% - 28px);
          }

          .brandText strong {
            font-size: 20px;
          }

          .brandText small {
            display: none;
          }

          .hero {
            padding-top: 80px;
          }

          h1 {
            letter-spacing: -3px;
          }

          .miniProof {
            flex-wrap: wrap;
          }

          .itemGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .item {
            min-height: 220px;
            padding: 18px;
          }

          .object {
            width: 95px;
            height: 95px;
          }

          .objectIcon {
            font-size: 50px;
          }

          .featureBar {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          footer {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </main>
  );
}
