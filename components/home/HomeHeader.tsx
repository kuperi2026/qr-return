"use client";

import { useState } from "react";
import HomeMegaMenu from "./HomeMegaMenu";

type Lang = "ka" | "en";
type MenuType = "about" | "shop" | "faq" | null;

type Props = {
  language?: Lang;
  onLanguageChange?: (language: Lang) => void;
};

export default function HomeHeader({
  language = "ka",
  onLanguageChange,
}: Props) {
  const [openMenu, setOpenMenu] = useState<MenuType>(null);
  const ka = language === "ka";

  const toggleMenu = (menu: Exclude<MenuType, null>) => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  return (
    <>
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

          {/* MAIN MENU */}
          <nav className="navigation">
            <button
              type="button"
              className={openMenu === "about" ? "nav active" : "nav"}
              onClick={() => toggleMenu("about")}
            >
              {ka ? "ჩვენ შესახებ" : "About"}
              <Chevron open={openMenu === "about"} />
            </button>

            <button
              type="button"
              className={openMenu === "shop" ? "nav active" : "nav"}
              onClick={() => toggleMenu("shop")}
            >
              {ka ? "ონლაინ შეძენა" : "Shop Online"}
              <Chevron open={openMenu === "shop"} />
            </button>

            <button
              type="button"
              className={openMenu === "faq" ? "nav active" : "nav"}
              onClick={() => toggleMenu("faq")}
            >
              {ka ? "ხშირად დასმული კითხვები" : "FAQ"}
            </button>

            <a href="#contact" className="nav">
              {ka ? "კონტაქტი" : "Contact"}
            </a>
          </nav>

          {/* RIGHT SIDE */}
          <div className="actions">
            <a href="/admin" className="admin">
              {ka ? "ადმინ პანელი" : "Admin"}
            </a>

            <a href="/login" className="login">
              {ka ? "შესვლა" : "Sign In"}
            </a>

            <a href="/signup" className="register">
              {ka ? "რეგისტრაცია" : "Register"}
            </a>

            <div className="languages">
              <button
                type="button"
                className={language === "ka" ? "selected" : ""}
                onClick={() => onLanguageChange?.("ka")}
              >
                GEO
              </button>

              <span />

              <button
                type="button"
                className={language === "en" ? "selected" : ""}
                onClick={() => onLanguageChange?.("en")}
              >
                ENG
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* DROPDOWN CONTENT */}
      {openMenu !== null && (
        <HomeMegaMenu
          language={language}
          menu={openMenu}
        />
      )}

      <style jsx>{`
        .header {
          width: 100%;
          position: relative;
          z-index: 100;
          background: #ffffff;
          border-bottom: 1px solid #e7ebf0;
        }

        .inner {
          width: calc(100% - 64px);
          max-width: 1400px;
          min-height: 80px;
          margin: 0 auto;

          display: grid;
          grid-template-columns: 215px 1fr auto;
          align-items: center;
          gap: 24px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .logo {
          width: 40px;
          height: 40px;

          display: grid;
          place-items: center;

          border-radius: 11px;

          color: #ffffff;
          background: #17283d;
        }

        .brandText strong,
        .brandText span {
          display: block;
        }

        .brandText strong {
          color: #17283d;
          font-size: 17px;
          font-weight: 900;
          letter-spacing: -0.4px;
        }

        .brandText span {
          margin-top: 3px;

          color: #909ba8;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        .navigation {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 28px;
        }

        .nav {
          padding: 29px 0;

          display: inline-flex;
          align-items: center;
          gap: 5px;

          border: 0;

          color: #1266e9;
          background: transparent;

          cursor: pointer;

          font-family: inherit;
          font-size: 13px;
          font-weight: 800;

          text-decoration: none;
          white-space: nowrap;
        }

        .nav:hover,
        .nav.active {
          color: #094ba9;
        }

        .actions {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .admin,
        .login,
        .register {
          min-height: 39px;
          padding: 0 13px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border-radius: 9px;

          font-size: 11px;
          font-weight: 800;

          text-decoration: none;
          white-space: nowrap;
        }

        .admin {
          color: #87464c;
          border: 1px solid #ead8da;
          background: #fff8f8;
        }

        .login {
          color: #1266e9;
          border: 1px solid #cddcf5;
          background: #f5f8ff;
        }

        .register {
          color: #ffffff;
          border: 1px solid #1266e9;
          background: #1266e9;
        }

        .languages {
          margin-left: 7px;

          display: flex;
          align-items: center;
          gap: 6px;
        }

        .languages button {
          padding: 4px 1px;

          border: 0;

          color: #9aa4af;
          background: transparent;

          cursor: pointer;

          font-size: 9px;
          font-weight: 900;
        }

        .languages button.selected {
          color: #1266e9;
        }

        .languages span {
          width: 1px;
          height: 12px;
          background: #d8dee5;
        }

        @media (max-width: 1100px) {
          .navigation {
            gap: 15px;
          }

          .nav {
            font-size: 11px;
          }
        }

        @media (max-width: 950px) {
          .inner {
            grid-template-columns: auto 1fr;
          }

          .navigation {
            display: none;
          }

          .actions {
            justify-self: end;
          }
        }

        @media (max-width: 650px) {
          .inner {
            width: calc(100% - 22px);
            min-height: 70px;
          }

          .brandText span,
          .admin,
          .languages {
            display: none;
          }

          .login,
          .register {
            min-height: 35px;
            padding: 0 8px;
            font-size: 10px;
          }
        }
      `}</style>
    </>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform .2s ease",
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
