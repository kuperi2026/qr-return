"use client";

import { useEffect, useState } from "react";
import HomeMegaMenu from "./HomeMegaMenu";

type Lang = "ka" | "en";

type MenuType =
  | "about"
  | "shop"
  | "faq"
  | "contact"
  | null;

type Props = {
  language?: Lang;
  onLanguageChange?: (language: Lang) => void;
};

export default function HomeHeader({
  language = "ka",
  onLanguageChange,
}: Props) {
  const [openMenu, setOpenMenu] = useState<MenuType>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const ka = language === "ka";

  useEffect(() => {
    async function checkSession() {
      try {
        const { createClient } = await import("@supabase/supabase-js");

        const supabaseUrl =
          process.env.NEXT_PUBLIC_SUPABASE_URL;

        const supabaseAnonKey =
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
          return;
        }

        const supabase = createClient(
          supabaseUrl,
          supabaseAnonKey
        );

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsLoggedIn(false);
          setIsAdmin(false);
          return;
        }

        setIsLoggedIn(true);

        /*
          ADMIN BUTTON SECURITY

          ჩვეულებრივ მომხმარებელს Admin Panel საერთოდ არ ეჩვენება.

          თუ შენს პროექტში admin_users ცხრილი გაქვს,
          აქ მოწმდება მიმდინარე მომხმარებლის ID.

          თუ admin_users სხვა სვეტს იყენებს,
          შემდეგ მხოლოდ ეს პატარა ნაწილი შევასწოროთ.
        */

        const { data: admin } = await supabase
          .from("admin_users")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle();

        setIsAdmin(Boolean(admin));
      } catch {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    }

    void checkSession();
  }, []);

  function toggleMenu(
    menu: Exclude<MenuType, null>
  ) {
    setOpenMenu((current) =>
      current === menu ? null : menu
    );
  }

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

              <span>
                SMART LOST &amp; FOUND
              </span>
            </div>
          </a>

          {/* MAIN NAVIGATION */}

          <nav className="navigation">

            <button
              type="button"
              className={
                openMenu === "about"
                  ? "nav active"
                  : "nav"
              }
              onClick={() =>
                toggleMenu("about")
              }
            >
              {ka
                ? "ჩვენ შესახებ"
                : "About"}

              <Chevron
                open={
                  openMenu === "about"
                }
              />
            </button>

            <button
              type="button"
              className={
                openMenu === "shop"
                  ? "nav active"
                  : "nav"
              }
              onClick={() =>
                toggleMenu("shop")
              }
            >
              {ka
                ? "ონლაინ შეძენა"
                : "Shop Online"}

              <Chevron
                open={
                  openMenu === "shop"
                }
              />
            </button>

            <button
              type="button"
              className={
                openMenu === "faq"
                  ? "nav active"
                  : "nav"
              }
              onClick={() =>
                toggleMenu("faq")
              }
            >
              {ka
                ? "ხშირად დასმული კითხვები"
                : "FAQ"}
            </button>

            <button
              type="button"
              className={
                openMenu === "contact"
                  ? "nav active"
                  : "nav"
              }
              onClick={() =>
                toggleMenu("contact")
              }
            >
              {ka
                ? "კონტაქტი"
                : "Contact"}
            </button>
          </nav>

          {/* RIGHT SIDE */}

          <div className="actions">

            {/* მხოლოდ ADMIN ხედავს */}

            {isAdmin && (
              <a
                href="/admin"
                className="adminButton"
              >
                {ka
                  ? "ადმინ პანელი"
                  : "Admin Panel"}
              </a>
            )}

            {isLoggedIn ? (
              <a
                href="/account"
                className="mainButton"
              >
                {ka
                  ? "ჩემი ანგარიში"
                  : "My Account"}
              </a>
            ) : (
              <>
                <a
                  href="/login"
                  className="mainButton"
                >
                  {ka
                    ? "შესვლა"
                    : "Sign In"}
                </a>

                <a
                  href="/signup"
                  className="mainButton"
                >
                  {ka
                    ? "რეგისტრაცია"
                    : "Register"}
                </a>
              </>
            )}

            {/* LANGUAGE */}

            <div className="languages">
              <button
                type="button"
                className={
                  language === "ka"
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  onLanguageChange?.("ka")
                }
              >
                GEO
              </button>

              <span />

              <button
                type="button"
                className={
                  language === "en"
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  onLanguageChange?.("en")
                }
              >
                ENG
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* DROPDOWN */}

      {openMenu !== null && (
        <div className="dropdown">
          <HomeMegaMenu
            language={language}
            menu={openMenu}
          />
        </div>
      )}

      <style jsx>{`
        .header {
          width: 100%;
          position: relative;
          z-index: 100;

          background: #ffffff;

          border-bottom:
            1px solid #e7ebf0;
        }

        .inner {
          width: calc(100% - 72px);
          max-width: 1400px;
          min-height: 78px;

          margin: 0 auto;

          display: grid;

          grid-template-columns:
            210px 1fr auto;

          align-items: center;

          gap: 20px;
        }

        /* LOGO */

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
          background: #17283d;
        }

        .brandText strong,
        .brandText span {
          display: block;
        }

        .brandText strong {
          color: #17283d;

          font-size: 16px;
          font-weight: 900;

          letter-spacing: -0.35px;
        }

        .brandText span {
          margin-top: 3px;

          color: #929ca8;

          font-size: 7px;
          font-weight: 850;

          letter-spacing: 1.35px;
        }

        /* NAVIGATION */

        .navigation {
          display: flex;
          align-items: center;

          justify-content: flex-start;

          gap: 28px;

          transform:
            translateX(-18px);
        }

        .nav {
          padding: 28px 0;

          display: inline-flex;
          align-items: center;

          gap: 5px;

          border: 0;

          color: #1266e9;
          background: transparent;

          cursor: pointer;

          font-family: inherit;

          font-size: 13px;
          font-weight: 750;

          text-decoration: none;

          white-space: nowrap;

          transition:
            color 0.18s ease;
        }

        .nav:hover,
        .nav.active {
          color: #084eaf;
        }

        /* RIGHT */

        .actions {
          display: flex;
          align-items: center;

          gap: 7px;
        }

        .mainButton,
        .adminButton {
          min-height: 39px;

          padding: 0 14px;

          display: inline-flex;

          align-items: center;
          justify-content: center;

          border-radius: 9px;

          text-decoration: none;

          white-space: nowrap;

          font-size: 11px;
          font-weight: 800;

          transition:
            background 0.18s ease,
            border-color 0.18s ease;
        }

        /*
          LOGIN + REGISTER
          ორივე თეთრი ტექსტით ლურჯ ფონზე
        */

        .mainButton {
          color: #ffffff;

          border:
            1px solid #1266e9;

          background: #1266e9;
        }

        .mainButton:hover {
          border-color: #0d57c8;
          background: #0d57c8;
        }

        /*
          ADMIN
          მხოლოდ admin-ისთვის ჩანს
        */

        .adminButton {
          color: #ffffff;

          border:
            1px solid #17283d;

          background: #17283d;
        }

        .adminButton:hover {
          background: #223750;
        }

        /* LANGUAGE */

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

        /*
          OPENED MENU

          აქ სპეციალურად ვაპატარავებთ
          შიგნით არსებულ ტექსტებს.
        */

        .dropdown {
          position: relative;
          z-index: 90;

          font-size: 12px;
        }

        .dropdown :global(h1) {
          font-size: 28px !important;
          line-height: 1.14 !important;
        }

        .dropdown :global(h2) {
          font-size: 26px !important;
          line-height: 1.18 !important;
          letter-spacing: -0.7px !important;
        }

        .dropdown :global(h3) {
          font-size: 16px !important;
          line-height: 1.35 !important;
        }

        .dropdown :global(p) {
          font-size: 12px !important;
          line-height: 1.68 !important;
        }

        .dropdown :global(strong) {
          line-height: 1.4;
        }

        /* TABLET */

        @media (max-width: 1120px) {
          .navigation {
            gap: 15px;
            transform: none;
          }

          .nav {
            font-size: 11px;
          }

          .inner {
            width:
              calc(100% - 40px);
          }
        }

        @media (max-width: 980px) {
          .navigation {
            display: none;
          }

          .inner {
            grid-template-columns:
              auto 1fr;
          }

          .actions {
            justify-self: end;
          }
        }

        /* MOBILE */

        @media (max-width: 680px) {
          .inner {
            width:
              calc(100% - 22px);

            min-height: 70px;
          }

          .brandText span,
          .adminButton,
          .languages {
            display: none;
          }

          .mainButton {
            min-height: 35px;

            padding: 0 8px;

            font-size: 9px;
          }

          .dropdown :global(h2) {
            font-size:
              22px !important;
          }

          .dropdown :global(h3) {
            font-size:
              15px !important;
          }

          .dropdown :global(p) {
            font-size:
              11.5px !important;
          }
        }
      `}</style>
    </>
  );
}

function Chevron({
  open,
}: {
  open: boolean;
}) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={{
        transform: open
          ? "rotate(180deg)"
          : "rotate(0deg)",

        transition:
          "transform .2s ease",
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
      <rect
        x="3"
        y="3"
        width="6"
        height="6"
        rx="1"
      />

      <rect
        x="15"
        y="3"
        width="6"
        height="6"
        rx="1"
      />

      <rect
        x="3"
        y="15"
        width="6"
        height="6"
        rx="1"
      />

      <path d="M14 14h3v3h3v4h-6z" />
    </svg>
  );
}
