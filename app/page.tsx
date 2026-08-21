"use client";

import { useState } from "react";

type Language = "ka" | "en";
type OpenMenu = "shop" | "about" | "faq" | null;

export default function HomeHeader() {
  const [language, setLanguage] =
    useState<Language>("ka");

  const [openMenu, setOpenMenu] =
    useState<OpenMenu>(null);

  const ka = language === "ka";

  function toggleMenu(menu: OpenMenu) {
    setOpenMenu((current) =>
      current === menu ? null : menu
    );
  }

  return (
    <header className="header">
      <div className="inner">
        {/* BRAND */}
        <a href="/" className="brand">
          QR RETURN
        </a>

        {/* MAIN MENU */}
        <nav className="nav">
          <button
            type="button"
            className={
              openMenu === "shop"
                ? "menuButton active"
                : "menuButton"
            }
            onClick={() =>
              toggleMenu("shop")
            }
          >
            {ka
              ? "ონლაინ შეძენა"
              : "Online purchase"}

            <ChevronIcon />
          </button>

          <button
            type="button"
            className={
              openMenu === "about"
                ? "menuButton active"
                : "menuButton"
            }
            onClick={() =>
              toggleMenu("about")
            }
          >
            {ka
              ? "ჩვენს შესახებ"
              : "About us"}

            <ChevronIcon />
          </button>

          <button
            type="button"
            className={
              openMenu === "faq"
                ? "menuButton active"
                : "menuButton"
            }
            onClick={() =>
              toggleMenu("faq")
            }
          >
            {ka
              ? "ხშირად დასმული კითხვები"
              : "FAQ"}

            <ChevronIcon />
          </button>
        </nav>

        {/* RIGHT SIDE */}
        <div className="actions">
          <div className="languages">
            <button
              type="button"
              className={
                ka ? "selected" : ""
              }
              onClick={() =>
                setLanguage("ka")
              }
            >
              GEO
            </button>

            <span />

            <button
              type="button"
              className={
                !ka ? "selected" : ""
              }
              onClick={() =>
                setLanguage("en")
              }
            >
              ENG
            </button>
          </div>

          <a
            href="/login"
            className="login"
          >
            {ka
              ? "შესვლა"
              : "Sign in"}
          </a>

          <a
            href="/signup"
            className="signup"
          >
            {ka
              ? "ანგარიშის შექმნა"
              : "Create account"}
          </a>

          <a
            href="/admin"
            className="admin"
          >
            Admin Panel
          </a>
        </div>
      </div>

      {/* SHOP DROPDOWN */}
      {openMenu === "shop" && (
        <div className="dropdown">
          <div className="dropdownInner">
            <div>
              <span className="dropdownLabel">
                QR RETURN STORE
              </span>

              <h2>
                {ka
                  ? "აირჩიეთ თქვენთვის სასურველი QR პროდუქტი"
                  : "Choose your QR RETURN product"}
              </h2>

              <p>
                {ka
                  ? "პროდუქტის არჩევის შემდეგ შეძლებთ დიზაინის, რაოდენობისა და შეძენის დეტალების ნახვას."
                  : "Choose a product to view available designs, quantities and purchase details."}
              </p>
            </div>

            <a
              href="/store"
              className="dropdownAction"
            >
              {ka
                ? "პროდუქტების ნახვა"
                : "View products"}

              <ArrowIcon />
            </a>
          </div>
        </div>
      )}

      {/* ABOUT DROPDOWN */}
      {openMenu === "about" && (
        <div className="dropdown">
          <div className="dropdownInner">
            <div>
              <span className="dropdownLabel">
                QR RETURN
              </span>

              <h2>
                {ka
                  ? "დაკარგულ ნივთსა და მფლობელს შორის მარტივი კავშირი."
                  : "A simpler connection between a lost item and its owner."}
              </h2>

              <p>
                {ka
                  ? "QR RETURN აერთიანებს QR პროფილებს, უსაფრთხო დაკავშირებას, Live Chat-ს, ლოკაციის გაზიარებას და Emergency სერვისებს ერთ სისტემაში."
                  : "QR RETURN combines QR profiles, secure contact, Live Chat, location sharing and Emergency services in one system."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FAQ DROPDOWN */}
      {openMenu === "faq" && (
        <div className="dropdown">
          <div className="dropdownInner faqInner">
            <div>
              <span className="dropdownLabel">
                FAQ
              </span>

              <h2>
                {ka
                  ? "ხშირად დასმული კითხვები"
                  : "Frequently asked questions"}
              </h2>

              <p>
                {ka
                  ? "როგორ მუშაობს QR კოდი? სჭირდება თუ არა მპოვნელს რეგისტრაცია? როგორ ხდება ლოკაციის გაზიარება? რა ინფორმაცია ჩანს QR-ის სკანირებისას?"
                  : "How does the QR code work? Does a finder need an account? How does location sharing work? What information is visible after a scan?"}
              </p>
            </div>

            <a
              href="/support"
              className="textAction"
            >
              {ka
                ? "ყველა კითხვის ნახვა →"
                : "View all questions →"}
            </a>
          </div>
        </div>
      )}

      <style jsx>{`
        .header {
          width: 100%;
          position: relative;
          z-index: 1000;

          background: #0d47b5;
          color: #ffffff;

          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Arial,
            sans-serif;
        }

        .inner {
          width: calc(100% - 56px);
          max-width: 1380px;
          min-height: 88px;

          margin: 0 auto;

          display: flex;
          align-items: center;

          gap: 38px;
        }

        /* BRAND */

        .brand {
          flex: 0 0 auto;

          color: #ffffff;
          text-decoration: none;

          font-size: 23px;
          font-weight: 850;

          letter-spacing: -0.7px;
        }

        /* NAVIGATION */

        .nav {
          display: flex;
          align-items: center;

          gap: 5px;
        }

        .menuButton {
          min-height: 43px;
          padding: 0 12px;

          display: inline-flex;
          align-items: center;

          gap: 7px;

          border: 0;
          border-radius: 9px;

          color:
            rgba(
              255,
              255,
              255,
              0.82
            );

          background: transparent;

          font-family: inherit;
          font-size: 14px;
          font-weight: 650;

          cursor: pointer;

          transition:
            color 160ms ease,
            background 160ms ease;
        }

        .menuButton:hover,
        .menuButton.active {
          color: #ffffff;

          background:
            rgba(
              255,
              255,
              255,
              0.1
            );
        }

        .menuButton
          :global(svg) {
          width: 13px;
          height: 13px;
        }

        /* RIGHT SIDE */

        .actions {
          margin-left: auto;

          display: flex;
          align-items: center;

          gap: 9px;
        }

        /* LANGUAGE */

        .languages {
          margin-right: 7px;

          display: flex;
          align-items: center;

          gap: 8px;
        }

        .languages button {
          padding: 5px 1px;

          border: 0;

          color:
            rgba(
              255,
              255,
              255,
              0.58
            );

          background: transparent;

          font-family: inherit;
          font-size: 14px;
          font-weight: 700;

          cursor: pointer;
        }

        .languages button.selected {
          color: #ffffff;
        }

        .languages > span {
          width: 1px;
          height: 16px;

          background:
            rgba(
              255,
              255,
              255,
              0.28
            );
        }

        /* ACTION BUTTONS */

        .login,
        .signup,
        .admin {
          min-height: 44px;

          padding: 0 15px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border-radius: 10px;

          text-decoration: none;

          font-size: 14px;
          font-weight: 700;

          white-space: nowrap;
        }

        .login {
          color: #ffffff;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.25
            );
        }

        .signup {
          color: #0d47b5;
          background: #ffffff;

          box-shadow:
            0 7px 20px
            rgba(
              0,
              28,
              90,
              0.18
            );
        }

        .admin {
          color: #ffffff;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.46
            );

          background:
            rgba(
              255,
              255,
              255,
              0.07
            );
        }

        /* DROPDOWN */

        .dropdown {
          width: 100%;

          position: absolute;
          top: 88px;
          left: 0;

          color: #172033;
          background: #ffffff;

          border-top:
            1px solid #e6eaf0;

          box-shadow:
            0 24px 55px
            rgba(
              12,
              34,
              75,
              0.14
            );
        }

        .dropdownInner {
          width:
            calc(
              100% - 56px
            );

          max-width: 1380px;

          margin: 0 auto;
          padding: 31px 0 34px;

          display: flex;

          align-items: flex-end;
          justify-content:
            space-between;

          gap: 40px;
        }

        .dropdownInner > div {
          max-width: 780px;
        }

        .dropdownLabel {
          color: #2563eb;

          font-size: 12px;
          font-weight: 800;

          letter-spacing: 1.2px;
        }

        .dropdown h2 {
          margin: 8px 0 0;

          color: #172033;

          font-size: 25px;
          line-height: 1.25;

          letter-spacing: -0.7px;
        }

        .dropdown p {
          max-width: 760px;

          margin: 10px 0 0;

          color: #667085;

          font-size: 15px;
          line-height: 1.65;
        }

        .dropdownAction {
          min-height: 46px;

          padding: 0 17px;

          display: inline-flex;

          align-items: center;
          justify-content: center;

          gap: 9px;

          flex-shrink: 0;

          border-radius: 10px;

          color: #ffffff;
          background: #2563eb;

          text-decoration: none;

          font-size: 14px;
          font-weight: 750;
        }

        .dropdownAction
          :global(svg) {
          width: 15px;
          height: 15px;
        }

        .textAction {
          flex-shrink: 0;

          color: #2563eb;

          text-decoration: none;

          font-size: 14px;
          font-weight: 750;
        }

        /* TABLET */

        @media (
          max-width: 1080px
        ) {
          .inner {
            gap: 20px;
          }

          .nav {
            gap: 0;
          }

          .menuButton {
            padding: 0 8px;

            font-size: 13px;
          }

          .admin {
            display: none;
          }
        }

        /* MOBILE */

        @media (
          max-width: 780px
        ) {
          .inner {
            width:
              calc(
                100% - 28px
              );

            min-height: 76px;

            gap: 15px;
          }

          .brand {
            font-size: 19px;
          }

          .nav {
            display: none;
          }

          .languages {
            display: none;
          }

          .login {
            display: none;
          }

          .signup {
            min-height: 41px;

            padding: 0 12px;

            font-size: 13px;
          }

          .dropdown {
            top: 76px;
          }

          .dropdownInner {
            width:
              calc(
                100% - 32px
              );

            padding: 25px 0;

            align-items:
              flex-start;

            flex-direction: column;

            gap: 18px;
          }

          .dropdown h2 {
            font-size: 21px;
          }

          .dropdown p {
            font-size: 14px;
          }
        }
      `}</style>
    </header>
  );
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}
