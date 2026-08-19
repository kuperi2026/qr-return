"use client";

import { useEffect, useState } from "react";
import SupportLauncher from "./components/SupportLauncher";
import { supabase } from "@/lib/supabase";

type Language = "ka" | "en";

type ProtectionType =
  | "dog"
  | "cat"
  | "keys"
  | "wallet"
  | "luggage"
  | "bag";

const protectionTypes: {
  type: ProtectionType;
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
      "მპოვნელს შეუძლია უსაფრთხოდ მოგწეროთ QR RETURN-ის საშუალებით.",
    enText:
      "A finder can securely message you through QR RETURN.",
  },
  {
    number: "02",
    ka: "ლოკაციის გაზიარება",
    en: "Location Sharing",
    kaText:
      "მპოვნელმა ერთი მოქმედებით შეიძლება გაგიზიაროთ მიმდინარე მდებარეობა.",
    enText:
      "A finder can share the current location in a single step.",
  },
  {
    number: "03",
    ka: "მპოვნელის ჯილდო",
    en: "Finder Reward",
    kaText:
      "სურვილის შემთხვევაში შეგიძლიათ მიუთითოთ ჯილდო ნივთის დაბრუნებისთვის.",
    enText:
      "Optionally offer a reward for the safe return of your property.",
  },
  {
    number: "04",
    ka: "Privacy Control",
    en: "Privacy Control",
    kaText:
      "თქვენ თავად აკონტროლებთ რა ინფორმაცია გახდება ხილული მპოვნელისთვის.",
    enText:
      "You decide exactly what information a finder can see.",
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
          <div className="brandMark">
            <LogoMark />
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
                  <span>
                    {ka
                      ? "ანგარიშის შექმნა"
                      : "Create Account"}
                  </span>
                </a>

                <a href="/login" className="loginLink">
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

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="hero">
        <div className="heroGlow heroGlowOne" />
        <div className="heroGlow heroGlowTwo" />

        <div className="heroInner">
          <div className="heroContent">
            <div className="eyebrow">
              <span className="eyebrowDot" />
              QR RETURN
            </div>

            <h1>
              {ka ? (
                <>
                  დაკარგულს
                  <br />
                  <span>დაბრუნების გზა</span>
                  <br />
                  ყოველთვის ჰქონდეს.
                </>
              ) : (
                <>
                  Give what matters
                  <br />
                  <span>a way back</span>
                  <br />
                  to you.
                </>
              )}
            </h1>

            <p className="heroDescription">
              {ka
                ? "QR RETURN აკავშირებს მპოვნელს და მფლობელს სწრაფად, უსაფრთხოდ და ზედმეტი აპლიკაციის გარეშე."
                : "QR RETURN connects finders and owners quickly, securely and without requiring another app."}
            </p>

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
                <PlayIcon />
                <span>
                  {ka ? "როგორ მუშაობს" : "How it works"}
                </span>
              </a>
            </div>

            <div className="trustLine">
              <div>
                <ShieldIcon />
                <span>
                  {ka
                    ? "პირადი მონაცემების კონტროლი"
                    : "Privacy controlled"}
                </span>
              </div>

              <div>
                <ScanIcon />
                <span>
                  {ka
                    ? "აპის გარეშე"
                    : "No app required"}
                </span>
              </div>

              <div>
                <ChatIcon />
                <span>Live Chat</span>
              </div>
            </div>
          </div>

          <div className="heroVisual">
            <div className="visualHalo" />

            <div className="productCard">
              <div className="productTop">
                <div>
                  <span className="productLabel">
                    QR RETURN
                  </span>

                  <strong>
                    {ka
                      ? "დაცული პროფილი"
                      : "Protected Profile"}
                  </strong>
                </div>

                <span className="onlineBadge">
                  <i />
                  ACTIVE
                </span>
              </div>

              <div className="qrStage">
                <div className="qrFrame">
                  <span className="scanCorner tl" />
                  <span className="scanCorner tr" />
                  <span className="scanCorner bl" />
                  <span className="scanCorner br" />

                  <QrPattern />
                </div>
              </div>

              <div className="productBottom">
                <div className="productMeta">
                  <span>
                    {ka ? "ერთი სკანი" : "One scan"}
                  </span>
                  <strong>
                    {ka
                      ? "სწრაფი კავშირი"
                      : "Instant connection"}
                  </strong>
                </div>

                <div className="miniAction">
                  <ArrowIcon />
                </div>
              </div>
            </div>

            <div className="floatingMessage">
              <div className="messageIcon">
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

              <div className="messageDot" />
            </div>

            <div className="floatingLocation">
              <LocationIcon />

              <div>
                <span>LOCATION</span>
                <strong>
                  {ka
                    ? "გაზიარებულია"
                    : "Shared"}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PROTECTION TYPES
      ====================================================== */}

      <section className="protectionSection">
        <div className="sectionShell">
          <div className="sectionHeader splitHeader">
            <div>
              <div className="eyebrow darkEyebrow">
                QR RETURN
              </div>

              <h2>
                {ka
                  ? "ერთი სისტემა. ყველაფერი, რაც მნიშვნელოვანია."
                  : "One system. Everything that matters."}
              </h2>
            </div>

            <p>
              {ka
                ? "პროფილის შექმნა ხდება თქვენი პირადი ანგარიშიდან. მთავარ გვერდზე კი მხოლოდ ის ხედავთ, რისთვის შეგიძლიათ გამოიყენოთ QR RETURN."
                : "Profiles are created inside your private account. Here, you can simply see what QR RETURN can protect."}
            </p>
          </div>

          <div className="protectionRail">
            {protectionTypes.map((item) => (
              <div
                className="protectionItem"
                key={item.type}
              >
                <div className="iconBox">
                  <ProtectionIcon type={item.type} />
                </div>

                <span className="protectionNumber">
                  0
                  {protectionTypes.findIndex(
                    (entry) => entry.type === item.type
                  ) + 1}
                </span>

                <strong>
                  {ka ? item.ka : item.en}
                </strong>
              </div>
            ))}
          </div>

          <div className="accountBanner">
            <div className="accountBannerIcon">
              <UserIcon />
            </div>

            <div className="accountBannerCopy">
              <span>
                {ka
                  ? "ერთი Owner Account"
                  : "One Owner Account"}
              </span>

              <strong>
                {ka
                  ? "ყველა QR პროფილი ერთ ადგილას."
                  : "All your QR profiles in one place."}
              </strong>
            </div>

            <p>
              {ka
                ? "ანგარიშის შიგნით დაამატებთ და მართავთ თქვენს ყველა ცხოველს, ნივთს და Emergency ID-ს."
                : "Add and manage pets, items and Emergency IDs from inside your account."}
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

      {/* =====================================================
          EMERGENCY
      ====================================================== */}

      <section className="emergencySection">
        <div className="sectionShell">
          <div className="emergencyCard">
            <div className="emergencyNoise" />

            <div className="emergencyCopy">
              <div className="medicalEyebrow">
                <span>+</span>
                QR RETURN EMERGENCY ID
              </div>

              <h2>
                {ka ? (
                  <>
                    ინფორმაცია,
                    <br />
                    რომელიც <span>საჭირო დროს</span>
                    <br />
                    ხელმისაწვდომია.
                  </>
                ) : (
                  <>
                    The information
                    <br />
                    that matters <span>when it matters.</span>
                  </>
                )}
              </h2>

              <p>
                {ka
                  ? "Emergency ID ადამიანებისთვის — საგანგებო კონტაქტი, მნიშვნელოვანი სამედიცინო ინფორმაცია და პირადი მონაცემების სრული კონტროლი ერთ QR პროფილში."
                  : "Emergency ID for people — emergency contacts, important medical information and full privacy control in one QR profile."}
              </p>

              <div className="emergencyList">
                <div>
                  <span>01</span>
                  <strong>
                    {ka
                      ? "Emergency Contact"
                      : "Emergency Contact"}
                  </strong>
                </div>

                <div>
                  <span>02</span>
                  <strong>
                    {ka
                      ? "სამედიცინო ინფორმაცია"
                      : "Medical Information"}
                  </strong>
                </div>

                <div>
                  <span>03</span>
                  <strong>
                    {ka
                      ? "აპის გარეშე"
                      : "No App Required"}
                  </strong>
                </div>

                <div>
                  <span>04</span>
                  <strong>
                    {ka
                      ? "Privacy Control"
                      : "Privacy Control"}
                  </strong>
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
                <span>
                  {isLoggedIn
                    ? ka
                      ? "Emergency ID-ის მართვა"
                      : "Manage Emergency ID"
                    : ka
                      ? "ანგარიშის შექმნა"
                      : "Create Account"}
                </span>

                <ArrowIcon />
              </a>
            </div>

            <div className="emergencyVisual">
              <div className="medicalCard">
                <div className="medicalCardHeader">
                  <div className="medicalLogo">
                    +
                  </div>

                  <div>
                    <span>QR RETURN</span>
                    <strong>EMERGENCY ID</strong>
                  </div>

                  <div className="verifiedBadge">
                    <CheckIcon />
                  </div>
                </div>

                <div className="medicalProfile">
                  <div className="medicalAvatar">
                    <UserIcon />
                  </div>

                  <div>
                    <span>
                      {ka
                        ? "EMERGENCY PROFILE"
                        : "EMERGENCY PROFILE"}
                    </span>
                    <strong>
                      {ka
                        ? "მნიშვნელოვანი ინფორმაცია"
                        : "Essential information"}
                    </strong>
                  </div>
                </div>

                <div className="medicalRows">
                  <div>
                    <span>
                      {ka
                        ? "საგანგებო კონტაქტი"
                        : "Emergency contact"}
                    </span>
                    <strong>Available</strong>
                  </div>

                  <div>
                    <span>
                      {ka
                        ? "სამედიცინო ინფორმაცია"
                        : "Medical information"}
                    </span>
                    <strong>Protected</strong>
                  </div>
                </div>

                <div className="medicalQr">
                  <QrPattern compact />
                </div>
              </div>

              <div className="braceletWrap">
                <div className="braceletStrap left" />

                <div className="braceletPlate">
                  <div className="braceletPlus">
                    +
                  </div>

                  <QrPattern compact />

                  <small>QR EMERGENCY</small>
                </div>

                <div className="braceletStrap right" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

      <section id="how" className="howSection">
        <div className="sectionShell">
          <div className="sectionHeader">
            <div className="eyebrow darkEyebrow">
              SIMPLE BY DESIGN
            </div>

            <h2>
              {ka
                ? "ოთხი ნაბიჯი დაბრუნებამდე."
                : "Four steps to getting it back."}
            </h2>

            <p>
              {ka
                ? "მარტივი გამოცდილება მფლობელისთვისაც და მპოვნელისთვისაც."
                : "A simple experience for both owners and finders."}
            </p>
          </div>

          <div className="timeline">
            <div className="timelineItem">
              <div className="timelineNumber">
                01
              </div>

              <div className="timelineIcon">
                <UserIcon />
              </div>

              <div className="timelineCopy">
                <h3>
                  {ka
                    ? "შექმენით ანგარიში"
                    : "Create your account"}
                </h3>

                <p>
                  {ka
                    ? "ერთი Owner Account თქვენი ყველა QR პროფილისთვის."
                    : "One Owner Account for all your QR profiles."}
                </p>
              </div>
            </div>

            <div className="timelineConnector" />

            <div className="timelineItem">
              <div className="timelineNumber">
                02
              </div>

              <div className="timelineIcon">
                <PlusIcon />
              </div>

              <div className="timelineCopy">
                <h3>
                  {ka
                    ? "დაამატეთ პროფილი"
                    : "Add a profile"}
                </h3>

                <p>
                  {ka
                    ? "აირჩიეთ ცხოველი, ნივთი ან Emergency ID."
                    : "Choose a pet, item or Emergency ID."}
                </p>
              </div>
            </div>

            <div className="timelineConnector" />

            <div className="timelineItem">
              <div className="timelineNumber">
                03
              </div>

              <div className="timelineIcon qrTextIcon">
                QR
              </div>

              <div className="timelineCopy">
                <h3>
                  {ka
                    ? "მიამაგრეთ QR"
                    : "Attach the QR"}
                </h3>

                <p>
                  {ka
                    ? "უნიკალური QR უკავშირდება კონკრეტულ პროფილს."
                    : "A unique QR connects directly to the profile."}
                </p>
              </div>
            </div>

            <div className="timelineConnector" />

            <div className="timelineItem">
              <div className="timelineNumber">
                04
              </div>

              <div className="timelineIcon">
                <ChatIcon />
              </div>

              <div className="timelineCopy">
                <h3>
                  {ka
                    ? "მპოვნელი გიკავშირდებათ"
                    : "The finder contacts you"}
                </h3>

                <p>
                  {ka
                    ? "Live Chat, ლოკაცია და თქვენ მიერ არჩეული საკონტაქტო გზა."
                    : "Live Chat, location and the contact options you choose."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURES
      ====================================================== */}

      <section className="featuresSection">
        <div className="sectionShell">
          <div className="featureIntro">
            <div className="eyebrow">
              BUILT AROUND CONTROL
            </div>

            <h2>
              {ka
                ? "ნაკლები სირთულე. მეტი კონტროლი."
                : "Less friction. More control."}
            </h2>
          </div>

          <div className="featureGrid">
            {features.map((feature) => (
              <article
                className="featureCard"
                key={feature.number}
              >
                <div className="featureTop">
                  <span>{feature.number}</span>

                  <div className="featureIcon">
                    {feature.number === "01" && (
                      <ChatIcon />
                    )}

                    {feature.number === "02" && (
                      <LocationIcon />
                    )}

                    {feature.number === "03" && (
                      <RewardIcon />
                    )}

                    {feature.number === "04" && (
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
          FINAL CTA
      ====================================================== */}

      <section className="finalCtaSection">
        <div className="finalCta">
          <div>
            <span className="finalLabel">
              QR RETURN
            </span>

            <h2>
              {ka
                ? "რაც მნიშვნელოვანია, დაბრუნების გზაც ჰქონდეს."
                : "Give what matters a way back."}
            </h2>
          </div>

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
      </section>

      {/* =====================================================
          CONTACT
      ====================================================== */}

      <section id="contact" className="contact">
        <div className="contactInner">
          <div>
            <div className="eyebrow darkEyebrow">
              CONTACT
            </div>

            <h2>
              {ka
                ? "დაგვიკავშირდით"
                : "Contact us"}
            </h2>

            <p>
              {ka
                ? "კითხვა გაქვთ QR RETURN-ის, პროფილების ან Emergency ID-ის შესახებ? მოგვწერეთ."
                : "Questions about QR RETURN, profiles or Emergency ID? Send us a message."}
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

      {/* =====================================================
          LIVE CHAT — KEEP
      ====================================================== */}

      <SupportLauncher language={language} />

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="footer">
        <div className="footerInner">
          <div className="footerBrandBlock">
            <div className="footerLogo">
              <LogoMark />
            </div>

            <div>
              <strong>QR RETURN</strong>
              <span>SMART LOST &amp; FOUND</span>
            </div>
          </div>

          <div className="footerNav">
            <a href="#how">
              {ka ? "როგორ მუშაობს" : "How it works"}
            </a>

            <a href="#contact">
              {ka ? "კონტაქტი" : "Contact"}
            </a>

            <span>
              {ka
                ? "კონფიდენციალურობა"
                : "Privacy"}
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
          color: #101828;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        /* ==================================================
           HEADER
        ================================================== */

        .header {
          width: calc(100% - 48px);
          max-width: 1280px;
          min-height: 88px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          position: relative;
          z-index: 20;
          border-bottom: 1px solid #edf0f4;
        }

        .brand {
          display: flex;
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
          background: #0f5fe9;
          color: white;
          box-shadow:
            0 8px 24px
            rgba(15, 95, 233, 0.18);
        }

        .brandMark :global(svg) {
          width: 25px;
          height: 25px;
        }

        .brandCopy strong,
        .brandCopy span {
          display: block;
        }

        .brandCopy strong {
          color: #0f5fe9;
          font-size: 19px;
          font-weight: 800;
          letter-spacing: -0.6px;
        }

        .brandCopy span {
          margin-top: 3px;
          color: #98a2b3;
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 2.1px;
        }

        .headerRight,
        .nav,
        .languageSwitch {
          display: flex;
          align-items: center;
        }

        .headerRight {
          gap: 14px;
        }

        .nav {
          gap: 7px;
        }

        .adminLink,
        .accountButton,
        .loginLink {
          min-height: 40px;
          padding: 0 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 750;
          text-decoration: none;
          white-space: nowrap;
        }

        .adminLink {
          border: 1px solid #e4e1ff;
          background: #f7f6ff;
          color: #6754d8;
        }

        .adminLink :global(svg),
        .accountButton :global(svg) {
          width: 14px;
          height: 14px;
        }

        .accountButton {
          border: 1px solid #0f5fe9;
          background: #0f5fe9;
          color: white;
          box-shadow:
            0 6px 18px
            rgba(15, 95, 233, 0.13);
        }

        .loginLink {
          border: 1px solid #e4e7ec;
          background: white;
          color: #344054;
        }

        .languageSwitch {
          padding: 3px;
          border-radius: 9px;
          background: #f2f4f7;
        }

        .languageSwitch button {
          min-width: 40px;
          height: 32px;
          border: 0;
          border-radius: 7px;
          background: transparent;
          color: #98a2b3;
          font-size: 8px;
          font-weight: 850;
          letter-spacing: 0.5px;
          cursor: pointer;
        }

        .languageSwitch button.active {
          background: white;
          color: #0f5fe9;
          box-shadow:
            0 2px 8px
            rgba(16, 24, 40, 0.07);
        }

        /* ==================================================
           COMMON
        ================================================== */

        .sectionShell {
          width: calc(100% - 48px);
          max-width: 1180px;
          margin: auto;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #0f5fe9;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: 2.2px;
        }

        .darkEyebrow {
          color: #667085;
        }

        .eyebrowDot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #0f5fe9;
          box-shadow:
            0 0 0 5px
            rgba(15, 95, 233, 0.08);
        }

        /* ==================================================
           HERO
        ================================================== */

        .hero {
          min-height: 720px;
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(
              180deg,
              #ffffff 0%,
              #fbfdff 100%
            );
        }

        .heroInner {
          width: calc(100% - 48px);
          max-width: 1280px;
          min-height: 720px;
          margin: auto;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          align-items: center;
          gap: 70px;
          position: relative;
          z-index: 2;
        }

        .heroGlow {
          position: absolute;
          border-radius: 50%;
          filter: blur(10px);
          pointer-events: none;
        }

        .heroGlowOne {
          width: 560px;
          height: 560px;
          top: -260px;
          right: -180px;
          background:
            radial-gradient(
              circle,
              rgba(15, 95, 233, 0.1),
              rgba(15, 95, 233, 0)
            );
        }

        .heroGlowTwo {
          width: 400px;
          height: 400px;
          left: -220px;
          bottom: -220px;
          background:
            radial-gradient(
              circle,
              rgba(98, 84, 216, 0.07),
              rgba(98, 84, 216, 0)
            );
        }

        .heroContent {
          max-width: 710px;
        }

        .hero h1 {
          margin: 24px 0 0;
          color: #101828;
          font-size:
            clamp(52px, 6.6vw, 86px);
          line-height: 0.99;
          letter-spacing: -5.2px;
          font-weight: 760;
        }

        .hero h1 span {
          color: #0f5fe9;
        }

        .heroDescription {
          max-width: 620px;
          margin: 28px 0 0;
          color: #667085;
          font-size: 16px;
          line-height: 1.75;
        }

        .heroActions {
          margin-top: 34px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .primaryCta,
        .secondaryCta {
          min-height: 52px;
          padding: 0 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 800;
          text-decoration: none;
        }

        .primaryCta {
          background: #0f5fe9;
          color: white;
          box-shadow:
            0 9px 24px
            rgba(15, 95, 233, 0.18);
        }

        .primaryCta :global(svg),
        .secondaryCta :global(svg) {
          width: 15px;
          height: 15px;
        }

        .secondaryCta {
          border: 1px solid #e4e7ec;
          background: white;
          color: #344054;
        }

        .trustLine {
          margin-top: 34px;
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }

        .trustLine > div {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #7c8797;
          font-size: 9px;
          font-weight: 700;
        }

        .trustLine :global(svg) {
          width: 14px;
          height: 14px;
          color: #0f5fe9;
        }

        /* HERO VISUAL */

        .heroVisual {
          min-height: 540px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .visualHalo {
          width: 470px;
          height: 470px;
          position: absolute;
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              rgba(15, 95, 233, 0.11) 0%,
              rgba(15, 95, 233, 0.025) 48%,
              rgba(15, 95, 233, 0) 70%
            );
        }

        .productCard {
          width: 340px;
          min-height: 450px;
          padding: 24px;
          position: relative;
          z-index: 3;
          border: 1px solid
            rgba(224, 229, 237, 0.95);
          border-radius: 29px;
          background:
            rgba(255, 255, 255, 0.93);
          box-shadow:
            0 40px 90px
              rgba(30, 58, 93, 0.11),
            0 2px 6px
              rgba(16, 24, 40, 0.03);
          backdrop-filter: blur(20px);
          transform:
            perspective(1200px)
            rotateY(-4deg)
            rotateX(1deg);
        }

        .productTop {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
        }

        .productTop span,
        .productTop strong {
          display: block;
        }

        .productLabel {
          color: #0f5fe9;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.8px;
        }

        .productTop strong {
          margin-top: 5px;
          color: #26364c;
          font-size: 13px;
        }

        .onlineBadge {
          padding: 6px 8px;
          display: inline-flex !important;
          align-items: center;
          gap: 6px;
          border-radius: 999px;
          background: #ecfdf3;
          color: #027a48;
          font-size: 7px !important;
          font-weight: 900 !important;
          letter-spacing: 0.7px;
        }

        .onlineBadge i {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #12b76a;
        }

        .qrStage {
          height: 285px;
          display: grid;
          place-items: center;
        }

        .qrFrame {
          width: 185px;
          height: 185px;
          position: relative;
          display: grid;
          place-items: center;
          border-radius: 28px;
          background: #f8fafc;
        }

        .scanCorner {
          width: 34px;
          height: 34px;
          position: absolute;
        }

        .scanCorner.tl {
          top: 0;
          left: 0;
          border-top: 3px solid #0f5fe9;
          border-left: 3px solid #0f5fe9;
          border-radius: 12px 0 0 0;
        }

        .scanCorner.tr {
          top: 0;
          right: 0;
          border-top: 3px solid #0f5fe9;
          border-right: 3px solid #0f5fe9;
          border-radius: 0 12px 0 0;
        }

        .scanCorner.bl {
          bottom: 0;
          left: 0;
          border-bottom: 3px solid #0f5fe9;
          border-left: 3px solid #0f5fe9;
          border-radius: 0 0 0 12px;
        }

        .scanCorner.br {
          right: 0;
          bottom: 0;
          border-right: 3px solid #0f5fe9;
          border-bottom: 3px solid #0f5fe9;
          border-radius: 0 0 12px 0;
        }

        .productBottom {
          padding-top: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #eef1f5;
        }

        .productMeta span,
        .productMeta strong {
          display: block;
        }

        .productMeta span {
          color: #98a2b3;
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .productMeta strong {
          margin-top: 4px;
          color: #344054;
          font-size: 11px;
        }

        .miniAction {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #0f5fe9;
          color: white;
        }

        .miniAction :global(svg) {
          width: 14px;
          height: 14px;
        }

        .floatingMessage,
        .floatingLocation {
          position: absolute;
          z-index: 5;
          border: 1px solid
            rgba(224, 229, 237, 0.9);
          background:
            rgba(255, 255, 255, 0.95);
          box-shadow:
            0 20px 50px
            rgba(26, 51, 82, 0.11);
          backdrop-filter: blur(18px);
        }

        .floatingMessage {
          width: 235px;
          min-height: 72px;
          left: -20px;
          bottom: 80px;
          padding: 13px;
          display: flex;
          align-items: center;
          gap: 11px;
          border-radius: 16px;
        }

        .messageIcon {
          width: 40px;
          height: 40px;
          flex: 0 0 40px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #edf4ff;
          color: #0f5fe9;
        }

        .messageIcon :global(svg) {
          width: 17px;
          height: 17px;
        }

        .floatingMessage span,
        .floatingMessage strong {
          display: block;
        }

        .floatingMessage span {
          color: #98a2b3;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1.2px;
        }

        .floatingMessage strong {
          margin-top: 4px;
          color: #344054;
          font-size: 10px;
        }

        .messageDot {
          width: 8px;
          height: 8px;
          margin-left: auto;
          border-radius: 50%;
          background: #12b76a;
        }

        .floatingLocation {
          min-width: 150px;
          top: 72px;
          right: -5px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-radius: 14px;
        }

        .floatingLocation :global(svg) {
          width: 22px;
          height: 22px;
          color: #0f5fe9;
        }

        .floatingLocation span,
        .floatingLocation strong {
          display: block;
        }

        .floatingLocation span {
          color: #98a2b3;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .floatingLocation strong {
          margin-top: 3px;
          color: #344054;
          font-size: 10px;
        }

        /* ==================================================
           PROTECTION
        ================================================== */

        .protectionSection {
          padding: 110px 0;
          background: #f7f9fc;
          border-top: 1px solid #eef1f5;
        }

        .splitHeader {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            minmax(300px, 0.55fr);
          align-items: end;
          gap: 90px;
        }

        .sectionHeader h2,
        .featureIntro h2 {
          max-width: 820px;
          margin: 15px 0 0;
          color: #101828;
          font-size:
            clamp(40px, 5vw, 62px);
          line-height: 1.04;
          letter-spacing: -3.4px;
          font-weight: 740;
        }

        .splitHeader > p,
        .sectionHeader > p {
          margin: 0;
          color: #667085;
          font-size: 14px;
          line-height: 1.75;
        }

        .protectionRail {
          margin-top: 55px;
          display: grid;
          grid-template-columns:
            repeat(6, 1fr);
          border: 1px solid #e3e7ee;
          border-radius: 22px;
          background: white;
          box-shadow:
            0 14px 40px
            rgba(30, 50, 80, 0.035);
          overflow: hidden;
        }

        .protectionItem {
          min-height: 180px;
          padding: 24px 18px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          border-right: 1px solid #edf0f4;
        }

        .protectionItem:last-child {
          border-right: 0;
        }

        .iconBox {
          width: 52px;
          height: 52px;
          margin-bottom: 35px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #f4f7fb;
          color: #26364c;
        }

        .iconBox :global(svg) {
          width: 24px;
          height: 24px;
        }

        .protectionNumber {
          position: absolute;
          top: 20px;
          right: 17px;
          color: #c2c8d0;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .protectionItem strong {
          color: #26364c;
          font-size: 12px;
          font-weight: 760;
        }

        .accountBanner {
          margin-top: 18px;
          padding: 19px 21px;
          display: grid;
          grid-template-columns:
            auto auto 1fr auto;
          align-items: center;
          gap: 15px;
          border: 1px solid #e3e7ee;
          border-radius: 16px;
          background: #ffffff;
        }

        .accountBannerIcon {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #edf4ff;
          color: #0f5fe9;
        }

        .accountBannerIcon :global(svg) {
          width: 18px;
          height: 18px;
        }

        .accountBannerCopy span,
        .accountBannerCopy strong {
          display: block;
        }

        .accountBannerCopy span {
          color: #98a2b3;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

        .accountBannerCopy strong {
          margin-top: 4px;
          color: #344054;
          font-size: 12px;
        }

        .accountBanner > p {
          margin: 0;
          color: #7c8797;
          font-size: 10px;
          line-height: 1.55;
        }

        .accountBanner > a {
          min-height: 40px;
          padding: 0 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 10px;
          background: #101828;
          color: white;
          font-size: 10px;
          font-weight: 800;
          text-decoration: none;
        }

        .accountBanner > a :global(svg) {
          width: 13px;
          height: 13px;
        }

        /* ==================================================
           EMERGENCY
        ================================================== */

        .emergencySection {
          padding: 110px 0;
          background: #ffffff;
        }

        .emergencyCard {
          min-height: 590px;
          padding: 60px;
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          align-items: center;
          gap: 70px;
          border-radius: 32px;
          background:
            radial-gradient(
              circle at 90% 12%,
              rgba(216, 44, 58, 0.13),
              transparent 27%
            ),
            linear-gradient(
              135deg,
              #0c1728 0%,
              #0e1c31 52%,
              #111e31 100%
            );
          box-shadow:
            0 30px 80px
            rgba(10, 25, 46, 0.14);
        }

        .emergencyNoise {
          position: absolute;
          inset: 0;
          opacity: 0.35;
          background:
            linear-gradient(
              115deg,
              transparent 0%,
              rgba(255, 255, 255, 0.015) 45%,
              transparent 55%
            );
          pointer-events: none;
        }

        .emergencyCopy {
          position: relative;
          z-index: 3;
        }

        .medicalEyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #aab6c6;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .medicalEyebrow span {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: #d92d3a;
          color: white;
          font-size: 19px;
          line-height: 1;
        }

        .emergencyCopy h2 {
          margin: 25px 0 20px;
          color: #ffffff;
          font-size:
            clamp(46px, 5.5vw, 68px);
          line-height: 1.02;
          letter-spacing: -3.6px;
          font-weight: 720;
        }

        .emergencyCopy h2 span {
          color: #ff717c;
        }

        .emergencyCopy > p {
          max-width: 590px;
          margin: 0;
          color: #aeb8c7;
          font-size: 14px;
          line-height: 1.75;
        }

        .emergencyList {
          margin-top: 30px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .emergencyList > div {
          min-height: 44px;
          padding: 0 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid
            rgba(255, 255, 255, 0.08);
          border-radius: 11px;
          background:
            rgba(255, 255, 255, 0.035);
        }

        .emergencyList span {
          color: #ff717c;
          font-size: 7px;
          font-weight: 900;
        }

        .emergencyList strong {
          color: #d8dee8;
          font-size: 10px;
          font-weight: 700;
        }

        .emergencyCta {
          min-height: 47px;
          margin-top: 28px;
          padding: 0 17px;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          border-radius: 11px;
          background: #ffffff;
          color: #101828;
          font-size: 10px;
          font-weight: 850;
          text-decoration: none;
        }

        .emergencyCta :global(svg) {
          width: 13px;
          height: 13px;
        }

        .emergencyVisual {
          min-height: 450px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .medicalCard {
          width: 315px;
          min-height: 390px;
          padding: 23px;
          position: relative;
          z-index: 3;
          border: 1px solid
            rgba(255, 255, 255, 0.2);
          border-radius: 26px;
          background:
            rgba(255, 255, 255, 0.96);
          box-shadow:
            0 32px 70px
            rgba(0, 0, 0, 0.25);
          transform: rotate(3deg);
        }

        .medicalCardHeader {
          display: grid;
          grid-template-columns:
            auto 1fr auto;
          align-items: center;
          gap: 10px;
        }

        .medicalLogo {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #d92d3a;
          color: white;
          font-size: 24px;
        }

        .medicalCardHeader span,
        .medicalCardHeader strong {
          display: block;
        }

        .medicalCardHeader span {
          color: #98a2b3;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1.1px;
        }

        .medicalCardHeader strong {
          margin-top: 3px;
          color: #344054;
          font-size: 9px;
        }

        .verifiedBadge {
          width: 29px;
          height: 29px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: #ecfdf3;
          color: #039855;
        }

        .verifiedBadge :global(svg) {
          width: 13px;
          height: 13px;
        }

        .medicalProfile {
          margin-top: 25px;
          padding: 16px 0;
          display: flex;
          align-items: center;
          gap: 11px;
          border-top: 1px solid #eef1f4;
          border-bottom: 1px solid #eef1f4;
        }

        .medicalAvatar {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #f2f4f7;
          color: #667085;
        }

        .medicalAvatar :global(svg) {
          width: 19px;
          height: 19px;
        }

        .medicalProfile span,
        .medicalProfile strong {
          display: block;
        }

        .medicalProfile span {
          color: #98a2b3;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .medicalProfile strong {
          margin-top: 4px;
          color: #344054;
          font-size: 10px;
        }

        .medicalRows {
          margin-top: 15px;
          display: grid;
          gap: 8px;
        }

        .medicalRows > div {
          min-height: 45px;
          padding: 0 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 10px;
          background: #f7f9fc;
        }

        .medicalRows span {
          color: #667085;
          font-size: 8px;
        }

        .medicalRows strong {
          color: #344054;
          font-size: 8px;
        }

        .medicalQr {
          width: 85px;
          height: 85px;
          margin: 20px auto 0;
          padding: 8px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #f2f4f7;
        }

        .braceletWrap {
          width: 310px;
          height: 110px;
          position: absolute;
          right: -55px;
          bottom: 12px;
          z-index: 4;
          display: flex;
          align-items: center;
          transform: rotate(-9deg);
          filter:
            drop-shadow(
              0 18px 18px
              rgba(0, 0, 0, 0.25)
            );
        }

        .braceletStrap {
          flex: 1;
          height: 47px;
          background: #0f5fe9;
        }

        .braceletStrap.left {
          border-radius: 24px 0 0 24px;
        }

        .braceletStrap.right {
          border-radius: 0 24px 24px 0;
        }

        .braceletPlate {
          width: 125px;
          height: 100px;
          flex: 0 0 125px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 5px solid #0d56d1;
          border-radius: 24px;
          background: white;
        }

        .braceletPlus {
          width: 19px;
          height: 19px;
          position: absolute;
          top: 8px;
          right: 9px;
          display: grid;
          place-items: center;
          border-radius: 5px;
          background: #d92d3a;
          color: white;
          font-size: 14px;
        }

        .braceletPlate small {
          margin-top: 5px;
          color: #0f5fe9;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 0.8px;
        }

        /* ==================================================
           HOW
        ================================================== */

        .howSection {
          padding: 115px 0;
          background: #f7f9fc;
          border-top: 1px solid #edf0f4;
        }

        .howSection .sectionHeader {
          max-width: 760px;
        }

        .howSection .sectionHeader > p {
          margin-top: 18px;
        }

        .timeline {
          margin-top: 60px;
          display: grid;
          grid-template-columns:
            1fr auto 1fr auto 1fr auto 1fr;
          align-items: start;
        }

        .timelineItem {
          min-width: 0;
        }

        .timelineNumber {
          color: #b8c0cc;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .timelineIcon {
          width: 48px;
          height: 48px;
          margin-top: 17px;
          display: grid;
          place-items: center;
          border: 1px solid #e1e6ed;
          border-radius: 14px;
          background: white;
          color: #0f5fe9;
          box-shadow:
            0 8px 22px
            rgba(20, 45, 80, 0.04);
        }

        .timelineIcon :global(svg) {
          width: 18px;
          height: 18px;
        }

        .qrTextIcon {
          font-size: 10px;
          font-weight: 900;
          letter-spacing: -0.4px;
        }

        .timelineCopy {
          margin-top: 22px;
        }

        .timelineCopy h3 {
          margin: 0;
          color: #26364c;
          font-size: 13px;
          font-weight: 760;
        }

        .timelineCopy p {
          margin: 8px 0 0;
          color: #7b8798;
          font-size: 10px;
          line-height: 1.65;
        }

        .timelineConnector {
          width: 65px;
          height: 1px;
          margin: 42px 18px 0;
          background:
            linear-gradient(
              90deg,
              #dce2ea,
              #eef1f5
            );
        }

        /* ==================================================
           FEATURES
        ================================================== */

        .featuresSection {
          padding: 115px 0;
          background: #101828;
        }

        .featureIntro .eyebrow {
          color: #8fb6ff;
        }

        .featureIntro h2 {
          color: white;
        }

        .featureGrid {
          margin-top: 55px;
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          border-top: 1px solid
            rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid
            rgba(255, 255, 255, 0.1);
        }

        .featureCard {
          min-height: 230px;
          padding: 28px 24px;
          border-right: 1px solid
            rgba(255, 255, 255, 0.1);
        }

        .featureCard:last-child {
          border-right: 0;
        }

        .featureTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .featureTop > span {
          color: #697586;
          font-size: 8px;
          font-weight: 900;
        }

        .featureIcon {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background:
            rgba(255, 255, 255, 0.06);
          color: #8fb6ff;
        }

        .featureIcon :global(svg) {
          width: 16px;
          height: 16px;
        }

        .featureCard h3 {
          margin: 45px 0 0;
          color: #ffffff;
          font-size: 14px;
          font-weight: 720;
        }

        .featureCard p {
          margin: 10px 0 0;
          color: #8d99a9;
          font-size: 10px;
          line-height: 1.7;
        }

        /* ==================================================
           FINAL CTA
        ================================================== */

        .finalCtaSection {
          padding: 85px 24px;
          background: #ffffff;
        }

        .finalCta {
          max-width: 1180px;
          min-height: 210px;
          margin: auto;
          padding: 38px 42px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          border-radius: 24px;
          background:
            linear-gradient(
              120deg,
              #edf4ff,
              #f7f9fc
            );
          border: 1px solid #e3e8ef;
        }

        .finalLabel {
          color: #0f5fe9;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .finalCta h2 {
          max-width: 700px;
          margin: 11px 0 0;
          color: #101828;
          font-size:
            clamp(32px, 4.2vw, 50px);
          line-height: 1.05;
          letter-spacing: -2.6px;
          font-weight: 730;
        }

        .finalCta > a {
          min-height: 50px;
          padding: 0 19px;
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          border-radius: 12px;
          background: #0f5fe9;
          color: white;
          font-size: 11px;
          font-weight: 850;
          text-decoration: none;
        }

        .finalCta > a :global(svg) {
          width: 13px;
          height: 13px;
        }

        /* ==================================================
           CONTACT
        ================================================== */

        .contact {
          padding: 90px 24px;
          background: #f7f9fc;
        }

        .contactInner {
          max-width: 1120px;
          margin: auto;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 60px;
        }

        .contact h2 {
          margin: 13px 0 12px;
          color: #101828;
          font-size: 42px;
          letter-spacing: -2px;
        }

        .contact p {
          max-width: 650px;
          margin: 0;
          color: #667085;
          font-size: 13px;
          line-height: 1.7;
        }

        .contactButton {
          min-height: 48px;
          padding: 0 18px;
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          border-radius: 11px;
          background: #101828;
          color: white;
          font-size: 11px;
          font-weight: 820;
          text-decoration: none;
        }

        .contactButton :global(svg) {
          width: 13px;
          height: 13px;
        }

        /* ==================================================
           FOOTER
        ================================================== */

        .footer {
          background: #0a111e;
          color: white;
        }

        .footerInner {
          max-width: 1120px;
          min-height: 150px;
          margin: auto;
          padding: 40px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 35px;
        }

        .footerBrandBlock {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .footerLogo {
          width: 37px;
          height: 37px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #0f5fe9;
          color: white;
        }

        .footerLogo :global(svg) {
          width: 20px;
          height: 20px;
        }

        .footerBrandBlock strong,
        .footerBrandBlock span {
          display: block;
        }

        .footerBrandBlock strong {
          color: #ffffff;
          font-size: 13px;
        }

        .footerBrandBlock span {
          margin-top: 3px;
          color: #697586;
          font-size: 6px;
          font-weight: 800;
          letter-spacing: 1.6px;
        }

        .footerNav {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
        }

        .footerNav a,
        .footerNav span {
          color: #7f8a99;
          font-size: 9px;
          font-weight: 700;
          text-decoration: none;
        }

        .copyright {
          color: #566273;
          font-size: 8px;
        }

        /* ==================================================
           TABLET
        ================================================== */

        @media (max-width: 980px) {
          .heroInner,
          .emergencyCard {
            grid-template-columns: 1fr;
          }

          .heroInner {
            padding: 80px 0;
          }

          .heroVisual {
            margin-top: 20px;
          }

          .splitHeader {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .protectionRail {
            grid-template-columns:
              repeat(3, 1fr);
          }

          .protectionItem:nth-child(3n) {
            border-right: 0;
          }

          .protectionItem:nth-child(-n + 3) {
            border-bottom: 1px solid #edf0f4;
          }

          .accountBanner {
            grid-template-columns:
              auto 1fr auto;
          }

          .accountBanner > p {
            grid-column: 2 / -1;
          }

          .timeline {
            grid-template-columns:
              repeat(2, 1fr);
            gap: 28px;
          }

          .timelineConnector {
            display: none;
          }

          .featureGrid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .featureCard:nth-child(2) {
            border-right: 0;
          }

          .featureCard:nth-child(-n + 2) {
            border-bottom: 1px solid
              rgba(255, 255, 255, 0.1);
          }

          .contactInner,
          .footerInner {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        /* ==================================================
           MOBILE
        ================================================== */

        @media (max-width: 680px) {
          .header {
            width: calc(100% - 20px);
            min-height: 74px;
          }

          .brandCopy span {
            display: none;
          }

          .brandMark {
            width: 40px;
            height: 40px;
          }

          .brandCopy strong {
            font-size: 16px;
          }

          .languageSwitch {
            display: none;
          }

          .adminLink {
            padding: 0 9px;
          }

          .adminLink span {
            display: none;
          }

          .accountButton,
          .loginLink {
            min-height: 36px;
            padding: 0 10px;
            font-size: 9px;
          }

          .sectionShell,
          .heroInner {
            width: calc(100% - 30px);
          }

          .hero {
            min-height: unset;
          }

          .heroInner {
            min-height: unset;
            padding: 65px 0 75px;
          }

          .hero h1 {
            font-size: 45px;
            letter-spacing: -3.3px;
          }

          .heroDescription {
            font-size: 14px;
          }

          .heroActions {
            align-items: stretch;
            flex-direction: column;
          }

          .primaryCta,
          .secondaryCta {
            width: 100%;
          }

          .trustLine {
            gap: 13px;
          }

          .heroVisual {
            min-height: 470px;
          }

          .productCard {
            width: 290px;
            min-height: 410px;
          }

          .qrStage {
            height: 245px;
          }

          .qrFrame {
            width: 165px;
            height: 165px;
          }

          .floatingMessage {
            width: 205px;
            left: -5px;
            bottom: 35px;
          }

          .floatingLocation {
            top: 25px;
            right: -5px;
          }

          .protectionSection,
          .emergencySection,
          .howSection,
          .featuresSection {
            padding: 80px 0;
          }

          .sectionHeader h2,
          .featureIntro h2 {
            font-size: 38px;
            letter-spacing: -2.4px;
          }

          .protectionRail {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .protectionItem {
            border-right: 1px solid #edf0f4;
            border-bottom: 1px solid #edf0f4;
          }

          .protectionItem:nth-child(even) {
            border-right: 0;
          }

          .protectionItem:nth-last-child(-n + 2) {
            border-bottom: 0;
          }

          .accountBanner {
            grid-template-columns:
              auto 1fr;
          }

          .accountBanner > p {
            grid-column: 1 / -1;
          }

          .accountBanner > a {
            grid-column: 1 / -1;
            justify-content: center;
          }

          .emergencyCard {
            min-height: unset;
            padding: 30px 22px 45px;
            border-radius: 24px;
          }

          .emergencyCopy h2 {
            font-size: 40px;
            letter-spacing: -2.6px;
          }

          .emergencyList {
            grid-template-columns: 1fr;
          }

          .emergencyCta {
            width: 100%;
            justify-content: center;
          }

          .emergencyVisual {
            min-height: 430px;
            margin-top: 20px;
          }

          .medicalCard {
            width: 275px;
          }

          .braceletWrap {
            width: 265px;
            right: -35px;
          }

          .timeline {
            grid-template-columns: 1fr;
          }

          .featureGrid {
            grid-template-columns: 1fr;
          }

          .featureCard,
          .featureCard:nth-child(2) {
            border-right: 0;
            border-bottom: 1px solid
              rgba(255, 255, 255, 0.1);
          }

          .featureCard:last-child {
            border-bottom: 0;
          }

          .finalCtaSection {
            padding: 65px 15px;
          }

          .finalCta {
            min-height: unset;
            padding: 28px 22px;
            align-items: stretch;
            flex-direction: column;
          }

          .finalCta h2 {
            font-size: 35px;
          }

          .finalCta > a {
            width: 100%;
            justify-content: center;
          }

          .contact {
            padding: 70px 18px;
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

/* ==========================================================
   PREMIUM INLINE ICONS
========================================================== */

function LogoMark() {
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
      <path d="M15 15h3v3h3v3h-6z" />
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
      <path d="M4.5 21c.8-4.2 3.3-6.4 7.5-6.4s6.7 2.2 7.5 6.4" />
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
      <path d="M12 2.8 19 6v5.4c0 4.6-2.4 7.7-7 9.8-4.6-2.1-7-5.2-7-9.8V6z" />
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

function PlayIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m10 8.7 5.2 3.3L10 15.3z" />
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

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 12 4 4 8-8" />
    </svg>
  );
}

function QrPattern({
  compact = false,
}: {
  compact?: boolean;
}) {
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
        width: compact ? 52 : 116,
        height: compact ? 52 : 116,
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: compact ? 2 : 3,
      }}
    >
      {Array.from({ length: 49 }).map((_, index) => (
        <i
          key={index}
          style={{
            display: "block",
            borderRadius: compact ? 1 : 2,
            background: dark.includes(index)
              ? "#101828"
              : "#dfe5ec",
          }}
        />
      ))}
    </div>
  );
}

function ProtectionIcon({
  type,
}: {
  type: ProtectionType;
}) {
  if (type === "dog" || type === "cat") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <circle cx="12" cy="13" r="6" />

        {type === "dog" ? (
          <>
            <path d="M7.5 9 5 5.5v6M16.5 9 19 5.5v6" />
            <path d="M9.5 14h.01M14.5 14h.01M10 17c1.3 1 2.7 1 4 0" />
          </>
        ) : (
          <>
            <path d="m7 9 1-5 3 3M17 9l-1-5-3 3" />
            <path d="M9.5 14h.01M14.5 14h.01M12 15v2" />
          </>
        )}
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
