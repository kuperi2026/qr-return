"use client";

import { useEffect, useState } from "react";
import SupportLauncher from "./components/SupportLauncher";
import { supabase } from "@/lib/supabase";

type Language = "ka" | "en";

const features = [
  {
    number: "01",
    ka: "Live Chat",
    en: "Live Chat",
  },
  {
    number: "02",
    ka: "ლოკაციის გაზიარება",
    en: "Location Sharing",
  },
  {
    number: "03",
    ka: "მპოვნელის ჯილდო",
    en: "Finder Reward",
  },
  {
    number: "04",
    ka: "პირადი მონაცემების კონტროლი",
    en: "Privacy Control",
  },
];

const categories = [
  {
    icon: "🐕",
    ka: "ძაღლი",
    en: "Dog",
    kaText:
      "QR პროფილი თქვენი ძაღლის სწრაფად და უსაფრთხოდ დასაბრუნებლად.",
    enText:
      "A QR profile to help your dog return home quickly and safely.",
  },
  {
    icon: "🐈",
    ka: "კატა",
    en: "Cat",
    kaText:
      "საკონტაქტო და მნიშვნელოვანი ინფორმაცია ერთ QR პროფილში.",
    enText:
      "Contact and important information in one QR profile.",
  },
  {
    icon: "🔑",
    ka: "გასაღები",
    en: "Keys",
    kaText:
      "მპოვნელმა მარტივად შეძლოს თქვენთან დაკავშირება.",
    enText:
      "Help a finder contact you quickly.",
  },
  {
    icon: "👛",
    ka: "საფულე",
    en: "Wallet",
    kaText:
      "დაკარგული საფულის დაბრუნების უფრო მარტივი გზა.",
    enText:
      "A simpler way to get a lost wallet back.",
  },
  {
    icon: "🧳",
    ka: "ჩემოდანი",
    en: "Suitcase",
    kaText:
      "დამატებითი დაცვა თქვენი ბარგისთვის მოგზაურობის დროს.",
    enText:
      "Extra protection for your luggage while traveling.",
  },
  {
    icon: "🎒",
    ka: "ჩანთა",
    en: "Bag",
    kaText:
      "QR პროფილი ჩანთის სწრაფად და უსაფრთხოდ დასაბრუნებლად.",
    enText:
      "A QR profile to help return your bag quickly and safely.",
  },
];

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("ka");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const ka = language === "ka";

  useEffect(() => {
    async function checkSession() {
      const { data: userData } =
        await supabase.auth.getUser();

      const user = userData.user;

      if (!user) {
        setIsLoggedIn(false);
        setIsAdmin(false);
        return;
      }

      setIsLoggedIn(true);

      const { data: adminData } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      setIsAdmin(Boolean(adminData));
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
      {/* HEADER */}

      <header className="header">
        <a href="/" className="brand">
          <div className="brandMark">QR</div>

          <div>
            <div className="brandName">
              QR RETURN
            </div>

            <div className="brandSub">
              SMART LOST & FOUND
            </div>
          </div>
        </a>

        <div className="headerRight">
          <nav className="nav">
            {isLoggedIn ? (
              <a
                href="/account"
                className="accountButton"
              >
                👤{" "}
                {ka
                  ? "ჩემი ანგარიში"
                  : "My account"}
              </a>
            ) : (
              <>
                <a
                  href="/account/register"
                  className="accountButton"
                >
                  {ka
                    ? "ანგარიშის შექმნა"
                    : "Create account"}
                </a>

                <a
                  href="/login"
                  className="loginButton"
                >
                  {ka
                    ? "შესვლა"
                    : "Sign in"}
                </a>
              </>
            )}

            {isAdmin && (
              <a
                href="/admin"
                className="adminButton"
              >
                ⚙️ Admin
              </a>
            )}
          </nav>

          <div className="language">
            <button
              type="button"
              className={
                ka ? "selected" : ""
              }
              onClick={() =>
                setLanguage("ka")
              }
            >
              ქართული
            </button>

            <button
              type="button"
              className={
                !ka ? "selected" : ""
              }
              onClick={() =>
                setLanguage("en")
              }
            >
              English
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}

      <section className="hero">
        <div className="heroContent">
          <div className="heroBrand">
            QR RETURN
          </div>

          <h1>
            {ka ? (
              <>
                QR, რომელიც დაკარგულს
                <br />
                <span>
                  შენთან აბრუნებს.
                </span>
              </>
            ) : (
              <>
                The QR that brings
                <br />
                <span>
                  what&apos;s lost back to you.
                </span>
              </>
            )}
          </h1>

          <p className="heroDescription">
            {ka
              ? "ცხოველები, პირადი ნივთები და Emergency ID — ერთი QR RETURN სისტემაში."
              : "Pets, personal items and Emergency ID — all in one QR RETURN system."}
          </p>

          <a
            href="#protect"
            className="heroButton"
          >
            {ka
              ? "ნახე რას იცავს QR RETURN"
              : "See what QR RETURN protects"}{" "}
            ↓
          </a>
        </div>

        <div className="heroVisual">
          <div className="phone">
            <div className="phoneScreen">
              <div className="miniLogo">
                QR
              </div>

              <div className="scanBox">
                <div className="corner c1" />
                <div className="corner c2" />
                <div className="corner c3" />
                <div className="corner c4" />

                <div className="qrPattern">
                  {Array.from({
                    length: 36,
                  }).map((_, i) => (
                    <i
                      key={i}
                      className={
                        [
                          1, 2, 4, 6, 7, 9,
                          12, 14, 15, 17, 19,
                          20, 22, 25, 27, 28,
                          31, 33, 34,
                        ].includes(i)
                          ? "dark"
                          : ""
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="floatingTag">
            <div className="tinyQR">
              <b />
              <b />
              <b />
              <b />
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU CAN PROTECT */}

      <section
        id="protect"
        className="categorySection"
      >
        <div className="categoryInner">
          <div className="sectionIntro">
            <div className="sectionLabel">
              QR RETURN
            </div>

            <h2>
              {ka
                ? "რისი დაცვა შეგიძლიათ?"
                : "What can you protect?"}
            </h2>

            <p>
              {ka
                ? "QR RETURN შეგიძლიათ გამოიყენოთ ცხოველებისა და ყოველდღიური ნივთებისთვის. პროფილების შექმნა და მართვა ხდება თქვენი პირადი ანგარიშიდან."
                : "QR RETURN can be used for pets and everyday items. Profiles are created and managed from your private account."}
            </p>
          </div>

          <div className="categoryGrid">
            {categories.map(
              (category) => (
                <div
                  className="categoryCard"
                  key={category.en}
                >
                  <div className="categoryTop">
                    <div className="categoryEmoji">
                      {category.icon}
                    </div>

                    <div className="categoryBadge">
                      QR
                    </div>
                  </div>

                  <h3>
                    {ka
                      ? category.ka
                      : category.en}
                  </h3>

                  <p>
                    {ka
                      ? category.kaText
                      : category.enText}
                  </p>
                </div>
              )
            )}
          </div>

          {/* ONE ACCOUNT CTA */}

          <div className="accountStrip">
            <div className="accountStripIcon">
              👤
            </div>

            <div className="accountStripText">
              <strong>
                {ka
                  ? "ყველა QR პროფილი ერთი ანგარიშიდან"
                  : "All QR profiles from one account"}
              </strong>

              <p>
                {ka
                  ? "ანგარიშის შექმნის შემდეგ აირჩევთ შესაბამის კატეგორიას და შექმნით იმდენ პროფილს, რამდენიც გჭირდებათ."
                  : "After creating an account, choose the category you need and create as many profiles as you want."}
              </p>
            </div>

            <a
              href={
                isLoggedIn
                  ? "/account"
                  : "/account/register"
              }
              className="accountStripButton"
            >
              {isLoggedIn
                ? ka
                  ? "ჩემს ანგარიშში გადასვლა"
                  : "Go to my account"
                : ka
                ? "ანგარიშის შექმნა"
                : "Create account"}{" "}
              →
            </a>
          </div>

          {/* EMERGENCY */}

          <div className="emergencyFeatured">
            <div className="emergencyFeaturedContent">
              <div className="emergencyMark">
                <span>+</span>
              </div>

              <div className="emergencyCopy">
                <div className="emergencyLabel">
                  QR RETURN • EMERGENCY ID • FOR PEOPLE
                </div>

                <h2>
                  {ka ? (
                    <>
                      Emergency
                      <span>
                        {" "}
                        სამაჯური
                      </span>
                    </>
                  ) : (
                    <>
                      Emergency
                      <span>
                        {" "}
                        Bracelet
                      </span>
                    </>
                  )}
                </h2>

                <p>
                  {ka
                    ? "ადამიანებისთვის შექმნილი QR Emergency ID. ერთი დასკანერებით შესაძლებელია აუცილებელი ინფორმაციისა და საგანგებო კონტაქტის ნახვა."
                    : "A QR Emergency ID created for people. One scan can provide access to essential information and emergency contacts."}
                </p>

                <div className="emergencyMiniFeatures">
                  <div>
                    <b>01</b>
                    <span>
                      Emergency Contact
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
                  className="emergencyButton"
                >
                  {isLoggedIn
                    ? ka
                      ? "Emergency ID-ის მართვა ანგარიშიდან"
                      : "Manage Emergency ID from account"
                    : ka
                    ? "ანგარიშის შექმნა"
                    : "Create account"}{" "}
                  →
                </a>
              </div>
            </div>

            <div className="emergencyBraceletVisual">
              <div className="bracelet">
                <div className="braceletSide left" />

                <div className="braceletPlate">
                  <div className="braceletCross">
                    +
                  </div>

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

                  <small>
                    QR EMERGENCY
                  </small>
                </div>

                <div className="braceletSide right" />
              </div>

              <div className="emergencyStatus">
                <span />

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
        </div>
      </section>

      {/* HOW IT WORKS */}

      <section className="information">
        <div className="infoInner">
          <div className="infoLabel">
            QR RETURN
          </div>

          <h2>
            {ka
              ? "როგორ მუშაობს QR RETURN"
              : "How QR RETURN works"}
          </h2>

          <div className="stepsGrid">
            <div className="stepCard">
              <span>01</span>
              <strong>
                {ka
                  ? "შექმენით ანგარიში"
                  : "Create your account"}
              </strong>
              <p>
                {ka
                  ? "ერთი ანგარიში გამოიყენება თქვენი ყველა QR პროფილის სამართავად."
                  : "One account is used to manage all of your QR profiles."}
              </p>
            </div>

            <div className="stepCard">
              <span>02</span>
              <strong>
                {ka
                  ? "დაამატეთ პროფილი"
                  : "Add a profile"}
              </strong>
              <p>
                {ka
                  ? "ანგარიშის შიგნით აირჩიეთ ძაღლი, კატა, ნივთი ან Emergency ID."
                  : "Inside your account, choose a pet, item or Emergency ID."}
              </p>
            </div>

            <div className="stepCard">
              <span>03</span>
              <strong>
                {ka
                  ? "მიამაგრეთ QR"
                  : "Attach the QR"}
              </strong>
              <p>
                {ka
                  ? "QR კოდი უკავშირდება კონკრეტულ პროფილს და მზად არის დასასკანერებლად."
                  : "The QR code is linked to a specific profile and ready to scan."}
              </p>
            </div>

            <div className="stepCard">
              <span>04</span>
              <strong>
                {ka
                  ? "მპოვნელი გიკავშირდებათ"
                  : "The finder contacts you"}
              </strong>
              <p>
                {ka
                  ? "მპოვნელმა შეიძლება გამოიყენოს Live Chat, ლოკაციის გაზიარება ან თქვენ მიერ ჩართული სხვა საკონტაქტო მეთოდი."
                  : "A finder can use Live Chat, location sharing or another contact method you enable."}
              </p>
            </div>
          </div>

          <div className="featureGrid">
            {features.map(
              (feature) => (
                <div
                  className="feature"
                  key={feature.number}
                >
                  <div className="featureNumber">
                    {feature.number}
                  </div>

                  <div className="featureName">
                    {ka
                      ? feature.ka
                      : feature.en}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CONTACT */}

      <section
        id="contact"
        className="contact"
      >
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
                ? "კითხვა გაქვთ QR კოდის, ანგარიშის, პროფილის, Emergency ID-ის ან ჩვენი სერვისის შესახებ? დაგვიკავშირდით."
                : "Questions about QR codes, accounts, profiles, Emergency ID or our service? Contact us."}
            </p>
          </div>

          <a
            href="mailto:hello@qrreturn.com"
            className="contactButton"
          >
            {ka
              ? "მოგვწერეთ"
              : "Email us"}{" "}
            →
          </a>
        </div>
      </section>

      {/* LIVE CHAT — MUST REMAIN */}

      <SupportLauncher
        language={language}
      />

      {/* FOOTER */}

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
                : "Terms & Conditions"}
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
          background: #ffffff;
          color: #091426;
          font-family: Inter, -apple-system,
            BlinkMacSystemFont, "Segoe UI",
            Arial, sans-serif;
        }

        .header {
          width: calc(100% - 48px);
          max-width: 1240px;
          min-height: 94px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          border-bottom: 1px solid #edf1f6;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 13px;
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
          font-size: 15px;
          font-weight: 900;
          box-shadow: 0 9px 24px
            rgba(20, 101, 232, 0.22);
        }

        .brandName {
          color: #1465e8;
          font-size: 26px;
          font-weight: 950;
          letter-spacing: -1px;
        }

        .brandSub {
          margin-top: 4px;
          color: #8792a4;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 2.4px;
        }

        .headerRight,
        .nav,
        .language {
          display: flex;
          align-items: center;
        }

        .headerRight {
          gap: 18px;
        }

        .nav {
          gap: 8px;
        }

        .accountButton,
        .loginButton,
        .adminButton {
          padding: 11px 17px;
          border-radius: 11px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 850;
          white-space: nowrap;
        }

        .accountButton {
          background: #1465e8;
          color: white;
        }

        .loginButton {
          color: #1d2939;
          border: 1px solid #e2e7ee;
          background: white;
        }

        .adminButton {
          color: white;
          border: 1px solid #6d5dfc;
          background: linear-gradient(
            135deg,
            #1465e8,
            #7655f7
          );
          box-shadow: 0 7px 18px
            rgba(87, 74, 214, 0.18);
        }

        .language {
          padding: 4px;
          background: #f1f4f8;
          border-radius: 11px;
        }

        .language button {
          border: 0;
          background: transparent;
          color: #7c8798;
          padding: 8px 10px;
          border-radius: 8px;
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

        .hero {
          max-width: 1240px;
          min-height: 570px;
          margin: auto;
          padding: 85px 24px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: center;
          gap: 50px;
        }

        .heroBrand,
        .infoLabel,
        .sectionLabel {
          color: #1465e8;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 3px;
        }

        .hero h1 {
          max-width: 830px;
          margin: 24px 0 0;
          font-size: clamp(50px, 6.5vw, 82px);
          line-height: 1.01;
          letter-spacing: -4.5px;
          font-weight: 900;
        }

        .hero h1 span {
          color: #1465e8;
        }

        .heroDescription {
          max-width: 640px;
          margin: 24px 0 0;
          color: #687487;
          font-size: 16px;
          line-height: 1.7;
        }

        .heroButton {
          display: inline-block;
          margin-top: 34px;
          padding: 15px 22px;
          border-radius: 13px;
          background: #1465e8;
          color: white;
          text-decoration: none;
          font-size: 14px;
          font-weight: 900;
        }

        .heroVisual {
          position: relative;
          min-height: 390px;
          display: grid;
          place-items: center;
        }

        .phone {
          width: 210px;
          height: 390px;
          padding: 10px;
          border-radius: 36px;
          background: #081426;
          box-shadow: 0 35px 80px
            rgba(15, 55, 110, 0.22);
          transform: rotate(5deg);
        }

        .phoneScreen {
          width: 100%;
          height: 100%;
          border-radius: 27px;
          background: linear-gradient(
            160deg,
            #f9fbff,
            #eaf3ff
          );
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .miniLogo {
          margin-bottom: 28px;
          color: #1465e8;
          font-size: 20px;
          font-weight: 950;
        }

        .scanBox {
          width: 130px;
          height: 130px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .qrPattern {
          width: 90px;
          height: 90px;
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 3px;
        }

        .qrPattern i {
          background: #d7dfeb;
          border-radius: 2px;
        }

        .qrPattern i.dark {
          background: #0b1627;
        }

        .corner {
          position: absolute;
          width: 28px;
          height: 28px;
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
          border-bottom: 3px solid #1465e8;
          border-left: 3px solid #1465e8;
        }

        .c4 {
          right: 0;
          bottom: 0;
          border-right: 3px solid #1465e8;
          border-bottom: 3px solid #1465e8;
        }

        .floatingTag {
          position: absolute;
          right: 25px;
          bottom: 45px;
          width: 80px;
          height: 80px;
          border-radius: 22px;
          background: #1465e8;
          display: grid;
          place-items: center;
          transform: rotate(-9deg);
        }

        .tinyQR {
          width: 42px;
          height: 42px;
          padding: 6px;
          background: white;
          border-radius: 8px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
        }

        .tinyQR b {
          background: #081426;
        }

        .categorySection {
          padding: 95px 24px;
          background: #f7f9fc;
        }

        .categoryInner {
          max-width: 1120px;
          margin: auto;
        }

        .sectionIntro {
          max-width: 780px;
        }

        .sectionIntro h2 {
          margin: 15px 0;
          font-size: clamp(38px, 5vw, 60px);
          line-height: 1.05;
          letter-spacing: -2.8px;
        }

        .sectionIntro p {
          margin: 0;
          color: #687487;
          font-size: 16px;
          line-height: 1.7;
        }

        .categoryGrid {
          margin-top: 46px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .categoryCard {
          min-height: 230px;
          padding: 25px;
          display: flex;
          flex-direction: column;
          border: 1px solid #e0e6ef;
          border-radius: 22px;
          background: white;
          box-shadow: 0 12px 35px
            rgba(21, 52, 93, 0.045);
        }

        .categoryTop {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .categoryEmoji {
          width: 55px;
          height: 55px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          background: #eef4ff;
          font-size: 29px;
        }

        .categoryBadge {
          padding: 6px 8px;
          border-radius: 8px;
          background: #eef4ff;
          color: #1465e8;
          font-size: 9px;
          font-weight: 900;
        }

        .categoryCard h3 {
          margin: 24px 0 9px;
          color: #132138;
          font-size: 21px;
          letter-spacing: -0.5px;
        }

        .categoryCard p {
          margin: 0;
          color: #748094;
          font-size: 13px;
          line-height: 1.6;
        }

        .accountStrip {
          margin-top: 24px;
          padding: 22px 24px;
          display: flex;
          align-items: center;
          gap: 15px;
          border: 1px solid #dbe4f0;
          border-radius: 18px;
          background: white;
        }

        .accountStripIcon {
          width: 48px;
          height: 48px;
          flex: 0 0 48px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #eef4ff;
          font-size: 22px;
        }

        .accountStripText {
          flex: 1;
        }

        .accountStripText strong {
          color: #182438;
          font-size: 14px;
        }

        .accountStripText p {
          margin: 5px 0 0;
          color: #667286;
          font-size: 12px;
          line-height: 1.6;
        }

        .accountStripButton {
          flex: 0 0 auto;
          padding: 12px 17px;
          border-radius: 10px;
          background: #1465e8;
          color: white;
          text-decoration: none;
          font-size: 12px;
          font-weight: 900;
        }

        .emergencyFeatured {
          position: relative;
          overflow: hidden;
          margin-top: 24px;
          min-height: 440px;
          padding: 44px 48px;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          align-items: center;
          gap: 40px;
          border: 1px solid #d7e3f4;
          border-radius: 30px;
          background:
            radial-gradient(
              circle at 92% 12%,
              rgba(227, 53, 53, 0.14),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #edf5ff 0%,
              #f8fbff 52%,
              #fff5f5 100%
            );
          box-shadow: 0 24px 65px
            rgba(16, 51, 94, 0.08);
        }

        .emergencyFeaturedContent {
          position: relative;
          z-index: 2;
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        .emergencyMark span {
          width: 66px;
          height: 66px;
          display: grid;
          place-items: center;
          border-radius: 19px;
          background: #e53935;
          color: white;
          font-size: 42px;
          line-height: 1;
        }

        .emergencyLabel {
          color: #1465e8;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 2.2px;
        }

        .emergencyCopy h2 {
          margin: 12px 0 14px;
          color: #0c192b;
          font-size: clamp(40px, 4.6vw, 58px);
          line-height: 1;
          letter-spacing: -2.8px;
        }

        .emergencyCopy h2 span {
          color: #e53935;
        }

        .emergencyCopy > p {
          max-width: 600px;
          margin: 0;
          color: #5f6c7e;
          font-size: 15px;
          line-height: 1.7;
        }

        .emergencyMiniFeatures {
          margin-top: 24px;
          display: grid;
          gap: 9px;
        }

        .emergencyMiniFeatures > div {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .emergencyMiniFeatures b {
          width: 29px;
          height: 29px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          background: #e5efff;
          color: #1465e8;
          font-size: 9px;
        }

        .emergencyMiniFeatures span {
          color: #26364c;
          font-size: 13px;
          font-weight: 800;
        }

        .emergencyButton {
          display: inline-flex;
          margin-top: 26px;
          padding: 14px 20px;
          border-radius: 12px;
          background: #1465e8;
          color: white;
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
        }

        .emergencyBraceletVisual {
          position: relative;
          z-index: 2;
          min-height: 300px;
          display: grid;
          place-items: center;
        }

        .bracelet {
          width: 320px;
          height: 130px;
          display: flex;
          align-items: center;
          transform: rotate(-7deg);
        }

        .braceletSide {
          flex: 1;
          height: 64px;
          background: #1465e8;
        }

        .braceletSide.left {
          border-radius: 32px 0 0 32px;
        }

        .braceletSide.right {
          border-radius: 0 32px 32px 0;
        }

        .braceletPlate {
          width: 150px;
          height: 122px;
          flex: 0 0 150px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border: 6px solid #0d5ace;
          border-radius: 28px;
          background: white;
        }

        .braceletCross {
          position: absolute;
          top: 9px;
          right: 11px;
          width: 22px;
          height: 22px;
          display: grid;
          place-items: center;
          border-radius: 6px;
          background: #e53935;
          color: white;
          font-weight: 900;
        }

        .braceletQr {
          width: 62px;
          height: 62px;
          padding: 7px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
          border-radius: 9px;
          background: #f1f5f9;
        }

        .braceletQr i {
          background: #13243a;
          border-radius: 2px;
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
          position: absolute;
          bottom: 7px;
          right: 0;
          min-width: 165px;
          padding: 11px 14px;
          display: flex;
          align-items: center;
          gap: 9px;
          border: 1px solid #e0e6ee;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.96);
        }

        .emergencyStatus > span {
          width: 10px;
          height: 10px;
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

        .information {
          background: white;
          padding: 95px 24px;
        }

        .infoInner {
          max-width: 1050px;
          margin: auto;
        }

        .information h2 {
          margin: 15px 0 40px;
          font-size: clamp(36px, 5vw, 58px);
          letter-spacing: -2.5px;
        }

        .stepsGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .stepCard {
          padding: 22px;
          border: 1px solid #e0e6ef;
          border-radius: 18px;
          background: #fafbfd;
        }

        .stepCard span {
          color: #1465e8;
          font-size: 10px;
          font-weight: 950;
        }

        .stepCard strong {
          display: block;
          margin-top: 14px;
          color: #182438;
          font-size: 15px;
        }

        .stepCard p {
          margin: 9px 0 0;
          color: #667286;
          font-size: 12px;
          line-height: 1.6;
        }

        .featureGrid {
          margin-top: 55px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid #dfe5ed;
          border-bottom: 1px solid #dfe5ed;
        }

        .feature {
          min-height: 120px;
          padding: 28px 20px;
          border-right: 1px solid #dfe5ed;
        }

        .feature:last-child {
          border-right: 0;
        }

        .featureNumber {
          color: #1465e8;
          font-size: 11px;
          font-weight: 950;
        }

        .featureName {
          margin-top: 17px;
          color: #162238;
          font-size: 15px;
          font-weight: 850;
        }

        .contact {
          padding: 80px 24px;
          background: #f7f9fc;
        }

        .contactInner {
          max-width: 1100px;
          margin: auto;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
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

        .footer {
          background: #071321;
          color: white;
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
          gap: 25px;
          flex-wrap: wrap;
        }

        .footerLinks a,
        .footerLinks span {
          color: #a4b0c0;
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
        }

        .copyright {
          color: #59687c;
          font-size: 11px;
        }

        @media (max-width: 900px) {
          .hero,
          .emergencyFeatured {
            grid-template-columns: 1fr;
          }

          .categoryGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .stepsGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .featureGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .contactInner,
          .footerInner {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 600px) {
          .header {
            width: calc(100% - 20px);
            min-height: 78px;
          }

          .language {
            display: none;
          }

          .accountButton,
          .loginButton,
          .adminButton {
            padding: 9px 10px;
            font-size: 11px;
          }

          .brandName {
            font-size: 21px;
          }

          .brandMark {
            width: 44px;
            height: 44px;
          }

          .hero {
            padding: 58px 18px 65px;
          }

          .hero h1 {
            font-size: 46px;
            line-height: 1.03;
            letter-spacing: -3px;
          }

          .categorySection {
            padding: 65px 15px;
          }

          .categoryGrid,
          .stepsGrid {
            grid-template-columns: 1fr;
          }

          .accountStrip {
            flex-direction: column;
            align-items: stretch;
          }

          .accountStripButton {
            width: 100%;
            text-align: center;
          }

          .emergencyFeatured {
            padding: 28px 19px;
            border-radius: 23px;
          }

          .emergencyFeaturedContent {
            display: block;
          }

          .emergencyMark {
            margin-bottom: 18px;
          }

          .emergencyCopy h2 {
            font-size: 39px;
          }

          .emergencyButton {
            width: 100%;
            justify-content: center;
            text-align: center;
          }

          .bracelet {
            width: 275px;
            transform: rotate(-5deg)
              scale(0.93);
          }

          .emergencyStatus {
            position: relative;
            right: auto;
            bottom: auto;
            margin-top: -25px;
          }

          .information {
            padding: 70px 18px;
          }

          .featureGrid {
            grid-template-columns: 1fr 1fr;
          }

          .contact {
            padding: 65px 18px;
          }
        }
      `}</style>
    </main>
  );
}
