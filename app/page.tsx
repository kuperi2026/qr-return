"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import SupportLauncher from "./components/SupportLauncher";
import { supabase } from "@/lib/supabase";

type Language = "ka" | "en";

const ecosystemItems = [
  {
    id: "dog",
    ka: "ძაღლი",
    en: "Dog",
    className: "orbitDog",
    image:
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=500&q=88",
    mode: "pet",
  },
  {
    id: "cat",
    ka: "კატა",
    en: "Cat",
    className: "orbitCat",
    image:
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=500&q=88",
    mode: "pet",
  },
  {
    id: "keys",
    ka: "სახლის + მანქანის გასაღები",
    en: "Home + Car Keys",
    className: "orbitKeys",
    image: "",
    mode: "keys",
  },
  {
    id: "wallet",
    ka: "საფულე",
    en: "Wallet",
    className: "orbitWallet",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=500&q=88",
    mode: "item",
  },
  {
    id: "luggage",
    ka: "ჩემოდანი",
    en: "Luggage",
    className: "orbitLuggage",
    image:
      "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=500&q=88",
    mode: "luggage",
  },
  {
    id: "bag",
    ka: "ჩანთა",
    en: "Bag",
    className: "orbitBag",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=88",
    mode: "item",
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
      "Talk directly with the finder without exposing your private number.",
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
      "თქვენ თავად აკონტროლებთ რა ინფორმაცია გამოჩნდება მპოვნელისთვის.",
    enText:
      "You control exactly what information becomes visible to a finder.",
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
      {/* =========================================================
          HEADER
      ========================================================= */}

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

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="hero">
        <div className="heroLight heroLightOne" />
        <div className="heroLight heroLightTwo" />

        <div className="heroInner">
          {/* =====================================================
              LEFT — EMERGENCY ID
          ===================================================== */}

          <div className="emergencySide">
            <div className="emergencyKicker">
              <span className="miniMedical">+</span>
              <span>QR RETURN • EMERGENCY ID</span>
            </div>

            <h1>
              {ka
                ? "როცა სიტყვის თქმა შეუძლებელია, ინფორმაცია მაინც ხელმისაწვდომია."
                : "When you cannot speak, essential information can still speak for you."}
            </h1>

            <p className="emergencyDescription">
              {ka
                ? "ერთი QR სკანი შეიძლება საკმარისი იყოს, რომ დამხმარემ ნახოს მხოლოდ თქვენ მიერ ნებადართული საგანგებო ინფორმაცია."
                : "One QR scan can give a helper access to only the emergency information you choose to share."}
            </p>

            {/* LARGE BRACELET */}

            <div className="emergencyPresentation">
              <div className="braceletScene">
                <div className="braceletShadow" />

                <div className="bracelet">
                  <div className="strap left" />

                  <div className="braceletFace">
                    <div className="braceletHeader">
                      <span className="braceletMedical">+</span>
                      <span>QR RETURN</span>
                    </div>

                    <div className="braceletQr">
                      <QrCode compact />
                    </div>

                    <small>EMERGENCY ID</small>
                  </div>

                  <div className="strap right" />
                </div>

                <span className="braceletCaption">
                  {ka
                    ? "Emergency QR სამაჯური"
                    : "Emergency QR bracelet"}
                </span>
              </div>

              {/* EMERGENCY PROFILE */}

              <div className="emergencyProfile">
                <div className="profileTop">
                  <div>
                    <span>EMERGENCY PROFILE</span>
                    <strong>ESSENTIAL INFORMATION</strong>
                  </div>

                  <span className="sosPill">SOS READY</span>
                </div>

                <EmergencyRow
                  icon={<PhoneIcon />}
                  label={ka ? "საგანგებო კონტაქტი" : "Emergency Contact"}
                  value="+1 ••• ••• 0184"
                />

                <EmergencyRow
                  icon={<HeartIcon />}
                  label={ka ? "სამედიცინო ინფორმაცია" : "Medical Info"}
                  value={ka ? "ხელმისაწვდომია" : "Available"}
                />

                <EmergencyRow
                  icon={<AlertIcon />}
                  label={ka ? "ალერგიები" : "Allergies"}
                  value={ka ? "პროფილში მითითებული" : "Listed in profile"}
                />

                <EmergencyRow
                  icon={<DropletIcon />}
                  label={ka ? "სისხლის ჯგუფი" : "Blood Type"}
                  value="O+"
                />

                <div className="profilePrivacy">
                  <ShieldIcon />

                  <span>
                    {ka
                      ? "თქვენ აკონტროლებთ რა ინფორმაცია ჩანს."
                      : "You control what information is visible."}
                  </span>
                </div>
              </div>
            </div>

            <div className="emergencySignals">
              <span>SOS READY</span>
              <span>EMERGENCY CONTACT</span>
              <span>MEDICAL INFO</span>
              <span>NO APP</span>
              <span>PRIVACY CONTROL</span>
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

              <a href="#video" className="secondaryButton">
                {ka ? "როგორ მუშაობს" : "How it works"}
              </a>
            </div>
          </div>

          {/* =====================================================
              RIGHT — ECOSYSTEM
          ===================================================== */}

          <div className="ecosystem">
            <div className="ecosystemGlow" />

            <div className="orbitLine orbitLineOne" />
            <div className="orbitLine orbitLineTwo" />

            {/* 6 PRODUCT ORBIT */}

            {ecosystemItems.map((item) => (
              <div
                key={item.id}
                className={`orbitItem ${item.className}`}
              >
                <div className="orbitPhoto">
                  {item.mode === "keys" ? (
                    <KeysScene />
                  ) : (
                    <img src={item.image} alt={ka ? item.ka : item.en} />
                  )}

                  <div className="orbitShade" />

                  {/* physical QR tag */}
                  <div className={`orbitQrTag ${item.mode}`}>
                    <span className="tagLoop" />
                    <MiniQr />
                  </div>

                  {item.mode === "luggage" && (
                    <span className="airportMarker">
                      AIRPORT
                    </span>
                  )}
                </div>

                <span className="orbitLabel">
                  {ka ? item.ka : item.en}
                </span>
              </div>
            ))}

            {/* CENTER PHONE */}

            <div className="centerPhone">
              <div className="centerPhoneNotch" />

              <div className="centerPhoneScreen">
                <div className="phoneBrandSmall">
                  <div>
                    <QrIcon />
                  </div>

                  <section>
                    <span>QR RETURN</span>
                    <strong>FINDER ACCESS</strong>
                  </section>
                </div>

                <div className="phoneQr">
                  <QrCode />
                </div>

                <div className="phoneMainText">
                  <span>SCAN COMPLETE</span>

                  <strong>
                    {ka
                      ? "დაუკავშირდი მფლობელს"
                      : "Contact the owner"}
                  </strong>

                  <p>
                    {ka
                      ? "აირჩიე დაკავშირების მეთოდი"
                      : "Choose a contact option"}
                  </p>
                </div>

                <div className="phoneActions">
                  <div className="phoneAction main">
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
              </div>
            </div>

            {/* CENTRAL REAL TAG */}

            <div className="heroQrTag">
              <div className="tagRing" />

              <div className="heroTagBody">
                <div className="heroTagBrand">QR RETURN</div>

                <QrCode compact />

                <small>SCAN TO RETURN</small>
              </div>
            </div>

            <div className="ecosystemCaption">
              <span>ONE QR SYSTEM</span>
              <strong>
                {ka
                  ? "ცხოველები • ნივთები • მოგზაურობა"
                  : "Pets • Belongings • Travel"}
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          VIDEO PLACEHOLDER
      ========================================================= */}

      <section id="video" className="videoSection">
        <div className="shell">
          <div className="videoLayout">
            <div className="videoCopy">
              <span className="eyebrow">QR RETURN IN ACTION</span>

              <h2>
                {ka
                  ? "ერთი სკანი. ერთი კავშირი. დაბრუნების რეალური შანსი."
                  : "One scan. One connection. A clearer path back."}
              </h2>

              <p>
                {ka
                  ? "აქ განთავსდება QR RETURN-ის მოკლე ვიდეო — როგორ ხედავს მპოვნელი QR-ს, როგორ ასკანერებს და როგორ უკავშირდება მფლობელს."
                  : "A short QR RETURN product video will appear here — from finding the QR to scanning and contacting the owner."}
              </p>
            </div>

            <div className="videoPlaceholder">
              <div className="videoTop">
                <div>
                  <QrIcon />
                </div>

                <span>QR RETURN PRODUCT DEMO</span>
              </div>

              <button type="button" className="playButton">
                <PlayIcon />
              </button>

              <span className="videoSoon">
                {ka ? "ვიდეო დაემატება" : "Video coming soon"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOUR STEPS
      ========================================================= */}

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
                  : "The finder notices the QR RETURN code."
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
                  : "Live Chat, call or another option you choose."
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

      {/* =========================================================
          BENEFITS
      ========================================================= */}

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

      {/* =========================================================
          SIMPLE RULES
      ========================================================= */}

      <section className="rulesSection">
        <div className="shell">
          <div className="rulesIntro">
            <span className="eyebrow">DESIGNED TO STAY SIMPLE</span>

            <h2>
              {ka
                ? "QR RETURN-ის გამოყენება ზედმეტ წესებს არ საჭიროებს."
                : "QR RETURN is designed without unnecessary friction."}
            </h2>
          </div>

          <div className="rulesGrid">
            <Rule
              number="01"
              title={ka ? "აპის გარეშე" : "No App Required"}
              text={
                ka
                  ? "მპოვნელს აპის ჩამოტვირთვა ან ანგარიშის შექმნა არ სჭირდება."
                  : "The finder does not need to download an app or create an account."
              }
            />

            <Rule
              number="02"
              title={ka ? "თქვენი კონტროლი" : "Your Control"}
              text={
                ka
                  ? "თქვენ ირჩევთ რომელი მონაცემები და საკონტაქტო მეთოდები იქნება ხელმისაწვდომი."
                  : "You decide which information and contact methods are available."
              }
            />

            <Rule
              number="03"
              title={ka ? "ერთი ანგარიში" : "One Account"}
              text={
                ka
                  ? "ყველა QR პროფილი — ცხოველი, ნივთი და Emergency ID — ერთ სივრცეში."
                  : "Pets, belongings and Emergency ID profiles live in one account."
              }
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          ACCOUNT CTA
      ========================================================= */}

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
                  ? "მართეთ ცხოველები, ნივთები, Live Chat, დაკარგვის რეჟიმი და Emergency ID ერთი ანგარიშიდან."
                  : "Manage pets, belongings, Live Chat, lost mode and Emergency ID from one account."}
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

      {/* =========================================================
          CONTACT
      ========================================================= */}

      <section className="contact">
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

      {/* =========================================================
          FOOTER
      ========================================================= */}

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
            <a href="#video">{ka ? "როგორ მუშაობს" : "How it works"}</a>
            <span>Emergency ID</span>
            <span>{ka ? "კონფიდენციალურობა" : "Privacy"}</span>
            <span>{ka ? "პირობები" : "Terms"}</span>
          </div>

          <span className="copyright">© 2026 QR RETURN</span>
        </div>
      </footer>

      {/* =========================================================
          STYLES
      ========================================================= */}

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          background: #f7f7f4;
        }

        .page {
          overflow: hidden;
          color: #19222d;
          background: #f7f7f4;
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
          color: #d84d54;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        /* ================= HEADER ================= */

        .header {
          width: calc(100% - 52px);
          max-width: 1280px;
          min-height: 80px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          position: relative;
          z-index: 50;
          border-bottom: 1px solid rgba(20, 27, 36, 0.08);
        }

        .brand,
        .headerRight,
        .nav,
        .languages {
          display: flex;
          align-items: center;
        }

        .brand {
          gap: 10px;
          text-decoration: none;
        }

        .brandLogo {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          color: white;
          background: #1c2733;
        }

        .brandLogo :global(svg) {
          width: 21px;
        }

        .brandText strong,
        .brandText span {
          display: block;
        }

        .brandText strong {
          color: #1c2733;
          font-size: 17px;
          font-weight: 850;
          letter-spacing: -0.4px;
        }

        .brandText span {
          margin-top: 3px;
          color: #969da6;
          font-size: 5.5px;
          font-weight: 900;
          letter-spacing: 1.8px;
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
          white-space: nowrap;
        }

        .adminButton {
          color: #a33a40;
          border: 1px solid #edd7d9;
          background: #fff7f7;
        }

        .adminButton :global(svg),
        .accountButton :global(svg) {
          width: 13px;
        }

        .accountButton {
          color: white;
          background: #1c2733;
        }

        .loginButton {
          color: #505a67;
          border: 1px solid #dce0e4;
        }

        .languages {
          gap: 7px;
        }

        .languages span {
          width: 1px;
          height: 12px;
          background: #d4d8dc;
        }

        .languages button {
          padding: 0;
          border: 0;
          color: #9ca2aa;
          background: transparent;
          font-size: 8px;
          font-weight: 900;
          cursor: pointer;
        }

        .languages button.active {
          color: #d84d54;
        }

        /* ================= HERO ================= */

        .hero {
          min-height: 720px;
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(
              120deg,
              #faf9f6 0%,
              #f3f4f2 48%,
              #eceff1 100%
            );
        }

        .heroInner {
          width: calc(100% - 52px);
          max-width: 1280px;
          min-height: 720px;
          margin: auto;
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          align-items: center;
          gap: 75px;
        }

        .heroLight {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .heroLightOne {
          width: 620px;
          height: 620px;
          right: -220px;
          top: -230px;
          background: radial-gradient(
            circle,
            rgba(70, 89, 117, 0.13),
            transparent 69%
          );
        }

        .heroLightTwo {
          width: 360px;
          height: 360px;
          left: -190px;
          bottom: -190px;
          background: radial-gradient(
            circle,
            rgba(216, 77, 84, 0.075),
            transparent 70%
          );
        }

        /* LEFT EMERGENCY */

        .emergencySide {
          max-width: 560px;
        }

        .emergencyKicker {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #b33d43;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.6px;
        }

        .miniMedical {
          width: 24px;
          height: 24px;
          display: grid;
          place-items: center;
          border-radius: 7px;
          color: white;
          background: #d84d54;
          font-size: 16px;
          letter-spacing: 0;
        }

        .emergencySide h1 {
          max-width: 540px;
          margin: 20px 0 0;
          color: #19222d;
          font-size: clamp(34px, 3.75vw, 46px);
          line-height: 1.07;
          letter-spacing: -2.4px;
          font-weight: 690;
        }

        .emergencyDescription {
          max-width: 510px;
          margin: 17px 0 0;
          color: #6c7580;
          font-size: 11.5px;
          line-height: 1.72;
        }

        .emergencyPresentation {
          margin-top: 26px;
          display: grid;
          grid-template-columns: 0.93fr 1.07fr;
          align-items: center;
          gap: 15px;
        }

        /* BRACELET */

        .braceletScene {
          min-height: 220px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .braceletShadow {
          width: 210px;
          height: 35px;
          position: absolute;
          bottom: 35px;
          border-radius: 50%;
          background: rgba(33, 42, 55, 0.11);
          filter: blur(12px);
        }

        .bracelet {
          width: 295px;
          display: flex;
          align-items: center;
          position: relative;
          z-index: 2;
          transform: rotate(-5deg);
        }

        .strap {
          height: 48px;
          flex: 1;
          background:
            linear-gradient(
              180deg,
              #d6dbe1,
              #c3cad2
            );
        }

        .strap.left {
          border-radius: 24px 0 0 24px;
        }

        .strap.right {
          border-radius: 0 24px 24px 0;
        }

        .braceletFace {
          width: 130px;
          height: 108px;
          flex: 0 0 130px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 4px solid #b6bec7;
          border-radius: 24px;
          background: #ffffff;
          box-shadow:
            0 15px 28px
            rgba(37, 47, 61, 0.16);
        }

        .braceletHeader {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 5px;
          color: #47515e;
          font-size: 5px;
          font-weight: 900;
          letter-spacing: 0.7px;
        }

        .braceletMedical {
          width: 14px;
          height: 14px;
          display: grid;
          place-items: center;
          border-radius: 4px;
          color: white;
          background: #d84d54;
          font-size: 10px;
        }

        .braceletQr {
          margin-top: 7px;
        }

        .braceletFace small {
          margin-top: 5px;
          color: #af3f45;
          font-size: 4.5px;
          font-weight: 900;
          letter-spacing: 0.7px;
        }

        .braceletCaption {
          margin-top: 11px;
          color: #8c949e;
          font-size: 7px;
          font-weight: 750;
        }

        /* EMERGENCY PROFILE */

        .emergencyProfile {
          padding: 13px;
          border: 1px solid #e0e3e6;
          border-radius: 17px;
          background: rgba(255, 255, 255, 0.88);
          box-shadow:
            0 14px 34px
            rgba(34, 43, 56, 0.06);
          backdrop-filter: blur(15px);
        }

        .profileTop {
          padding-bottom: 9px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
        }

        .profileTop span,
        .profileTop strong {
          display: block;
        }

        .profileTop > div span {
          color: #d84d54;
          font-size: 4.5px;
          font-weight: 900;
          letter-spacing: 0.8px;
        }

        .profileTop > div strong {
          margin-top: 3px;
          color: #37424f;
          font-size: 7px;
        }

        .sosPill {
          padding: 5px 6px;
          border-radius: 999px;
          color: white !important;
          background: #d84d54;
          font-size: 4px !important;
          font-weight: 900;
          letter-spacing: 0.5px;
        }

        .profilePrivacy {
          min-height: 34px;
          margin-top: 5px;
          padding: 7px;
          display: flex;
          align-items: center;
          gap: 7px;
          border-radius: 9px;
          color: #68727f;
          background: #f2f4f6;
          font-size: 5.5px;
          line-height: 1.4;
        }

        .profilePrivacy :global(svg) {
          width: 13px;
          flex: 0 0 13px;
          color: #d84d54;
        }

        .emergencySignals {
          margin-top: 18px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .emergencySignals span {
          padding: 6px 8px;
          border: 1px solid #ecd7d9;
          border-radius: 999px;
          color: #a93c42;
          background: rgba(255, 250, 250, 0.7);
          font-size: 5px;
          font-weight: 900;
          letter-spacing: 0.5px;
        }

        .heroActions {
          margin-top: 23px;
          display: flex;
          gap: 9px;
        }

        .primaryButton,
        .secondaryButton {
          min-height: 43px;
          padding: 0 15px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 8.5px;
          font-weight: 850;
        }

        .primaryButton {
          color: white;
          background: #1c2733;
        }

        .primaryButton :global(svg) {
          width: 12px;
        }

        .secondaryButton {
          color: #515b68;
          border: 1px solid #d8dde1;
          background: rgba(255, 255, 255, 0.55);
        }

        /* ================= ECOSYSTEM RIGHT ================= */

        .ecosystem {
          width: 590px;
          height: 590px;
          margin: auto;
          position: relative;
        }

        .ecosystemGlow {
          width: 430px;
          height: 430px;
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(85, 104, 130, 0.14),
            rgba(85, 104, 130, 0.025) 50%,
            transparent 70%
          );
          transform: translate(-50%, -50%);
        }

        .orbitLine {
          position: absolute;
          top: 50%;
          left: 50%;
          border: 1px solid rgba(88, 103, 124, 0.12);
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }

        .orbitLineOne {
          width: 500px;
          height: 500px;
        }

        .orbitLineTwo {
          width: 390px;
          height: 390px;
          border-style: dashed;
          border-color: rgba(88, 103, 124, 0.09);
        }

        /* CENTER PHONE */

        .centerPhone {
          width: 190px;
          height: 365px;
          padding: 7px;
          position: absolute;
          z-index: 5;
          top: 50%;
          left: 50%;
          border-radius: 29px;
          background:
            linear-gradient(
              145deg,
              #131b25,
              #05090d
            );
          box-shadow:
            0 32px 70px
            rgba(24, 33, 45, 0.23);
          transform:
            translate(-50%, -50%)
            rotate(-2deg);
        }

        .centerPhoneNotch {
          width: 50px;
          height: 10px;
          position: absolute;
          top: 10px;
          left: 50%;
          z-index: 3;
          border-radius: 99px;
          background: #080c11;
          transform: translateX(-50%);
        }

        .centerPhoneScreen {
          height: 100%;
          padding: 28px 13px 13px;
          border-radius: 23px;
          background:
            linear-gradient(
              180deg,
              #ffffff,
              #f5f7f9
            );
        }

        .phoneBrandSmall {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .phoneBrandSmall > div {
          width: 27px;
          height: 27px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          color: white;
          background: #1c2733;
        }

        .phoneBrandSmall > div :global(svg) {
          width: 14px;
        }

        .phoneBrandSmall section span,
        .phoneBrandSmall section strong {
          display: block;
        }

        .phoneBrandSmall section span {
          color: #d84d54;
          font-size: 5px;
          font-weight: 900;
          letter-spacing: 0.8px;
        }

        .phoneBrandSmall section strong {
          margin-top: 2px;
          color: #4b5663;
          font-size: 6px;
        }

        .phoneQr {
          width: 128px;
          height: 128px;
          margin: 28px auto 0;
          display: grid;
          place-items: center;
          border-radius: 17px;
          background: #ffffff;
          box-shadow:
            0 12px 30px
            rgba(30, 39, 51, 0.07);
          transform: scale(0.78);
        }

        .phoneMainText {
          margin-top: 10px;
          text-align: center;
        }

        .phoneMainText > span {
          color: #9da4ad;
          font-size: 5px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .phoneMainText strong {
          display: block;
          margin-top: 5px;
          color: #242e39;
          font-size: 11px;
          line-height: 1.35;
        }

        .phoneMainText p {
          margin: 5px 0 0;
          color: #858e99;
          font-size: 6.5px;
        }

        .phoneActions {
          margin-top: 17px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .phoneAction {
          min-height: 47px;
          padding: 7px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          border: 1px solid #e0e4e8;
          border-radius: 10px;
          color: #596573;
          background: white;
          font-size: 6px;
          font-weight: 800;
        }

        .phoneAction.main {
          color: white;
          background: #1c2733;
          border-color: #1c2733;
        }

        .phoneAction :global(svg) {
          width: 13px;
        }

        /* CENTER QR TAG */

        .heroQrTag {
          width: 105px;
          height: 128px;
          position: absolute;
          z-index: 8;
          left: 50%;
          bottom: 67px;
          transform:
            translateX(-50%)
            rotate(5deg);
        }

        .tagRing {
          width: 22px;
          height: 22px;
          position: absolute;
          top: -12px;
          left: 50%;
          z-index: -1;
          border: 5px solid #aab2bc;
          border-radius: 50%;
          transform: translateX(-50%);
        }

        .heroTagBody {
          width: 100%;
          height: 100%;
          padding: 11px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 2px solid #c5cbd2;
          border-radius: 18px;
          background: white;
          box-shadow:
            0 17px 32px
            rgba(25, 34, 46, 0.19);
        }

        .heroTagBrand {
          margin-bottom: 8px;
          color: #d84d54;
          font-size: 5px;
          font-weight: 900;
          letter-spacing: 0.7px;
        }

        .heroTagBody small {
          margin-top: 7px;
          color: #515c68;
          font-size: 4.5px;
          font-weight: 900;
          letter-spacing: 0.6px;
        }

        /* ORBIT ITEMS */

        .orbitItem {
          width: 112px;
          position: absolute;
          z-index: 4;
          text-align: center;
        }

        .orbitPhoto {
          width: 112px;
          height: 92px;
          position: relative;
          overflow: hidden;
          border: 4px solid rgba(255, 255, 255, 0.92);
          border-radius: 18px;
          background: #dfe3e7;
          box-shadow:
            0 13px 28px
            rgba(31, 41, 55, 0.12);
        }

        .orbitPhoto > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .orbitShade {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            transparent 50%,
            rgba(8, 12, 18, 0.18)
          );
        }

        .orbitLabel {
          display: inline-block;
          margin-top: 7px;
          padding: 5px 7px;
          border: 1px solid rgba(217, 221, 226, 0.9);
          border-radius: 999px;
          color: #4f5a68;
          background: rgba(255, 255, 255, 0.88);
          box-shadow:
            0 6px 16px
            rgba(30, 40, 53, 0.05);
          font-size: 6px;
          font-weight: 800;
          white-space: nowrap;
        }

        .orbitQrTag {
          width: 29px;
          height: 35px;
          padding: 3px;
          position: absolute;
          display: grid;
          place-items: center;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.96);
          box-shadow:
            0 5px 12px
            rgba(0, 0, 0, 0.16);
          transform: scale(0.62);
        }

        .orbitQrTag.pet {
          left: 50%;
          bottom: 0;
          transform:
            translateX(-50%)
            scale(0.62)
            rotate(4deg);
        }

        .orbitQrTag.item {
          right: 7px;
          bottom: 7px;
        }

        .orbitQrTag.keys {
          right: 8px;
          bottom: 7px;
        }

        .orbitQrTag.luggage {
          left: 50%;
          top: 12px;
          transform:
            translateX(-50%)
            scale(0.62);
        }

        .tagLoop {
          width: 6px;
          height: 6px;
          position: absolute;
          top: -5px;
          border: 1px solid #969fa9;
          border-radius: 50%;
        }

        .airportMarker {
          position: absolute;
          left: 7px;
          bottom: 6px;
          padding: 4px 5px;
          border-radius: 999px;
          color: #44505e;
          background: rgba(255, 255, 255, 0.89);
          font-size: 4px;
          font-weight: 900;
          letter-spacing: 0.7px;
        }

        .orbitDog {
          top: 36px;
          left: 90px;
          transform: rotate(-3deg);
        }

        .orbitCat {
          top: 35px;
          right: 86px;
          transform: rotate(3deg);
        }

        .orbitKeys {
          top: 225px;
          left: 5px;
          transform: rotate(-4deg);
        }

        .orbitWallet {
          top: 225px;
          right: 0;
          transform: rotate(4deg);
        }

        .orbitLuggage {
          bottom: 36px;
          left: 92px;
          transform: rotate(3deg);
        }

        .orbitBag {
          right: 87px;
          bottom: 37px;
          transform: rotate(-3deg);
        }

        .ecosystemCaption {
          position: absolute;
          left: 50%;
          bottom: 5px;
          text-align: center;
          transform: translateX(-50%);
        }

        .ecosystemCaption span,
        .ecosystemCaption strong {
          display: block;
        }

        .ecosystemCaption span {
          color: #d84d54;
          font-size: 5px;
          font-weight: 900;
          letter-spacing: 1.1px;
        }

        .ecosystemCaption strong {
          margin-top: 3px;
          color: #65707d;
          font-size: 6px;
        }

        /* ================= VIDEO ================= */

        .videoSection {
          padding: 92px 0;
          background: #fbfbf9;
        }

        .videoLayout {
          display: grid;
          grid-template-columns: 0.75fr 1.25fr;
          align-items: center;
          gap: 70px;
        }

        .videoCopy h2 {
          margin: 11px 0 0;
          color: #19222d;
          font-size: clamp(31px, 3.5vw, 41px);
          line-height: 1.07;
          letter-spacing: -2px;
          font-weight: 670;
        }

        .videoCopy p {
          margin: 15px 0 0;
          color: #727b86;
          font-size: 10.5px;
          line-height: 1.7;
        }

        .videoPlaceholder {
          min-height: 350px;
          position: relative;
          display: grid;
          place-items: center;
          overflow: hidden;
          border: 1px solid #dfe3e7;
          border-radius: 25px;
          background:
            radial-gradient(
              circle at 70% 20%,
              rgba(216, 77, 84, 0.08),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #e9edf0,
              #f8f8f7
            );
        }

        .videoTop {
          position: absolute;
          top: 20px;
          left: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #626d79;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .videoTop > div {
          width: 29px;
          height: 29px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          color: white;
          background: #1c2733;
        }

        .videoTop > div :global(svg) {
          width: 15px;
        }

        .playButton {
          width: 66px;
          height: 66px;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 50%;
          color: white;
          background: #1c2733;
          box-shadow:
            0 14px 30px
            rgba(28, 39, 51, 0.17);
          cursor: pointer;
        }

        .playButton :global(svg) {
          width: 23px;
        }

        .videoSoon {
          position: absolute;
          bottom: 20px;
          color: #8c949e;
          font-size: 7px;
          font-weight: 750;
        }

        /* ================= FLOW ================= */

        .flowSection {
          padding: 90px 0;
          background: #f0f1ef;
        }

        .flowHeading {
          max-width: 650px;
        }

        .flowHeading h2 {
          margin: 10px 0 0;
          color: #19222d;
          font-size: clamp(31px, 3.8vw, 43px);
          line-height: 1.07;
          letter-spacing: -2.1px;
          font-weight: 670;
        }

        .flow {
          margin-top: 44px;
          display: grid;
          grid-template-columns:
            1fr auto 1fr auto 1fr auto 1fr;
          align-items: start;
        }

        .flowLine {
          width: 55px;
          height: 1px;
          margin: 35px 17px 0;
          background: #d7dbe0;
        }

        /* ================= BENEFITS ================= */

        .benefitsSection {
          padding: 90px 0;
          color: white;
          background: #1b2531;
        }

        .benefitsHeading > span {
          color: #e18b90;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1.7px;
        }

        .benefitsHeading h2 {
          max-width: 730px;
          margin: 10px 0 0;
          color: white;
          font-size: clamp(31px, 3.8vw, 43px);
          line-height: 1.06;
          letter-spacing: -2.1px;
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
          color: #e18b90;
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
          color: #939ca8;
          font-size: 8.5px;
          line-height: 1.65;
        }

        /* ================= RULES ================= */

        .rulesSection {
          padding: 88px 0;
          background: #fafaf8;
        }

        .rulesIntro {
          max-width: 690px;
        }

        .rulesIntro h2 {
          margin: 10px 0 0;
          color: #19222d;
          font-size: clamp(30px, 3.6vw, 41px);
          line-height: 1.08;
          letter-spacing: -2px;
          font-weight: 670;
        }

        .rulesGrid {
          margin-top: 38px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid #dfe2e5;
          border-bottom: 1px solid #dfe2e5;
        }

        /* ================= ACCOUNT ================= */

        .accountSection {
          padding: 68px 0;
          background: #f2f2f0;
        }

        .accountPanel {
          padding: 27px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 20px;
          border: 1px solid #dfe3e6;
          border-radius: 20px;
          background: white;
        }

        .accountIcon {
          width: 56px;
          height: 56px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          color: #1c2733;
          background: #eef0f2;
        }

        .accountIcon :global(svg) {
          width: 23px;
        }

        .accountText > span {
          color: #d84d54;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1.3px;
        }

        .accountText h2 {
          margin: 8px 0 0;
          color: #19222d;
          font-size: clamp(26px, 3vw, 35px);
          letter-spacing: -1.8px;
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
          background: #1c2733;
          font-size: 8.5px;
          font-weight: 850;
          text-decoration: none;
        }

        .accountPanel > a :global(svg) {
          width: 12px;
        }

        /* ================= CONTACT ================= */

        .contact {
          padding: 68px 0;
          background: #eaeae8;
        }

        .contactInner {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 50px;
        }

        .contactInner h2 {
          margin: 9px 0 8px;
          color: #19222d;
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
          background: #1c2733;
          font-size: 8.5px;
          font-weight: 850;
          text-decoration: none;
        }

        .contactInner > a :global(svg) {
          width: 12px;
        }

        /* ================= FOOTER ================= */

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
          background: #d84d54;
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

        /* ================= TABLET ================= */

        @media (max-width: 1080px) {
          .heroInner {
            grid-template-columns: 1fr;
            padding: 60px 0 90px;
          }

          .emergencySide {
            max-width: 700px;
          }

          .ecosystem {
            margin-top: 20px;
          }

          .videoLayout {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }

        @media (max-width: 900px) {
          .flow {
            grid-template-columns: repeat(2, 1fr);
            gap: 28px;
          }

          .flowLine {
            display: none;
          }

          .benefitsGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .rulesGrid {
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
            flex-direction: column;
            align-items: flex-start;
          }
        }

        /* ================= MOBILE ================= */

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
            letter-spacing: -1.9px;
          }

          .emergencyPresentation {
            grid-template-columns: 1fr;
          }

          .braceletScene {
            min-height: 190px;
          }

          .bracelet {
            width: 275px;
          }

          .heroActions {
            flex-direction: column;
          }

          .primaryButton,
          .secondaryButton {
            width: 100%;
          }

          /* ecosystem mobile */

          .ecosystem {
            width: 350px;
            height: 610px;
          }

          .orbitLineOne {
            width: 335px;
            height: 335px;
          }

          .orbitLineTwo {
            width: 270px;
            height: 270px;
          }

          .centerPhone {
            width: 165px;
            height: 325px;
            top: 50%;
          }

          .phoneQr {
            margin-top: 20px;
            transform: scale(0.66);
          }

          .heroQrTag {
            bottom: 85px;
            transform:
              translateX(-50%)
              rotate(5deg)
              scale(0.85);
          }

          .orbitItem {
            width: 92px;
          }

          .orbitPhoto {
            width: 92px;
            height: 76px;
          }

          .orbitDog {
            top: 42px;
            left: 14px;
          }

          .orbitCat {
            top: 42px;
            right: 14px;
          }

          .orbitKeys {
            top: 248px;
            left: -5px;
          }

          .orbitWallet {
            top: 248px;
            right: -5px;
          }

          .orbitLuggage {
            left: 20px;
            bottom: 55px;
          }

          .orbitBag {
            right: 20px;
            bottom: 55px;
          }

          .ecosystemCaption {
            bottom: 10px;
          }

          .videoSection,
          .flowSection,
          .benefitsSection,
          .rulesSection {
            padding: 70px 0;
          }

          .videoCopy h2,
          .flowHeading h2,
          .benefitsHeading h2,
          .rulesIntro h2 {
            font-size: 31px;
            letter-spacing: -1.8px;
          }

          .videoPlaceholder {
            min-height: 280px;
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

          .contact {
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

/* =============================================================
   SMALL COMPONENTS
============================================================= */

function EmergencyRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="emergencyRow">
      <div className="rowIcon">{icon}</div>

      <section>
        <span>{label}</span>
        <strong>{value}</strong>
      </section>

      <CheckIcon />

      <style jsx>{`
        .emergencyRow {
          min-height: 38px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 7px;
          border-top: 1px solid #e8ebee;
        }

        .rowIcon {
          width: 24px;
          height: 24px;
          display: grid;
          place-items: center;
          border-radius: 7px;
          color: #d84d54;
          background: #fff0f0;
        }

        .rowIcon :global(svg) {
          width: 12px;
        }

        section span,
        section strong {
          display: block;
        }

        section span {
          color: #979ea7;
          font-size: 4.5px;
          font-weight: 850;
          letter-spacing: 0.2px;
        }

        section strong {
          margin-top: 2px;
          color: #48535f;
          font-size: 5.5px;
        }

        .emergencyRow > :global(svg) {
          width: 11px;
          color: #27a36a;
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
          color: #1c2733;
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
          color: #d84d54;
          font-size: 7px;
          font-weight: 900;
        }

        .rule strong {
          display: block;
          margin-top: 27px;
          color: #293440;
          font-size: 12px;
        }

        .rule p {
          margin: 8px 0 0;
          color: #767f8a;
          font-size: 9px;
          line-height: 1.65;
        }

        @media (max-width: 900px) {
          .rule {
            border-right: 0;
            border-bottom: 1px solid #e0e3e6;
          }

          .rule:last-child {
            border-bottom: 0;
          }
        }
      `}</style>
    </article>
  );
}

function KeysScene() {
  return (
    <div className="keysScene">
      <div className="surface" />

      <div className="houseKey">
        <div className="keyHead" />
        <div className="keyStem" />
        <div className="keyTeeth" />
      </div>

      <div className="carKey">
        <div className="carKeyRing" />
        <div className="carFob">
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
          background:
            linear-gradient(
              135deg,
              #e7dfd4,
              #f4efe8
            );
        }

        .surface {
          position: absolute;
          inset: 55% -10px -10px;
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(-7deg);
        }

        .houseKey {
          position: absolute;
          left: 25px;
          top: 24px;
          transform: rotate(-22deg);
        }

        .keyHead {
          width: 32px;
          height: 32px;
          border: 7px solid #c2a66f;
          border-radius: 50%;
        }

        .keyStem {
          width: 55px;
          height: 8px;
          position: absolute;
          left: 27px;
          top: 12px;
          border-radius: 3px;
          background: #c2a66f;
        }

        .keyTeeth {
          width: 18px;
          height: 15px;
          position: absolute;
          left: 68px;
          top: 14px;
          border-right: 6px solid #c2a66f;
          border-bottom: 6px solid #c2a66f;
        }

        .carKey {
          position: absolute;
          right: 18px;
          bottom: 15px;
          transform: rotate(13deg);
        }

        .carKeyRing {
          width: 22px;
          height: 22px;
          position: absolute;
          top: -9px;
          left: 7px;
          border: 4px solid #9da5ae;
          border-radius: 50%;
        }

        .carFob {
          width: 42px;
          height: 57px;
          padding: 13px 10px;
          position: relative;
          z-index: 2;
          display: grid;
          gap: 6px;
          border-radius: 12px;
          background:
            linear-gradient(
              145deg,
              #555e68,
              #252b33
            );
          box-shadow:
            0 8px 15px
            rgba(30, 35, 42, 0.18);
        }

        .carFob span {
          height: 7px;
          border-radius: 99px;
          background: #858e98;
        }
      `}</style>
    </div>
  );
}

/* =============================================================
   ICONS
============================================================= */

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

function DropletIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M12 2.5S6 9 6 14a6 6 0 0 0 12 0c0-5-6-11.5-6-11.5Z" />
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

function QrCode({ compact = false }: { compact?: boolean }) {
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
        width: compact ? 54 : 112,
        height: compact ? 54 : 112,
        display: "grid",
        gridTemplateColumns: "repeat(7,1fr)",
        gap: compact ? 2 : 3,
      }}
    >
      {Array.from({ length: 49 }).map((_, i) => (
        <span
          key={i}
          style={{
            display: "block",
            borderRadius: 1,
            background: dark.includes(i)
              ? "#1c2733"
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
              ? "#1c2733"
              : "#dfe3e7",
          }}
        />
      ))}
    </div>
  );
}
