"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import SupportLauncher from "./components/SupportLauncher";
import { supabase } from "@/lib/supabase";

type Language = "ka" | "en";

const products = [
  {
    id: "dog",
    ka: "ძაღლი",
    en: "Dog",
    image:
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=500&q=88",
    className: "productDog",
  },
  {
    id: "cat",
    ka: "კატა",
    en: "Cat",
    image:
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=500&q=88",
    className: "productCat",
  },
  {
    id: "keys",
    ka: "სახლის + მანქანის გასაღები",
    en: "Home + Car Keys",
    image: "",
    className: "productKeys",
  },
  {
    id: "wallet",
    ka: "საფულე",
    en: "Wallet",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=500&q=88",
    className: "productWallet",
  },
  {
    id: "luggage",
    ka: "ჩემოდანი",
    en: "Luggage",
    image:
      "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=500&q=88",
    className: "productLuggage",
  },
  {
    id: "bag",
    ka: "ჩანთა",
    en: "Bag",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=88",
    className: "productBag",
  },
];

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("ka");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const ka = language === "ka";

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoggedIn(false);
        setIsAdmin(false);
        return;
      }

      setIsLoggedIn(true);

      const { data } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      setIsAdmin(Boolean(data));
    }

    void loadUser();

    const { data } = supabase.auth.onAuthStateChange(() => {
      void loadUser();
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <main className="page">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="header">
        <a href="/" className="brand">
          <div className="brandMark">
            <QrIcon />
          </div>

          <div className="brandText">
            <strong>QR RETURN</strong>
            <span>SMART LOST &amp; FOUND</span>
          </div>
        </a>

        <div className="headerRight">
          <nav className="nav">
            {isAdmin && (
              <a href="/admin" className="adminButton">
                <AdminIcon />
                <span>Admin Panel</span>
              </a>
            )}

            {isLoggedIn ? (
              <a href="/account" className="accountButton">
                <UserIcon />
                <span>{ka ? "ჩემი ანგარიში" : "My Account"}</span>
              </a>
            ) : (
              <>
                <a href="/account/register" className="accountButton">
                  {ka ? "ანგარიშის შექმნა" : "Create Account"}
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

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="hero">
        <div className="heroGlow glowRed" />
        <div className="heroGlow glowBlue" />

        <div className="heroInner">
          {/* ==================================================
              LEFT — EMERGENCY
          ================================================== */}

          <section className="emergencySide">
            <div className="emergencyLabel">
              <span className="medicalDot">+</span>
              <strong>QR RETURN • EMERGENCY ID</strong>
            </div>

            <h1>
              {ka
                ? "როცა სიტყვის თქმა შეუძლებელია, ინფორმაცია მაინც ხელმისაწვდომია."
                : "When you cannot speak, essential information can still speak for you."}
            </h1>

            <p className="lead">
              {ka
                ? "Emergency QR გაძლევთ საშუალებას წინასწარ განსაზღვროთ რა ინფორმაცია უნდა ნახოს დამხმარემ საგანგებო სიტუაციაში."
                : "Emergency QR lets you choose in advance what information a helper can see in an emergency."}
            </p>

            {/* RED + BLUE BRACELET */}

            <div className="emergencyVisual">
              <div className="braceletWrap">
                <div className="braceletShadow" />

                <div className="bracelet">
                  <div className="strapRed">
                    <span />
                    <span />
                    <span />
                  </div>

                  <div className="watchFace">
                    <span className="watchTitle">
                      EMERGENCY
                    </span>

                    <span className="watchQrTitle">
                      QR
                    </span>

                    <div className="watchQr">
                      <QrCode size={60} />
                    </div>
                  </div>

                  <div className="strapBlue">
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>

              {/* INFO */}

              <div className="emergencyInfo">
                <div className="infoTop">
                  <div>
                    <span>EMERGENCY PROFILE</span>
                    <strong>
                      {ka
                        ? "საჭირო ინფორმაცია ერთ ადგილას"
                        : "Essential information in one place"}
                    </strong>
                  </div>

                  <span className="sos">SOS READY</span>
                </div>

                <InfoRow
                  icon={<PhoneIcon />}
                  title={
                    ka
                      ? "საგანგებო კონტაქტი"
                      : "Emergency Contact"
                  }
                  value={
                    ka
                      ? "თქვენ მიერ არჩეული პირი"
                      : "Your trusted contact"
                  }
                />

                <InfoRow
                  icon={<HeartIcon />}
                  title={
                    ka
                      ? "სამედიცინო ინფორმაცია"
                      : "Medical Information"
                  }
                  value={
                    ka
                      ? "მხოლოდ ნებადართული მონაცემები"
                      : "Only approved information"
                  }
                />

                <InfoRow
                  icon={<AlertIcon />}
                  title={ka ? "ალერგიები" : "Allergies"}
                  value={
                    ka
                      ? "საჭიროების შემთხვევაში"
                      : "When relevant"
                  }
                />

                <InfoRow
                  icon={<ShieldIcon />}
                  title="Privacy Control"
                  value={
                    ka
                      ? "თქვენ აკონტროლებთ მონაცემებს"
                      : "You control your data"
                  }
                />
              </div>
            </div>

            <div className="emergencyMeta">
              <span>EMERGENCY CONTACT</span>
              <span>MEDICAL INFO</span>
              <span>NO APP</span>
              <span>PRIVACY CONTROL</span>
            </div>

            <div className="heroButtons">
              <a
                href={
                  isLoggedIn
                    ? "/account"
                    : "/account/register"
                }
                className="mainCta"
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

              <a href="#video" className="lightCta">
                {ka ? "როგორ მუშაობს" : "How it works"}
              </a>
            </div>
          </section>

          {/* ==================================================
              RIGHT — QR RETURN ECOSYSTEM
          ================================================== */}

          <section className="ecosystem">
            <div className="softOrbit orbitOne" />
            <div className="softOrbit orbitTwo" />

            {/* CENTRAL PHONE */}

            <div className="phone">
              <div className="phoneNotch" />

              <div className="phoneScreen">
                <div className="phoneTop">
                  <div className="tinyLogo">
                    <QrIcon />
                  </div>

                  <div>
                    <span>QR RETURN</span>
                    <strong>
                      {ka
                        ? "მპოვნელის გვერდი"
                        : "Finder Access"}
                    </strong>
                  </div>
                </div>

                <div className="phoneCode">
                  <QrCode size={104} />
                </div>

                <div className="phoneText">
                  <span>SCAN COMPLETE</span>

                  <strong>
                    {ka
                      ? "დაუკავშირდი მფლობელს"
                      : "Contact the owner"}
                  </strong>

                  <p>
                    {ka
                      ? "აირჩიეთ დაკავშირების მეთოდი"
                      : "Choose a contact option"}
                  </p>
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

                  <span>
                    {ka
                      ? "პირადი მონაცემები დაცულია"
                      : "Personal data protected"}
                  </span>
                </div>
              </div>
            </div>

            {/* 6 ROTATING PRODUCTS */}

            <div className="productOrbit">
              {products.map((product) => (
                <div
                  className={`orbitProduct ${product.className}`}
                  key={product.id}
                >
                  <div className="productPhoto">
                    {product.id === "keys" ? (
                      <KeysVisual />
                    ) : (
                      <img
                        src={product.image}
                        alt={
                          ka ? product.ka : product.en
                        }
                      />
                    )}

                    <div className="photoOverlay" />

                    <div
                      className={`realTag realTag-${product.id}`}
                    >
                      <span className="tagLoop" />

                      <div className="tinyTagFace">
                        <MiniQr />
                      </div>
                    </div>

                    {product.id === "luggage" && (
                      <div className="airportBadge">
                        AIRPORT
                      </div>
                    )}
                  </div>

                  <strong className="productName">
                    {ka ? product.ka : product.en}
                  </strong>
                </div>
              ))}
            </div>

            <div className="ecosystemText">
              <span>QR RETURN</span>

              <strong>
                {ka
                  ? "ერთი სისტემა სხვადასხვა ნივთისთვის"
                  : "One system for what matters"}
              </strong>
            </div>
          </section>
        </div>
      </section>

      {/* ======================================================
          VIDEO
      ====================================================== */}

      <section id="video" className="videoSection">
        <div className="shell">
          <div className="videoGrid">
            <div className="videoCopy">
              <span className="eyebrow">
                QR RETURN IN ACTION
              </span>

              <h2>
                {ka
                  ? "ერთი სკანი. პირდაპირი კავშირი."
                  : "One scan. A direct connection."}
              </h2>

              <p>
                {ka
                  ? "აქ მოგვიანებით დაემატება მოკლე ვიდეო, რომელიც რეალურ სიტუაციაში აჩვენებს QR RETURN-ის გამოყენებას."
                  : "A short product video will be added here to show QR RETURN in a real-life situation."}
              </p>
            </div>

            <div className="videoCard">
              <div className="videoBrand">
                <QrIcon />
                <span>QR RETURN DEMO</span>
              </div>

              <button type="button" className="play">
                <PlayIcon />
              </button>

              <span className="comingSoon">
                {ka
                  ? "პროდუქტის ვიდეო დაემატება"
                  : "Product video coming soon"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          FOUR STEPS
      ====================================================== */}

      <section className="flowSection">
        <div className="shell">
          <div className="flowHeader">
            <span className="eyebrow">
              FIND → SCAN → CONNECT → RETURN
            </span>

            <h2>
              {ka
                ? "დაბრუნების გზა ოთხ ნაბიჯში."
                : "A clear return path in four steps."}
            </h2>
          </div>

          <div className="flow">
            <FlowStep
              number="01"
              icon={<SearchIcon />}
              title={ka ? "იპოვეს" : "Found"}
              text={
                ka
                  ? "მპოვნელი ხედავს QR RETURN კოდს."
                  : "The finder sees the QR RETURN code."
              }
            />

            <span className="flowConnector" />

            <FlowStep
              number="02"
              icon={<ScanIcon />}
              title={ka ? "დაასკანერეს" : "Scanned"}
              text={
                ka
                  ? "აპის ჩამოტვირთვა საჭირო არ არის."
                  : "No app download is required."
              }
            />

            <span className="flowConnector" />

            <FlowStep
              number="03"
              icon={<ChatIcon />}
              title={
                ka ? "დაგიკავშირდნენ" : "Connected"
              }
              text={
                ka
                  ? "Live Chat, ზარი ან თქვენ მიერ არჩეული მეთოდი."
                  : "Live Chat, call or another contact option."
              }
            />

            <span className="flowConnector" />

            <FlowStep
              number="04"
              icon={<ReturnIcon />}
              title={ka ? "დაბრუნდა" : "Returned"}
              text={
                ka
                  ? "მპოვნელთან კავშირის შემდეგ დაბრუნება მარტივდება."
                  : "Once connected, getting it back becomes easier."
              }
            />
          </div>
        </div>
      </section>

      {/* ======================================================
          FEATURES
      ====================================================== */}

      <section className="featuresSection">
        <div className="shell">
          <div className="featuresHeader">
            <span>CONNECTION &amp; CONTROL</span>

            <h2>
              {ka
                ? "რაც საჭიროა — ზედმეტი სირთულის გარეშე."
                : "What you need — without unnecessary complexity."}
            </h2>
          </div>

          <div className="featureGrid">
            <Feature
              number="01"
              icon={<ChatIcon />}
              title="Live Chat"
              text={
                ka
                  ? "პირდაპირი კავშირი მპოვნელთან."
                  : "Direct connection with the finder."
              }
            />

            <Feature
              number="02"
              icon={<LocationIcon />}
              title={
                ka
                  ? "ლოკაციის გაზიარება"
                  : "Location Sharing"
              }
              text={
                ka
                  ? "მპოვნელმა შეიძლება ლოკაცია ერთი ღილაკით გაგიზიაროთ."
                  : "A finder can share the location in one tap."
              }
            />

            <Feature
              number="03"
              icon={<RewardIcon />}
              title={
                ka
                  ? "მპოვნელის ჯილდო"
                  : "Finder Reward"
              }
              text={
                ka
                  ? "სურვილის შემთხვევაში მიუთითეთ ჯილდო."
                  : "Optionally offer a reward."
              }
            />

            <Feature
              number="04"
              icon={<ShieldIcon />}
              title="Privacy Control"
              text={
                ka
                  ? "თქვენ ირჩევთ რა ინფორმაცია გამოჩნდება."
                  : "You decide what information is visible."
              }
            />
          </div>
        </div>
      </section>

      {/* ======================================================
          RULES
      ====================================================== */}

      <section className="rulesSection">
        <div className="shell">
          <div className="rulesHeader">
            <span className="eyebrow">
              SIMPLE BY DESIGN
            </span>

            <h2>
              {ka
                ? "მარტივი თქვენთვის. კიდევ უფრო მარტივი მპოვნელისთვის."
                : "Simple for you. Even simpler for the finder."}
            </h2>
          </div>

          <div className="ruleGrid">
            <Rule
              number="01"
              title={ka ? "აპის გარეშე" : "No App"}
              text={
                ka
                  ? "მპოვნელისთვის აპის ჩამოტვირთვა ან რეგისტრაცია საჭირო არ არის."
                  : "The finder does not need an app or an account."
              }
            />

            <Rule
              number="02"
              title={
                ka
                  ? "თქვენი მონაცემები"
                  : "Your Information"
              }
              text={
                ka
                  ? "თქვენ თავად წყვეტთ რა იქნება საჯაროდ ხელმისაწვდომი."
                  : "You decide exactly what can be shown."
              }
            />

            <Rule
              number="03"
              title={
                ka
                  ? "ერთი ანგარიში"
                  : "One Account"
              }
              text={
                ka
                  ? "ყველა ცხოველი, ნივთი და Emergency ID ერთ სივრცეში."
                  : "Pets, belongings and Emergency ID in one place."
              }
            />
          </div>
        </div>
      </section>

      {/* ======================================================
          ACCOUNT
      ====================================================== */}

      <section className="accountSection">
        <div className="shell">
          <div className="accountPanel">
            <div className="accountIcon">
              <UserIcon />
            </div>

            <div>
              <span>ONE OWNER ACCOUNT</span>

              <h2>
                {ka
                  ? "ყველაფერი ერთი ანგარიშიდან."
                  : "Everything from one account."}
              </h2>

              <p>
                {ka
                  ? "მართეთ QR პროფილები, Live Chat, დაკარგვის რეჟიმი და Emergency ID."
                  : "Manage QR profiles, Live Chat, lost mode and Emergency ID."}
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
                  : "Create Account"}

              <ArrowIcon />
            </a>
          </div>
        </div>
      </section>

      {/* ======================================================
          CONTACT
      ====================================================== */}

      <section className="contact">
        <div className="shell contactInner">
          <div>
            <span className="eyebrow">CONTACT</span>

            <h2>
              {ka ? "დაგვიკავშირდით" : "Contact us"}
            </h2>

            <p>
              {ka
                ? "კითხვა გაქვთ QR RETURN-ის ან Emergency ID-ის შესახებ? მოგვწერეთ."
                : "Questions about QR RETURN or Emergency ID? Send us a message."}
            </p>
          </div>

          <a href="mailto:hello@qrreturn.com">
            {ka ? "მოგვწერეთ" : "Email us"}
            <ArrowIcon />
          </a>
        </div>
      </section>

      <SupportLauncher language={language} />

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="footer">
        <div className="footerInner">
          <div className="footerBrand">
            <div>
              <QrIcon />
            </div>

            <section>
              <strong>QR RETURN</strong>
              <span>SMART LOST &amp; FOUND</span>
            </section>
          </div>

          <div className="footerLinks">
            <a href="#video">
              {ka ? "როგორ მუშაობს" : "How it works"}
            </a>

            <span>Emergency ID</span>

            <span>
              {ka
                ? "კონფიდენციალურობა"
                : "Privacy"}
            </span>

            <span>
              {ka ? "პირობები" : "Terms"}
            </span>
          </div>

          <span className="copyright">
            © 2026 QR RETURN
          </span>
        </div>
      </footer>

      {/* ======================================================
          CSS
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
          overflow: hidden;
          background: #f7f7f5;
          color: #17212b;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Arial,
            sans-serif;
        }

        .shell {
          width: calc(100% - 52px);
          max-width: 1180px;
          margin: auto;
        }

        .eyebrow {
          color: #d8464d;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1.8px;
        }

        /* HEADER */

        .header {
          width: calc(100% - 52px);
          max-width: 1280px;
          min-height: 78px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(25, 33, 43, 0.08);
          position: relative;
          z-index: 20;
        }

        .brand,
        .headerRight,
        .nav,
        .language {
          display: flex;
          align-items: center;
        }

        .brand {
          gap: 10px;
          text-decoration: none;
        }

        .brandMark {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          color: #fff;
          background: #1c2835;
        }

        .brandMark :global(svg) {
          width: 20px;
        }

        .brandText strong,
        .brandText span {
          display: block;
        }

        .brandText strong {
          color: #1c2835;
          font-size: 17px;
          font-weight: 850;
        }

        .brandText span {
          margin-top: 3px;
          color: #929aa4;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1.7px;
        }

        .headerRight {
          gap: 13px;
        }

        .nav {
          gap: 7px;
        }

        .adminButton,
        .accountButton,
        .loginButton {
          min-height: 38px;
          padding: 0 13px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 800;
          text-decoration: none;
        }

        .adminButton {
          color: #a43d42;
          border: 1px solid #edd7d9;
          background: #fff7f7;
        }

        .adminButton :global(svg),
        .accountButton :global(svg) {
          width: 13px;
        }

        .accountButton {
          color: white;
          background: #1c2835;
        }

        .loginButton {
          color: #4e5865;
          border: 1px solid #dde1e5;
        }

        .language {
          gap: 7px;
        }

        .language > span {
          width: 1px;
          height: 12px;
          background: #d2d7dc;
        }

        .language button {
          border: 0;
          padding: 0;
          background: none;
          color: #979fa9;
          font-size: 8px;
          font-weight: 900;
          cursor: pointer;
        }

        .language button.active {
          color: #d8464d;
        }

        /* HERO */

        .hero {
          min-height: 720px;
          position: relative;
          background:
            linear-gradient(
              120deg,
              #faf9f6 0%,
              #f3f4f3 51%,
              #edf0f2 100%
            );
        }

        .heroInner {
          width: calc(100% - 52px);
          max-width: 1280px;
          min-height: 720px;
          margin: auto;
          display: grid;
          grid-template-columns: 0.94fr 1.06fr;
          align-items: center;
          gap: 55px;
          position: relative;
          z-index: 2;
        }

        .heroGlow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .glowRed {
          width: 380px;
          height: 380px;
          left: -190px;
          bottom: -180px;
          background: radial-gradient(
            circle,
            rgba(216, 70, 77, 0.07),
            transparent 70%
          );
        }

        .glowBlue {
          width: 590px;
          height: 590px;
          right: -210px;
          top: -220px;
          background: radial-gradient(
            circle,
            rgba(46, 92, 150, 0.11),
            transparent 69%
          );
        }

        /* EMERGENCY LEFT */

        .emergencySide {
          max-width: 580px;
        }

        .emergencyLabel {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #a8393f;
          font-size: 8px;
          letter-spacing: 1.2px;
        }

        .medicalDot {
          width: 25px;
          height: 25px;
          display: grid;
          place-items: center;
          border-radius: 7px;
          color: white;
          background: #d8464d;
          font-size: 16px;
          font-weight: 500;
        }

        .emergencySide h1 {
          max-width: 560px;
          margin: 20px 0 0;
          color: #17212b;
          font-size: clamp(34px, 3.7vw, 47px);
          line-height: 1.08;
          letter-spacing: -2.2px;
          font-weight: 700;
        }

        .lead {
          max-width: 530px;
          margin: 18px 0 0;
          color: #66717d;
          font-size: 14px;
          line-height: 1.7;
        }

        .emergencyVisual {
          margin-top: 25px;
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          align-items: center;
          gap: 17px;
        }

        /* BRACELET */

        .braceletWrap {
          min-height: 220px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .braceletShadow {
          width: 190px;
          height: 35px;
          position: absolute;
          bottom: 27px;
          border-radius: 50%;
          background: rgba(25, 35, 48, 0.12);
          filter: blur(13px);
        }

        .bracelet {
          width: 230px;
          height: 210px;
          position: relative;
          transform: rotate(-8deg);
        }

        .strapRed,
        .strapBlue {
          width: 104px;
          height: 188px;
          position: absolute;
          top: 13px;
          border: 18px solid;
          border-radius: 55px;
        }

        .strapRed {
          left: 18px;
          border-color: #dc3941;
          border-right-color: transparent;
        }

        .strapBlue {
          right: 18px;
          border-color: #176fc3;
          border-left-color: transparent;
        }

        .strapRed span,
        .strapBlue span {
          width: 8px;
          height: 15px;
          position: absolute;
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.27);
        }

        .strapRed span:nth-child(1) {
          left: -12px;
          top: 47px;
        }

        .strapRed span:nth-child(2) {
          left: -12px;
          top: 77px;
        }

        .strapRed span:nth-child(3) {
          left: -12px;
          top: 107px;
        }

        .strapBlue span:nth-child(1) {
          right: -12px;
          top: 42px;
        }

        .strapBlue span:nth-child(2) {
          right: -12px;
          top: 70px;
        }

        .strapBlue span:nth-child(3) {
          right: -12px;
          top: 98px;
        }

        .strapBlue span:nth-child(4) {
          right: -12px;
          top: 126px;
        }

        .watchFace {
          width: 112px;
          height: 145px;
          padding: 12px;
          position: absolute;
          z-index: 4;
          top: 32px;
          left: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 4px solid #252c34;
          border-radius: 24px;
          color: white;
          background:
            linear-gradient(
              160deg,
              #151a20,
              #030608
            );
          box-shadow:
            0 22px 40px
            rgba(20, 27, 35, 0.28);
          transform: translateX(-50%);
        }

        .watchTitle {
          color: #ffffff;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.5px;
        }

        .watchQrTitle {
          margin-top: 2px;
          color: #ffffff;
          font-size: 18px;
          font-weight: 900;
        }

        .watchQr {
          margin-top: 7px;
          padding: 5px;
          border-radius: 7px;
          background: white;
        }

        /* EMERGENCY INFO */

        .emergencyInfo {
          padding: 15px;
          border: 1px solid #e0e4e7;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 14px 32px rgba(25, 35, 48, 0.055);
        }

        .infoTop {
          padding-bottom: 10px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
        }

        .infoTop div span,
        .infoTop div strong {
          display: block;
        }

        .infoTop div span {
          color: #d8464d;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 0.8px;
        }

        .infoTop div strong {
          margin-top: 4px;
          color: #33404d;
          font-size: 10px;
          line-height: 1.4;
        }

        .sos {
          padding: 5px 7px;
          border-radius: 999px;
          color: white;
          background: #d8464d;
          font-size: 5px;
          font-weight: 900;
        }

        .emergencyMeta {
          margin-top: 17px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .emergencyMeta span {
          padding: 7px 9px;
          border: 1px solid #e7d9da;
          border-radius: 999px;
          color: #9d3c42;
          background: rgba(255, 255, 255, 0.65);
          font-size: 6px;
          font-weight: 850;
        }

        .heroButtons {
          margin-top: 22px;
          display: flex;
          gap: 9px;
        }

        .mainCta,
        .lightCta {
          min-height: 43px;
          padding: 0 15px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 9px;
          font-weight: 850;
        }

        .mainCta {
          color: white;
          background: #1c2835;
        }

        .mainCta :global(svg) {
          width: 12px;
        }

        .lightCta {
          color: #505b68;
          border: 1px solid #d9dde2;
          background: rgba(255, 255, 255, 0.55);
        }

        /* ECOSYSTEM */

        .ecosystem {
          width: 590px;
          height: 590px;
          margin: auto;
          position: relative;
        }

        .softOrbit {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }

        .orbitOne {
          width: 505px;
          height: 505px;
          border: 1px solid rgba(59, 76, 98, 0.12);
        }

        .orbitTwo {
          width: 395px;
          height: 395px;
          border: 1px dashed rgba(59, 76, 98, 0.09);
        }

        /* PHONE */

        .phone {
          width: 175px;
          height: 350px;
          padding: 7px;
          position: absolute;
          z-index: 5;
          top: 50%;
          left: 50%;
          border-radius: 29px;
          background: #111820;
          box-shadow: 0 30px 65px rgba(26, 35, 46, 0.2);
          transform: translate(-50%, -50%);
        }

        .phoneNotch {
          width: 47px;
          height: 9px;
          position: absolute;
          top: 10px;
          left: 50%;
          z-index: 4;
          border-radius: 999px;
          background: #05090d;
          transform: translateX(-50%);
        }

        .phoneScreen {
          height: 100%;
          padding: 27px 12px 12px;
          border-radius: 23px;
          background: linear-gradient(180deg, #ffffff, #f6f8fa);
        }

        .phoneTop {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .tinyLogo {
          width: 29px;
          height: 29px;
          display: grid;
          place-items: center;
          flex: 0 0 29px;
          border-radius: 8px;
          color: white;
          background: #1c2835;
        }

        .tinyLogo :global(svg) {
          width: 14px;
        }

        .phoneTop span,
        .phoneTop strong {
          display: block;
        }

        .phoneTop span {
          color: #d8464d;
          font-size: 6px;
          font-weight: 900;
        }

        .phoneTop strong {
          margin-top: 2px;
          color: #4b5663;
          font-size: 8px;
        }

        .phoneCode {
          width: 125px;
          height: 125px;
          margin: 24px auto 0;
          display: grid;
          place-items: center;
          border-radius: 16px;
          background: white;
          box-shadow: 0 12px 25px rgba(35, 45, 58, 0.06);
        }

        .phoneText {
          margin-top: 16px;
          text-align: center;
        }

        .phoneText > span {
          color: #9ba2ab;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .phoneText strong {
          display: block;
          margin-top: 5px;
          color: #27323e;
          font-size: 13px;
          line-height: 1.3;
        }

        .phoneText p {
          margin: 5px 0 0;
          color: #7f8995;
          font-size: 8px;
        }

        .phoneActions {
          margin-top: 14px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .phoneAction {
          min-height: 43px;
          padding: 7px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid #e0e4e7;
          border-radius: 9px;
          color: #596571;
          background: white;
          font-size: 7px;
          font-weight: 800;
        }

        .phoneAction.primary {
          color: white;
          background: #1c2835;
          border-color: #1c2835;
        }

        .phoneAction :global(svg) {
          width: 13px;
        }

        .phonePrivacy {
          margin-top: 9px;
          padding-top: 8px;
          display: flex;
          align-items: center;
          gap: 5px;
          border-top: 1px solid #e5e8eb;
          color: #8a929c;
          font-size: 6px;
        }

        .phonePrivacy :global(svg) {
          width: 11px;
          color: #d8464d;
        }

        /* PRODUCT ORBIT */

        .productOrbit {
          position: absolute;
          inset: 0;
          animation: orbitFloat 14s ease-in-out infinite alternate;
        }

        @keyframes orbitFloat {
          0% {
            transform: rotate(-1.3deg);
          }

          100% {
            transform: rotate(1.3deg);
          }
        }

        .orbitProduct {
          width: 118px;
          position: absolute;
          text-align: center;
        }

        .productPhoto {
          width: 118px;
          height: 94px;
          position: relative;
          overflow: hidden;
          border: 4px solid rgba(255, 255, 255, 0.94);
          border-radius: 18px;
          background: #dde2e6;
          box-shadow: 0 12px 28px rgba(34, 44, 57, 0.11);
        }

        .productPhoto > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .photoOverlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            transparent 55%,
            rgba(7, 11, 16, 0.17)
          );
        }

        .productName {
          display: inline-block;
          max-width: 128px;
          margin-top: 7px;
          padding: 5px 7px;
          border: 1px solid #e0e3e6;
          border-radius: 999px;
          color: #46525f;
          background: rgba(255, 255, 255, 0.9);
          font-size: 7px;
          line-height: 1.3;
          white-space: normal;
        }

        /* MINI TAG ON PRODUCTS */

        .realTag {
          width: 25px;
          height: 31px;
          position: absolute;
          display: grid;
          place-items: center;
          border-radius: 6px;
          background: white;
          box-shadow: 0 4px 11px rgba(0, 0, 0, 0.15);
          transform: scale(0.7);
        }

        .tagLoop {
          width: 7px;
          height: 7px;
          position: absolute;
          top: -5px;
          border: 1px solid #929ca6;
          border-radius: 50%;
        }

        .tinyTagFace {
          transform: scale(0.68);
        }

        .realTag-dog,
        .realTag-cat {
          left: 50%;
          bottom: -3px;
          transform: translateX(-50%) scale(0.68);
        }

        .realTag-keys {
          right: 10px;
          bottom: 9px;
        }

        .realTag-wallet {
          right: 10px;
          bottom: 8px;
        }

        .realTag-luggage {
          left: 51%;
          top: 12px;
          transform: translateX(-50%) scale(0.72);
        }

        .realTag-bag {
          right: 15px;
          top: 19px;
        }

        .airportBadge {
          position: absolute;
          left: 7px;
          bottom: 7px;
          padding: 4px 5px;
          border-radius: 999px;
          color: #3f4b59;
          background: rgba(255, 255, 255, 0.88);
          font-size: 5px;
          font-weight: 900;
        }

        /* POSITIONS */

        .productDog {
          left: 92px;
          top: 30px;
        }

        .productCat {
          right: 88px;
          top: 30px;
        }

        .productKeys {
          left: 0;
          top: 235px;
        }

        .productWallet {
          right: 0;
          top: 235px;
        }

        .productLuggage {
          left: 93px;
          bottom: 32px;
        }

        .productBag {
          right: 88px;
          bottom: 32px;
        }

        .ecosystemText {
          position: absolute;
          left: 50%;
          bottom: 7px;
          text-align: center;
          transform: translateX(-50%);
        }

        .ecosystemText span,
        .ecosystemText strong {
          display: block;
        }

        .ecosystemText span {
          color: #d8464d;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .ecosystemText strong {
          margin-top: 3px;
          color: #697481;
          font-size: 7px;
        }

        /* VIDEO */

        .videoSection {
          padding: 90px 0;
          background: #fbfbf9;
        }

        .videoGrid {
          display: grid;
          grid-template-columns: 0.75fr 1.25fr;
          align-items: center;
          gap: 65px;
        }

        .videoCopy h2,
        .flowHeader h2,
        .rulesHeader h2 {
          margin: 10px 0 0;
          color: #18222c;
          font-size: clamp(31px, 3.6vw, 42px);
          line-height: 1.07;
          letter-spacing: -2px;
          font-weight: 680;
        }

        .videoCopy p {
          margin: 15px 0 0;
          color: #6d7782;
          font-size: 11px;
          line-height: 1.7;
        }

        .videoCard {
          min-height: 340px;
          position: relative;
          display: grid;
          place-items: center;
          border: 1px solid #e0e4e7;
          border-radius: 24px;
          background: linear-gradient(135deg, #ebeff2, #fafaf8);
        }

        .videoBrand {
          position: absolute;
          top: 20px;
          left: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #58636f;
          font-size: 7px;
          font-weight: 900;
        }

        .videoBrand :global(svg) {
          width: 18px;
        }

        .play {
          width: 64px;
          height: 64px;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 50%;
          color: white;
          background: #1c2835;
          cursor: pointer;
        }

        .play :global(svg) {
          width: 22px;
        }

        .comingSoon {
          position: absolute;
          bottom: 18px;
          color: #8b949e;
          font-size: 8px;
        }

        /* FLOW */

        .flowSection {
          padding: 90px 0;
          background: #f0f1ef;
        }

        .flowHeader {
          max-width: 670px;
        }

        .flow {
          margin-top: 43px;
          display: grid;
          grid-template-columns:
            1fr auto 1fr auto 1fr auto 1fr;
          align-items: start;
        }

        .flowConnector {
          width: 55px;
          height: 1px;
          margin: 35px 17px 0;
          background: #d5dade;
        }

        /* FEATURES */

        .featuresSection {
          padding: 88px 0;
          color: white;
          background: #1c2835;
        }

        .featuresHeader > span {
          color: #e08d91;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.6px;
        }

        .featuresHeader h2 {
          max-width: 710px;
          margin: 10px 0 0;
          color: white;
          font-size: clamp(30px, 3.5vw, 41px);
          line-height: 1.07;
          letter-spacing: -1.9px;
        }

        .featureGrid {
          margin-top: 40px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* RULES */

        .rulesSection {
          padding: 86px 0;
          background: #fafaf8;
        }

        .rulesHeader {
          max-width: 720px;
        }

        .ruleGrid {
          margin-top: 37px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid #e0e3e6;
          border-bottom: 1px solid #e0e3e6;
        }

        /* ACCOUNT */

        .accountSection {
          padding: 68px 0;
          background: #f0f1ef;
        }

        .accountPanel {
          padding: 27px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 20px;
          border: 1px solid #dee2e5;
          border-radius: 20px;
          background: white;
        }

        .accountIcon {
          width: 55px;
          height: 55px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          color: #1c2835;
          background: #eef1f3;
        }

        .accountIcon :global(svg) {
          width: 23px;
        }

        .accountPanel > div:nth-child(2) > span {
          color: #d8464d;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1.2px;
        }

        .accountPanel h2 {
          margin: 7px 0 0;
          color: #19232d;
          font-size: 31px;
          letter-spacing: -1.6px;
        }

        .accountPanel p {
          margin: 7px 0 0;
          color: #707a85;
          font-size: 10px;
        }

        .accountPanel > a {
          min-height: 41px;
          padding: 0 14px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border-radius: 10px;
          color: white;
          background: #1c2835;
          font-size: 8.5px;
          font-weight: 850;
          text-decoration: none;
        }

        .accountPanel > a :global(svg) {
          width: 12px;
        }

        /* CONTACT */

        .contact {
          padding: 67px 0;
          background: #eaeae8;
        }

        .contactInner {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 45px;
        }

        .contactInner h2 {
          margin: 9px 0 7px;
          font-size: 34px;
          letter-spacing: -1.6px;
        }

        .contactInner p {
          margin: 0;
          color: #707984;
          font-size: 10px;
        }

        .contactInner > a {
          min-height: 41px;
          padding: 0 14px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border-radius: 10px;
          color: white;
          background: #1c2835;
          font-size: 8.5px;
          font-weight: 850;
          text-decoration: none;
        }

        .contactInner > a :global(svg) {
          width: 12px;
        }

        /* FOOTER */

        .footer {
          color: white;
          background: #111820;
        }

        .footerInner {
          max-width: 1180px;
          min-height: 125px;
          margin: auto;
          padding: 33px 26px;
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

        .footerBrand > div {
          width: 35px;
          height: 35px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #d8464d;
        }

        .footerBrand > div :global(svg) {
          width: 18px;
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
          color: #707a87;
          font-size: 5px;
          font-weight: 900;
        }

        .footerLinks {
          display: flex;
          gap: 21px;
        }

        .footerLinks a,
        .footerLinks span {
          color: #87909b;
          font-size: 8px;
          text-decoration: none;
        }

        .copyright {
          color: #5e6874;
          font-size: 7px;
        }

        @media (max-width: 1080px) {
          .heroInner {
            grid-template-columns: 1fr;
            padding: 60px 0 85px;
          }

          .ecosystem {
            margin-top: 20px;
          }

          .videoGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 900px) {
          .flow {
            grid-template-columns: repeat(2, 1fr);
            gap: 27px;
          }

          .flowConnector {
            display: none;
          }

          .featureGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .ruleGrid {
            grid-template-columns: 1fr;
          }

          .accountPanel {
            grid-template-columns: auto 1fr;
          }

          .accountPanel > a {
            grid-column: 1 / -1;
            justify-content: center;
          }

          .contactInner,
          .footerInner {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 650px) {
          .header {
            width: calc(100% - 18px);
          }

          .brandText span,
          .language {
            display: none;
          }

          .adminButton span {
            display: none;
          }

          .adminButton,
          .accountButton,
          .loginButton {
            min-height: 35px;
            padding: 0 9px;
            font-size: 8px;
          }

          .heroInner,
          .shell {
            width: calc(100% - 28px);
          }

          .hero {
            min-height: unset;
          }

          .heroInner {
            min-height: unset;
            padding: 45px 0 75px;
          }

          .emergencySide h1 {
            font-size: 34px;
          }

          .lead {
            font-size: 12px;
          }

          .emergencyVisual {
            grid-template-columns: 1fr;
          }

          .braceletWrap {
            min-height: 210px;
          }

          .heroButtons {
            flex-direction: column;
          }

          .mainCta,
          .lightCta {
            width: 100%;
          }

          .ecosystem {
            width: 350px;
            height: 600px;
          }

          .orbitOne {
            width: 330px;
            height: 330px;
          }

          .orbitTwo {
            width: 260px;
            height: 260px;
          }

          .phone {
            width: 155px;
            height: 320px;
          }

          .phoneCode {
            width: 105px;
            height: 105px;
          }

          .phoneText strong {
            font-size: 11px;
          }

          .orbitProduct {
            width: 92px;
          }

          .productPhoto {
            width: 92px;
            height: 74px;
          }

          .productName {
            max-width: 100px;
            font-size: 6px;
          }

          .productDog {
            left: 12px;
            top: 40px;
          }

          .productCat {
            right: 12px;
            top: 40px;
          }

          .productKeys {
            left: -5px;
            top: 245px;
          }

          .productWallet {
            right: -5px;
            top: 245px;
          }

          .productLuggage {
            left: 19px;
            bottom: 50px;
          }

          .productBag {
            right: 19px;
            bottom: 50px;
          }

          .ecosystemText {
            bottom: 7px;
          }

          .videoSection,
          .flowSection,
          .featuresSection,
          .rulesSection {
            padding: 68px 0;
          }

          .videoCopy h2,
          .flowHeader h2,
          .rulesHeader h2 {
            font-size: 31px;
          }

          .flow,
          .featureGrid {
            grid-template-columns: 1fr;
          }

          .videoCard {
            min-height: 270px;
          }

          .footerLinks {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </main>
  );
}

/* ======================================================
   COMPONENTS
====================================================== */

function InfoRow({
  icon,
  title,
  value,
}: {
  icon: ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="infoRow">
      <div className="infoIcon">{icon}</div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>

      <CheckIcon />

      <style jsx>{`
        .infoRow {
          min-height: 45px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 9px;
          border-top: 1px solid #e7eaed;
        }

        .infoIcon {
          width: 29px;
          height: 29px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          color: #d8464d;
          background: #fff0f0;
        }

        .infoIcon :global(svg) {
          width: 14px;
        }

        span,
        strong {
          display: block;
        }

        span {
          color: #8d959f;
          font-size: 7px;
          font-weight: 700;
        }

        strong {
          margin-top: 2px;
          color: #46515e;
          font-size: 8px;
        }

        .infoRow > :global(svg) {
          width: 12px;
          color: #28a76c;
        }
      `}</style>
    </div>
  );
}

function FlowStep({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <article className="step">
      <span>{number}</span>

      <div>{icon}</div>

      <strong>{title}</strong>

      <p>{text}</p>

      <style jsx>{`
        .step > span {
          color: #a9b0b8;
          font-size: 8px;
          font-weight: 900;
        }

        .step > div {
          width: 47px;
          height: 47px;
          margin-top: 14px;
          display: grid;
          place-items: center;
          border: 1px solid #dde1e4;
          border-radius: 13px;
          color: #1c2835;
          background: white;
        }

        .step > div :global(svg) {
          width: 18px;
        }

        .step strong {
          display: block;
          margin-top: 17px;
          color: #2d3844;
          font-size: 13px;
        }

        .step p {
          margin: 7px 0 0;
          color: #727c87;
          font-size: 10px;
          line-height: 1.6;
        }
      `}</style>
    </article>
  );
}

function Feature({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <article className="feature">
      <div className="featureTop">
        <span>{number}</span>
        <div>{icon}</div>
      </div>

      <h3>{title}</h3>
      <p>{text}</p>

      <style jsx>{`
        .feature {
          min-height: 190px;
          padding: 21px 19px;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
        }

        .feature:last-child {
          border-right: 0;
        }

        .featureTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .featureTop > span {
          color: #697481;
          font-size: 7px;
          font-weight: 900;
        }

        .featureTop > div {
          width: 35px;
          height: 35px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          color: #e08d91;
          background: rgba(255, 255, 255, 0.06);
        }

        .featureTop > div :global(svg) {
          width: 15px;
        }

        h3 {
          margin: 31px 0 0;
          color: white;
          font-size: 13px;
        }

        p {
          margin: 8px 0 0;
          color: #98a1ac;
          font-size: 9px;
          line-height: 1.65;
        }

        @media (max-width: 900px) {
          .feature {
            border-right: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
        }
      `}</style>
    </article>
  );
}

function Rule({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <article className="rule">
      <span>{number}</span>
      <strong>{title}</strong>
      <p>{text}</p>

      <style jsx>{`
        .rule {
          min-height: 150px;
          padding: 22px;
          border-right: 1px solid #e0e3e6;
        }

        .rule:last-child {
          border-right: 0;
        }

        .rule > span {
          color: #d8464d;
          font-size: 8px;
          font-weight: 900;
        }

        .rule strong {
          display: block;
          margin-top: 27px;
          color: #2c3743;
          font-size: 13px;
        }

        .rule p {
          margin: 8px 0 0;
          color: #707a86;
          font-size: 10px;
          line-height: 1.65;
        }

        @media (max-width: 900px) {
          .rule {
            border-right: 0;
            border-bottom: 1px solid #e0e3e6;
          }
        }
      `}</style>
    </article>
  );
}

/* ======================================================
   HOUSE + CAR KEYS
====================================================== */

function KeysVisual() {
  return (
    <div className="keysScene">
      <div className="keySurface" />

      <div className="homeKey">
        <span className="homeKeyRing" />
        <span className="homeKeyStem" />
        <span className="homeKeyTeeth" />
      </div>

      <div className="carKey">
        <span className="carRing" />

        <div className="fob">
          <span />
          <span />
        </div>
      </div>

      <style jsx>{`
        .keysScene {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
          background: linear-gradient(
            135deg,
            #e6ddd0,
            #f5f0e8
          );
        }

        .keySurface {
          position: absolute;
          inset: 60% -10px -10px;
          background: rgba(255, 255, 255, 0.28);
          transform: rotate(-5deg);
        }

        .homeKey {
          position: absolute;
          left: 18px;
          top: 25px;
          transform: rotate(-20deg);
        }

        .homeKeyRing {
          width: 29px;
          height: 29px;
          display: block;
          border: 7px solid #bca36e;
          border-radius: 50%;
        }

        .homeKeyStem {
          width: 52px;
          height: 8px;
          position: absolute;
          left: 24px;
          top: 11px;
          border-radius: 3px;
          background: #bca36e;
        }

        .homeKeyTeeth {
          width: 17px;
          height: 14px;
          position: absolute;
          left: 64px;
          top: 13px;
          border-right: 6px solid #bca36e;
          border-bottom: 6px solid #bca36e;
        }

        .carKey {
          position: absolute;
          right: 20px;
          bottom: 11px;
          transform: rotate(13deg);
        }

        .carRing {
          width: 20px;
          height: 20px;
          position: absolute;
          top: -8px;
          left: 8px;
          border: 4px solid #9aa3ad;
          border-radius: 50%;
        }

        .fob {
          width: 40px;
          height: 55px;
          padding: 12px 9px;
          display: grid;
          gap: 6px;
          position: relative;
          z-index: 2;
          border-radius: 11px;
          background: linear-gradient(
            145deg,
            #59636d,
            #252c34
          );
          box-shadow: 0 8px 15px rgba(24, 30, 37, 0.18);
        }

        .fob span {
          height: 7px;
          border-radius: 999px;
          background: #89929b;
        }
      `}</style>
    </div>
  );
}

/* ======================================================
   ICONS
====================================================== */

function QrIcon() {
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

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M7 3h3l1 4-2 1.5c1.4 3 3.5 5.1 6.5 6.5L17 13l4 1v3c0 2.2-1.8 4-4 4C9.3 21 3 14.7 3 7a4 4 0 0 1 4-4Z" />
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
      <path d="M7.5 12h2.1l1-2.1 2.1 4.2 1.2-2.1h2.4" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M12 3 2.8 20h18.4z" />
      <path d="M12 9v5M12 17h.01" />
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
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15 15 5 5" />
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

function ReturnIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M9 7 4 12l5 5" />
      <path d="M5 12h9a5 5 0 0 1 5 5v2" />
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

function PlayIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m9 6 9 6-9 6z" />
    </svg>
  );
}

/* ======================================================
   QR
====================================================== */

function QrCode({ size = 100 }: { size?: number }) {
  const dark = [
    0, 1, 2, 5, 6, 7, 9, 11, 13, 14, 16, 18, 20,
    21, 22, 24, 26, 27, 28, 30, 32, 34, 35, 36,
    38, 40, 42, 43, 44, 46, 47, 48,
  ];

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "grid",
        gridTemplateColumns: "repeat(7,1fr)",
        gap: Math.max(2, size / 38),
      }}
    >
      {Array.from({ length: 49 }).map((_, i) => (
        <span
          key={i}
          style={{
            display: "block",
            borderRadius: 1,
            background: dark.includes(i)
              ? "#17212b"
              : "#dfe4e8",
          }}
        />
      ))}
    </div>
  );
}

function MiniQr() {
  const dark = [
    0, 1, 2, 4, 6, 7, 8, 10, 12, 14, 15, 17, 18,
    20, 21, 22, 24,
  ];

  return (
    <div
      style={{
        width: 24,
        height: 24,
        display: "grid",
        gridTemplateColumns: "repeat(5,1fr)",
        gap: 1.3,
      }}
    >
      {Array.from({ length: 25 }).map((_, i) => (
        <span
          key={i}
          style={{
            display: "block",
            background: dark.includes(i)
              ? "#17212b"
              : "#dfe4e8",
          }}
        />
      ))}
    </div>
  );
}
