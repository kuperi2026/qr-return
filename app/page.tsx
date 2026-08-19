"use client";

import { useEffect, useState } from "react";
import SupportLauncher from "./components/SupportLauncher";
import { supabase } from "@/lib/supabase";

type Language = "ka" | "en";

const products = [
  {
    id: "dog",
    ka: "ძაღლი",
    en: "Dog",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=90",
  },
  {
    id: "cat",
    ka: "კატა",
    en: "Cat",
    image:
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=900&q=90",
  },
  {
    id: "keys",
    ka: "გასაღები",
    en: "Keys",
    image:
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=900&q=90",
  },
  {
    id: "wallet",
    ka: "საფულე",
    en: "Wallet",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=90",
  },
  {
    id: "luggage",
    ka: "ჩემოდანი",
    en: "Luggage",
    image:
      "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=900&q=90",
  },
  {
    id: "bag",
    ka: "ჩანთა",
    en: "Bag",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=90",
  },
];

const features = [
  {
    number: "01",
    icon: "chat",
    ka: "Live Chat",
    en: "Live Chat",
    kaText:
      "მპოვნელს შეუძლია პირდაპირ QR RETURN-ის საშუალებით დაგიკავშირდეთ.",
    enText:
      "A finder can contact you directly through QR RETURN.",
  },
  {
    number: "02",
    icon: "location",
    ka: "ლოკაციის გაზიარება",
    en: "Location Sharing",
    kaText:
      "მპოვნელმა ერთი ღილაკით შეიძლება გაგიზიაროთ ნივთის ან ცხოველის მდებარეობა.",
    enText:
      "A finder can share the location of your pet or item in one tap.",
  },
  {
    number: "03",
    icon: "reward",
    ka: "მპოვნელის ჯილდო",
    en: "Finder Reward",
    kaText:
      "სურვილის შემთხვევაში მიუთითეთ ჯილდო უსაფრთხო დაბრუნებისთვის.",
    enText:
      "Optionally offer a reward for a safe return.",
  },
  {
    number: "04",
    icon: "privacy",
    ka: "Privacy First",
    en: "Privacy First",
    kaText:
      "თქვენ თავად აკონტროლებთ რა ინფორმაცია გამოჩნდება მპოვნელისთვის.",
    enText:
      "You control exactly what information is visible to the finder.",
  },
];

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("ka");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const ka = language === "ka";

  useEffect(() => {
    async function loadSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setIsLoggedIn(Boolean(user));
    }

    void loadSession();

    const { data } = supabase.auth.onAuthStateChange(() => {
      void loadSession();
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <main className="page">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="header">
        <a href="/" className="brand">
          <div className="brandIcon">
            <QrLogo />
          </div>

          <div className="brandCopy">
            <strong>QR RETURN</strong>
            <span>SMART LOST &amp; FOUND</span>
          </div>
        </a>

        <div className="headerRight">
          <nav className="nav">
            <a href="/admin" className="adminLink">
              <AdminIcon />
              <span>Admin</span>
            </a>

            {isLoggedIn ? (
              <a href="/account" className="accountButton">
                <UserIcon />
                <span>
                  {ka ? "ჩემი ანგარიში" : "My Account"}
                </span>
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

                <a href="/login" className="loginLink">
                  {ka ? "შესვლა" : "Sign In"}
                </a>
              </>
            )}
          </nav>

          <div className="language">
            <button
              type="button"
              className={ka ? "active" : ""}
              onClick={() => setLanguage("ka")}
            >
              GEO
            </button>

            <span />

            <button
              type="button"
              className={!ka ? "active" : ""}
              onClick={() => setLanguage("en")}
            >
              ENG
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          HERO — EMERGENCY + PHONE
      ====================================================== */}

      <section className="hero">
        <div className="heroGlow glowOne" />
        <div className="heroGlow glowTwo" />

        <div className="heroInner">
          {/* LEFT: EMERGENCY */}

          <section className="emergencyHero">
            <div className="emergencyTop">
              <div className="medicalLogo">+</div>

              <div>
                <span>QR RETURN</span>
                <strong>EMERGENCY ID</strong>
              </div>
            </div>

            <h1>
              {ka
                ? "მნიშვნელოვანი ინფორმაცია მაშინ, როცა ყველაზე მეტად გჭირდება."
                : "Essential information when it matters most."}
            </h1>

            <p className="emergencyLead">
              {ka
                ? "Emergency ID ადამიანებისთვის. ერთი QR სკანი საკმარისია თქვენ მიერ ნებადართული საგანგებო და სამედიცინო ინფორმაციის სანახავად."
                : "Emergency ID for people. One QR scan gives access to the emergency and medical information you choose to share."}
            </p>

            <div className="emergencyFeatures">
              <div>
                <span className="emergencyFeatureIcon">
                  <UserIcon />
                </span>

                <div>
                  <strong>
                    {ka
                      ? "საგანგებო კონტაქტი"
                      : "Emergency Contact"}
                  </strong>
                  <small>
                    {ka
                      ? "თქვენ მიერ არჩეული პირი"
                      : "Your trusted contact"}
                  </small>
                </div>
              </div>

              <div>
                <span className="emergencyFeatureIcon">
                  <HeartIcon />
                </span>

                <div>
                  <strong>
                    {ka
                      ? "სამედიცინო ინფორმაცია"
                      : "Medical Information"}
                  </strong>
                  <small>
                    {ka
                      ? "მხოლოდ საჭირო ინფორმაცია"
                      : "Only what you choose"}
                  </small>
                </div>
              </div>

              <div>
                <span className="emergencyFeatureIcon">
                  <ScanIcon />
                </span>

                <div>
                  <strong>
                    {ka ? "აპის გარეშე" : "No App Required"}
                  </strong>
                  <small>
                    {ka
                      ? "უბრალოდ დაასკანერე QR"
                      : "Simply scan the QR"}
                  </small>
                </div>
              </div>

              <div>
                <span className="emergencyFeatureIcon">
                  <ShieldIcon />
                </span>

                <div>
                  <strong>Privacy Control</strong>
                  <small>
                    {ka
                      ? "თქვენ აკონტროლებთ მონაცემებს"
                      : "You control your information"}
                  </small>
                </div>
              </div>
            </div>

            <div className="heroActions">
              <a
                href={
                  isLoggedIn
                    ? "/account"
                    : "/account/register"
                }
                className="primaryCta"
              >
                <span>
                  {isLoggedIn
                    ? ka
                      ? "ჩემს ანგარიშში გადასვლა"
                      : "Go to My Account"
                    : ka
                      ? "ანგარიშის შექმნა"
                      : "Create Account"}
                </span>

                <ArrowIcon />
              </a>

              <a href="#how" className="secondaryCta">
                {ka ? "როგორ მუშაობს" : "How it works"}
              </a>
            </div>

            <div className="emergencyHint">
              <span className="pulse" />

              {ka
                ? "QR Emergency ID • ადამიანებისთვის"
                : "QR Emergency ID • For people"}
            </div>
          </section>

          {/* RIGHT: PHONE */}

          <section className="phoneVisual">
            <div className="phoneLight" />

            <div className="phone">
              <div className="phoneOuter">
                <div className="phoneNotch" />

                <div className="phoneScreen">
                  <div className="screenBrand">
                    <div className="screenLogo">
                      <QrLogo />
                    </div>

                    <div>
                      <span>QR RETURN</span>
                      <strong>
                        {ka
                          ? "დაცული პროფილი"
                          : "Protected Profile"}
                      </strong>
                    </div>
                  </div>

                  <div className="screenQr">
                    <QrCode />
                  </div>

                  <div className="screenTitle">
                    {ka
                      ? "დაასკანერე დასაბრუნებლად"
                      : "SCAN TO RETURN"}
                  </div>

                  <div className="screenSubtitle">
                    {ka
                      ? "აპის გარეშე"
                      : "No app required"}
                  </div>

                  <div className="screenBottom">
                    <div>
                      <ShieldIcon />

                      <span>
                        {ka
                          ? "დაცული ინფორმაცია"
                          : "Protected"}
                      </span>
                    </div>

                    <div>
                      <ChatIcon />

                      <span>Live Chat</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="liveFloating">
              <div className="floatingCircle">
                <ChatIcon />
              </div>

              <div>
                <span>LIVE CHAT</span>
                <strong>
                  {ka
                    ? "მპოვნელთან პირდაპირი კავშირი"
                    : "Direct finder contact"}
                </strong>
              </div>

              <i />
            </div>

            <div className="locationFloating">
              <div className="floatingCircle locationCircle">
                <LocationIcon />
              </div>

              <div>
                <span>LOCATION</span>
                <strong>
                  {ka ? "ერთი ღილაკით" : "One tap"}
                </strong>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* =====================================================
          6 PRODUCT PHOTO SHOWCASE
      ====================================================== */}

      <section className="productsSection">
        <div className="sectionShell">
          <div className="productsHeader">
            <div>
              <span className="sectionEyebrow">
                QR RETURN
              </span>

              <h2>
                {ka
                  ? "დაიცავით ის, რაც მნიშვნელოვანია."
                  : "Protect what matters."}
              </h2>
            </div>

            <p>
              {ka
                ? "ერთი QR RETURN ანგარიში თქვენი ცხოველებისა და ყოველდღიური ნივთებისთვის."
                : "One QR RETURN account for your pets and everyday belongings."}
            </p>
          </div>

          <div className="productGrid">
            {products.map((product) => (
              <article
                className="productCard"
                key={product.id}
              >
                <img
                  src={product.image}
                  alt={ka ? product.ka : product.en}
                />

                <div className="productShade" />

                <div className="productQrTag">
                  <MiniQr />
                </div>

                <div className="productLabel">
                  <strong>
                    {ka ? product.ka : product.en}
                  </strong>

                  <span>QR RETURN</span>
                </div>
              </article>
            ))}
          </div>

          <div className="profilesNotice">
            <div className="noticeIcon">
              <UserIcon />
            </div>

            <div>
              <span>OWNER ACCOUNT</span>

              <strong>
                {ka
                  ? "პროფილების შექმნა და მართვა ხდება თქვენი ანგარიშიდან."
                  : "Create and manage profiles from your account."}
              </strong>
            </div>

            <p>
              {ka
                ? "ძაღლი, კატა, გასაღები, საფულე, ჩემოდანი და ჩანთა — ყველაფერი ერთ სივრცეში."
                : "Dog, cat, keys, wallet, luggage and bag — all in one place."}
            </p>

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
                  : "Create Account"}

              <ArrowIcon />
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

      <section id="how" className="howSection">
        <div className="sectionShell">
          <div className="simpleHeader">
            <span className="sectionEyebrow">
              HOW IT WORKS
            </span>

            <h2>
              {ka
                ? "მარტივი მფლობელისთვის. მარტივი მპოვნელისთვის."
                : "Simple for the owner. Simple for the finder."}
            </h2>
          </div>

          <div className="steps">
            <div className="step">
              <span className="stepNumber">01</span>

              <div className="stepIcon">
                <UserIcon />
              </div>

              <strong>
                {ka
                  ? "შექმენით ანგარიში"
                  : "Create Account"}
              </strong>

              <p>
                {ka
                  ? "ერთი უსაფრთხო Owner Account თქვენი ყველა QR პროფილისთვის."
                  : "One secure Owner Account for all of your QR profiles."}
              </p>
            </div>

            <div className="stepArrow">
              <ArrowIcon />
            </div>

            <div className="step">
              <span className="stepNumber">02</span>

              <div className="stepIcon">
                <PlusIcon />
              </div>

              <strong>
                {ka
                  ? "დაამატეთ პროფილი"
                  : "Add Profile"}
              </strong>

              <p>
                {ka
                  ? "ანგარიშის შიგნით აირჩიეთ შესაბამისი ცხოველი, ნივთი ან Emergency ID."
                  : "Choose a pet, item or Emergency ID inside your account."}
              </p>
            </div>

            <div className="stepArrow">
              <ArrowIcon />
            </div>

            <div className="step">
              <span className="stepNumber">03</span>

              <div className="stepIcon qrLetters">
                QR
              </div>

              <strong>
                {ka ? "მიამაგრეთ QR" : "Attach QR"}
              </strong>

              <p>
                {ka
                  ? "უნიკალური QR კოდი უკავშირდება კონკრეტულ პროფილს."
                  : "A unique QR connects directly to the selected profile."}
              </p>
            </div>

            <div className="stepArrow">
              <ArrowIcon />
            </div>

            <div className="step">
              <span className="stepNumber">04</span>

              <div className="stepIcon">
                <ChatIcon />
              </div>

              <strong>
                {ka
                  ? "მპოვნელი გიკავშირდებათ"
                  : "Finder Contacts You"}
              </strong>

              <p>
                {ka
                  ? "Live Chat, ლოკაცია და თქვენ მიერ არჩეული სხვა საკონტაქტო მეთოდები."
                  : "Live Chat, location and the contact options you enable."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURES
      ====================================================== */}

      <section className="featuresSection">
        <div className="sectionShell">
          <div className="featureHeader">
            <span className="sectionEyebrow">
              QR RETURN TECHNOLOGY
            </span>

            <h2>
              {ka
                ? "დაკავშირება ზედმეტი სირთულის გარეშე."
                : "Connection without unnecessary friction."}
            </h2>
          </div>

          <div className="featureGrid">
            {features.map((feature) => (
              <article
                className="featureCard"
                key={feature.number}
              >
                <div className="featureCardTop">
                  <span>{feature.number}</span>

                  <div className="featureIcon">
                    {feature.icon === "chat" && <ChatIcon />}
                    {feature.icon === "location" && (
                      <LocationIcon />
                    )}
                    {feature.icon === "reward" && (
                      <RewardIcon />
                    )}
                    {feature.icon === "privacy" && (
                      <ShieldIcon />
                    )}
                  </div>
                </div>

                <h3>
                  {ka ? feature.ka : feature.en}
                </h3>

                <p>
                  {ka
                    ? feature.kaText
                    : feature.enText}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          EMERGENCY INFORMATION STRIP
      ====================================================== */}

      <section className="emergencyStripSection">
        <div className="sectionShell">
          <div className="emergencyStrip">
            <div className="stripSymbol">+</div>

            <div className="stripCopy">
              <span>QR RETURN EMERGENCY ID</span>

              <strong>
                {ka
                  ? "საგანგებო სიტუაციაში მნიშვნელოვანი ინფორმაცია ერთი სკანით."
                  : "Essential information in an emergency — one scan away."}
              </strong>

              <p>
                {ka
                  ? "Emergency Contact • Medical Information • Privacy Control • No App Required"
                  : "Emergency Contact • Medical Information • Privacy Control • No App Required"}
              </p>
            </div>

            <a
              href={
                isLoggedIn
                  ? "/account"
                  : "/account/register"
              }
            >
              {ka ? "იხილეთ მეტი" : "Learn more"}
              <ArrowIcon />
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT
      ====================================================== */}

      <section id="contact" className="contactSection">
        <div className="sectionShell contactInner">
          <div>
            <span className="sectionEyebrow">
              CONTACT
            </span>

            <h2>
              {ka ? "დაგვიკავშირდით" : "Contact us"}
            </h2>

            <p>
              {ka
                ? "კითხვა გაქვთ QR RETURN-ის, ანგარიშის, QR პროფილის ან Emergency ID-ის შესახებ? მოგვწერეთ."
                : "Questions about QR RETURN, accounts, QR profiles or Emergency ID? Send us a message."}
            </p>
          </div>

          <a
            className="contactButton"
            href="mailto:hello@qrreturn.com"
          >
            {ka ? "მოგვწერეთ" : "Email us"}
            <ArrowIcon />
          </a>
        </div>
      </section>

      {/* =====================================================
          LIVE SUPPORT
      ====================================================== */}

      <SupportLauncher language={language} />

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="footer">
        <div className="footerInner">
          <div className="footerColumn footerMain">
            <div className="footerBrand">
              <div className="footerBrandIcon">
                <QrLogo />
              </div>

              <div>
                <strong>QR RETURN</strong>
                <span>SMART LOST &amp; FOUND</span>
              </div>
            </div>

            <p>
              {ka
                ? "მარტივი და უსაფრთხო გზა დაკარგული ნივთებისა და ცხოველების დასაბრუნებლად."
                : "A simple and secure way to help lost pets and belongings find their way home."}
            </p>
          </div>

          <div className="footerColumn">
            <span className="footerHeading">
              {ka ? "ნავიგაცია" : "Explore"}
            </span>

            <a href="#how">
              {ka ? "როგორ მუშაობს" : "How it works"}
            </a>

            <a href="#contact">
              {ka ? "კონტაქტი" : "Contact"}
            </a>

            <a href="/login">
              {ka ? "შესვლა" : "Sign In"}
            </a>
          </div>

          <div className="footerColumn">
            <span className="footerHeading">
              {ka ? "ინფორმაცია" : "Information"}
            </span>

            <span>
              {ka ? "კონფიდენციალურობა" : "Privacy"}
            </span>

            <span>
              {ka ? "წესები და პირობები" : "Terms"}
            </span>

            <span>Emergency ID</span>
          </div>

          <div className="footerColumn footerRight">
            <strong>QR RETURN</strong>
            <span>© 2026</span>
          </div>
        </div>
      </footer>

      {/* =====================================================
          STYLES
      ====================================================== */}

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          background: #f7f7f5;
        }

        .page {
          min-height: 100vh;
          overflow: hidden;
          background: #f7f7f5;
          color: #111827;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Arial,
            sans-serif;
        }

        /* ================= HEADER ================= */

        .header {
          width: calc(100% - 52px);
          max-width: 1320px;
          min-height: 82px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          position: relative;
          z-index: 20;
          border-bottom: 1px solid rgba(17, 24, 39, 0.08);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
          text-decoration: none;
        }

        .brandIcon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #111827;
          color: white;
        }

        .brandIcon :global(svg) {
          width: 22px;
          height: 22px;
        }

        .brandCopy strong,
        .brandCopy span {
          display: block;
        }

        .brandCopy strong {
          color: #111827;
          font-size: 18px;
          font-weight: 850;
          letter-spacing: -0.5px;
        }

        .brandCopy span {
          margin-top: 3px;
          color: #8b93a1;
          font-size: 6px;
          font-weight: 850;
          letter-spacing: 2px;
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

        .adminLink,
        .accountButton,
        .loginLink {
          min-height: 38px;
          padding: 0 13px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
        }

        .adminLink {
          color: #454f5f;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(17, 24, 39, 0.1);
        }

        .adminLink :global(svg),
        .accountButton :global(svg) {
          width: 13px;
          height: 13px;
        }

        .accountButton {
          color: white;
          background: #111827;
          border: 1px solid #111827;
          box-shadow:
            0 7px 18px rgba(17, 24, 39, 0.11);
        }

        .loginLink {
          color: #374151;
          background: transparent;
          border: 1px solid rgba(17, 24, 39, 0.11);
        }

        .language {
          gap: 7px;
        }

        .language span {
          width: 1px;
          height: 12px;
          background: #d6d9df;
        }

        .language button {
          padding: 0;
          border: 0;
          background: transparent;
          color: #9ba1ab;
          font-size: 8px;
          font-weight: 850;
          cursor: pointer;
        }

        .language button.active {
          color: #e5484d;
        }

        /* ================= COMMON ================= */

        .sectionShell {
          width: calc(100% - 52px);
          max-width: 1220px;
          margin: auto;
        }

        .sectionEyebrow {
          color: #e5484d;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        /* ================= HERO ================= */

        .hero {
          min-height: 650px;
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(
              120deg,
              #f8f7f4 0%,
              #f1f2f2 52%,
              #e9eaeb 100%
            );
          border-bottom: 1px solid rgba(17, 24, 39, 0.07);
        }

        .heroInner {
          width: calc(100% - 52px);
          max-width: 1240px;
          min-height: 650px;
          margin: auto;
          display: grid;
          grid-template-columns: 0.93fr 1.07fr;
          align-items: center;
          gap: 65px;
          position: relative;
          z-index: 2;
        }

        .heroGlow {
          position: absolute;
          pointer-events: none;
          border-radius: 50%;
        }

        .glowOne {
          width: 540px;
          height: 540px;
          right: -180px;
          top: -170px;
          background:
            radial-gradient(
              circle,
              rgba(70, 92, 122, 0.13),
              transparent 68%
            );
        }

        .glowTwo {
          width: 360px;
          height: 360px;
          left: -200px;
          bottom: -170px;
          background:
            radial-gradient(
              circle,
              rgba(229, 72, 77, 0.08),
              transparent 70%
            );
        }

        /* EMERGENCY HERO */

        .emergencyHero {
          max-width: 500px;
          padding: 34px;
          border: 1px solid rgba(229, 72, 77, 0.25);
          border-radius: 27px;
          background:
            rgba(255, 255, 255, 0.74);
          box-shadow:
            0 22px 60px rgba(67, 51, 53, 0.08);
          backdrop-filter: blur(18px);
        }

        .emergencyTop {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .medicalLogo {
          width: 49px;
          height: 49px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #e5484d;
          color: white;
          font-size: 31px;
          line-height: 1;
          box-shadow:
            0 10px 28px rgba(229, 72, 77, 0.24);
        }

        .emergencyTop span,
        .emergencyTop strong {
          display: block;
        }

        .emergencyTop span {
          color: #e5484d;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.6px;
        }

        .emergencyTop strong {
          margin-top: 4px;
          color: #111827;
          font-size: 16px;
          letter-spacing: -0.3px;
        }

        .emergencyHero h1 {
          margin: 27px 0 0;
          max-width: 430px;
          color: #111827;
          font-size:
            clamp(30px, 3.8vw, 43px);
          line-height: 1.08;
          letter-spacing: -2px;
          font-weight: 720;
        }

        .emergencyLead {
          max-width: 440px;
          margin: 17px 0 0;
          color: #656d79;
          font-size: 12px;
          line-height: 1.72;
        }

        .emergencyFeatures {
          margin-top: 25px;
          border-top: 1px solid #ebe6e6;
        }

        .emergencyFeatures > div {
          min-height: 59px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid #ebe6e6;
        }

        .emergencyFeatureIcon {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: #fff0f0;
          color: #e5484d;
        }

        .emergencyFeatureIcon :global(svg) {
          width: 15px;
          height: 15px;
        }

        .emergencyFeatures strong,
        .emergencyFeatures small {
          display: block;
        }

        .emergencyFeatures strong {
          color: #293241;
          font-size: 10px;
        }

        .emergencyFeatures small {
          margin-top: 2px;
          color: #969da8;
          font-size: 7px;
        }

        .heroActions {
          margin-top: 26px;
          display: flex;
          gap: 9px;
        }

        .primaryCta,
        .secondaryCta {
          min-height: 44px;
          padding: 0 15px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 10px;
          font-size: 9px;
          font-weight: 850;
          text-decoration: none;
        }

        .primaryCta {
          color: white;
          background: #111827;
        }

        .primaryCta :global(svg) {
          width: 12px;
          height: 12px;
        }

        .secondaryCta {
          color: #4b5563;
          border: 1px solid #dde0e5;
          background: rgba(255, 255, 255, 0.72);
        }

        .emergencyHint {
          margin-top: 17px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #858d99;
          font-size: 7px;
          font-weight: 750;
        }

        .pulse {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #e5484d;
          box-shadow:
            0 0 0 5px rgba(229, 72, 77, 0.08);
        }

        /* PHONE */

        .phoneVisual {
          min-height: 570px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .phoneLight {
          width: 520px;
          height: 500px;
          position: absolute;
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              rgba(60, 76, 98, 0.22),
              rgba(80, 92, 110, 0.05) 45%,
              transparent 70%
            );
        }

        .phone {
          position: relative;
          z-index: 3;
          transform:
            perspective(1300px)
            rotateY(-10deg)
            rotateX(1deg)
            rotateZ(3deg);
        }

        .phoneOuter {
          width: 280px;
          height: 535px;
          padding: 9px;
          position: relative;
          border: 1px solid #38404b;
          border-radius: 44px;
          background:
            linear-gradient(
              145deg,
              #111821,
              #02070c
            );
          box-shadow:
            0 42px 90px rgba(20, 26, 34, 0.28);
        }

        .phoneNotch {
          width: 75px;
          height: 18px;
          position: absolute;
          z-index: 4;
          top: 14px;
          left: 50%;
          border-radius: 999px;
          background: #05090e;
          transform: translateX(-50%);
        }

        .phoneScreen {
          height: 100%;
          padding: 34px 19px 19px;
          border-radius: 35px;
          background:
            linear-gradient(
              180deg,
              #0f151e,
              #080c12
            );
        }

        .screenBrand {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .screenLogo {
          width: 33px;
          height: 33px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: #e5484d;
          color: white;
        }

        .screenLogo :global(svg) {
          width: 17px;
          height: 17px;
        }

        .screenBrand span,
        .screenBrand strong {
          display: block;
        }

        .screenBrand span {
          color: #e5484d;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .screenBrand strong {
          margin-top: 2px;
          color: white;
          font-size: 9px;
          font-weight: 650;
        }

        .screenQr {
          width: 190px;
          height: 190px;
          margin: 52px auto 0;
          display: grid;
          place-items: center;
          border-radius: 17px;
          background: white;
          box-shadow:
            0 20px 48px rgba(0, 0, 0, 0.28);
        }

        .screenTitle {
          margin-top: 27px;
          color: white;
          text-align: center;
          font-size: 12px;
          font-weight: 850;
          letter-spacing: 0.8px;
        }

        .screenSubtitle {
          margin-top: 5px;
          color: #7d8794;
          text-align: center;
          font-size: 7px;
        }

        .screenBottom {
          margin-top: 31px;
          padding-top: 15px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-top: 1px solid #212833;
        }

        .screenBottom > div {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #818b98;
          font-size: 6px;
        }

        .screenBottom :global(svg) {
          width: 12px;
          height: 12px;
          color: #e5484d;
        }

        .liveFloating,
        .locationFloating {
          position: absolute;
          z-index: 5;
          padding: 11px;
          display: flex;
          align-items: center;
          gap: 9px;
          border: 1px solid rgba(255, 255, 255, 0.7);
          border-radius: 15px;
          background:
            rgba(255, 255, 255, 0.88);
          box-shadow:
            0 18px 42px rgba(38, 46, 57, 0.13);
          backdrop-filter: blur(18px);
        }

        .liveFloating {
          width: 205px;
          right: -10px;
          top: 94px;
        }

        .locationFloating {
          width: 160px;
          right: 4px;
          bottom: 90px;
        }

        .floatingCircle {
          width: 37px;
          height: 37px;
          flex: 0 0 37px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: #fff0f0;
          color: #e5484d;
        }

        .floatingCircle :global(svg) {
          width: 16px;
          height: 16px;
        }

        .locationCircle {
          background: #eef2f7;
          color: #111827;
        }

        .liveFloating span,
        .liveFloating strong,
        .locationFloating span,
        .locationFloating strong {
          display: block;
        }

        .liveFloating span,
        .locationFloating span {
          color: #9ba2ac;
          font-size: 5.5px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .liveFloating strong,
        .locationFloating strong {
          margin-top: 3px;
          color: #323b48;
          font-size: 8px;
        }

        .liveFloating > i {
          width: 7px;
          height: 7px;
          margin-left: auto;
          border-radius: 50%;
          background: #22a06b;
        }

        /* ================= PRODUCTS ================= */

        .productsSection {
          padding: 95px 0;
          background: #fbfbfa;
        }

        .productsHeader {
          display: grid;
          grid-template-columns: 1fr 0.55fr;
          align-items: end;
          gap: 80px;
        }

        .productsHeader h2,
        .simpleHeader h2,
        .featureHeader h2 {
          margin: 12px 0 0;
          color: #111827;
          font-size:
            clamp(34px, 4.5vw, 49px);
          line-height: 1.05;
          letter-spacing: -2.6px;
          font-weight: 700;
        }

        .productsHeader > p {
          margin: 0;
          color: #6f7783;
          font-size: 12px;
          line-height: 1.7;
        }

        .productGrid {
          margin-top: 42px;
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 9px;
        }

        .productCard {
          min-height: 315px;
          position: relative;
          overflow: hidden;
          border-radius: 19px;
          background: #20242a;
          box-shadow:
            0 12px 35px rgba(17, 24, 39, 0.07);
        }

        .productCard img {
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0;
          object-fit: cover;
          transition: transform 0.45s ease;
        }

        .productCard:hover img {
          transform: scale(1.045);
        }

        .productShade {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              180deg,
              rgba(10, 14, 20, 0.02) 20%,
              rgba(10, 14, 20, 0.12) 50%,
              rgba(8, 11, 16, 0.82) 100%
            );
        }

        .productQrTag {
          width: 43px;
          height: 43px;
          position: absolute;
          top: 13px;
          right: 13px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.92);
          box-shadow:
            0 7px 18px rgba(0, 0, 0, 0.12);
          backdrop-filter: blur(10px);
        }

        .productLabel {
          position: absolute;
          left: 17px;
          right: 17px;
          bottom: 17px;
        }

        .productLabel strong,
        .productLabel span {
          display: block;
        }

        .productLabel strong {
          color: white;
          font-size: 14px;
          letter-spacing: -0.2px;
        }

        .productLabel span {
          margin-top: 5px;
          color: #d2d7de;
          font-size: 5.5px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .profilesNotice {
          margin-top: 14px;
          padding: 17px 19px;
          display: grid;
          grid-template-columns:
            auto auto 1fr auto;
          align-items: center;
          gap: 13px;
          border: 1px solid #e3e5e8;
          border-radius: 15px;
          background: white;
        }

        .noticeIcon {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: #f0f2f5;
          color: #111827;
        }

        .noticeIcon :global(svg) {
          width: 17px;
          height: 17px;
        }

        .profilesNotice > div:nth-child(2) span,
        .profilesNotice > div:nth-child(2) strong {
          display: block;
        }

        .profilesNotice > div:nth-child(2) span {
          color: #9aa1ab;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1.1px;
        }

        .profilesNotice > div:nth-child(2) strong {
          margin-top: 3px;
          color: #343d4a;
          font-size: 10px;
        }

        .profilesNotice > p {
          margin: 0;
          color: #7a828e;
          font-size: 9px;
          line-height: 1.5;
        }

        .profilesNotice > a {
          min-height: 38px;
          padding: 0 13px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border-radius: 9px;
          background: #111827;
          color: white;
          font-size: 8.5px;
          font-weight: 800;
          text-decoration: none;
        }

        .profilesNotice > a :global(svg) {
          width: 11px;
          height: 11px;
        }

        /* ================= HOW ================= */

        .howSection {
          padding: 100px 0;
          background: #f1f1ef;
        }

        .simpleHeader {
          max-width: 730px;
        }

        .steps {
          margin-top: 50px;
          display: grid;
          grid-template-columns:
            1fr auto 1fr auto 1fr auto 1fr;
          align-items: center;
        }

        .step {
          min-width: 0;
        }

        .stepNumber {
          color: #a9afb8;
          font-size: 7px;
          font-weight: 900;
        }

        .stepIcon {
          width: 46px;
          height: 46px;
          margin-top: 14px;
          display: grid;
          place-items: center;
          border: 1px solid #dce0e4;
          border-radius: 13px;
          background: #fbfbfa;
          color: #111827;
        }

        .stepIcon :global(svg) {
          width: 18px;
          height: 18px;
        }

        .qrLetters {
          font-size: 9px;
          font-weight: 900;
        }

        .step > strong {
          display: block;
          margin-top: 17px;
          color: #28313d;
          font-size: 11px;
        }

        .step > p {
          margin: 6px 0 0;
          color: #7b838f;
          font-size: 8.5px;
          line-height: 1.6;
        }

        .stepArrow {
          width: 50px;
          margin: 0 16px;
          color: #c4c8ce;
        }

        .stepArrow :global(svg) {
          width: 17px;
          height: 17px;
        }

        /* ================= FEATURES ================= */

        .featuresSection {
          padding: 95px 0;
          background: #ffffff;
        }

        .featureHeader {
          max-width: 720px;
        }

        .featureGrid {
          margin-top: 43px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          overflow: hidden;
          border-top: 1px solid #e2e5e8;
          border-bottom: 1px solid #e2e5e8;
        }

        .featureCard {
          min-height: 205px;
          padding: 23px 20px;
          border-right: 1px solid #e2e5e8;
        }

        .featureCard:last-child {
          border-right: 0;
        }

        .featureCardTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .featureCardTop > span {
          color: #aeb4bc;
          font-size: 7px;
          font-weight: 900;
        }

        .featureIcon {
          width: 37px;
          height: 37px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: #f3f4f5;
          color: #111827;
        }

        .featureIcon :global(svg) {
          width: 16px;
          height: 16px;
        }

        .featureCard h3 {
          margin: 38px 0 0;
          color: #222b36;
          font-size: 12px;
        }

        .featureCard p {
          margin: 8px 0 0;
          color: #7b838e;
          font-size: 9px;
          line-height: 1.65;
        }

        /* ================= EMERGENCY STRIP ================= */

        .emergencyStripSection {
          padding: 70px 0;
          background: #f7f7f5;
        }

        .emergencyStrip {
          min-height: 130px;
          padding: 20px 22px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 16px;
          border: 1px solid #efd6d8;
          border-radius: 20px;
          background:
            linear-gradient(
              110deg,
              #fff6f6,
              #ffffff
            );
        }

        .stripSymbol {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #e5484d;
          color: white;
          font-size: 31px;
          line-height: 1;
        }

        .stripCopy span,
        .stripCopy strong,
        .stripCopy p {
          display: block;
        }

        .stripCopy span {
          color: #e5484d;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1.3px;
        }

        .stripCopy strong {
          margin-top: 5px;
          color: #313a46;
          font-size: 12px;
        }

        .stripCopy p {
          margin: 5px 0 0;
          color: #7f8792;
          font-size: 8px;
        }

        .emergencyStrip > a {
          min-height: 39px;
          padding: 0 13px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid #e5484d;
          border-radius: 9px;
          color: #e5484d;
          font-size: 8px;
          font-weight: 850;
          text-decoration: none;
        }

        .emergencyStrip > a :global(svg) {
          width: 11px;
          height: 11px;
        }

        /* ================= CONTACT ================= */

        .contactSection {
          padding: 76px 0;
          background: #ececea;
        }

        .contactInner {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 55px;
        }

        .contactInner h2 {
          margin: 11px 0 9px;
          color: #111827;
          font-size: 36px;
          letter-spacing: -1.8px;
        }

        .contactInner p {
          max-width: 620px;
          margin: 0;
          color: #6f7782;
          font-size: 11px;
          line-height: 1.7;
        }

        .contactButton {
          min-height: 43px;
          padding: 0 15px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border-radius: 10px;
          background: #111827;
          color: white;
          font-size: 9px;
          font-weight: 850;
          text-decoration: none;
        }

        .contactButton :global(svg) {
          width: 11px;
          height: 11px;
        }

        /* ================= FOOTER ================= */

        .footer {
          background: #11151b;
          color: white;
        }

        .footerInner {
          max-width: 1220px;
          min-height: 220px;
          margin: auto;
          padding: 47px 26px;
          display: grid;
          grid-template-columns:
            1.5fr 0.7fr 0.7fr 0.7fr;
          gap: 50px;
        }

        .footerBrand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .footerBrandIcon {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: #e5484d;
          color: white;
        }

        .footerBrandIcon :global(svg) {
          width: 20px;
          height: 20px;
        }

        .footerBrand strong,
        .footerBrand span {
          display: block;
        }

        .footerBrand strong {
          color: white;
          font-size: 14px;
        }

        .footerBrand span {
          margin-top: 3px;
          color: #737e8d;
          font-size: 5px;
          font-weight: 900;
          letter-spacing: 1.6px;
        }

        .footerMain > p {
          max-width: 320px;
          margin: 17px 0 0;
          color: #7d8795;
          font-size: 9px;
          line-height: 1.7;
        }

        .footerColumn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 11px;
        }

        .footerHeading {
          margin-bottom: 4px;
          color: #e5484d !important;
          font-size: 6px !important;
          font-weight: 900 !important;
          letter-spacing: 1.2px;
        }

        .footerColumn a,
        .footerColumn > span {
          color: #8f98a5;
          font-size: 8px;
          text-decoration: none;
        }

        .footerRight strong {
          color: white;
          font-size: 15px;
        }

        .footerRight span {
          color: #65707f;
        }

        /* ================= TABLET ================= */

        @media (max-width: 980px) {
          .heroInner {
            grid-template-columns: 1fr;
            padding: 60px 0 75px;
          }

          .emergencyHero {
            max-width: 620px;
          }

          .phoneVisual {
            margin-top: 20px;
          }

          .productsHeader {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .productGrid {
            grid-template-columns: repeat(3, 1fr);
          }

          .productCard {
            min-height: 360px;
          }

          .profilesNotice {
            grid-template-columns: auto 1fr auto;
          }

          .profilesNotice > p {
            grid-column: 2 / -1;
          }

          .steps {
            grid-template-columns: repeat(2, 1fr);
            gap: 28px;
          }

          .stepArrow {
            display: none;
          }

          .featureGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .featureCard:nth-child(2) {
            border-right: 0;
          }

          .featureCard:nth-child(-n + 2) {
            border-bottom: 1px solid #e2e5e8;
          }

          .contactInner {
            align-items: flex-start;
            flex-direction: column;
          }

          .footerInner {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* ================= MOBILE ================= */

        @media (max-width: 650px) {
          .header {
            width: calc(100% - 18px);
            min-height: 70px;
          }

          .brandCopy span,
          .language {
            display: none;
          }

          .brandIcon {
            width: 38px;
            height: 38px;
          }

          .brandCopy strong {
            font-size: 15px;
          }

          .adminLink {
            padding: 0 8px;
          }

          .adminLink span {
            display: none;
          }

          .accountButton,
          .loginLink {
            min-height: 35px;
            padding: 0 9px;
            font-size: 8px;
          }

          .heroInner,
          .sectionShell {
            width: calc(100% - 28px);
          }

          .hero {
            min-height: unset;
          }

          .heroInner {
            min-height: unset;
            padding: 45px 0 65px;
          }

          .emergencyHero {
            padding: 25px 20px;
          }

          .emergencyHero h1 {
            font-size: 30px;
            letter-spacing: -1.6px;
          }

          .heroActions {
            flex-direction: column;
            align-items: stretch;
          }

          .primaryCta,
          .secondaryCta {
            width: 100%;
          }

          .phoneVisual {
            min-height: 520px;
          }

          .phoneOuter {
            width: 245px;
            height: 490px;
          }

          .screenQr {
            width: 165px;
            height: 165px;
          }

          .liveFloating {
            width: 190px;
            right: -5px;
            top: 70px;
          }

          .locationFloating {
            right: -4px;
            bottom: 65px;
          }

          .productsSection,
          .howSection,
          .featuresSection {
            padding: 74px 0;
          }

          .productsHeader h2,
          .simpleHeader h2,
          .featureHeader h2 {
            font-size: 34px;
            letter-spacing: -2px;
          }

          .productGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .productCard {
            min-height: 270px;
          }

          .profilesNotice {
            grid-template-columns: auto 1fr;
          }

          .profilesNotice > p {
            grid-column: 1 / -1;
          }

          .profilesNotice > a {
            grid-column: 1 / -1;
            justify-content: center;
          }

          .steps,
          .featureGrid {
            grid-template-columns: 1fr;
          }

          .featureCard,
          .featureCard:nth-child(2) {
            border-right: 0;
            border-bottom: 1px solid #e2e5e8;
          }

          .featureCard:last-child {
            border-bottom: 0;
          }

          .emergencyStripSection {
            padding: 52px 0;
          }

          .emergencyStrip {
            grid-template-columns: auto 1fr;
          }

          .emergencyStrip > a {
            grid-column: 1 / -1;
            justify-content: center;
          }

          .contactSection {
            padding: 60px 0;
          }

          .contactButton {
            width: 100%;
            justify-content: center;
          }

          .footerInner {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

/* ==========================================================
   ICONS
========================================================== */

function QrLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="15" width="6" height="6" rx="1" />
      <path d="M14 14h3v3h3v4h-6z" />
      <path d="M12 4v4M12 12v2M11 18h2M18 12h3" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21c.8-4.1 3.3-6.3 7.5-6.3s6.7 2.2 7.5 6.3" />
    </svg>
  );
}

function AdminIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M12 2.8 19 6v5.3c0 4.6-2.4 7.7-7 9.9-4.6-2.2-7-5.3-7-9.9V6z" />
      <circle cx="12" cy="10" r="2.2" />
      <path d="M8.7 16c.6-1.8 1.7-2.7 3.3-2.7s2.7.9 3.3 2.7" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m14 7 5 5-5 5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M12 2.5 19 6v5.3c0 4.7-2.4 7.8-7 10.2-4.6-2.4-7-5.5-7-10.2V6z" />
      <path d="m8.8 12 2.1 2.1 4.5-4.5" />
    </svg>
  );
}

function ScanIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" />
      <path d="M7 12h10" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M4 5.5h16v11H9l-5 4z" />
      <path d="M8 10h8M8 13h5" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" />
      <path d="M7.8 12h2l1-2.2 2.1 4.4 1.2-2.2h2" />
    </svg>
  );
}

function RewardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M6 9h12v11H6z" />
      <path d="M4 6h16v3H4z" />
      <path d="M12 6v14" />
      <path d="M12 6c-1.2-3-5-3.4-5.5-.9-.4 2 2.3 2.3 5.5.9ZM12 6c1.2-3 5-3.4 5.5-.9.4 2-2.3 2.3-5.5.9Z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function QrCode() {
  const dark = [
    0, 1, 2, 5, 6,
    7, 9, 11, 13,
    14, 16, 18, 20,
    21, 22, 24, 26,
    27, 28, 30, 32,
    34, 35, 36, 38,
    40, 42, 43, 44,
    46, 47, 48,
  ];

  return (
    <div
      style={{
        width: 145,
        height: 145,
        padding: 8,
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: 4,
        background: "#ffffff",
      }}
    >
      {Array.from({ length: 49 }).map((_, index) => (
        <i
          key={index}
          style={{
            display: "block",
            borderRadius: 1,
            background: dark.includes(index)
              ? "#111827"
              : "#e4e7ec",
          }}
        />
      ))}
    </div>
  );
}

function MiniQr() {
  const dark = [
    0, 1, 2,
    4, 6,
    7, 8,
    10, 12,
    14, 15,
    17, 18,
    20, 21,
    22, 24,
  ];

  return (
    <div
      style={{
        width: 27,
        height: 27,
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 1.5,
      }}
    >
      {Array.from({ length: 25 }).map((_, index) => (
        <i
          key={index}
          style={{
            display: "block",
            background: dark.includes(index)
              ? "#111827"
              : "#e0e3e7",
          }}
        />
      ))}
    </div>
  );
}
