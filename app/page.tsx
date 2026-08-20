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
    textEn: "Finder and owner can communicate directly through QR RETURN's protected Live Chat.",
  },
  {
    number: "02",
    icon: "📍",
    titleKa: "ლოკაციის გაზიარება",
    titleEn: "Location Sharing",
    textKa: "მპოვნელს შეუძლია ერთი მოქმედებით გაგიზიაროთ ნივთის ან ცხოველის მდებარეობა.",
    textEn: "The finder can share the location of your item or pet with a single action.",
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
    textEn: "You decide exactly what information and contact methods the finder can see.",
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
                <span>დამშვიდობებას.</span>
              </>
            ) : (
              <>
                Losing it doesn&apos;t mean
                <br />
                <span>saying goodbye.</span>
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
            <Link href="/register?type=emergency">
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
              <span className="connected">● LIVE</span>
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
              <button type="button">💬 Live Chat</button>
              <button type="button" className="locationButton">
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

        <div className="copyright">© 2026 QR RETURN</div>
      </footer>

      {/* STYLES */}
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          overflow-x: hidden;
          color: #142234;
          background: #ffffff;
        }

        .container {
          width: 100%;
          max-width: 1240px;
          margin: 0 auto;
          padding-left: 24px;
          padding-right: 24px;
        }

        /* HEADER */
        .header {
          min-height: 80px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 32px;
          border-bottom: 1px solid #e8edf2;
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
          flex: 0 0 44px;
          border-radius: 12px;
          color: white;
          background: linear-gradient(135deg, #0874f9, #6257f6);
          box-shadow: 0 8px 20px rgba(28, 102, 234, 0.25);
          font-size: 15px;
          font-weight: 900;
        }

        .brandText strong {
          display: block;
          color: #0874f9;
          font-size: 18px;
          font-weight: 900;
          letter-spacing: -0.4px;
        }

        .brandText small {
          display: block;
          margin-top: 2px;
          color: #7566f5;
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
          position: relative;
          color: #4b5868;
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
          transition: color 0.2s ease;
        }

        .nav a:hover {
          color: #0874f9;
        }

        .headerActions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .language {
          padding: 3px;
          display: flex;
          border-radius: 10px;
          background: #f0f3f6;
        }

        .language button {
          min-width: 40px;
          height: 32px;
          border: 0;
          border-radius: 8px;
          color: #718090;
          background: transparent;
          cursor: pointer;
          font-size: 12px;
          font-weight: 800;
        }

        .language button.active {
          color: #0874f9;
          background: white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        .admin, .login, .register {
          min-height: 38px;
          padding: 0 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 800;
        }

        .admin {
          color: #8c55d9;
          border: 1px solid #e8dcf6;
          background: #fbf8ff;
        }

        .login {
          color: #4b5868;
          border: 1px solid #dfe5ea;
          background: white;
        }

        .register {
          color: white;
          background: #0874f9;
          border: 1px solid #0874f9;
        }

        /* HERO */
        .hero {
          min-height: 620px;
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 460px;
          align-items: center;
          gap: 48px;
          padding-top: 40px;
          padding-bottom: 40px;
        }

        .heroGlow {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }

        .glowOne {
          width: 350px;
          height: 350px;
          right: 20px;
          top: 80px;
          background: rgba(98, 87, 246, 0.12);
        }

        .glowTwo {
          width: 280px;
          height: 280px;
          left: -100px;
          bottom: 40px;
          background: rgba(8, 116, 249, 0.08);
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
          border: 1px solid #dbe7fb;
          border-radius: 999px;
          color: #4a5d78;
          background: #f8fbff;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        .liveDot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #29b473;
          box-shadow: 0 0 0 4px rgba(41, 180, 115, 0.15);
        }

        .hero h1 {
          margin: 20px 0 0;
          color: #132236;
          font-size: clamp(38px, 5vw, 64px);
          line-height: 1.08;
          letter-spacing: -2px;
          font-weight: 900;
        }

        .hero h1 span {
          color: #0874f9;
        }

        .heroDescription {
          max-width: 580px;
          margin: 20px 0 0;
          color: #58687a;
          font-size: 16px;
          line-height: 1.6;
        }

        .heroButtons {
          margin-top: 28px;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .primaryHero, .secondaryHero {
          min-height: 48px;
          padding: 0 22px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-radius: 12px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 800;
        }

        .primaryHero {
          color: white;
          background: linear-gradient(135deg, #0874f9, #6357f6);
          box-shadow: 0 10px 28px rgba(8, 116, 249, 0.25);
        }

        .secondaryHero {
          color: #3c4a5a;
          border: 1px solid #dfe5ea;
          background: white;
        }

        .heroMiniLinks {
          margin-top: 24px;
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }

        .heroMiniLinks a {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #5a6978;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
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
          width: 300px;
          position: relative;
          padding: 16px;
          border: 1px solid rgba(223, 230, 238, 0.9);
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 25px 80px rgba(28, 49, 82, 0.12);
          backdrop-filter: blur(20px);
        }

        .deviceTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
        }

        .miniBrand {
          color: #0874f9;
          font-size: 11px;
          font-weight: 900;
        }

        .connected {
          color: #27a968;
          font-size: 10px;
          font-weight: 800;
        }

        .profilePreview {
          padding: 24px 18px;
          border-radius: 20px;
          text-align: center;
          background: linear-gradient(150deg, #f5f9ff, #f6f3ff);
        }

        .animal {
          width: 72px;
          height: 72px;
          margin: 0 auto;
          display: grid;
          place-items: center;
          border: 4px solid white;
          border-radius: 50%;
          background: #eef4ff;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
          font-size: 36px;
        }

        .found {
          display: block;
          margin-top: 12px;
          color: #725af2;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.5px;
        }

        .profilePreview h3 {
          margin: 4px 0 0;
          color: #253548;
          font-size: 20px;
          font-weight: 800;
        }

        .profilePreview p {
          margin: 6px 0 0;
          color: #6a7888;
          font-size: 12px;
          line-height: 1.5;
        }

        .profilePreview button {
          width: 100%;
          min-height: 38px;
          margin-top: 14px;
          border: 0;
          border-radius: 10px;
          color: white;
          background: #0874f9;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .profilePreview .locationButton {
          margin-top: 6px;
          color: #485666;
          border: 1px solid #dce4ec;
          background: white;
        }

        .privacyBar {
          margin-top: 12px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #e7ebef;
          border-radius: 12px;
          background: #fbfcfd;
        }

        .privacyBar strong {
          display: block;
          color: #3b4856;
          font-size: 12px;
        }

        .privacyBar small {
          display: block;
          color: #83909e;
          font-size: 10px;
        }

        .floatingCard {
          position: absolute;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid rgba(225, 231, 237, 0.9);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 16px 36px rgba(26, 49, 83, 0.1);
          backdrop-filter: blur(16px);
        }

        .chatCard { left: -10px; top: 100px; }
        .locationCard { right: -10px; bottom: 80px; }

        .floatingIcon {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #f0f5ff;
          font-size: 18px;
        }

        .floatingCard strong { display: block; color: #3b4856; font-size: 13px; }
        .floatingCard small { display: block; color: #83909e; font-size: 11px; }

        /* TRUST BAR */
        .trustBar {
          margin-top: 20px;
          margin-bottom: 40px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border: 1px solid #e6ebef;
          border-radius: 16px;
          background: #fbfcfd;
        }

        .trustBar > div {
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-right: 1px solid #e7ebef;
        }

        .trustBar > div:last-child { border-right: 0; }
        .trustBar strong { color: #735df3; font-size: 14px; font-weight: 900; }
        .trustBar span { color: #4c5a6a; font-size: 13px; font-weight: 700; }

        /* SECTIONS GENERAL */
        .profiles, .featureSection {
          padding-top: 80px;
          padding-bottom: 80px;
        }

        .sectionHead {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 32px;
        }

        .sectionEyebrow {
          color: #735df3;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .sectionEyebrow.light { color: #8e80ff; }

        .sectionHead h2, .howIntro h2, .liveChatContent h2, .emergency h2, .storeContent h2 {
          margin: 8px 0 0;
          color: #152438;
          font-size: clamp(28px, 3.5vw, 42px);
          line-height: 1.15;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .sectionHead p, .howIntro p {
          max-width: 540px;
          margin: 10px 0 0;
          color: #5c6c7e;
          font-size: 15px;
          line-height: 1.6;
        }

        .sectionAction {
          color: #0874f9;
          text-decoration: none;
          font-size: 14px;
          font-weight: 800;
        }

        /* CATEGORIES */
        .categoryGrid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
        }

        .categoryCard {
          min-height: 180px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          border: 1px solid #e2e8ed;
          border-radius: 18px;
          color: inherit;
          background: #fff;
          text-decoration: none;
          transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
        }

        .categoryCard:hover {
          transform: translateY(-4px);
          border-color: #0874f9;
          box-shadow: 0 12px 30px rgba(8, 116, 249, 0.08);
        }

        .categoryTop {
          display: flex;
          justify-content: space-between;
          color: #8c98a4;
          font-size: 12px;
          font-weight: 800;
        }

        .categoryArrow { color: #0874f9; font-size: 14px; }
        .categoryIcon { margin-top: 16px; font-size: 36px; }
        .categoryCard > strong { margin-top: 12px; color: #283749; font-size: 16px; }
        .categoryCard > small { margin-top: 4px; color: #8c98a4; font-size: 10px; font-weight: 800; }

        /* HOW IT WORKS */
        .how {
          padding: 60px 48px;
          border-radius: 28px;
          color: white;
          background: radial-gradient(circle at 95% 0%, rgba(103, 87, 246, 0.35), transparent 30%), #101f34;
        }

        .howIntro h2 { color: white; }
        .howIntro p { color: #a2b0c0; }

        .howSteps {
          margin-top: 40px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .howStep {
          padding: 24px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.04);
        }

        .stepNumber { color: #8174ff; font-size: 12px; font-weight: 900; }
        .stepIcon {
          width: 40px;
          height: 40px;
          margin-top: 16px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          color: white;
          background: rgba(116, 96, 255, 0.16);
          font-size: 18px;
        }

        .howStep h3 { margin: 16px 0 0; color: white; font-size: 16px; }
        .howStep p { margin: 8px 0 0; color: #a2b0c0; font-size: 13px; line-height: 1.5; }

        /* FEATURES */
        .featureGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .featureCard {
          padding: 24px;
          border: 1px solid #e2e8ed;
          border-radius: 18px;
          background: #fff;
        }

        .featureHeader { display: flex; align-items: center; justify-content: space-between; }
        .featureNumber { color: #8c98a4; font-size: 12px; font-weight: 800; }
        .featureIcon {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #f0f5ff;
          font-size: 20px;
        }

        .featureCard h3 { margin: 20px 0 0; color: #263648; font-size: 18px; }
        .featureCard p { margin: 8px 0 0; color: #5c6c7e; font-size: 14px; line-height: 1.6; }

        /* LIVE CHAT */
        .liveChatSection {
          margin-bottom: 80px;
          padding: 48px;
          display: grid;
          grid-template-columns: 440px minmax(0, 1fr);
          align-items: center;
          gap: 60px;
          border-radius: 28px;
          background: linear-gradient(145deg, #f5f9ff, #fbfaff);
        }

        .chatWindow {
          padding: 16px;
          border: 1px solid #dfe6ed;
          border-radius: 20px;
          background: white;
          box-shadow: 0 20px 50px rgba(29, 59, 103, 0.08);
        }

        .chatWindowTop {
          padding-bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #edf0f3;
        }

        .chatWindowTop > div { display: flex; align-items: center; gap: 10px; }
        .chatAvatar {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: white;
          background: #0874f9;
          font-size: 14px;
          font-weight: 800;
        }

        .chatWindowTop strong { display: block; color: #344457; font-size: 13px; }
        .chatWindowTop small { display: block; color: #2ead71; font-size: 11px; }
        .secureChat { color: #85909b; font-size: 11px; }

        .chatMessages {
          min-height: 200px;
          padding: 20px 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .finderBubble, .ownerBubble, .locationBubble {
          max-width: 80%;
          padding: 10px 14px;
          border-radius: 14px;
          font-size: 13px;
          line-height: 1.4;
        }

        .finderBubble { align-self: flex-start; color: #3c4a5a; border: 1px solid #e1e6ea; background: white; }
        .ownerBubble { align-self: flex-end; color: white; background: #0874f9; }
        .locationBubble { align-self: flex-start; color: #2d3b4a; background: #ebf7f1; }

        .chatComposer {
          min-height: 44px;
          padding: 0 8px 0 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid #e2e7eb;
          border-radius: 12px;
          color: #909ba6;
          font-size: 13px;
        }

        .chatComposer button {
          width: 32px;
          height: 32px;
          border: 0;
          border-radius: 8px;
          color: white;
          background: #0874f9;
          cursor: pointer;
        }

        .liveChatContent > p { margin: 16px 0 0; color: #5c6c7e; font-size: 15px; line-height: 1.6; }
        .liveBenefits { margin-top: 20px; display: grid; gap: 10px; }
        .liveBenefits span { color: #485666; font-size: 14px; font-weight: 700; }

        .darkButton {
          min-height: 46px;
          margin-top: 24px;
          padding: 0 20px;
          display: inline-flex;
          align-items: center;
          gap: 16px;
          border-radius: 12px;
          color: white;
          background: #14243a;
          text-decoration: none;
          font-size: 14px;
          font-weight: 800;
        }

        /* EMERGENCY */
        .emergency {
          margin-bottom: 80px;
          padding: 40px 48px;
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr) auto;
          align-items: center;
          gap: 32px;
          border: 1px solid #f1d9dc;
          border-radius: 24px;
          background: linear-gradient(135deg, #fffafa, #fffdfd);
        }

        .emergencyAccent { width: 6px; position: absolute; left: 0; top: 0; bottom: 0; background: #d74b55; }
        .emergencyLeft { display: flex; align-items: flex-start; gap: 20px; }
        .emergencyIcon {
          width: 52px;
          height: 52px;
          flex: 0 0 52px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          color: white;
          background: #d74b55;
          font-size: 22px;
          font-weight: 900;
        }

        .emergencyLabel { color: #d14b54; font-size: 12px; font-weight: 900; letter-spacing: 0.5px; }
        .emergencyLeft p { margin: 8px 0 0; color: #5c6c7e; font-size: 14px; line-height: 1.5; }

        .emergencyFeatures { display: grid; gap: 8px; }
        .emergencyFeatures > div {
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #f0dfe1;
          border-radius: 10px;
          background: white;
        }

        .emergencyFeatures span { color: #d14b54; font-size: 12px; font-weight: 900; }
        .emergencyFeatures strong { color: #4c5a6a; font-size: 13px; }

        .emergencyButton {
          min-height: 46px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-radius: 12px;
          color: white;
          background: #d74b55;
          text-decoration: none;
          font-size: 14px;
          font-weight: 800;
        }

        /* STORE */
        .storeSection {
          margin-bottom: 80px;
          padding: 56px 48px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 420px;
          align-items: center;
          gap: 48px;
          border-radius: 28px;
          color: white;
          background: radial-gradient(circle at 90% 40%, rgba(118, 96, 255, 0.42), transparent 30%), #12223a;
        }

        .storeContent h2 { color: white; }
        .storeContent p { margin: 12px 0 0; color: #a2afbd; font-size: 15px; line-height: 1.6; }

        .storeButton {
          min-height: 46px;
          margin-top: 24px;
          padding: 0 20px;
          display: inline-flex;
          align-items: center;
          gap: 16px;
          border-radius: 12px;
          color: #13223a;
          background: white;
          text-decoration: none;
          font-size: 14px;
          font-weight: 800;
        }

        .storeVisual { height: 260px; position: relative; }
        .tag, .sticker {
          position: absolute;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #0874f9;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
        }

        .tag { width: 140px; height: 140px; border-radius: 50%; }
        .tagOne { left: 60px; top: 40px; z-index: 3; }
        .tagTwo { right: 40px; top: 10px; width: 100px; height: 100px; z-index: 2; transform: rotate(10deg); }

        .tag span { font-size: 28px; font-weight: 900; }
        .tag strong { position: absolute; bottom: 30px; color: #6658f4; font-size: 9px; letter-spacing: 1px; }

        .sticker {
          width: 140px;
          height: 90px;
          right: 10px;
          bottom: 10px;
          z-index: 4;
          border-radius: 16px;
          transform: rotate(-7deg);
        }

        .sticker span { font-size: 22px; font-weight: 900; }
        .sticker small { position: absolute; bottom: 12px; color: #81909e; font-size: 8px; font-weight: 800; }

        /* FINAL CTA */
        .finalCta {
          margin-bottom: 90px;
          text-align: center;
        }

        .finalCta > span { color: #735df3; font-size: 12px; font-weight: 900; letter-spacing: 1px; }
        .finalCta h2 { margin: 8px 0 0; color: #152438; font-size: clamp(32px, 4vw, 48px); font-weight: 900; letter-spacing: -1px; }
        .finalCta p { margin: 12px 0 0; color: #5c6c7e; font-size: 16px; }

        .finalCta > div {
          margin-top: 24px;
          display: flex;
          justify-content: center;
          gap: 12px;
        }

        .finalPrimary, .finalSecondary {
          min-height: 48px;
          padding: 0 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 800;
        }

        .finalPrimary { color: white; background: linear-gradient(135deg, #0874f9, #6357f6); }
        .finalSecondary { color: #4b5868; border: 1px solid #dfe5ea; background: white; }

        /* FOOTER */
        .footer {
          padding-top: 48px;
          padding-bottom: 32px;
          display: grid;
          grid-template-columns: minmax(220px, 1fr) repeat(3, 160px);
          gap: 32px;
          border-top: 1px solid #e6ebef;
        }

        .footerBrand { display: flex; align-items: flex-start; gap: 12px; }
        .footerBrand strong { color: #0874f9; font-size: 16px; }
        .footerBrand p { margin: 4px 0 0; color: #8b96a1; font-size: 12px; }

        .footerColumn { display: flex; flex-direction: column; gap: 10px; }
        .footerColumn > strong { color: #8c98a4; font-size: 11px; letter-spacing: 0.5px; }
        .footerColumn a { color: #5c6c7e; text-decoration: none; font-size: 13px; font-weight: 700; }

        .copyright {
          grid-column: 1 / -1;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #edf0f2;
          color: #8c98a4;
          font-size: 12px;
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
          .liveChatSection { grid-template-columns: 1fr; text-align: center; padding: 32px; }
          .liveBenefits { justify-items: center; }
          .storeSection { grid-template-columns: 1fr; padding: 32px; }
          .footer { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 480px) {
          .container { padding-left: 16px; padding-right: 16px; }
          .brandText small, .headerActions .login, .language { display: none; }
          
          .categoryGrid { grid-template-columns: repeat(2, 1fr); }
          .howSteps, .featureGrid { grid-template-columns: 1fr; }
          .trustBar { grid-template-columns: 1fr; }
          .trustBar > div { border-right: 0; border-bottom: 1px solid #e7ebef; }
          
          .heroButtons { flex-direction: column; }
          .primaryHero, .secondaryHero { width: 100%; }
          .footer { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
