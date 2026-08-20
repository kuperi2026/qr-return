"use client";

import Link from "next/link";
import { useState } from "react";

type Lang = "ka" | "en";

const categories = [
  { number: "01", icon: "🐕", ka: "ძაღლი", en: "Dog", href: "/register?type=dog" },
  { number: "02", icon: "🐈", ka: "კატა", en: "Cat", href: "/register?type=cat" },
  { number: "03", icon: "🔑", ka: "გასაღები", en: "Keys", href: "/register?type=keys" },
  { number: "04", icon: "👛", ka: "საფულე", en: "Wallet", href: "/register?type=wallet" },
  { number: "05", icon: "🧳", ka: "ჩემოდანი", en: "Suitcase", href: "/register?type=suitcase" },
  { number: "06", icon: "🎒", ka: "ჩანთა", en: "Bag", href: "/register?type=bag" },
];

const features = [
  {
    number: "01",
    icon: "💬",
    titleKa: "Live Chat",
    titleEn: "Live Chat",
    textKa: "მპოვნელი და მფლობელი ერთმანეთს პირდაპირ QR RETURN-ის დაცულ ჩათში უკავშირდებიან.",
    textEn: "Finder and owner communicate directly through QR RETURN's protected Live Chat.",
  },
  {
    number: "02",
    icon: "📍",
    titleKa: "ლოკაციის გაზიარება",
    titleEn: "Location Sharing",
    textKa: "მპოვნელს შეუძლია ერთი მოქმედებით გაგიზიაროთ ნივთის ან ცხოველის მდებარეობა.",
    textEn: "The finder can share the location of your item or pet with a single tap.",
  },
  {
    number: "03",
    icon: "🎁",
    titleKa: "მპოვნელის ჯილდო",
    titleEn: "Finder Reward",
    textKa: "სურვილის შემთხვევაში პროფილზე მიუთითეთ ჯილდო და გაზარდეთ დაბრუნების მოტივაცია.",
    textEn: "Optionally offer a finder reward to encourage a fast and safe return.",
  },
  {
    number: "04",
    icon: "🛡️",
    titleKa: "პირადი მონაცემების კონტროლი",
    titleEn: "Privacy Controls",
    textKa: "თქვენ წყვეტთ ზუსტად რომელი ინფორმაცია, ნომერი და დაკავშირების მეთოდი დაინახოს მპოვნელმა.",
    textEn: "You decide exactly what contact details and information the finder can see.",
  },
];

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("ka");
  const ka = lang === "ka";

  return (
    <main className="page">
      {/* HEADER */}
      <header className="header container">
        <Link href="/" className="brand">
          <span className="brandMark">QR</span>
          <span className="brandText">
            <strong>QR RETURN</strong>
            <small>SECURE RETURN SYSTEM</small>
          </span>
        </Link>

        <nav className="nav">
          <a href="#how">{ka ? "როგორ მუშაობს" : "How it works"}</a>
          <a href="#profiles">{ka ? "QR პროფილები" : "QR Profiles"}</a>
          <a href="#emergency">Emergency</a>
          <Link href="/store">{ka ? "მაღაზია" : "Store"}</Link>
        </nav>

        <div className="headerActions">
          <div className="language">
            <button
              type="button"
              className={ka ? "active" : ""}
              onClick={() => setLang("ka")}
            >
              GEO
            </button>
            <button
              type="button"
              className={!ka ? "active" : ""}
              onClick={() => setLang("en")}
            >
              ENG
            </button>
          </div>

          <Link href="/admin" className="admin">Admin</Link>
          <Link href="/login" className="login">{ka ? "შესვლა" : "Login"}</Link>
          <Link href="/register" className="register">{ka ? "რეგისტრაცია" : "Register"}</Link>
        </div>
      </header>

      {/* HERO */}
      <section className="hero container">
        <div className="heroGlow glowOne" />
        <div className="heroGlow glowTwo" />

        <div className="heroContent">
          <div className="heroEyebrow">
            <span className="liveDot" />
            QR RETURN · SMART LOST & FOUND
          </div>

          <h1>
            {ka ? (
              <>
                დაკარგვა არ ნიშნავს
                <br />
                <span className="gradientText">დამშვიდობებას.</span>
              </>
            ) : (
              <>
                Losing it doesn&apos;t mean
                <br />
                <span className="gradientText">saying goodbye.</span>
              </>
            )}
          </h1>

          <p className="heroDescription">
            {ka
              ? "ერთი QR კოდი აკავშირებს მპოვნელს მფლობელთან — Live Chat, ლოკაციის გაზიარება, უსაფრთხო კონტაქტი და პირადი მონაცემების სრული კონტროლი."
              : "One QR code connects finder and owner — with Live Chat, location sharing, secure contact and full privacy control."}
          </p>

          <div className="heroButtons">
            <Link href="/register" className="primaryHero">
              <span className="plus" aria-hidden="true">+</span>
              {ka ? "QR პროფილის შექმნა" : "Create QR Profile"}
              <span className="arrow" aria-hidden="true">→</span>
            </Link>

            <Link href="/store" className="secondaryHero">
              <span aria-hidden="true">◈</span>
              {ka ? "QR-ის შეძენა" : "Buy QR"}
            </Link>
          </div>

          <div className="heroMiniLinks">
            <Link href="/account/messages">
              <span>💬</span> Live Chat
            </Link>
            <Link href="/register?type=emergency" className="emergencyBadge">
              <span>✚</span> Emergency
            </Link>
            <Link href="/my-profiles">
              <span>◎</span> {ka ? "ჩემი პროფილები" : "My Profiles"}
            </Link>
          </div>
        </div>

        <div className="heroVisual">
          <div className="device">
            <div className="deviceTop">
              <span className="miniBrand">QR RETURN</span>
              <span className="connected"><span className="pulseDot" /> LIVE</span>
            </div>

            <div className="profilePreview">
              <div className="animal">🐕</div>
              <span className="found">FOUND PROFILE</span>
              <h3>Toby</h3>
              <p>
                {ka
                  ? "მე დავიკარგე. გთხოვთ დაუკავშირდეთ ჩემს პატრონს."
                  : "I'm lost. Please contact my owner."}
              </p>
              <button type="button" className="chatBtn">💬 Live Chat</button>
              <button type="button" className="locationBtn">
                📍 {ka ? "ლოკაციის გაზიარება" : "Share Location"}
              </button>
            </div>

            <div className="privacyBar">
              <span>🛡️</span>
              <div>
                <strong>Privacy protected</strong>
                <small>Owner controls visibility</small>
              </div>
            </div>
          </div>

          <div className="floatingCard chatCard">
            <span className="floatingIcon">💬</span>
            <div>
              <strong>Live Chat</strong>
              <small>Finder connected</small>
            </div>
          </div>

          <div className="floatingCard locationCard">
            <span className="floatingIcon">📍</span>
            <div>
              <strong>Location</strong>
              <small>Shared securely</small>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="trustBar container">
        <div>
          <strong>01</strong>
          <span>{ka ? "მპოვნელს რეგისტრაცია არ სჭირდება" : "No finder registration required"}</span>
        </div>
        <div>
          <strong>02</strong>
          <span>{ka ? "ერთი სკანირება საკმარისია" : "One scan is enough"}</span>
        </div>
        <div>
          <strong>03</strong>
          <span>{ka ? "კონტაქტს მფლობელი აკონტროლებს" : "Owner controls contact visibility"}</span>
        </div>
        <div>
          <strong>04</strong>
          <span>Live Chat + Location</span>
        </div>
      </section>

      {/* PROFILES */}
      <section className="profiles container" id="profiles">
        <div className="sectionHead">
          <div>
            <span className="sectionEyebrow">01 · QR PROFILES</span>
            <h2>{ka ? "რის დაცვას აპირებთ?" : "What do you want to protect?"}</h2>
            <p>
              {ka
                ? "აირჩიეთ ნივთი ან საყვარელი ცხოველი და შექმენით მისი ინდივიდუალური QR RETURN პროფილი."
                : "Choose a belonging or pet and create its individual QR RETURN profile."}
            </p>
          </div>
          <Link href="/register" className="sectionAction">
            {ka ? "ყველა პროფილის შექმნა" : "Create a Profile"} →
          </Link>
        </div>

        <div className="categoryGrid">
          {categories.map((category) => (
            <Link href={category.href} key={category.number} className="categoryCard">
              <div className="categoryTop">
                <span>{category.number}</span>
                <span className="categoryArrow">↗</span>
              </div>
              <div className="categoryIcon">{category.icon}</div>
              <strong>{ka ? category.ka : category.en}</strong>
              <small>CREATE PROFILE</small>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how container" id="how">
        <div className="howIntro">
          <span className="sectionEyebrow light">02 · HOW IT WORKS</span>
          <h2>{ka ? "ერთი QR. ოთხი მარტივი ნაბიჯი." : "One QR. Four simple steps."}</h2>
          <p>{ka ? "მარტივი პროცესი მფლობელისთვისაც და მპოვნელისთვისაც." : "A simple experience for both owner and finder."}</p>
        </div>

        <div className="howSteps">
          <div className="howStep">
            <span className="stepNumber">01</span>
            <div className="stepIcon">◎</div>
            <h3>{ka ? "შექმენი პროფილი" : "Create Profile"}</h3>
            <p>{ka ? "დაამატე ნივთი ან ცხოველი და აირჩიე რომელი მონაცემები გამოჩნდეს." : "Add your item or pet and choose which information is visible."}</p>
          </div>
          <div className="howStep">
            <span className="stepNumber">02</span>
            <div className="stepIcon">◈</div>
            <h3>{ka ? "მიაბი QR" : "Connect QR"}</h3>
            <p>{ka ? "QR ბრელოკი ან სტიკერი დაუკავშირე კონკრეტულ პროფილს." : "Connect your QR tag or sticker to the selected profile."}</p>
          </div>
          <div className="howStep">
            <span className="stepNumber">03</span>
            <div className="stepIcon">◉</div>
            <h3>{ka ? "მპოვნელი ასკანერებს" : "Finder Scans"}</h3>
            <p>{ka ? "რეგისტრაციის გარეშე მპოვნელი ერთ წამში იხილავს თქვენს მიერ დაშვებულ ინფორმაციას." : "Without registration, the finder instantly sees only the information you allow."}</p>
          </div>
          <div className="howStep">
            <span className="stepNumber">04</span>
            <div className="stepIcon">↗</div>
            <h3>{ka ? "კავშირი და დაბრუნება" : "Connect & Return"}</h3>
            <p>{ka ? "Live Chat, ტელეფონი, WhatsApp ან ლოკაცია — თქვენ ირჩევთ დაკავშირების გზას." : "Live Chat, phone, WhatsApp or location — you choose how the finder can reach you."}</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="featureSection container">
        <div className="sectionHead">
          <div>
            <span className="sectionEyebrow">03 · SMART FEATURES</span>
            <h2>{ka ? "უბრალოდ QR-ზე მეტი." : "More than just a QR code."}</h2>
          </div>
          <Link href="/account/messages" className="sectionAction">
            Live Chat →
          </Link>
        </div>

        <div className="featureGrid">
          {features.map((feature) => (
            <article className="featureCard" key={feature.number}>
              <div className="featureHeader">
                <span className="featureNumber">{feature.number}</span>
                <div className="featureIcon">{feature.icon}</div>
              </div>
              <h3>{ka ? feature.titleKa : feature.titleEn}</h3>
              <p>{ka ? feature.textKa : feature.textEn}</p>
            </article>
          ))}
        </div>
      </section>

      {/* LIVE CHAT */}
      <section className="liveChatSection container">
        <div className="liveChatVisual">
          <div className="chatWindow">
            <div className="chatWindowTop">
              <div>
                <span className="chatAvatar">F</span>
                <span>
                  <strong>Finder</strong>
                  <small>● Online</small>
                </span>
              </div>
              <span className="secureChat">🔒 Secure</span>
            </div>

            <div className="chatMessages">
              <div className="finderBubble">{ka ? "გამარჯობა, თქვენი ნივთი ვიპოვე." : "Hi, I found your item."}</div>
              <div className="ownerBubble">{ka ? "დიდი მადლობა! შეგიძლიათ ლოკაცია გამიზიაროთ?" : "Thank you! Could you share your location?"}</div>
              <div className="locationBubble">📍 {ka ? "ლოკაცია გაზიარებულია" : "Location shared"}</div>
            </div>

            <div className="chatComposer">
              <span>{ka ? "შეტყობინება..." : "Message..."}</span>
              <button type="button" aria-label="Send message">↑</button>
            </div>
          </div>
        </div>

        <div className="liveChatContent">
          <span className="sectionEyebrow">LIVE CHAT</span>
          <h2>{ka ? "მპოვნელთან პირდაპირი კავშირი — თქვენი ნომრის გამჟღავნების გარეშე." : "Talk directly to the finder — without exposing your phone number."}</h2>
          <p>{ka ? "QR RETURN Live Chat გაძლევთ საშუალებას სწრაფად დაუკავშირდეთ მპოვნელს, მიიღოთ ინფორმაცია და შეთანხმდეთ ნივთის დაბრუნებაზე." : "QR RETURN Live Chat lets you communicate quickly, receive updates and arrange a safe return."}</p>

          <div className="liveBenefits">
            <span>✓ {ka ? "მპოვნელს ანგარიში არ სჭირდება" : "No finder account required"}</span>
            <span>✓ {ka ? "პირადი ნომერი შეიძლება დამალული დარჩეს" : "Your phone number can remain private"}</span>
            <span>✓ {ka ? "შეტყობინებების ისტორია" : "Conversation history"}</span>
          </div>

          <Link href="/account/messages" className="darkButton">
            💬 Live Chat <span>→</span>
          </Link>
        </div>
      </section>

      {/* EMERGENCY */}
      <section className="emergency container" id="emergency">
        <div className="emergencyAccent" />
        <div className="emergencyLeft">
          <div className="emergencyIcon">✚</div>
          <div>
            <span className="emergencyLabel">QR RETURN EMERGENCY</span>
            <h2>{ka ? "Emergency ინფორმაცია, როცა ყოველი წამი მნიშვნელოვანია." : "Emergency information when every second matters."}</h2>
            <p>{ka ? "შექმენით Emergency QR პროფილი და განსაზღვრეთ რა აუცილებელი ინფორმაცია უნდა გამოჩნდეს QR-ის სკანირებისას." : "Create an Emergency QR profile and control what essential information appears when the QR is scanned."}</p>
          </div>
        </div>

        <div className="emergencyFeatures">
          <div><span>01</span><strong>Emergency Contact</strong></div>
          <div><span>02</span><strong>{ka ? "აუცილებელი ინფორმაცია" : "Essential Information"}</strong></div>
          <div><span>03</span><strong>{ka ? "სწრაფი QR წვდომა" : "Fast QR Access"}</strong></div>
        </div>

        <Link href="/register?type=emergency" className="emergencyButton">
          {ka ? "Emergency პროფილის შექმნა" : "Create Emergency Profile"} <span>→</span>
        </Link>
      </section>

      {/* STORE */}
      <section className="storeSection container">
        <div className="storeContent">
          <span className="sectionEyebrow light">04 · QR RETURN STORE</span>
          <h2>{ka ? "აირჩიე QR, რომელიც შენს ნივთს შეეფერება." : "Choose the QR that fits what you protect."}</h2>
          <p>{ka ? "QR ბრელოკები და სტიკერები სხვადასხვა დიზაინით. შეარჩიეთ პროდუქტი, რაოდენობა და მართეთ შეკვეთა თქვენი ანგარიშიდან." : "QR tags and stickers in multiple designs. Choose your product and quantity, then manage the order from your account."}</p>
          <Link href="/store" className="storeButton">
            {ka ? "მაღაზიის ნახვა" : "Explore Store"} <span>→</span>
          </Link>
        </div>

        <div className="storeVisual">
          <div className="tag tagOne">
            <span>QR</span>
            <strong>RETURN</strong>
          </div>
          <div className="tag tagTwo">
            <span>QR</span>
          </div>
          <div className="sticker">
            <span>QR</span>
            <small>SCAN TO RETURN</small>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="finalCta container">
        <span>QR RETURN</span>
        <h2>{ka ? "დაიცავი ის, რაც შენთვის მნიშვნელოვანია." : "Protect what matters to you."}</h2>
        <p>{ka ? "შექმენი პირველი QR პროფილი რამდენიმე წუთში." : "Create your first QR profile in just a few minutes."}</p>
        <div>
          <Link href="/register" className="finalPrimary">
            + {ka ? "პროფილის შექმნა" : "Create Profile"}
          </Link>
          <Link href="/store" className="finalSecondary">
            {ka ? "QR-ის შეძენა" : "Buy QR"}
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer container">
        <div className="footerBrand">
          <span className="brandMark">QR</span>
          <div>
            <strong>QR RETURN</strong>
            <p>{ka ? "დაკარგვა არ ნიშნავს დამშვიდობებას." : "Never lose what matters."}</p>
          </div>
        </div>

        <div className="footerColumn">
          <strong>PRODUCT</strong>
          <Link href="/register">Create Profile</Link>
          <Link href="/store">Store</Link>
          <Link href="/register?type=emergency">Emergency</Link>
        </div>

        <div className="footerColumn">
          <strong>ACCOUNT</strong>
          <Link href="/my-profiles">My Profiles</Link>
          <Link href="/account/messages">Live Chat</Link>
          <Link href="/account/notifications">Notifications</Link>
        </div>

        <div className="footerColumn">
          <strong>ADMIN</strong>
          <Link href="/admin">Admin Panel</Link>
          <Link href="/login">Login</Link>
        </div>

        <div className="copyright">© 2026 QR RETURN · Secure Lost & Found System</div>
      </footer>

      {/* STYLES */}
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          overflow-x: hidden;
          color: #0f172a;
          background: #fafcff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding-left: 24px;
          padding-right: 24px;
        }

        /* HEADER */
        .header {
          min-height: 84px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 32px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .brandMark {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          flex: 0 0 42px;
          border-radius: 12px;
          color: white;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
          font-size: 15px;
          font-weight: 900;
        }

        .brandText strong {
          display: block;
          color: #1e293b;
          font-size: 17px;
          font-weight: 900;
          letter-spacing: -0.5px;
        }

        .brandText small {
          display: block;
          margin-top: 1px;
          color: #4f46e5;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 28px;
        }

        .nav a {
          color: #475569;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .nav a:hover {
          color: #2563eb;
        }

        .headerActions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .language {
          padding: 3px;
          display: flex;
          border-radius: 10px;
          background: #f1f5f9;
        }

        .language button {
          min-width: 38px;
          height: 30px;
          border: 0;
          border-radius: 8px;
          color: #64748b;
          background: transparent;
          cursor: pointer;
          font-size: 11px;
          font-weight: 800;
          transition: all 0.2s;
        }

        .language button.active {
          color: #2563eb;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .admin, .login, .register {
          min-height: 38px;
          padding: 0 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
          transition: all 0.2s ease;
        }

        .admin {
          color: #7c3aed;
          border: 1px solid #f3e8ff;
          background: #faf5ff;
        }

        .login {
          color: #334155;
          border: 1px solid #cbd5e1;
          background: white;
        }

        .login:hover {
          background: #f8fafc;
          border-color: #94a3b8;
        }

        .register {
          color: white;
          background: #2563eb;
          border: 1px solid #2563eb;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .register:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        /* HERO */
        .hero {
          min-height: 620px;
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) 440px;
          align-items: center;
          gap: 48px;
          padding-top: 60px;
          padding-bottom: 60px;
        }

        .heroGlow {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
        }

        .glowOne {
          width: 380px;
          height: 380px;
          right: 0;
          top: 40px;
          background: rgba(99, 102, 241, 0.15);
        }

        .glowTwo {
          width: 300px;
          height: 300px;
          left: -80px;
          bottom: 20px;
          background: rgba(37, 99, 235, 0.12);
        }

        .heroContent {
          position: relative;
          z-index: 2;
        }

        .heroEyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border: 1px solid #dbeafe;
          border-radius: 999px;
          color: #1e40af;
          background: #eff6ff;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        .liveDot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
        }

        .hero h1 {
          margin: 20px 0 0;
          color: #0f172a;
          font-size: clamp(40px, 5.2vw, 68px);
          line-height: 1.05;
          letter-spacing: -2.5px;
          font-weight: 900;
        }

        .gradientText {
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .heroDescription {
          max-width: 580px;
          margin: 20px 0 0;
          color: #475569;
          font-size: 16px;
          line-height: 1.65;
        }

        .heroButtons {
          margin-top: 32px;
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }

        .primaryHero, .secondaryHero {
          min-height: 52px;
          padding: 0 26px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-radius: 14px;
          text-decoration: none;
          font-size: 15px;
          font-weight: 800;
          transition: all 0.25s ease;
        }

        .primaryHero {
          color: white;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          box-shadow: 0 12px 30px rgba(37, 99, 235, 0.3);
        }

        .primaryHero:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 36px rgba(37, 99, 235, 0.4);
        }

        .secondaryHero {
          color: #334155;
          border: 1px solid #cbd5e1;
          background: white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
        }

        .secondaryHero:hover {
          border-color: #94a3b8;
          background: #f8fafc;
          transform: translateY(-2px);
        }

        .heroMiniLinks {
          margin-top: 28px;
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }

        .heroMiniLinks a {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
          transition: color 0.2s;
        }

        .heroMiniLinks a:hover {
          color: #2563eb;
        }

        .emergencyBadge {
          color: #ef4444 !important;
        }

        /* HERO VISUAL */
        .heroVisual {
          height: 480px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .device {
          width: 310px;
          position: relative;
          padding: 18px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 32px;
          background: rgba(255, 255, 255, 0.85);
          box-shadow: 0 30px 90px rgba(15, 23, 42, 0.12);
          backdrop-filter: blur(20px);
          transition: transform 0.3s ease;
        }

        .device:hover {
          transform: translateY(-4px);
        }

        .deviceTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 14px;
        }

        .miniBrand {
          color: #2563eb;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.5px;
        }

        .connected {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #10b981;
          font-size: 10px;
          font-weight: 800;
        }

        .pulseDot {
          width: 6px;
          height: 6px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 1.8s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6); }
          70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .profilePreview {
          padding: 24px 18px;
          border-radius: 22px;
          text-align: center;
          background: linear-gradient(150deg, #eff6ff, #faf5ff);
          border: 1px solid rgba(238, 242, 255, 0.8);
        }

        .animal {
          width: 76px;
          height: 76px;
          margin: 0 auto;
          display: grid;
          place-items: center;
          border: 4px solid white;
          border-radius: 50%;
          background: #dbeafe;
          box-shadow: 0 10px 25px rgba(37, 99, 235, 0.15);
          font-size: 38px;
        }

        .found {
          display: block;
          margin-top: 14px;
          color: #6366f1;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.8px;
        }

        .profilePreview h3 {
          margin: 4px 0 0;
          color: #0f172a;
          font-size: 22px;
          font-weight: 900;
        }

        .profilePreview p {
          margin: 6px 0 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.5;
        }

        .chatBtn, .locationBtn {
          width: 100%;
          min-height: 40px;
          margin-top: 14px;
          border: 0;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
        }

        .chatBtn {
          color: white;
          background: #2563eb;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
        }

        .chatBtn:hover { background: #1d4ed8; }

        .locationBtn {
          margin-top: 8px;
          color: #334155;
          border: 1px solid #cbd5e1;
          background: white;
        }

        .locationBtn:hover { background: #f8fafc; }

        .privacyBar {
          margin-top: 14px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #f1f5f9;
          border-radius: 14px;
          background: white;
        }

        .privacyBar strong { display: block; color: #334155; font-size: 12px; }
        .privacyBar small { display: block; color: #94a3b8; font-size: 10px; }

        .floatingCard {
          position: absolute;
          padding: 12px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
          backdrop-filter: blur(16px);
          animation: float 4s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .chatCard { left: -15px; top: 110px; animation-delay: 0s; }
        .locationCard { right: -15px; bottom: 90px; animation-delay: 2s; }

        .floatingIcon {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #eff6ff;
          font-size: 18px;
        }

        .floatingCard strong { display: block; color: #1e293b; font-size: 13px; }
        .floatingCard small { display: block; color: #64748b; font-size: 11px; }

        /* TRUST BAR */
        .trustBar {
          margin-top: 20px;
          margin-bottom: 40px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          background: white;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }

        .trustBar > div {
          padding: 22px 24px;
          display: flex;
          align-items: center;
          gap: 14px;
          border-right: 1px solid #f1f5f9;
        }

        .trustBar > div:last-child { border-right: 0; }
        .trustBar strong { color: #4f46e5; font-size: 15px; font-weight: 900; }
        .trustBar span { color: #334155; font-size: 13px; font-weight: 700; }

        /* SECTIONS GENERAL */
        .profiles, .featureSection {
          padding-top: 90px;
          padding-bottom: 90px;
        }

        .sectionHead {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 40px;
        }

        .sectionEyebrow {
          color: #4f46e5;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .sectionEyebrow.light { color: #818cf8; }

        .sectionHead h2, .howIntro h2, .liveChatContent h2, .emergency h2, .storeContent h2 {
          margin: 8px 0 0;
          color: #0f172a;
          font-size: clamp(30px, 3.8vw, 44px);
          line-height: 1.1;
          font-weight: 900;
          letter-spacing: -1.5px;
        }

        .sectionHead p, .howIntro p {
          max-width: 560px;
          margin: 12px 0 0;
          color: #475569;
          font-size: 16px;
          line-height: 1.6;
        }

        .sectionAction {
          color: #2563eb;
          text-decoration: none;
          font-size: 15px;
          font-weight: 800;
          transition: transform 0.2s;
        }

        .sectionAction:hover { transform: translateX(4px); }

        /* CATEGORIES */
        .categoryGrid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 18px;
        }

        .categoryCard {
          min-height: 190px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          color: inherit;
          background: #fff;
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .categoryCard:hover {
          transform: translateY(-6px);
          border-color: #93c5fd;
          box-shadow: 0 16px 36px rgba(37, 99, 235, 0.08);
        }

        .categoryTop {
          display: flex;
          justify-content: space-between;
          color: #94a3b8;
          font-size: 12px;
          font-weight: 800;
        }

        .categoryArrow { color: #2563eb; font-size: 16px; transition: transform 0.2s; }
        .categoryCard:hover .categoryArrow { transform: translate(2px, -2px); }

        .categoryIcon { margin-top: 18px; font-size: 40px; }
        .categoryCard > strong { margin-top: 14px; color: #1e293b; font-size: 17px; font-weight: 800; }
        .categoryCard > small { margin-top: 4px; color: #94a3b8; font-size: 10px; font-weight: 800; }

        /* HOW IT WORKS */
        .how {
          padding: 70px 56px;
          border-radius: 32px;
          color: white;
          background: radial-gradient(circle at 95% 0%, rgba(99, 102, 241, 0.3), transparent 35%), #0f172a;
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.15);
        }

        .howIntro h2 { color: white; }
        .howIntro p { color: #94a3b8; }

        .howSteps {
          margin-top: 48px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .howStep {
          padding: 26px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.03);
          transition: background 0.2s;
        }

        .howStep:hover { background: rgba(255, 255, 255, 0.06); }

        .stepNumber { color: #818cf8; font-size: 13px; font-weight: 900; }
        .stepIcon {
          width: 44px;
          height: 44px;
          margin-top: 18px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          color: white;
          background: rgba(99, 102, 241, 0.2);
          font-size: 20px;
        }

        .howStep h3 { margin: 18px 0 0; color: white; font-size: 17px; font-weight: 800; }
        .howStep p { margin: 8px 0 0; color: #94a3b8; font-size: 14px; line-height: 1.6; }

        /* FEATURES */
        .featureGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .featureCard {
          padding: 26px;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          background: #fff;
          transition: all 0.2s ease;
        }

        .featureCard:hover {
          border-color: #cbd5e1;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.04);
        }

        .featureHeader { display: flex; align-items: center; justify-content: space-between; }
        .featureNumber { color: #94a3b8; font-size: 12px; font-weight: 800; }
        .featureIcon {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #eff6ff;
          font-size: 22px;
        }

        .featureCard h3 { margin: 22px 0 0; color: #0f172a; font-size: 18px; font-weight: 800; }
        .featureCard p { margin: 8px 0 0; color: #475569; font-size: 14px; line-height: 1.6; }

        /* LIVE CHAT */
        .liveChatSection {
          margin-bottom: 90px;
          padding: 56px;
          display: grid;
          grid-template-columns: 440px minmax(0, 1fr);
          align-items: center;
          gap: 64px;
          border-radius: 32px;
          background: linear-gradient(145deg, #eff6ff, #faf5ff);
          border: 1px solid #e0e7ff;
        }

        .chatWindow {
          padding: 18px;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          background: white;
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
        }

        .chatWindowTop {
          padding-bottom: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #f1f5f9;
        }

        .chatWindowTop > div { display: flex; align-items: center; gap: 10px; }
        .chatAvatar {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: white;
          background: #2563eb;
          font-size: 14px;
          font-weight: 800;
        }

        .chatWindowTop strong { display: block; color: #1e293b; font-size: 14px; }
        .chatWindowTop small { display: block; color: #10b981; font-size: 11px; font-weight: 700; }
        .secureChat { color: #94a3b8; font-size: 11px; }

        .chatMessages {
          min-height: 210px;
          padding: 20px 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .finderBubble, .ownerBubble, .locationBubble {
          max-width: 82%;
          padding: 11px 16px;
          border-radius: 16px;
          font-size: 13px;
          line-height: 1.45;
        }

        .finderBubble { align-self: flex-start; color: #334155; border: 1px solid #e2e8f0; background: white; }
        .ownerBubble { align-self: flex-end; color: white; background: #2563eb; }
        .locationBubble { align-self: flex-start; color: #065f46; background: #d1fae5; }

        .chatComposer {
          min-height: 46px;
          padding: 0 8px 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          color: #94a3b8;
          font-size: 13px;
        }

        .chatComposer button {
          width: 34px;
          height: 34px;
          border: 0;
          border-radius: 10px;
          color: white;
          background: #2563eb;
          cursor: pointer;
        }

        .liveChatContent > p { margin: 16px 0 0; color: #475569; font-size: 16px; line-height: 1.65; }
        .liveBenefits { margin-top: 22px; display: grid; gap: 10px; }
        .liveBenefits span { color: #334155; font-size: 14px; font-weight: 700; }

        .darkButton {
          min-height: 50px;
          margin-top: 28px;
          padding: 0 24px;
          display: inline-flex;
          align-items: center;
          gap: 16px;
          border-radius: 14px;
          color: white;
          background: #0f172a;
          text-decoration: none;
          font-size: 15px;
          font-weight: 800;
          transition: background 0.2s;
        }

        .darkButton:hover { background: #1e293b; }

        /* EMERGENCY */
        .emergency {
          margin-bottom: 90px;
          padding: 44px 56px;
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr) auto;
          align-items: center;
          gap: 36px;
          border: 1px solid #fecdd3;
          border-radius: 28px;
          background: linear-gradient(135deg, #fff1f2, #fffafb);
        }

        .emergencyAccent { width: 6px; position: absolute; left: 0; top: 0; bottom: 0; background: #f43f5e; border-radius: 4px 0 0 4px; }
        .emergencyLeft { display: flex; align-items: flex-start; gap: 20px; }
        .emergencyIcon {
          width: 56px;
          height: 56px;
          flex: 0 0 56px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          color: white;
          background: #f43f5e;
          font-size: 24px;
          font-weight: 900;
          box-shadow: 0 10px 25px rgba(244, 63, 94, 0.25);
        }

        .emergencyLabel { color: #e11d48; font-size: 12px; font-weight: 900; letter-spacing: 0.5px; }
        .emergencyLeft p { margin: 8px 0 0; color: #475569; font-size: 15px; line-height: 1.6; }

        .emergencyFeatures { display: grid; gap: 10px; }
        .emergencyFeatures > div {
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid #ffe4e6;
          border-radius: 12px;
          background: white;
        }

        .emergencyFeatures span { color: #e11d48; font-size: 13px; font-weight: 900; }
        .emergencyFeatures strong { color: #334155; font-size: 14px; }

        .emergencyButton {
          min-height: 50px;
          padding: 0 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-radius: 14px;
          color: white;
          background: #f43f5e;
          text-decoration: none;
          font-size: 15px;
          font-weight: 800;
          box-shadow: 0 8px 20px rgba(244, 63, 94, 0.25);
          transition: background 0.2s;
        }

        .emergencyButton:hover { background: #e11d48; }

        /* STORE */
        .storeSection {
          margin-bottom: 90px;
          padding: 60px 56px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 420px;
          align-items: center;
          gap: 56px;
          border-radius: 32px;
          color: white;
          background: radial-gradient(circle at 90% 40%, rgba(99, 102, 241, 0.35), transparent 35%), #0f172a;
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.15);
        }

        .storeContent h2 { color: white; }
        .storeContent p { margin: 14px 0 0; color: #94a3b8; font-size: 16px; line-height: 1.65; }

        .storeButton {
          min-height: 50px;
          margin-top: 28px;
          padding: 0 24px;
          display: inline-flex;
          align-items: center;
          gap: 16px;
          border-radius: 14px;
          color: #0f172a;
          background: white;
          text-decoration: none;
          font-size: 15px;
          font-weight: 800;
          transition: background 0.2s;
        }

        .storeButton:hover { background: #f8fafc; }

        .storeVisual { height: 260px; position: relative; }
        .tag, .sticker {
          position: absolute;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #2563eb;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
        }

        .tag { width: 140px; height: 140px; border-radius: 50%; }
        .tagOne { left: 60px; top: 40px; z-index: 3; }
        .tagTwo { right: 40px; top: 10px; width: 100px; height: 100px; z-index: 2; transform: rotate(10deg); }

        .tag span { font-size: 28px; font-weight: 900; }
        .tag strong { position: absolute; bottom: 30px; color: #4f46e5; font-size: 9px; letter-spacing: 1px; }

        .sticker {
          width: 140px;
          height: 90px;
          right: 10px;
          bottom: 10px;
          z-index: 4;
          border-radius: 18px;
          transform: rotate(-7deg);
        }

        .sticker span { font-size: 22px; font-weight: 900; }
        .sticker small { position: absolute; bottom: 12px; color: #64748b; font-size: 8px; font-weight: 800; }

        /* FINAL CTA */
        .finalCta {
          margin-bottom: 100px;
          text-align: center;
        }

        .finalCta > span { color: #4f46e5; font-size: 13px; font-weight: 900; letter-spacing: 1px; }
        .finalCta h2 { margin: 8px 0 0; color: #0f172a; font-size: clamp(34px, 4.2vw, 52px); font-weight: 900; letter-spacing: -1.5px; }
        .finalCta p { margin: 12px 0 0; color: #475569; font-size: 17px; }

        .finalCta > div {
          margin-top: 28px;
          display: flex;
          justify-content: center;
          gap: 14px;
        }

        .finalPrimary, .finalSecondary {
          min-height: 52px;
          padding: 0 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          text-decoration: none;
          font-size: 15px;
          font-weight: 800;
          transition: all 0.2s;
        }

        .finalPrimary { color: white; background: linear-gradient(135deg, #2563eb, #4f46e5); box-shadow: 0 10px 25px rgba(37, 99, 235, 0.25); }
        .finalPrimary:hover { transform: translateY(-2px); }
        .finalSecondary { color: #334155; border: 1px solid #cbd5e1; background: white; }
        .finalSecondary:hover { background: #f8fafc; }

        /* FOOTER */
        .footer {
          padding-top: 56px;
          padding-bottom: 36px;
          display: grid;
          grid-template-columns: minmax(220px, 1fr) repeat(3, 160px);
          gap: 36px;
          border-top: 1px solid #e2e8f0;
        }

        .footerBrand { display: flex; align-items: flex-start; gap: 12px; }
        .footerBrand strong { color: #2563eb; font-size: 17px; }
        .footerBrand p { margin: 4px 0 0; color: #64748b; font-size: 13px; }

        .footerColumn { display: flex; flex-direction: column; gap: 12px; }
        .footerColumn > strong { color: #94a3b8; font-size: 11px; letter-spacing: 0.5px; }
        .footerColumn a { color: #475569; text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s; }
        .footerColumn a:hover { color: #2563eb; }

        .copyright {
          grid-column: 1 / -1;
          margin-top: 28px;
          padding-top: 24px;
          border-top: 1px solid #f1f5f9;
          color: #94a3b8;
          font-size: 13px;
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .nav { display: none; }
          .hero { grid-template-columns: 1fr 380px; }
          .categoryGrid { grid-template-columns: repeat(3, 1fr); }
          .featureGrid { grid-template-columns: repeat(2, 1fr); }
          .liveChatSection { grid-template-columns: 380px 1fr; gap: 32px; }
          .emergency { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .header { grid-template-columns: auto 1fr; }
          .headerActions { justify-content: flex-end; }
          .headerActions .admin { display: none; }

          .hero { grid-template-columns: 1fr; text-align: center; }
          .heroDescription { margin-left: auto; margin-right: auto; }
          .heroButtons, .heroMiniLinks { justify-content: center; }
          .heroVisual { height: 420px; }

          .trustBar { grid-template-columns: repeat(2, 1fr); }
          .trustBar > div:nth-child(2) { border-right: 0; }

          .howSteps { grid-template-columns: repeat(2, 1fr); }
          .liveChatSection { grid-template-columns: 1fr; text-align: center; padding: 36px; }
          .liveBenefits { justify-items: center; }
          .storeSection { grid-template-columns: 1fr; padding: 36px; }
          .footer { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 480px) {
          .container { padding-left: 16px; padding-right: 16px; }
          .brandText small, .headerActions .login, .language { display: none; }
          
          .categoryGrid { grid-template-columns: repeat(2, 1fr); }
          .howSteps, .featureGrid { grid-template-columns: 1fr; }
          .trustBar { grid-template-columns: 1fr; }
          .trustBar > div { border-right: 0; border-bottom: 1px solid #e2e8f0; }
          
          .heroButtons { flex-direction: column; }
          .primaryHero, .secondaryHero { width: 100%; }
          .footer { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
