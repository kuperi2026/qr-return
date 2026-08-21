"use client";

import { useState } from "react";

type Props = {
  language?: "ka" | "en";
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  onLanguageChange?: (language: "ka" | "en") => void;
};

export default function HomeHeader({
  language = "ka",
  isLoggedIn = false,
  isAdmin = false,
  onLanguageChange,
}: Props) {
  const [aboutOpen, setAboutOpen] = useState(false);

  const ka = language === "ka";

  return (
    <header className="header">
      <div className="inner">

        {/* LOGO */}
        <a href="/" className="brand">
          <div className="logo">
            <QRIcon />
          </div>

          <div className="brandText">
            <strong>QR RETURN</strong>
            <span>SMART LOST &amp; FOUND</span>
          </div>
        </a>

        {/* NAVIGATION */}
        <nav className="navigation">

          {/* ABOUT DROPDOWN */}
          <div className="dropdown">
            <button
              type="button"
              className="dropdownButton"
              onClick={() => setAboutOpen(!aboutOpen)}
            >
              {ka ? "ჩვენ შესახებ" : "About"}
              <ChevronIcon open={aboutOpen} />
            </button>

            {aboutOpen && (
              <div className="dropdownMenu">
                <a
                  href="#founder"
                  onClick={() => setAboutOpen(false)}
                >
                  <span>01</span>
                  {ka
                    ? "დამფუძნებლის სიტყვა"
                    : "Founder's Message"}
                </a>

                <a
                  href="#mission"
                  onClick={() => setAboutOpen(false)}
                >
                  <span>02</span>
                  {ka
                    ? "ჩვენი მისია"
                    : "Our Mission"}
                </a>

                <a
                  href="#vision"
                  onClick={() => setAboutOpen(false)}
                >
                  <span>03</span>
                  {ka
                    ? "ჩვენი ხედვა"
                    : "Our Vision"}
                </a>

                <a
                  href="#how-to-order"
                  onClick={() => setAboutOpen(false)}
                >
                  <span>04</span>
                  {ka
                    ? "როგორ შევუკვეთო"
                    : "How to Order"}
                </a>

                <a
                  href="#faq"
                  onClick={() => setAboutOpen(false)}
                >
                  <span>05</span>
                  {ka
                    ? "ხშირად დასმული კითხვები"
                    : "Frequently Asked Questions"}
                </a>
              </div>
            )}
          </div>

          <a href="/store" className="storeLink">
            {ka ? "ონლაინ შეძენა" : "Shop Online"}
          </a>
        </nav>

        {/* RIGHT SIDE */}
        <div className="actions">

          {isAdmin && (
            <a href="/admin" className="adminButton">
              Admin Panel
            </a>
          )}

          {isLoggedIn ? (
            <a href="/account" className="registerButton">
              {ka ? "ჩემი ანგარიში" : "My Account"}
            </a>
          ) : (
            <>
              <a href="/login" className="loginButton">
                {ka ? "შესვლა" : "Sign In"}
              </a>

              <a href="/signup" className="registerButton">
                {ka ? "რეგისტრაცია" : "Register"}
              </a>
            </>
          )}

          {/* LANGUAGE */}
          <div className="language">
            <button
              type="button"
              className={language === "ka" ? "active" : ""}
              onClick={() => onLanguageChange?.("ka")}
            >
              GEO
            </button>

            <span className="divider" />

            <button
              type="button"
              className={language === "en" ? "active" : ""}
              onClick={() => onLanguageChange?.("en")}
            >
              ENG
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .header {
          width: 100%;
          position: relative;
          z-index: 100;

          background: rgba(255, 255, 255, 0.96);
          border-bottom: 1px solid #e7ecf2;

          backdrop-filter: blur(18px);
        }

        .inner {
          width: calc(100% - 56px);
          max-width: 1280px;
          min-height: 80px;
          margin: 0 auto;

          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 34px;
        }

        /* BRAND */

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;

          color: inherit;
          text-decoration: none;
        }

        .logo {
          width: 42px;
          height: 42px;

          display: grid;
          place-items: center;

          border-radius: 12px;

          color: #ffffff;

          background: linear-gradient(
            135deg,
            #1266e9,
            #6359ef
          );

          box-shadow: 0 9px 25px rgba(18, 102, 233, 0.18);
        }

        .brandText strong,
        .brandText span {
          display: block;
        }

        .brandText strong {
          color: #16253a;

          font-size: 17px;
          font-weight: 900;
          letter-spacing: -0.5px;
        }

        .brandText span {
          margin-top: 3px;

          color: #929ca8;

          font-size: 7px;
          font-weight: 850;
          letter-spacing: 1.55px;
        }

        /* NAVIGATION */

        .navigation {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 29px;
        }

        .storeLink,
        .dropdownButton {
          border: 0;

          color: #566579;
          background: transparent;

          text-decoration: none;

          font-family: inherit;
          font-size: 13px;
          font-weight: 700;

          cursor: pointer;

          transition: color 0.2s ease;
        }

        .storeLink:hover,
        .dropdownButton:hover {
          color: #1266e9;
        }

        /* DROPDOWN */

        .dropdown {
          position: relative;
        }

        .dropdownButton {
          padding: 20px 0;

          display: flex;
          align-items: center;
          gap: 6px;
        }

        .dropdownMenu {
          width: 300px;

          position: absolute;
          top: calc(100% + 5px);
          left: -20px;

          padding: 10px;

          border: 1px solid #e5eaf0;
          border-radius: 16px;

          background: rgba(255, 255, 255, 0.98);

          box-shadow:
            0 20px 55px rgba(26, 42, 66, 0.13);

          backdrop-filter: blur(18px);
        }

        .dropdownMenu a {
          min-height: 50px;
          padding: 0 13px;

          display: grid;
          grid-template-columns: 32px 1fr;
          align-items: center;

          border-radius: 10px;

          color: #35465b;
          text-decoration: none;

          font-size: 13px;
          font-weight: 650;

          transition:
            background 0.18s ease,
            color 0.18s ease;
        }

        .dropdownMenu a:hover {
          color: #1266e9;
          background: #f4f7fb;
        }

        .dropdownMenu a span {
          color: #9ba6b2;

          font-size: 9px;
          font-weight: 900;
        }

        /* ACTIONS */

        .actions {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .loginButton,
        .registerButton,
        .adminButton {
          min-height: 39px;
          padding: 0 14px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border-radius: 10px;

          text-decoration: none;

          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
        }

        .loginButton {
          color: #ffffff;
          background: #1266e9;
          border: 1px solid #1266e9;
        }

        .registerButton {
          color: #ffffff;

          background: linear-gradient(
            135deg,
            #1266e9,
            #365fe7
          );

          border: 1px solid #1266e9;
        }

        .adminButton {
          color: #7a4248;

          border: 1px solid #ead8da;
          background: #fff8f8;
        }

        /* LANGUAGE */

        .language {
          margin-left: 5px;

          display: flex;
          align-items: center;
          gap: 6px;
        }

        .language button {
          padding: 5px 2px;

          border: 0;

          color: #9aa4af;
          background: transparent;

          cursor: pointer;

          font-size: 9px;
          font-weight: 900;
        }

        .language button.active {
          color: #1266e9;
        }

        .divider {
          width: 1px;
          height: 13px;

          background: #d9dfe5;
        }

        @media (max-width: 1000px) {
          .navigation {
            display: none;
          }

          .inner {
            grid-template-columns: auto 1fr;
          }

          .actions {
            justify-self: end;
          }
        }

        @media (max-width: 680px) {
          .inner {
            width: calc(100% - 24px);
            min-height: 70px;
            gap: 12px;
          }

          .brandText span {
            display: none;
          }

          .logo {
            width: 38px;
            height: 38px;
          }

          .brandText strong {
            font-size: 15px;
          }

          .adminButton,
          .language {
            display: none;
          }

          .loginButton,
          .registerButton {
            min-height: 36px;
            padding: 0 9px;

            font-size: 10px;
          }
        }

        @media (max-width: 440px) {
          .brandText {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}

function ChevronIcon({
  open,
}: {
  open: boolean;
}) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={{
        transform: open
          ? "rotate(180deg)"
          : "rotate(0deg)",
        transition: "transform 0.2s ease",
      }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function QRIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="15" width="6" height="6" rx="1" />
      <path d="M14 14h3v3h3v4h-6z" />
    </svg>
  );
}
