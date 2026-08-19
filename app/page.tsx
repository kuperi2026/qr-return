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
  kaResult: string;
  enResult: string;
  image: string;
};

const topProducts: Product[] = [
  {
    id: "dog",
    ka: "ძაღლი",
    en: "Dog",
    kaText:
      "მპოვნელი ასკანერებს საყელოზე მიმაგრებულ QR RETURN კოდს და მარტივად გიკავშირდებათ.",
    enText:
      "The finder scans the QR RETURN tag on the collar and can contact you.",
    kaResult: "პატრონთან დაკავშირება",
    enResult: "Contact owner",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=88",
  },
  {
    id: "cat",
    ka: "კატა",
    en: "Cat",
    kaText:
      "QR პროფილი აჩვენებს მხოლოდ იმ ინფორმაციას, რომლის გაზიარებაც თავად გსურთ.",
    enText:
      "The QR profile shows only the information you choose to share.",
    kaResult: "Finder Profile",
    enResult: "Finder Profile",
    image:
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=1200&q=88",
  },
  {
    id: "keys",
    ka: "გასაღები",
    en: "Keys",
    kaText:
      "ნაპოვნ გასაღებზე QR tag მპოვნელს გაძლევთ თქვენთან დაკავშირების მარტივ გზას.",
    enText:
      "A QR tag on found keys gives the finder a simple way to reach you.",
    kaResult: "Live Chat",
    enResult: "Live Chat",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=88",
  },
];

const bottomProducts: Product[] = [
  {
    id: "wallet",
    ka: "საფულე",
    en: "Wallet",
    kaText:
      "საფულეზე QR RETURN ქმნის უსაფრთხო კავშირს მპოვნელთან პირადი მონაცემების ზედმეტად გამოჩენის გარეშე.",
    enText:
      "QR RETURN creates a secure path from a found wallet back to you.",
    kaResult: "უსაფრთხო დაბრუნება",
    enResult: "Return securely",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=88",
  },
  {
    id: "luggage",
    ka: "ჩემოდანი",
    en: "Luggage",
    kaText:
      "აეროპორტში დარჩენილი ან ნაპოვნი ჩემოდნიდან მპოვნელმა შეიძლება ლოკაციაც გაგიზიაროთ.",
    enText:
      "A finder at the airport can scan your luggage QR and share its location.",
    image:
      "https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&w=1200&q=88",
    kaResult: "ლოკაცია გაზიარებულია",
    enResult: "Location shared",
  },
  {
    id: "bag",
    ka: "ჩანთა",
    en: "Bag",
    kaText:
      "ნაპოვნი ჩანთიდან ერთი სკანი საკმარისია მფლობელთან უსაფრთხო კავშირის დასაწყებად.",
    enText:
      "One scan from a found bag is enough to start a secure connection.",
    kaResult: "Owner notified",
    enResult: "Owner notified",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=88",
  },
];

const benefits = [
  {
    number: "01",
    type: "chat",
    ka: "Live Chat",
    en: "Live Chat",
    kaText:
      "მპოვნელთან პირდაპირი კავშირი პირადი ნომრის გამოჩენის გარეშე.",
    enText:
      "Direct finder contact without exposing your private phone number.",
  },
  {
    number: "02",
    type: "location",
    ka: "ლოკაციის გაზიარება",
    en: "Location Sharing",
    kaText:
      "მპოვნელმა ერთი ღილაკით შეიძლება გაგიზიაროთ მიმდინარე მდებარეობა.",
    enText:
      "The finder can share the current location in one tap.",
  },
  {
    number: "03",
    type: "reward",
    ka: "მპოვნელის ჯილდო",
    en: "Finder Reward",
    kaText:
      "სურვილის შემთხვევაში მიუთითეთ ჯილდო უსაფრთხო დაბრუნებისთვის.",
    enText:
      "Optionally offer a reward for a safe return.",
  },
  {
    number: "04",
    type: "privacy",
    ka: "Privacy Control",
    en: "Privacy Control",
    kaText:
      "თქვენ თავად აკონტროლებთ რა ინფორმაცია გამოჩნდება მპოვნელისთვის.",
    enText:
      "You decide exactly what information a finder can see.",
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
      {/* HEADER */}

      <header className="header">
        <a href="/" className="brand">
          <div className="brandMark">
            <QrIcon />
          </div>

          <div className="brandCopy">
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

      {/* HERO */}

      <section className="hero">
        <div className="heroGlow glowOne" />
        <div className="heroGlow glowTwo" />

        <div className="heroInner">
          <div className="heroCopy">
            <div className="heroLabel">SMART LOST &amp; FOUND</div>

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

              <a href="#products" className="secondaryCta">
                {ka ? "ნახე როგორ მუშაობს" : "See how it works"}
              </a>
            </div>

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

          {/* PHONE WITH QR */}

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

                  <p>Live Chat • Location • Contact options</p>
                </div>

                <div className="phoneBottom">
                  <div>
                    <ShieldIcon />
                    <span>{ka ? "დაცული ინფორმაცია" : "Protected"}</span>
                  </div>

                  <div>
                    <ScanIcon />
                    <span>{ka ? "აპის გარეშე" : "No App"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="floatingChat">
              <div className="floatingChatIcon">
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

      {/* =====================================================
          TOP 3
      ===================================================== */}

      <section id="products" className="storySection">
        <div className="shell">
          <div className="sectionIntro">
            <span className="eyebrow">QR RETURN IN REAL LIFE</span>

            <p>
              {ka
                ? "ერთი QR კოდი. რეალური სიტუაციები, სადაც მპოვნელთან დაკავშირება რამდენიმე წამში შეიძლება დაიწყოს."
                : "One QR code. Real situations where a finder can start connecting with you in seconds."}
            </p>
          </div>

          <div className="threeGrid">
            {topProducts.map((product) => (
              <ProductStoryCard
                key={product.id}
                product={product}
                ka={ka}
              />
            ))}
          </div>

          {/* =================================================
              EMERGENCY BETWEEN 3 + 3
          ================================================= */}

          <section id="emergency" className="emergencyBlock">
            <div className="emergencyVisual">
              <div className="emergencyGlow" />

              <div className="bracelet">
                <div className="strap left" />

                <div className="braceletCenter">
                  <span className="braceletCross">+</span>
                  <MiniQr />
                  <small>EMERGENCY ID</small>
                </div>

                <div className="strap right" />
              </div>

              <div className="emergencyPhone">
                <div className="emergencyNotch" />

                <div className="emergencyScreen">
                  <span className="sos">SOS READY</span>

                  <div className="emergencyScreenTitle">
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
                        <strong>Owner controlled</strong>
                      </section>
                    </div>
                  </div>

                  <div className="emergencyQr">
                    <MiniQr />
                  </div>
                </div>
              </div>
            </div>

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
          </section>

          {/* =================================================
              BOTTOM 3
          ================================================= */}

          <div className="threeGrid bottomGrid">
            {bottomProducts.map((product) => (
              <ProductStoryCard
                key={product.id}
                product={product}
                ka={ka}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FIND SCAN CONNECT RETURN */}

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

      {/* BENEFITS */}

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

            <div>
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

      {/* CONTACT */}

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

      {/* LIVE CHAT */}
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
            <a href="#emergency">Emergency ID</a>
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
          background: #f7f7f5;
          color: #171c24;
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

        .brandCopy strong,
        .brandCopy span {
          display: block;
        }

        .brandCopy strong {
          color: #18202b;
          font-size: 18px;
          font-weight: 850;
        }

        .brandCopy span {
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
        }

        .topRight {
          top: 0;
          right: 0;
          border-top: 3px solid #df5156;
          border-right: 3px solid #df5156;
        }

        .bottomLeft {
          bottom: 0;
          left: 0;
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

        .floatingChatIcon {
          width: 37px;
          height: 37px;
          flex: 0 0 37px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          color: #df5156;
          background: #fff0f0;
        }

        .floatingChatIcon :global(svg) {
          width: 16px;
        }

        .floatingChat > div:nth-child(2) {
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

        /* PRODUCT STORY */

        .storySection {
          padding: 92px 0;
          background: #fbfbf9;
        }

        .sectionIntro {
          max-width: 650px;
        }

        .sectionIntro p {
          margin: 11px 0 0;
          color: #717985;
          font-size: 11px;
          line-height: 1.7;
        }

        .threeGrid {
          margin-top: 35px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .bottomGrid {
          margin-top: 42px;
        }

        /* EMERGENCY */

        .emergencyBlock {
          min-height: 470px;
          margin-top: 54px;
          padding: 34px 40px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          align-items: center;
          gap: 55px;
          overflow: hidden;
          border: 1px solid #ead8da;
          border-radius: 26px;
          background:
            linear-gradient(
              115deg,
              #fff9f9,
              #ffffff 58%,
              #f8f4f4
            );
          box-shadow: 0 18px 50px rgba(56, 37, 40, 0.05);
        }

        .emergencyVisual {
          min-height: 390px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .emergencyGlow {
          width: 340px;
          height: 340px;
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(223, 81, 86, 0.14),
            transparent 69%
          );
        }

        .bracelet {
          width: 285px;
          position: absolute;
          z-index: 2;
          left: -20px;
          bottom: 63px;
          display: flex;
          align-items: center;
          transform: rotate(-8deg);
        }

        .strap {
          height: 46px;
          flex: 1;
          background: #d8dde3;
        }

        .strap.left {
          border-radius: 23px 0 0 23px;
        }

        .strap.right {
          border-radius: 0 23px 23px 0;
        }

        .braceletCenter {
          width: 120px;
          height: 94px;
          flex: 0 0 120px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 4px solid #bfc6cd;
          border-radius: 22px;
          background: white;
        }

        .braceletCross {
          width: 18px;
          height: 18px;
          position: absolute;
          top: 7px;
          right: 8px;
          display: grid;
          place-items: center;
          border-radius: 5px;
          color: white;
          background: #df5156;
          font-size: 13px;
        }

        .braceletCenter small {
          margin-top: 5px;
          color: #a43e43;
          font-size: 4.8px;
          font-weight: 900;
          letter-spacing: 0.7px;
        }

        .emergencyPhone {
          width: 190px;
          height: 345px;
          padding: 7px;
          position: relative;
          z-index: 3;
          margin-left: 120px;
          border-radius: 28px;
          background: #151c26;
          box-shadow: 0 24px 55px rgba(24, 32, 43, 0.2);
          transform: rotate(4deg);
        }

        .emergencyNotch {
          width: 48px;
          height: 8px;
          position: absolute;
          top: 10px;
          left: 50%;
          z-index: 3;
          border-radius: 99px;
          background: #090d12;
          transform: translateX(-50%);
        }

        .emergencyScreen {
          height: 100%;
          padding: 27px 13px 12px;
          border-radius: 22px;
          background: #f9fafb;
        }

        .sos {
          display: inline-flex;
          padding: 5px 7px;
          border-radius: 999px;
          color: white;
          background: #df5156;
          font-size: 5px;
          font-weight: 900;
        }

        .emergencyScreenTitle {
          margin-top: 15px;
        }

        .emergencyScreenTitle span,
        .emergencyScreenTitle strong {
          display: block;
        }

        .emergencyScreenTitle span {
          color: #df5156;
          font-size: 5px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .emergencyScreenTitle strong {
          margin-top: 3px;
          color: #27313e;
          font-size: 10px;
        }

        .emergencyData {
          margin-top: 14px;
        }

        .emergencyData > div {
          min-height: 48px;
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
          font-size: 4.3px;
          font-weight: 900;
        }

        .emergencyData section strong {
          margin-top: 2px;
          color: #4a5563;
          font-size: 5.8px;
        }

        .emergencyQr {
          width: 57px;
          height: 57px;
          margin: 15px auto 0;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #eef0f2;
        }

        .emergencyCopy {
          max-width: 530px;
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

        .emergencyBrand span,
        .emergencyBrand strong {
          display: block;
        }

        .emergencyBrand span {
          color: #df5156;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1.3px;
        }

        .emergencyBrand strong {
          margin-top: 3px;
          color: #2c3541;
          font-size: 13px;
        }

        .emergencyCopy h2 {
          margin: 22px 0 0;
          color: #181e27;
          font-size: clamp(29px, 3.4vw, 40px);
          line-height: 1.08;
          letter-spacing: -1.9px;
          font-weight: 680;
        }

        .emergencyCopy > p {
          margin: 15px 0 0;
          color: #6d7580;
          font-size: 10.5px;
          line-height: 1.72;
        }

        .signalTags {
          margin-top: 21px;
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
        }

        .emergencyCta {
          width: fit-content;
          min-height: 42px;
          margin-top: 23px;
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
          background: #f1f1ef;
        }

        .flowIntro {
          max-width: 680px;
        }

        .flowIntro h2 {
          margin: 10px 0 0;
          font-size: clamp(32px, 4vw, 45px);
          letter-spacing: -2.2px;
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
          background: white;
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
          background: #d8dce0;
        }

        /* BENEFITS */

        .benefitsSection {
          padding: 92px 0;
          background: #18202b;
          color: white;
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

        .accountPanel > div:nth-child(2) > span {
          color: #df5156;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        .accountPanel h2 {
          margin: 8px 0 0;
          font-size: clamp(27px, 3vw, 37px);
          letter-spacing: -1.8px;
        }

        .accountPanel p {
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
          background: #11171f;
          color: white;
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

        @media (max-width: 980px) {
          .heroInner {
            grid-template-columns: 1fr;
            padding: 65px 0 80px;
          }

          .threeGrid {
            grid-template-columns: 1fr 1fr;
          }

          .emergencyBlock {
            grid-template-columns: 1fr;
          }

          .flow {
            grid-template-columns: 1fr 1fr;
            gap: 28px;
          }

          .flowLine {
            display: none;
          }

          .benefitsGrid {
            grid-template-columns: 1fr 1fr;
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

          .brandCopy span,
          .language {
            display: none;
          }

          .brandMark {
            width: 38px;
            height: 38px;
          }

          .brandCopy strong {
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
            padding: 48px 0 70px;
          }

          .heroCopy h1 {
            font-size: 38px;
            letter-spacing: -2px;
          }

          .heroActions {
            flex-direction: column;
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
            width: 188px;
            left: -4px;
            bottom: 45px;
          }

          .floatingLocation {
            right: -4px;
            top: 67px;
          }

          .storySection,
          .flowSection,
          .benefitsSection {
            padding: 70px 0;
          }

          .threeGrid {
            grid-template-columns: 1fr;
          }

          .emergencyBlock {
            padding: 24px 18px;
          }

          .emergencyVisual {
            min-height: 400px;
          }

          .emergencyPhone {
            width: 175px;
            height: 330px;
            margin-left: 75px;
          }

          .bracelet {
            width: 260px;
            left: -35px;
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

/* PRODUCT STORY CARD */

function ProductStoryCard({
  product,
  ka,
}: {
  product: Product;
  ka: boolean;
}) {
  return (
    <article className="productStoryCard">
      <div className="productImage">
        <img src={product.image} alt={ka ? product.ka : product.en} />

        <div className="imageShade" />

        <div className="qrTag">
          <MiniQr />
        </div>

        <div className="scanMiniPhone">
          <div className="scanMiniNotch" />

          <div className="scanMiniScreen">
            <MiniQr />
          </div>
        </div>

        <div className="productTitle">
          <span>QR RETURN</span>
          <strong>{ka ? product.ka : product.en}</strong>
        </div>
      </div>

      <div className="productStoryCopy">
        <p>{ka ? product.kaText : product.enText}</p>

        <div className="resultPill">
          <i />
          <span>{ka ? product.kaResult : product.enResult}</span>
        </div>
      </div>

      <style jsx>{`
        .productStoryCard {
          overflow: hidden;
          border: 1px solid #e1e4e7;
          border-radius: 20px;
          background: white;
          box-shadow: 0 10px 28px rgba(26, 36, 50, 0.035);
        }

        .productImage {
          height: 255px;
          position: relative;
          overflow: hidden;
          background: #e1e4e7;
        }

        .productImage > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.45s ease;
        }

        .productStoryCard:hover .productImage > img {
          transform: scale(1.025);
        }

        .imageShade {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(10, 14, 19, 0.01) 25%,
            rgba(10, 14, 19, 0.07) 55%,
            rgba(8, 11, 15, 0.7) 100%
          );
        }

        .qrTag {
          width: 43px;
          height: 43px;
          position: absolute;
          top: 14px;
          left: 14px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.94);
          box-shadow: 0 7px 20px rgba(0, 0, 0, 0.11);
        }

        .scanMiniPhone {
          width: 57px;
          height: 96px;
          padding: 6px;
          position: absolute;
          top: 15px;
          right: 14px;
          border-radius: 13px;
          background: #171e28;
          transform: rotate(5deg);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.19);
        }

        .scanMiniNotch {
          width: 17px;
          height: 3px;
          margin: 0 auto 8px;
          border-radius: 10px;
          background: #434b55;
        }

        .scanMiniScreen {
          height: 70px;
          display: grid;
          place-items: center;
          border-radius: 7px;
          background: #f7f7f7;
        }

        .productTitle {
          position: absolute;
          left: 17px;
          right: 17px;
          bottom: 16px;
        }

        .productTitle span,
        .productTitle strong {
          display: block;
        }

        .productTitle span {
          color: #d5dae0;
          font-size: 5px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        .productTitle strong {
          margin-top: 3px;
          color: white;
          font-size: 20px;
          letter-spacing: -0.4px;
        }

        .productStoryCopy {
          min-height: 130px;
          padding: 16px;
          display: flex;
          flex-direction: column;
        }

        .productStoryCopy p {
          margin: 0;
          flex: 1;
          color: #707985;
          font-size: 9px;
          line-height: 1.65;
        }

        .resultPill {
          width: fit-content;
          margin-top: 11px;
          padding: 6px 8px;
          display: flex;
          align-items: center;
          gap: 6px;
          border-radius: 999px;
          color: #45505d;
          background: #f0f2f4;
          font-size: 7px;
          font-weight: 800;
        }

        .resultPill i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #28a86d;
        }
      `}</style>
    </article>
  );
}

/* ICONS */

function QrIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21c.8-4.1 3.3-6.3 7.5-6.3s6.7 2.2 7.5 6.3" />
    </svg>
  );
}

function AdminIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 2.5 19 6v5.3c0 4.7-2.4 7.8-7 10.2-4.6-2.4-7-5.5-7-10.2V6z" />
      <path d="m8.8 12 2.1 2.1 4.5-4.5" />
    </svg>
  );
}

function ScanIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" />
      <path d="M7 12h10" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 5.5h16v11H9l-5 4z" />
      <path d="M8 10h8M8 13h5" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}

function RewardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M6 9h12v11H6z" />
      <path d="M4 6h16v3H4z" />
      <path d="M12 6v14" />
      <path d="M12 6c-1.2-3-5-3.4-5.5-.9-.4 2 2.3 2.3 5.5.9ZM12 6c1.2-3 5-3.4 5.5-.9.4 2-2.3 2.3-5.5.9Z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" />
      <path d="M7.5 12h2.1l1-2.1 2.1 4.2 1.2-2.1h2.4" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15 15 5 5" />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M9 7 4 12l5 5" />
      <path d="M5 12h9a5 5 0 0 1 5 5v2" />
    </svg>
  );
}

function QrCode() {
  const dark = [
    0, 1, 2, 5, 6, 7, 9, 11, 13, 14, 16, 18, 20, 21, 22, 24, 26, 27, 28,
    30, 32, 34, 35, 36, 38, 40, 42, 43, 44, 46, 47, 48,
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
      {Array.from({ length: 49 }).map((_, index) => (
        <i
          key={index}
          style={{
            background: dark.includes(index) ? "#18202b" : "#e2e5e8",
            borderRadius: 1,
          }}
        />
      ))}
    </div>
  );
}

function MiniQr() {
  const dark = [
    0, 1, 2, 4, 6, 7, 8, 10, 12, 14, 15, 17, 18, 20, 21, 22, 24,
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
      {Array.from({ length: 25 }).map((_, index) => (
        <i
          key={index}
          style={{
            background: dark.includes(index) ? "#18202b" : "#dfe3e7",
          }}
        />
      ))}
    </div>
  );
}
