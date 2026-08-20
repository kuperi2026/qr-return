"use client";

import Link from "next/link";
import { useState } from "react";

type Lang = "ka" | "en";

const categories = [
  {
    number: "01",
    icon: "🐕",
    ka: "ძაღლი",
    en: "Dog",
    href: "/register?type=dog",
  },
  {
    number: "02",
    icon: "🐈",
    ka: "კატა",
    en: "Cat",
    href: "/register?type=cat",
  },
  {
    number: "03",
    icon: "🔑",
    ka: "გასაღები",
    en: "Keys",
    href: "/register?type=keys",
  },
  {
    number: "04",
    icon: "👛",
    ka: "საფულე",
    en: "Wallet",
    href: "/register?type=wallet",
  },
  {
    number: "05",
    icon: "🧳",
    ka: "ჩემოდანი",
    en: "Suitcase",
    href: "/register?type=suitcase",
  },
  {
    number: "06",
    icon: "🎒",
    ka: "ჩანთა",
    en: "Bag",
    href: "/register?type=bag",
  },
];

const features = [
  {
    number: "01",
    icon: "💬",
    titleKa: "Live Chat",
    titleEn: "Live Chat",
    textKa:
      "მპოვნელი და მფლობელი ერთმანეთს პირდაპირ QR RETURN-ის დაცულ ჩათში უკავშირდებიან.",
    textEn:
      "Finder and owner can communicate directly through QR RETURN's protected Live Chat.",
  },
  {
    number: "02",
    icon: "📍",
    titleKa: "ლოკაციის გაზიარება",
    titleEn: "Location Sharing",
    textKa:
      "მპოვნელს შეუძლია ერთი მოქმედებით გაგიზიაროთ ნივთის ან ცხოველის მდებარეობა.",
    textEn:
      "The finder can share the location of your item or pet with a single action.",
  },
  {
    number: "03",
    icon: "🎁",
    titleKa: "მპოვნელის ჯილდო",
    titleEn: "Finder Reward",
    textKa:
      "სურვილის შემთხვევაში პროფილზე მიუთითეთ ჯილდო და გაზარდეთ დაბრუნების მოტივაცია.",
    textEn:
      "Optionally offer a finder reward to encourage a fast and safe return.",
  },
  {
    number: "04",
    icon: "🛡️",
    titleKa: "პირადი მონაცემების კონტროლი",
    titleEn: "Privacy Controls",
    textKa:
      "თქვენ წყვეტთ ზუსტად რომელი ინფორმაცია, ნომერი და დაკავშირების მეთოდი დაინახოს მპოვნელმა.",
    textEn:
      "You decide exactly what information and contact methods the finder can see.",
  },
];

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("ka");

  const ka = lang === "ka";

  return (
    <main className="page">
      {/* =========================
          HEADER
      ========================== */}

      <header className="header">
        <Link href="/" className="brand">
          <span className="brandMark">
            QR
          </span>

          <span className="brandText">
            <strong>
              QR RETURN
            </strong>

            <small>
              SECURE RETURN SYSTEM
            </small>
          </span>
        </Link>

        <nav className="nav">
          <a href="#how">
            {ka
              ? "როგორ მუშაობს"
              : "How it works"}
          </a>

          <a href="#profiles">
            {ka
              ? "QR პროფილები"
              : "QR Profiles"}
          </a>

          <a href="#emergency">
            Emergency
          </a>

          <Link href="/store">
            {ka
              ? "მაღაზია"
              : "Store"}
          </Link>
        </nav>

        <div className="headerActions">
          <div className="language">
            <button
              type="button"
              className={ka ? "active" : ""}
              onClick={() => setLang("ka")}
            >
              GEO
            </button>

            <button
              type="button"
              className={!ka ? "active" : ""}
              onClick={() => setLang("en")}
            >
              ENG
            </button>
          </div>

          <Link
            href="/admin"
            className="admin"
          >
            Admin
          </Link>

          <Link
            href="/login"
            className="login"
          >
            {ka
              ? "შესვლა"
              : "Login"}
          </Link>

          <Link
            href="/register"
            className="register"
          >
            {ka
              ? "რეგისტრაცია"
              : "Register"}
          </Link>
        </div>
      </header>

      {/* =========================
          HERO
      ========================== */}

      <section className="hero">
        <div className="heroGlow glowOne" />
        <div className="heroGlow glowTwo" />

        <div className="heroContent">
          <div className="heroEyebrow">
            <span className="liveDot" />

            QR RETURN · SMART LOST & FOUND
          </div>

          <h1>
            {ka ? (
              <>
                დაკარგვა არ ნიშნავს
                <br />
                <span>
                  დამშვიდობებას.
                </span>
              </>
            ) : (
              <>
                Losing it doesn&apos;t mean
                <br />
                <span>
                  saying goodbye.
                </span>
              </>
            )}
          </h1>

          <p className="heroDescription">
            {ka
              ? "ერთი QR კოდი აკავშირებს მპოვნელს მფლობელთან — Live Chat, ლოკაციის გაზიარება, უსაფრთხო კონტაქტი და პირადი მონაცემების სრული კონტროლი."
              : "One QR code connects finder and owner — with Live Chat, location sharing, secure contact and full privacy control."}
          </p>

          <div className="heroButtons">
            <Link
              href="/register"
              className="primaryHero"
            >
              <span className="plus">
                +
              </span>

              {ka
                ? "QR პროფილის შექმნა"
                : "Create QR Profile"}

              <span className="arrow">
                →
              </span>
            </Link>

            <Link
              href="/store"
              className="secondaryHero"
            >
              <span>
                ◈
              </span>

              {ka
                ? "QR-ის შეძენა"
                : "Buy QR"}
            </Link>
          </div>

          <div className="heroMiniLinks">
            <Link href="/account/messages">
              <span>💬</span>
              Live Chat
            </Link>

            <Link href="/register?type=emergency">
              <span>✚</span>
              Emergency
            </Link>

            <Link href="/my-profiles">
              <span>◎</span>
              {ka
                ? "ჩემი პროფილები"
                : "My Profiles"}
            </Link>
          </div>
        </div>

        <div className="heroVisual">
          <div className="device">
            <div className="deviceTop">
              <span className="miniBrand">
                QR RETURN
              </span>

              <span className="connected">
                ● LIVE
              </span>
            </div>

            <div className="profilePreview">
              <div className="animal">
                🐕
              </div>

              <span className="found">
                FOUND PROFILE
              </span>

              <h3>
                Toby
              </h3>

              <p>
                {ka
                  ? "მე დავიკარგე. გთხოვთ დაუკავშირდეთ ჩემს პატრონს."
                  : "I'm lost. Please contact my owner."}
              </p>

              <button type="button">
                💬 Live Chat
              </button>

              <button
                type="button"
                className="locationButton"
              >
                📍{" "}
                {ka
                  ? "ლოკაციის გაზიარება"
                  : "Share Location"}
              </button>
            </div>

            <div className="privacyBar">
              <span>
                🛡️
              </span>

              <div>
                <strong>
                  Privacy protected
                </strong>

                <small>
                  Owner controls visibility
                </small>
              </div>
            </div>
          </div>

          <div className="floatingCard chatCard">
            <span className="floatingIcon">
              💬
            </span>

            <div>
              <strong>
                Live Chat
              </strong>

              <small>
                Finder connected
              </small>
            </div>
          </div>

          <div className="floatingCard locationCard">
            <span className="floatingIcon">
              📍
            </span>

            <div>
              <strong>
                Location
              </strong>

              <small>
                Shared securely
              </small>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          TRUST BAR
      ========================== */}

      <section className="trustBar">
        <div>
          <strong>
            01
          </strong>

          <span>
            {ka
              ? "მპოვნელს რეგისტრაცია არ სჭირდება"
              : "No finder registration required"}
          </span>
        </div>

        <div>
          <strong>
            02
          </strong>

          <span>
            {ka
              ? "ერთი სკანირება საკმარისია"
              : "One scan is enough"}
          </span>
        </div>

        <div>
          <strong>
            03
          </strong>

          <span>
            {ka
              ? "კონტაქტს მფლობელი აკონტროლებს"
              : "Owner controls contact visibility"}
          </span>
        </div>

        <div>
          <strong>
            04
          </strong>

          <span>
            Live Chat + Location
          </span>
        </div>
      </section>

      {/* =========================
          PROFILE TYPES
      ========================== */}

      <section
        className="profiles"
        id="profiles"
      >
        <div className="sectionHead">
          <div>
            <span className="sectionEyebrow">
              01 · QR PROFILES
            </span>

            <h2>
              {ka
                ? "რის დაცვას აპირებთ?"
                : "What do you want to protect?"}
            </h2>

            <p>
              {ka
                ? "აირჩიეთ ნივთი ან საყვარელი ცხოველი და შექმენით მისი ინდივიდუალური QR RETURN პროფილი."
                : "Choose a belonging or pet and create its individual QR RETURN profile."}
            </p>
          </div>

          <Link
            href="/register"
            className="sectionAction"
          >
            {ka
              ? "ყველა პროფილის შექმნა"
              : "Create a Profile"}{" "}
            →
          </Link>
        </div>

        <div className="categoryGrid">
          {categories.map(
            (category) => (
              <Link
                href={category.href}
                key={category.number}
                className="categoryCard"
              >
                <div className="categoryTop">
                  <span>
                    {category.number}
                  </span>

                  <span className="categoryArrow">
                    ↗
                  </span>
                </div>

                <div className="categoryIcon">
                  {category.icon}
                </div>

                <strong>
                  {ka
                    ? category.ka
                    : category.en}
                </strong>

                <small>
                  CREATE PROFILE
                </small>
              </Link>
            )
          )}
        </div>
      </section>

      {/* =========================
          HOW IT WORKS
      ========================== */}

      <section
        className="how"
        id="how"
      >
        <div className="howIntro">
          <span className="sectionEyebrow light">
            02 · HOW IT WORKS
          </span>

          <h2>
            {ka
              ? "ერთი QR. ოთხი მარტივი ნაბიჯი."
              : "One QR. Four simple steps."}
          </h2>

          <p>
            {ka
              ? "მარტივი პროცესი მფლობელისთვისაც და მპოვნელისთვისაც."
              : "A simple experience for both owner and finder."}
          </p>
        </div>

        <div className="howSteps">
          <div className="howStep">
            <span className="stepNumber">
              01
            </span>

            <div className="stepIcon">
              ◎
            </div>

            <h3>
              {ka
                ? "შექმენი პროფილი"
                : "Create Profile"}
            </h3>

            <p>
              {ka
                ? "დაამატე ნივთი ან ცხოველი და აირჩიე რომელი მონაცემები გამოჩნდეს."
                : "Add your item or pet and choose which information is visible."}
            </p>
          </div>

          <div className="howStep">
            <span className="stepNumber">
              02
            </span>

            <div className="stepIcon">
              ◈
            </div>

            <h3>
              {ka
                ? "მიაბი QR"
                : "Connect QR"}
            </h3>

            <p>
              {ka
                ? "QR ბრელოკი ან სტიკერი დაუკავშირე კონკრეტულ პროფილს."
                : "Connect your QR tag or sticker to the selected profile."}
            </p>
          </div>

          <div className="howStep">
            <span className="stepNumber">
              03
            </span>

            <div className="stepIcon">
              ◉
            </div>

            <h3>
              {ka
                ? "მპოვნელი ასკანერებს"
                : "Finder Scans"}
            </h3>

            <p>
              {ka
                ? "რეგისტრაციის გარეშე მპოვნელი ერთ წამში იხილავს თქვენს მიერ დაშვებულ ინფორმაციას."
                : "Without registration, the finder instantly sees only the information you allow."}
            </p>
          </div>

          <div className="howStep">
            <span className="stepNumber">
              04
            </span>

            <div className="stepIcon">
              ↗
            </div>

            <h3>
              {ka
                ? "კავშირი და დაბრუნება"
                : "Connect & Return"}
            </h3>

            <p>
              {ka
                ? "Live Chat, ტელეფონი, WhatsApp ან ლოკაცია — თქვენ ირჩევთ დაკავშირების გზას."
                : "Live Chat, phone, WhatsApp or location — you choose how the finder can reach you."}
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          FEATURES
      ========================== */}

      <section className="featureSection">
        <div className="sectionHead">
          <div>
            <span className="sectionEyebrow">
              03 · SMART FEATURES
            </span>

            <h2>
              {ka
                ? "უბრალოდ QR-ზე მეტი."
                : "More than just a QR code."}
            </h2>
          </div>

          <Link
            href="/account/messages"
            className="sectionAction"
          >
            Live Chat →
          </Link>
        </div>

        <div className="featureGrid">
          {features.map(
            (feature) => (
              <article
                className="featureCard"
                key={feature.number}
              >
                <div className="featureHeader">
                  <span className="featureNumber">
                    {feature.number}
                  </span>

                  <div className="featureIcon">
                    {feature.icon}
                  </div>
                </div>

                <h3>
                  {ka
                    ? feature.titleKa
                    : feature.titleEn}
                </h3>

                <p>
                  {ka
                    ? feature.textKa
                    : feature.textEn}
                </p>
              </article>
            )
          )}
        </div>
      </section>

      {/* =========================
          LIVE CHAT FEATURE
      ========================== */}

      <section className="liveChatSection">
        <div className="liveChatVisual">
          <div className="chatWindow">
            <div className="chatWindowTop">
              <div>
                <span className="chatAvatar">
                  F
                </span>

                <span>
                  <strong>
                    Finder
                  </strong>

                  <small>
                    ● Online
                  </small>
                </span>
              </div>

              <span className="secureChat">
                🔒 Secure
              </span>
            </div>

            <div className="chatMessages">
              <div className="finderBubble">
                {ka
                  ? "გამარჯობა, თქვენი ნივთი ვიპოვე."
                  : "Hi, I found your item."}
              </div>

              <div className="ownerBubble">
                {ka
                  ? "დიდი მადლობა! შეგიძლიათ ლოკაცია გამიზიაროთ?"
                  : "Thank you! Could you share your location?"}
              </div>

              <div className="locationBubble">
                📍{" "}
                {ka
                  ? "ლოკაცია გაზიარებულია"
                  : "Location shared"}
              </div>
            </div>

            <div className="chatComposer">
              <span>
                {ka
                  ? "შეტყობინება..."
                  : "Message..."}
              </span>

              <button type="button">
                ↑
              </button>
            </div>
          </div>
        </div>

        <div className="liveChatContent">
          <span className="sectionEyebrow">
            LIVE CHAT
          </span>

          <h2>
            {ka
              ? "მპოვნელთან პირდაპირი კავშირი — თქვენი ნომრის გამჟღავნების გარეშე."
              : "Talk directly to the finder — without exposing your phone number."}
          </h2>

          <p>
            {ka
              ? "QR RETURN Live Chat გაძლევთ საშუალებას სწრაფად დაუკავშირდეთ მპოვნელს, მიიღოთ ინფორმაცია და შეთანხმდეთ ნივთის დაბრუნებაზე."
              : "QR RETURN Live Chat lets you communicate quickly, receive updates and arrange a safe return."}
          </p>

          <div className="liveBenefits">
            <span>
              ✓{" "}
              {ka
                ? "მპოვნელს ანგარიში არ სჭირდება"
                : "No finder account required"}
            </span>

            <span>
              ✓{" "}
              {ka
                ? "პირადი ნომერი შეიძლება დამალული დარჩეს"
                : "Your phone number can remain private"}
            </span>

            <span>
              ✓{" "}
              {ka
                ? "შეტყობინებების ისტორია"
                : "Conversation history"}
            </span>
          </div>

          <Link
            href="/account/messages"
            className="darkButton"
          >
            💬 Live Chat
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* =========================
          EMERGENCY
      ========================== */}

      <section
        className="emergency"
        id="emergency"
      >
        <div className="emergencyAccent" />

        <div className="emergencyLeft">
          <div className="emergencyIcon">
            ✚
          </div>

          <div>
            <span className="emergencyLabel">
              QR RETURN EMERGENCY
            </span>

            <h2>
              {ka
                ? "Emergency ინფორმაცია, როცა ყოველი წამი მნიშვნელოვანია."
                : "Emergency information when every second matters."}
            </h2>

            <p>
              {ka
                ? "შექმენით Emergency QR პროფილი და განსაზღვრეთ რა აუცილებელი ინფორმაცია უნდა გამოჩნდეს QR-ის სკანირებისას."
                : "Create an Emergency QR profile and control what essential information appears when the QR is scanned."}
            </p>
          </div>
        </div>

        <div className="emergencyFeatures">
          <div>
            <span>
              01
            </span>

            <strong>
              {ka
                ? "Emergency Contact"
                : "Emergency Contact"}
            </strong>
          </div>

          <div>
            <span>
              02
            </span>

            <strong>
              {ka
                ? "აუცილებელი ინფორმაცია"
                : "Essential Information"}
            </strong>
          </div>

          <div>
            <span>
              03
            </span>

            <strong>
              {ka
                ? "სწრაფი QR წვდომა"
                : "Fast QR Access"}
            </strong>
          </div>
        </div>

        <Link
          href="/register?type=emergency"
          className="emergencyButton"
        >
          {ka
            ? "Emergency პროფილის შექმნა"
            : "Create Emergency Profile"}

          <span>→</span>
        </Link>
      </section>

      {/* =========================
          STORE
      ========================== */}

      <section className="storeSection">
        <div className="storeContent">
          <span className="sectionEyebrow light">
            04 · QR RETURN STORE
          </span>

          <h2>
            {ka
              ? "აირჩიე QR, რომელიც შენს ნივთს შეეფერება."
              : "Choose the QR that fits what you protect."}
          </h2>

          <p>
            {ka
              ? "QR ბრელოკები და სტიკერები სხვადასხვა დიზაინით. შეარჩიეთ პროდუქტი, რაოდენობა და მართეთ შეკვეთა თქვენი ანგარიშიდან."
              : "QR tags and stickers in multiple designs. Choose your product and quantity, then manage the order from your account."}
          </p>

          <Link
            href="/store"
            className="storeButton"
          >
            {ka
              ? "მაღაზიის ნახვა"
              : "Explore Store"}

            <span>→</span>
          </Link>
        </div>

        <div className="storeVisual">
          <div className="tag tagOne">
            <span>
              QR
            </span>

            <strong>
              RETURN
            </strong>
          </div>

          <div className="tag tagTwo">
            <span>
              QR
            </span>
          </div>

          <div className="sticker">
            <span>
              QR
            </span>

            <small>
              SCAN TO RETURN
            </small>
          </div>
        </div>
      </section>

      {/* =========================
          FINAL CTA
      ========================== */}

      <section className="finalCta">
        <span>
          QR RETURN
        </span>

        <h2>
          {ka
            ? "დაიცავი ის, რაც შენთვის მნიშვნელოვანია."
            : "Protect what matters to you."}
        </h2>

        <p>
          {ka
            ? "შექმენი პირველი QR პროფილი რამდენიმე წუთში."
            : "Create your first QR profile in just a few minutes."}
        </p>

        <div>
          <Link
            href="/register"
            className="finalPrimary"
          >
            +{" "}
            {ka
              ? "პროფილის შექმნა"
              : "Create Profile"}
          </Link>

          <Link
            href="/store"
            className="finalSecondary"
          >
            {ka
              ? "QR-ის შეძენა"
              : "Buy QR"}
          </Link>
        </div>
      </section>

      {/* =========================
          FOOTER
      ========================== */}

      <footer className="footer">
        <div className="footerBrand">
          <span className="brandMark">
            QR
          </span>

          <div>
            <strong>
              QR RETURN
            </strong>

            <p>
              {ka
                ? "დაკარგვა არ ნიშნავს დამშვიდობებას."
                : "Never lose what matters."}
            </p>
          </div>
        </div>

        <div className="footerColumn">
          <strong>
            PRODUCT
          </strong>

          <Link href="/register">
            Create Profile
          </Link>

          <Link href="/store">
            Store
          </Link>

          <Link href="/register?type=emergency">
            Emergency
          </Link>
        </div>

        <div className="footerColumn">
          <strong>
            ACCOUNT
          </strong>

          <Link href="/my-profiles">
            My Profiles
          </Link>

          <Link href="/account/messages">
            Live Chat
          </Link>

          <Link href="/account/notifications">
            Notifications
          </Link>
        </div>

        <div className="footerColumn">
          <strong>
            ADMIN
          </strong>

          <Link href="/admin">
            Admin Panel
          </Link>

          <Link href="/login">
            Login
          </Link>
        </div>

        <div className="copyright">
          © 2026 QR RETURN
        </div>
      </footer>

      {/* =========================
          STYLES
      ========================== */}

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          overflow: hidden;

          color: #142234;

          background: #ffffff;
        }

        /* HEADER */

        .header {
          width: calc(100% - 48px);
          max-width: 1240px;
          min-height: 78px;

          margin: auto;

          display: grid;
          grid-template-columns:
            auto 1fr auto;

          align-items: center;

          gap: 35px;

          border-bottom:
            1px solid #e8edf2;
        }

        .brand {
          display: flex;
          align-items: center;

          gap: 10px;

          text-decoration: none;
        }

        .brandMark {
          width: 46px;
          height: 46px;

          display: grid;
          place-items: center;

          flex: 0 0 46px;

          border-radius: 14px;

          color: white;

          background:
            linear-gradient(
              135deg,
              #0874f9,
              #6257f6
            );

          box-shadow:
            0 9px 24px
            rgba(
              28,
              102,
              234,
              0.2
            );

          font-size: 12px;
          font-weight: 950;
        }

        .brandText strong,
        .brandText small {
          display: block;
        }

        .brandText strong {
          color: #0874f9;

          font-size: 14px;
          font-weight: 950;

          letter-spacing: -0.4px;
        }

        .brandText small {
          margin-top: 3px;

          color: #7566f5;

          font-size: 5.5px;
          font-weight: 900;

          letter-spacing: 1.35px;
        }

        .nav {
          display: flex;

          align-items: center;
          justify-content: center;

          gap: 30px;
        }

        .nav a {
          position: relative;

          color: #536172;

          text-decoration: none;

          font-size: 8px;
          font-weight: 800;
        }

        .nav a::after {
          content: "";

          width: 0;
          height: 1px;

          position: absolute;

          left: 0;
          bottom: -7px;

          background: #0874f9;

          transition: width 0.2s ease;
        }

        .nav a:hover::after {
          width: 100%;
        }

        .headerActions {
          display: flex;

          align-items: center;

          gap: 6px;
        }

        .language {
          margin-right: 2px;
          padding: 3px;

          display: flex;

          border-radius: 9px;

          background: #f0f3f6;
        }

        .language button {
          min-width: 36px;
          height: 28px;

          border: 0;
          border-radius: 7px;

          color: #8793a0;
          background: transparent;

          cursor: pointer;

          font-size: 6px;
          font-weight: 950;
        }

        .language button.active {
          color: #0874f9;
          background: white;

          box-shadow:
            0 2px 7px
            rgba(
              25,
              42,
              67,
              0.08
            );
        }

        .admin,
        .login,
        .register {
          min-height: 34px;

          padding: 0 11px;

          display: inline-flex;

          align-items: center;
          justify-content: center;

          border-radius: 8px;

          text-decoration: none;

          font-size: 7px;
          font-weight: 900;
        }

        .admin {
          color: #8c55d9;

          border:
            1px solid #e8dcf6;

          background: #fbf8ff;
        }

        .login {
          color: #526171;

          border:
            1px solid #dfe5ea;

          background: white;
        }

        .register {
          color: white;

          border:
            1px solid #0874f9;

          background: #0874f9;
        }

        /* HERO */

        .hero {
          width: calc(100% - 48px);
          max-width: 1240px;
          min-height: 660px;

          margin: auto;

          position: relative;

          display: grid;

          grid-template-columns:
            minmax(0, 1fr)
            490px;

          align-items: center;

          gap: 60px;
        }

        .heroGlow {
          position: absolute;

          border-radius: 50%;

          filter: blur(70px);

          pointer-events: none;
        }

        .glowOne {
          width: 370px;
          height: 370px;

          right: 40px;
          top: 110px;

          background:
            rgba(
              98,
              87,
              246,
              0.11
            );
        }

        .glowTwo {
          width: 300px;
          height: 300px;

          left: -180px;
          bottom: 50px;

          background:
            rgba(
              8,
              116,
              249,
              0.07
            );
        }

        .heroContent {
          position: relative;

          z-index: 2;
        }

        .heroEyebrow {
          display: inline-flex;

          align-items: center;

          gap: 7px;

          padding: 7px 11px;

          border:
            1px solid #dbe7fb;

          border-radius: 999px;

          color: #60728b;

          background: #f8fbff;

          font-size: 6px;
          font-weight: 900;

          letter-spacing: 1.2px;
        }

        .liveDot {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          background: #29b473;

          box-shadow:
            0 0 0 4px
            rgba(
              41,
              180,
              115,
              0.1
            );
        }

        .hero h1 {
          max-width: 760px;

          margin: 20px 0 0;

          color: #132236;

          font-size:
            clamp(
              49px,
              6vw,
              78px
            );

          line-height: 0.97;

          letter-spacing: -4px;
        }

        .hero h1 span {
          color: #0874f9;
        }

        .heroDescription {
          max-width: 610px;

          margin: 23px 0 0;

          color: #667588;

          font-size: 10px;

          line-height: 1.8;
        }

        .heroButtons {
          margin-top: 28px;

          display: flex;

          flex-wrap: wrap;

          gap: 8px;
        }

        .primaryHero,
        .secondaryHero {
          min-height: 49px;

          padding: 0 18px;

          display: inline-flex;

          align-items: center;
          justify-content: center;

          gap: 13px;

          border-radius: 11px;

          text-decoration: none;

          font-size: 8px;
          font-weight: 950;
        }

        .primaryHero {
          min-width: 190px;

          color: white;

          background:
            linear-gradient(
              135deg,
              #0874f9,
              #6357f6
            );

          box-shadow:
            0 14px 35px
            rgba(
              8,
              116,
              249,
              0.2
            );
        }

        .primaryHero .plus {
          width: 24px;
          height: 24px;

          display: grid;
          place-items: center;

          border-radius: 7px;

          background:
            rgba(
              255,
              255,
              255,
              0.15
            );

          font-size: 14px;
        }

        .primaryHero .arrow {
          margin-left: auto;
        }

        .secondaryHero {
          color: #3c4a5a;

          border:
            1px solid #dfe5ea;

          background: white;
        }

        .heroMiniLinks {
          margin-top: 18px;

          display: flex;

          flex-wrap: wrap;

          gap: 16px;
        }

        .heroMiniLinks a {
          display: flex;

          align-items: center;

          gap: 5px;

          color: #6c7a89;

          text-decoration: none;

          font-size: 7px;
          font-weight: 800;
        }

        .heroMiniLinks span {
          font-size: 11px;
        }

        /* HERO VISUAL */

        .heroVisual {
          height: 520px;

          position: relative;

          display: flex;

          align-items: center;
          justify-content: center;

          z-index: 2;
        }

        .device {
          width: 310px;

          position: relative;

          padding: 16px;

          border:
            1px solid
            rgba(
              223,
              230,
              238,
              0.9
            );

          border-radius: 30px;

          background:
            rgba(
              255,
              255,
              255,
              0.92
            );

          box-shadow:
            0 35px 100px
            rgba(
              28,
              49,
              82,
              0.14
            );

          backdrop-filter: blur(20px);
        }

        .deviceTop {
          display: flex;

          align-items: center;
          justify-content: space-between;

          padding:
            1px 3px 12px;
        }

        .miniBrand {
          color: #0874f9;

          font-size: 7px;
          font-weight: 950;

          letter-spacing: 0.5px;
        }

        .connected {
          color: #27a968;

          font-size: 5px;
          font-weight: 950;
        }

        .profilePreview {
          padding: 28px 22px 22px;

          border-radius: 22px;

          text-align: center;

          background:
            linear-gradient(
              150deg,
              #f5f9ff,
              #f6f3ff
            );
        }

        .animal {
          width: 88px;
          height: 88px;

          margin: auto;

          display: grid;
          place-items: center;

          border:
            5px solid white;

          border-radius: 50%;

          background: #eef4ff;

          box-shadow:
            0 10px 30px
            rgba(
              45,
              73,
              120,
              0.12
            );

          font-size: 42px;
        }

        .found {
          display: block;

          margin-top: 15px;

          color: #725af2;

          font-size: 5px;
          font-weight: 950;

          letter-spacing: 1px;
        }

        .profilePreview h3 {
          margin: 5px 0 0;

          color: #253548;

          font-size: 22px;
        }

        .profilePreview p {
          max-width: 210px;

          margin:
            7px auto 0;

          color: #7d8997;

          font-size: 7px;

          line-height: 1.55;
        }

        .profilePreview button {
          width: 100%;
          min-height: 37px;

          margin-top: 15px;

          border: 0;

          border-radius: 9px;

          color: white;

          background: #0874f9;

          font-size: 7px;
          font-weight: 900;
        }

        .profilePreview
          .locationButton {
          margin-top: 6px;

          color: #536273;

          border:
            1px solid #dce4ec;

          background: white;
        }

        .privacyBar {
          margin-top: 11px;

          padding: 10px;

          display: flex;

          align-items: center;

          gap: 9px;

          border:
            1px solid #e7ebef;

          border-radius: 13px;

          background: #fbfcfd;
        }

        .privacyBar > span {
          font-size: 17px;
        }

        .privacyBar strong,
        .privacyBar small {
          display: block;
        }

        .privacyBar strong {
          color: #475567;

          font-size: 7px;
        }

        .privacyBar small {
          margin-top: 2px;

          color: #909aa5;

          font-size: 5px;
        }

        .floatingCard {
          position: absolute;

          min-width: 155px;

          padding: 11px 13px;

          display: flex;

          align-items: center;

          gap: 9px;

          border:
            1px solid
            rgba(
              225,
              231,
              237,
              0.9
            );

          border-radius: 14px;

          background:
            rgba(
              255,
              255,
              255,
              0.92
            );

          box-shadow:
            0 16px 42px
            rgba(
              26,
              49,
              83,
              0.11
            );

          backdrop-filter: blur(16px);
        }

        .chatCard {
          left: 0;
          top: 125px;
        }

        .locationCard {
          right: -10px;
          bottom: 95px;
        }

        .floatingIcon {
          width: 34px;
          height: 34px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          background: #f0f5ff;

          font-size: 15px;
        }

        .floatingCard strong,
        .floatingCard small {
          display: block;
        }

        .floatingCard strong {
          color: #475569;

          font-size: 7px;
        }

        .floatingCard small {
          margin-top: 2px;

          color: #929ca6;

          font-size: 5px;
        }

        /* TRUST BAR */

        .trustBar {
          width: calc(100% - 48px);
          max-width: 1240px;

          margin: auto;

          display: grid;

          grid-template-columns:
            repeat(
              4,
              minmax(0, 1fr)
            );

          border:
            1px solid #e6ebef;

          border-radius: 14px;

          overflow: hidden;

          background: #fbfcfd;
        }

        .trustBar > div {
          min-height: 75px;

          padding: 0 18px;

          display: flex;

          align-items: center;

          gap: 10px;

          border-right:
            1px solid #e7ebef;
        }

        .trustBar > div:last-child {
          border-right: 0;
        }

        .trustBar strong {
          color: #735df3;

          font-size: 6px;
        }

        .trustBar span {
          color: #5f6e7e;

          font-size: 7px;
          font-weight: 800;
        }

        /* GENERAL SECTIONS */

        .profiles,
        .featureSection {
          width: calc(100% - 48px);
          max-width: 1240px;

          margin: auto;

          padding: 95px 0;
        }

        .sectionHead {
          display: flex;

          align-items: flex-end;
          justify-content: space-between;

          gap: 30px;

          margin-bottom: 35px;
        }

        .sectionEyebrow {
          color: #735df3;

          font-size: 6px;
          font-weight: 950;

          letter-spacing: 1.4px;
        }

        .sectionEyebrow.light {
          color: #8e80ff;
        }

        .sectionHead h2,
        .howIntro h2,
        .liveChatContent h2,
        .emergency h2,
        .storeContent h2 {
          margin: 8px 0 0;

          color: #152438;

          font-size:
            clamp(
              31px,
              4vw,
              47px
            );

          line-height: 1.05;

          letter-spacing: -2px;
        }

        .sectionHead p,
        .howIntro p {
          max-width: 560px;

          margin: 10px 0 0;

          color: #748190;

          font-size: 8px;

          line-height: 1.7;
        }

        .sectionAction {
          flex: 0 0 auto;

          color: #0874f9;

          text-decoration: none;

          font-size: 7px;
          font-weight: 900;
        }

        /* CATEGORIES */

        .categoryGrid {
          display: grid;

          grid-template-columns:
            repeat(
              6,
              minmax(0, 1fr)
            );

          gap: 10px;
        }

        .categoryCard {
          min-height: 190px;

          padding: 17px;

          display: flex;

          flex-direction: column;

          border:
            1px solid #e2e8ed;

          border-radius: 16px;

          color: inherit;

          background: #fff;

          text-decoration: none;

          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .categoryCard:hover {
          transform:
            translateY(-4px);

          border-color: #c9dafc;

          box-shadow:
            0 18px 40px
            rgba(
              33,
              65,
              110,
              0.08
            );
        }

        .categoryTop {
          display: flex;

          justify-content: space-between;

          color: #9aa5af;

          font-size: 6px;
          font-weight: 900;
        }

        .categoryArrow {
          color: #0874f9;

          font-size: 10px;
        }

        .categoryIcon {
          margin-top: 25px;

          font-size: 38px;
        }

        .categoryCard > strong {
          margin-top: 17px;

          color: #283749;

          font-size: 11px;
        }

        .categoryCard > small {
          margin-top: 5px;

          color: #9da7b0;

          font-size: 5px;
          font-weight: 900;

          letter-spacing: 0.7px;
        }

        /* HOW */

        .how {
          width: calc(100% - 48px);
          max-width: 1240px;

          margin: auto;
          padding: 80px;

          border-radius: 28px;

          color: white;

          background:
            radial-gradient(
              circle at 95% 0%,
              rgba(
                103,
                87,
                246,
                0.35
              ),
              transparent 28%
            ),
            #101f34;
        }

        .howIntro h2 {
          max-width: 680px;

          color: white;
        }

        .howIntro p {
          color: #9caaba;
        }

        .howSteps {
          margin-top: 48px;

          display: grid;

          grid-template-columns:
            repeat(
              4,
              minmax(0, 1fr)
            );

          gap: 8px;
        }

        .howStep {
          min-height: 220px;

          padding: 20px;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.08
            );

          border-radius: 16px;

          background:
            rgba(
              255,
              255,
              255,
              0.035
            );
        }

        .stepNumber {
          color: #8174ff;

          font-size: 6px;
          font-weight: 950;
        }

        .stepIcon {
          width: 39px;
          height: 39px;

          margin-top: 29px;

          display: grid;
          place-items: center;

          border-radius: 11px;

          color: white;

          background:
            rgba(
              116,
              96,
              255,
              0.14
            );

          font-size: 16px;
        }

        .howStep h3 {
          margin: 17px 0 0;

          color: white;

          font-size: 11px;
        }

        .howStep p {
          margin: 7px 0 0;

          color: #9eacbc;

          font-size: 7px;

          line-height: 1.7;
        }

        /* FEATURES */

        .featureGrid {
          display: grid;

          grid-template-columns:
            repeat(
              4,
              minmax(0, 1fr)
            );

          gap: 10px;
        }

        .featureCard {
          min-height: 235px;

          padding: 21px;

          border:
            1px solid #e2e8ed;

          border-radius: 17px;

          background: #fff;
        }

        .featureHeader {
          display: flex;

          align-items: center;
          justify-content: space-between;
        }

        .featureNumber {
          color: #9ca5ae;

          font-size: 6px;
          font-weight: 900;
        }

        .featureIcon {
          width: 42px;
          height: 42px;

          display: grid;
          place-items: center;

          border-radius: 12px;

          background: #f0f5ff;

          font-size: 18px;
        }

        .featureCard h3 {
          margin: 32px 0 0;

          color: #263648;

          font-size: 12px;
        }

        .featureCard p {
          margin: 8px 0 0;

          color: #788594;

          font-size: 7px;

          line-height: 1.7;
        }

        /* LIVE CHAT */

        .liveChatSection {
          width: calc(100% - 48px);
          max-width: 1240px;

          margin: 0 auto 95px;

          padding: 60px;

          display: grid;

          grid-template-columns:
            500px
            minmax(0, 1fr);

          align-items: center;

          gap: 75px;

          border-radius: 26px;

          background:
            linear-gradient(
              145deg,
              #f5f9ff,
              #fbfaff
            );
        }

        .chatWindow {
          padding: 14px;

          border:
            1px solid #dfe6ed;

          border-radius: 20px;

          background: white;

          box-shadow:
            0 24px 70px
            rgba(
              29,
              59,
              103,
              0.1
            );
        }

        .chatWindowTop {
          min-height: 55px;

          padding: 0 7px;

          display: flex;

          align-items: center;
          justify-content: space-between;

          border-bottom:
            1px solid #edf0f3;
        }

        .chatWindowTop > div {
          display: flex;

          align-items: center;

          gap: 8px;
        }

        .chatAvatar {
          width: 32px;
          height: 32px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          color: white;
          background: #0874f9;

          font-size: 8px;
          font-weight: 900;
        }

        .chatWindowTop strong,
        .chatWindowTop small {
          display: block;
        }

        .chatWindowTop strong {
          color: #344457;

          font-size: 7px;
        }

        .chatWindowTop small {
          margin-top: 2px;

          color: #2ead71;

          font-size: 5px;
        }

        .secureChat {
          color: #85909b;

          font-size: 5px;
        }

        .chatMessages {
          min-height: 235px;

          padding: 25px 8px;

          display: flex;

          flex-direction: column;

          gap: 9px;

          background: #fbfcfd;
        }

        .finderBubble,
        .ownerBubble,
        .locationBubble {
          max-width: 72%;

          padding: 10px 12px;

          border-radius: 13px;

          font-size: 7px;

          line-height: 1.5;
        }

        .finderBubble {
          align-self: flex-start;

          color: #4c5a69;

          border:
            1px solid #e1e6ea;

          background: white;
        }

        .ownerBubble {
          align-self: flex-end;

          color: white;

          background: #0874f9;
        }

        .locationBubble {
          align-self: flex-start;

          color: #475566;

          background: #ebf7f1;
        }

        .chatComposer {
          min-height: 46px;

          margin-top: 8px;
          padding: 0 8px 0 12px;

          display: flex;

          align-items: center;
          justify-content: space-between;

          border:
            1px solid #e2e7eb;

          border-radius: 11px;

          color: #a0a9b1;

          font-size: 7px;
        }

        .chatComposer button {
          width: 31px;
          height: 31px;

          border: 0;
          border-radius: 8px;

          color: white;
          background: #0874f9;
        }

        .liveChatContent h2 {
          max-width: 570px;
        }

        .liveChatContent > p {
          max-width: 520px;

          margin: 15px 0 0;

          color: #738190;

          font-size: 8px;

          line-height: 1.8;
        }

        .liveBenefits {
          margin-top: 20px;

          display: grid;

          gap: 8px;
        }

        .liveBenefits span {
          color: #586777;

          font-size: 7px;
          font-weight: 800;
        }

        .darkButton {
          min-width: 150px;
          min-height: 43px;

          margin-top: 24px;
          padding: 0 14px;

          display: inline-flex;

          align-items: center;
          justify-content: space-between;

          gap: 20px;

          border-radius: 9px;

          color: white;
          background: #14243a;

          text-decoration: none;

          font-size: 7px;
          font-weight: 900;
        }

        /* EMERGENCY */

        .emergency {
          width: calc(100% - 48px);
          max-width: 1240px;

          margin: 0 auto 95px;
          padding: 48px;

          position: relative;

          display: grid;

          grid-template-columns:
            minmax(0, 1.5fr)
            minmax(0, 1fr)
            auto;

          align-items: center;

          gap: 40px;

          overflow: hidden;

          border:
            1px solid #f1d9dc;

          border-radius: 24px;

          background:
            linear-gradient(
              135deg,
              #fffafa,
              #fffdfd
            );
        }

        .emergencyAccent {
          width: 5px;

          position: absolute;

          left: 0;
          top: 0;
          bottom: 0;

          background: #d74b55;
        }

        .emergencyLeft {
          display: flex;

          align-items: flex-start;

          gap: 17px;
        }

        .emergencyIcon {
          width: 58px;
          height: 58px;

          flex: 0 0 58px;

          display: grid;
          place-items: center;

          border-radius: 17px;

          color: white;
          background: #d74b55;

          font-size: 25px;
          font-weight: 900;

          box-shadow:
            0 12px 30px
            rgba(
              215,
              75,
              85,
              0.16
            );
        }

        .emergencyLabel {
          color: #d14b54;

          font-size: 6px;
          font-weight: 950;

          letter-spacing: 1.4px;
        }

        .emergency h2 {
          max-width: 630px;

          font-size:
            clamp(
              27px,
              3vw,
              39px
            );
        }

        .emergencyLeft p {
          max-width: 600px;

          margin: 11px 0 0;

          color: #7b858f;

          font-size: 7px;

          line-height: 1.7;
        }

        .emergencyFeatures {
          display: grid;

          gap: 9px;
        }

        .emergencyFeatures > div {
          padding: 10px 12px;

          display: flex;

          align-items: center;

          gap: 10px;

          border:
            1px solid #f0dfe1;

          border-radius: 10px;

          background: white;
        }

        .emergencyFeatures span {
          color: #d14b54;

          font-size: 5px;
          font-weight: 950;
        }

        .emergencyFeatures strong {
          color: #596570;

          font-size: 7px;
        }

        .emergencyButton {
          min-width: 185px;
          min-height: 45px;

          padding: 0 14px;

          display: flex;

          align-items: center;
          justify-content: space-between;

          border-radius: 10px;

          color: white;
          background: #d74b55;

          text-decoration: none;

          font-size: 7px;
          font-weight: 900;
        }

        /* STORE */

        .storeSection {
          width: calc(100% - 48px);
          max-width: 1240px;

          min-height: 430px;

          margin: 0 auto 95px;
          padding: 60px;

          display: grid;

          grid-template-columns:
            minmax(0, 1fr)
            470px;

          align-items: center;

          gap: 60px;

          overflow: hidden;

          border-radius: 28px;

          color: white;

          background:
            radial-gradient(
              circle at 90% 40%,
              rgba(
                118,
                96,
                255,
                0.42
              ),
              transparent 30%
            ),
            #12223a;
        }

        .storeContent h2 {
          max-width: 620px;

          color: white;
        }

        .storeContent p {
          max-width: 530px;

          margin: 14px 0 0;

          color: #a2afbd;

          font-size: 8px;

          line-height: 1.75;
        }

        .storeButton {
          min-width: 160px;
          min-height: 44px;

          margin-top: 23px;
          padding: 0 14px;

          display: inline-flex;

          align-items: center;
          justify-content: space-between;

          gap: 30px;

          border-radius: 9px;

          color: #13223a;
          background: white;

          text-decoration: none;

          font-size: 7px;
          font-weight: 900;
        }

        .storeVisual {
          height: 310px;

          position: relative;
        }

        .tag,
        .sticker {
          position: absolute;

          display: grid;
          place-items: center;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.2
            );

          color: #0874f9;

          background:
            rgba(
              255,
              255,
              255,
              0.94
            );

          box-shadow:
            0 30px 75px
            rgba(
              0,
              0,
              0,
              0.18
            );
        }

        .tag {
          width: 155px;
          height: 155px;

          border-radius: 50%;
        }

        .tagOne {
          left: 75px;
          top: 70px;

          z-index: 3;
        }

        .tagTwo {
          right: 50px;
          top: 15px;

          width: 115px;
          height: 115px;

          z-index: 2;

          transform:
            rotate(10deg);
        }

        .tag span {
          font-size: 31px;
          font-weight: 950;
        }

        .tag strong {
          position: absolute;

          bottom: 38px;

          color: #6658f4;

          font-size: 7px;

          letter-spacing: 2px;
        }

        .sticker {
          width: 150px;
          height: 100px;

          right: 10px;
          bottom: 20px;

          z-index: 4;

          border-radius: 17px;

          transform:
            rotate(-7deg);
        }

        .sticker span {
          font-size: 25px;
          font-weight: 950;
        }

        .sticker small {
          position: absolute;

          bottom: 17px;

          color: #81909e;

          font-size: 4px;
          font-weight: 900;
        }

        /* FINAL CTA */

        .finalCta {
          width: calc(100% - 48px);
          max-width: 900px;

          margin: 0 auto 110px;

          text-align: center;
        }

        .finalCta > span {
          color: #735df3;

          font-size: 6px;
          font-weight: 950;

          letter-spacing: 1.5px;
        }

        .finalCta h2 {
          margin: 11px 0 0;

          color: #152438;

          font-size:
            clamp(
              35px,
              5vw,
              55px
            );

          line-height: 1.02;

          letter-spacing: -2.5px;
        }

        .finalCta p {
          margin: 13px 0 0;

          color: #7b8794;

          font-size: 8px;
        }

        .finalCta > div {
          margin-top: 24px;

          display: flex;

          justify-content: center;

          gap: 7px;
        }

        .finalPrimary,
        .finalSecondary {
          min-height: 44px;

          padding: 0 17px;

          display: inline-flex;

          align-items: center;
          justify-content: center;

          border-radius: 9px;

          text-decoration: none;

          font-size: 7px;
          font-weight: 900;
        }

        .finalPrimary {
          color: white;

          background:
            linear-gradient(
              135deg,
              #0874f9,
              #6357f6
            );
        }

        .finalSecondary {
          color: #526171;

          border:
            1px solid #dfe5ea;

          background: white;
        }

        /* FOOTER */

        .footer {
          width: calc(100% - 48px);
          max-width: 1240px;

          margin: auto;
          padding: 45px 0 30px;

          display: grid;

          grid-template-columns:
            minmax(230px, 1fr)
            repeat(
              3,
              150px
            );

          gap: 25px;

          position: relative;

          border-top:
            1px solid #e6ebef;
        }

        .footerBrand {
          display: flex;

          align-items: flex-start;

          gap: 10px;
        }

        .footerBrand strong {
          color: #0874f9;

          font-size: 11px;
        }

        .footerBrand p {
          margin: 4px 0 0;

          color: #8b96a1;

          font-size: 6px;
        }

        .footerColumn {
          display: flex;

          flex-direction: column;

          gap: 8px;
        }

        .footerColumn > strong {
          margin-bottom: 2px;

          color: #9ba4ac;

          font-size: 5px;

          letter-spacing: 1px;
        }

        .footerColumn a {
          color: #637181;

          text-decoration: none;

          font-size: 7px;
          font-weight: 700;
        }

        .copyright {
          grid-column: 1 / -1;

          margin-top: 25px;
          padding-top: 18px;

          border-top:
            1px solid #edf0f2;

          color: #a1a9b0;

          font-size: 6px;
        }

        /* RESPONSIVE */

        @media (
          max-width: 1050px
        ) {
          .nav {
            display: none;
          }

          .hero {
            grid-template-columns:
              1fr 390px;
          }

          .categoryGrid {
            grid-template-columns:
              repeat(
                3,
                minmax(0, 1fr)
              );
          }

          .featureGrid {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }

          .liveChatSection {
            grid-template-columns:
              420px
              minmax(0, 1fr);

            gap: 45px;
          }

          .emergency {
            grid-template-columns:
              1fr;
          }

          .emergencyButton {
            width: 220px;
          }
        }

        @media (
          max-width: 850px
        ) {
          .header {
            grid-template-columns:
              auto 1fr;
          }

          .headerActions {
            justify-content:
              flex-end;
          }

          .headerActions
            .admin {
            display: none;
          }

          .hero {
            min-height: auto;

            padding: 80px 0;

            grid-template-columns:
              1fr;
          }

          .heroContent {
            text-align: center;
          }

          .heroDescription {
            margin-left: auto;
            margin-right: auto;
          }

          .heroButtons,
          .heroMiniLinks {
            justify-content:
              center;
          }

          .heroVisual {
            margin-top: 20px;
          }

          .trustBar {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }

          .trustBar > div:nth-child(2) {
            border-right: 0;
          }

          .how {
            padding: 45px 30px;
          }

          .howSteps {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }

          .liveChatSection {
            padding: 40px;

            grid-template-columns:
              1fr;
          }

          .liveChatContent {
            text-align: center;
          }

          .liveChatContent > p {
            margin-left: auto;
            margin-right: auto;
          }

          .liveBenefits {
            justify-items: center;
          }

          .storeSection {
            grid-template-columns:
              1fr;
          }

          .storeVisual {
            max-width: 450px;

            width: 100%;

            margin: auto;
          }

          .footer {
            grid-template-columns:
              1fr 1fr;
          }
        }

        @media (
          max-width: 600px
        ) {
          .header {
            width:
              calc(
                100% - 24px
              );

            min-height: 70px;
          }

          .brandText small {
            display: none;
          }

          .headerActions
            .login {
            display: none;
          }

          .language {
            display: none;
          }

          .register {
            padding: 0 9px;
          }

          .hero,
          .trustBar,
          .profiles,
          .how,
          .featureSection,
          .liveChatSection,
          .emergency,
          .storeSection,
          .footer {
            width:
              calc(
                100% - 24px
              );
          }

          .hero {
            padding: 62px 0;
          }

          .hero h1 {
            font-size: 45px;

            letter-spacing: -2.5px;
          }

          .heroButtons {
            flex-direction:
              column;
          }

          .primaryHero,
          .secondaryHero {
            width: 100%;
          }

          .heroMiniLinks {
            gap: 10px;
          }

          .heroVisual {
            height: 445px;
          }

          .device {
            width: 280px;
          }

          .floatingCard {
            min-width: 130px;
          }

          .chatCard {
            left: -5px;
          }

          .locationCard {
            right: -5px;
          }

          .trustBar {
            grid-template-columns:
              1fr;
          }

          .trustBar > div {
            border-right: 0;

            border-bottom:
              1px solid #e7ebef;
          }

          .trustBar > div:last-child {
            border-bottom: 0;
          }

          .profiles,
          .featureSection {
            padding: 70px 0;
          }

          .sectionHead {
            align-items:
              flex-start;

            flex-direction:
              column;
          }

          .categoryGrid {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }

          .categoryCard {
            min-height: 170px;
          }

          .how {
            padding: 35px 20px;
          }

          .howSteps {
            grid-template-columns:
              1fr;
          }

          .featureGrid {
            grid-template-columns:
              1fr;
          }

          .liveChatSection {
            padding: 25px 16px;
          }

          .emergency {
            padding: 28px 20px;
          }

          .emergencyLeft {
            flex-direction:
              column;
          }

          .emergencyButton {
            width: 100%;
          }

          .storeSection {
            padding: 38px 22px;
          }

          .storeVisual {
            height: 260px;
          }

          .tagOne {
            left: 25px;
          }

          .tagTwo {
            right: 20px;
          }

          .finalCta {
            width:
              calc(
                100% - 24px
              );
          }

          .finalCta > div {
            flex-direction:
              column;
          }

          .finalPrimary,
          .finalSecondary {
            width: 100%;
          }

          .footer {
            grid-template-columns:
              1fr;
          }
        }
      `}</style>
    </main>
  );
}
