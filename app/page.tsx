"use client";

import { useState } from "react";

type Language = "ka" | "en";

export default function Header() {
  const [language, setLanguage] =
    useState<Language>("ka");

  const ka = language === "ka";

  return (
    <header className="header">
      <div className="headerInner">
        {/* BRAND */}

        <a href="/" className="brand">
          <div className="brandMark">
            <QRIcon />
          </div>

          <div className="brandName">
            QR RETURN
          </div>
        </a>

        {/* RIGHT SIDE */}

        <div className="rightSide">
          {/* LANGUAGE */}

          <div className="languageSwitcher">
            <button
              type="button"
              className={
                ka ? "active" : ""
              }
              onClick={() =>
                setLanguage("ka")
              }
            >
              GEO
            </button>

            <button
              type="button"
              className={
                !ka ? "active" : ""
              }
              onClick={() =>
                setLanguage("en")
              }
            >
              ENG
            </button>
          </div>

          {/* LOGIN */}

          <a
            href="/login"
            className="loginButton"
          >
            {ka
              ? "შესვლა"
              : "Log in"}
          </a>

          {/* CREATE ACCOUNT */}

          <a
            href="/signup"
            className="signupButton"
          >
            {ka
              ? "ანგარიშის შექმნა"
              : "Create account"}
          </a>
        </div>
      </div>

      <style jsx>{`
        .header {
          width: 100%;

          background:
            rgba(
              255,
              255,
              255,
              0.96
            );

          border-bottom:
            1px solid #e8ebef;

          backdrop-filter:
            blur(16px);
        }

        .headerInner {
          width:
            calc(100% - 48px);

          max-width: 1280px;
          min-height: 82px;

          margin: 0 auto;

          display: flex;
          align-items: center;
          justify-content:
            space-between;

          gap: 28px;
        }

        /* BRAND */

        .brand {
          display: inline-flex;
          align-items: center;

          gap: 12px;

          text-decoration: none;
        }

        .brandMark {
          width: 44px;
          height: 44px;

          display: grid;
          place-items: center;

          border-radius: 13px;

          color: white;

          background:
            linear-gradient(
              135deg,
              #0f5ce8,
              #6548e8
            );

          box-shadow:
            0 8px 24px
            rgba(
              42,
              91,
              220,
              0.2
            );
        }

        .brandMark
          :global(svg) {
          width: 21px;
          height: 21px;
        }

        .brandName {
          color: #172033;

          font-size: 20px;
          font-weight: 800;

          letter-spacing: -0.6px;
        }

        /* RIGHT */

        .rightSide {
          display: flex;
          align-items: center;

          gap: 10px;
        }

        /* LANGUAGE */

        .languageSwitcher {
          padding: 4px;

          display: flex;
          align-items: center;

          gap: 3px;

          border:
            1px solid #e3e7ec;

          border-radius: 11px;

          background: #f6f8fa;
        }

        .languageSwitcher
          button {
          min-width: 48px;
          height: 36px;

          padding: 0 10px;

          border: 0;
          border-radius: 8px;

          color: #7a8491;
          background: transparent;

          cursor: pointer;

          font-size: 13px;
          font-weight: 750;

          transition:
            background 0.18s ease,
            color 0.18s ease,
            box-shadow 0.18s ease;
        }

        .languageSwitcher
          button.active {
          color: #172033;

          background: white;

          box-shadow:
            0 2px 8px
            rgba(
              19,
              32,
              51,
              0.08
            );
        }

        /* BUTTONS */

        .loginButton,
        .signupButton {
          min-height: 42px;

          padding: 0 16px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border-radius: 10px;

          text-decoration: none;

          font-size: 14px;
          font-weight: 700;

          transition:
            transform 0.18s ease,
            box-shadow 0.18s ease;
        }

        .loginButton {
          color: #263244;

          border:
            1px solid #dfe4e9;

          background: white;
        }

        .signupButton {
          color: white;

          border:
            1px solid #172033;

          background: #172033;

          box-shadow:
            0 7px 18px
            rgba(
              23,
              32,
              51,
              0.12
            );
        }

        .loginButton:hover,
        .signupButton:hover {
          transform:
            translateY(-1px);
        }

        /* MOBILE */

        @media (
          max-width: 650px
        ) {
          .headerInner {
            width:
              calc(
                100% - 24px
              );

            min-height: 72px;

            gap: 12px;
          }

          .brandMark {
            width: 40px;
            height: 40px;
          }

          .brandName {
            font-size: 17px;
          }

          .rightSide {
            gap: 6px;
          }

          .languageSwitcher {
            display: none;
          }

          .loginButton {
            display: none;
          }

          .signupButton {
            min-height: 40px;

            padding: 0 12px;

            font-size: 13px;
          }
        }
      `}</style>
    </header>
  );
}

function QRIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
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

      <path d="M15 15h2v2h-2z" />
      <path d="M19 15h2v6h-6v-2" />
      <path d="M15 19v2" />
      <path d="M19 19h2" />
    </svg>
  );
}
