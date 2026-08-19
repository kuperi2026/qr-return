"use client";

import { useEffect, useState } from "react";
import SupportLauncher from "./components/SupportLauncher";
import { supabase } from "@/lib/supabase";

type Language = "ka" | "en";

const protectionTypes = [
  { icon: "🐕", ka: "ძაღლი", en: "Dog" },
  { icon: "🐈", ka: "კატა", en: "Cat" },
  { icon: "🔑", ka: "გასაღები", en: "Keys" },
  { icon: "👛", ka: "საფულე", en: "Wallet" },
  { icon: "🧳", ka: "ჩემოდანი", en: "Luggage" },
  { icon: "🎒", ka: "ჩანთა", en: "Bag" },
];

const features = [
  {
    number: "01",
    titleKa: "Live Chat",
    titleEn: "Live Chat",
    textKa:
      "მპოვნელს შეუძლია პირდაპირ QR RETURN-ის საშუალებით მოგწეროთ.",
    textEn:
      "A finder can message you directly through QR RETURN.",
  },
  {
    number: "02",
    titleKa: "ლოკაციის გაზიარება",
    titleEn: "Location Sharing",
    textKa:
      "მპოვნელმა ერთი მოქმედებით შეიძლება გაგიზიაროთ ნივთის ან ცხოველის მდებარეობა.",
    textEn:
      "A finder can share the location of your pet or item in one step.",
  },
  {
    number: "03",
    titleKa: "მპოვნელის ჯილდო",
    titleEn: "Finder Reward",
    textKa:
      "სურვილის შემთხვევაში შეგიძლიათ მიუთითოთ ჯილდო მპოვნელისთვის.",
    textEn:
      "You can optionally offer a reward to the finder.",
  },
  {
    number: "04",
    titleKa: "პირადი მონაცემების კონტროლი",
    titleEn: "Privacy Control",
    textKa:
      "თქვენ თავად აკონტროლებთ რა ინფორმაცია გამოჩნდება მპოვნელისთვის.",
    textEn:
      "You control what information is visible to the finder.",
  },
];

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("ka");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const ka = language === "ka";

  useEffect(() => {
    async function checkSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setIsLoggedIn(Boolean(user));
    }

    void checkSession();

    const { data: listener } =
      supabase.auth.onAuthStateChange(() => {
        void checkSession();
      });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <main className="page">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="header">
        <a href="/" className="brand">
          <div className="brandMark">QR</div>

          <div>
            <div className="brandName">QR RETURN</div>
            <div className="brandSub">
              SMART LOST & FOUND
            </div>
          </div>
        </a>

        <div className="headerRight">
          <nav className="nav">
            <a href="/admin" className="adminButton">
              ⚙️ Admin
            </a>

            {isLoggedIn ? (
              <a href="/account" className="accountButton">
                👤 {ka ? "ჩემი ანგარიში" : "My Account"}
              </a>
            ) : (
              <>
                <a
                  href="/account/register"
                  className="accountButton"
                >
                  {ka
                    ? "ანგარიშის შექმნა"
                    : "Create Account"}
                </a>

                <a href="/login" className="loginButton">
                  {ka ? "შესვლა" : "Sign In"}
                </a>
              </>
            )}
          </nav>

          <div className="language">
            <button
              type="button"
              className={ka ? "selected" : ""}
              onClick={() => setLanguage("ka")}
            >
              ქართული
            </button>

            <button
              type="button"
              className={!ka ? "selected" : ""}
              onClick={() => setLanguage("en")}
            >
              English
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="hero">
        <div className="heroContent">
          <div className="heroLabel">
            QR RETURN
          </div>

          <h1>
            {ka ? (
              <>
                QR, რომელიც დაკარგულს
                <br />
                <span>შენთან აბრუნებს.</span>
              </>
            ) : (
              <>
                The QR that brings
                <br />
                <span>what&apos;s lost back to you.</span>
              </>
            )}
          </h1>

          <p className="heroDescription">
            {ka
              ? "ერთი უსაფრთხო სისტემა თქვენი ცხოველებისთვის, პირადი ნივთებისთვის და Emergency ID-ისთვის."
              : "One secure system for your pets, personal items and Emergency ID."}
          </p>

          <div className="heroActions">
            <a
              href={
                isLoggedIn
                  ? "/account"
                  : "/account/register"
              }
              className="heroPrimary"
            >
              {isLoggedIn
                ? ka
                  ? "ჩემს ანგარიშში გადასვლა"
                  : "Go to My Account"
                : ka
                ? "ანგარიშის შექმნა"
                : "Create Account"}{" "}
              →
            </a>

            <a href="#how" className="heroSecondary">
              {ka
                ? "როგორ მუშაობს"
                : "How it works"}
            </a>
          </div>
        </div>

        <div className="heroVisual">
          <div className="phone">
            <div className="phoneTop" />

            <div className="phoneScreen">
              <div className="miniBrand">QR RETURN</div>

              <div className="scanFrame">
                <span className="corner c1" />
                <span className="corner c2" />
                <span className="corner c3" />
                <span className="corner c4" />

                <div className="qrPattern">
                  {Array.from({ length: 49 }).map(
                    (_, index) => (
                      <i
                        key={index}
                        className={
                          [
                            0, 1, 2, 6, 7, 8, 10, 12,
                            14, 15, 16, 18, 20, 21,
                            23, 24, 26, 27, 28, 30,
                            32, 34, 35, 36, 38, 40,
                            42, 43, 44, 46, 47, 48,
                          ].includes(index)
                            ? "dark"
                            : ""
                        }
                      />
                    )
                  )}
                </div>
              </div>

              <small>
                {ka
                  ? "დაასკანერე • დაუკავშირდი • დააბრუნე"
                  : "SCAN • CONTACT • RETURN"}
              </small>
            </div>
          </div>

          <div className="floatingQr">
            <div className="floatingQrInner">
              <b />
              <b />
              <b />
              <b />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PRODUCT / CATEGORY SHOWCASE
      ====================================================== */}

      <section className="protectSection">
        <div className="protectInner">
          <div className="protectHeading">
            <div>
              <div className="sectionLabel">QR RETURN</div>

              <h2>
                {ka
                  ? "ერთი QR. ბევრი გამოყენება."
                  : "One QR. Many uses."}
              </h2>
            </div>

            <p>
              {ka
                ? "QR RETURN შეგიძლიათ გამოიყენოთ თქვენი ყველაზე მნიშვნელოვანი ცხოველებისა და ყოველდღიური ნივთების დასაცავად."
                : "Use QR RETURN to protect the pets and everyday items that matter most."}
            </p>
          </div>

          <div className="protectionBar">
            {protectionTypes.map((item) => (
              <div
                className="protectionItem"
                key={item.en}
              >
                <div className="protectionIcon">
                  {item.icon}
                </div>

                <strong>
                  {ka ? item.ka : item.en}
                </strong>
              </div>
            ))}
          </div>

          <div className="accountNote">
            <div className="accountNoteIcon">
              👤
            </div>

            <div>
              <strong>
                {ka
                  ? "პროფილების შექმნა ხდება თქვენი პირადი ანგარიშიდან"
                  : "Profiles are created from your private account"}
              </strong>

              <p>
                {ka
                  ? "ანგარიშში შესვლის შემდეგ შეგიძლიათ დაამატოთ ძაღლი, კატა, ნივთი ან სხვა QR პროფილი და მართოთ ყველაფერი ერთ ადგილას."
                  : "After signing in, add pets, items or other QR profiles and manage everything from one place."}
              </p>
            </div>

            <a
              href={
                isLoggedIn
                  ? "/account"
                  : "/account/register"
              }
            >
              {isLoggedIn
                ? ka
                  ? "ჩემი ანგარიში"
                  : "My Account"
                : ka
                ? "ანგარიშის შექმნა"
                : "Create Account"}{" "}
              →
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          EMERGENCY ID
      ====================================================== */}

      <section className="emergencySection">
        <div className="emergencyCard">
          <div className="emergencyContent">
            <div className="emergencyTop">
              <div className="medicalMark">+</div>

              <div>
                <div className="emergencyLabel">
                  QR RETURN • EMERGENCY ID
                </div>

                <div className="emergencyFor">
                  FOR PEOPLE
                </div>
              </div>
            </div>

            <h2>
              {ka ? (
                <>
                  Emergency
                  <span> სამაჯური</span>
                </>
              ) : (
                <>
                  Emergency
                  <span> Bracelet</span>
                </>
              )}
            </h2>

            <p className="emergencyDescription">
              {ka
                ? "ადამიანებისთვის შექმნილი QR Emergency ID. QR კოდის ერთი დასკანერებით შესაძლებელია თქვენ მიერ ნებადართული მნიშვნელოვანი სამედიცინო ინფორმაციისა და საგანგებო საკონტაქტო მონაცემების ნახვა."
                : "A QR Emergency ID created for people. One scan can provide access to the medical information and emergency contacts you choose to make available."}
            </p>

            <div className="emergencyFeatures">
              <div>
                <b>01</b>
                <span>
                  {ka
                    ? "საგანგებო კონტაქტი"
                    : "Emergency Contact"}
                </span>
              </div>

              <div>
                <b>02</b>
                <span>
                  {ka
                    ? "სამედიცინო ინფორმაცია"
                    : "Medical Information"}
                </span>
              </div>

              <div>
                <b>03</b>
                <span>
                  {ka
                    ? "აპის გარეშე"
                    : "No App Required"}
                </span>
              </div>

              <div>
                <b>04</b>
                <span>
                  {ka
                    ? "პირადი მონაცემების კონტროლი"
                    : "Privacy Control"}
                </span>
              </div>
            </div>

            <a
              href={
                isLoggedIn
                  ? "/account"
                  : "/account/register"
              }
              className="emergencyCta"
            >
              {isLoggedIn
                ? ka
                  ? "ჩემს ანგარიშში გადასვლა"
                  : "Go to My Account"
                : ka
                ? "ანგარიშის შექმნა"
                : "Create Account"}{" "}
              →
            </a>
          </div>

          <div className="emergencyVisual">
            <div className="bracelet">
              <div className="strap left" />

              <div className="braceletPlate">
                <div className="plateCross">+</div>

                <div className="braceletQr">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>

                <small>QR EMERGENCY</small>
              </div>

              <div className="strap right" />
            </div>

            <div className="emergencyStatus">
              <i />

              <div>
                <strong>
                  EMERGENCY ID
                </strong>

                <small>
                  {ka
                    ? "ადამიანებისთვის"
                    : "FOR PEOPLE"}
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

      <section id="how" className="howSection">
        <div className="howInner">
          <div className="sectionLabel">
            QR RETURN
          </div>

          <h2>
            {ka
              ? "როგორ მუშაობს QR RETURN"
              : "How QR RETURN works"}
          </h2>

          <div className="steps">
            <div className="step">
              <span>01</span>

              <div className="stepIcon">
                👤
              </div>

              <h3>
                {ka
                  ? "შექმენით ანგარიში"
                  : "Create an account"}
              </h3>

              <p>
                {ka
                  ? "ერთი Owner Account-იდან მართავთ ყველა QR პროფილს."
                  : "Manage all QR profiles from one Owner Account."}
              </p>
            </div>

            <div className="step">
              <span>02</span>

              <div className="stepIcon">
                ＋
              </div>

              <h3>
                {ka
                  ? "დაამატეთ პროფილი"
                  : "Add a profile"}
              </h3>

              <p>
                {ka
                  ? "ანგარიშის შიგნით აირჩიეთ ცხოველი, ნივთი ან Emergency ID."
                  : "Choose a pet, item or Emergency ID inside your account."}
              </p>
            </div>

            <div className="step">
              <span>03</span>

              <div className="stepIcon">
                QR
              </div>

              <h3>
                {ka
                  ? "მიამაგრეთ QR"
                  : "Attach the QR"}
              </h3>

              <p>
                {ka
                  ? "უნიკალური QR უკავშირდება კონკრეტულ პროფილს."
                  : "A unique QR is linked to the selected profile."}
              </p>
            </div>

            <div className="step">
              <span>04</span>

              <div className="stepIcon">
                💬
              </div>

              <h3>
                {ka
                  ? "მპოვნელი გიკავშირდებათ"
                  : "The finder contacts you"}
              </h3>

              <p>
                {ka
                  ? "QR-ის დასკანერების შემდეგ მპოვნელს შეუძლია გამოიყენოს თქვენ მიერ ჩართული საკონტაქტო საშუალებები."
                  : "After scanning, the finder can use the contact options you enable."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURES
      ====================================================== */}

      <section className="featuresSection">
        <div className="featuresInner">
          <div className="featureIntro">
            <div className="sectionLabel">
              SMART LOST & FOUND
            </div>

            <h2>
              {ka
                ? "კავშირი, ლოკაცია და კონტროლი."
                : "Contact, location and control."}
            </h2>
          </div>

          <div className="featureGrid">
            {features.map((feature) => (
              <article
                className="featureCard"
                key={feature.number}
              >
                <span>
                  {feature.number}
                </span>

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
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT
      ====================================================== */}

      <section id="contact" className="contact">
        <div className="contactInner">
          <div>
            <div className="sectionLabel">
              QR RETURN
            </div>

            <h2>
              {ka
                ? "დაგვიკავშირდით"
                : "Contact us"}
            </h2>

            <p>
              {ka
                ? "კითხვა გაქვთ QR RETURN-ის, ანგარიშის, QR პროფილის ან Emergency ID-ის შესახებ? მოგვწერეთ."
                : "Questions about QR RETURN, your account, QR profiles or Emergency ID? Contact us."}
            </p>
          </div>

          <a
            href="mailto:hello@qrreturn.com"
            className="contactButton"
          >
            {ka ? "მოგვწერეთ" : "Email us"} →
          </a>
        </div>
      </section>

      {/* =====================================================
          LIVE CHAT / SUPPORT
          KEEP THIS
      ====================================================== */}

      <SupportLauncher language={language} />

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="footer">
        <div className="footerInner">
          <div>
            <div className="footerBrand">
              QR RETURN
            </div>

            <div className="footerSub">
              SMART LOST & FOUND
            </div>
          </div>

          <div className="footerLinks">
            <a href="#how">
              {ka
                ? "როგორ მუშაობს"
                : "How it works"}
            </a>

            <a href="#contact">
              {ka
                ? "კონტაქტი"
                : "Contact"}
            </a>

            <span>
              {ka
                ? "კონფიდენციალურობა"
                : "Privacy"}
            </span>

            <span>
              {ka
                ? "წესები და პირობები"
                : "Terms"}
            </span>
          </div>

          <div className="copyright">
            © 2026 QR RETURN
          </div>
        </div>
      </footer>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        .page {
          min-height: 100vh;
          background: #ffffff;
          color: #0b1728;
          font-family: Inter, -apple-system,
            BlinkMacSystemFont, "Segoe UI",
            Arial, sans-serif;
        }

        /* HEADER */

        .header {
          width: calc(100% - 44px);
          max-width: 1240px;
          min-height: 92px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-bottom: 1px solid #edf1f5;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .brandMark {
          width: 50px;
          height: 50px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: #1465e8;
          color: white;
          font-size: 14px;
          font-weight: 950;
          box-shadow: 0 9px 24px
            rgba(20, 101, 232, 0.22);
        }

        .brandName {
          color: #1465e8;
          font-size: 25px;
          font-weight: 950;
          letter-spacing: -1px;
        }

        .brandSub {
          margin-top: 3px;
          color: #8b96a6;
          font-size: 8px;
          font-weight: 850;
          letter-spacing: 2.2px;
        }

        .headerRight,
        .nav,
        .language {
          display: flex;
          align-items: center;
        }

        .headerRight {
          gap: 15px;
        }

        .nav {
          gap: 8px;
        }

        .adminButton,
        .accountButton,
        .loginButton {
          padding: 11px 16px;
          border-radius: 11px;
          font-size: 12px;
          font-weight: 900;
          text-decoration: none;
          white-space: nowrap;
        }

        .adminButton {
          color: #6049e8;
          border: 1px solid #dcd6ff;
          background: #f5f3ff;
        }

        .accountButton {
          color: white;
          background: #1465e8;
        }

        .loginButton {
          color: #243247;
          border: 1px solid #dfe5ec;
          background: white;
        }

        .language {
          padding: 4px;
          border-radius: 11px;
          background: #f1f4f8;
        }

        .language button {
          padding: 8px 10px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #7b8797;
          font-size: 10px;
          font-weight: 900;
          cursor: pointer;
        }

        .language .selected {
          background: white;
          color: #1465e8;
          box-shadow: 0 2px 8px
            rgba(20, 40, 70, 0.08);
        }

        /* HERO */

        .hero {
          width: calc(100% - 44px);
          max-width: 1240px;
          min-height: 620px;
          margin: auto;
          padding: 85px 0;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: center;
          gap: 65px;
        }

        .heroLabel,
        .sectionLabel {
          color: #1465e8;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 3px;
        }

        .hero h1 {
          max-width: 830px;
          margin: 20px 0 0;
          font-size: clamp(52px, 6.7vw, 84px);
          line-height: 1;
          letter-spacing: -4.8px;
        }

        .hero h1 span {
          color: #1465e8;
        }

        .heroDescription {
          max-width: 630px;
          margin: 25px 0 0;
          color: #697588;
          font-size: 16px;
          line-height: 1.7;
        }

        .heroActions {
          margin-top: 34px;
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .heroPrimary,
        .heroSecondary {
          min-height: 49px;
          padding: 0 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
        }

        .heroPrimary {
          background: #1465e8;
          color: white;
        }

        .heroSecondary {
          border: 1px solid #dfe5ed;
          color: #334155;
          background: white;
        }

        .heroVisual {
          min-height: 430px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .phone {
          width: 220px;
          height: 420px;
          padding: 10px;
          position: relative;
          border-radius: 38px;
          background: #071321;
          transform: rotate(5deg);
          box-shadow: 0 35px 80px
            rgba(18, 51, 92, 0.22);
        }

        .phoneTop {
          width: 65px;
          height: 14px;
          position: absolute;
          top: 17px;
          left: 50%;
          z-index: 3;
          border-radius: 20px;
          background: #071321;
          transform: translateX(-50%);
        }

        .phoneScreen {
          width: 100%;
          height: 100%;
          padding: 25px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 29px;
          background: linear-gradient(
            160deg,
            #fafcff,
            #e9f3ff
          );
        }

        .miniBrand {
          margin-bottom: 25px;
          color: #1465e8;
          font-size: 15px;
          font-weight: 950;
        }

        .scanFrame {
          width: 145px;
          height: 145px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .corner {
          width: 30px;
          height: 30px;
          position: absolute;
        }

        .c1 {
          top: 0;
          left: 0;
          border-top: 3px solid #1465e8;
          border-left: 3px solid #1465e8;
        }

        .c2 {
          top: 0;
          right: 0;
          border-top: 3px solid #1465e8;
          border-right: 3px solid #1465e8;
        }

        .c3 {
          bottom: 0;
          left: 0;
          border-left: 3px solid #1465e8;
          border-bottom: 3px solid #1465e8;
        }

        .c4 {
          right: 0;
          bottom: 0;
          border-right: 3px solid #1465e8;
          border-bottom: 3px solid #1465e8;
        }

        .qrPattern {
          width: 100px;
          height: 100px;
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 3px;
        }

        .qrPattern i {
          border-radius: 2px;
          background: #d7e0eb;
        }

        .qrPattern i.dark {
          background: #101b2c;
        }

        .phoneScreen small {
          margin-top: 26px;
          color: #8090a4;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .floatingQr {
          width: 82px;
          height: 82px;
          position: absolute;
          right: 10px;
          bottom: 55px;
          display: grid;
          place-items: center;
          border-radius: 23px;
          background: #1465e8;
          transform: rotate(-9deg);
          box-shadow: 0 20px 40px
            rgba(20, 101, 232, 0.23);
        }

        .floatingQrInner {
          width: 44px;
          height: 44px;
          padding: 6px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
          border-radius: 8px;
          background: white;
        }

        .floatingQrInner b {
          background: #071321;
        }

        /* PROTECTION */

        .protectSection {
          padding: 100px 24px;
          background: #f7f9fc;
        }

        .protectInner {
          max-width: 1120px;
          margin: auto;
        }

        .protectHeading {
          display: grid;
          grid-template-columns: 1fr 0.8fr;
          align-items: end;
          gap: 70px;
        }

        .protectHeading h2 {
          margin: 14px 0 0;
          font-size: clamp(40px, 5vw, 62px);
          line-height: 1.03;
          letter-spacing: -3px;
        }

        .protectHeading > p {
          margin: 0;
          color: #687487;
          font-size: 15px;
          line-height: 1.75;
        }

        .protectionBar {
          margin-top: 50px;
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          overflow: hidden;
          border: 1px solid #dfe5ed;
          border-radius: 24px;
          background: white;
          box-shadow: 0 15px 40px
            rgba(20, 48, 85, 0.05);
        }

        .protectionItem {
          min-height: 150px;
          padding: 22px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 13px;
          border-right: 1px solid #e7ebf0;
        }

        .protectionItem:last-child {
          border-right: 0;
        }

        .protectionIcon {
          width: 53px;
          height: 53px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          background: #eef4ff;
          font-size: 27px;
        }

        .protectionItem strong {
          color: #1a2940;
          font-size: 12px;
        }

        .accountNote {
          margin-top: 22px;
          padding: 19px 21px;
          display: flex;
          align-items: center;
          gap: 14px;
          border: 1px solid #dce5f1;
          border-radius: 17px;
          background: white;
        }

        .accountNoteIcon {
          width: 44px;
          height: 44px;
          flex: 0 0 44px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #eef4ff;
          font-size: 20px;
        }

        .accountNote > div:nth-child(2) {
          flex: 1;
        }

        .accountNote strong {
          color: #213148;
          font-size: 13px;
        }

        .accountNote p {
          margin: 4px 0 0;
          color: #718096;
          font-size: 11px;
          line-height: 1.55;
        }

        .accountNote a {
          flex: 0 0 auto;
          padding: 11px 16px;
          border-radius: 10px;
          background: #1465e8;
          color: white;
          font-size: 11px;
          font-weight: 900;
          text-decoration: none;
        }

        /* EMERGENCY */

        .emergencySection {
          padding: 90px 24px;
          background: white;
        }

        .emergencyCard {
          max-width: 1120px;
          min-height: 470px;
          margin: auto;
          padding: 48px;
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          align-items: center;
          gap: 50px;
          border: 1px solid #dce5ef;
          border-radius: 32px;
          background:
            radial-gradient(
              circle at 91% 12%,
              rgba(229, 57, 53, 0.13),
              transparent 29%
            ),
            linear-gradient(
              135deg,
              #eef6ff,
              #fafcff 54%,
              #fff5f5
            );
          box-shadow: 0 28px 75px
            rgba(14, 45, 82, 0.08);
        }

        .emergencyContent {
          position: relative;
          z-index: 2;
        }

        .emergencyTop {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .medicalMark {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: #e53935;
          color: white;
          font-size: 34px;
          line-height: 1;
        }

        .emergencyLabel {
          color: #1465e8;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 2px;
        }

        .emergencyFor {
          margin-top: 4px;
          color: #8994a4;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1.7px;
        }

        .emergencyContent h2 {
          margin: 22px 0 16px;
          color: #0d1b2f;
          font-size: clamp(43px, 5vw, 62px);
          line-height: 1;
          letter-spacing: -3px;
        }

        .emergencyContent h2 span {
          color: #e53935;
        }

        .emergencyDescription {
          max-width: 620px;
          margin: 0;
          color: #5f6d7f;
          font-size: 14px;
          line-height: 1.75;
        }

        .emergencyFeatures {
          margin-top: 24px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }

        .emergencyFeatures > div {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .emergencyFeatures b {
          width: 29px;
          height: 29px;
          flex: 0 0 29px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          background: #e6f0ff;
          color: #1465e8;
          font-size: 8px;
        }

        .emergencyFeatures span {
          color: #2c3c52;
          font-size: 11px;
          font-weight: 800;
        }

        .emergencyCta {
          margin-top: 27px;
          padding: 13px 18px;
          display: inline-flex;
          border-radius: 11px;
          background: #1465e8;
          color: white;
          font-size: 12px;
          font-weight: 900;
          text-decoration: none;
        }

        .emergencyVisual {
          position: relative;
          z-index: 2;
          min-height: 330px;
          display: grid;
          place-items: center;
        }

        .bracelet {
          width: 325px;
          height: 130px;
          display: flex;
          align-items: center;
          transform: rotate(-7deg);
          filter: drop-shadow(
            0 22px 25px
            rgba(15, 38, 69, 0.16)
          );
        }

        .strap {
          flex: 1;
          height: 62px;
          background: #1465e8;
        }

        .strap.left {
          border-radius: 31px 0 0 31px;
        }

        .strap.right {
          border-radius: 0 31px 31px 0;
        }

        .braceletPlate {
          width: 148px;
          height: 120px;
          flex: 0 0 148px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 6px solid #0d5ace;
          border-radius: 27px;
          background: white;
        }

        .plateCross {
          width: 22px;
          height: 22px;
          position: absolute;
          top: 9px;
          right: 10px;
          display: grid;
          place-items: center;
          border-radius: 6px;
          background: #e53935;
          color: white;
          font-weight: 900;
        }

        .braceletQr {
          width: 60px;
          height: 60px;
          padding: 7px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
          border-radius: 9px;
          background: #f1f5f9;
        }

        .braceletQr i {
          border-radius: 2px;
          background: #14253b;
        }

        .braceletQr i:nth-child(2),
        .braceletQr i:nth-child(4),
        .braceletQr i:nth-child(8) {
          background: #d7e0eb;
        }

        .braceletPlate small {
          margin-top: 7px;
          color: #1465e8;
          font-size: 7px;
          font-weight: 950;
          letter-spacing: 1px;
        }

        .emergencyStatus {
          min-width: 165px;
          padding: 11px 14px;
          position: absolute;
          right: 0;
          bottom: 13px;
          display: flex;
          align-items: center;
          gap: 9px;
          border: 1px solid #e0e6ee;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 12px 30px
            rgba(16, 40, 75, 0.1);
        }

        .emergencyStatus > i {
          width: 10px;
          height: 10px;
          flex: 0 0 10px;
          border-radius: 50%;
          background: #e53935;
        }

        .emergencyStatus strong,
        .emergencyStatus small {
          display: block;
        }

        .emergencyStatus strong {
          color: #17263b;
          font-size: 10px;
        }

        .emergencyStatus small {
          margin-top: 2px;
          color: #8994a4;
          font-size: 8px;
        }

        /* HOW */

        .howSection {
          padding: 100px 24px;
          background: #f7f9fc;
        }

        .howInner {
          max-width: 1100px;
          margin: auto;
        }

        .howInner > h2 {
          max-width: 700px;
          margin: 15px 0 45px;
          font-size: clamp(40px, 5vw, 60px);
          line-height: 1.03;
          letter-spacing: -3px;
        }

        .steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .step {
          min-height: 270px;
          padding: 22px;
          border: 1px solid #dfe5ed;
          border-radius: 20px;
          background: white;
        }

        .step > span {
          color: #1465e8;
          font-size: 9px;
          font-weight: 950;
        }

        .stepIcon {
          width: 48px;
          height: 48px;
          margin-top: 28px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #eef4ff;
          color: #1465e8;
          font-size: 19px;
          font-weight: 950;
        }

        .step h3 {
          margin: 20px 0 8px;
          color: #18273d;
          font-size: 16px;
        }

        .step p {
          margin: 0;
          color: #718096;
          font-size: 11px;
          line-height: 1.65;
        }

        /* FEATURES */

        .featuresSection {
          padding: 95px 24px;
          background: white;
        }

        .featuresInner {
          max-width: 1100px;
          margin: auto;
        }

        .featureIntro h2 {
          max-width: 750px;
          margin: 14px 0 40px;
          font-size: clamp(38px, 5vw, 58px);
          letter-spacing: -2.7px;
        }

        .featureGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid #dfe5ed;
          border-bottom: 1px solid #dfe5ed;
        }

        .featureCard {
          min-height: 190px;
          padding: 27px 20px;
          border-right: 1px solid #dfe5ed;
        }

        .featureCard:last-child {
          border-right: 0;
        }

        .featureCard > span {
          color: #1465e8;
          font-size: 9px;
          font-weight: 950;
        }

        .featureCard h3 {
          margin: 18px 0 9px;
          color: #17263b;
          font-size: 15px;
        }

        .featureCard p {
          margin: 0;
          color: #718096;
          font-size: 11px;
          line-height: 1.65;
        }

        /* CONTACT */

        .contact {
          padding: 80px 24px;
          background: #f7f9fc;
        }

        .contactInner {
          max-width: 1100px;
          margin: auto;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 50px;
        }

        .contact h2 {
          margin: 14px 0 15px;
          font-size: 42px;
          letter-spacing: -1.8px;
        }

        .contact p {
          max-width: 650px;
          margin: 0;
          color: #697487;
          line-height: 1.7;
        }

        .contactButton {
          flex-shrink: 0;
          padding: 15px 22px;
          border-radius: 13px;
          background: #1465e8;
          color: white;
          text-decoration: none;
          font-size: 14px;
          font-weight: 850;
        }

        /* FOOTER */

        .footer {
          color: white;
          background: #071321;
        }

        .footerInner {
          max-width: 1100px;
          min-height: 150px;
          margin: auto;
          padding: 40px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 35px;
        }

        .footerBrand {
          color: #5b9cff;
          font-size: 20px;
          font-weight: 950;
        }

        .footerSub {
          margin-top: 6px;
          color: #65758b;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .footerLinks {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
        }

        .footerLinks a,
        .footerLinks span {
          color: #a4b0c0;
          text-decoration: none;
          font-size: 11px;
          font-weight: 700;
        }

        .copyright {
          color: #59687c;
          font-size: 10px;
        }

        /* TABLET */

        @media (max-width: 950px) {
          .hero,
          .emergencyCard {
            grid-template-columns: 1fr;
          }

          .protectHeading {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .protectionBar {
            grid-template-columns: repeat(3, 1fr);
          }

          .protectionItem:nth-child(3) {
            border-right: 0;
          }

          .protectionItem:nth-child(-n + 3) {
            border-bottom: 1px solid #e7ebf0;
          }

          .steps,
          .featureGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .featureCard:nth-child(2) {
            border-right: 0;
          }

          .featureCard:nth-child(-n + 2) {
            border-bottom: 1px solid #dfe5ed;
          }

          .contactInner,
          .footerInner {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        /* MOBILE */

        @media (max-width: 650px) {
          .header {
            width: calc(100% - 20px);
            min-height: 78px;
          }

          .brandSub {
            display: none;
          }

          .language {
            display: none;
          }

          .adminButton {
            padding: 9px 8px;
            font-size: 10px;
          }

          .accountButton,
          .loginButton {
            padding: 9px 9px;
            font-size: 10px;
          }

          .brandMark {
            width: 44px;
            height: 44px;
          }

          .brandName {
            font-size: 20px;
          }

          .hero {
            width: calc(100% - 30px);
            min-height: unset;
            padding: 60px 0 70px;
          }

          .hero h1 {
            font-size: 45px;
            letter-spacing: -3px;
          }

          .heroDescription {
            font-size: 14px;
          }

          .heroActions {
            align-items: stretch;
            flex-direction: column;
          }

          .heroPrimary,
          .heroSecondary {
            width: 100%;
          }

          .heroVisual {
            min-height: 390px;
          }

          .protectSection,
          .emergencySection,
          .howSection,
          .featuresSection {
            padding-left: 15px;
            padding-right: 15px;
          }

          .protectionBar {
            grid-template-columns: repeat(2, 1fr);
          }

          .protectionItem {
            border-right: 1px solid #e7ebf0;
            border-bottom: 1px solid #e7ebf0;
          }

          .protectionItem:nth-child(even) {
            border-right: 0;
          }

          .protectionItem:nth-last-child(-n + 2) {
            border-bottom: 0;
          }

          .accountNote {
            align-items: stretch;
            flex-direction: column;
          }

          .accountNote a {
            width: 100%;
            text-align: center;
          }

          .emergencyCard {
            padding: 28px 20px;
            border-radius: 24px;
          }

          .emergencyContent h2 {
            font-size: 40px;
            letter-spacing: -2px;
          }

          .emergencyFeatures {
            grid-template-columns: 1fr;
          }

          .emergencyCta {
            width: 100%;
            justify-content: center;
            text-align: center;
          }

          .bracelet {
            width: 275px;
            transform: rotate(-5deg) scale(0.93);
          }

          .emergencyStatus {
            position: relative;
            right: auto;
            bottom: auto;
            margin-top: -20px;
          }

          .steps,
          .featureGrid {
            grid-template-columns: 1fr;
          }

          .featureCard,
          .featureCard:nth-child(2) {
            border-right: 0;
            border-bottom: 1px solid #dfe5ed;
          }

          .featureCard:last-child {
            border-bottom: 0;
          }

          .contact {
            padding: 65px 18px;
          }
        }
      `}</style>
    </main>
  );
}
