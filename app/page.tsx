"use client";

import { useEffect, useState } from "react";
import SupportLauncher from "./components/SupportLauncher";
import { supabase } from "@/lib/supabase";

type Language = "ka" | "en";

type Product = {
  id: string;
  ka: string;
  en: string;
  kaText: string;
  enText: string;
  resultKa: string;
  resultEn: string;
  image: string;
};

const products: Product[] = [
  {
    id: "dog",
    ka: "ძაღლი",
    en: "Dog",
    kaText:
      "საყელოზე მიმაგრებული QR RETURN ბრელოკი მპოვნელს პატრონთან დაკავშირებაში ეხმარება.",
    enText:
      "A QR RETURN collar tag gives the finder a simple way to contact the owner.",
    resultKa: "დაუკავშირდი პატრონს",
    resultEn: "Contact owner",
    image:
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1000&q=90",
  },
  {
    id: "cat",
    ka: "კატა",
    en: "Cat",
    kaText:
      "კატის საყელოზე პატარა QR ბრელოკი — ერთი სკანი და მპოვნელს შეუძლია კავშირის დაწყება.",
    enText:
      "A small QR collar tag lets the finder start the return process with one scan.",
    resultKa: "Finder Profile",
    resultEn: "Finder Profile",
    image:
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=1000&q=90",
  },
  {
    id: "keys",
    ka: "გასაღებები",
    en: "Keys",
    kaText:
      "სახლისა და მანქანის გასაღებებს ერთი პატარა QR RETURN tag შეუძლია დაბრუნების გზა მისცეს.",
    enText:
      "One compact QR RETURN tag can protect both your home and car keys.",
    resultKa: "Live Chat",
    resultEn: "Live Chat",
    image:
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1000&q=90",
  },
  {
    id: "wallet",
    ka: "საფულე",
    en: "Wallet",
    kaText:
      "საფულეზე პატარა QR კოდი მპოვნელთან უსაფრთხო კავშირს ქმნის.",
    enText:
      "A discreet QR on your wallet creates a secure connection with the finder.",
    resultKa: "უსაფრთხო დაბრუნება",
    resultEn: "Return securely",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1000&q=90",
  },
  {
    id: "luggage",
    ka: "ჩემოდანი",
    en: "Luggage",
    kaText:
      "აეროპორტში ნაპოვნ ჩემოდანზე QR tag — მპოვნელს შეუძლია დაგიკავშირდეთ და ლოკაციაც გაგიზიაროთ.",
    enText:
      "A QR luggage tag helps an airport finder contact you and share the location.",
    resultKa: "Location Shared",
    resultEn: "Location Shared",
    image:
      "https://images.unsplash.com/photo-1581553680321-4fffae59fccd?auto=format&fit=crop&w=1000&q=90",
  },
  {
    id: "bag",
    ka: "ჩანთა",
    en: "Bag",
    kaText:
      "ჩანთაზე QR RETURN tag მპოვნელისთვის მარტივი და სწრაფი საკონტაქტო გზაა.",
    enText:
      "A QR RETURN bag tag gives the finder a fast and simple way to reach you.",
    resultKa: "Owner Notified",
    resultEn: "Owner Notified",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=90",
  },
];

const benefits = [
  {
    no: "01",
    type: "chat",
    ka: "Live Chat",
    en: "Live Chat",
    kaText:
      "მპოვნელთან პირდაპირი კავშირი პირადი ნომრის გამოჩენის გარეშე.",
    enText:
      "Direct finder contact without showing your private phone number.",
  },
  {
    no: "02",
    type: "location",
    ka: "ლოკაციის გაზიარება",
    en: "Location Sharing",
    kaText:
      "მპოვნელმა ერთი ღილაკით შეიძლება გაგიზიაროთ მიმდინარე მდებარეობა.",
    enText:
      "The finder can share the current location with one tap.",
  },
  {
    no: "03",
    type: "reward",
    ka: "მპოვნელის ჯილდო",
    en: "Finder Reward",
    kaText:
      "სურვილის შემთხვევაში მიუთითეთ ჯილდო უსაფრთხო დაბრუნებისთვის.",
    enText:
      "Optionally offer a reward for a safe return.",
  },
  {
    no: "04",
    type: "privacy",
    ka: "Privacy Control",
    en: "Privacy Control",
    kaText:
      "თქვენ აკონტროლებთ რა ინფორმაცია გამოჩნდება მპოვნელისთვის.",
    enText:
      "You control exactly what information is shown to the finder.",
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
      {/* HEADER */}

      <header className="header">
        <a href="/" className="brand">
          <div className="brandLogo">
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
                Admin Panel
              </a>
            )}

            {isLoggedIn ? (
              <a href="/account" className="accountButton">
                <UserIcon />
                {ka ? "ჩემი ანგარიში" : "My Account"}
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

          <div className="languages">
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
          HERO
          LEFT = EMERGENCY
          RIGHT = QR PHONE
      ===================================================== */}

      <section className="hero">
        <div className="heroDecoration one" />
        <div className="heroDecoration two" />

        <div className="heroInner">
          {/* EMERGENCY HERO */}

          <div className="emergencyHero">
            <div className="emergencyBrand">
              <div className="cross">+</div>

              <div>
                <span>QR RETURN •</span>
                <strong>EMERGENCY ID</strong>
              </div>
            </div>

            <h1>
              {ka
                ? "როცა სიტყვის თქმა შეუძლებელია, ინფორმაცია მაინც ხელმისაწვდომია."
                : "When you cannot speak, essential information can still speak for you."}
            </h1>

            <p>
              {ka
                ? "ერთი QR სკანი შეიძლება საკმარისი იყოს, რომ დამხმარემ ნახოს თქვენ მიერ ნებადართული მნიშვნელოვანი ინფორმაცია — ვის დაუკავშირდეს და რა უნდა იცოდეს."
                : "One QR scan can give a helper access to the essential information you choose to share — who to contact and what they should know."}
            </p>

            <div className="emergencyTags">
              <span>SOS READY</span>
              <span>EMERGENCY CONTACT</span>
              <span>MEDICAL INFO</span>
              <span>NO APP</span>
              <span>PRIVACY CONTROL</span>
            </div>

            {/* bracelet visual */}

            <div className="emergencyProduct">
              <div className="bracelet">
                <div className="braceletSide left" />

                <div className="braceletCenter">
                  <div className="miniCross">+</div>
                  <MiniQr />

                  <small>EMERGENCY ID</small>
                </div>

                <div className="braceletSide right" />
              </div>

              <div className="emergencyInfoMini">
                <div className="emergencyInfoTop">
                  <span>SOS READY</span>
                  <strong>EMERGENCY ID</strong>
                </div>

                <div>
                  <HeartIcon />

                  <section>
                    <span>MEDICAL INFO</span>
                    <strong>Available</strong>
                  </section>
                </div>

                <div>
                  <UserIcon />

                  <section>
                    <span>EMERGENCY CONTACT</span>
                    <strong>Available</strong>
                  </section>
                </div>
              </div>
            </div>

            <div className="heroActions">
              <a
                href={isLoggedIn ? "/account" : "/account/register"}
                className="primaryButton"
              >
                {isLoggedIn
                  ? ka
                    ? "ჩემს ანგარიშში გადასვლა"
                    : "Go to My Account"
                  : ka
                  ? "ანგარიშის შექმნა"
                  : "Create Account"}

                <ArrowIcon />
              </a>

              <a href="#products" className="secondaryButton">
                {ka ? "ნახე QR RETURN" : "Explore QR RETURN"}
              </a>
            </div>
          </div>

          {/* PHONE */}

          <div className="phoneStage">
            <div className="phoneHalo" />

            <div className="phone">
              <div className="phoneNotch" />

              <div className="phoneScreen">
                <div className="phoneBrand">
                  <div className="phoneLogo">
                    <QrIcon />
                  </div>

                  <div>
                    <span>QR RETURN</span>
                    <strong>SCAN TO CONNECT</strong>
                  </div>

                  <div className="activeBadge">
                    <i />
                    ACTIVE
                  </div>
                </div>

                <div className="qrScanner">
                  <span className="corner tl" />
                  <span className="corner tr" />
                  <span className="corner bl" />
                  <span className="corner br" />

                  <QrCode />
                </div>

                <div className="phoneCopy">
                  <span>ONE SCAN</span>

                  <strong>
                    {ka
                      ? "მარტივი გზა მფლობელთან დასაკავშირებლად."
                      : "A simple way to reach the owner."}
                  </strong>

                  <p>Live Chat • Location • Contact Options</p>
                </div>

                <div className="phoneFooter">
                  <div>
                    <ShieldIcon />
                    <span>{ka ? "დაცული მონაცემები" : "Protected"}</span>
                  </div>

                  <div>
                    <ScanIcon />
                    <span>{ka ? "აპის გარეშე" : "No App"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="chatFloat">
              <div>
                <ChatIcon />
              </div>

              <section>
                <span>LIVE CHAT</span>

                <strong>
                  {ka
                    ? "მპოვნელთან პირდაპირი კავშირი"
                    : "Direct finder contact"}
                </strong>
              </section>

              <i />
            </div>

            <div className="locationFloat">
              <LocationIcon />

              <div>
                <span>LOCATION</span>
                <strong>{ka ? "გაზიარებულია" : "Shared"}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <section id="products" className="productsSection">
        <div className="shell">
          <div className="productsHeading">
            <div>
              <span className="eyebrow">QR RETURN IN REAL LIFE</span>

              <h2>
                {ka
                  ? "ერთი პატარა QR. ყოველდღიური ნივთები და საყვარელი ცხოველები."
                  : "One small QR. Everyday belongings and the pets you love."}
              </h2>
            </div>

            <p>
              {ka
                ? "QR RETURN-ის დანახვისას მპოვნელისთვის შემდეგი ნაბიჯი მარტივია — დაასკანეროს."
                : "When a finder sees QR RETURN, the next step is simple — scan it."}
            </p>
          </div>

          <div className="productGrid">
            {products.map((product) => (
              <article key={product.id} className="productCard">
                <div className="productPhoto">
                  <img
                    src={product.image}
                    alt={ka ? product.ka : product.en}
                  />

                  <div className="photoGradient" />

                  {/* QR RETURN tag attached to the object/pet */}

                  <div
                    className={`physicalTag physicalTag-${product.id}`}
                  >
                    <div className="tagHole" />

                    <MiniQr />

                    <small>QR RETURN</small>
                  </div>

                  {/* Finder phone / scan hint */}

                  <div className="finderPhone">
                    <div className="finderNotch" />

                    <div className="finderScreen">
                      <span className="finderCorner a" />
                      <span className="finderCorner b" />
                      <span className="finderCorner c" />
                      <span className="finderCorner d" />

                      <MiniQr />
                    </div>
                  </div>

                  <div className="photoTitle">
                    <span>QR RETURN</span>
                    <strong>{ka ? product.ka : product.en}</strong>
                  </div>
                </div>

                <div className="productCopy">
                  <p>{ka ? product.kaText : product.enText}</p>

                  <div className="resultTag">
                    <i />
                    {ka ? product.resultKa : product.resultEn}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          FLOW
      ===================================================== */}

      <section className="flowSection">
        <div className="shell">
          <div className="flowHeading">
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

            <div className="flowLine" />

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

            <div className="flowLine" />

            <FlowStep
              number="03"
              icon={<ChatIcon />}
              title={ka ? "დაგიკავშირდნენ" : "Connected"}
              text={
                ka
                  ? "Live Chat, ზარი ან თქვენ მიერ არჩეული მეთოდი."
                  : "Live Chat, call or another contact option."
              }
            />

            <div className="flowLine" />

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

      {/* BENEFITS */}

      <section className="benefitsSection">
        <div className="shell">
          <div className="benefitsHeading">
            <span>BUILT AROUND CONNECTION &amp; CONTROL</span>

            <h2>
              {ka
                ? "მარტივი მპოვნელისთვის. კონტროლირებადი თქვენთვის."
                : "Simple for the finder. Controlled by you."}
            </h2>
          </div>

          <div className="benefitsGrid">
            {benefits.map((benefit) => (
              <article key={benefit.no}>
                <div className="benefitTop">
                  <span>{benefit.no}</span>

                  <div>
                    {benefit.type === "chat" && <ChatIcon />}
                    {benefit.type === "location" && <LocationIcon />}
                    {benefit.type === "reward" && <RewardIcon />}
                    {benefit.type === "privacy" && <ShieldIcon />}
                  </div>
                </div>

                <h3>{ka ? benefit.ka : benefit.en}</h3>
                <p>{ka ? benefit.kaText : benefit.enText}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ACCOUNT */}

      <section className="accountSection">
        <div className="shell">
          <div className="accountPanel">
            <div className="accountIcon">
              <UserIcon />
            </div>

            <div className="accountText">
              <span>ONE OWNER ACCOUNT</span>

              <h2>
                {ka
                  ? "ყველა QR პროფილი ერთ სივრცეში."
                  : "Every QR profile in one place."}
              </h2>

              <p>
                {ka
                  ? "ძაღლი, კატა, გასაღებები, საფულე, ჩემოდანი, ჩანთა და Emergency ID — მართეთ ერთი ანგარიშიდან."
                  : "Dog, cat, keys, wallet, luggage, bag and Emergency ID — manage everything from one account."}
              </p>
            </div>

            <a href={isLoggedIn ? "/account" : "/account/register"}>
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

      {/* CONTACT */}

      <section className="contactSection">
        <div className="shell contactInner">
          <div>
            <span className="eyebrow">CONTACT</span>

            <h2>{ka ? "დაგვიკავშირდით" : "Contact us"}</h2>

            <p>
              {ka
                ? "კითხვა გაქვთ QR RETURN-ის, ანგარიშის ან Emergency ID-ის შესახებ? მოგვწერეთ."
                : "Questions about QR RETURN, accounts or Emergency ID? Send us a message."}
            </p>
          </div>

          <a href="mailto:hello@qrreturn.com">
            {ka ? "მოგვწერეთ" : "Email us"}
            <ArrowIcon />
          </a>
        </div>
      </section>

      {/* EXISTING LIVE CHAT */}
      <SupportLauncher language={language} />

      {/* FOOTER */}

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
            <a href="#products">{ka ? "გამოყენება" : "Use Cases"}</a>
            <span>Emergency ID</span>
            <span>{ka ? "კონფიდენციალურობა" : "Privacy"}</span>
            <span>{ka ? "პირობები" : "Terms"}</span>
          </div>

          <span className="copyright">© 2026 QR RETURN</span>
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
          background: #f7f7f5;
        }

        .page {
          overflow: hidden;
          color: #17202a;
          background: #f7f7f5;
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
          max-width: 1190px;
          margin: auto;
        }

        .eyebrow {
          color: #d94e56;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        /* HEADER */

        .header {
          width: calc(100% - 52px);
          max-width: 1280px;
          min-height: 80px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          border-bottom: 1px solid rgba(17, 24, 39, 0.08);
        }

        .brand,
        .headerRight,
        .nav,
        .languages {
          display: flex;
          align-items: center;
        }

        .brand {
          gap: 11px;
          text-decoration: none;
        }

        .brandLogo {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          color: white;
          background: #1b2531;
        }

        .brandLogo :global(svg) {
          width: 22px;
        }

        .brandText strong,
        .brandText span {
          display: block;
        }

        .brandText strong {
          color: #1b2531;
          font-size: 18px;
          font-weight: 850;
        }

        .brandText span {
          margin-top: 3px;
          color: #979da6;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .headerRight {
          gap: 14px;
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
          text-decoration: none;
          font-size: 10px;
          font-weight: 820;
        }

        .adminButton {
          color: #a83940;
          border: 1px solid #efd7da;
          background: #fff7f7;
        }

        .adminButton :global(svg),
        .accountButton :global(svg) {
          width: 13px;
        }

        .accountButton {
          color: white;
          background: #1b2531;
        }

        .loginButton {
          color: #505965;
          border: 1px solid #dce0e4;
        }

        .languages {
          gap: 7px;
        }

        .languages > span {
          width: 1px;
          height: 12px;
          background: #d3d7dc;
        }

        .languages button {
          padding: 0;
          border: 0;
          background: none;
          color: #9ba1aa;
          font-size: 8px;
          font-weight: 900;
          cursor: pointer;
        }

        .languages button.active {
          color: #d94e56;
        }

        /* HERO */

        .hero {
          min-height: 680px;
          position: relative;
          background:
            linear-gradient(
              122deg,
              #f9f8f5,
              #f2f3f2 52%,
              #eaedf0
            );
        }

        .heroInner {
          width: calc(100% - 52px);
          max-width: 1240px;
          min-height: 680px;
          margin: auto;
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1fr 0.95fr;
          align-items: center;
          gap: 78px;
        }

        .heroDecoration {
          position: absolute;
          border-radius: 50%;
        }

        .heroDecoration.one {
          width: 540px;
          height: 540px;
          right: -200px;
          top: -200px;
          background: radial-gradient(
            circle,
            rgba(58, 75, 100, 0.14),
            transparent 70%
          );
        }

        .heroDecoration.two {
          width: 330px;
          height: 330px;
          left: -180px;
          bottom: -180px;
          background: radial-gradient(
            circle,
            rgba(217, 78, 86, 0.07),
            transparent 70%
          );
        }

        /* EMERGENCY LEFT */

        .emergencyHero {
          max-width: 560px;
        }

        .emergencyBrand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cross {
          width: 49px;
          height: 49px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          color: white;
          background: #d94e56;
          font-size: 31px;
          box-shadow: 0 10px 25px rgba(217, 78, 86, 0.2);
        }

        .emergencyBrand span,
        .emergencyBrand strong {
          display: block;
        }

        .emergencyBrand span {
          color: #d94e56;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.3px;
        }

        .emergencyBrand strong {
          margin-top: 3px;
          color: #26313e;
          font-size: 15px;
        }

        .emergencyHero h1 {
          max-width: 520px;
          margin: 26px 0 0;
          color: #17202a;
          font-size: clamp(34px, 4.1vw, 48px);
          line-height: 1.07;
          letter-spacing: -2.5px;
          font-weight: 690;
        }

        .emergencyHero > p {
          max-width: 510px;
          margin: 18px 0 0;
          color: #69727e;
          font-size: 12px;
          line-height: 1.72;
        }

        .emergencyTags {
          margin-top: 21px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .emergencyTags span {
          padding: 7px 9px;
          border: 1px solid #ecd8da;
          border-radius: 999px;
          color: #af4147;
          background: rgba(255, 250, 250, 0.75);
          font-size: 5.5px;
          font-weight: 900;
          letter-spacing: 0.6px;
        }

        .emergencyProduct {
          min-height: 130px;
          margin-top: 25px;
          position: relative;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .bracelet {
          width: 270px;
          display: flex;
          align-items: center;
          transform: rotate(-4deg);
          filter: drop-shadow(0 13px 14px rgba(25, 35, 47, 0.1));
        }

        .braceletSide {
          height: 42px;
          flex: 1;
          background: #d4dae1;
        }

        .braceletSide.left {
          border-radius: 21px 0 0 21px;
        }

        .braceletSide.right {
          border-radius: 0 21px 21px 0;
        }

        .braceletCenter {
          width: 112px;
          height: 88px;
          flex: 0 0 112px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 4px solid #bdc5ce;
          border-radius: 20px;
          background: white;
        }

        .miniCross {
          width: 17px;
          height: 17px;
          position: absolute;
          top: 7px;
          right: 7px;
          display: grid;
          place-items: center;
          border-radius: 5px;
          color: white;
          background: #d94e56;
          font-size: 12px;
        }

        .braceletCenter small {
          margin-top: 5px;
          color: #a64046;
          font-size: 4.5px;
          font-weight: 900;
          letter-spacing: 0.7px;
        }

        .emergencyInfoMini {
          width: 180px;
          padding: 12px;
          border: 1px solid #e1e4e7;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.86);
          box-shadow: 0 10px 25px rgba(30, 39, 51, 0.055);
        }

        .emergencyInfoTop {
          margin-bottom: 7px;
        }

        .emergencyInfoTop span,
        .emergencyInfoTop strong {
          display: block;
        }

        .emergencyInfoTop span {
          color: #d94e56;
          font-size: 5px;
          font-weight: 900;
        }

        .emergencyInfoTop strong {
          margin-top: 2px;
          color: #2c3744;
          font-size: 8px;
        }

        .emergencyInfoMini > div:not(.emergencyInfoTop) {
          min-height: 37px;
          display: flex;
          align-items: center;
          gap: 7px;
          border-top: 1px solid #eceef0;
        }

        .emergencyInfoMini :global(svg) {
          width: 13px;
          color: #d94e56;
        }

        .emergencyInfoMini section span,
        .emergencyInfoMini section strong {
          display: block;
        }

        .emergencyInfoMini section span {
          color: #9aa1aa;
          font-size: 4px;
          font-weight: 900;
        }

        .emergencyInfoMini section strong {
          margin-top: 2px;
          color: #505b68;
          font-size: 5px;
        }

        .heroActions {
          margin-top: 26px;
          display: flex;
          gap: 9px;
        }

        .primaryButton,
        .secondaryButton {
          min-height: 44px;
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

        .primaryButton {
          color: white;
          background: #1b2531;
        }

        .primaryButton :global(svg) {
          width: 12px;
        }

        .secondaryButton {
          color: #515b68;
          border: 1px solid #d9dde2;
          background: rgba(255, 255, 255, 0.55);
        }

        /* PHONE */

        .phoneStage {
          min-height: 570px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .phoneHalo {
          width: 480px;
          height: 480px;
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(64, 82, 108, 0.17),
            rgba(64, 82, 108, 0.025) 50%,
            transparent 70%
          );
        }

        .phone {
          width: 276px;
          height: 530px;
          padding: 9px;
          position: relative;
          z-index: 3;
          border-radius: 43px;
          background: linear-gradient(140deg, #141b24, #05090d);
          box-shadow: 0 40px 85px rgba(20, 28, 40, 0.22);
          transform:
            perspective(1300px)
            rotateY(-6deg)
            rotateZ(2deg);
        }

        .phoneNotch {
          width: 73px;
          height: 18px;
          position: absolute;
          top: 14px;
          left: 50%;
          z-index: 4;
          border-radius: 999px;
          background: #060a0e;
          transform: translateX(-50%);
        }

        .phoneScreen {
          height: 100%;
          padding: 34px 18px 18px;
          border-radius: 34px;
          background: linear-gradient(180deg, #fff, #f6f8fa);
        }

        .phoneBrand {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 8px;
        }

        .phoneLogo {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          color: white;
          background: #1b2531;
        }

        .phoneLogo :global(svg) {
          width: 16px;
        }

        .phoneBrand span,
        .phoneBrand strong {
          display: block;
        }

        .phoneBrand span {
          color: #d94e56;
          font-size: 5.5px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .phoneBrand strong {
          margin-top: 2px;
          color: #475361;
          font-size: 7px;
        }

        .activeBadge {
          padding: 5px 6px;
          display: flex;
          align-items: center;
          gap: 4px;
          border-radius: 999px;
          color: #19784d;
          background: #eaf9ef;
          font-size: 5px;
          font-weight: 900;
        }

        .activeBadge i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #28a86d;
        }

        .qrScanner {
          width: 195px;
          height: 195px;
          margin: 62px auto 0;
          position: relative;
          display: grid;
          place-items: center;
          border-radius: 22px;
          background: white;
          box-shadow: 0 17px 42px rgba(30, 40, 55, 0.07);
        }

        .corner {
          width: 31px;
          height: 31px;
          position: absolute;
        }

        .tl {
          top: 0;
          left: 0;
          border-top: 3px solid #d94e56;
          border-left: 3px solid #d94e56;
        }

        .tr {
          top: 0;
          right: 0;
          border-top: 3px solid #d94e56;
          border-right: 3px solid #d94e56;
        }

        .bl {
          left: 0;
          bottom: 0;
          border-left: 3px solid #d94e56;
          border-bottom: 3px solid #d94e56;
        }

        .br {
          right: 0;
          bottom: 0;
          border-right: 3px solid #d94e56;
          border-bottom: 3px solid #d94e56;
        }

        .phoneCopy {
          margin-top: 27px;
          text-align: center;
        }

        .phoneCopy > span {
          color: #a0a6ae;
          font-size: 5px;
          font-weight: 900;
          letter-spacing: 1.3px;
        }

        .phoneCopy strong {
          display: block;
          max-width: 200px;
          margin: 5px auto 0;
          color: #252f3b;
          font-size: 10px;
          line-height: 1.45;
        }

        .phoneCopy p {
          margin: 5px 0 0;
          color: #8c949d;
          font-size: 6px;
        }

        .phoneFooter {
          margin-top: 29px;
          padding-top: 13px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-top: 1px solid #e3e6ea;
        }

        .phoneFooter > div {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #808895;
          font-size: 6px;
        }

        .phoneFooter :global(svg) {
          width: 12px;
          color: #d94e56;
        }

        .chatFloat,
        .locationFloat {
          position: absolute;
          z-index: 5;
          display: flex;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.93);
          box-shadow: 0 18px 45px rgba(33, 43, 56, 0.12);
          backdrop-filter: blur(17px);
        }

        .chatFloat {
          width: 205px;
          left: -28px;
          bottom: 78px;
          padding: 11px;
          gap: 9px;
          border-radius: 15px;
        }

        .chatFloat > div {
          width: 37px;
          height: 37px;
          display: grid;
          place-items: center;
          flex: 0 0 37px;
          border-radius: 10px;
          color: #d94e56;
          background: #fff0f1;
        }

        .chatFloat :global(svg) {
          width: 16px;
        }

        .chatFloat section {
          flex: 1;
        }

        .chatFloat span,
        .chatFloat strong,
        .locationFloat span,
        .locationFloat strong {
          display: block;
        }

        .chatFloat span,
        .locationFloat span {
          color: #979ea7;
          font-size: 5px;
          font-weight: 900;
          letter-spacing: 0.9px;
        }

        .chatFloat strong,
        .locationFloat strong {
          margin-top: 3px;
          color: #3a4551;
          font-size: 8px;
        }

        .chatFloat > i {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #28a86d;
        }

        .locationFloat {
          right: -5px;
          top: 93px;
          padding: 11px;
          gap: 8px;
          border-radius: 13px;
        }

        .locationFloat :global(svg) {
          width: 19px;
          color: #1b2531;
        }

        /* PRODUCTS */

        .productsSection {
          padding: 90px 0;
          background: #fbfbf9;
        }

        .productsHeading {
          display: grid;
          grid-template-columns: 1fr 0.52fr;
          align-items: end;
          gap: 70px;
        }

        .productsHeading h2,
        .flowHeading h2,
        .accountText h2 {
          margin: 10px 0 0;
          color: #18212b;
          font-size: clamp(31px, 3.8vw, 43px);
          line-height: 1.07;
          letter-spacing: -2.1px;
          font-weight: 680;
        }

        .productsHeading > p {
          margin: 0;
          color: #717a86;
          font-size: 10.5px;
          line-height: 1.7;
        }

        .productGrid {
          margin-top: 37px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 13px;
        }

        .productCard {
          overflow: hidden;
          border: 1px solid #e1e4e7;
          border-radius: 18px;
          background: white;
          box-shadow: 0 8px 24px rgba(30, 39, 52, 0.035);
        }

        .productPhoto {
          height: 210px;
          position: relative;
          overflow: hidden;
          background: #dfe3e7;
        }

        .productPhoto > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.45s ease;
        }

        .productCard:hover .productPhoto > img {
          transform: scale(1.025);
        }

        .photoGradient {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              180deg,
              rgba(10, 14, 20, 0) 35%,
              rgba(9, 13, 18, 0.1) 65%,
              rgba(7, 10, 14, 0.66) 100%
            );
        }

        /* Physical QR tags */

        .physicalTag {
          width: 54px;
          min-height: 64px;
          padding: 8px 6px 6px;
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 9px 22px rgba(0, 0, 0, 0.16);
          transform-origin: top center;
        }

        .physicalTag-dog {
          top: 88px;
          left: 49%;
          transform: translateX(-50%) rotate(5deg) scale(0.78);
        }

        .physicalTag-cat {
          top: 91px;
          left: 49%;
          transform: translateX(-50%) rotate(-4deg) scale(0.76);
        }

        .physicalTag-keys {
          top: 70px;
          left: 44%;
          transform: translateX(-50%) rotate(8deg) scale(0.76);
        }

        .physicalTag-wallet {
          top: 78px;
          left: 52%;
          transform: translateX(-50%) rotate(-3deg) scale(0.78);
        }

        .physicalTag-luggage {
          top: 35px;
          left: 52%;
          transform: translateX(-50%) rotate(2deg) scale(0.8);
        }

        .physicalTag-bag {
          top: 50px;
          left: 58%;
          transform: translateX(-50%) rotate(6deg) scale(0.78);
        }

        .tagHole {
          width: 6px;
          height: 6px;
          margin-bottom: 4px;
          border: 1px solid #aeb5bd;
          border-radius: 50%;
        }

        .physicalTag small {
          margin-top: 4px;
          color: #3e4956;
          font-size: 4px;
          font-weight: 900;
          letter-spacing: 0.4px;
        }

        /* Finder phone */

        .finderPhone {
          width: 48px;
          height: 80px;
          padding: 5px;
          position: absolute;
          top: 12px;
          right: 11px;
          border-radius: 11px;
          background: #171e28;
          box-shadow: 0 9px 22px rgba(0, 0, 0, 0.18);
          transform: rotate(5deg);
        }

        .finderNotch {
          width: 14px;
          height: 3px;
          margin: 0 auto 7px;
          border-radius: 99px;
          background: #434a54;
        }

        .finderScreen {
          height: 56px;
          position: relative;
          display: grid;
          place-items: center;
          border-radius: 6px;
          background: #f7f7f7;
        }

        .finderCorner {
          width: 7px;
          height: 7px;
          position: absolute;
        }

        .finderCorner.a {
          top: 4px;
          left: 4px;
          border-top: 1px solid #d94e56;
          border-left: 1px solid #d94e56;
        }

        .finderCorner.b {
          top: 4px;
          right: 4px;
          border-top: 1px solid #d94e56;
          border-right: 1px solid #d94e56;
        }

        .finderCorner.c {
          left: 4px;
          bottom: 4px;
          border-left: 1px solid #d94e56;
          border-bottom: 1px solid #d94e56;
        }

        .finderCorner.d {
          right: 4px;
          bottom: 4px;
          border-right: 1px solid #d94e56;
          border-bottom: 1px solid #d94e56;
        }

        .photoTitle {
          position: absolute;
          left: 15px;
          right: 15px;
          bottom: 13px;
        }

        .photoTitle span,
        .photoTitle strong {
          display: block;
        }

        .photoTitle span {
          color: #d7dce1;
          font-size: 4.5px;
          font-weight: 900;
          letter-spacing: 1.2px;
        }

        .photoTitle strong {
          margin-top: 3px;
          color: white;
          font-size: 17px;
          letter-spacing: -0.3px;
        }

        .productCopy {
          min-height: 105px;
          padding: 13px 14px;
          display: flex;
          flex-direction: column;
        }

        .productCopy p {
          margin: 0;
          flex: 1;
          color: #707985;
          font-size: 8px;
          line-height: 1.6;
        }

        .resultTag {
          width: fit-content;
          margin-top: 9px;
          padding: 6px 8px;
          display: flex;
          align-items: center;
          gap: 5px;
          border-radius: 999px;
          color: #48535f;
          background: #f0f2f4;
          font-size: 6px;
          font-weight: 800;
        }

        .resultTag i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #28a86d;
        }

        /* FLOW */

        .flowSection {
          padding: 88px 0;
          background: #f0f1ef;
        }

        .flowHeading {
          max-width: 650px;
        }

        .flow {
          margin-top: 43px;
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
          align-items: start;
        }

        .flowLine {
          width: 55px;
          height: 1px;
          margin: 35px 17px 0;
          background: #d8dce0;
        }

        /* BENEFITS */

        .benefitsSection {
          padding: 88px 0;
          color: white;
          background: #1a2430;
        }

        .benefitsHeading > span {
          color: #e38c91;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1.8px;
        }

        .benefitsHeading h2 {
          max-width: 700px;
          margin: 10px 0 0;
          color: white;
          font-size: clamp(31px, 3.8vw, 42px);
          line-height: 1.07;
          letter-spacing: -2px;
          font-weight: 650;
        }

        .benefitsGrid {
          margin-top: 40px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .benefitsGrid article {
          min-height: 190px;
          padding: 21px 19px;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
        }

        .benefitsGrid article:last-child {
          border-right: 0;
        }

        .benefitTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .benefitTop > span {
          color: #687380;
          font-size: 7px;
          font-weight: 900;
        }

        .benefitTop > div {
          width: 35px;
          height: 35px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          color: #e38c91;
          background: rgba(255, 255, 255, 0.06);
        }

        .benefitTop :global(svg) {
          width: 15px;
        }

        .benefitsGrid h3 {
          margin: 31px 0 0;
          color: white;
          font-size: 12px;
        }

        .benefitsGrid p {
          margin: 8px 0 0;
          color: #929ca8;
          font-size: 8.5px;
          line-height: 1.65;
        }

        /* ACCOUNT */

        .accountSection {
          padding: 68px 0;
          background: #f8f8f6;
        }

        .accountPanel {
          padding: 27px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 20px;
          border: 1px solid #e0e3e6;
          border-radius: 20px;
          background: white;
        }

        .accountIcon {
          width: 56px;
          height: 56px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          color: #1b2531;
          background: #eef0f2;
        }

        .accountIcon :global(svg) {
          width: 23px;
        }

        .accountText > span {
          color: #d94e56;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1.3px;
        }

        .accountText h2 {
          font-size: clamp(26px, 3vw, 36px);
        }

        .accountText p {
          margin: 8px 0 0;
          color: #747d88;
          font-size: 9.5px;
          line-height: 1.65;
        }

        .accountPanel > a {
          min-height: 41px;
          padding: 0 14px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border-radius: 10px;
          color: white;
          background: #1b2531;
          font-size: 8.5px;
          font-weight: 850;
          text-decoration: none;
        }

        .accountPanel > a :global(svg) {
          width: 12px;
        }

        /* CONTACT */

        .contactSection {
          padding: 68px 0;
          background: #eeeeec;
        }

        .contactInner {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 50px;
        }

        .contactInner h2 {
          margin: 9px 0 8px;
          font-size: 34px;
          letter-spacing: -1.6px;
        }

        .contactInner p {
          max-width: 600px;
          margin: 0;
          color: #707985;
          font-size: 10px;
          line-height: 1.7;
        }

        .contactInner > a {
          min-height: 41px;
          padding: 0 14px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border-radius: 10px;
          color: white;
          background: #1b2531;
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
          gap: 35px;
        }

        .footerBrand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .footerBrand > div {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          color: white;
          background: #d94e56;
        }

        .footerBrand > div :global(svg) {
          width: 19px;
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
          color: #707b87;
          font-size: 5px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        .footerLinks {
          display: flex;
          flex-wrap: wrap;
          gap: 22px;
        }

        .footerLinks a,
        .footerLinks span {
          color: #858f9b;
          font-size: 8px;
          text-decoration: none;
        }

        .copyright {
          color: #5d6875;
          font-size: 7px;
        }

        @media (max-width: 980px) {
          .heroInner {
            grid-template-columns: 1fr;
            padding: 60px 0 80px;
          }

          .productsHeading {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .productGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .flow {
            grid-template-columns: repeat(2, 1fr);
            gap: 25px;
          }

          .flowLine {
            display: none;
          }

          .benefitsGrid {
            grid-template-columns: repeat(2, 1fr);
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
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 650px) {
          .header {
            width: calc(100% - 18px);
            min-height: 70px;
          }

          .brandText span,
          .languages {
            display: none;
          }

          .brandLogo {
            width: 38px;
            height: 38px;
          }

          .brandText strong {
            font-size: 15px;
          }

          .adminButton {
            padding: 0 8px;
          }

          .adminButton {
            font-size: 0;
          }

          .adminButton :global(svg) {
            width: 14px;
          }

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
            padding: 46px 0 70px;
          }

          .emergencyHero h1 {
            font-size: 34px;
            letter-spacing: -1.9px;
          }

          .emergencyProduct {
            flex-direction: column;
            align-items: flex-start;
          }

          .heroActions {
            flex-direction: column;
          }

          .primaryButton,
          .secondaryButton {
            width: 100%;
          }

          .phoneStage {
            min-height: 520px;
          }

          .phone {
            width: 245px;
            height: 490px;
          }

          .qrScanner {
            width: 170px;
            height: 170px;
          }

          .chatFloat {
            width: 188px;
            left: -4px;
            bottom: 47px;
          }

          .locationFloat {
            right: -4px;
            top: 68px;
          }

          .productsSection,
          .flowSection,
          .benefitsSection {
            padding: 70px 0;
          }

          .productsHeading h2,
          .flowHeading h2,
          .accountText h2 {
            font-size: 32px;
            letter-spacing: -1.8px;
          }

          .productGrid {
            grid-template-columns: 1fr;
          }

          .productPhoto {
            height: 230px;
          }

          .flow,
          .benefitsGrid {
            grid-template-columns: 1fr;
          }

          .benefitsGrid article {
            border-right: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .benefitsGrid article:last-child {
            border-bottom: 0;
          }

          .contactSection {
            padding: 56px 0;
          }

          .contactInner > a {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </main>
  );
}

/* ==========================================================
   FLOW STEP
========================================================== */

function FlowStep({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <article className="flowStep">
      <span>{number}</span>

      <div>{icon}</div>

      <strong>{title}</strong>

      <p>{text}</p>

      <style jsx>{`
        .flowStep > span {
          color: #aeb4bc;
          font-size: 7px;
          font-weight: 900;
        }

        .flowStep > div {
          width: 46px;
          height: 46px;
          margin-top: 14px;
          display: grid;
          place-items: center;
          border: 1px solid #dde1e5;
          border-radius: 13px;
          color: #1b2531;
          background: white;
        }

        .flowStep > div :global(svg) {
          width: 18px;
        }

        .flowStep strong {
          display: block;
          margin-top: 16px;
          color: #303a46;
          font-size: 11px;
        }

        .flowStep p {
          margin: 6px 0 0;
          color: #79828d;
          font-size: 8.5px;
          line-height: 1.6;
        }
      `}</style>
    </article>
  );
}

/* ==========================================================
   ICONS
========================================================== */

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
        display: "grid",
        gridTemplateColumns: "repeat(7,1fr)",
        gap: 4,
      }}
    >
      {Array.from({ length: 49 }).map((_, i) => (
        <span
          key={i}
          style={{
            borderRadius: 1,
            background: dark.includes(i)
              ? "#1b2531"
              : "#e0e4e8",
          }}
        />
      ))}
    </div>
  );
}

function MiniQr() {
  const dark = [
    0, 1, 2, 4, 6,
    7, 8, 10, 12,
    14, 15, 17, 18,
    20, 21, 22, 24,
  ];

  return (
    <div
      style={{
        width: 25,
        height: 25,
        display: "grid",
        gridTemplateColumns: "repeat(5,1fr)",
        gap: 1.4,
      }}
    >
      {Array.from({ length: 25 }).map((_, i) => (
        <span
          key={i}
          style={{
            background: dark.includes(i)
              ? "#1b2531"
              : "#dfe3e7",
          }}
        />
      ))}
    </div>
  );
}
