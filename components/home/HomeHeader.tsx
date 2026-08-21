"use client";

import type { Lang, Menu } from "./types";

type Props = {
  language: Lang;
  openMenu: Menu;
  onLanguageChange: (language: Lang) => void;
  onMenuChange: (menu: Menu) => void;
};

export default function HomeHeader({
  language,
  openMenu,
  onLanguageChange,
  onMenuChange,
}: Props) {
  const ka = language === "ka";

  function toggleMenu(menu: Exclude<Menu, null>) {
    onMenuChange(openMenu === menu ? null : menu);
  }

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

        <nav className="nav">
          <button
            type="button"
            onClick={() => toggleMenu("about")}
            className={openMenu === "about" ? "active" : ""}
          >
            {ka ? "ჩვენ შესახებ" : "About"}
            <Chevron open={openMenu === "about"} />
          </button>

          <button
            type="button"
            onClick={() => toggleMenu("shop")}
            className={openMenu === "shop" ? "active" : ""}
          >
            {ka ? "ონლაინ შეძენა" : "Shop"}
            <Chevron open={openMenu === "shop"} />
          </button>

          <button
            type="button"
            onClick={() => toggleMenu("faq")}
            className={openMenu === "faq" ? "active" : ""}
          >
            {ka ? "ხშირად დასმული კითხვები" : "FAQ"}
          </button>

          <button
            type="button"
            onClick={() => toggleMenu("contact")}
            className={openMenu === "contact" ? "active" : ""}
          >
            {ka ? "კონტაქტი" : "Contact"}
          </button>
        </nav>

        <div className="actions">
          <div className="languages">
            <button
              type="button"
              className={language === "ka" ? "selected" : ""}
              onClick={() => onLanguageChange("ka")}
            >
              GEO
            </button>

            <span />

            <button
              type="button"
              className={language === "en" ? "selected" : ""}
              onClick={() => onLanguageChange("en")}
            >
              ENG
            </button>
          </div>

          <a href="/admin" className="admin">
            {ka ? "ადმინ პანელი" : "Admin"}
          </a>

          <a href="/login" className="auth">
            {ka ? "შესვლა" : "Sign In"}
          </a>

          <a href="/signup" className="auth">
            {ka ? "რეგისტრაცია" : "Register"}
          </a>
        </div>
      </div>

      <style jsx>{`
        .header {
          position: relative;
          z-index: 100;
          background: #ffffff;
          border-bottom: 1px solid #e6ebf1;
        }

        .inner {
          width: calc(100% - 90px);
          max-width: 1380px;
          min-height: 78px;
          margin: 0 auto;

          display: grid;
          grid-template-columns: 210px 1fr auto;
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
          border-radius: 10px;
          color: #ffffff;
          background: #1266e9;
        }

        .brandText strong,
        .brandText span {
          display: block;
        }

        .brandText strong {
          color: #172b43;
          font-size: 16px;
          font-weight: 900;
        }

        .brandText span {
          margin-top: 3px;
          color: #8995a4;
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 1.3px;
        }

        .nav {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .nav button {
          padding: 28px 0;
          display: flex;
          align-items: center;
          gap: 5px;

          border: 0;
          background: transparent;
          color: #1266e9;

          cursor: pointer;
          font-family: inherit;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
        }

        .nav button.active {
          color: #084eaf;
        }

        .actions {
          display: flex;
          align-items: center;
          gap: 7px;
          padding-right: 20px;
        }

        .languages {
          margin-right: 9px;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .languages button {
          padding: 4px 1px;
          border: 0;
          background: transparent;
          color: #7b8796;
          cursor: pointer;
          font-size: 11px;
          font-weight: 900;
        }

        .languages button.selected {
          color: #1266e9;
        }

        .languages span {
          width: 1px;
          height: 14px;
          background: #d9e0e8;
        }

        .auth,
        .admin {
          min-height: 38px;
          padding: 0 13px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border-radius: 9px;
          text-decoration: none;
          white-space: nowrap;
          font-size: 10px;
          font-weight: 850;
        }

        .auth {
          color: #ffffff;
          background: #1266e9;
          border: 1px solid #1266e9;
        }

        .admin {
          color: #1266e9;
          background: #ffffff;
          border: 1px solid #cdddf4;
        }

        @media (max-width: 900px) {
          .nav {
            display: none;
          }

          .inner {
            grid-template-columns: auto 1fr;
          }

          .actions {
            justify-self: end;
            padding-right: 0;
          }
        }
      `}</style>
    </header>
  );
}

function QRIcon() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="15" width="6" height="6" rx="1" />
      <path d="M14 14h3v3h4M14 21v-4M18 18h3v3" />
    </svg>
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
      }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
