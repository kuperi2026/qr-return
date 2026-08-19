"use client";

import { useEffect, useState } from "react";
import SupportLauncher from "./components/SupportLauncher";
import { supabase } from "@/lib/supabase";

type Language = "ka" | "en";

type ProductStory = {
  id: string;
  ka: string;
  en: string;
  kaText: string;
  enText: string;
  kaResult: string;
  enResult: string;
  image: string;
};

const products: ProductStory[] = [
  {
    id: "dog",
    ka: "ძაღლი",
    en: "Dog",
    kaText: "მპოვნელი ასკანერებს საყელოზე მიმაგრებულ QR RETURN კოდს.",
    enText: "The finder scans the QR RETURN tag attached to the collar.",
    kaResult: "დაუკავშირდი პატრონს",
    enResult: "Contact owner",
    image:
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=900&q=88",
  },
  {
    id: "cat",
    ka: "კატა",
    en: "Cat",
    kaText: "QR პროფილი აჩვენებს მხოლოდ იმ ინფორმაციას, რომლის გაზიარებაც გსურთ.",
    enText: "The QR profile shows only the information you choose to share.",
    kaResult: "Finder Profile",
    enResult: "Finder Profile",
    image:
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=900&q=88",
  },
  {
    id: "keys",
    ka: "გასაღები",
    en: "Keys",
    kaText: "QR tag ეხმარება მპოვნელს სწრაფად დაგიკავშირდეთ.",
    enText: "The QR tag gives the finder a simple way to reach you.",
    kaResult: "Live Chat",
    enResult: "Live Chat",
    image:
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=900&q=88",
  },
  {
    id: "wallet",
    ka: "საფულე",
    en: "Wallet",
    kaText: "საფულეზე QR კოდი ქმნის უსაფრთხო კავშირს მფლობელთან.",
    enText: "A QR code on the wallet creates a secure path back to the owner.",
    kaResult: "უსაფრთხო დაბრუნება",
    enResult: "Return securely",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=88",
  },
  {
    id: "luggage",
    ka: "ჩემოდანი",
    en: "Luggage",
    kaText: "აეროპორტში ნაპოვნი ჩემოდნის მპოვნელმა შეიძლება ლოკაციაც გაგიზიაროთ.",
    enText: "A finder at the airport can scan your luggage QR and share its location.",
    kaResult: "Location shared",
    enResult: "Location shared",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=88",
  },
  {
    id: "bag",
    ka: "ჩანთა",
    en: "Bag",
    kaText: "ნაპოვნი ჩანთიდან ერთი სკანი საკმარისია კავშირის დასაწყებად.",
    enText: "One scan from a found bag is enough to start the return process.",
    kaResult: "Owner notified",
    enResult: "Owner notified",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=88",
  },
];

const benefits = [
  {
    number: "01",
    type: "chat",
    ka: "Live Chat",
    en: "Live Chat",
    kaText: "მპოვნელთან პირდაპირი კავშირი პირადი ნომრის გამოჩენის გარეშე.",
    enText: "Talk directly with the finder without exposing your private number.",
  },
  {
    number: "02",
    type: "location",
    ka: "ლოკაციის გაზიარება",
    en: "Location Sharing",
    kaText: "მპოვნელმა ერთი ღილაკით შეიძლება გაგიზიაროთ ნივთის მდებარეობა.",
    enText: "The finder can share the current location in one tap.",
  },
  {
    number: "03",
    type: "reward",
    ka: "მპოვნელის ჯილდო",
    en: "Finder Reward",
    kaText: "სურვილის შემთხვევაში მიუთითეთ ჯილდო უსაფრთხო დაბრუნებისთვის.",
    enText: "Optionally offer a reward for a safe return.",
  },
  {
    number: "04",
    type: "shield",
    ka: "Privacy Control",
    en: "Privacy Control",
    kaText: "თქვენ აკონტროლებთ რა ინფორმაცია გამოჩნდება მპოვნელისთვის.",
    enText: "You control exactly what information the finder can see.",
  },
];

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("ka");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const ka = language === "ka";

  useEffect(() => {
    async function loadSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoggedIn(false);
        setIsAdmin(false);
        return;
      }

      setIsLoggedIn(true);

      /*
        ADMIN BUTTON IS PRIVATE:
        only users stored inside admin_users will see it.
        Ordinary visitors never see the Admin link.
      */
      const { data: adminData } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      setIsAdmin(Boolean(adminData));
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
        <div className="heroGlow glowOne" />
        <div className="heroGlow glowTwo" />

        <div className="heroInner">
          <div className="heroCopy">
            <div className="heroLabel">
              SMART LOST &amp; FOUND
            </div>

            <h1>
              {ka ? (
                <>
                  იპოვეს.
                  <br />
                  დაასკანერეს.
                  <br />
                  <span>დაგიკავშირდნენ.</span>
                </>
              ) : (
                <>
                  Found.
                  <br />
                  Scanned.
                  <br />
                  <span>Connected.</span>
                </>
              )}
            </h1>

            <p className="heroDescription">
              {ka
                ? "QR RETURN ქმნის მარტივ და უსაფრთხო კავშირს მპოვნელსა და მფლობელს შორის — აპის ჩამოტვირთვის გარეშე."
                : "QR RETURN creates a simple and secure connection between finder and owner — no app required."}
            </p>

            <div className="heroActions">
              <a
                href={isLoggedIn ? "/account" : "/account/register"}
                className="primaryCta"
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

              <a href="#real-life" className="secondaryCta">
                {ka ? "ნახე როგორ მუშაობს" : "See how it works"}
              </a>
            </div>

            {/* EMERGENCY SIGNAL */}

            <a href="#emergency" className="emergencySignal">
              <div className="signalCross">+</div>

              <div>
                <span>QR RETURN • EMERGENCY ID</span>

                <strong>
                  {ka
                    ? "როცა სიტყვების თქმა შეუძლებელია, ინფორმაცია მაინც ხელმისაწვდომია."
                    : "When you cannot speak, essential information can still speak for you."}
                </strong>

                <small>
                  SOS READY · EMERGENCY CONTACT · MEDICAL INFO
                </small>
              </div>

              <ArrowIcon />
            </a>
          </div>

          {/* PHONE — QR, NOT DOG */}

          <div className="phoneStage">
            <div className="phoneHalo" />

            <div className="phone">
              <div className="phoneNotch" />

              <div className="phoneScreen">
                <div className="phoneHeader">
                  <div className="miniLogo">
                    <QrIcon />
                  </div>

                  <div>
                    <span>QR RETURN</span>
                    <strong>SCAN TO CONNECT</strong>
                  </div>

                  <div className="activePill">
                    <i />
                    ACTIVE
                  </div>
                </div>

                <div className="mainQrArea">
                  <div className="scanCorner topLeft" />
                  <div className="scanCorner topRight" />
                  <div className="scanCorner bottomLeft" />
                  <div className="scanCorner bottomRight" />

                  <QrCode />
                </div>

                <div className="phoneMessage">
                  <span>ONE SCAN</span>

                  <strong>
                    {ka
                      ? "დაუკავშირდი მფლობელს"
                      : "Connect with the owner"}
                  </strong>

                  <p>
                    {ka
                      ? "Live Chat • Location • Contact options"
                      : "Live Chat • Location • Contact options"}
                  </p>
                </div>

                <div className="phoneBottom">
                  <div>
                    <ShieldIcon />
                    <span>
                      {ka ? "დაცული ინფორმაცია" : "Protected"}
                    </span>
                  </div>

                  <div>
                    <ScanIcon />
                    <span>
                      {ka ? "აპის გარეშე" : "No App"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="floatingChat">
              <div className="floatingIcon">
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

            <div className="floatingLocation">
              <LocationIcon />

              <div>
                <span>LOCATION</span>
                <strong>{ka ? "გაზიარებულია" : "Shared"}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          6 REAL-LIFE SCENARIOS — ONE ROW
      ====================================================== */}

      <section id="real-life" className="realLifeSection">
        <div className="shell">
          <div className="sectionHeading">
            <div>
              <span className="eyebrow">QR RETURN IN REAL LIFE</span>

              <h2>
                {ka
                  ? "ნაპოვნიდან დაბრუნებამდე."
                  : "From found to returned."}
              </h2>
            </div>

            <p>
              {ka
                ? "QR RETURN-ის თითოეული გამოყენება იწყება ერთი მარტივი მოქმედებით — მპოვნელი ხედავს QR-ს და ასკანერებს."
                : "Every QR RETURN story begins with one simple action — the finder sees the QR and scans it."}
            </p>
          </div>

          <div className="productRow">
            {products.map((product) => (
              <article className="scenarioCard" key={product.id}>
                <div className="scenarioPhoto">
                  <img
                    src={product.image}
                    alt={ka ? product.ka : product.en}
                  />

                  <div className="photoShade" />

                  {/* QR attached to item */}

                  <div className="attachedQr">
                    <MiniQr />
                  </div>

                  {/* phone-scanning visual */}

                  <div className="scannerPhone">
                    <div className="scannerNotch" />

                    <div className="scannerWindow">
                      <span className="cornerA" />
                      <span className="cornerB" />
                      <span className="cornerC" />
                      <span className="cornerD" />

                      <MiniQr />
                    </div>
                  </div>

                  <div className="scenarioTitle">
                    <span>QR RETURN</span>
                    <strong>{ka ? product.ka : product.en}</strong>
                  </div>
                </div>

                <div className="scenarioCopy">
                  <p>{ka ? product.kaText : product.enText}</p>

                  <div className="result">
                    <i />
                    <span>
                      {ka ? product.kaResult : product.enResult}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          EMERGENCY — SEPARATE, BUT SAME PRODUCT FAMILY
      ====================================================== */}

      <section id="emergency" className="emergencySection">
        <div className="shell">
          <div className="emergencyCard">
            {/* LEFT VISUAL */}

            <div className="emergencyVisual">
              <div className="emergencyBackdrop" />

              <div className="bracelet">
                <div className="braceletStrap left" />

                <div className="braceletPlate">
                  <div className="braceletCross">+</div>
                  <MiniQr />
                  <small>EMERGENCY ID</small>
                </div>

                <div className="braceletStrap right" />
              </div>

              <div className="emergencyPhone">
                <div className="emergencyPhoneNotch" />

                <div className="emergencyPhoneScreen">
                  <span className="sosBadge">SOS READY</span>

                  <div className="emergencyPhoneTitle">
                    <span>QR RETURN</span>
                    <strong>EMERGENCY ID</strong>
                  </div>

                  <div className="emergencyData">
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

                    <div>
                      <ShieldIcon />

                      <section>
                        <span>PRIVACY</span>
                        <strong>Controlled by owner</strong>
                      </section>
                    </div>
                  </div>

                  <div className="emergencyQr">
                    <MiniQr />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COPY */}

            <div className="emergencyCopy">
              <div className="emergencyBrand">
                <div>+</div>

                <section>
                  <span>QR RETURN</span>
                  <strong>EMERGENCY ID</strong>
                </section>
              </div>

              <h2>
                {ka
                  ? "როცა დახმარება გჭირდება, მნიშვნელოვანი ინფორმაცია არ უნდა დაიკარგოს."
                  : "When help is needed, essential information should not be lost."}
              </h2>

              <p>
                {ka
                  ? "ერთი სკანი შეიძლება საკმარისი იყოს, რომ დამხმარემ ნახოს თქვენ მიერ ნებადართული საგანგებო ინფორმაცია — ვის დაუკავშირდეს, რა უნდა იცოდეს და როგორ დაგეხმაროთ."
                  : "One scan can give a helper access to the emergency information you choose to share — who to contact, what they should know and how they can help."}
              </p>

              <div className="signalTags">
                <span>SOS READY</span>
                <span>EMERGENCY CONTACT</span>
                <span>MEDICAL INFO</span>
                <span>NO APP</span>
                <span>PRIVACY CONTROL</span>
              </div>

              <a
                href={isLoggedIn ? "/account" : "/account/register"}
                className="emergencyCta"
              >
                {isLoggedIn
                  ? ka
                    ? "Emergency ID-ის მართვა"
                    : "Manage Emergency ID"
                  : ka
                    ? "ანგარიშის შექმნა"
                    : "Create Account"}

                <ArrowIcon />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          FIND → SCAN → CONNECT → RETURN
      ====================================================== */}

      <section className="flowSection">
        <div className="shell">
          <div className="flowIntro">
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
            <div className="flowStep">
              <span>01</span>

              <div className="flowIcon">
                <SearchIcon />
              </div>

              <strong>{ka ? "იპოვეს" : "Found"}</strong>

              <p>
                {ka
                  ? "მპოვნელი ხედავს QR RETURN კოდს."
                  : "The finder notices the QR RETURN code."}
              </p>
            </div>

            <div className="flowLine" />

            <div className="flowStep">
              <span>02</span>

              <div className="flowIcon">
                <ScanIcon />
              </div>

              <strong>{ka ? "დაასკანერეს" : "Scanned"}</strong>

              <p>
                {ka
                  ? "აპის ჩამოტვირთვა საჭირო არ არის."
                  : "No app download is required."}
              </p>
            </div>

            <div className="flowLine" />

            <div className="flowStep">
              <span>03</span>

              <div className="flowIcon">
                <ChatIcon />
              </div>

              <strong>{ka ? "დაგიკავშირდნენ" : "Connected"}</strong>

              <p>
                {ka
                  ? "Live Chat, ზარი ან თქვენ მიერ არჩეული მეთოდი."
                  : "Live Chat, call or another method you enable."}
              </p>
            </div>

            <div className="flowLine" />

            <div className="flowStep">
              <span>04</span>

              <div className="flowIcon">
                <ReturnIcon />
              </div>

              <strong>{ka ? "დაბრუნდა" : "Returned"}</strong>

              <p>
                {ka
                  ? "მპოვნელთან კავშირის შემდეგ დაბრუნება მარტივდება."
                  : "Once connected, getting it back becomes easier."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          BENEFITS
      ====================================================== */}

      <section className="benefitsSection">
        <div className="shell">
          <div className="benefitsHeader">
            <span>BUILT AROUND CONNECTION &amp; CONTROL</span>

            <h2>
              {ka
                ? "მარტივი მპოვნელისთვის. კონტროლირებადი თქვენთვის."
                : "Simple for the finder. Controlled by you."}
            </h2>
          </div>

          <div className="benefitsGrid">
            {benefits.map((benefit) => (
              <article key={benefit.number}>
                <div className="benefitTop">
                  <span>{benefit.number}</span>

                  <div>
                    {benefit.type === "chat" && <ChatIcon />}
                    {benefit.type === "location" && <LocationIcon />}
                    {benefit.type === "reward" && <RewardIcon />}
                    {benefit.type === "shield" && <ShieldIcon />}
                  </div>
                </div>

                <h3>{ka ? benefit.ka : benefit.en}</h3>

                <p>{ka ? benefit.kaText : benefit.enText}</p>
              </article>
            ))}
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

            <div className="accountCopy">
              <span>ONE OWNER ACCOUNT</span>

              <h2>
                {ka
                  ? "ყველა QR პროფილი ერთ სივრცეში."
                  : "Every QR profile in one place."}
              </h2>

              <p>
                {ka
                  ? "ძაღლი, კატა, გასაღები, საფულე, ჩემოდანი, ჩანთა და Emergency ID — შექმენით და მართეთ ერთი ანგარიშიდან."
                  : "Dog, cat, keys, wallet, luggage, bag and Emergency ID — create and manage everything from one account."}
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

      {/* ======================================================
          CONTACT
      ====================================================== */}

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

      {/* REAL LIVE CHAT COMPONENT */}

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
            <a href="#real-life">
              {ka ? "გამოყენება" : "Use cases"}
            </a>

            <a href="#emergency">Emergency ID</a>

            <span>{ka ? "კონფიდენციალურობა" : "Privacy"}</span>
            <span>{ka ? "პირობები" : "Terms"}</span>
          </div>

          <span className="copyright">© 2026 QR RETURN</span>
        </div>
      </footer>

      {/* ======================================================
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
          overflow: hidden;
          background: #f7f7f5;
          color: #151922;
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
          max-width: 1220px;
          margin: auto;
        }

        .eyebrow {
          color: #df5156;
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
          gap: 24px;
          border-bottom: 1px solid rgba(20, 25, 34, 0.08);
        }

        .brand,
        .headerRight,
        .nav,
        .language {
          display: flex;
          align-items: center;
        }

        .brand {
          gap: 11px;
          text-decoration: none;
        }

        .brandMark {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #18202b;
          color: white;
        }

        .brandMark :global(svg) {
          width: 22px;
        }

        .brandText strong,
        .brandText span {
          display: block;
        }

        .brandText strong {
          color: #18202b;
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
          font-size: 10px;
          font-weight: 820;
          text-decoration: none;
          white-space: nowrap;
        }

        .adminButton {
          color: #a7383d;
          border: 1px solid #efd9da;
          background: #fff7f7;
        }

        .adminButton :global(svg),
        .accountButton :global(svg) {
          width: 13px;
        }

        .accountButton {
          color: white;
          background: #18202b;
        }

        .loginButton {
          color: #4e5662;
          border: 1px solid #dde0e4;
        }

        .language {
          gap: 7px;
        }

        .language span {
          width: 1px;
          height: 12px;
          background: #d5d8dc;
        }

        .language button {
          padding: 0;
          border: 0;
          background: transparent;
          color: #9ca2aa;
          font-size: 8px;
          font-weight: 900;
          cursor: pointer;
        }

        .language button.active {
          color: #df5156;
        }

        /* HERO */

        .hero {
          min-height: 660px;
          position: relative;
          background:
            linear-gradient(
              120deg,
              #f8f7f4,
              #f1f2f1 52%,
              #e9ebed
            );
        }

        .heroInner {
          width: calc(100% - 52px);
          max-width: 1240px;
          min-height: 660px;
          margin: auto;
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 0.92fr 1.08fr;
          align-items: center;
          gap: 80px;
        }

        .heroGlow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .glowOne {
          width: 520px;
          height: 520px;
          right: -180px;
          top: -190px;
          background: radial-gradient(
            circle,
            rgba(59, 76, 101, 0.15),
            transparent 70%
          );
        }

        .glowTwo {
          width: 340px;
          height: 340px;
          left: -190px;
          bottom: -180px;
          background: radial-gradient(
            circle,
            rgba(223, 81, 86, 0.07),
            transparent 70%
          );
        }

        .heroCopy {
          max-width: 540px;
        }

        .heroLabel {
          color: #747d88;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .heroCopy h1 {
          margin: 19px 0 0;
          color: #161c25;
          font-size: clamp(38px, 4.5vw, 54px);
          line-height: 1.04;
          letter-spacing: -2.7px;
          font-weight: 690;
        }

        .heroCopy h1 span {
          color: #df5156;
        }

        .heroDescription {
          max-width: 480px;
          margin: 19px 0 0;
          color: #68717c;
          font-size: 12px;
          line-height: 1.72;
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
          background: #18202b;
        }

        .primaryCta :global(svg) {
          width: 12px;
        }

        .secondaryCta {
          color: #505966;
          border: 1px solid #dadee2;
          background: rgba(255, 255, 255, 0.5);
        }

        .emergencySignal {
          margin-top: 32px;
          padding: 13px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 11px;
          border: 1px solid #edd7d8;
          border-radius: 15px;
          color: inherit;
          background: rgba(255, 250, 250, 0.82);
          text-decoration: none;
          box-shadow: 0 10px 30px rgba(74, 42, 45, 0.04);
        }

        .signalCross {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          color: white;
          background: #df5156;
          font-size: 26px;
        }

        .emergencySignal span,
        .emergencySignal strong,
        .emergencySignal small {
          display: block;
        }

        .emergencySignal span {
          color: #c43f44;
          font-size: 5.5px;
          font-weight: 900;
          letter-spacing: 1.2px;
        }

        .emergencySignal strong {
          margin-top: 4px;
          color: #313944;
          font-size: 9px;
          line-height: 1.4;
        }

        .emergencySignal small {
          margin-top: 4px;
          color: #959ba4;
          font-size: 5px;
          letter-spacing: 0.6px;
        }

        .emergencySignal > :global(svg) {
          width: 13px;
          color: #df5156;
        }

        /* PHONE */

        .phoneStage {
          min-height: 560px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .phoneHalo {
          width: 500px;
          height: 500px;
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(62, 78, 101, 0.18),
            rgba(62, 78, 101, 0.03) 49%,
            transparent 70%
          );
        }

        .phone {
          width: 280px;
          height: 535px;
          padding: 9px;
          position: relative;
          z-index: 3;
          border-radius: 44px;
          background: linear-gradient(140deg, #121923, #05090d);
          box-shadow: 0 40px 90px rgba(18, 26, 37, 0.23);
          transform:
            perspective(1300px)
            rotateY(-7deg)
            rotateZ(2deg);
        }

        .phoneNotch {
          width: 76px;
          height: 18px;
          position: absolute;
          top: 14px;
          left: 50%;
          z-index: 5;
          border-radius: 999px;
          background: #070b10;
          transform: translateX(-50%);
        }

        .phoneScreen {
          height: 100%;
          padding: 34px 18px 18px;
          border-radius: 35px;
          background: linear-gradient(180deg, #ffffff, #f5f7f9);
        }

        .phoneHeader {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 8px;
        }

        .miniLogo {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          color: white;
          background: #18202b;
        }

        .miniLogo :global(svg) {
          width: 16px;
        }

        .phoneHeader span,
        .phoneHeader strong {
          display: block;
        }

        .phoneHeader span {
          color: #df5156;
          font-size: 5.5px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .phoneHeader strong {
          margin-top: 2px;
          color: #46505e;
          font-size: 7px;
        }

        .activePill {
          padding: 5px 6px;
          display: flex;
          align-items: center;
          gap: 4px;
          border-radius: 999px;
          color: #18784b;
          background: #eaf9ef;
          font-size: 5px;
          font-weight: 900;
        }

        .activePill i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #28a86d;
        }

        .mainQrArea {
          width: 195px;
          height: 195px;
          margin: 63px auto 0;
          position: relative;
          display: grid;
          place-items: center;
          border-radius: 23px;
          background: white;
          box-shadow: 0 18px 42px rgba(32, 42, 56, 0.08);
        }

        .scanCorner {
          width: 31px;
          height: 31px;
          position: absolute;
        }

        .topLeft {
          top: 0;
          left: 0;
          border-top: 3px solid #df5156;
          border-left: 3px solid #df5156;
          border-radius: 11px 0 0;
        }

        .topRight {
          top: 0;
          right: 0;
          border-top: 3px solid #df5156;
          border-right: 3px solid #df5156;
        }

        .bottomLeft {
          left: 0;
          bottom: 0;
          border-left: 3px solid #df5156;
          border-bottom: 3px solid #df5156;
        }

        .bottomRight {
          right: 0;
          bottom: 0;
          border-right: 3px solid #df5156;
          border-bottom: 3px solid #df5156;
        }

        .phoneMessage {
          margin-top: 28px;
          text-align: center;
        }

        .phoneMessage span {
          color: #a0a6ae;
          font-size: 5px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        .phoneMessage strong {
          display: block;
          margin-top: 5px;
          color: #202934;
          font-size: 11px;
        }

        .phoneMessage p {
          margin: 5px 0 0;
          color: #8b929b;
          font-size: 6px;
        }

        .phoneBottom {
          margin-top: 31px;
          padding-top: 14px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-top: 1px solid #e3e7eb;
        }

        .phoneBottom > div {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #808894;
          font-size: 6px;
        }

        .phoneBottom :global(svg) {
          width: 12px;
          color: #df5156;
        }

        .floatingChat,
        .floatingLocation {
          position: absolute;
          z-index: 5;
          display: flex;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 18px 45px rgba(34, 43, 56, 0.13);
          backdrop-filter: blur(18px);
        }

        .floatingChat {
          width: 205px;
          left: -26px;
          bottom: 78px;
          padding: 11px;
          gap: 9px;
          border-radius: 15px;
        }

        .floatingIcon {
          width: 37px;
          height: 37px;
          flex: 0 0 37px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          color: #df5156;
          background: #fff0f0;
        }

        .floatingIcon :global(svg) {
          width: 16px;
        }

        .floatingChat section {
          flex: 1;
        }

        .floatingChat span,
        .floatingChat strong,
        .floatingLocation span,
        .floatingLocation strong {
          display: block;
        }

        .floatingChat span,
        .floatingLocation span {
          color: #979ea7;
          font-size: 5px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .floatingChat strong,
        .floatingLocation strong {
          margin-top: 3px;
          color: #39434f;
          font-size: 8px;
        }

        .floatingChat > i {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #28a86d;
        }

        .floatingLocation {
          right: -4px;
          top: 93px;
          padding: 11px;
          gap: 8px;
          border-radius: 13px;
        }

        .floatingLocation :global(svg) {
          width: 19px;
          color: #18202b;
        }

        /* 6 SCENARIOS */

        .realLifeSection {
          padding: 96px 0 88px;
          background: #fbfbf9;
        }

        .sectionHeading {
          display: grid;
          grid-template-columns: 1fr 0.55fr;
          align-items: end;
          gap: 70px;
        }

        .sectionHeading h2,
        .flowIntro h2,
        .accountCopy h2 {
          margin: 10px 0 0;
          color: #171d26;
          font-size: clamp(33px, 4vw, 46px);
          line-height: 1.05;
          letter-spacing: -2.3px;
          font-weight: 680;
        }

        .sectionHeading > p {
          margin: 0;
          color: #717985;
          font-size: 11px;
          line-height: 1.7;
        }

        .productRow {
          margin-top: 40px;
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 10px;
        }

        .scenarioCard {
          overflow: hidden;
          border: 1px solid #e1e3e6;
          border-radius: 18px;
          background: white;
          box-shadow: 0 9px 26px rgba(26, 36, 50, 0.035);
        }

        .scenarioPhoto {
          height: 205px;
          position: relative;
          overflow: hidden;
          background: #dfe3e7;
        }

        .scenarioPhoto > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.45s ease;
        }

        .scenarioCard:hover .scenarioPhoto > img {
          transform: scale(1.035);
        }

        .photoShade {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              180deg,
              rgba(10, 14, 19, 0.02) 30%,
              rgba(10, 14, 19, 0.12) 65%,
              rgba(7, 10, 14, 0.68) 100%
            );
        }

        .attachedQr {
          width: 38px;
          height: 38px;
          position: absolute;
          top: 12px;
          left: 12px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.93);
          box-shadow: 0 7px 17px rgba(0, 0, 0, 0.11);
        }

        .scannerPhone {
          width: 49px;
          height: 82px;
          padding: 5px;
          position: absolute;
          top: 13px;
          right: 11px;
          border-radius: 11px;
          background: #161c26;
          transform: rotate(6deg);
          box-shadow: 0 9px 22px rgba(0, 0, 0, 0.19);
        }

        .scannerNotch {
          width: 15px;
          height: 3px;
          margin: 0 auto 7px;
          border-radius: 99px;
          background: #3c444e;
        }

        .scannerWindow {
          height: 57px;
          position: relative;
          display: grid;
          place-items: center;
          border-radius: 6px;
          background: #f7f7f7;
        }

        .scannerWindow > span {
          width: 8px;
          height: 8px;
          position: absolute;
        }

        .cornerA {
          top: 4px;
          left: 4px;
          border-top: 1px solid #df5156;
          border-left: 1px solid #df5156;
        }

        .cornerB {
          top: 4px;
          right: 4px;
          border-top: 1px solid #df5156;
          border-right: 1px solid #df5156;
        }

        .cornerC {
          bottom: 4px;
          left: 4px;
          border-left: 1px solid #df5156;
          border-bottom: 1px solid #df5156;
        }

        .cornerD {
          right: 4px;
          bottom: 4px;
          border-right: 1px solid #df5156;
          border-bottom: 1px solid #df5156;
        }

        .scenarioTitle {
          position: absolute;
          left: 14px;
          right: 14px;
          bottom: 13px;
        }

        .scenarioTitle span,
        .scenarioTitle strong {
          display: block;
        }

        .scenarioTitle span {
          color: #d8dde2;
          font-size: 4.5px;
          font-weight: 900;
          letter-spacing: 1.2px;
        }

        .scenarioTitle strong {
          margin-top: 3px;
          color: white;
          font-size: 14px;
        }

        .scenarioCopy {
          min-height: 122px;
          padding: 14px;
          display: flex;
          flex-direction: column;
        }

        .scenarioCopy p {
          margin: 0;
          flex: 1;
          color: #707985;
          font-size: 8px;
          line-height: 1.58;
        }

        .result {
          width: fit-content;
          margin-top: 10px;
          padding: 6px 8px;
          display: flex;
          align-items: center;
          gap: 5px;
          border-radius: 999px;
          color: #45505d;
          background: #f0f2f4;
          font-size: 6.5px;
          font-weight: 800;
        }

        .result i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #28a86d;
        }

        /* EMERGENCY SECTION */

        .emergencySection {
          padding: 92px 0;
          background: #f1f1ef;
        }

        .emergencyCard {
          min-height: 510px;
          padding: 34px;
          display: grid;
          grid-template-columns: 0.92fr 1.08fr;
          align-items: center;
          gap: 55px;
          overflow: hidden;
          border: 1px solid #ead9da;
          border-radius: 26px;
          background:
            linear-gradient(
              120deg,
              #fff9f9,
              #ffffff 60%,
              #f7f3f3
            );
          box-shadow: 0 20px 55px rgba(56, 37, 40, 0.055);
        }

        .emergencyVisual {
          min-height: 430px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .emergencyBackdrop {
          width: 360px;
          height: 360px;
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(223, 81, 86, 0.13),
            rgba(223, 81, 86, 0.025) 52%,
            transparent 72%
          );
        }

        .bracelet {
          width: 310px;
          height: 115px;
          position: absolute;
          z-index: 2;
          left: -18px;
          bottom: 75px;
          display: flex;
          align-items: center;
          transform: rotate(-8deg);
          filter: drop-shadow(0 17px 18px rgba(37, 42, 50, 0.16));
        }

        .braceletStrap {
          flex: 1;
          height: 48px;
          background: #d6dbe1;
        }

        .braceletStrap.left {
          border-radius: 24px 0 0 24px;
        }

        .braceletStrap.right {
          border-radius: 0 24px 24px 0;
        }

        .braceletPlate {
          width: 128px;
          height: 100px;
          flex: 0 0 128px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 4px solid #bfc5cc;
          border-radius: 23px;
          background: white;
        }

        .braceletCross {
          width: 19px;
          height: 19px;
          position: absolute;
          top: 8px;
          right: 9px;
          display: grid;
          place-items: center;
          border-radius: 5px;
          color: white;
          background: #df5156;
          font-size: 14px;
        }

        .braceletPlate small {
          margin-top: 5px;
          color: #a64045;
          font-size: 5px;
          font-weight: 900;
          letter-spacing: 0.8px;
        }

        .emergencyPhone {
          width: 205px;
          height: 370px;
          padding: 7px;
          position: relative;
          z-index: 3;
          margin-left: 120px;
          border-radius: 29px;
          background: #151c26;
          box-shadow: 0 24px 55px rgba(24, 32, 43, 0.22);
          transform: rotate(4deg);
        }

        .emergencyPhoneNotch {
          width: 50px;
          height: 9px;
          position: absolute;
          top: 10px;
          left: 50%;
          z-index: 3;
          border-radius: 99px;
          background: #080c11;
          transform: translateX(-50%);
        }

        .emergencyPhoneScreen {
          height: 100%;
          padding: 29px 14px 13px;
          border-radius: 23px;
          background: #f9fafb;
        }

        .sosBadge {
          display: inline-flex;
          padding: 5px 7px;
          border-radius: 999px;
          color: white;
          background: #df5156;
          font-size: 5px;
          font-weight: 900;
          letter-spacing: 0.8px;
        }

        .emergencyPhoneTitle {
          margin-top: 16px;
        }

        .emergencyPhoneTitle span,
        .emergencyPhoneTitle strong {
          display: block;
        }

        .emergencyPhoneTitle span {
          color: #df5156;
          font-size: 5px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .emergencyPhoneTitle strong {
          margin-top: 3px;
          color: #27313e;
          font-size: 11px;
        }

        .emergencyData {
          margin-top: 15px;
        }

        .emergencyData > div {
          min-height: 51px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-top: 1px solid #e4e7eb;
        }

        .emergencyData :global(svg) {
          width: 14px;
          color: #df5156;
        }

        .emergencyData section span,
        .emergencyData section strong {
          display: block;
        }

        .emergencyData section span {
          color: #9ca3ac;
          font-size: 4.5px;
          font-weight: 900;
          letter-spacing: 0.7px;
        }

        .emergencyData section strong {
          margin-top: 2px;
          color: #4a5563;
          font-size: 6px;
        }

        .emergencyQr {
          width: 60px;
          height: 60px;
          margin: 16px auto 0;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: #eef0f2;
        }

        .emergencyCopy {
          max-width: 520px;
        }

        .emergencyBrand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .emergencyBrand > div {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          color: white;
          background: #df5156;
          font-size: 27px;
        }

        .emergencyBrand section span,
        .emergencyBrand section strong {
          display: block;
        }

        .emergencyBrand section span {
          color: #df5156;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1.3px;
        }

        .emergencyBrand section strong {
          margin-top: 3px;
          color: #2c3541;
          font-size: 13px;
        }

        .emergencyCopy h2 {
          margin: 23px 0 0;
          color: #181e27;
          font-size: clamp(30px, 3.5vw, 41px);
          line-height: 1.08;
          letter-spacing: -2px;
          font-weight: 680;
        }

        .emergencyCopy > p {
          margin: 16px 0 0;
          color: #6d7580;
          font-size: 11px;
          line-height: 1.72;
        }

        .signalTags {
          margin-top: 22px;
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .signalTags span {
          padding: 7px 9px;
          border: 1px solid #efd7d9;
          border-radius: 999px;
          color: #b93e43;
          background: #fff7f7;
          font-size: 5.5px;
          font-weight: 900;
          letter-spacing: 0.6px;
        }

        .emergencyCta {
          width: fit-content;
          min-height: 42px;
          margin-top: 24px;
          padding: 0 14px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border-radius: 10px;
          color: white;
          background: #df5156;
          font-size: 8.5px;
          font-weight: 850;
          text-decoration: none;
        }

        .emergencyCta :global(svg) {
          width: 12px;
        }

        /* FLOW */

        .flowSection {
          padding: 92px 0;
          background: #fbfbf9;
        }

        .flowIntro {
          max-width: 680px;
        }

        .flow {
          margin-top: 45px;
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
          align-items: start;
        }

        .flowStep > span {
          color: #acb2ba;
          font-size: 7px;
          font-weight: 900;
        }

        .flowIcon {
          width: 46px;
          height: 46px;
          margin-top: 14px;
          display: grid;
          place-items: center;
          border: 1px solid #dfe2e5;
          border-radius: 13px;
          color: #18202b;
          background: #ffffff;
        }

        .flowIcon :global(svg) {
          width: 18px;
        }

        .flowStep strong {
          display: block;
          margin-top: 17px;
          color: #2c3541;
          font-size: 11px;
        }

        .flowStep p {
          margin: 6px 0 0;
          color: #79818c;
          font-size: 8.5px;
          line-height: 1.6;
        }

        .flowLine {
          width: 55px;
          height: 1px;
          margin: 36px 17px 0;
          background: #dadee2;
        }

        /* BENEFITS */

        .benefitsSection {
          padding: 92px 0;
          color: white;
          background: #18202b;
        }

        .benefitsHeader > span {
          color: #e58c90;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1.8px;
        }

        .benefitsHeader h2 {
          max-width: 740px;
          margin: 10px 0 0;
          color: white;
          font-size: clamp(32px, 4vw, 45px);
          line-height: 1.05;
          letter-spacing: -2.2px;
          font-weight: 660;
        }

        .benefitsGrid {
          margin-top: 42px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .benefitsGrid article {
          min-height: 200px;
          padding: 22px 20px;
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
          color: #68727e;
          font-size: 7px;
          font-weight: 900;
        }

        .benefitTop > div {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          color: #e58c90;
          background: rgba(255, 255, 255, 0.06);
        }

        .benefitTop :global(svg) {
          width: 15px;
        }

        .benefitsGrid h3 {
          margin: 34px 0 0;
          color: white;
          font-size: 12px;
        }

        .benefitsGrid p {
          margin: 8px 0 0;
          color: #929ba7;
          font-size: 9px;
          line-height: 1.65;
        }

        /* ACCOUNT */

        .accountSection {
          padding: 72px 0;
          background: #f7f7f5;
        }

        .accountPanel {
          min-height: 175px;
          padding: 29px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 21px;
          border: 1px solid #e0e2e5;
          border-radius: 21px;
          background: white;
        }

        .accountIcon {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          color: #18202b;
          background: #eef0f2;
        }

        .accountIcon :global(svg) {
          width: 24px;
        }

        .accountCopy span {
          color: #df5156;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        .accountCopy h2 {
          font-size: clamp(27px, 3.2vw, 38px);
        }

        .accountCopy p {
          max-width: 660px;
          margin: 9px 0 0;
          color: #747c87;
          font-size: 10px;
          line-height: 1.65;
        }

        .accountPanel > a {
          min-height: 42px;
          padding: 0 14px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border-radius: 10px;
          color: white;
          background: #18202b;
          font-size: 8.5px;
          font-weight: 850;
          text-decoration: none;
        }

        .accountPanel > a :global(svg) {
          width: 12px;
        }

        /* CONTACT */

        .contact {
          padding: 72px 0;
          background: #efefed;
        }

        .contactInner {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 50px;
        }

        .contactInner h2 {
          margin: 9px 0 8px;
          color: #171d26;
          font-size: 35px;
          letter-spacing: -1.7px;
        }

        .contactInner p {
          max-width: 610px;
          margin: 0;
          color: #707984;
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
          background: #18202b;
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
          background: #11171f;
        }

        .footerInner {
          max-width: 1180px;
          min-height: 130px;
          margin: auto;
          padding: 34px 26px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 34px;
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
          background: #df5156;
        }

        .footerBrand > div :global(svg) {
          width: 19px;
        }

        .footerBrand section strong,
        .footerBrand section span {
          display: block;
        }

        .footerBrand section strong {
          font-size: 12px;
        }

        .footerBrand section span {
          margin-top: 3px;
          color: #707a87;
          font-size: 5px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .footerLinks {
          display: flex;
          flex-wrap: wrap;
          gap: 22px;
        }

        .footerLinks a,
        .footerLinks span {
          color: #858e9a;
          font-size: 8px;
          text-decoration: none;
        }

        .copyright {
          color: #5d6875;
          font-size: 7px;
        }

        @media (max-width: 1100px) {
          .productRow {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 980px) {
          .heroInner {
            grid-template-columns: 1fr;
            padding: 65px 0 80px;
          }

          .sectionHeading {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .emergencyCard {
            grid-template-columns: 1fr;
          }

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

          .benefitsGrid article:nth-child(2) {
            border-right: 0;
          }

          .benefitsGrid article:nth-child(-n + 2) {
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
          .language {
            display: none;
          }

          .brandMark {
            width: 38px;
            height: 38px;
          }

          .brandText strong {
            font-size: 15px;
          }

          .adminButton {
            padding: 0 8px;
          }

          .adminButton span {
            display: none;
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
            padding: 48px 0 70px;
          }

          .heroCopy h1 {
            font-size: 38px;
            letter-spacing: -2px;
          }

          .heroActions {
            flex-direction: column;
            align-items: stretch;
          }

          .primaryCta,
          .secondaryCta {
            width: 100%;
          }

          .emergencySignal {
            grid-template-columns: auto 1fr;
          }

          .emergencySignal > :global(svg) {
            display: none;
          }

          .phoneStage {
            min-height: 520px;
          }

          .phone {
            width: 245px;
            height: 490px;
          }

          .mainQrArea {
            width: 170px;
            height: 170px;
          }

          .floatingChat {
            width: 190px;
            left: -4px;
            bottom: 45px;
          }

          .floatingLocation {
            right: -4px;
            top: 67px;
          }

          .realLifeSection,
          .emergencySection,
          .flowSection,
          .benefitsSection {
            padding: 74px 0;
          }

          .sectionHeading h2,
          .flowIntro h2,
          .accountCopy h2 {
            font-size: 33px;
            letter-spacing: -1.9px;
          }

          .productRow {
            grid-template-columns: repeat(2, 1fr);
          }

          .scenarioPhoto {
            height: 190px;
          }

          .emergencyCard {
            padding: 24px 18px;
          }

          .emergencyVisual {
            min-height: 430px;
          }

          .emergencyPhone {
            width: 180px;
            height: 340px;
            margin-left: 80px;
          }

          .bracelet {
            width: 270px;
            left: -35px;
          }

          .emergencyCopy h2 {
            font-size: 32px;
          }

          .flow,
          .benefitsGrid {
            grid-template-columns: 1fr;
          }

          .benefitsGrid article,
          .benefitsGrid article:nth-child(2) {
            border-right: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .benefitsGrid article:last-child {
            border-bottom: 0;
          }

          .accountPanel {
            padding: 23px 19px;
          }

          .contact {
            padding: 58px 0;
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

/* ============================================================
   ICONS
============================================================ */

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
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: 4,
      }}
    >
      {Array.from({ length: 49 }).map((_, index) => (
        <i
          key={index}
          style={{
            display: "block",
            borderRadius: 1,
            background: dark.includes(index)
              ? "#18202b"
              : "#e2e5e8",
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
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 1.4,
      }}
    >
      {Array.from({ length: 25 }).map((_, index) => (
        <i
          key={index}
          style={{
            display: "block",
            background: dark.includes(index)
              ? "#18202b"
              : "#dfe3e7",
          }}
        />
      ))}
    </div>
  );
}
