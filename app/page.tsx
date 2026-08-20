"use client";

import Link from "next/link";
import { useState } from "react";

type Language = "ka" | "en";

const categories = [
  {
    number: "01",
    icon: "🐕",
    ka: "ძაღლი",
    en: "Dog",
  },
  {
    number: "02",
    icon: "🐈",
    ka: "კატა",
    en: "Cat",
  },
  {
    number: "03",
    icon: "🔑",
    ka: "გასაღები",
    en: "Keys",
  },
  {
    number: "04",
    icon: "👛",
    ka: "საფულე",
    en: "Wallet",
  },
  {
    number: "05",
    icon: "🧳",
    ka: "ჩემოდანი",
    en: "Suitcase",
  },
  {
    number: "06",
    icon: "🎒",
    ka: "ჩანთა",
    en: "Bag",
  },
];

const services = [
  {
    number: "01",
    icon: "◉",
    ka: "ჩემი QR პროფილები",
    en: "My QR Profiles",
    kaText:
      "მართეთ თქვენი ცხოველებისა და ნივთების QR პროფილები.",
    enText:
      "Manage QR profiles for your pets and belongings.",
    href: "/my-profiles",
  },
  {
    number: "02",
    icon: "▣",
    ka: "მაღაზია",
    en: "Store",
    kaText:
      "აირჩიეთ QR ბრელოკები, სტიკერები და სასურველი დიზაინი.",
    enText:
      "Choose QR tags, stickers and your preferred design.",
    href: "/store",
  },
  {
    number: "03",
    icon: "✓",
    ka: "ჩემი შეკვეთები",
    en: "My Orders",
    kaText:
      "ნახეთ თქვენი შეკვეთები, გადახდის და მიწოდების სტატუსი.",
    enText:
      "View your orders, payment and delivery status.",
    href: "/account/orders",
  },
  {
    number: "04",
    icon: "✦",
    ka: "Live Chat",
    en: "Live Chat",
    kaText:
      "დაუკავშირდით მპოვნელს QR RETURN-ის ჩათით.",
    enText:
      "Communicate with the finder through QR RETURN chat.",
    href: "/account/messages",
  },
  {
    number: "05",
    icon: "●",
    ka: "შეტყობინებები",
    en: "Notifications",
    kaText:
      "მიიღეთ ინფორმაცია სკანირებისა და დაკარგული ნივთის შესახებ.",
    enText:
      "Receive updates about scans and lost items.",
    href: "/account/notifications",
  },
  {
    number: "06",
    icon: "◎",
    ka: "ჩემი ანგარიში",
    en: "My Account",
    kaText:
      "მართეთ თქვენი ინფორმაცია, კონტაქტები და უსაფრთხოება.",
    enText:
      "Manage your information, contacts and security.",
    href: "/dashboard",
  },
];

export default function HomePage() {
  const [lang, setLang] =
    useState<Language>("ka");

  const ka = lang === "ka";

  return (
    <main className="page">
      {/* HEADER */}

      <header className="header">
        <Link href="/" className="brand">
          <div className="logo">
            QR
          </div>

          <div>
            <strong>
              QR RETURN
            </strong>

            <small>
              SECURE RETURN
            </small>
          </div>
        </Link>

        <nav className="nav">
          <a href="#how">
            {ka
              ? "როგორ მუშაობს"
              : "How it works"}
          </a>

          <a href="#categories">
            {ka
              ? "კატეგორიები"
              : "Categories"}
          </a>

          <Link href="/store">
            {ka
              ? "მაღაზია"
              : "Store"}
          </Link>
        </nav>

        <div className="headerRight">
          <div className="languages">
            <button
              type="button"
              className={
                ka ? "active" : ""
              }
              onClick={() =>
                setLang("ka")
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
                setLang("en")
              }
            >
              ENG
            </button>
          </div>

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

      {/* HERO */}

      <section className="hero">
        <div className="heroBadge">
          QR RETURN
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

        <p>
          {ka
            ? "ერთი QR კოდი აკავშირებს მპოვნელს მფლობელთან — სწრაფად, მარტივად და თქვენი პირადი მონაცემების კონტროლით."
            : "One QR code connects the finder with the owner — quickly, simply and with control over your personal information."}
        </p>

        <div className="heroActions">
          <Link
            href="/register"
            className="heroPrimary"
          >
            {ka
              ? "დაიწყე რეგისტრაცია"
              : "Get Started"}
            <span>→</span>
          </Link>

          <Link
            href="/store"
            className="heroSecondary"
          >
            {ka
              ? "ნახე მაღაზია"
              : "Visit Store"}
          </Link>
        </div>

        <div className="heroNote">
          <span className="dot" />

          {ka
            ? "მპოვნელს რეგისტრაცია არ სჭირდება"
            : "The finder does not need to register"}
        </div>
      </section>

      {/* SERVICES / MAIN SECTIONS */}

      <section
        className="servicesSection"
      >
        <div className="sectionIntro">
          <span className="sectionNumber">
            01
          </span>

          <div>
            <h2>
              {ka
                ? "ყველაფერი ერთ სივრცეში"
                : "Everything in one place"}
            </h2>

            <p>
              {ka
                ? "მართეთ QR პროფილები, შეკვეთები, შეტყობინებები და კონტაქტი ერთი ანგარიშიდან."
                : "Manage QR profiles, orders, notifications and communication from one account."}
            </p>
          </div>
        </div>

        <div className="servicesGrid">
          {services.map(
            (service) => (
              <Link
                href={service.href}
                className="serviceCard"
                key={service.number}
              >
                <div className="serviceTop">
                  <span className="serviceNumber">
                    {service.number}
                  </span>

                  <div className="serviceIcon">
                    {service.icon}
                  </div>
                </div>

                <h3>
                  {ka
                    ? service.ka
                    : service.en}
                </h3>

                <p>
                  {ka
                    ? service.kaText
                    : service.enText}
                </p>

                <div className="serviceLink">
                  {ka
                    ? "გახსნა"
                    : "Open"}
                  <span>→</span>
                </div>
              </Link>
            )
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}

      <section
        className="how"
        id="how"
      >
        <div className="sectionIntro">
          <span className="sectionNumber">
            02
          </span>

          <div>
            <h2>
              {ka
                ? "როგორ მუშაობს QR RETURN"
                : "How QR RETURN Works"}
            </h2>

            <p>
              {ka
                ? "მარტივი გზა დაკარგული ნივთის ან საყვარელი ცხოველის დასაბრუნებლად."
                : "A simple way to recover a lost belonging or pet."}
            </p>
          </div>
        </div>

        <div className="steps">
          <div className="step">
            <span>01</span>

            <h3>
              {ka
                ? "დაარეგისტრირე"
                : "Register"}
            </h3>

            <p>
              {ka
                ? "შექმენი ანგარიში და დაამატე ნივთი ან ცხოველი."
                : "Create an account and add your item or pet."}
            </p>
          </div>

          <div className="arrow">
            →
          </div>

          <div className="step">
            <span>02</span>

            <h3>
              {ka
                ? "მიაბი QR"
                : "Connect QR"}
            </h3>

            <p>
              {ka
                ? "QR კოდი დაუკავშირე შესაბამის პროფილს."
                : "Connect the QR code to the appropriate profile."}
            </p>
          </div>

          <div className="arrow">
            →
          </div>

          <div className="step">
            <span>03</span>

            <h3>
              {ka
                ? "მპოვნელი ასკანერებს"
                : "Finder Scans"}
            </h3>

            <p>
              {ka
                ? "მპოვნელს მხოლოდ QR-ის ერთხელ დასკანერება სჭირდება."
                : "The finder only needs to scan the QR once."}
            </p>
          </div>

          <div className="arrow">
            →
          </div>

          <div className="step">
            <span>04</span>

            <h3>
              {ka
                ? "დაიბრუნე"
                : "Get It Back"}
            </h3>

            <p>
              {ka
                ? "მიიღე შეტყობინება, ლოკაცია ან დაუკავშირდი მპოვნელს."
                : "Receive a notification, location or contact the finder."}
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES */}

      <section className="features">
        <div className="feature">
          <strong>01</strong>
          <div>
            <h3>Live Chat</h3>
            <p>
              {ka
                ? "მპოვნელთან პირდაპირი კომუნიკაცია პლატფორმიდან."
                : "Communicate directly with the finder through the platform."}
            </p>
          </div>
        </div>

        <div className="feature">
          <strong>02</strong>
          <div>
            <h3>
              {ka
                ? "ლოკაციის გაზიარება"
                : "Location Sharing"}
            </h3>
            <p>
              {ka
                ? "მპოვნელს შეუძლია ერთი მოქმედებით გაგიზიაროთ ლოკაცია."
                : "The finder can share their location with one action."}
            </p>
          </div>
        </div>

        <div className="feature">
          <strong>03</strong>
          <div>
            <h3>
              {ka
                ? "მპოვნელის ჯილდო"
                : "Finder Reward"}
            </h3>
            <p>
              {ka
                ? "სურვილის შემთხვევაში მიუთითეთ ჯილდო მპოვნელისთვის."
                : "Optionally offer a reward to the finder."}
            </p>
          </div>
        </div>

        <div className="feature">
          <strong>04</strong>
          <div>
            <h3>
              {ka
                ? "პირადი მონაცემების კონტროლი"
                : "Privacy Controls"}
            </h3>
            <p>
              {ka
                ? "თქვენ წყვეტთ კონკრეტულად რა ინფორმაცია დაინახოს მპოვნელმა."
                : "You decide exactly what information the finder can see."}
            </p>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}

      <section
        className="categories"
        id="categories"
      >
        <div className="sectionIntro">
          <span className="sectionNumber">
            03
          </span>

          <div>
            <h2>
              {ka
                ? "აირჩიეთ კატეგორია"
                : "Choose a Category"}
            </h2>

            <p>
              {ka
                ? "დაარეგისტრირეთ სასურველი ნივთი ან ცხოველი."
                : "Register your item or pet."}
            </p>
          </div>
        </div>

        <div className="categoryGrid">
          {categories.map(
            (category) => (
              <Link
                key={
                  category.number
                }
                href={`/register?type=${encodeURIComponent(
                  category.en.toLowerCase()
                )}`}
                className="category"
              >
                <span className="categoryNumber">
                  {category.number}
                </span>

                <div className="categoryIcon">
                  {category.icon}
                </div>

                <strong>
                  {ka
                    ? category.ka
                    : category.en}
                </strong>

                <span className="categoryArrow">
                  →
                </span>
              </Link>
            )
          )}
        </div>
      </section>

      {/* STORE CTA */}

      <section className="storeCta">
        <div>
          <span className="storeLabel">
            QR RETURN STORE
          </span>

          <h2>
            {ka
              ? "აირჩიე შენი QR"
              : "Choose Your QR"}
          </h2>

          <p>
            {ka
              ? "QR ბრელოკები, სტიკერები და სხვადასხვა დიზაინი თქვენი ნივთებისა და საყვარელი ცხოველებისთვის."
              : "QR tags, stickers and multiple designs for your belongings and pets."}
          </p>
        </div>

        <Link
          href="/store"
          className="storeButton"
        >
          {ka
            ? "მაღაზიის ნახვა"
            : "Explore Store"}
          <span>→</span>
        </Link>
      </section>

      {/* FOOTER */}

      <footer>
        <div className="footerBrand">
          <div className="logo">
            QR
          </div>

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

        <div className="footerLinks">
          <Link href="/store">
            {ka
              ? "მაღაზია"
              : "Store"}
          </Link>

          <Link href="/login">
            {ka
              ? "შესვლა"
              : "Login"}
          </Link>

          <Link href="/register">
            {ka
              ? "რეგისტრაცია"
              : "Register"}
          </Link>
        </div>

        <small>
          © 2026 QR RETURN
        </small>
      </footer>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          background: #ffffff;
          color: #1f2c38;
        }

        .header {
          width: calc(100% - 48px);
          max-width: 1180px;
          min-height: 76px;
          margin: auto;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;

          border-bottom: 1px solid #e6eaed;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .logo {
          width: 45px;
          height: 45px;

          display: grid;
          place-items: center;

          border-radius: 13px;

          background: linear-gradient(
            135deg,
            #1465e8,
            #7357f6
          );

          color: white;
          font-size: 11px;
          font-weight: 900;
        }

        .brand strong {
          display: block;
          color: #1465e8;
          font-size: 14px;
          letter-spacing: -0.3px;
        }

        .brand small {
          display: block;
          margin-top: 2px;

          color: #7558ef;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        .nav {
          display: flex;
          align-items: center;
          gap: 26px;
        }

        .nav a {
          color: #65727d;
          text-decoration: none;
          font-size: 9px;
          font-weight: 800;
        }

        .headerRight {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .languages {
          display: flex;
          padding: 3px;

          border-radius: 8px;
          background: #f0f2f4;
        }

        .languages button {
          width: 36px;
          height: 27px;

          border: 0;
          border-radius: 6px;

          background: transparent;
          color: #89939b;

          font-size: 7px;
          font-weight: 900;
          cursor: pointer;
        }

        .languages button.active {
          background: white;
          color: #1465e8;
          box-shadow: 0 1px 4px
            rgba(20, 30, 50, 0.08);
        }

        .login,
        .register {
          height: 34px;
          padding: 0 14px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border-radius: 8px;

          text-decoration: none;
          font-size: 8px;
          font-weight: 900;
        }

        .login {
          border: 1px solid #dfe4e8;
          color: #596773;
        }

        .register {
          background: #1465e8;
          color: white;
        }

        .hero {
          width: calc(100% - 48px);
          max-width: 1180px;

          margin: auto;
          padding: 105px 0 100px;

          text-align: center;

          background:
            radial-gradient(
              circle at 50% 35%,
              rgba(
                116,
                87,
                246,
                0.08
              ),
              transparent 34%
            );
        }

        .heroBadge {
          display: inline-flex;

          padding: 7px 12px;

          border: 1px solid #dce5ff;
          border-radius: 30px;

          background: #f6f8ff;
          color: #7558ef;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .hero h1 {
          margin: 19px 0 0;

          font-size: clamp(
            43px,
            6vw,
            78px
          );

          line-height: 0.98;
          letter-spacing: -4px;
        }

        .hero h1 span {
          color: #1465e8;
        }

        .hero > p {
          max-width: 620px;
          margin: 24px auto 0;

          color: #73808a;
          font-size: 11px;
          line-height: 1.8;
        }

        .heroActions {
          margin-top: 28px;

          display: flex;
          justify-content: center;
          gap: 9px;
        }

        .heroPrimary,
        .heroSecondary {
          min-height: 46px;
          padding: 0 20px;

          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 25px;

          border-radius: 10px;

          text-decoration: none;
          font-size: 9px;
          font-weight: 900;
        }

        .heroPrimary {
          background: linear-gradient(
            135deg,
            #1465e8,
            #7357f6
          );
          color: white;
        }

        .heroSecondary {
          border: 1px solid #dce2e7;
          background: white;
          color: #55636e;
        }

        .heroNote {
          margin-top: 17px;

          display: flex;
          justify-content: center;
          align-items: center;
          gap: 6px;

          color: #89949d;
          font-size: 7px;
          font-weight: 700;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #32b67a;
        }

        .servicesSection,
        .how,
        .categories {
          width: calc(100% - 48px);
          max-width: 1180px;

          margin: auto;
          padding: 80px 0;

          border-top: 1px solid #e6eaed;
        }

        .sectionIntro {
          display: grid;
          grid-template-columns:
            55px minmax(0, 1fr);
          gap: 18px;

          margin-bottom: 38px;
        }

        .sectionNumber {
          color: #7558ef;

          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .sectionIntro h2 {
          margin: 0;

          font-size: 32px;
          letter-spacing: -1.3px;
        }

        .sectionIntro p {
          max-width: 520px;

          margin: 8px 0 0;

          color: #7b8790;
          font-size: 9px;
          line-height: 1.7;
        }

        .servicesGrid {
          display: grid;
          grid-template-columns:
            repeat(
              3,
              minmax(0, 1fr)
            );

          gap: 12px;
        }

        .serviceCard {
          min-height: 205px;
          padding: 21px;

          display: flex;
          flex-direction: column;

          border: 1px solid #e1e6e9;
          border-radius: 16px;

          background: #fff;

          color: inherit;
          text-decoration: none;

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }

        .serviceCard:hover {
          transform:
            translateY(-3px);

          border-color: #cfdcff;

          box-shadow:
            0 14px 35px
            rgba(
              37,
              64,
              120,
              0.08
            );
        }

        .serviceTop {
          display: flex;
          align-items: center;
          justify-content:
            space-between;
        }

        .serviceNumber {
          color: #9ba4ab;

          font-size: 7px;
          font-weight: 900;
        }

        .serviceIcon {
          width: 37px;
          height: 37px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          background: #f0f4ff;
          color: #1465e8;

          font-weight: 900;
        }

        .serviceCard h3 {
          margin: 23px 0 0;

          font-size: 15px;
        }

        .serviceCard p {
          margin: 7px 0 0;

          color: #7b8791;

          font-size: 8px;
          line-height: 1.7;
        }

        .serviceLink {
          margin-top: auto;
          padding-top: 17px;

          display: flex;
          justify-content:
            space-between;

          color: #1465e8;

          font-size: 8px;
          font-weight: 900;
        }

        .steps {
          display: grid;

          grid-template-columns:
            1fr auto
            1fr auto
            1fr auto
            1fr;

          align-items: center;

          gap: 15px;
        }

        .step {
          min-height: 160px;
          padding: 20px;

          border-radius: 15px;

          background: #f6f8fa;
        }

        .step > span {
          color: #7558ef;

          font-size: 7px;
          font-weight: 900;
        }

        .step h3 {
          margin: 28px 0 0;

          font-size: 13px;
        }

        .step p {
          margin: 7px 0 0;

          color: #7d8992;

          font-size: 8px;
          line-height: 1.65;
        }

        .arrow {
          color: #b3bbc1;
          font-size: 18px;
        }

        .features {
          width: calc(100% - 48px);
          max-width: 1180px;

          margin: auto;

          display: grid;
          grid-template-columns:
            repeat(
              4,
              minmax(0, 1fr)
            );

          border-radius: 20px;

          overflow: hidden;

          background: #10233d;
        }

        .feature {
          min-height: 180px;
          padding: 25px;

          display: flex;
          gap: 14px;

          border-right:
            1px solid
            rgba(
              255,
              255,
              255,
              0.1
            );
        }

        .feature:last-child {
          border-right: 0;
        }

        .feature > strong {
          color: #7657f5;

          font-size: 7px;
        }

        .feature h3 {
          margin: 0;

          color: white;

          font-size: 12px;
        }

        .feature p {
          margin: 8px 0 0;

          color: #9eabba;

          font-size: 8px;
          line-height: 1.7;
        }

        .categoryGrid {
          display: grid;

          grid-template-columns:
            repeat(
              6,
              minmax(0, 1fr)
            );

          gap: 10px;
        }

        .category {
          min-height: 155px;
          padding: 16px;

          display: flex;
          flex-direction: column;

          border: 1px solid #e2e6e9;
          border-radius: 14px;

          color: #25313c;
          text-decoration: none;
        }

        .categoryNumber {
          color: #a0a8ae;

          font-size: 6px;
          font-weight: 900;
        }

        .categoryIcon {
          margin-top: 20px;

          font-size: 30px;
        }

        .category strong {
          margin-top: 13px;

          font-size: 10px;
        }

        .categoryArrow {
          margin-top: auto;

          color: #1465e8;

          font-size: 13px;
        }

        .storeCta {
          width: calc(100% - 48px);
          max-width: 1180px;

          margin: 10px auto 90px;
          padding: 45px;

          display: flex;
          align-items: center;
          justify-content:
            space-between;

          gap: 30px;

          border-radius: 22px;

          background: linear-gradient(
            135deg,
            #1465e8,
            #6f54f5
          );

          color: white;
        }

        .storeLabel {
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.5px;

          opacity: 0.75;
        }

        .storeCta h2 {
          margin: 8px 0 0;

          font-size: 32px;
          letter-spacing: -1px;
        }

        .storeCta p {
          max-width: 530px;

          margin: 8px 0 0;

          color:
            rgba(
              255,
              255,
              255,
              0.78
            );

          font-size: 9px;
          line-height: 1.7;
        }

        .storeButton {
          min-width: 165px;
          min-height: 47px;

          padding: 0 17px;

          display: flex;
          align-items: center;
          justify-content:
            space-between;

          border-radius: 10px;

          background: white;
          color: #1465e8;

          text-decoration: none;
          font-size: 8px;
          font-weight: 900;
        }

        footer {
          width: calc(100% - 48px);
          max-width: 1180px;

          min-height: 115px;

          margin: auto;

          display: grid;
          grid-template-columns:
            1fr auto auto;

          align-items: center;

          gap: 35px;

          border-top: 1px solid #e5e9ec;
        }

        .footerBrand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .footerBrand strong {
          color: #1465e8;

          font-size: 12px;
        }

        .footerBrand p {
          margin: 3px 0 0;

          color: #8b959d;

          font-size: 7px;
        }

        .footerLinks {
          display: flex;
          gap: 20px;
        }

        .footerLinks a {
          color: #68757f;

          text-decoration: none;

          font-size: 8px;
          font-weight: 800;
        }

        footer > small {
          color: #9aa3aa;
          font-size: 7px;
        }

        @media (
          max-width: 900px
        ) {
          .nav {
            display: none;
          }

          .servicesGrid {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }

          .steps {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }

          .arrow {
            display: none;
          }

          .features {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }

          .categoryGrid {
            grid-template-columns:
              repeat(
                3,
                minmax(0, 1fr)
              );
          }
        }

        @media (
          max-width: 650px
        ) {
          .header {
            width:
              calc(100% - 24px);
          }

          .headerRight
            .login {
            display: none;
          }

          .register {
            padding: 0 10px;
          }

          .hero,
          .servicesSection,
          .how,
          .categories,
          .features,
          .storeCta,
          footer {
            width:
              calc(100% - 24px);
          }

          .hero {
            padding:
              75px 0 70px;
          }

          .hero h1 {
            font-size: 43px;
            letter-spacing: -2.5px;
          }

          .heroActions {
            flex-direction: column;
          }

          .heroPrimary,
          .heroSecondary {
            width: 100%;
          }

          .servicesGrid {
            grid-template-columns:
              1fr;
          }

          .steps {
            grid-template-columns:
              1fr;
          }

          .features {
            grid-template-columns:
              1fr;
          }

          .feature {
            border-right: 0;
            border-bottom:
              1px solid
              rgba(
                255,
                255,
                255,
                0.1
              );
          }

          .categoryGrid {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }

          .storeCta {
            padding: 30px 22px;

            flex-direction: column;
            align-items:
              flex-start;
          }

          .storeButton {
            width: 100%;
          }

          footer {
            padding: 30px 0;

            grid-template-columns:
              1fr;

            gap: 20px;
          }
        }
      `}</style>
    </main>
  );
}
