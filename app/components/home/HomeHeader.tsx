"use client";

import type { Lang, Menu } from "./types";

type Props = {
  language: Lang;
  openMenu: Menu;
  setLanguage: (language: Lang) => void;
  toggleMenu: (menu: Exclude<Menu, null>) => void;
};

function QRIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="15" width="6" height="6" rx="1" />
      <path d="M14 14h3v3h4" />
      <path d="M14 21v-4" />
      <path d="M18 18h3v3" />
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
        transform: open ? "rotate(180deg)" : "rotate(0)",
      }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function HomeHeader({
  language,
  openMenu,
  setLanguage,
  toggleMenu,
}: Props) {
  const ka = language === "ka";

  return (
    <header
      style={{
        background: "#ffffff",
        borderBottom: "1px solid #e6ebf1",
        position: "relative",
        zIndex: 100,
      }}
    >
      <div
        style={{
          width: "calc(100% - 90px)",
          maxWidth: "1380px",
          minHeight: "78px",
          margin: "auto",
          display: "grid",
          gridTemplateColumns: "210px 1fr auto",
          alignItems: "center",
          gap: "25px",
        }}
      >
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              display: "grid",
              placeItems: "center",
              borderRadius: "10px",
              background: "#1266e9",
              color: "#ffffff",
            }}
          >
            <QRIcon size={23} />
          </div>

          <div>
            <strong
              style={{
                display: "block",
                color: "#172b43",
                fontSize: "16px",
                fontWeight: 900,
              }}
            >
              QR RETURN
            </strong>

            <span
              style={{
                display: "block",
                marginTop: "3px",
                color: "#8995a4",
                fontSize: "7px",
                fontWeight: 800,
                letterSpacing: "1.3px",
              }}
            >
              SMART LOST &amp; FOUND
            </span>
          </div>
        </a>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "28px",
          }}
        >
          <button
            onClick={() => toggleMenu("about")}
            style={navButtonStyle}
          >
            {ka ? "ჩვენ შესახებ" : "About"}
            <Chevron open={openMenu === "about"} />
          </button>

          <button
            onClick={() => toggleMenu("shop")}
            style={navButtonStyle}
          >
            {ka ? "ონლაინ შეძენა" : "Shop"}
            <Chevron open={openMenu === "shop"} />
          </button>

          <button
            onClick={() => toggleMenu("faq")}
            style={navButtonStyle}
          >
            {ka ? "ხშირად დასმული კითხვები" : "FAQ"}
          </button>

          <button
            onClick={() => toggleMenu("contact")}
            style={navButtonStyle}
          >
            {ka ? "კონტაქტი" : "Contact"}
          </button>
        </nav>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
          }}
        >
          <button
            onClick={() => setLanguage("ka")}
            style={{
              ...languageButtonStyle,
              color: language === "ka" ? "#1266e9" : "#7b8796",
            }}
          >
            GEO
          </button>

          <span
            style={{
              width: "1px",
              height: "14px",
              background: "#d9e0e8",
            }}
          />

          <button
            onClick={() => setLanguage("en")}
            style={{
              ...languageButtonStyle,
              color: language === "en" ? "#1266e9" : "#7b8796",
            }}
          >
            ENG
          </button>

          <a href="/admin" style={secondaryButtonStyle}>
            {ka ? "ადმინ პანელი" : "Admin"}
          </a>

          <a href="/login" style={primaryButtonStyle}>
            {ka ? "შესვლა" : "Sign in"}
          </a>

          <a href="/signup" style={primaryButtonStyle}>
            {ka ? "რეგისტრაცია" : "Register"}
          </a>
        </div>
      </div>
    </header>
  );
}

const navButtonStyle = {
  padding: "28px 0",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  border: 0,
  background: "transparent",
  color: "#1266e9",
  fontSize: "12px",
  fontWeight: 800,
  cursor: "pointer",
  whiteSpace: "nowrap" as const,
};

const languageButtonStyle = {
  padding: "4px 1px",
  border: 0,
  background: "transparent",
  fontSize: "11px",
  fontWeight: 900,
  cursor: "pointer",
};

const primaryButtonStyle = {
  minHeight: "38px",
  padding: "0 13px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "9px",
  background: "#1266e9",
  color: "#ffffff",
  border: "1px solid #1266e9",
  fontSize: "10px",
  fontWeight: 800,
  textDecoration: "none",
  whiteSpace: "nowrap" as const,
};

const secondaryButtonStyle = {
  ...primaryButtonStyle,
  background: "#ffffff",
  color: "#1266e9",
  border: "1px solid #cdddf4",
};
