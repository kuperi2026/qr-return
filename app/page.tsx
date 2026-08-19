"use client";

import { useEffect, useState } from "react";
import SupportLauncher from "./components/SupportLauncher";
import { supabase } from "@/lib/supabase";

type Language = "ka" | "en";

type Story = {
  id: string;
  ka: string;
  en: string;
  kaAction: string;
  enAction: string;
  kaResult: string;
  enResult: string;
  image: string;
  large?: boolean;
};

const stories: Story[] = [
  {
    id: "dog",
    ka: "ძაღლი",
    en: "Dog",
    kaAction: "მპოვნელი ასკანერებს საყელოზე მიმაგრებულ QR-ს.",
    enAction: "The finder scans the QR tag on the collar.",
    kaResult: "პატრონთან დაკავშირება",
    enResult: "Contact owner",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1400&q=88",
    large: true,
  },
  {
    id: "cat",
    ka: "კატა",
    en: "Cat",
    kaAction: "QR პროფილი აჩვენებს მხოლოდ საჭირო ინფორმაციას.",
    enAction: "The QR profile reveals only approved information.",
    kaResult: "Finder Profile",
    enResult: "Finder Profile",
    image:
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=1100&q=88",
  },
  {
    id: "keys",
    ka: "გასაღები",
    en: "Keys",
    kaAction: "ერთი სკანი — რეგისტრაციისა და აპის გარეშე.",
    enAction: "One scan — no registration or app required.",
    kaResult: "Live Chat",
    enResult: "Live Chat",
    image:
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1100&q=88",
  },
  {
    id: "wallet",
    ka: "საფულე",
    en: "Wallet",
    kaAction: "მპოვნელი საფულეზე QR კოდს ასკანერებს.",
    enAction: "The finder scans the QR on the wallet.",
    kaResult: "უსაფრთხო დაბრუნება",
    enResult: "Return securely",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1100&q=88",
  },
  {
    id: "luggage",
    ka: "ჩემოდანი",
    en: "Luggage",
    kaAction: "ბარგის პოვნისას მპოვნელმა შეიძლება ლოკაცია გაგიზიაროთ.",
    enAction: "A finder can share your luggage location.",
    kaResult: "Location shared",
    enResult: "Location shared",
    image:
      "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=1400&q=88",
    large: true,
  },
  {
    id: "bag",
    ka: "ჩანთა",
    en: "Bag",
    kaAction: "QR RETURN პირდაპირ გაკავშირებთ მპოვნელთან.",
    enAction: "QR RETURN connects you directly with the finder.",
    kaResult: "Owner notified",
    enResult: "Owner notified",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1100&q=88",
  },
];

const benefits = [
  {
    number: "01",
    icon: "chat",
    ka: "Live Chat",
    en: "Live Chat",
    kaText: "მპოვნელთან პირდაპირი კავშირი პირადი ნომრის გამოჩენის გარეშე.",
    enText: "Direct finder contact without revealing your private number.",
  },
  {
    number: "02",
    icon: "location",
    ka: "ლოკაციის გაზიარება",
    en: "Location Sharing",
    kaText: "მპოვნელმა ერთი ღილაკით შეიძლება გაგიზიაროთ მიმდინარე მდებარეობა.",
    enText: "The finder can share the current location in one tap.",
  },
  {
    number: "03",
    icon: "reward",
    ka: "მპოვნელის ჯილდო",
    en: "Finder Reward",
    kaText: "სურვილის შემთხვევაში შესთავაზეთ ჯილდო უსაფრთხო დაბრუნებისთვის.",
    enText: "Optionally offer a reward for a safe return.",
  },
  {
    number: "04",
    icon: "shield",
    ka: "Privacy Control",
    en: "Privacy Control",
    kaText: "თქვენ განსაზღვრავთ ზუსტად რა ინფორმაცია გამოჩნდება.",
    enText: "You decide exactly what information becomes visible.",
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

    const { data } = supabase.auth.onAuthStateChange(() => {
      void checkSession();
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <main className="page">
      {/* ========================= HEADER ========================= */}

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
            <a href="/admin" className="adminLink">
              <AdminIcon />
              <span>Admin</span>
            </a>

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

      {/* ========================= HERO ========================= */}

      <section className="hero">
        <div className="heroGlow glowOne" />
        <div className="heroGlow glowTwo" />

        <div className="heroInner">
          <div className="heroCopy">
            <div className="heroEyebrow">
              <span />
              SMART LOST &amp; FOUND
            </div>

            <h1>
              {ka ? (
                <>
                  იპოვეს.
                  <br />
                  დაასკანერეს.
                  <br />
                  <em>დაგიკავშირდნენ.</em>
                </>
              ) : (
                <>
                  Found.
                  <br />
                  Scanned.
                  <br />
                  <em>Connected.</em>
                </>
              )}
            </h1>

            <p>
              {ka
                ? "QR RETURN ქმნის სწრაფ და უსაფრთხო გზას მპოვნელსა და მფლობელს შორის — აპის ჩამოტვირთვის გარეშე."
                : "QR RETURN creates a fast, secure connection between finder and owner — with no app required."}
            </p>

            <div className="heroActions">
              <a
                className="primaryCta"
                href={isLoggedIn ? "/account" : "/account/register"}
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

              <a href="#stories" className="secondaryCta">
                {ka ? "ნახე როგორ მუშაობს" : "See it in action"}
              </a>
            </div>

            {/* EMERGENCY SIGNAL */}

            <div className="emergencySignal">
              <div className="signalCross">+</div>

              <div className="signalCopy">
                <span>QR RETURN • EMERGENCY ID</span>

                <strong>
                  {ka
                    ? "როცა სიტყვების თქმა შეუძლებელია, ინფორმაცია მაინც ხელმისაწვდომია."
                    : "When you cannot speak, essential information can still speak for you."}
                </strong>

                <small>
                  SOS READY · MEDICAL INFO · EMERGENCY CONTACT · NO APP
                </small>
              </div>

              <a href="#emergency">
                <ArrowIcon />
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
                  <div className="miniBrand">
                    <QrIcon />
                  </div>

                  <div>
                    <span>QR RETURN</span>
                    <strong>FINDER PROFILE</strong>
                  </div>

                  <b>
                    <i />
                    LIVE
                  </b>
                </div>

                <div className="petProfile">
                  <div className="petPhoto">
                    <img
                      src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=500&q=90"
                      alt="Dog"
                    />

                    <div className="lostBadge">
                      {ka ? "დაკარგულია" : "LOST"}
                    </div>
                  </div>

                  <span>{ka ? "გამარჯობა, მე ვარ" : "HELLO, I AM"}</span>
                  <strong>Toby</strong>

                  <p>
                    {ka
                      ? "დავიკარგე. გთხოვთ დაუკავშირდეთ ჩემს პატრონს."
                      : "I am lost. Please contact my owner."}
                  </p>
                </div>

                <div className="finderActions">
                  <button type="button">
                    <ChatIcon />
                    <span>Live Chat</span>
                  </button>

                  <button type="button">
                    <LocationIcon />
                    <span>{ka ? "ლოკაცია" : "Location"}</span>
                  </button>
                </div>

                <div className="privacyRow">
                  <ShieldIcon />

                  <div>
                    <strong>
                      {ka
                        ? "პირადი მონაცემები დაცულია"
                        : "Personal information protected"}
                    </strong>

                    <span>
                      {ka
                        ? "მხოლოდ ნებადართული ინფორმაცია ჩანს"
                        : "Only approved information is shown"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="floatingChat">
              <div>
                <ChatIcon />
              </div>

              <section>
                <span>LIVE CHAT</span>
                <strong>
                  {ka
                    ? "მპოვნელმა მოგწერათ"
                    : "Finder sent a message"}
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

      {/* ========================= STORIES ========================= */}

      <section id="stories" className="storiesSection">
        <div className="shell">
          <div className="storyHeader">
            <div>
              <span className="eyebrow">QR RETURN IN REAL LIFE</span>

              <h2>
                {ka
                  ? "ერთი პატარა QR. ექვსი ყოველდღიური სცენარი."
                  : "One small QR. Six everyday situations."}
              </h2>
            </div>

            <p>
              {ka
                ? "QR RETURN მხოლოდ ნივთზე მიმაგრებული კოდი არ არის. ის არის გზა — პოვნიდან თქვენთან დაკავშირებამდე."
                : "QR RETURN is more than a code attached to something. It creates a path from finding it to reaching you."}
            </p>
          </div>

          <div className="storyGrid">
            {stories.map((story) => (
              <article
                key={story.id}
                className={`storyCard ${story.large ? "storyLarge" : ""}`}
              >
                <img
                  src={story.image}
                  alt={ka ? story.ka : story.en}
                />

                <div className="storyGradient" />

                {/* scan phone overlay */}
                <div className="scanPhone">
                  <div className="scanPhoneTop" />

                  <div className="scanTarget">
                    <span className="sc1" />
                    <span className="sc2" />
                    <span className="sc3" />
                    <span className="sc4" />

                    <MiniQr />
                  </div>

                  <small>SCAN</small>
                </div>

                <div className="tagOnProduct">
                  <MiniQr />
                </div>

                <div className="storyContent">
                  <div className="storyType">
                    <span>QR RETURN</span>
                    <strong>{ka ? story.ka : story.en}</strong>
                  </div>

                  <p>{ka ? story.kaAction : story.enAction}</p>

                  <div className="storyResult">
                    <i />

                    <span>
                      {ka ? story.kaResult : story.enResult}
                    </span>
                  </div>
                </div>
              </article>
            ))}

            {/* EMERGENCY STORY */}

            <article id="emergency" className="emergencyStory">
              <div className="emergencyPhoto">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1500&q=88"
                  alt="Emergency medical support"
                />

                <div className="emergencyPhotoShade" />

                <div className="emergencyWristTag">
                  <span>+</span>
                  <MiniQr />
                </div>

                <div className="emergencyScanner">
                  <div className="scannerTop" />

                  <div className="scannerUi">
                    <span className="sos">SOS READY</span>

                    <strong>EMERGENCY ID</strong>

                    <div className="scannerLine">
                      <HeartIcon />
                      <span>Medical Info</span>
                    </div>

                    <div className="scannerLine">
                      <UserIcon />
                      <span>Emergency Contact</span>
                    </div>

                    <div className="scannerLine">
                      <ShieldIcon />
                      <span>Privacy Controlled</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="emergencyStoryCopy">
                <div className="emergencyHeading">
                  <div className="bigCross">+</div>

                  <div>
                    <span>QR RETURN</span>
                    <strong>EMERGENCY ID</strong>
                  </div>
                </div>

                <h2>
                  {ka
                    ? "როცა დახმარება გჭირდება, მნიშვნელოვანი ინფორმაცია არ უნდა დაიკარგოს."
                    : "When help is needed, essential information should not be lost."}
                </h2>

                <p>
                  {ka
                    ? "ერთი სკანი შეიძლება საკმარისი იყოს, რომ დამხმარემ ნახოს თქვენ მიერ ნებადართული საგანგებო ინფორმაცია — ვის დაუკავშირდეს, რა უნდა იცოდეს და როგორ დაგეხმაროთ."
                    : "One scan can give a helper access to the emergency information you choose to share — who to contact, what they need to know and how they can help."}
                </p>

                <div className="emergencySignals">
                  <span>SOS READY</span>
                  <span>EMERGENCY CONTACT</span>
                  <span>MEDICAL INFO</span>
                  <span>NO APP</span>
                  <span>PRIVACY CONTROL</span>
                </div>

                <a
                  href={isLoggedIn ? "/account" : "/account/register"}
                  className="emergencyButton"
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
            </article>
          </div>
        </div>
      </section>

      {/* ========================= FLOW ========================= */}

      <section className="flowSection">
        <div className="shell">
          <div className="flowIntro">
            <span className="eyebrow">FIND → SCAN → CONNECT → RETURN</span>

            <h2>
              {ka
                ? "დაბრუნების გზა ოთხ ნაბიჯში."
                : "A clear return path in four steps."}
            </h2>
          </div>

          <div className="flow">
            <div className="flowStep">
              <span>01</span>

              <div>
                <SearchIcon />
              </div>

              <strong>{ka ? "იპოვეს" : "Found"}</strong>
              <p>
                {ka
                  ? "მპოვნელი ხედავს QR RETURN კოდს."
                  : "The finder notices the QR RETURN tag."}
              </p>
            </div>

            <div className="flowLine" />

            <div className="flowStep">
              <span>02</span>

              <div>
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

              <div>
                <ChatIcon />
              </div>

              <strong>{ka ? "დაგიკავშირდნენ" : "Connected"}</strong>
              <p>
                {ka
                  ? "Live Chat, ზარი ან თქვენ მიერ არჩეული მეთოდი."
                  : "Live Chat, call or another option you enable."}
              </p>
            </div>

            <div className="flowLine" />

            <div className="flowStep">
              <span>04</span>

              <div>
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

      {/* ========================= BENEFITS ========================= */}

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
                    {benefit.icon === "chat" && <ChatIcon />}
                    {benefit.icon === "location" && <LocationIcon />}
                    {benefit.icon === "reward" && <RewardIcon />}
                    {benefit.icon === "shield" && <ShieldIcon />}
                  </div>
                </div>

                <h3>{ka ? benefit.ka : benefit.en}</h3>

                <p>{ka ? benefit.kaText : benefit.enText}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= ACCOUNT CTA ========================= */}

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
                  : "Dog, cat, keys, wallet, luggage, bag and Emergency ID — create and manage them from one account."}
              </p>
            </div>

            <a
              href={isLoggedIn ? "/account" : "/account/register"}
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

      {/* ========================= CONTACT ========================= */}

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

      {/* ========================= LIVE CHAT ========================= */}

      <SupportLauncher language={language} />

      {/* ========================= FOOTER ========================= */}

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
            <a href="#stories">
              {ka ? "გამოყენება" : "Use cases"}
            </a>

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
          background: #f6f6f3;
        }

        .page {
          overflow: hidden;
          color: #13171f;
          background: #f6f6f3;
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
          width: calc(100% - 52px);
          max-width: 1280px;
          min-height: 80px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border-bottom: 1px solid rgba(24, 29, 38, 0.09);
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
          background: #161c26;
          color: #fff;
        }

        .brandMark :global(svg) {
          width: 22px;
        }

        .brandCopy strong,
        .brandCopy span {
          display: block;
        }

        .brandCopy strong {
          color: #161c26;
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
          font-size: 10px;
          font-weight: 820;
          text-decoration: none;
          white-space: nowrap;
        }

        .adminLink {
          color: #4c5564;
          border: 1px solid #dcdfe4;
          background: rgba(255, 255, 255, 0.55);
        }

        .adminLink :global(svg),
        .accountButton :global(svg) {
          width: 13px;
        }

        .accountButton {
          color: white;
          background: #161c26;
        }

        .loginLink {
          color: #4d5663;
          border: 1px solid #dcdfe4;
        }

        .language {
          gap: 7px;
        }

        .language span {
          width: 1px;
          height: 12px;
          background: #d3d6db;
        }

        .language button {
          padding: 0;
          border: 0;
          background: transparent;
          color: #9ca2ab;
          font-size: 8px;
          font-weight: 900;
          cursor: pointer;
        }

        .language button.active {
          color: #e5484d;
        }

        /* COMMON */

        .shell {
          width: calc(100% - 52px);
          max-width: 1180px;
          margin: auto;
        }

        .eyebrow {
          color: #e5484d;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        /* HERO */

        .hero {
          min-height: 670px;
          position: relative;
          background:
            linear-gradient(
              118deg,
              #f7f6f2 0%,
              #f1f2f0 50%,
              #e9ebed 100%
            );
        }

        .heroInner {
          width: calc(100% - 52px);
          max-width: 1240px;
          min-height: 670px;
          margin: auto;
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 0.92fr 1.08fr;
          align-items: center;
          gap: 75px;
        }

        .heroGlow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .glowOne {
          width: 520px;
          height: 520px;
          right: -170px;
          top: -200px;
          background: radial-gradient(
            circle,
            rgba(50, 66, 91, 0.16),
            transparent 69%
          );
        }

        .glowTwo {
          width: 350px;
          height: 350px;
          left: -200px;
          bottom: -180px;
          background: radial-gradient(
            circle,
            rgba(229, 72, 77, 0.08),
            transparent 70%
          );
        }

        .heroCopy {
          max-width: 540px;
        }

        .heroEyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #727b87;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .heroEyebrow > span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #e5484d;
        }

        .heroCopy h1 {
          margin: 20px 0 0;
          color: #141922;
          font-size: clamp(39px, 4.5vw, 55px);
          line-height: 1.04;
          letter-spacing: -2.8px;
          font-weight: 700;
        }

        .heroCopy h1 em {
          color: #e5484d;
          font-style: normal;
        }

        .heroCopy > p {
          max-width: 490px;
          margin: 20px 0 0;
          color: #69717c;
          font-size: 13px;
          line-height: 1.75;
        }

        .heroActions {
          margin-top: 27px;
          display: flex;
          gap: 9px;
        }

        .primaryCta,
        .secondaryCta {
          min-height: 45px;
          padding: 0 16px;
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
          background: #161c26;
        }

        .primaryCta :global(svg) {
          width: 12px;
        }

        .secondaryCta {
          color: #4e5764;
          border: 1px solid #dadee3;
          background: rgba(255, 255, 255, 0.55);
        }

        /* emergency signal in hero */

        .emergencySignal {
          margin-top: 34px;
          padding: 13px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 11px;
          border: 1px solid #edd7d9;
          border-radius: 15px;
          background: rgba(255, 250, 250, 0.83);
          box-shadow: 0 10px 30px rgba(78, 41, 45, 0.045);
        }

        .signalCross {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          color: white;
          background: #e5484d;
          font-size: 26px;
        }

        .signalCopy span,
        .signalCopy strong,
        .signalCopy small {
          display: block;
        }

        .signalCopy span {
          color: #e5484d;
          font-size: 5.5px;
          font-weight: 900;
          letter-spacing: 1.2px;
        }

        .signalCopy strong {
          margin-top: 4px;
          color: #313a46;
          font-size: 9.5px;
          line-height: 1.4;
        }

        .signalCopy small {
          margin-top: 4px;
          color: #969ca5;
          font-size: 5.5px;
          letter-spacing: 0.5px;
        }

        .emergencySignal > a {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          color: #e5484d;
          background: #fff;
        }

        .emergencySignal > a :global(svg) {
          width: 12px;
        }

        /* PHONE */

        .phoneStage {
          min-height: 570px;
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
            rgba(67, 82, 105, 0.18),
            rgba(67, 82, 105, 0.035) 48%,
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
          background: linear-gradient(140deg, #111721, #05080c);
          box-shadow: 0 40px 90px rgba(18, 26, 37, 0.24);
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
          background: #060a0f;
          transform: translateX(-50%);
        }

        .phoneScreen {
          height: 100%;
          padding: 34px 17px 18px;
          border-radius: 35px;
          background: linear-gradient(180deg, #ffffff, #f5f7fa);
        }

        .phoneBrand {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 8px;
        }

        .miniBrand {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          color: white;
          background: #161c26;
        }

        .miniBrand :global(svg) {
          width: 16px;
        }

        .phoneBrand span,
        .phoneBrand strong {
          display: block;
        }

        .phoneBrand span {
          color: #e5484d;
          font-size: 5.5px;
          font-weight: 900;
          letter-spacing: 0.8px;
        }

        .phoneBrand strong {
          margin-top: 2px;
          color: #3c4654;
          font-size: 7px;
        }

        .phoneBrand > b {
          padding: 5px 6px;
          display: flex;
          align-items: center;
          gap: 4px;
          border-radius: 999px;
          color: #157347;
          background: #eaf9ef;
          font-size: 5px;
          letter-spacing: 0.6px;
        }

        .phoneBrand > b i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #24a56a;
        }

        .petProfile {
          margin-top: 24px;
          padding: 13px;
          text-align: center;
          border: 1px solid #e5e9ee;
          border-radius: 17px;
          background: white;
        }

        .petPhoto {
          height: 150px;
          position: relative;
          overflow: hidden;
          border-radius: 13px;
        }

        .petPhoto img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .lostBadge {
          position: absolute;
          top: 9px;
          right: 9px;
          padding: 5px 7px;
          border-radius: 999px;
          color: white;
          background: #e5484d;
          font-size: 5px;
          font-weight: 900;
        }

        .petProfile > span {
          display: block;
          margin-top: 12px;
          color: #9aa1aa;
          font-size: 5.5px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .petProfile > strong {
          display: block;
          margin-top: 3px;
          color: #18202b;
          font-size: 18px;
        }

        .petProfile > p {
          margin: 5px auto 0;
          max-width: 190px;
          color: #767f8b;
          font-size: 6.5px;
          line-height: 1.5;
        }

        .finderActions {
          margin-top: 10px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
        }

        .finderActions button {
          min-height: 49px;
          padding: 8px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          border: 1px solid #e1e5ea;
          border-radius: 12px;
          color: #535e6c;
          background: white;
          font-size: 6px;
          font-weight: 800;
        }

        .finderActions button:first-child {
          color: white;
          background: #161c26;
          border-color: #161c26;
        }

        .finderActions :global(svg) {
          width: 14px;
        }

        .privacyRow {
          margin-top: 9px;
          padding: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: 11px;
          background: #eef1f4;
        }

        .privacyRow :global(svg) {
          width: 15px;
          color: #e5484d;
        }

        .privacyRow strong,
        .privacyRow span {
          display: block;
        }

        .privacyRow strong {
          color: #424d5a;
          font-size: 6.5px;
        }

        .privacyRow span {
          margin-top: 2px;
          color: #9097a1;
          font-size: 5px;
        }

        .floatingChat,
        .floatingLocation {
          position: absolute;
          z-index: 5;
          display: flex;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.75);
          background: rgba(255, 255, 255, 0.91);
          box-shadow: 0 18px 45px rgba(33, 42, 55, 0.13);
          backdrop-filter: blur(18px);
        }

        .floatingChat {
          width: 205px;
          left: -28px;
          bottom: 76px;
          padding: 11px;
          gap: 9px;
          border-radius: 15px;
        }

        .floatingChat > div {
          width: 37px;
          height: 37px;
          flex: 0 0 37px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          color: #e5484d;
          background: #fff0f0;
        }

        .floatingChat :global(svg) {
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
          color: #989fa9;
          font-size: 5px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .floatingChat strong,
        .floatingLocation strong {
          margin-top: 3px;
          color: #37414e;
          font-size: 8px;
        }

        .floatingChat > i {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #24a56a;
        }

        .floatingLocation {
          right: -7px;
          top: 86px;
          padding: 11px;
          gap: 8px;
          border-radius: 13px;
        }

        .floatingLocation :global(svg) {
          width: 20px;
          color: #161c26;
        }

        /* STORY SECTION */

        .storiesSection {
          padding: 100px 0;
          background: #fafaf8;
        }

        .storyHeader {
          display: grid;
          grid-template-columns: 1fr 0.55fr;
          align-items: end;
          gap: 75px;
        }

        .storyHeader h2,
        .flowIntro h2,
        .accountCopy h2 {
          margin: 11px 0 0;
          color: #151b24;
          font-size: clamp(34px, 4.4vw, 49px);
          line-height: 1.05;
          letter-spacing: -2.5px;
          font-weight: 700;
        }

        .storyHeader > p {
          margin: 0;
          color: #707984;
          font-size: 12px;
          line-height: 1.72;
        }

        .storyGrid {
          margin-top: 45px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: 360px;
          gap: 12px;
        }

        .storyCard {
          position: relative;
          overflow: hidden;
          border-radius: 22px;
          background: #222831;
        }

        .storyLarge {
          grid-column: span 2;
        }

        .storyCard > img {
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .storyCard:hover > img {
          transform: scale(1.035);
        }

        .storyGradient {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              180deg,
              rgba(10, 14, 20, 0.03) 20%,
              rgba(10, 14, 20, 0.12) 47%,
              rgba(7, 10, 15, 0.87) 100%
            );
        }

        .tagOnProduct {
          width: 48px;
          height: 48px;
          position: absolute;
          top: 20px;
          left: 20px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.94);
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.14);
        }

        /* faux finder phone scanning product */

        .scanPhone {
          width: 69px;
          height: 116px;
          padding: 7px;
          position: absolute;
          top: 24px;
          right: 22px;
          border-radius: 15px;
          background: #131820;
          transform: rotate(7deg);
          box-shadow: 0 13px 30px rgba(0, 0, 0, 0.25);
        }

        .scanPhoneTop {
          width: 20px;
          height: 4px;
          margin: 0 auto 12px;
          border-radius: 99px;
          background: #343b45;
        }

        .scanTarget {
          height: 70px;
          position: relative;
          display: grid;
          place-items: center;
          border-radius: 8px;
          background: #f7f7f7;
        }

        .scanTarget > span {
          width: 10px;
          height: 10px;
          position: absolute;
        }

        .sc1 {
          top: 5px;
          left: 5px;
          border-top: 1.5px solid #e5484d;
          border-left: 1.5px solid #e5484d;
        }

        .sc2 {
          top: 5px;
          right: 5px;
          border-top: 1.5px solid #e5484d;
          border-right: 1.5px solid #e5484d;
        }

        .sc3 {
          left: 5px;
          bottom: 5px;
          border-left: 1.5px solid #e5484d;
          border-bottom: 1.5px solid #e5484d;
        }

        .sc4 {
          right: 5px;
          bottom: 5px;
          border-right: 1.5px solid #e5484d;
          border-bottom: 1.5px solid #e5484d;
        }

        .scanPhone small {
          display: block;
          margin-top: 7px;
          color: #aeb4bc;
          text-align: center;
          font-size: 4.5px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .storyContent {
          position: absolute;
          left: 22px;
          right: 22px;
          bottom: 22px;
        }

        .storyType span,
        .storyType strong {
          display: block;
        }

        .storyType span {
          color: #e1e4e8;
          font-size: 5px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .storyType strong {
          margin-top: 3px;
          color: white;
          font-size: 21px;
          letter-spacing: -0.6px;
        }

        .storyContent > p {
          max-width: 420px;
          margin: 8px 0 0;
          color: #d3d7dc;
          font-size: 9px;
          line-height: 1.55;
        }

        .storyResult {
          width: fit-content;
          margin-top: 12px;
          padding: 7px 9px;
          display: flex;
          align-items: center;
          gap: 6px;
          border-radius: 999px;
          color: white;
          background: rgba(255, 255, 255, 0.13);
          backdrop-filter: blur(10px);
          font-size: 7px;
          font-weight: 800;
        }

        .storyResult i {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #41cf8b;
        }

        /* EMERGENCY STORY */

        .emergencyStory {
          min-height: 500px;
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: 1.06fr 0.94fr;
          overflow: hidden;
          border: 1px solid #ead5d7;
          border-radius: 26px;
          background: #fff;
        }

        .emergencyPhoto {
          min-height: 500px;
          position: relative;
          overflow: hidden;
        }

        .emergencyPhoto > img {
          width: 100%;
          height: 100%;
          position: absolute;
          object-fit: cover;
        }

        .emergencyPhotoShade {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              120deg,
              rgba(14, 18, 25, 0.06),
              rgba(14, 18, 25, 0.16)
            );
        }

        .emergencyWristTag {
          width: 115px;
          min-height: 48px;
          position: absolute;
          left: 28px;
          top: 29px;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.94);
          box-shadow: 0 13px 30px rgba(0, 0, 0, 0.15);
        }

        .emergencyWristTag > span {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          color: white;
          background: #e5484d;
          font-size: 20px;
        }

        .emergencyScanner {
          width: 180px;
          min-height: 285px;
          padding: 8px;
          position: absolute;
          right: 30px;
          bottom: 28px;
          border-radius: 25px;
          background: #10151d;
          transform: rotate(4deg);
          box-shadow: 0 24px 55px rgba(0, 0, 0, 0.26);
        }

        .scannerTop {
          width: 45px;
          height: 8px;
          margin: 3px auto 14px;
          border-radius: 99px;
          background: #303741;
        }

        .scannerUi {
          height: 245px;
          padding: 19px 14px;
          border-radius: 19px;
          background: #f9fafb;
        }

        .scannerUi .sos {
          display: inline-flex;
          padding: 5px 7px;
          border-radius: 999px;
          color: white;
          background: #e5484d;
          font-size: 5px;
          font-weight: 900;
          letter-spacing: 0.8px;
        }

        .scannerUi > strong {
          display: block;
          margin: 14px 0 15px;
          color: #1d2632;
          font-size: 12px;
        }

        .scannerLine {
          min-height: 46px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-top: 1px solid #e7eaee;
          color: #505b69;
          font-size: 7px;
          font-weight: 750;
        }

        .scannerLine :global(svg) {
          width: 14px;
          color: #e5484d;
        }

        .emergencyStoryCopy {
          padding: 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .emergencyHeading {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .bigCross {
          width: 45px;
          height: 45px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          color: white;
          background: #e5484d;
          font-size: 27px;
        }

        .emergencyHeading span,
        .emergencyHeading strong {
          display: block;
        }

        .emergencyHeading span {
          color: #e5484d;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1.3px;
        }

        .emergencyHeading strong {
          margin-top: 3px;
          color: #282f39;
          font-size: 13px;
        }

        .emergencyStoryCopy h2 {
          margin: 24px 0 0;
          color: #161c25;
          font-size: clamp(30px, 3.5vw, 42px);
          line-height: 1.08;
          letter-spacing: -2px;
          font-weight: 700;
        }

        .emergencyStoryCopy > p {
          margin: 17px 0 0;
          color: #6d7580;
          font-size: 11px;
          line-height: 1.72;
        }

        .emergencySignals {
          margin-top: 24px;
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .emergencySignals span {
          padding: 7px 9px;
          border: 1px solid #efd7da;
          border-radius: 999px;
          color: #c7333c;
          background: #fff7f7;
          font-size: 5.5px;
          font-weight: 900;
          letter-spacing: 0.7px;
        }

        .emergencyButton {
          width: fit-content;
          min-height: 43px;
          margin-top: 25px;
          padding: 0 15px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 10px;
          color: white;
          background: #e5484d;
          font-size: 8.5px;
          font-weight: 850;
          text-decoration: none;
        }

        .emergencyButton :global(svg) {
          width: 12px;
        }

        /* FLOW */

        .flowSection {
          padding: 95px 0;
          background: #f0f0ed;
        }

        .flowIntro {
          max-width: 700px;
        }

        .flow {
          margin-top: 47px;
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
          align-items: start;
        }

        .flowStep > span {
          color: #afb4bb;
          font-size: 7px;
          font-weight: 900;
        }

        .flowStep > div {
          width: 47px;
          height: 47px;
          margin-top: 14px;
          display: grid;
          place-items: center;
          border: 1px solid #dcdee1;
          border-radius: 13px;
          color: #161c26;
          background: #fafaf8;
        }

        .flowStep :global(svg) {
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
          color: #7a828d;
          font-size: 8.5px;
          line-height: 1.6;
        }

        .flowLine {
          width: 55px;
          height: 1px;
          margin: 36px 17px 0;
          background: #d5d8dc;
        }

        /* BENEFITS */

        .benefitsSection {
          padding: 95px 0;
          color: white;
          background: #151b24;
        }

        .benefitsHeader > span {
          color: #e78a8e;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1.8px;
        }

        .benefitsHeader h2 {
          max-width: 760px;
          margin: 11px 0 0;
          color: white;
          font-size: clamp(34px, 4.2vw, 47px);
          line-height: 1.05;
          letter-spacing: -2.3px;
          font-weight: 680;
        }

        .benefitsGrid {
          margin-top: 43px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .benefitsGrid article {
          min-height: 205px;
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
          color: #626c79;
          font-size: 7px;
          font-weight: 900;
        }

        .benefitTop > div {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          color: #e78a8e;
          background: rgba(255, 255, 255, 0.06);
        }

        .benefitTop :global(svg) {
          width: 15px;
        }

        .benefitsGrid h3 {
          margin: 35px 0 0;
          color: white;
          font-size: 12px;
        }

        .benefitsGrid p {
          margin: 8px 0 0;
          color: #9099a6;
          font-size: 9px;
          line-height: 1.65;
        }

        /* ACCOUNT */

        .accountSection {
          padding: 75px 0;
          background: #fafaf8;
        }

        .accountPanel {
          min-height: 185px;
          padding: 30px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 22px;
          border: 1px solid #e0e2e5;
          border-radius: 22px;
          background: #fff;
        }

        .accountIcon {
          width: 60px;
          height: 60px;
          display: grid;
          place-items: center;
          border-radius: 17px;
          color: #161c26;
          background: #eef0f2;
        }

        .accountIcon :global(svg) {
          width: 25px;
        }

        .accountCopy span {
          color: #e5484d;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        .accountCopy h2 {
          font-size: clamp(28px, 3.5vw, 40px);
        }

        .accountCopy p {
          max-width: 680px;
          margin: 10px 0 0;
          color: #747c87;
          font-size: 10px;
          line-height: 1.65;
        }

        .accountPanel > a {
          min-height: 43px;
          padding: 0 15px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border-radius: 10px;
          color: white;
          background: #161c26;
          font-size: 8.5px;
          font-weight: 850;
          text-decoration: none;
        }

        .accountPanel > a :global(svg) {
          width: 12px;
        }

        /* CONTACT */

        .contactSection {
          padding: 75px 0;
          background: #eeeeeb;
        }

        .contactInner {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 50px;
        }

        .contactInner h2 {
          margin: 10px 0 8px;
          color: #161c25;
          font-size: 36px;
          letter-spacing: -1.7px;
        }

        .contactInner p {
          max-width: 620px;
          margin: 0;
          color: #717984;
          font-size: 10px;
          line-height: 1.7;
        }

        .contactInner > a {
          min-height: 42px;
          padding: 0 15px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border-radius: 10px;
          color: white;
          background: #161c26;
          font-size: 8.5px;
          font-weight: 850;
          text-decoration: none;
        }

        .contactInner > a :global(svg) {
          width: 12px;
        }

        /* FOOTER */

        .footer {
          color: #fff;
          background: #10151c;
        }

        .footerInner {
          max-width: 1180px;
          min-height: 135px;
          margin: auto;
          padding: 35px 26px;
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
          background: #e5484d;
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
          color: #6f7987;
          font-size: 5px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .footerLinks {
          display: flex;
          gap: 23px;
          flex-wrap: wrap;
        }

        .footerLinks a,
        .footerLinks span {
          color: #838c98;
          font-size: 8px;
          text-decoration: none;
        }

        .copyright {
          color: #596471;
          font-size: 7px;
        }

        /* TABLET */

        @media (max-width: 980px) {
          .heroInner {
            grid-template-columns: 1fr;
            padding: 65px 0 80px;
          }

          .heroCopy {
            max-width: 650px;
          }

          .storyHeader {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .storyGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .storyLarge {
            grid-column: span 1;
          }

          .emergencyStory {
            grid-template-columns: 1fr;
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
            align-items: flex-start;
            flex-direction: column;
          }
        }

        /* MOBILE */

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
          .shell {
            width: calc(100% - 28px);
          }

          .hero {
            min-height: unset;
          }

          .heroInner {
            min-height: unset;
            padding: 50px 0 70px;
          }

          .heroCopy h1 {
            font-size: 39px;
            letter-spacing: -2.1px;
          }

          .heroActions {
            align-items: stretch;
            flex-direction: column;
          }

          .primaryCta,
          .secondaryCta {
            width: 100%;
          }

          .emergencySignal {
            grid-template-columns: auto 1fr;
          }

          .emergencySignal > a {
            display: none;
          }

          .phoneStage {
            min-height: 530px;
          }

          .phone {
            width: 245px;
            height: 490px;
          }

          .floatingChat {
            width: 190px;
            left: -4px;
            bottom: 45px;
          }

          .floatingLocation {
            right: -5px;
            top: 64px;
          }

          .storiesSection,
          .flowSection,
          .benefitsSection {
            padding: 75px 0;
          }

          .storyHeader h2,
          .flowIntro h2,
          .accountCopy h2 {
            font-size: 34px;
            letter-spacing: -2px;
          }

          .storyGrid {
            grid-template-columns: 1fr;
            grid-auto-rows: 390px;
          }

          .emergencyStory {
            min-height: unset;
          }

          .emergencyPhoto {
            min-height: 430px;
          }

          .emergencyScanner {
            width: 155px;
            min-height: 250px;
            right: 17px;
          }

          .scannerUi {
            height: 210px;
          }

          .emergencyStoryCopy {
            padding: 30px 22px;
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
            padding: 24px 20px;
          }

          .contactSection {
            padding: 60px 0;
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

/* ========================= ICONS ========================= */

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

function MiniQr() {
  const dark = [
    0, 1, 2, 4, 6, 7, 8, 10, 12, 14, 15, 17, 18, 20, 21, 22, 24,
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
            background: dark.includes(index) ? "#161c26" : "#dce0e4",
          }}
        />
      ))}
    </div>
  );
}
