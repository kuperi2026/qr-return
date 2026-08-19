"use client";

import { useEffect, useState } from "react";
import SupportLauncher from "./components/SupportLauncher";
import { supabase } from "@/lib/supabase";

type Language = "ka" | "en";
type ProtectType =
  | "dog"
  | "cat"
  | "keys"
  | "wallet"
  | "luggage"
  | "bag";

const protectionItems: {
  type: ProtectType;
  ka: string;
  en: string;
}[] = [
  { type: "dog", ka: "ძაღლი", en: "Dog" },
  { type: "cat", ka: "კატა", en: "Cat" },
  { type: "keys", ka: "გასაღები", en: "Keys" },
  { type: "wallet", ka: "საფულე", en: "Wallet" },
  { type: "luggage", ka: "ჩემოდანი", en: "Luggage" },
  { type: "bag", ka: "ჩანთა", en: "Bag" },
];

const features = [
  {
    number: "01",
    ka: "Live Chat",
    en: "Live Chat",
    kaText:
      "მპოვნელმა პირდაპირ QR RETURN-ის საშუალებით შეიძლება მოგწეროთ.",
    enText:
      "A finder can message you directly through QR RETURN.",
  },
  {
    number: "02",
    ka: "ლოკაციის გაზიარება",
    en: "Location Sharing",
    kaText:
      "მპოვნელმა ერთი მოქმედებით შეიძლება გაგიზიაროთ ნივთის ან ცხოველის მდებარეობა.",
    enText:
      "A finder can share the location of your pet or item in one step.",
  },
  {
    number: "03",
    ka: "მპოვნელის ჯილდო",
    en: "Finder Reward",
    kaText:
      "სურვილის შემთხვევაში მიუთითეთ ჯილდო უსაფრთხო დაბრუნებისთვის.",
    enText:
      "Optionally offer a reward for a safe return.",
  },
  {
    number: "04",
    ka: "Privacy Control",
    en: "Privacy Control",
    kaText:
      "თქვენ თავად აკონტროლებთ რა ინფორმაცია გამოჩნდება მპოვნელისთვის.",
    enText:
      "You control exactly what information a finder can see.",
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
      {/* HEADER */}

      <header className="header">
        <a href="/" className="brand">
          <div className="brandLogo">
            <QrLogo />
          </div>

          <div className="brandText">
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

                <a href="/login" className="loginButton">
                  {ka ? "შესვლა" : "Sign In"}
                </a>
              </>
            )}
          </nav>

          <div className="languageSwitch">
            <button
              type="button"
              className={ka ? "active" : ""}
              onClick={() => setLanguage("ka")}
            >
              GEO
            </button>

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

      {/* HERO */}

      <section className="hero">
        <div className="heroBackground heroBgOne" />
        <div className="heroBackground heroBgTwo" />

        <div className="heroInner">
          <div className="heroContent">
            {/* EMERGENCY MINI CARD */}

            <div className="emergencyMiniCard">
              <div className="emergencyMiniIcon">+</div>

              <div className="emergencyMiniCopy">
                <span>QR RETURN EMERGENCY ID</span>

                <strong>
                  {ka
                    ? "საგანგებო ინფორმაცია — ერთი სკანით"
                    : "Essential information — one scan away"}
                </strong>

                <small>
                  {ka
                    ? "Emergency Contact • Medical Info • No App"
                    : "Emergency Contact • Medical Info • No App"}
                </small>
              </div>

              <ArrowIcon />
            </div>

            <div className="eyebrow">
              SMART LOST &amp; FOUND
            </div>

            <h1>
              {ka ? (
                <>
                  დაკარგულ ნივთსა თუ
                  <br />
                  ცხოველს ჰქონდეს
                  <br />
                  <span>შენამდე დაბრუნების გზა.</span>
                </>
              ) : (
                <>
                  Give lost pets and
                  <br />
                  personal items
                  <br />
                  <span>a clear way back to you.</span>
                </>
              )}
            </h1>

            <p className="heroDescription">
              {ka
                ? "QR RETURN აკავშირებს მპოვნელს და მფლობელს სწრაფად, უსაფრთხოდ და დამატებითი აპლიკაციის გარეშე."
                : "QR RETURN connects finders and owners quickly, securely and without requiring another app."}
            </p>

            <div className="heroActions">
              <a
                href={
                  isLoggedIn
                    ? "/account"
                    : "/account/register"
                }
                className="primaryButton"
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

              <a href="#how" className="secondaryButton">
                {ka ? "როგორ მუშაობს" : "How it works"}
              </a>
            </div>

            <div className="heroProof">
              <div>
                <ShieldIcon />
                <span>
                  {ka
                    ? "პირადი მონაცემების კონტროლი"
                    : "Privacy control"}
                </span>
              </div>

              <div>
                <ScanIcon />
                <span>
                  {ka ? "აპის გარეშე" : "No app required"}
                </span>
              </div>

              <div>
                <ChatIcon />
                <span>Live Chat</span>
              </div>
            </div>
          </div>

          {/* PHONE PRODUCT VISUAL */}

          <div className="phoneStage">
            <div className="phoneGlow" />

            <div className="phone">
              <div className="phoneNotch" />

              <div className="phoneScreen">
                <div className="phoneHeader">
                  <div className="phoneBrand">
                    <div className="phoneBrandLogo">
                      <QrLogo />
                    </div>

                    <div>
                      <span>QR RETURN</span>
                      <strong>
                        {ka ? "დაცული პროფილი" : "Protected profile"}
                      </strong>
                    </div>
                  </div>

                  <div className="activeBadge">
                    <i />
                    ACTIVE
                  </div>
                </div>

                <div className="finderProfile">
                  <div className="profileAvatar">
                    <DogIcon />
                  </div>

                  <div className="profileCopy">
                    <span>
                      {ka ? "დაკარგული ძაღლი" : "LOST DOG"}
                    </span>

                    <strong>Toby</strong>

                    <p>
                      {ka
                        ? "მე დავიკარგე. გთხოვთ დაუკავშირდეთ ჩემს პატრონს."
                        : "I am lost. Please contact my owner."}
                    </p>
                  </div>
                </div>

                <div className="phoneActions">
                  <div className="phoneAction primary">
                    <ChatIcon />
                    <span>Live Chat</span>
                  </div>

                  <div className="phoneAction">
                    <LocationIcon />
                    <span>
                      {ka ? "ლოკაცია" : "Location"}
                    </span>
                  </div>
                </div>

                <div className="phonePrivacy">
                  <ShieldIcon />

                  <div>
                    <span>
                      {ka
                        ? "მფლობელის მონაცემები დაცულია"
                        : "Owner information protected"}
                    </span>

                    <small>
                      {ka
                        ? "ნაჩვენებია მხოლოდ ნებადართული ინფორმაცია"
                        : "Only approved information is visible"}
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <div className="floatingFinder">
              <div className="floatingIcon">
                <ChatIcon />
              </div>

              <div>
                <span>LIVE CHAT</span>

                <strong>
                  {ka
                    ? "მპოვნელმა მოგწერათ"
                    : "Finder sent a message"}
                </strong>
              </div>

              <i />
            </div>

            <div className="floatingMap">
              <LocationIcon />

              <div>
                <span>LOCATION</span>
                <strong>
                  {ka ? "გაზიარებულია" : "Shared"}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USE CASES */}

      <section className="useCases">
        <div className="sectionShell">
          <div className="useCasesHeader">
            <div>
              <div className="sectionLabel">
                PROTECT WHAT MATTERS
              </div>

              <h2>
                {ka
                  ? "ერთი ანგარიში. ბევრი შესაძლებლობა."
                  : "One account. Many possibilities."}
              </h2>
            </div>

            <p>
              {ka
                ? "QR RETURN შეგიძლიათ გამოიყენოთ ცხოველებისთვის და ყოველდღიური ნივთებისთვის. რეალური პროფილის შექმნა ხდება მხოლოდ თქვენი ანგარიშის შიგნით."
                : "Use QR RETURN for pets and everyday items. Actual profiles are created only inside your account."}
            </p>
          </div>

          <div className="useCaseRail">
            {protectionItems.map((item, index) => (
              <div className="useCaseItem" key={item.type}>
                <div className="useCaseTop">
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="useCaseIcon">
                    <ProtectionIcon type={item.type} />
                  </div>
                </div>

                <strong>
                  {ka ? item.ka : item.en}
                </strong>
              </div>
            ))}
          </div>

          <div className="accountBar">
            <div className="accountBarIcon">
              <UserIcon />
            </div>

            <div className="accountBarCopy">
              <span>
                {ka
                  ? "OWNER ACCOUNT"
                  : "OWNER ACCOUNT"}
              </span>

              <strong>
                {ka
                  ? "ყველა პროფილი ერთ სივრცეში"
                  : "All profiles in one place"}
              </strong>
            </div>

            <p>
              {ka
                ? "შექმენით, მართეთ და განაახლეთ თქვენი QR პროფილები ერთი ანგარიშიდან."
                : "Create, manage and update all your QR profiles from one account."}
            </p>

            <a
              href={
                isLoggedIn
                  ? "/account"
                  : "/account/register"
              }
            >
              <span>
                {isLoggedIn
                  ? ka
                    ? "ჩემი ანგარიში"
                    : "My Account"
                  : ka
                    ? "ანგარიშის შექმნა"
                    : "Create Account"}
              </span>

              <ArrowIcon />
            </a>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}

      <section id="how" className="howSection">
        <div className="sectionShell">
          <div className="howHeader">
            <div className="sectionLabel">
              SIMPLE BY DESIGN
            </div>

            <h2>
              {ka
                ? "მარტივი გზა დაკარგულიდან დაბრუნებამდე."
                : "A simple path from lost to returned."}
            </h2>

            <p>
              {ka
                ? "QR RETURN შექმნილია იმისთვის, რომ მფლობელმაც და მპოვნელმაც ზედმეტი ნაბიჯების გარეშე შეძლონ დაკავშირება."
                : "QR RETURN is designed to help owners and finders connect without unnecessary steps."}
            </p>
          </div>

          <div className="steps">
            <div className="step">
              <span>01</span>

              <div className="stepIcon">
                <UserIcon />
              </div>

              <strong>
                {ka
                  ? "შექმენით ანგარიში"
                  : "Create account"}
              </strong>

              <p>
                {ka
                  ? "ერთი Owner Account თქვენი ყველა QR პროფილისთვის."
                  : "One Owner Account for all QR profiles."}
              </p>
            </div>

            <div className="stepLine" />

            <div className="step">
              <span>02</span>

              <div className="stepIcon">
                <PlusIcon />
              </div>

              <strong>
                {ka
                  ? "დაამატეთ პროფილი"
                  : "Add profile"}
              </strong>

              <p>
                {ka
                  ? "აირჩიეთ ცხოველი, ნივთი ან Emergency ID."
                  : "Choose a pet, item or Emergency ID."}
              </p>
            </div>

            <div className="stepLine" />

            <div className="step">
              <span>03</span>

              <div className="stepIcon qrIcon">
                QR
              </div>

              <strong>
                {ka
                  ? "მიამაგრეთ QR"
                  : "Attach QR"}
              </strong>

              <p>
                {ka
                  ? "უნიკალური QR უკავშირდება კონკრეტულ პროფილს."
                  : "A unique QR connects to one specific profile."}
              </p>
            </div>

            <div className="stepLine" />

            <div className="step">
              <span>04</span>

              <div className="stepIcon">
                <ChatIcon />
              </div>

              <strong>
                {ka
                  ? "მპოვნელი გიკავშირდებათ"
                  : "Finder contacts you"}
              </strong>

              <p>
                {ka
                  ? "Live Chat, ლოკაციის გაზიარება და თქვენ მიერ არჩეული საკონტაქტო გზა."
                  : "Live Chat, location sharing and your chosen contact options."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}

      <section className="featuresSection">
        <div className="sectionShell">
          <div className="featureHeader">
            <div className="sectionLabel lightLabel">
              BUILT AROUND CONTROL
            </div>

            <h2>
              {ka
                ? "მარტივი მპოვნელისთვის. კონტროლირებადი თქვენთვის."
                : "Simple for the finder. Controlled by you."}
            </h2>
          </div>

          <div className="featureGrid">
            {features.map((feature) => (
              <article
                className="featureItem"
                key={feature.number}
              >
                <div className="featureTop">
                  <span>{feature.number}</span>

                  <div className="featureIcon">
                    {feature.number === "01" && <ChatIcon />}
                    {feature.number === "02" && <LocationIcon />}
                    {feature.number === "03" && <RewardIcon />}
                    {feature.number === "04" && <ShieldIcon />}
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

      {/* EMERGENCY INFO STRIP */}

      <section className="emergencyInfo">
        <div className="sectionShell">
          <div className="emergencyInfoCard">
            <div className="emergencyInfoMark">
              +
            </div>

            <div className="emergencyInfoCopy">
              <span>QR RETURN EMERGENCY ID</span>

              <strong>
                {ka
                  ? "საგანგებო ინფორმაცია მაშინ, როცა წამებიც მნიშვნელოვანია."
                  : "Essential information when every second matters."}
              </strong>

              <p>
                {ka
                  ? "Emergency Contact, Medical Information და Privacy Control ერთ QR პროფილში."
                  : "Emergency Contact, Medical Information and Privacy Control in one QR profile."}
              </p>
            </div>

            <a
              href={
                isLoggedIn
                  ? "/account"
                  : "/account/register"
              }
            >
              {ka
                ? "იხილე ანგარიშში"
                : "View in account"}{" "}
              <ArrowIcon />
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT */}

      <section id="contact" className="contact">
        <div className="contactInner">
          <div>
            <div className="sectionLabel">
              CONTACT
            </div>

            <h2>
              {ka ? "დაგვიკავშირდით" : "Contact us"}
            </h2>

            <p>
              {ka
                ? "კითხვა გაქვთ QR RETURN-ის, ანგარიშის ან Emergency ID-ის შესახებ? მოგვწერეთ."
                : "Questions about QR RETURN, accounts or Emergency ID? Send us a message."}
            </p>
          </div>

          <a
            href="mailto:hello@qrreturn.com"
            className="contactButton"
          >
            <span>
              {ka ? "მოგვწერეთ" : "Email us"}
            </span>

            <ArrowIcon />
          </a>
        </div>
      </section>

      {/* LIVE CHAT */}

      <SupportLauncher language={language} />

      {/* FOOTER */}

      <footer className="footer">
        <div className="footerInner">
          <div className="footerBrand">
            <div className="footerLogo">
              <QrLogo />
            </div>

            <div>
              <strong>QR RETURN</strong>
              <span>SMART LOST &amp; FOUND</span>
            </div>
          </div>

          <div className="footerLinks">
            <a href="#how">
              {ka ? "როგორ მუშაობს" : "How it works"}
            </a>

            <a href="#contact">
              {ka ? "კონტაქტი" : "Contact"}
            </a>

            <span>
              {ka ? "კონფიდენციალურობა" : "Privacy"}
            </span>

            <span>
              {ka ? "პირობები" : "Terms"}
            </span>
          </div>

          <div className="copyright">
            © 2026 QR RETURN
          </div>
        </div>
      </footer>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          background: #ffffff;
        }

        .page {
          min-height: 100vh;
          overflow: hidden;
          background: #ffffff;
          color: #0b1220;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Arial,
            sans-serif;
        }

        /* HEADER */

        .header {
          width: calc(100% - 48px);
          max-width: 1240px;
          min-height: 84px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          position: relative;
          z-index: 30;
          border-bottom: 1px solid #edf0f4;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
          text-decoration: none;
        }

        .brandLogo {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #0b5fff;
          color: white;
          box-shadow:
            0 8px 22px
            rgba(11, 95, 255, 0.18);
        }

        .brandLogo :global(svg) {
          width: 23px;
          height: 23px;
        }

        .brandText strong,
        .brandText span {
          display: block;
        }

        .brandText strong {
          color: #0b5fff;
          font-size: 18px;
          font-weight: 850;
          letter-spacing: -0.6px;
        }

        .brandText span {
          margin-top: 3px;
          color: #98a2b3;
          font-size: 6.5px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .headerRight,
        .nav,
        .languageSwitch {
          display: flex;
          align-items: center;
        }

        .headerRight {
          gap: 12px;
        }

        .nav {
          gap: 7px;
        }

        .adminLink,
        .accountButton,
        .loginButton {
          min-height: 38px;
          padding: 0 13px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 10px;
          font-weight: 850;
          white-space: nowrap;
        }

        .adminLink {
          color: #5946c6;
          background: #f6f4ff;
          border: 1px solid #e3defe;
        }

        .adminLink :global(svg) {
          width: 13px;
          height: 13px;
        }

        .accountButton {
          color: white;
          background: #0b5fff;
          border: 1px solid #0b5fff;
          box-shadow:
            0 6px 17px
            rgba(11, 95, 255, 0.14);
        }

        .accountButton :global(svg) {
          width: 13px;
          height: 13px;
        }

        .loginButton {
          color: #344054;
          background: white;
          border: 1px solid #e4e7ec;
        }

        .languageSwitch {
          padding: 3px;
          border-radius: 9px;
          background: #f2f4f7;
        }

        .languageSwitch button {
          width: 40px;
          height: 30px;
          border: 0;
          border-radius: 7px;
          background: transparent;
          color: #98a2b3;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.6px;
          cursor: pointer;
        }

        .languageSwitch button.active {
          color: #0b5fff;
          background: white;
          box-shadow:
            0 2px 7px
            rgba(16, 24, 40, 0.07);
        }

        /* COMMON */

        .sectionShell {
          width: calc(100% - 48px);
          max-width: 1160px;
          margin: auto;
        }

        .sectionLabel,
        .eyebrow {
          color: #0b5fff;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 2.3px;
        }

        /* HERO */

        .hero {
          min-height: 650px;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid #edf0f4;
        }

        .heroInner {
          width: calc(100% - 48px);
          max-width: 1240px;
          min-height: 650px;
          margin: auto;
          display: grid;
          grid-template-columns: 1fr 0.92fr;
          align-items: center;
          gap: 70px;
          position: relative;
          z-index: 2;
        }

        .heroBackground {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .heroBgOne {
          width: 520px;
          height: 520px;
          right: -180px;
          top: -230px;
          background:
            radial-gradient(
              circle,
              rgba(11, 95, 255, 0.1),
              rgba(11, 95, 255, 0)
            );
        }

        .heroBgTwo {
          width: 380px;
          height: 380px;
          left: -190px;
          bottom: -220px;
          background:
            radial-gradient(
              circle,
              rgba(81, 69, 205, 0.06),
              rgba(81, 69, 205, 0)
            );
        }

        .heroContent {
          max-width: 650px;
        }

        .emergencyMiniCard {
          width: min(100%, 425px);
          min-height: 76px;
          margin-bottom: 28px;
          padding: 12px 14px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 11px;
          border: 1px solid #f1d8db;
          border-radius: 16px;
          background:
            linear-gradient(
              110deg,
              #fffafa,
              #ffffff
            );
          box-shadow:
            0 10px 30px
            rgba(60, 33, 38, 0.035);
        }

        .emergencyMiniIcon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #e5484d;
          color: white;
          font-size: 25px;
          line-height: 1;
        }

        .emergencyMiniCopy span,
        .emergencyMiniCopy strong,
        .emergencyMiniCopy small {
          display: block;
        }

        .emergencyMiniCopy span {
          color: #b4232d;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1.3px;
        }

        .emergencyMiniCopy strong {
          margin-top: 3px;
          color: #344054;
          font-size: 10px;
          line-height: 1.35;
        }

        .emergencyMiniCopy small {
          margin-top: 3px;
          color: #98a2b3;
          font-size: 7px;
        }

        .emergencyMiniCard :global(svg) {
          width: 13px;
          height: 13px;
          color: #e5484d;
        }

        .hero h1 {
          margin: 18px 0 0;
          color: #0a1220;
          font-size:
            clamp(42px, 5vw, 61px);
          line-height: 1.04;
          letter-spacing: -3.2px;
          font-weight: 760;
        }

        .hero h1 span {
          color: #0b5fff;
        }

        .heroDescription {
          max-width: 580px;
          margin: 22px 0 0;
          color: #667085;
          font-size: 14px;
          line-height: 1.72;
        }

        .heroActions {
          margin-top: 28px;
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .primaryButton,
        .secondaryButton {
          min-height: 48px;
          padding: 0 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border-radius: 11px;
          font-size: 10px;
          font-weight: 850;
          text-decoration: none;
        }

        .primaryButton {
          color: white;
          background: #0b5fff;
          box-shadow:
            0 8px 22px
            rgba(11, 95, 255, 0.16);
        }

        .primaryButton :global(svg) {
          width: 13px;
          height: 13px;
        }

        .secondaryButton {
          color: #344054;
          background: white;
          border: 1px solid #e4e7ec;
        }

        .heroProof {
          margin-top: 27px;
          display: flex;
          flex-wrap: wrap;
          gap: 17px;
        }

        .heroProof > div {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #7b8797;
          font-size: 8px;
          font-weight: 720;
        }

        .heroProof :global(svg) {
          width: 13px;
          height: 13px;
          color: #0b5fff;
        }

        /* PHONE */

        .phoneStage {
          min-height: 540px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .phoneGlow {
          width: 455px;
          height: 455px;
          position: absolute;
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              rgba(11, 95, 255, 0.11),
              rgba(11, 95, 255, 0.02) 50%,
              transparent 72%
            );
        }

        .phone {
          width: 272px;
          height: 525px;
          padding: 9px;
          position: relative;
          z-index: 3;
          border-radius: 43px;
          background: #0a111e;
          box-shadow:
            0 42px 95px
              rgba(17, 39, 70, 0.18),
            0 3px 10px
              rgba(16, 24, 40, 0.08);
          transform:
            perspective(1300px)
            rotateY(-4deg)
            rotateX(1deg);
        }

        .phoneNotch {
          width: 75px;
          height: 18px;
          position: absolute;
          top: 15px;
          left: 50%;
          z-index: 5;
          border-radius: 999px;
          background: #0a111e;
          transform: translateX(-50%);
        }

        .phoneScreen {
          height: 100%;
          padding: 32px 17px 18px;
          border-radius: 35px;
          background:
            linear-gradient(
              180deg,
              #ffffff 0%,
              #f7faff 100%
            );
        }

        .phoneHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .phoneBrand {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .phoneBrandLogo {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: #0b5fff;
          color: white;
        }

        .phoneBrandLogo :global(svg) {
          width: 16px;
          height: 16px;
        }

        .phoneBrand span,
        .phoneBrand strong {
          display: block;
        }

        .phoneBrand span {
          color: #0b5fff;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 0.8px;
        }

        .phoneBrand strong {
          margin-top: 2px;
          color: #344054;
          font-size: 8px;
        }

        .activeBadge {
          padding: 5px 6px;
          display: flex;
          align-items: center;
          gap: 4px;
          border-radius: 999px;
          background: #ecfdf3;
          color: #027a48;
          font-size: 5.5px;
          font-weight: 900;
          letter-spacing: 0.6px;
        }

        .activeBadge i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #12b76a;
        }

        .finderProfile {
          margin-top: 28px;
          padding: 20px 15px;
          display: flex;
          gap: 12px;
          border: 1px solid #e8edf3;
          border-radius: 17px;
          background: white;
          box-shadow:
            0 8px 22px
            rgba(20, 40, 70, 0.04);
        }

        .profileAvatar {
          width: 58px;
          height: 58px;
          flex: 0 0 58px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          background: #eef4ff;
          color: #26364c;
        }

        .profileAvatar :global(svg) {
          width: 31px;
          height: 31px;
        }

        .profileCopy span {
          color: #e5484d;
          font-size: 5.5px;
          font-weight: 900;
          letter-spacing: 0.8px;
        }

        .profileCopy strong {
          display: block;
          margin-top: 3px;
          color: #101828;
          font-size: 16px;
        }

        .profileCopy p {
          margin: 5px 0 0;
          color: #7b8797;
          font-size: 7px;
          line-height: 1.5;
        }

        .phoneActions {
          margin-top: 12px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .phoneAction {
          min-height: 62px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          border: 1px solid #e5eaf0;
          border-radius: 14px;
          background: white;
          color: #667085;
          font-size: 7px;
          font-weight: 800;
        }

        .phoneAction.primary {
          color: white;
          background: #0b5fff;
          border-color: #0b5fff;
        }

        .phoneAction :global(svg) {
          width: 17px;
          height: 17px;
        }

        .phonePrivacy {
          margin-top: 12px;
          padding: 11px;
          display: flex;
          align-items: center;
          gap: 9px;
          border-radius: 13px;
          background: #f2f5f9;
        }

        .phonePrivacy :global(svg) {
          width: 17px;
          height: 17px;
          color: #0b5fff;
        }

        .phonePrivacy span,
        .phonePrivacy small {
          display: block;
        }

        .phonePrivacy span {
          color: #344054;
          font-size: 7px;
          font-weight: 800;
        }

        .phonePrivacy small {
          margin-top: 2px;
          color: #98a2b3;
          font-size: 5.5px;
        }

        .floatingFinder,
        .floatingMap {
          position: absolute;
          z-index: 5;
          border: 1px solid rgba(226, 231, 238, 0.95);
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(18px);
          box-shadow:
            0 18px 45px
            rgba(29, 52, 85, 0.11);
        }

        .floatingFinder {
          width: 220px;
          min-height: 68px;
          left: -35px;
          bottom: 70px;
          padding: 11px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-radius: 15px;
        }

        .floatingIcon {
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: #edf4ff;
          color: #0b5fff;
        }

        .floatingIcon :global(svg) {
          width: 16px;
          height: 16px;
        }

        .floatingFinder span,
        .floatingFinder strong {
          display: block;
        }

        .floatingFinder span {
          color: #98a2b3;
          font-size: 5.5px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .floatingFinder strong {
          margin-top: 3px;
          color: #344054;
          font-size: 9px;
        }

        .floatingFinder > i {
          width: 7px;
          height: 7px;
          margin-left: auto;
          border-radius: 50%;
          background: #12b76a;
        }

        .floatingMap {
          min-width: 138px;
          top: 86px;
          right: -18px;
          padding: 11px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: 13px;
        }

        .floatingMap :global(svg) {
          width: 20px;
          height: 20px;
          color: #0b5fff;
        }

        .floatingMap span,
        .floatingMap strong {
          display: block;
        }

        .floatingMap span {
          color: #98a2b3;
          font-size: 5px;
          font-weight: 900;
          letter-spacing: 0.8px;
        }

        .floatingMap strong {
          margin-top: 2px;
          color: #344054;
          font-size: 8px;
        }

        /* USE CASES */

        .useCases {
          padding: 100px 0;
          background: #f7f9fc;
        }

        .useCasesHeader {
          display: grid;
          grid-template-columns: 1fr 0.65fr;
          align-items: end;
          gap: 70px;
        }

        .useCasesHeader h2 {
          margin: 13px 0 0;
          color: #101828;
          font-size:
            clamp(36px, 4.7vw, 53px);
          line-height: 1.05;
          letter-spacing: -2.8px;
          font-weight: 740;
        }

        .useCasesHeader > p {
          margin: 0;
          color: #667085;
          font-size: 13px;
          line-height: 1.72;
        }

        .useCaseRail {
          margin-top: 48px;
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          overflow: hidden;
          border: 1px solid #e1e6ed;
          border-radius: 22px;
          background: white;
          box-shadow:
            0 12px 35px
            rgba(20, 45, 80, 0.035);
        }

        .useCaseItem {
          min-height: 175px;
          padding: 19px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-right: 1px solid #edf0f4;
        }

        .useCaseItem:last-child {
          border-right: 0;
        }

        .useCaseTop {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .useCaseTop > span {
          color: #c1c7d0;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.8px;
        }

        .useCaseIcon {
          width: 56px;
          height: 56px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: #f2f5f9;
          color: #233247;
        }

        .useCaseIcon :global(svg) {
          width: 28px;
          height: 28px;
        }

        .useCaseItem strong {
          color: #26364c;
          font-size: 11px;
          font-weight: 780;
        }

        .accountBar {
          margin-top: 16px;
          padding: 17px 19px;
          display: grid;
          grid-template-columns:
            auto auto 1fr auto;
          align-items: center;
          gap: 13px;
          border: 1px solid #e1e6ed;
          border-radius: 15px;
          background: white;
        }

        .accountBarIcon {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: #edf4ff;
          color: #0b5fff;
        }

        .accountBarIcon :global(svg) {
          width: 17px;
          height: 17px;
        }

        .accountBarCopy span,
        .accountBarCopy strong {
          display: block;
        }

        .accountBarCopy span {
          color: #98a2b3;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1.1px;
        }

        .accountBarCopy strong {
          margin-top: 3px;
          color: #344054;
          font-size: 10px;
        }

        .accountBar > p {
          margin: 0;
          color: #7b8797;
          font-size: 9px;
          line-height: 1.5;
        }

        .accountBar > a {
          min-height: 38px;
          padding: 0 13px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border-radius: 9px;
          background: #101828;
          color: white;
          font-size: 9px;
          font-weight: 800;
          text-decoration: none;
        }

        .accountBar > a :global(svg) {
          width: 12px;
          height: 12px;
        }

        /* HOW */

        .howSection {
          padding: 100px 0;
          background: white;
        }

        .howHeader {
          max-width: 720px;
        }

        .howHeader h2 {
          margin: 13px 0 0;
          color: #101828;
          font-size:
            clamp(36px, 4.7vw, 53px);
          line-height: 1.05;
          letter-spacing: -2.8px;
          font-weight: 740;
        }

        .howHeader > p {
          margin: 15px 0 0;
          color: #667085;
          font-size: 12px;
          line-height: 1.7;
        }

        .steps {
          margin-top: 52px;
          display: grid;
          grid-template-columns:
            1fr auto 1fr auto 1fr auto 1fr;
          align-items: start;
        }

        .step {
          min-width: 0;
        }

        .step > span {
          color: #b8c0cb;
          font-size: 7px;
          font-weight: 900;
        }

        .stepIcon {
          width: 46px;
          height: 46px;
          margin-top: 14px;
          display: grid;
          place-items: center;
          border: 1px solid #e2e7ee;
          border-radius: 13px;
          background: #ffffff;
          color: #0b5fff;
          box-shadow:
            0 6px 18px
            rgba(20, 40, 70, 0.035);
        }

        .stepIcon :global(svg) {
          width: 18px;
          height: 18px;
        }

        .qrIcon {
          font-size: 9px;
          font-weight: 900;
        }

        .step > strong {
          display: block;
          margin-top: 18px;
          color: #26364c;
          font-size: 11px;
          font-weight: 800;
        }

        .step > p {
          margin: 6px 0 0;
          color: #7b8797;
          font-size: 9px;
          line-height: 1.6;
        }

        .stepLine {
          width: 55px;
          height: 1px;
          margin: 36px 16px 0;
          background: #e1e6ed;
        }

        /* FEATURES */

        .featuresSection {
          padding: 100px 0;
          background: #0d1523;
        }

        .lightLabel {
          color: #8cb3ff;
        }

        .featureHeader h2 {
          max-width: 760px;
          margin: 13px 0 0;
          color: white;
          font-size:
            clamp(36px, 4.7vw, 52px);
          line-height: 1.05;
          letter-spacing: -2.8px;
          font-weight: 730;
        }

        .featureGrid {
          margin-top: 46px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top:
            1px solid rgba(255, 255, 255, 0.1);
          border-bottom:
            1px solid rgba(255, 255, 255, 0.1);
        }

        .featureItem {
          min-height: 210px;
          padding: 24px 21px;
          border-right:
            1px solid rgba(255, 255, 255, 0.1);
        }

        .featureItem:last-child {
          border-right: 0;
        }

        .featureTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .featureTop > span {
          color: #657184;
          font-size: 7px;
          font-weight: 900;
        }

        .featureIcon {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.06);
          color: #8cb3ff;
        }

        .featureIcon :global(svg) {
          width: 15px;
          height: 15px;
        }

        .featureItem h3 {
          margin: 36px 0 0;
          color: white;
          font-size: 12px;
          font-weight: 740;
        }

        .featureItem p {
          margin: 8px 0 0;
          color: #8b97a7;
          font-size: 9px;
          line-height: 1.65;
        }

        /* EMERGENCY INFO */

        .emergencyInfo {
          padding: 72px 0;
          background: white;
        }

        .emergencyInfoCard {
          min-height: 125px;
          padding: 20px 22px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 16px;
          border: 1px solid #eedbde;
          border-radius: 18px;
          background:
            linear-gradient(
              115deg,
              #fffafa,
              #ffffff
            );
        }

        .emergencyInfoMark {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: #e5484d;
          color: white;
          font-size: 29px;
        }

        .emergencyInfoCopy span,
        .emergencyInfoCopy strong,
        .emergencyInfoCopy p {
          display: block;
        }

        .emergencyInfoCopy span {
          color: #b4232d;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1.3px;
        }

        .emergencyInfoCopy strong {
          margin-top: 4px;
          color: #344054;
          font-size: 12px;
        }

        .emergencyInfoCopy p {
          margin: 4px 0 0;
          color: #7b8797;
          font-size: 9px;
        }

        .emergencyInfoCard > a {
          min-height: 38px;
          padding: 0 13px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-radius: 9px;
          background: #e5484d;
          color: white;
          font-size: 8px;
          font-weight: 800;
          text-decoration: none;
        }

        .emergencyInfoCard > a :global(svg) {
          width: 11px;
          height: 11px;
        }

        /* CONTACT */

        .contact {
          padding: 80px 24px;
          background: #f7f9fc;
        }

        .contactInner {
          max-width: 1120px;
          margin: auto;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 55px;
        }

        .contact h2 {
          margin: 11px 0 10px;
          color: #101828;
          font-size: 38px;
          letter-spacing: -1.8px;
        }

        .contact p {
          max-width: 620px;
          margin: 0;
          color: #667085;
          font-size: 11px;
          line-height: 1.7;
        }

        .contactButton {
          min-height: 44px;
          padding: 0 16px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 10px;
          background: #101828;
          color: white;
          font-size: 9px;
          font-weight: 800;
          text-decoration: none;
        }

        .contactButton :global(svg) {
          width: 12px;
          height: 12px;
        }

        /* FOOTER */

        .footer {
          background: #09111d;
          color: white;
        }

        .footerInner {
          max-width: 1120px;
          min-height: 135px;
          margin: auto;
          padding: 35px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .footerBrand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .footerLogo {
          width: 35px;
          height: 35px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #0b5fff;
          color: white;
        }

        .footerLogo :global(svg) {
          width: 19px;
          height: 19px;
        }

        .footerBrand strong,
        .footerBrand span {
          display: block;
        }

        .footerBrand strong {
          font-size: 12px;
        }

        .footerBrand span {
          margin-top: 3px;
          color: #667386;
          font-size: 5.5px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .footerLinks {
          display: flex;
          flex-wrap: wrap;
          gap: 22px;
        }

        .footerLinks a,
        .footerLinks span {
          color: #7c8797;
          font-size: 8px;
          font-weight: 700;
          text-decoration: none;
        }

        .copyright {
          color: #586475;
          font-size: 7px;
        }

        /* TABLET */

        @media (max-width: 960px) {
          .heroInner {
            grid-template-columns: 1fr;
            padding: 70px 0;
          }

          .phoneStage {
            margin-top: 20px;
          }

          .useCasesHeader {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .useCaseRail {
            grid-template-columns: repeat(3, 1fr);
          }

          .useCaseItem:nth-child(3n) {
            border-right: 0;
          }

          .useCaseItem:nth-child(-n + 3) {
            border-bottom: 1px solid #edf0f4;
          }

          .accountBar {
            grid-template-columns: auto 1fr auto;
          }

          .accountBar > p {
            grid-column: 2 / -1;
          }

          .steps {
            grid-template-columns: repeat(2, 1fr);
            gap: 25px;
          }

          .stepLine {
            display: none;
          }

          .featureGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .featureItem:nth-child(2) {
            border-right: 0;
          }

          .featureItem:nth-child(-n + 2) {
            border-bottom:
              1px solid rgba(255, 255, 255, 0.1);
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
            width: calc(100% - 18px);
            min-height: 72px;
          }

          .brandText span {
            display: none;
          }

          .brandLogo {
            width: 39px;
            height: 39px;
          }

          .brandText strong {
            font-size: 15px;
          }

          .languageSwitch {
            display: none;
          }

          .adminLink {
            padding: 0 8px;
          }

          .adminLink span {
            display: none;
          }

          .accountButton,
          .loginButton {
            padding: 0 9px;
            min-height: 35px;
            font-size: 8.5px;
          }

          .hero {
            min-height: unset;
          }

          .heroInner,
          .sectionShell {
            width: calc(100% - 28px);
          }

          .heroInner {
            min-height: unset;
            padding: 55px 0 70px;
          }

          .emergencyMiniCard {
            margin-bottom: 24px;
          }

          .hero h1 {
            font-size: 39px;
            letter-spacing: -2.5px;
          }

          .heroDescription {
            font-size: 13px;
          }

          .heroActions {
            align-items: stretch;
            flex-direction: column;
          }

          .primaryButton,
          .secondaryButton {
            width: 100%;
          }

          .phoneStage {
            min-height: 500px;
          }

          .phone {
            width: 245px;
            height: 485px;
          }

          .floatingFinder {
            width: 198px;
            left: -5px;
            bottom: 45px;
          }

          .floatingMap {
            right: -5px;
            top: 58px;
          }

          .useCases,
          .howSection,
          .featuresSection {
            padding: 78px 0;
          }

          .useCasesHeader h2,
          .howHeader h2,
          .featureHeader h2 {
            font-size: 35px;
            letter-spacing: -2.1px;
          }

          .useCaseRail {
            grid-template-columns: repeat(2, 1fr);
          }

          .useCaseItem {
            border-right: 1px solid #edf0f4;
            border-bottom: 1px solid #edf0f4;
          }

          .useCaseItem:nth-child(even) {
            border-right: 0;
          }

          .useCaseItem:nth-last-child(-n + 2) {
            border-bottom: 0;
          }

          .accountBar {
            grid-template-columns: auto 1fr;
          }

          .accountBar > p {
            grid-column: 1 / -1;
          }

          .accountBar > a {
            grid-column: 1 / -1;
            justify-content: center;
          }

          .steps,
          .featureGrid {
            grid-template-columns: 1fr;
          }

          .featureItem,
          .featureItem:nth-child(2) {
            border-right: 0;
            border-bottom:
              1px solid rgba(255, 255, 255, 0.1);
          }

          .featureItem:last-child {
            border-bottom: 0;
          }

          .emergencyInfo {
            padding: 55px 0;
          }

          .emergencyInfoCard {
            grid-template-columns: auto 1fr;
          }

          .emergencyInfoCard > a {
            grid-column: 1 / -1;
            justify-content: center;
          }

          .contact {
            padding: 65px 18px;
          }

          .contactButton {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </main>
  );
}

/* ICONS */

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
      <path d="M14.5 14.5h3v3h3v3h-6z" />
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

function DogIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <circle cx="12" cy="13" r="6" />
      <path d="M7.5 9 5 5.5v6M16.5 9 19 5.5v6" />
      <path d="M9.5 14h.01M14.5 14h.01M10 17c1.3 1 2.7 1 4 0" />
    </svg>
  );
}

function ProtectionIcon({
  type,
}: {
  type: ProtectType;
}) {
  if (type === "dog") {
    return <DogIcon />;
  }

  if (type === "cat") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <circle cx="12" cy="13" r="6" />
        <path d="m7 9 1-5 3 3M17 9l-1-5-3 3" />
        <path d="M9.5 14h.01M14.5 14h.01M12 15v2" />
      </svg>
    );
  }

  if (type === "keys") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <circle cx="8" cy="10" r="4" />
        <path d="m11 13 8 8M15 17l2-2M18 20l2-2" />
      </svg>
    );
  }

  if (type === "wallet") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path d="M4 6h14a2 2 0 0 1 2 2v10H4z" />
        <path d="M4 6 16 3v3" />
        <path d="M15 11h5v4h-5a2 2 0 0 1 0-4Z" />
      </svg>
    );
  }

  if (type === "luggage") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <rect x="5" y="6" width="14" height="14" rx="2" />
        <path d="M9 6V4h6v2M9 10v6M15 10v6M8 22h.01M16 22h.01" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M5 8h14l1 12H4z" />
      <path d="M8 8a4 4 0 0 1 8 0" />
    </svg>
  );
}
