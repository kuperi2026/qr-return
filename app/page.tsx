"use client";

import { useState } from "react";

type Lang = "ka" | "en";

export default function HomePage() {
  const [language, setLanguage] =
    useState<Lang>("ka");

  const ka = language === "ka";

  return (
    <main className="page">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="header">
        <div className="headerInner">
          {/* BRAND */}

          <a href="/" className="brand">
            <div className="logoMark">
              <QRLogoIcon />
            </div>

            <div className="brandText">
              <strong>
                QR RETURN
              </strong>

              <span>
                SMART LOST &amp; FOUND
              </span>
            </div>
          </a>

          {/* NAVIGATION */}

          <nav className="navigation">
            <a href="#about">
              {ka
                ? "ჩვენ შესახებ"
                : "About"}
            </a>

            <a href="/store">
              {ka
                ? "ონლაინ შეძენა"
                : "Shop Online"}
            </a>

            <a href="#faq">
              {ka
                ? "ხშირად დასმული კითხვები"
                : "FAQ"}
            </a>

            <a href="/support">
              {ka
                ? "კონტაქტი"
                : "Contact"}
            </a>
          </nav>

          {/* RIGHT */}

          <div className="headerActions">
            {/* LANGUAGE */}

            <div className="languages">
              <button
                type="button"
                className={
                  language === "ka"
                    ? "active"
                    : ""
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
                  language === "en"
                    ? "active"
                    : ""
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
              className="headerButton"
            >
              {ka
                ? "შესვლა"
                : "Sign In"}
            </a>

            {/* REGISTER */}

            <a
              href="/signup"
              className="headerButton"
            >
              {ka
                ? "რეგისტრაცია"
                : "Register"}
            </a>

            {/* ADMIN — ახლა ტესტირებისთვის ჩანს */}

            <a
              href="/admin"
              className="adminButton"
            >
              {ka
                ? "ადმინ პანელი"
                : "Admin Panel"}
            </a>
          </div>
        </div>
      </header>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="hero">
        <div className="heroInner">
          {/* =================================================
              LEFT — EMERGENCY
          ================================================== */}

          <div className="left">
            <div className="sectionLabel">
              <span className="labelLine" />

              <span>
                EMERGENCY
              </span>
            </div>

            <h1>
              {ka
                ? "მნიშვნელოვანი ინფორმაცია მაშინ, როცა ის ყველაზე მეტად გჭირდებათ."
                : "Important information when you need it most."}
            </h1>

            <p className="lead">
              {ka
                ? "QR RETURN Emergency პროფილი საშუალებას აძლევს დამხმარე ადამიანს ერთი QR სკანირებით ნახოს თქვენ მიერ წინასწარ არჩეული მნიშვნელოვანი ინფორმაცია და საგანგებო საკონტაქტო პირი."
                : "A QR RETURN Emergency profile allows a helper to access the important information and emergency contact you have chosen to share with one QR scan."}
            </p>

            {/* EMERGENCY UI CARD */}

            <div className="emergencyCard">
              <div className="emergencyIcon">
                <MedicalIcon />
              </div>

              <div className="emergencyContent">
                <small>
                  QR RETURN
                </small>

                <h2>
                  {ka
                    ? "Emergency პროფილი"
                    : "Emergency Profile"}
                </h2>

                <p>
                  {ka
                    ? "საჭირო ინფორმაცია, საგანგებო კონტაქტი და თქვენ მიერ არჩეული მონაცემები — ერთ პროფილში."
                    : "Important information, emergency contacts and the details you choose to share — in one profile."}
                </p>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="actions">
              <a
                href="/emergency"
                className="primaryButton"
              >
                {ka
                  ? "Emergency პროფილი"
                  : "Emergency Profile"}

                <ArrowIcon />
              </a>

              <a
                href="/store"
                className="secondaryButton"
              >
                {ka
                  ? "პროდუქტების ნახვა"
                  : "View Products"}
              </a>
            </div>

            {/* MINI POINTS */}

            <div className="miniPoints">
              <div>
                <CheckIcon />

                <span>
                  {ka
                    ? "სწრაფი წვდომა"
                    : "Fast access"}
                </span>
              </div>

              <div>
                <CheckIcon />

                <span>
                  {ka
                    ? "თქვენი კონტროლი"
                    : "Your control"}
                </span>
              </div>

              <div>
                <CheckIcon />

                <span>
                  {ka
                    ? "აპლიკაციის გარეშე"
                    : "No app required"}
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT — QR CIRCLE
          ================================================== */}

          <div className="right">
            <div className="circle">
              {/* ORBITS */}

              <div className="orbit orbitOuter" />
              <div className="orbit orbitInner" />

              {/* CENTER */}

              <div className="centerQR">
                <div className="qrBox">
                  <QRIcon />
                </div>

                <strong>
                  QR RETURN
                </strong>

                <span>
                  {ka
                    ? "ერთი სკანირება"
                    : "ONE SCAN"}
                </span>
              </div>

              {/* DOG */}

              <ProductNode
                className="dog"
                label={
                  ka ? "ძაღლი" : "Dog"
                }
              >
                <DogIcon />
              </ProductNode>

              {/* CAT */}

              <ProductNode
                className="cat"
                label={
                  ka ? "კატა" : "Cat"
                }
              >
                <CatIcon />
              </ProductNode>

              {/* WALLET */}

              <ProductNode
                className="wallet"
                label={
                  ka
                    ? "საფულე"
                    : "Wallet"
                }
              >
                <WalletIcon />
              </ProductNode>

              {/* KEYS */}

              <ProductNode
                className="keys"
                label={
                  ka
                    ? "გასაღები"
                    : "Keys"
                }
              >
                <KeyIcon />
              </ProductNode>

              {/* BAG */}

              <ProductNode
                className="bag"
                label={
                  ka
                    ? "ჩანთა"
                    : "Bag"
                }
              >
                <BagIcon />
              </ProductNode>

              {/* SUITCASE */}

              <ProductNode
                className="suitcase"
                label={
                  ka
                    ? "ჩემოდანი"
                    : "Suitcase"
                }
              >
                <SuitcaseIcon />
              </ProductNode>
            </div>

            <p className="circleText">
              {ka
                ? "ერთი QR RETURN სისტემა თქვენი ნივთებისა და საყვარელი ცხოველებისთვის."
                : "One QR RETURN system for your belongings and pets."}
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          BOTTOM MINI BAR
      ====================================================== */}

      <section className="benefits">
        <div className="benefitsInner">
          <div className="benefit">
            <ShieldIcon />

            <div>
              <strong>
                {ka
                  ? "უსაფრთხო"
                  : "Secure"}
              </strong>

              <span>
                {ka
                  ? "თქვენ აკონტროლებთ ინფორმაციას"
                  : "You control your information"}
              </span>
            </div>
          </div>

          <div className="benefit">
            <SmallQRIcon />

            <div>
              <strong>
                {ka
                  ? "ერთი QR კოდი"
                  : "One QR Code"}
              </strong>

              <span>
                {ka
                  ? "ერთი მარტივი სკანირება"
                  : "One simple scan"}
              </span>
            </div>
          </div>

          <div className="benefit">
            <UserControlIcon />

            <div>
              <strong>
                {ka
                  ? "თქვენი კონტროლი"
                  : "Your Control"}
              </strong>

              <span>
                {ka
                  ? "თავად ირჩევთ რა გამოჩნდება"
                  : "Choose what others can see"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          STYLE
      ====================================================== */}

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;

          color: #172b43;

          background: #ffffff;
        }

        /* =========================
           HEADER
        ========================= */

        .header {
          position: relative;
          z-index: 100;

          width: 100%;

          background: #ffffff;

          border-bottom:
            1px solid #e9edf2;
        }

        .headerInner {
          width:
            calc(100% - 110px);

          max-width: 1380px;
          min-height: 78px;

          margin: 0 auto;

          display: grid;

          grid-template-columns:
            205px 1fr auto;

          align-items: center;

          gap: 22px;
        }

        .brand {
          display: flex;
          align-items: center;

          gap: 10px;

          text-decoration: none;
        }

        .logoMark {
          width: 39px;
          height: 39px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          color: #ffffff;

          background: #172b43;
        }

        .brandText strong,
        .brandText span {
          display: block;
        }

        .brandText strong {
          color: #172b43;

          font-size: 16px;
          font-weight: 900;

          letter-spacing: -0.4px;
        }

        .brandText span {
          margin-top: 3px;

          color: #9aa4b0;

          font-size: 7px;
          font-weight: 850;

          letter-spacing: 1.35px;
        }

        .navigation {
          display: flex;
          align-items: center;

          gap: 27px;
        }

        .navigation a {
          color: #44566b;

          text-decoration: none;

          white-space: nowrap;

          font-size: 12px;
          font-weight: 750;
        }

        .navigation a:hover {
          color: #1266e9;
        }

        .headerActions {
          padding-right: 22px;

          display: flex;
          align-items: center;

          gap: 7px;
        }

        /* LANGUAGE */

        .languages {
          margin-right: 8px;

          display: flex;
          align-items: center;

          gap: 7px;
        }

        .languages button {
          padding: 5px 2px;

          border: 0;

          color: #7c8998;

          background: transparent;

          cursor: pointer;

          font-family: inherit;

          font-size: 11px;
          font-weight: 900;
        }

        .languages button.active {
          color: #1266e9;
        }

        .languages span {
          width: 1px;
          height: 14px;

          background: #d8dee5;
        }

        /* HEADER BUTTONS */

        .headerButton,
        .adminButton {
          min-height: 38px;

          padding: 0 13px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border-radius: 9px;

          text-decoration: none;

          white-space: nowrap;

          font-size: 10.5px;
          font-weight: 850;
        }

        .headerButton {
          color: #ffffff;

          border:
            1px solid #1266e9;

          background: #1266e9;
        }

        .adminButton {
          color: #172b43;

          border:
            1px solid #d8e0e9;

          background: #ffffff;
        }

        /* =========================
           HERO
        ========================= */

        .hero {
          width: 100%;

          overflow: hidden;

          background:
            radial-gradient(
              circle at 78% 44%,
              rgba(
                18,
                102,
                233,
                0.06
              ),
              transparent 34%
            ),
            #ffffff;
        }

        .heroInner {
          width:
            calc(100% - 80px);

          max-width: 1240px;
          min-height: 650px;

          margin: 0 auto;

          padding: 70px 0 76px;

          display: grid;

          grid-template-columns:
            0.93fr 1.07fr;

          align-items: center;

          gap: 72px;
        }

        /* =========================
           LEFT
        ========================= */

        .left {
          max-width: 530px;
        }

        .sectionLabel {
          display: flex;
          align-items: center;

          gap: 10px;

          color: #1266e9;

          font-size: 10px;
          font-weight: 900;

          letter-spacing: 1.3px;
        }

        .labelLine {
          width: 26px;
          height: 1px;

          background: #1266e9;
        }

        .left h1 {
          margin: 17px 0 0;

          color: #172b43;

          font-size:
            clamp(
              38px,
              4vw,
              50px
            );

          line-height: 1.08;

          letter-spacing:
            -1.8px;

          font-weight: 790;
        }

        .lead {
          max-width: 500px;

          margin: 20px 0 0;

          color: #69788b;

          font-size: 14px;

          line-height: 1.75;
        }

        /* EMERGENCY CARD */

        .emergencyCard {
          margin-top: 27px;

          padding: 18px;

          display: grid;

          grid-template-columns:
            46px 1fr;

          align-items: start;

          gap: 14px;

          border:
            1px solid #e0e8f2;

          border-radius: 13px;

          background: #f9fbfe;
        }

        .emergencyIcon {
          width: 46px;
          height: 46px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          color: #1266e9;

          background: #eaf3ff;
        }

        .emergencyContent small {
          color: #1266e9;

          font-size: 8px;
          font-weight: 900;

          letter-spacing: 1px;
        }

        .emergencyContent h2 {
          margin: 4px 0 0;

          color: #263b53;

          font-size: 15px;
        }

        .emergencyContent p {
          max-width: 380px;

          margin: 6px 0 0;

          color: #748397;

          font-size: 11px;

          line-height: 1.6;
        }

        /* ACTIONS */

        .actions {
          margin-top: 21px;

          display: flex;
          align-items: center;

          gap: 9px;
        }

        .primaryButton,
        .secondaryButton {
          min-height: 44px;

          padding: 0 16px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          gap: 8px;

          border-radius: 9px;

          text-decoration: none;

          font-size: 10.5px;
          font-weight: 850;
        }

        .primaryButton {
          color: #ffffff;

          border:
            1px solid #1266e9;

          background: #1266e9;
        }

        .secondaryButton {
          color: #42556b;

          border:
            1px solid #dae3ed;

          background: #ffffff;
        }

        /* MINI POINTS */

        .miniPoints {
          margin-top: 25px;

          display: flex;
          flex-wrap: wrap;

          gap: 14px;
        }

        .miniPoints div {
          display: flex;
          align-items: center;

          gap: 6px;

          color: #738195;

          font-size: 9.5px;

          font-weight: 700;
        }

        /* =========================
           RIGHT
        ========================= */

        .right {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .circle {
          width: 500px;
          height: 500px;

          position: relative;

          border-radius: 50%;

          background:
            radial-gradient(
              circle at center,
              #f5f9ff 0%,
              #ffffff 66%
            );
        }

        .orbit {
          position: absolute;

          border-radius: 50%;

          border:
            1px solid #dae8fa;
        }

        .orbitOuter {
          inset: 50px;
        }

        .orbitInner {
          inset: 103px;

          border-color:
            #edf3fa;
        }

        /* CENTER */

        .centerQR {
          width: 148px;
          height: 148px;

          position: absolute;

          z-index: 5;

          top: 50%;
          left: 50%;

          transform:
            translate(
              -50%,
              -50%
            );

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          border:
            1px solid #d0e0f6;

          border-radius: 50%;

          background: #ffffff;

          box-shadow:
            0 12px 32px
            rgba(
              31,
              77,
              135,
              0.09
            );
        }

        .qrBox {
          color: #1266e9;
        }

        .centerQR strong {
          margin-top: 5px;

          color: #263b53;

          font-size: 11px;
          font-weight: 900;
        }

        .centerQR span {
          margin-top: 3px;

          color: #919ba7;

          font-size: 6.5px;

          font-weight: 900;

          letter-spacing: 1px;
        }

        /* PRODUCTS */

        .circle :global(.productNode) {
          width: 82px;

          position: absolute;

          z-index: 6;

          display: flex;
          flex-direction: column;

          align-items: center;

          text-align: center;
        }

        .circle :global(.nodeIcon) {
          width: 61px;
          height: 61px;

          display: grid;
          place-items: center;

          border:
            1px solid #dce7f5;

          border-radius: 50%;

          color: #1266e9;

          background: #ffffff;

          box-shadow:
            0 7px 18px
            rgba(
              31,
              73,
              125,
              0.06
            );
        }

        .circle :global(.nodeLabel) {
          margin-top: 6px;

          color: #526377;

          font-size: 8.5px;

          font-weight: 800;
        }

        .circle :global(.dog) {
          top: 4px;
          left: 132px;
        }

        .circle :global(.cat) {
          top: 4px;
          right: 132px;
        }

        .circle :global(.wallet) {
          top: 192px;
          right: 0;
        }

        .circle :global(.keys) {
          right: 92px;
          bottom: 14px;
        }

        .circle :global(.bag) {
          left: 92px;
          bottom: 14px;
        }

        .circle :global(.suitcase) {
          top: 192px;
          left: 0;
        }

        .circleText {
          max-width: 410px;

          margin: 7px 0 0;

          color: #8b97a5;

          text-align: center;

          font-size: 9.5px;

          line-height: 1.55;
        }

        /* =========================
           BENEFITS
        ========================= */

        .benefits {
          width: 100%;

          border-top:
            1px solid #edf1f5;

          border-bottom:
            1px solid #edf1f5;

          background: #fbfcfe;
        }

        .benefitsInner {
          width:
            calc(100% - 80px);

          max-width: 1180px;

          margin: auto;

          padding: 22px 0;

          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 0;
        }

        .benefit {
          padding: 0 30px;

          display: flex;
          align-items: center;

          gap: 12px;

          border-right:
            1px solid #e3e8ee;
        }

        .benefit:first-child {
          padding-left: 0;
        }

        .benefit:last-child {
          border-right: 0;
        }

        .benefit :global(svg) {
          flex: 0 0 auto;

          color: #1266e9;
        }

        .benefit strong,
        .benefit span {
          display: block;
        }

        .benefit strong {
          color: #293d55;

          font-size: 11px;
        }

        .benefit span {
          margin-top: 3px;

          color: #7f8b9a;

          font-size: 8.5px;
        }

        /* =========================
           RESPONSIVE
        ========================= */

        @media (
          max-width: 1100px
        ) {
          .navigation {
            gap: 15px;
          }

          .navigation a {
            font-size: 10px;
          }

          .headerInner {
            width:
              calc(100% - 40px);
          }

          .headerActions {
            padding-right: 0;
          }
        }

        @media (
          max-width: 960px
        ) {
          .navigation {
            display: none;
          }

          .headerInner {
            grid-template-columns:
              auto 1fr;
          }

          .headerActions {
            justify-self: end;
          }

          .heroInner {
            grid-template-columns:
              1fr;

            gap: 55px;
          }

          .left {
            max-width: 650px;

            margin: auto;

            text-align: center;
          }

          .sectionLabel,
          .actions,
          .miniPoints {
            justify-content: center;
          }

          .emergencyCard {
            max-width: 540px;

            margin-left: auto;
            margin-right: auto;

            text-align: left;
          }

          .benefitsInner {
            grid-template-columns:
              1fr;
          }

          .benefit {
            padding: 15px 0;

            border-right: 0;

            border-bottom:
              1px solid #e3e8ee;
          }

          .benefit:last-child {
            border-bottom: 0;
          }
        }

        @media (
          max-width: 620px
        ) {
          .headerInner {
            width:
              calc(100% - 20px);

            min-height: 70px;
          }

          .brandText span,
          .adminButton {
            display: none;
          }

          .languages {
            margin-right: 2px;
          }

          .languages button {
            font-size: 9px;
          }

          .headerButton {
            min-height: 34px;

            padding: 0 8px;

            font-size: 8.5px;
          }

          .heroInner {
            width:
              calc(100% - 28px);

            padding: 55px 0 65px;
          }

          .left h1 {
            font-size: 36px;

            letter-spacing:
              -1.3px;
          }

          .lead {
            font-size: 13px;
          }

          .circle {
            width: 350px;
            height: 350px;
          }

          .orbitOuter {
            inset: 37px;
          }

          .orbitInner {
            inset: 74px;
          }

          .centerQR {
            width: 108px;
            height: 108px;
          }

          .circle :global(.productNode) {
            width: 63px;
          }

          .circle :global(.nodeIcon) {
            width: 47px;
            height: 47px;
          }

          .circle :global(.dog) {
            top: 0;
            left: 91px;
          }

          .circle :global(.cat) {
            top: 0;
            right: 91px;
          }

          .circle :global(.wallet) {
            top: 131px;
            right: 0;
          }

          .circle :global(.keys) {
            right: 61px;
            bottom: 3px;
          }

          .circle :global(.bag) {
            left: 61px;
            bottom: 3px;
          }

          .circle :global(.suitcase) {
            top: 131px;
            left: 0;
          }
        }
      `}</style>
    </main>
  );
}

/* =========================================================
   PRODUCT NODE
========================================================= */

function ProductNode({
  className,
  label,
  children,
}: {
  className: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`productNode ${className}`}
    >
      <div className="nodeIcon">
        {children}
      </div>

      <span className="nodeLabel">
        {label}
      </span>
    </div>
  );
}

/* =========================================================
   ICONS
========================================================= */

function QRLogoIcon() {
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

      <path d="M14 14h3v3h4M14 21v-4M18 18h3v3" />
    </svg>
  );
}

function QRIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
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

      <path d="M14 14h3v3h4M14 21v-4M18 18h3v3" />
    </svg>
  );
}

function MedicalIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3Z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 12h14" />
      <path d="m14 7 5 5-5 5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1266e9"
      strokeWidth="2"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
      />

      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  );
}

function DogIcon() {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M6 8 3 5v7l3 3" />
      <path d="m18 8 3-3v7l-3 3" />
      <path d="M6 8c1-2 3-3 6-3s5 1 6 3v7c0 3-2 5-6 5s-6-2-6-5V8Z" />
      <circle
        cx="9"
        cy="12"
        r=".7"
        fill="currentColor"
      />
      <circle
        cx="15"
        cy="12"
        r=".7"
        fill="currentColor"
      />
    </svg>
  );
}

function CatIcon() {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="m6 8-2-5 5 3" />
      <path d="m18 8 2-5-5 3" />
      <path d="M6 8c1-2 3-3 6-3s5 1 6 3v7c0 3-2 5-6 5s-6-2-6-5V8Z" />
      <circle
        cx="9"
        cy="12"
        r=".7"
        fill="currentColor"
      />
      <circle
        cx="15"
        cy="12"
        r=".7"
        fill="currentColor"
      />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect
        x="3"
        y="6"
        width="18"
        height="13"
        rx="2"
      />

      <path d="M3 9h18" />

      <path d="M16 12h5v4h-5a2 2 0 0 1 0-4Z" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <circle
        cx="8"
        cy="12"
        r="4"
      />

      <path d="M12 12h9M18 12v3M15 12v2" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M5 8h14l1 12H4L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function SuitcaseIcon() {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect
        x="5"
        y="6"
        width="14"
        height="14"
        rx="2"
      />

      <path d="M9 6V4h6v2M9 10v6M15 10v6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function SmallQRIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect
        x="3"
        y="3"
        width="6"
        height="6"
      />

      <rect
        x="15"
        y="3"
        width="6"
        height="6"
      />

      <rect
        x="3"
        y="15"
        width="6"
        height="6"
      />

      <path d="M15 15h2v2h-2zM19 15h2v6h-6v-2" />
    </svg>
  );
}

function UserControlIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
      />

      <path d="M5 21c0-4 3-6 7-6s7 2 7 6" />
      <path d="M18 5h3M19.5 3.5v3" />
    </svg>
  );
}
