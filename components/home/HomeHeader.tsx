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
  const [shopOpen, setShopOpen] = useState(false);

  const ka = language === "ka";

  return (
    <header className="header">
      <div className="inner">
        <a href="/" className="brand">
          <div className="logo">
            <QRIcon />
          </div>

          <div className="brandText">
            <strong>QR RETURN</strong>
            <span>SMART LOST &amp; FOUND</span>
          </div>
        </a>

        <nav className="navigation">
          <div className="dropdown">
            <button
              type="button"
              className="navButton"
              onClick={() => {
                setAboutOpen(!aboutOpen);
                setShopOpen(false);
              }}
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
                  {ka ? "ჩვენი მისია" : "Our Mission"}
                </a>

                <a
                  href="#vision"
                  onClick={() => setAboutOpen(false)}
                >
                  <span>03</span>
                  {ka ? "ჩვენი ხედვა" : "Our Vision"}
                </a>
              </div>
            )}
          </div>

          <div className="dropdown">
            <button
              type="button"
              className="navButton"
              onClick={() => {
                setShopOpen(!shopOpen);
                setAboutOpen(false);
              }}
            >
              {ka ? "ონლაინ შეძენა" : "Shop Online"}
              <ChevronIcon open={shopOpen} />
            </button>

            {shopOpen && (
              <div className="dropdownMenu shopMenu">
                <a
                  href="#how-to-order"
                  onClick={() => setShopOpen(false)}
                >
                  <span>01</span>
                  {ka
                    ? "როგორ შევუკვეთო"
                    : "How to Order"}
                </a>

                <a
                  href="/store"
                  onClick={() => setShopOpen(false)}
                >
                  <span>02</span>
                  {ka ? "მაღაზია" : "Store"}
                </a>
              </div>
            )}
          </div>

          <a href="#faq" className="navLink">
            {ka
              ? "ხშირად დასმული კითხვები"
              : "FAQ"}
          </a>

          <a href="#contact" className="navLink">
            {ka ? "კონტაქტი" : "Contact"}
          </a>
        </nav>

        <div className="actions">
          {isAdmin && (
            <a href="/admin" className="adminButton">
              Admin Panel
            </a>
          )}

          {isLoggedIn ? (
            <a href="/account" className="accountButton">
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

          <div className="language">
            <button
              type="button"
              className={language === "ka" ? "active" : ""}
              onClick={() => onLanguageChange?.("ka")}
            >
              GEO
            </button>

            <span />

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
          background: rgba(255, 255, 255, 0.97);
          border-bottom: 1px solid #e7ecf2;
          backdrop-filter: blur(18px);
        }

        .inner {
          width: calc(100% - 90px);
          max-width: 1380px;
          min-height: 80px;
          margin: 0 auto;

          display: grid;
          grid-template-columns: 240px 1fr auto;
          align-items: center;
          gap: 18px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          color: inherit;
          text-decoration: none;
          white-space: nowrap;
        }

        .logo {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          color: #ffffff;
          background: linear-gradient(135deg, #1266e9, #6257ef);
        }

        .brandText strong,
        .brandText span {
          display: block;
        }

        .brandText strong {
          color: #16253a;
          font-size: 16px;
          font-weight: 900;
          letter-spacing: -0.4px;
        }

        .brandText span {
          margin-top: 2px;
          color: #929ca8;
          font-size: 6px;
          font-weight: 850;
          letter-spacing: 1.45px;
        }

        .navigation {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 28px;
          transform: translateX(-20px);
        }

        .dropdown {
          position: relative;
        }

        .navButton,
        .navLink {
          color: #1266e9;
          background: transparent;
          border: 0;

          font-family: inherit;
          font-size: 13.5px;
          font-weight: 800;

          text-decoration: none;
          white-space: nowrap;
          cursor: pointer;

          transition: color 0.2s ease;
        }

        .navButton {
          padding: 25px 0;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .navButton:hover,
        .navLink:hover {
          color: #0d55c7;
        }

        .dropdownMenu {
          width: 285px;
          position: absolute;
          top: calc(100% + 3px);
          left: -18px;

          padding: 9px;
          border: 1px solid #e4eaf0;
          border-radius: 15px;
          background: #ffffff;

          box-shadow:
            0 20px 55px rgba(23, 40, 64, 0.14);
        }

        .shopMenu {
          width: 235px;
        }

        .dropdownMenu a {
          min-height: 48px;
          padding: 0 12px;

          display: grid;
          grid-template-columns: 31px 1fr;
          align-items: center;

          border-radius: 9px;

          color: #35465a;
          text-decoration: none;

          font-size: 12px;
          font-weight: 700;
        }

        .dropdownMenu a:hover {
          color: #1266e9;
          background: #f4f7fb;
        }

        .dropdownMenu a span {
          color: #a0aab5;
          font-size: 8px;
          font-weight: 900;
        }

        .actions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-right: 18px;
        }

        .loginButton,
        .registerButton,
        .accountButton,
        .adminButton {
          min-height: 39px;
          padding: 0 14px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border-radius: 9px;

          text-decoration: none;
          white-space: nowrap;

          font-size: 12px;
          font-weight: 800;
        }

        .loginButton,
        .registerButton,
        .accountButton {
          color: #ffffff;
          background: #1266e9;
          border: 1px solid #1266e9;
        }

        .adminButton {
          color: #87464c;
          background: #fff8f8;
          border: 1px solid #ead8da;
        }

        .language {
          margin-left: 8px;
          margin-right: 4px;

          display: flex;
          align-items: center;
          gap: 6px;
        }

        .language button {
          padding: 5px 1px;
          border: 0;
          color: #9ba5b0;
          background: transparent;
          cursor: pointer;
          font-size: 9px;
          font-weight: 900;
        }

        .language button.active {
          color: #1266e9;
        }

        .language span {
          width: 1px;
          height: 12px;
          background: #d8dee5;
        }

        @media (max-width: 1150px) {
          .navigation {
            gap: 16px;
            transform: none;
          }

          .navButton,
          .navLink {
            font-size: 11px;
          }
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
            width: calc(100% - 22px);
            min-height: 70px;
          }

          .brandText span {
            display: none;
          }

          .adminButton,
          .language {
            display: none;
          }

          .loginButton,
          .registerButton,
          .accountButton {
            min-height: 35px;
            padding: 0 8px;
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

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
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
      width="20"
      height="20"
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
