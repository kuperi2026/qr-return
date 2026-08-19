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
  { type: "luggage", ka: "ჩემოდანი", en: "Suitcase" },
  { type: "bag", ka: "ჩანთა", en: "Bag" },
];

const features = [
  {
    number: "01",
    icon: "chat",
    ka: "Live Chat",
    en: "Live Chat",
    kaText:
      "მპოვნელმა პირდაპირ QR RETURN-ის საშუალებით შეიძლება მოგწეროთ.",
    enText:
      "A finder can message you directly through QR RETURN.",
  },
  {
    number: "02",
    icon: "location",
    ka: "ლოკაციის გაზიარება",
    en: "Location Sharing",
    kaText:
      "მპოვნელმა ერთი მოქმედებით შეიძლება გაგიზიაროთ ნივთის ან ცხოველის მდებარეობა.",
    enText:
      "A finder can share the location of your pet or item in one step.",
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
    icon: "shield",
    ka: "პირადი მონაცემების კონტროლი",
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

  const accountHref = isLoggedIn
    ? "/account"
    : "/account/register";

  return (
    <main className="page">
      {/* HEADER */}

      <header className="header">
        <a href="#top" className="brand">
          <div className="brandLogo">
            <QrLogo />
          </div>

          <div className="brandText">
            <strong>QR RETURN</strong>
            <span>SMART LOST &amp; FOUND</span>
          </div>
        </a>

        <nav className="desktopNav">
          <a href="#how">
            {ka ? "როგორ მუშაობს" : "How it works"}
          </a>

          <a href="#features">
            {ka ? "ფუნქციები" : "Features"}
          </a>

          <a href="#emergency">
            Emergency ID
          </a>

          <a href="#contact">
            {ka ? "კონტაქტი" : "Contact"}
          </a>
        </nav>

        <div className="headerRight">
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

          {isLoggedIn ? (
            <a href="/account" className="headerButton">
              <UserIcon />
              <span>
                {ka ? "ჩემი ანგარიში" : "My Account"}
              </span>
            </a>
          ) : (
            <>
              <a href="/login" className="loginLink">
                {ka ? "შესვლა" : "Sign In"}
              </a>

              <a
                href="/account/register"
                className="headerButton"
              >
                {ka ? "რეგისტრაცია" : "Register"}
              </a>
            </>
          )}
        </div>
      </header>

      {/* HERO */}

      <section id="top" className="hero">
        <div className="heroGlow heroGlowOne" />
        <div className="heroGlow heroGlowTwo" />

        <div className="heroInner">
          <div className="heroContent">
            <div className="eyebrow">
              SMART LOST &amp; FOUND
            </div>

            <h1>
              {ka ? (
                <>
                  დაკარგვა არ ნიშნავს
                  <br />
                  <span>დამშვიდობებას.</span>
                </>
              ) : (
                <>
                  Lost doesn&apos;t have to
                  <br />
                  <span>mean gone.</span>
                </>
              )}
            </h1>

            <p className="heroDescription">
              {ka
                ? "QR RETURN აძლევს დაკარგულ ნივთს ან საყვარელ ცხოველს შენამდე დაბრუნების მარტივ გზას. მპოვნელს მხოლოდ QR კოდის დასკანერება სჭირდება — აპის და რეგისტრაციის გარეშე."
                : "QR RETURN gives lost pets and personal items a simple way back to you. The finder only needs to scan the QR code — no app and no registration required."}
            </p>

            <div className="heroActions">
              <a
                href={accountHref}
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
                <PlayIcon />

                <span>
                  {ka ? "როგორ მუშაობს" : "How it works"}
                </span>
              </a>
            </div>

            <div className="heroBenefits">
              <div>
                <CheckIcon />
                <span>
                  {ka
                    ? "აპლიკაცია არ სჭირდება"
                    : "No app required"}
                </span>
              </div>

              <div>
                <CheckIcon />
                <span>
                  {ka
                    ? "პირადი მონაცემების კონტროლი"
                    : "Privacy control"}
                </span>
              </div>

              <div>
                <CheckIcon />
                <span>Live Chat</span>
              </div>
            </div>
          </div>

          {/* PHONE PREVIEW */}

          <div className="visualArea">
            <div className="visualCircle" />

            <div className="phone">
              <div className="phoneNotch" />

              <div className="phoneScreen">
                <div className="phoneTop">
                  <div className="phoneLogo">
                    <QrLogo />
                  </div>

                  <div className="phoneLogoText">
                    <span>QR RETURN</span>
                    <strong>
                      {ka
                        ? "დაცული პროფილი"
                        : "Protected Profile"}
                    </strong>
                  </div>

                  <div className="status">
                    <i />
                    ACTIVE
                  </div>
                </div>

                <div className="lostBadge">
                  {ka ? "დაკარგული ძაღლი" : "LOST DOG"}
                </div>

                <div className="petProfile">
                  <div className="dogAvatar">
                    <DogIcon />
                  </div>

                  <div>
                    <h3>Toby</h3>

                    <p>
                      {ka
                        ? "მე დავიკარგე. გთხოვთ დამეხმაროთ ჩემს პატრონთან დაბრუნებაში."
                        : "I am lost. Please help me get back to my owner."}
                    </p>
                  </div>
                </div>

                <div className="phoneButtons">
                  <div className="phoneButton blue">
                    <ChatIcon />
                    <strong>Live Chat</strong>
                    <small>
                      {ka
                        ? "მიწერე პატრონს"
                        : "Message owner"}
                    </small>
                  </div>

                  <div className="phoneButton">
                    <LocationIcon />
                    <strong>
                      {ka ? "ლოკაცია" : "Location"}
                    </strong>
                    <small>
                      {ka ? "გააზიარე" : "Share"}
                    </small>
                  </div>
                </div>

                <div className="privacyCard">
                  <ShieldIcon />

                  <div>
                    <strong>
                      {ka
                        ? "მფლობელის მონაცემები დაცულია"
                        : "Owner information protected"}
                    </strong>

                    <small>
                      {ka
                        ? "ნაჩვენებია მხოლოდ ნებადართული ინფორმაცია"
                        : "Only approved information is visible"}
                    </small>
                  </div>
                </div>

                <div className="powered">
                  <QrLogo />
                  <span>Powered by QR RETURN</span>
                </div>
              </div>
            </div>

            <div className="floatingChat">
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

      {/* CATEGORIES */}

      <section className="categories">
        <div className="sectionShell">
          <div className="sectionHeading">
            <span className="sectionLabel">
              PROTECT WHAT MATTERS
            </span>

            <h2>
              {ka
                ? "ერთი QR RETURN. ბევრი შესაძლებლობა."
                : "One QR RETURN. Many possibilities."}
            </h2>

            <p>
              {ka
                ? "გამოიყენეთ ყოველდღიური ნივთებისა და საყვარელი ცხოველებისთვის."
                : "Use it for everyday items and the pets you love."}
            </p>
          </div>

          <div className="categoryGrid">
            {protectionItems.map((item, index) => (
              <div
                className="categoryCard"
                key={item.type}
              >
                <div className="categoryNumber">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="categoryIcon">
                  <ProtectionIcon type={item.type} />
                </div>

                <strong>
                  {ka ? item.ka : item.en}
                </strong>

                <span>QR PROFILE</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW */}

      <section id="how" className="howSection">
        <div className="sectionShell">
          <div className="sectionHeading centered">
            <span className="sectionLabel">
              SIMPLE BY DESIGN
            </span>

            <h2>
              {ka
                ? "როგორ მუშაობს QR RETURN"
                : "How QR RETURN works"}
            </h2>

            <p>
              {ka
                ? "ოთხი მარტივი ნაბიჯი დაკარგულიდან დაბრუნებამდე."
                : "Four simple steps from lost to returned."}
            </p>
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
                  : "Create account"}
              </strong>

              <p>
                {ka
                  ? "ერთი Owner Account ყველა QR პროფილის სამართავად."
                  : "One Owner Account to manage all QR profiles."}
              </p>
            </div>

            <div className="stepLine" />

            <div className="step">
              <span className="stepNumber">02</span>

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
              <span className="stepNumber">03</span>

              <div className="stepIcon">
                <QrLogo />
              </div>

              <strong>
                {ka
                  ? "მიამაგრეთ QR"
                  : "Attach QR"}
              </strong>

              <p>
                {ka
                  ? "უნიკალური QR კოდი უკავშირდება კონკრეტულ პროფილს."
                  : "A unique QR code connects to one specific profile."}
              </p>
            </div>

            <div className="stepLine" />

            <div className="step">
              <span className="stepNumber">04</span>

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
                  ? "Live Chat, ლოკაცია ან თქვენს მიერ არჩეული საკონტაქტო მეთოდი."
                  : "Live Chat, location or your selected contact method."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SCAN FLOW */}

      <section className="scanSection">
        <div className="sectionShell">
          <div className="scanCard">
            <div className="scanCopy">
              <span className="sectionLabel light">
                ONE SCAN. NO FRICTION.
              </span>

              <h2>
                {ka
                  ? "მპოვნელს არაფერი აქვს დასარეგისტრირებელი."
                  : "The finder has nothing to register."}
              </h2>

              <p>
                {ka
                  ? "QR-ის დასკანერებისთანავე იხსნება თქვენ მიერ კონტროლირებადი პროფილი. მპოვნელს შეუძლია დაგიკავშირდეთ ან ერთი მოქმედებით გაგიზიაროთ მდებარეობა."
                  : "Scanning the QR instantly opens a profile controlled by you. The finder can contact you or share a location in one step."}
              </p>

              <div className="scanChecks">
                <div>
                  <CheckIcon />
                  <span>
                    {ka
                      ? "აპის გარეშე"
                      : "No app"}
                  </span>
                </div>

                <div>
                  <CheckIcon />
                  <span>
                    {ka
                      ? "რეგისტრაციის გარეშე"
                      : "No registration"}
                  </span>
                </div>

                <div>
                  <CheckIcon />
                  <span>
                    {ka
                      ? "ერთი სკანით"
                      : "One scan"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flow">
              <div className="flowItem">
                <ScanIcon />
                <span>01</span>
                <strong>
                  {ka
                    ? "დაასკანერე"
                    : "Scan"}
                </strong>
              </div>

              <ArrowIcon />

              <div className="flowItem">
                <UserIcon />
                <span>02</span>
                <strong>
                  {ka
                    ? "ნახე პროფილი"
                    : "View Profile"}
                </strong>
              </div>

              <ArrowIcon />

              <div className="flowItem highlighted">
                <ChatIcon />
                <span>03</span>
                <strong>
                  {ka
                    ? "დაუკავშირდი"
                    : "Connect"}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}

      <section
        id="features"
        className="featuresSection"
      >
        <div className="sectionShell">
          <div className="sectionHeading darkHeading">
            <span className="sectionLabel light">
              BUILT AROUND CONTROL
            </span>

            <h2>
              {ka
                ? "მარტივი მპოვნელისთვის. კონტროლირებადი თქვენთვის."
                : "Simple for the finder. Controlled by you."}
            </h2>

            <p>
              {ka
                ? "თქვენ წყვეტთ, როგორ დაგიკავშირდებიან და რა ინფორმაცია გამოჩნდება."
                : "You decide how people can reach you and which information is visible."}
            </p>
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
                    {feature.icon === "chat" && (
                      <ChatIcon />
                    )}

                    {feature.icon === "location" && (
                      <LocationIcon />
                    )}

                    {feature.icon === "reward" && (
                      <RewardIcon />
                    )}

                    {feature.icon === "shield" && (
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

      {/* EMERGENCY */}

      <section
        id="emergency"
        className="emergencySection"
      >
        <div className="sectionShell">
          <div className="emergencyCard">
            <div className="emergencyPlus">
              +
            </div>

            <div className="emergencyContent">
              <span>QR RETURN EMERGENCY ID</span>

              <h2>
                {ka
                  ? "საგანგებო ინფორმაცია მაშინ, როცა წამებიც მნიშვნელოვანია."
                  : "Essential information when every second matters."}
              </h2>

              <p>
                {ka
                  ? "Emergency Contact, Medical Information და Privacy Control ერთ დაცულ QR პროფილში."
                  : "Emergency Contact, Medical Information and Privacy Control in one protected QR profile."}
              </p>
            </div>

            <a
              href={accountHref}
              className="emergencyButton"
            >
              <span>
                {ka
                  ? "იხილე ანგარიშში"
                  : "View in account"}
              </span>

              <ArrowIcon />
            </a>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}

      <section className="finalCta">
        <div className="finalGlow" />

        <div className="finalInner">
          <span className="sectionLabel whiteLabel">
            QR RETURN
          </span>

          <h2>
            {ka
              ? "მიეცი მნიშვნელოვან ნივთებს შენამდე დაბრუნების გზა."
              : "Give what matters a way back to you."}
          </h2>

          <p>
            {ka
              ? "შექმენით ანგარიში, დაამატეთ QR პროფილი და აკონტროლეთ ყველაფერი ერთი სივრციდან."
              : "Create an account, add a QR profile and manage everything from one place."}
          </p>

          <a
            href={accountHref}
            className="finalButton"
          >
            <span>
              {isLoggedIn
                ? ka
                  ? "ჩემი ანგარიში"
                  : "My Account"
                : ka
                  ? "დაიწყე QR RETURN-ით"
                  : "Get started"}
            </span>

            <ArrowIcon />
          </a>
        </div>
      </section>

      {/* CONTACT */}

      <section id="contact" className="contact">
        <div className="sectionShell contactInner">
          <div>
            <span className="sectionLabel">
              CONTACT
            </span>

            <h2>
              {ka
                ? "დაგვიკავშირდით"
                : "Contact us"}
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
              {ka
                ? "როგორ მუშაობს"
                : "How it works"}
            </a>

            <a href="#features">
              {ka ? "ფუნქციები" : "Features"}
            </a>

            <a href="#contact">
              {ka ? "კონტაქტი" : "Contact"}
            </a>
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
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
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
            Arial,
            sans-serif;
        }

        /* HEADER */

        .header {
          width: calc(100% - 48px);
          max-width: 1240px;
          height: 86px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border-bottom: 1px solid #edf0f4;
          position: relative;
          z-index: 30;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
          text-decoration: none;
        }

        .brandLogo {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: #0b5fff;
          color: white;
          box-shadow: 0 9px 24px
            rgba(11, 95, 255, 0.2);
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
          letter-spacing: -0.5px;
        }

        .brandText span {
          margin-top: 3px;
          color: #98a2b3;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.8px;
        }

        .desktopNav {
          display: flex;
          align-items: center;
          gap: 27px;
        }

        .desktopNav a {
          color: #667085;
          font-size: 11px;
          font-weight: 750;
          text-decoration: none;
        }

        .desktopNav a:hover {
          color: #0b5fff;
        }

        .headerRight {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .languageSwitch {
          padding: 3px;
          display: flex;
          align-items: center;
          border-radius: 10px;
          background: #f2f4f7;
        }

        .languageSwitch button {
          width: 40px;
          height: 31px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #98a2b3;
          font-size: 8px;
          font-weight: 900;
          cursor: pointer;
        }

        .languageSwitch button.active {
          background: white;
          color: #0b5fff;
          box-shadow: 0 2px 7px
            rgba(16, 24, 40, 0.08);
        }

        .loginLink {
          min-height: 40px;
          padding: 0 11px;
          display: inline-flex;
          align-items: center;
          color: #344054;
          font-size: 11px;
          font-weight: 800;
          text-decoration: none;
        }

        .headerButton {
          min-height: 41px;
          padding: 0 15px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border-radius: 11px;
          background: #0b5fff;
          color: white;
          font-size: 11px;
          font-weight: 800;
          text-decoration: none;
          box-shadow: 0 7px 18px
            rgba(11, 95, 255, 0.16);
        }

        .headerButton :global(svg) {
          width: 14px;
          height: 14px;
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
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 2.2px;
        }

        /* HERO */

        .hero {
          min-height: 690px;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid #edf0f4;
        }

        .heroInner {
          width: calc(100% - 48px);
          max-width: 1240px;
          min-height: 690px;
          margin: auto;
          display: grid;
          grid-template-columns: 1fr 0.9fr;
          align-items: center;
          gap: 85px;
          position: relative;
          z-index: 2;
        }

        .heroGlow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .heroGlowOne {
          width: 570px;
          height: 570px;
          top: -250px;
          right: -180px;
          background: radial-gradient(
            circle,
            rgba(11, 95, 255, 0.12),
            transparent 70%
          );
        }

        .heroGlowTwo {
          width: 400px;
          height: 400px;
          bottom: -230px;
          left: -200px;
          background: radial-gradient(
            circle,
            rgba(85, 70, 220, 0.07),
            transparent 70%
          );
        }

        .heroContent {
          max-width: 680px;
        }

        .hero h1 {
          margin: 17px 0 0;
          color: #09111f;
          font-size: clamp(
            48px,
            5.3vw,
            68px
          );
          line-height: 1.02;
          letter-spacing: -3.5px;
          font-weight: 780;
        }

        .hero h1 span {
          color: #0b5fff;
        }

        .heroDescription {
          max-width: 610px;
          margin: 25px 0 0;
          color: #667085;
          font-size: 16px;
          line-height: 1.75;
        }

        .heroActions {
          margin-top: 31px;
          display: flex;
          gap: 10px;
        }

        .primaryButton,
        .secondaryButton {
          min-height: 52px;
          padding: 0 21px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 850;
          text-decoration: none;
          transition: 0.2s ease;
        }

        .primaryButton {
          background: #0b5fff;
          color: white;
          box-shadow: 0 10px 25px
            rgba(11, 95, 255, 0.18);
        }

        .primaryButton:hover {
          transform: translateY(-2px);
        }

        .secondaryButton {
          border: 1px solid #e2e7ee;
          background: white;
          color: #344054;
        }

        .primaryButton :global(svg),
        .secondaryButton :global(svg) {
          width: 14px;
          height: 14px;
        }

        .heroBenefits {
          margin-top: 29px;
          display: flex;
          flex-wrap: wrap;
          gap: 19px;
        }

        .heroBenefits > div {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #7b8797;
          font-size: 10px;
          font-weight: 700;
        }

        .heroBenefits :global(svg) {
          width: 14px;
          height: 14px;
          color: #0b5fff;
        }

        /* PHONE */

        .visualArea {
          min-height: 570px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .visualCircle {
          width: 480px;
          height: 480px;
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(11, 95, 255, 0.13),
            rgba(11, 95, 255, 0.02) 52%,
            transparent 72%
          );
        }

        .phone {
          width: 285px;
          height: 545px;
          padding: 9px;
          position: relative;
          z-index: 3;
          border-radius: 44px;
          background: #09111f;
          box-shadow:
            0 48px 105px
              rgba(17, 39, 70, 0.21),
            0 4px 14px
              rgba(16, 24, 40, 0.08);
          transform: perspective(1300px)
            rotateY(-4deg);
        }

        .phoneNotch {
          width: 77px;
          height: 19px;
          position: absolute;
          top: 15px;
          left: 50%;
          z-index: 6;
          transform: translateX(-50%);
          border-radius: 999px;
          background: #09111f;
        }

        .phoneScreen {
          height: 100%;
          padding: 34px 17px 18px;
          border-radius: 36px;
          background: linear-gradient(
            180deg,
            #ffffff,
            #f6f9fd
          );
        }

        .phoneTop {
          display: flex;
          align-items: center;
        }

        .phoneLogo {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: #0b5fff;
          color: white;
        }

        .phoneLogo :global(svg) {
          width: 16px;
          height: 16px;
        }

        .phoneLogoText {
          margin-left: 7px;
        }

        .phoneLogoText span,
        .phoneLogoText strong {
          display: block;
        }

        .phoneLogoText span {
          color: #0b5fff;
          font-size: 6.5px;
          font-weight: 900;
          letter-spacing: 0.7px;
        }

        .phoneLogoText strong {
          margin-top: 2px;
          color: #344054;
          font-size: 8px;
        }

        .status {
          margin-left: auto;
          padding: 6px 7px;
          display: flex;
          align-items: center;
          gap: 4px;
          border-radius: 999px;
          background: #ecfdf3;
          color: #027a48;
          font-size: 6px;
          font-weight: 900;
        }

        .status i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #12b76a;
        }

        .lostBadge {
          width: max-content;
          margin-top: 27px;
          padding: 6px 8px;
          border-radius: 999px;
          background: #fff0f1;
          color: #c4313a;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.7px;
        }

        .petProfile {
          margin-top: 11px;
          padding: 17px 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid #e7ebf0;
          border-radius: 18px;
          background: white;
        }

        .dogAvatar {
          width: 60px;
          height: 60px;
          flex: 0 0 60px;
          display: grid;
          place-items: center;
          border-radius: 17px;
          background: #eef4ff;
          color: #26364c;
        }

        .dogAvatar :global(svg) {
          width: 33px;
          height: 33px;
        }

        .petProfile h3 {
          margin: 0;
          font-size: 18px;
        }

        .petProfile p {
          margin: 5px 0 0;
          color: #7b8797;
          font-size: 8px;
          line-height: 1.5;
        }

        .phoneButtons {
          margin-top: 11px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .phoneButton {
          min-height: 75px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          border: 1px solid #e5eaf0;
          border-radius: 15px;
          background: white;
          color: #667085;
        }

        .phoneButton.blue {
          background: #0b5fff;
          border-color: #0b5fff;
          color: white;
        }

        .phoneButton :global(svg) {
          width: 17px;
          height: 17px;
        }

        .phoneButton strong {
          margin-top: 9px;
          font-size: 8.5px;
        }

        .phoneButton small {
          margin-top: 2px;
          font-size: 7px;
          opacity: 0.72;
        }

        .privacyCard {
          margin-top: 11px;
          padding: 11px;
          display: flex;
          align-items: center;
          gap: 9px;
          border-radius: 14px;
          background: #edf2f7;
        }

        .privacyCard :global(svg) {
          width: 18px;
          height: 18px;
          color: #0b5fff;
        }

        .privacyCard strong,
        .privacyCard small {
          display: block;
        }

        .privacyCard strong {
          color: #344054;
          font-size: 8px;
        }

        .privacyCard small {
          margin-top: 2px;
          color: #98a2b3;
          font-size: 6.5px;
        }

        .powered {
          margin-top: 19px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          color: #a1a9b5;
        }

        .powered :global(svg) {
          width: 10px;
          height: 10px;
        }

        .powered span {
          font-size: 6px;
          font-weight: 800;
        }

        .floatingChat,
        .floatingLocation {
          position: absolute;
          z-index: 5;
          border: 1px solid #e4e8ee;
          background: rgba(
            255,
            255,
            255,
            0.97
          );
          box-shadow: 0 18px 45px
            rgba(29, 52, 85, 0.12);
          backdrop-filter: blur(18px);
        }

        .floatingChat {
          width: 220px;
          min-height: 69px;
          left: -35px;
          bottom: 70px;
          padding: 11px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-radius: 15px;
        }

        .floatingIcon {
          width: 39px;
          height: 39px;
          flex: 0 0 39px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: #edf4ff;
          color: #0b5fff;
        }

        .floatingIcon :global(svg) {
          width: 17px;
          height: 17px;
        }

        .floatingChat span,
        .floatingChat strong,
        .floatingLocation span,
        .floatingLocation strong {
          display: block;
        }

        .floatingChat span,
        .floatingLocation span {
          color: #98a2b3;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 0.8px;
        }

        .floatingChat strong {
          margin-top: 3px;
          color: #344054;
          font-size: 10px;
        }

        .floatingChat > i {
          width: 7px;
          height: 7px;
          margin-left: auto;
          border-radius: 50%;
          background: #12b76a;
        }

        .floatingLocation {
          min-width: 143px;
          top: 86px;
          right: -18px;
          padding: 11px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: 14px;
        }

        .floatingLocation :global(svg) {
          width: 20px;
          height: 20px;
          color: #0b5fff;
        }

        .floatingLocation strong {
          margin-top: 2px;
          color: #344054;
          font-size: 9px;
        }

        /* SECTIONS */

        .categories {
          padding: 105px 0;
          background: #f7f9fc;
        }

        .sectionHeading {
          max-width: 780px;
        }

        .sectionHeading.centered {
          margin: auto;
          text-align: center;
        }

        .sectionHeading h2 {
          margin: 13px 0 0;
          color: #101828;
          font-size: clamp(
            36px,
            4.6vw,
            53px
          );
          line-height: 1.06;
          letter-spacing: -2.7px;
        }

        .sectionHeading p {
          margin: 15px 0 0;
          color: #667085;
          font-size: 14px;
          line-height: 1.7;
        }

        .categoryGrid {
          margin-top: 48px;
          display: grid;
          grid-template-columns: repeat(
            6,
            1fr
          );
          overflow: hidden;
          border: 1px solid #e1e6ed;
          border-radius: 23px;
          background: white;
          box-shadow: 0 15px 42px
            rgba(20, 45, 80, 0.045);
        }

        .categoryCard {
          min-height: 190px;
          padding: 20px;
          border-right: 1px solid #edf0f4;
        }

        .categoryCard:last-child {
          border-right: 0;
        }

        .categoryNumber {
          color: #bcc4cf;
          font-size: 8px;
          font-weight: 900;
        }

        .categoryIcon {
          width: 58px;
          height: 58px;
          margin-top: 28px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          background: #f1f5f9;
          color: #26364c;
        }

        .categoryIcon :global(svg) {
          width: 29px;
          height: 29px;
        }

        .categoryCard strong {
          display: block;
          margin-top: 19px;
          color: #26364c;
          font-size: 13px;
        }

        .categoryCard > span {
          display: block;
          margin-top: 4px;
          color: #b4bcc8;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        /* HOW */

        .howSection {
          padding: 110px 0;
          background: white;
        }

        .steps {
          margin-top: 62px;
          display: grid;
          grid-template-columns:
            1fr auto 1fr auto 1fr auto 1fr;
          align-items: start;
        }

        .stepNumber {
          color: #b8c0cb;
          font-size: 8px;
          font-weight: 900;
        }

        .stepIcon {
          width: 49px;
          height: 49px;
          margin-top: 14px;
          display: grid;
          place-items: center;
          border: 1px solid #e2e7ee;
          border-radius: 14px;
          color: #0b5fff;
          background: white;
        }

        .stepIcon :global(svg) {
          width: 19px;
          height: 19px;
        }

        .step strong {
          display: block;
          margin-top: 18px;
          color: #26364c;
          font-size: 13px;
        }

        .step p {
          max-width: 205px;
          margin: 7px 0 0;
          color: #7b8797;
          font-size: 10.5px;
          line-height: 1.6;
        }

        .stepLine {
          width: 55px;
          height: 1px;
          margin: 38px 16px 0;
          background: #e1e6ed;
        }

        /* SCAN */

        .scanSection {
          padding: 85px 0;
          background: #f7f9fc;
        }

        .scanCard {
          min-height: 390px;
          padding: 52px;
          display: grid;
          grid-template-columns: 0.9fr 1fr;
          align-items: center;
          gap: 75px;
          overflow: hidden;
          border-radius: 28px;
          background: #0d1727;
          color: white;
          box-shadow: 0 30px 70px
            rgba(10, 24, 45, 0.12);
        }

        .sectionLabel.light {
          color: #8eb5ff;
        }

        .scanCopy h2 {
          margin: 14px 0 0;
          font-size: clamp(
            34px,
            4vw,
            48px
          );
          line-height: 1.06;
          letter-spacing: -2.4px;
        }

        .scanCopy p {
          margin: 18px 0 0;
          color: #a4afbf;
          font-size: 13px;
          line-height: 1.72;
        }

        .scanChecks {
          margin-top: 24px;
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
        }

        .scanChecks > div {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #dce5f1;
          font-size: 10px;
        }

        .scanChecks :global(svg) {
          width: 15px;
          height: 15px;
          color: #8db4ff;
        }

        .flow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .flow > :global(svg) {
          width: 22px;
          height: 22px;
          color: #5d6a7d;
        }

        .flowItem {
          width: 125px;
          min-height: 150px;
          padding: 17px;
          border-radius: 17px;
          border: 1px solid
            rgba(255, 255, 255, 0.11);
          background: rgba(
            255,
            255,
            255,
            0.05
          );
        }

        .flowItem.highlighted {
          background: rgba(
            11,
            95,
            255,
            0.22
          );
          border-color: rgba(
            95,
            145,
            255,
            0.36
          );
        }

        .flowItem > :global(svg) {
          width: 22px;
          height: 22px;
          color: #94b6ff;
        }

        .flowItem span {
          display: block;
          margin-top: 35px;
          color: #6f7c8f;
          font-size: 7px;
          font-weight: 900;
        }

        .flowItem strong {
          display: block;
          margin-top: 5px;
          font-size: 11px;
        }

        /* FEATURES */

        .featuresSection {
          padding: 110px 0;
          background: #0d1523;
        }

        .darkHeading h2 {
          color: white;
        }

        .darkHeading p {
          color: #8b97a8;
        }

        .featureGrid {
          margin-top: 50px;
          display: grid;
          grid-template-columns: repeat(
            4,
            1fr
          );
          border-top: 1px solid
            rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid
            rgba(255, 255, 255, 0.1);
        }

        .featureCard {
          min-height: 235px;
          padding: 26px 23px;
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
          color: #657184;
          font-size: 8px;
          font-weight: 900;
        }

        .featureIcon {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: rgba(
            255,
            255,
            255,
            0.06
          );
          color: #8cb3ff;
        }

        .featureIcon :global(svg) {
          width: 16px;
          height: 16px;
        }

        .featureCard h3 {
          margin: 39px 0 0;
          color: white;
          font-size: 14px;
        }

        .featureCard p {
          margin: 9px 0 0;
          color: #8b97a7;
          font-size: 10.5px;
          line-height: 1.7;
        }

        /* EMERGENCY */

        .emergencySection {
          padding: 80px 0;
          background: white;
        }

        .emergencyCard {
          min-height: 145px;
          padding: 24px 26px;
          display: grid;
          grid-template-columns:
            auto 1fr auto;
          align-items: center;
          gap: 18px;
          border: 1px solid #eedbde;
          border-radius: 21px;
          background: linear-gradient(
            115deg,
            #fff8f8,
            #ffffff
          );
        }

        .emergencyPlus {
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: #e5484d;
          color: white;
          font-size: 31px;
        }

        .emergencyContent > span {
          color: #b4232d;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.3px;
        }

        .emergencyContent h2 {
          margin: 5px 0 0;
          color: #344054;
          font-size: 15px;
        }

        .emergencyContent p {
          margin: 5px 0 0;
          color: #7b8797;
          font-size: 10.5px;
        }

        .emergencyButton {
          min-height: 43px;
          padding: 0 15px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border-radius: 10px;
          background: #e5484d;
          color: white;
          font-size: 10px;
          font-weight: 800;
          text-decoration: none;
        }

        .emergencyButton :global(svg) {
          width: 12px;
          height: 12px;
        }

        /* CTA */

        .finalCta {
          min-height: 430px;
          padding: 90px 24px;
          display: grid;
          place-items: center;
          position: relative;
          overflow: hidden;
          background: #0b5fff;
          text-align: center;
        }

        .finalGlow {
          width: 650px;
          height: 650px;
          position: absolute;
          top: -430px;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.24),
            transparent 68%
          );
        }

        .finalInner {
          max-width: 760px;
          position: relative;
          z-index: 2;
        }

        .whiteLabel {
          color: #cfddff;
        }

        .finalInner h2 {
          margin: 14px 0 0;
          color: white;
          font-size: clamp(
            38px,
            5vw,
            57px
          );
          line-height: 1.05;
          letter-spacing: -2.8px;
        }

        .finalInner p {
          max-width: 600px;
          margin: 19px auto 0;
          color: #d6e2ff;
          font-size: 14px;
          line-height: 1.7;
        }

        .finalButton {
          min-height: 52px;
          margin-top: 29px;
          padding: 0 21px;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          border-radius: 12px;
          background: white;
          color: #0b5fff;
          font-size: 12px;
          font-weight: 850;
          text-decoration: none;
          box-shadow: 0 12px 30px
            rgba(0, 30, 100, 0.17);
        }

        .finalButton :global(svg) {
          width: 14px;
          height: 14px;
        }

        /* CONTACT */

        .contact {
          padding: 85px 0;
          background: #f7f9fc;
        }

        .contactInner {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 50px;
        }

        .contact h2 {
          margin: 11px 0 9px;
          font-size: 39px;
          letter-spacing: -1.8px;
        }

        .contact p {
          max-width: 600px;
          margin: 0;
          color: #667085;
          font-size: 12px;
          line-height: 1.7;
        }

        .contactButton {
          min-height: 47px;
          padding: 0 17px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 11px;
          background: #101828;
          color: white;
          font-size: 10px;
          font-weight: 800;
          text-decoration: none;
        }

        .contactButton :global(svg) {
          width: 13px;
          height: 13px;
        }

        /* FOOTER */

        .footer {
          background: #09111d;
          color: white;
        }

        .footerInner {
          width: calc(100% - 48px);
          max-width: 1120px;
          min-height: 145px;
          margin: auto;
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
          width: 37px;
          height: 37px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #0b5fff;
          color: white;
        }

        .footerLogo :global(svg) {
          width: 20px;
          height: 20px;
        }

        .footerBrand strong,
        .footerBrand span {
          display: block;
        }

        .footerBrand strong {
          font-size: 13px;
        }

        .footerBrand span {
          margin-top: 3px;
          color: #667386;
          font-size: 6px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .footerLinks {
          display: flex;
          gap: 22px;
        }

        .footerLinks a {
          color: #7c8797;
          font-size: 9px;
          font-weight: 700;
          text-decoration: none;
        }

        .copyright {
          color: #586475;
          font-size: 8px;
        }

        /* TABLET */

        @media (max-width: 1000px) {
          .desktopNav {
            display: none;
          }

          .heroInner {
            grid-template-columns: 1fr;
            padding: 70px 0;
          }

          .visualArea {
            margin-top: 10px;
          }

          .categoryGrid {
            grid-template-columns: repeat(
              3,
              1fr
            );
          }

          .categoryCard {
            border-bottom: 1px solid
              #edf0f4;
          }

          .categoryCard:nth-child(3n) {
            border-right: 0;
          }

          .categoryCard:nth-last-child(-n + 3) {
            border-bottom: 0;
          }

          .steps {
            grid-template-columns: repeat(
              2,
              1fr
            );
            gap: 32px;
          }

          .stepLine {
            display: none;
          }

          .scanCard {
            grid-template-columns: 1fr;
          }

          .featureGrid {
            grid-template-columns: repeat(
              2,
              1fr
            );
          }

          .featureCard:nth-child(2) {
            border-right: 0;
          }

          .featureCard:nth-child(-n + 2) {
            border-bottom: 1px solid
              rgba(255, 255, 255, 0.1);
          }
        }

        /* MOBILE */

        @media (max-width: 650px) {
          .header {
            width: calc(100% - 20px);
            height: 74px;
          }

          .brandText span {
            display: none;
          }

          .brandLogo {
            width: 37px;
            height: 37px;
          }

          .brandText strong {
            font-size: 14px;
          }

          .loginLink {
            display: none;
          }

          .headerButton {
            min-height: 35px;
            padding: 0 9px;
            font-size: 8.5px;
          }

          .languageSwitch button {
            width: 29px;
            height: 28px;
            font-size: 7px;
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
            padding: 60px 0 70px;
            gap: 20px;
          }

          .hero h1 {
            font-size: 42px;
            letter-spacing: -2.5px;
          }

          .heroDescription {
            font-size: 14px;
          }

          .heroActions {
            flex-direction: column;
          }

          .primaryButton,
          .secondaryButton {
            width: 100%;
          }

          .visualArea {
            min-height: 510px;
          }

          .phone {
            width: 245px;
            height: 485px;
          }

          .floatingChat {
            width: 185px;
            left: 0;
            bottom: 42px;
          }

          .floatingLocation {
            right: 0;
            top: 58px;
          }

          .categories,
          .howSection,
          .featuresSection {
            padding: 78px 0;
          }

          .sectionHeading h2 {
            font-size: 35px;
            letter-spacing: -2px;
          }

          .categoryGrid {
            grid-template-columns: repeat(
              2,
              1fr
            );
          }

          .categoryCard {
            min-height: 165px;
            padding: 17px;
            border-right: 1px solid
              #edf0f4;
            border-bottom: 1px solid
              #edf0f4;
          }

          .categoryCard:nth-child(3n) {
            border-right: 1px solid
              #edf0f4;
          }

          .categoryCard:nth-child(even) {
            border-right: 0;
          }

          .categoryCard:nth-last-child(-n + 2) {
            border-bottom: 0;
          }

          .steps {
            grid-template-columns: 1fr;
          }

          .step p {
            max-width: 100%;
          }

          .scanSection {
            padding: 65px 0;
          }

          .scanCard {
            padding: 32px 21px;
            border-radius: 23px;
          }

          .scanCopy h2 {
            font-size: 35px;
          }

          .flow {
            display: grid;
            grid-template-columns: 1fr;
          }

          .flow > :global(svg) {
            display: none;
          }

          .flowItem {
            width: 100%;
            min-height: 115px;
          }

          .flowItem span {
            margin-top: 22px;
          }

          .featureGrid {
            grid-template-columns: 1fr;
          }

          .featureCard,
          .featureCard:nth-child(2) {
            min-height: auto;
            border-right: 0;
            border-bottom: 1px solid
              rgba(255, 255, 255, 0.1);
          }

          .featureCard:last-child {
            border-bottom: 0;
          }

          .emergencySection {
            padding: 55px 0;
          }

          .emergencyCard {
            padding: 18px;
            grid-template-columns: auto 1fr;
          }

          .emergencyButton {
            grid-column: 1 / -1;
            justify-content: center;
          }

          .emergencyContent h2 {
            font-size: 13px;
          }

          .finalCta {
            min-height: 400px;
            padding: 75px 20px;
          }

          .finalInner h2 {
            font-size: 39px;
            letter-spacing: -2.2px;
          }

          .contact {
            padding: 65px 0;
          }

          .contactInner {
            flex-direction: column;
            align-items: flex-start;
          }

          .contactButton {
            width: 100%;
            justify-content: center;
          }

          .footerInner {
            min-height: 180px;
            padding: 35px 0;
            flex-direction: column;
            align-items: flex-start;
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
      strokeLinecap="round"
      strokeLinejoin="round"
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
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21c.8-4.1 3.3-6.3 7.5-6.3s6.7 2.2 7.5 6.3" />
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
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m10 8 6 4-6 4z" />
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
      strokeLinecap="round"
      strokeLinejoin="round"
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
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 8V5a1 1 0 0 1 1-1h3" />
      <path d="M16 4h3a1 1 0 0 1 1 1v3" />
      <path d="M20 16v3a1 1 0 0 1-1 1h-3" />
      <path d="M8 20H5a1 1 0 0 1-1-1v-3" />
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
      strokeLinecap="round"
      strokeLinejoin="round"
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
      strokeLinecap="round"
      strokeLinejoin="round"
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
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9h12v11H6z" />
      <path d="M4 6h16v3H4z" />
      <path d="M12 6v14" />
      <path d="M12 6c-1.2-3-5-3.4-5.5-.9-.4 2 2.3 2.3 5.5.9Z" />
      <path d="M12 6c1.2-3 5-3.4 5.5-.9.4 2-2.3 2.3-5.5.9Z" />
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
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
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
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="13" r="6" />
      <path d="M7.5 9 5 5.5v6" />
      <path d="M16.5 9 19 5.5v6" />
      <path d="M9.5 14h.01" />
      <path d="M14.5 14h.01" />
      <path d="M10 17c1.3 1 2.7 1 4 0" />
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
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="13" r="6" />
        <path d="m7 9 1-5 3 3" />
        <path d="m17 9-1-5-3 3" />
        <path d="M9.5 14h.01" />
        <path d="M14.5 14h.01" />
        <path d="M12 15v2" />
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
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="8" cy="10" r="4" />
        <path d="m11 13 8 8" />
        <path d="m15 17 2-2" />
        <path d="m18 20 2-2" />
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
        strokeLinecap="round"
        strokeLinejoin="round"
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
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect
          x="5"
          y="6"
          width="14"
          height="14"
          rx="2"
        />
        <path d="M9 6V4h6v2" />
        <path d="M9 10v6" />
        <path d="M15 10v6" />
        <path d="M8 22h.01" />
        <path d="M16 22h.01" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 8h14l1 12H4z" />
      <path d="M8 8a4 4 0 0 1 8 0" />
    </svg>
  );
}
