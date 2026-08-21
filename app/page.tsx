"use client";

import { useState } from "react";

type Lang = "ka" | "en";
type Menu = "buy" | "order" | "about" | "faq" | null;

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("ka");
  const [openMenu, setOpenMenu] = useState<Menu>(null);

  const ka = lang === "ka";

  function toggleMenu(menu: Menu) {
    setOpenMenu((current) => (current === menu ? null : menu));
  }

  return (
    <main className="page">
      {/* HEADER */}
      <header className="header">
        <a href="/" className="brand">
          QR RETURN
        </a>

        <nav className="nav">
          <button onClick={() => toggleMenu("buy")}>
            {ka ? "ონლაინ შეძენა" : "Online purchase"} <span>⌄</span>
          </button>

          <button onClick={() => toggleMenu("order")}>
            {ka ? "ონლაინ შეკვეთა" : "Online order"} <span>⌄</span>
          </button>

          <button onClick={() => toggleMenu("about")}>
            {ka ? "ჩვენს შესახებ" : "About us"} <span>⌄</span>
          </button>

          <button onClick={() => toggleMenu("faq")}>
            {ka ? "50 კითხვა" : "50 questions"} <span>⌄</span>
          </button>
        </nav>

        <div className="headerActions">
          <div className="language">
            <button
              className={ka ? "active" : ""}
              onClick={() => setLang("ka")}
            >
              GEO
            </button>

            <span>/</span>

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

          <a href="/signup" className="create">
            {ka ? "ანგარიშის შექმნა" : "Create account"}
          </a>

          <a href="/admin" className="admin">
            Admin Panel
          </a>
        </div>
      </header>

      {/* DROPDOWN */}
      {openMenu && (
        <section className="dropdown">
          <button
            className="close"
            onClick={() => setOpenMenu(null)}
            aria-label="Close"
          >
            ×
          </button>

          {openMenu === "buy" && (
            <>
              <span className="dropLabel">QR RETURN</span>
              <h2>{ka ? "ონლაინ შეძენა" : "Online purchase"}</h2>
              <p>
                {ka
                  ? "აირჩიეთ თქვენთვის სასურველი QR პროდუქტი შინაური ცხოველის ან პირადი ნივთის დასაცავად."
                  : "Choose a QR product for your pet or personal belongings."}
              </p>
              <a href="/store">
                {ka ? "პროდუქტების ნახვა →" : "View products →"}
              </a>
            </>
          )}

          {openMenu === "order" && (
            <>
              <span className="dropLabel">QR RETURN</span>
              <h2>{ka ? "ონლაინ შეკვეთა" : "Online order"}</h2>
              <p>
                {ka
                  ? "შეუკვეთეთ QR RETURN პროდუქტი ონლაინ და დააკავშირეთ იგი თქვენს ანგარიშთან."
                  : "Order your QR RETURN product online and connect it to your account."}
              </p>
              <a href="/store">
                {ka ? "შეკვეთის დაწყება →" : "Start order →"}
              </a>
            </>
          )}

          {openMenu === "about" && (
            <>
              <span className="dropLabel">QR RETURN</span>
              <h2>{ka ? "ჩვენს შესახებ" : "About us"}</h2>
              <p>
                {ka
                  ? "QR RETURN ქმნის მარტივ კავშირს დაკარგული ნივთის ან შინაური ცხოველის მპოვნელსა და მფლობელს შორის."
                  : "QR RETURN creates a simple connection between the finder of a lost item or pet and its owner."}
              </p>
            </>
          )}

          {openMenu === "faq" && (
            <>
              <span className="dropLabel">HELP CENTER</span>
              <h2>
                {ka
                  ? "50 კითხვა პროდუქტის შესახებ"
                  : "50 product questions"}
              </h2>
              <p>
                {ka
                  ? "როგორ მუშაობს QR კოდი, რეგისტრაცია, ლოკაციის გაზიარება, უსაფრთხოება და სხვა მნიშვნელოვანი ინფორმაცია."
                  : "Learn about QR codes, registration, location sharing, security and other important features."}
              </p>
            </>
          )}
        </section>
      )}

      {/* HERO */}
      <section className="hero">
        {/* EMERGENCY BRACELET */}
        <div className="emergency">
          <div className="emergencyTop">
            <span className="medicalIcon">+</span>
            <span className="smallTitle">
              {ka ? "უსაფრთხოება ყოველდღე" : "Everyday safety"}
            </span>
          </div>

          <h1>
            Emergency
            <br />
            Bracelet
          </h1>

          <p>
            {ka
              ? "QR სამაჯური მნიშვნელოვანი ინფორმაციის სწრაფად სანახავად საგანგებო სიტუაციაში."
              : "A QR bracelet for quick access to important information in an emergency."}
          </p>

          <div className="emergencyPoints">
            <span>
              <b>01</b>
              {ka ? "ერთი სკანირება" : "One scan"}
            </span>

            <span>
              <b>02</b>
              {ka ? "სწრაფი ინფორმაცია" : "Quick information"}
            </span>

            <span>
              <b>03</b>
              {ka ? "მარტივი დაკავშირება" : "Easy contact"}
            </span>
          </div>

          <a href="/emergency" className="learnMore">
            {ka ? "გაიგეთ მეტი" : "Learn more"} →
          </a>
        </div>

        {/* QR ORBIT */}
        <div className="visual">
          <div className="orbit">
            <div className="orbitLine" />

            <div className="product dog">
              <DogIcon />
            </div>

            <div className="product cat">
              <CatIcon />
            </div>

            <div className="product keys">
              <KeyIcon />
            </div>

            <div className="product wallet">
              <WalletIcon />
            </div>

            <div className="product suitcase">
              <SuitcaseIcon />
            </div>

            <div className="product bag">
              <BagIcon />
            </div>

            <div className="qr">
              <QRIcon />
            </div>
          </div>
        </div>
      </section>

      {/* SMALL INFO */}
      <section className="bottomInfo">
        <div>
          <strong>{ka ? "ერთი QR." : "One QR."}</strong>
          <span>
            {ka
              ? "მარტივი გზა მფლობელთან დასაკავშირებლად."
              : "A simple way to connect with the owner."}
          </span>
        </div>

        <div>
          <strong>{ka ? "თქვენ აკონტროლებთ." : "You stay in control."}</strong>
          <span>
            {ka
              ? "თქვენ ირჩევთ რომელი ინფორმაცია გამოჩნდება."
              : "You choose what information is visible."}
          </span>
        </div>

        <div>
          <strong>{ka ? "მარტივი სკანირება." : "Simple scanning."}</strong>
          <span>
            {ka
              ? "მპოვნელს აპლიკაციის ჩამოტვირთვა არ სჭირდება."
              : "The finder does not need to download an app."}
          </span>
        </div>
      </section>

      {/* LIVE CHAT */}
      <a href="/support" className="liveChat">
        <span className="chatDot" />
        Live Chat
      </a>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          color: #ffffff;
          background:
            radial-gradient(
              circle at 78% 48%,
              rgba(64, 132, 255, 0.22),
              transparent 28%
            ),
            linear-gradient(135deg, #071d55 0%, #0b43ad 55%, #0862dc 100%);
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Arial,
            sans-serif;
        }

        /* HEADER */

        .header {
          min-height: 88px;
          padding: 0 34px;

          display: flex;
          align-items: center;

          border-bottom: 1px solid rgba(255, 255, 255, 0.16);
        }

        .brand {
          flex: 0 0 auto;

          color: #ffffff;
          text-decoration: none;

          font-size: 22px;
          font-weight: 900;
          letter-spacing: -0.5px;
        }

        .nav {
          margin-left: 55px;

          display: flex;
          align-items: center;
          gap: 7px;
        }

        .nav button {
          padding: 12px 10px;

          border: 0;
          background: transparent;
          color: rgba(255, 255, 255, 0.82);

          font-family: inherit;
          font-size: 13px;
          font-weight: 650;

          cursor: pointer;
          white-space: nowrap;
        }

        .nav button:hover {
          color: #ffffff;
        }

        .nav span {
          margin-left: 4px;
          opacity: 0.6;
        }

        .headerActions {
          margin-left: auto;

          display: flex;
          align-items: center;
          gap: 11px;
        }

        .language {
          display: flex;
          align-items: center;
          gap: 7px;

          margin-right: 6px;
        }

        .language button {
          border: 0;
          padding: 4px 0;

          background: transparent;
          color: rgba(255, 255, 255, 0.55);

          font-size: 13px;
          font-weight: 750;

          cursor: pointer;
        }

        .language button.active {
          color: #ffffff;
        }

        .language span {
          color: rgba(255, 255, 255, 0.3);
        }

        .login,
        .create,
        .admin {
          min-height: 43px;
          padding: 0 15px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border-radius: 10px;

          text-decoration: none;
          font-size: 13px;
          font-weight: 750;

          white-space: nowrap;
        }

        .login {
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.25);
        }

        .create {
          color: #0a3b9d;
          background: #ffffff;
        }

        .admin {
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.45);
        }

        /* DROPDOWN */

        .dropdown {
          position: relative;
          z-index: 20;

          width: calc(100% - 68px);
          max-width: 1100px;

          margin: 12px auto 0;
          padding: 26px 30px;

          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 18px;

          background: rgba(255, 255, 255, 0.97);
          color: #10234c;

          box-shadow: 0 20px 60px rgba(0, 20, 70, 0.22);
        }

        .dropLabel {
          color: #1768e5;
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 1.4px;
        }

        .dropdown h2 {
          margin: 8px 0 7px;
          font-size: 22px;
        }

        .dropdown p {
          max-width: 720px;
          margin: 0;

          color: #64718a;
          font-size: 14px;
          line-height: 1.65;
        }

        .dropdown a {
          display: inline-block;
          margin-top: 14px;

          color: #1768e5;
          text-decoration: none;

          font-size: 14px;
          font-weight: 800;
        }

        .close {
          position: absolute;
          top: 17px;
          right: 20px;

          border: 0;
          background: transparent;

          color: #73809a;
          font-size: 24px;

          cursor: pointer;
        }

        /* HERO */

        .hero {
          width: calc(100% - 68px);
          max-width: 1320px;
          min-height: 620px;

          margin: 0 auto;
          padding: 60px 0 50px;

          display: grid;
          grid-template-columns: 0.82fr 1.18fr;
          align-items: center;
          gap: 50px;
        }

        /* EMERGENCY */

        .emergency {
          max-width: 490px;
        }

        .emergencyTop {
          display: flex;
          align-items: center;
          gap: 10px;

          margin-bottom: 20px;
        }

        .medicalIcon {
          width: 31px;
          height: 31px;

          display: grid;
          place-items: center;

          border-radius: 50%;
          background: #ffffff;

          color: #1559c7;
          font-size: 22px;
          font-weight: 500;
        }

        .smallTitle {
          color: rgba(255, 255, 255, 0.7);

          font-size: 12px;
          font-weight: 750;
          letter-spacing: 0.6px;
          text-transform: uppercase;
        }

        .emergency h1 {
          margin: 0;

          color: #ffffff;

          font-size: clamp(48px, 5vw, 76px);
          line-height: 0.94;
          letter-spacing: -3px;
        }

        .emergency p {
          max-width: 440px;

          margin: 25px 0 0;

          color: rgba(255, 255, 255, 0.76);

          font-size: 16px;
          line-height: 1.7;
        }

        .emergencyPoints {
          margin-top: 30px;

          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .emergencyPoints span {
          display: flex;
          align-items: center;
          gap: 12px;

          color: rgba(255, 255, 255, 0.86);

          font-size: 14px;
          font-weight: 600;
        }

        .emergencyPoints b {
          width: 30px;

          color: rgba(255, 255, 255, 0.42);

          font-size: 11px;
          letter-spacing: 1px;
        }

        .learnMore {
          display: inline-flex;

          margin-top: 32px;
          padding: 13px 19px;

          border: 1px solid rgba(255, 255, 255, 0.38);
          border-radius: 11px;

          color: #ffffff;
          text-decoration: none;

          font-size: 14px;
          font-weight: 750;
        }

        /* QR VISUAL */

        .visual {
          min-height: 550px;

          display: grid;
          place-items: center;
        }

        .orbit {
          position: relative;

          width: 540px;
          height: 540px;
        }

        .orbitLine {
          position: absolute;
          inset: 56px;

          border: 1px dashed rgba(255, 255, 255, 0.35);
          border-radius: 50%;
        }

        .qr {
          position: absolute;
          top: 50%;
          left: 50%;

          width: 185px;
          height: 185px;

          transform: translate(-50%, -50%);

          display: grid;
          place-items: center;

          border-radius: 27px;

          background: #ffffff;

          color: #0c3b9e;

          box-shadow: 0 22px 55px rgba(0, 17, 65, 0.25);
        }

        .product {
          position: absolute;

          width: 88px;
          height: 88px;

          display: grid;
          place-items: center;

          border: 1px solid rgba(255, 255, 255, 0.32);
          border-radius: 50%;

          background: rgba(255, 255, 255, 0.11);
          color: #ffffff;

          backdrop-filter: blur(8px);
        }

        .product :global(svg) {
          width: 40px;
          height: 40px;
        }

        .dog {
          top: 5px;
          left: 226px;
        }

        .cat {
          top: 103px;
          left: 30px;
        }

        .keys {
          top: 103px;
          right: 30px;
        }

        .wallet {
          bottom: 91px;
          left: 32px;
        }

        .suitcase {
          right: 32px;
          bottom: 91px;
        }

        .bag {
          bottom: 0;
          left: 226px;
        }

        /* INFO */

        .bottomInfo {
          width: calc(100% - 68px);
          max-width: 1320px;

          margin: 0 auto;
          padding: 26px 0 40px;

          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;

          border-top: 1px solid rgba(255, 255, 255, 0.16);
        }

        .bottomInfo div {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .bottomInfo strong {
          font-size: 14px;
        }

        .bottomInfo span {
          color: rgba(255, 255, 255, 0.6);

          font-size: 12px;
          line-height: 1.5;
        }

        /* CHAT */

        .liveChat {
          position: fixed;
          right: 24px;
          bottom: 22px;

          z-index: 50;

          min-height: 49px;
          padding: 0 19px;

          display: flex;
          align-items: center;
          gap: 9px;

          border: 1px solid rgba(255, 255, 255, 0.35);
          border-radius: 999px;

          background: #ffffff;
          color: #0b43ad;

          text-decoration: none;

          font-size: 14px;
          font-weight: 800;

          box-shadow: 0 14px 35px rgba(0, 20, 70, 0.25);
        }

        .chatDot {
          width: 9px;
          height: 9px;

          border-radius: 50%;
          background: #24b36b;
        }

        @media (max-width: 1100px) {
          .nav {
            display: none;
          }

          .hero {
            grid-template-columns: 1fr;
          }

          .emergency {
            max-width: 650px;
          }

          .visual {
            min-height: 570px;
          }
        }

        @media (max-width: 700px) {
          .header {
            min-height: 76px;
            padding: 0 16px;
          }

          .brand {
            font-size: 18px;
          }

          .language,
          .login,
          .admin {
            display: none;
          }

          .create {
            min-height: 40px;
            padding: 0 12px;

            font-size: 12px;
          }

          .hero {
            width: calc(100% - 32px);

            padding-top: 45px;
            gap: 25px;
          }

          .emergency h1 {
            font-size: 48px;
            letter-spacing: -2px;
          }

          .visual {
            min-height: 390px;
          }

          .orbit {
            width: 360px;
            height: 360px;

            transform: scale(0.95);
          }

          .orbitLine {
            inset: 44px;
          }

          .qr {
            width: 130px;
            height: 130px;
          }

          .product {
            width: 67px;
            height: 67px;
          }

          .product :global(svg) {
            width: 31px;
            height: 31px;
          }

          .dog {
            top: 0;
            left: 147px;
          }

          .cat {
            top: 68px;
            left: 9px;
          }

          .keys {
            top: 68px;
            right: 9px;
          }

          .wallet {
            bottom: 64px;
            left: 9px;
          }

          .suitcase {
            bottom: 64px;
            right: 9px;
          }

          .bag {
            bottom: 0;
            left: 147px;
          }

          .bottomInfo {
            width: calc(100% - 32px);
            grid-template-columns: 1fr;
          }

          .dropdown {
            width: calc(100% - 32px);
          }
        }
      `}</style>
    </main>
  );
}

/* ICONS */

function QRIcon() {
  return (
    <svg width="125" height="125" viewBox="0 0 100 100" fill="none">
      <rect x="6" y="6" width="27" height="27" stroke="currentColor" strokeWidth="7" />
      <rect x="67" y="6" width="27" height="27" stroke="currentColor" strokeWidth="7" />
      <rect x="6" y="67" width="27" height="27" stroke="currentColor" strokeWidth="7" />

      <rect x="14" y="14" width="11" height="11" fill="currentColor" />
      <rect x="75" y="14" width="11" height="11" fill="currentColor" />
      <rect x="14" y="75" width="11" height="11" fill="currentColor" />

      <path
        d="M45 8h10v10H45zM43 27h12v10H43zM61 42h12v11H61zM42 45h10v10H42zM78 44h12v12H78zM45 63h12v10H45zM62 61h10v12H62zM78 67h15v10H78zM43 81h12v12H43zM62 80h10v13H62zM82 84h11v9H82z"
        fill="currentColor"
      />
    </svg>
  );
}

function DogIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M7 9 4 5v6c0 5 3 9 8 9s8-4 8-9V5l-3 4" />
      <path d="M8 8c1-2 7-2 8 0M9 14h.01M15 14h.01M10 17c1.3 1 2.7 1 4 0" />
    </svg>
  );
}

function CatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="m5 9 1-5 4 3h4l4-3 1 5v5c0 4-3 7-7 7s-7-3-7-7Z" />
      <path d="M9 13h.01M15 13h.01M10 17h4M4 15H1M20 15h3" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="8" cy="12" r="4" />
      <path d="M12 12h9M17 12v3M20 12v2" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="6" width="18" height="13" rx="3" />
      <path d="M3 9h18M15 13h6M17 15h.01" />
    </svg>
  );
}

function SuitcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="5" y="6" width="14" height="15" rx="2" />
      <path d="M9 6V3h6v3M9 10v7M15 10v7M8 21v2M16 21v2" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M5 8h14l1 13H4Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
