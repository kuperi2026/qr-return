"use client";

import { useState } from "react";

type Language = "ka" | "en";

const categories = [
  { id: "dog", icon: "🐕", ka: "ძაღლი", en: "Dog", number: "01" },
  { id: "cat", icon: "🐈", ka: "კატა", en: "Cat", number: "02" },
  { id: "keys", icon: "🔑", ka: "გასაღები", en: "Keys", number: "03" },
  { id: "wallet", icon: "👛", ka: "საფულე", en: "Wallet", number: "04" },
  {
    id: "suitcase",
    icon: "🧳",
    ka: "ჩემოდანი",
    en: "Suitcase",
    number: "05",
  },
  { id: "bag", icon: "🎒", ka: "ჩანთა", en: "Bag", number: "06" },
];

const features = [
  { number: "01", ka: "Live Chat", en: "Live Chat" },
  {
    number: "02",
    ka: "ლოკაციის გაზიარება",
    en: "Location Sharing",
  },
  {
    number: "03",
    ka: "მპოვნელის ჯილდო",
    en: "Finder Reward",
  },
  {
    number: "04",
    ka: "პირადი მონაცემების კონტროლი",
    en: "Privacy Control",
  },
];

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("ka");

  const ka = language === "ka";

  return (
    <main className="page">

      {/* HEADER */}
      <header className="header">
        <a href="/" className="brand">
          <div className="brandMark">QR</div>

          <div>
            <div className="brandName">QR RETURN</div>
            <div className="brandSub">SMART LOST & FOUND</div>
          </div>
        </a>

        <div className="headerRight">

          {/* NAVIGATION */}
          <nav className="nav">

            <a href="/register" className="registerButton">
              {ka ? "რეგისტრაცია" : "Register"}
            </a>

            <a href="/login" className="loginButton">
              {ka ? "შესვლა" : "Sign in"}
            </a>

          </nav>

          {/* LANGUAGE */}
          <div className="language">

            <button
              type="button"
              className={ka ? "selected" : ""}
              onClick={() => setLanguage("ka")}
            >
              ქართული
            </button>

            <button
              type="button"
              className={!ka ? "selected" : ""}
              onClick={() => setLanguage("en")}
            >
              English
            </button>

          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">

        <div className="heroGlow" />

        <div className="heroContent">

          <div className="heroBrand">
            QR RETURN
          </div>

          <h1>
            {ka ? (
              <>
                QR, რომელიც დაკარგულს
                <br />
                <span>შენთან აბრუნებს.</span>
              </>
            ) : (
              <>
                The QR that brings
                <br />
                <span>what&apos;s lost back to you.</span>
              </>
            )}
          </h1>

        </div>

        {/* QR VISUAL */}
        <div className="heroVisual">

          <div className="phone">

            <div className="phoneScreen">

              <div className="miniLogo">
                QR
              </div>

              <div className="scanBox">

                <div className="corner c1" />
                <div className="corner c2" />
                <div className="corner c3" />
                <div className="corner c4" />

                <div className="qrPattern">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <i
                      key={i}
                      className={
                        [
                          1, 2, 4, 6, 7, 9, 12, 14, 15,
                          17, 19, 20, 22, 25, 27, 28,
                          31, 33, 34,
                        ].includes(i)
                          ? "dark"
                          : ""
                      }
                    />
                  ))}
                </div>

              </div>
            </div>
          </div>

          <div className="floatingTag">

            <div className="tinyQR">
              <b />
              <b />
              <b />
              <b />
            </div>

          </div>
        </div>
      </section>

      {/* INFORMATION */}
      <section className="information">

        <div className="infoInner">

          <div className="infoLabel">
            QR RETURN
          </div>

          <h2>
            {ka
              ? "როგორ მუშაობს QR RETURN"
              : "How QR RETURN works"}
          </h2>

          <div className="infoText">

            {ka ? (
              <>
                <p className="lead">
                  <strong>
                    მიამაგრეთ QR კოდი თქვენს ცხოველს ან ნივთს და
                    გაუმარტივეთ მპოვნელს თქვენთან დაკავშირება.
                  </strong>
                </p>

                <p>
                  მპოვნელი ასკანერებს QR კოდს და{" "}
                  <strong>
                    ყოველგვარი აპლიკაციის ჩამოტვირთვის გარეშე
                  </strong>{" "}
                  გიკავშირდებათ —{" "}
                  <strong>
                    Live Chat-ის საშუალებით ან რეგისტრაციისას
                    თქვენ მიერ მითითებულ ნომერზე.
                  </strong>
                </p>

                <p>
                  მას ასევე შეუძლია{" "}
                  <strong>
                    გაგიზიაროთ ნივთის ან ცხოველის მდებარეობა
                  </strong>{" "}
                  პირდაპირ QR RETURN-ის საშუალებით.
                </p>

                <p>
                  <strong>
                    დაკავშირების მეთოდს თავად ირჩევთ.
                    უსაფრთხოება და გამჭვირვალობა ჩვენი პრიორიტეტია.
                  </strong>
                </p>

                <p className="lastLine">
                  <strong>
                    შეიძინეთ QR კოდი და დაკარგულთან
                    დამშვიდობება აღარ მოგიწევთ.
                  </strong>
                </p>
              </>
            ) : (
              <>
                <p className="lead">
                  <strong>
                    Attach a QR code to your pet or personal item
                    and make it easier for a finder to contact you.
                  </strong>
                </p>

                <p>
                  The finder scans the QR code and can contact you{" "}
                  <strong>
                    without downloading an application
                  </strong>{" "}
                  — through{" "}
                  <strong>
                    Live Chat or the phone number you provide
                    during registration.
                  </strong>
                </p>

                <p>
                  The finder can also{" "}
                  <strong>
                    share the location of your pet or item
                  </strong>{" "}
                  directly through QR RETURN.
                </p>

                <p>
                  <strong>
                    You choose how you want to be contacted.
                    Safety and transparency are our priority.
                  </strong>
                </p>

                <p className="lastLine">
                  <strong>
                    Get your QR code and give what matters
                    to you a way back home.
                  </strong>
                </p>
              </>
            )}

          </div>

          {/* FEATURES */}
          <div className="featureGrid">

            {features.map((feature) => (
              <div
                className="feature"
                key={feature.number}
              >
                <div className="featureNumber">
                  {feature.number}
                </div>

                <div className="featureName">
                  {ka ? feature.ka : feature.en}
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* DARK CATEGORY SECTION */}
      <section className="categories">

        <div className="categoryInner">

          <h2>
            {ka
              ? "დაარეგისტრირეთ სასურველი ნივთი ან ცხოველი."
              : "Register your item or pet."}
          </h2>

          <div className="categoryGrid">

            {categories.map((item) => (
              <div
                className="categoryCard"
                key={item.id}
              >

                <div className="cardTop">
                  <span>{item.number}</span>
                  <span className="arrow">↗</span>
                </div>

                <div className="iconWrap">

                  <div className="categoryIcon">
                    {item.icon}
                  </div>

                  <div className="qrTag">
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>

                </div>

                <div className="categoryName">
                  {ka ? item.ka : item.en}
                </div>

              </div>
            ))}

          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="contact"
      >

        <div className="contactInner">

          <div>

            <div className="sectionLabel">
              QR RETURN
            </div>

            <h2>
              {ka
                ? "დაგვიკავშირდით"
                : "Contact us"}
            </h2>

            <p>
              {ka
                ? "კითხვა გაქვთ QR კოდის, რეგისტრაციის ან ჩვენი სერვისის შესახებ? დაგვიკავშირდით."
                : "Questions about QR codes, registration or our service? Contact us."}
            </p>

          </div>

          <a
            href="mailto:hello@qrreturn.com"
            className="contactButton"
          >
            {ka ? "მოგვწერეთ" : "Email us"} →
          </a>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">

        <div className="footerInner">

          <div>

            <div className="footerBrand">
              QR RETURN
            </div>

            <div className="footerSub">
              SMART LOST & FOUND
            </div>

          </div>

          <div className="footerLinks">

            <a href="#contact">
              {ka ? "კონტაქტი" : "Contact"}
            </a>

            <span>
              {ka
                ? "კონფიდენციალურობა"
                : "Privacy"}
            </span>

            <span>
              {ka
                ? "წესები და პირობები"
                : "Terms & Conditions"}
            </span>

          </div>

          <div className="copyright">
            © 2026 QR RETURN
          </div>

        </div>
      </footer>

      <style jsx>{`

        * {
          box-sizing: border-box;
        }

        .page {
          background: #ffffff;
          color: #091426;
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
          min-height: 94px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          border-bottom: 1px solid #edf1f6;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 13px;
          text-decoration: none;
        }

        .brandMark {
          width: 50px;
          height: 50px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: #1465e8;
          color: white;
          font-size: 15px;
          font-weight: 900;
          box-shadow:
            0 9px 24px rgba(20,101,232,.22);
        }

        .brandName {
          color: #1465e8;
          font-size: 26px;
          font-weight: 950;
          letter-spacing: -1px;
        }

        .brandSub {
          margin-top: 4px;
          color: #8792a4;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 2.4px;
        }

        .headerRight {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .nav {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .registerButton,
        .loginButton {
          text-decoration: none;
          border-radius: 11px;
          padding: 11px 17px;
          font-size: 13px;
          font-weight: 850;
        }

        .registerButton {
          background: #1465e8;
          color: white;
          box-shadow:
            0 7px 20px rgba(20,101,232,.18);
        }

        .loginButton {
          color: #1d2939;
          border: 1px solid #e2e7ee;
          background: white;
        }

        .language {
          display: flex;
          padding: 4px;
          background: #f1f4f8;
          border-radius: 11px;
        }

        .language button {
          border: 0;
          background: transparent;
          color: #7c8798;
          padding: 8px 10px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 900;
          cursor: pointer;
        }

        .language .selected {
          background: white;
          color: #1465e8;
          box-shadow:
            0 2px 8px rgba(20,40,70,.08);
        }

        /* HERO */

        .hero {
          max-width: 1240px;
          min-height: 610px;
          margin: auto;
          padding: 100px 24px;
          display: grid;
          grid-template-columns: 1.2fr .8fr;
          align-items: center;
          gap: 50px;
          position: relative;
          overflow: hidden;
        }

        .heroGlow {
          position: absolute;
          width: 480px;
          height: 480px;
          right: -100px;
          top: 30px;
          background: #e8f2ff;
          filter: blur(100px);
          border-radius: 50%;
          opacity: .85;
        }

        .heroContent {
          position: relative;
          z-index: 2;
        }

        .heroBrand,
        .infoLabel,
        .sectionLabel {
          color: #1465e8;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 3px;
        }

        .hero h1 {
          max-width: 830px;
          margin: 24px 0 0;
          font-size:
            clamp(50px,6.5vw,82px);
          line-height: 1.01;
          letter-spacing: -4.5px;
          font-weight: 900;
        }

        .hero h1 span {
          color: #1465e8;
        }

        /* QR PHONE */

        .heroVisual {
          position: relative;
          min-height: 420px;
          display: grid;
          place-items: center;
          z-index: 2;
        }

        .phone {
          width: 225px;
          height: 420px;
          padding: 10px;
          border-radius: 38px;
          background: #081426;
          box-shadow:
            0 35px 80px rgba(15,55,110,.22);
          transform: rotate(5deg);
        }

        .phoneScreen {
          width: 100%;
          height: 100%;
          border-radius: 29px;
          background:
            linear-gradient(
              160deg,
              #f9fbff,
              #eaf3ff
            );
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .miniLogo {
          margin-bottom: 30px;
          color: #1465e8;
          font-size: 20px;
          font-weight: 950;
        }

        .scanBox {
          width: 135px;
          height: 135px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .qrPattern {
          width: 95px;
          height: 95px;
          display: grid;
          grid-template-columns:
            repeat(6,1fr);
          gap: 3px;
        }

        .qrPattern i {
          background: #d7dfeb;
          border-radius: 2px;
        }

        .qrPattern i.dark {
          background: #0b1627;
        }

        .corner {
          position: absolute;
          width: 28px;
          height: 28px;
        }

        .c1 {
          top: 0;
          left: 0;
          border-top: 3px solid #1465e8;
          border-left: 3px solid #1465e8;
        }

        .c2 {
          top: 0;
          right: 0;
          border-top: 3px solid #1465e8;
          border-right: 3px solid #1465e8;
        }

        .c3 {
          bottom: 0;
          left: 0;
          border-bottom: 3px solid #1465e8;
          border-left: 3px solid #1465e8;
        }

        .c4 {
          bottom: 0;
          right: 0;
          border-bottom: 3px solid #1465e8;
          border-right: 3px solid #1465e8;
        }

        .floatingTag {
          position: absolute;
          right: 40px;
          bottom: 60px;
          width: 85px;
          height: 85px;
          border-radius: 23px;
          background: #1465e8;
          display: grid;
          place-items: center;
          transform: rotate(-9deg);
          box-shadow:
            0 20px 50px rgba(20,101,232,.3);
        }

        .tinyQR {
          width: 44px;
          height: 44px;
          padding: 6px;
          background: white;
          border-radius: 8px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
        }

        .tinyQR b {
          background: #081426;
        }

        /* INFORMATION */

        .information {
          background: #f7f9fc;
          padding: 105px 24px;
        }

        .infoInner {
          max-width: 1050px;
          margin: auto;
        }

        .information h2 {
          margin: 15px 0 45px;
          font-size:
            clamp(36px,5vw,58px);
          letter-spacing: -2.5px;
        }

        .infoText {
          max-width: 850px;
        }

        .infoText p {
          margin: 0 0 21px;
          color: #5e697b;
          font-size: 17px;
          line-height: 1.75;
        }

        .infoText strong {
          color: #182438;
        }

        .infoText .lead {
          font-size: 20px;
        }

        .lastLine {
          margin-top: 32px !important;
        }

        /* FEATURES */

        .featureGrid {
          margin-top: 60px;
          display: grid;
          grid-template-columns:
            repeat(4,1fr);
          border-top:
            1px solid #dfe5ed;
          border-bottom:
            1px solid #dfe5ed;
        }

        .feature {
          min-height: 120px;
          padding: 28px 20px;
          border-right:
            1px solid #dfe5ed;
        }

        .feature:last-child {
          border-right: 0;
        }

        .featureNumber {
          color: #1465e8;
          font-size: 11px;
          font-weight: 950;
        }

        .featureName {
          margin-top: 17px;
          color: #162238;
          font-size: 15px;
          font-weight: 850;
        }

        /* CATEGORIES */

        .categories {
          background:
            radial-gradient(
              circle at 15% 20%,
              #143968 0%,
              transparent 35%
            ),
            linear-gradient(
              135deg,
              #071321,
              #0a1b30
            );
          color: white;
          padding: 105px 24px 120px;
        }

        .categoryInner {
          max-width: 1100px;
          margin: auto;
        }

        .categories h2 {
          max-width: 800px;
          margin: 0 0 55px;
          font-size:
            clamp(36px,5vw,57px);
          line-height: 1.08;
          letter-spacing: -2.3px;
        }

        .categoryGrid {
          display: grid;
          grid-template-columns:
            repeat(3,1fr);
          gap: 15px;
        }

        .categoryCard {
          min-height: 260px;
          padding: 24px;
          border-radius: 24px;
          border:
            1px solid rgba(130,170,225,.22);
          background:
            rgba(18,42,72,.72);
        }

        .cardTop {
          display: flex;
          justify-content: space-between;
          color: #8da2bd;
          font-size: 11px;
          font-weight: 850;
        }

        .arrow {
          color: #62a5ff;
          font-size: 18px;
        }

        .iconWrap {
          width: 110px;
          height: 110px;
          margin: 28px auto 20px;
          border-radius: 30px;
          background:
            linear-gradient(
              145deg,
              #173c67,
              #0d2038
            );
          display: grid;
          place-items: center;
          position: relative;
        }

        .categoryIcon {
          font-size: 57px;
        }

        .qrTag {
          position: absolute;
          width: 37px;
          height: 37px;
          right: -5px;
          bottom: 4px;
          background: white;
          padding: 7px;
          border-radius: 9px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3px;
          box-shadow:
            0 8px 20px rgba(0,0,0,.2);
        }

        .qrTag i {
          background: #071321;
        }

        .categoryName {
          text-align: center;
          font-size: 18px;
          font-weight: 850;
        }

        /* CONTACT */

        .contact {
          padding: 95px 24px;
          background: white;
        }

        .contactInner {
          max-width: 1100px;
          margin: auto;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 50px;
        }

        .contact h2 {
          margin: 14px 0 15px;
          font-size: 42px;
          letter-spacing: -1.8px;
        }

        .contact p {
          max-width: 650px;
          margin: 0;
          color: #697487;
          line-height: 1.7;
        }

        .contactButton {
          flex-shrink: 0;
          padding: 15px 22px;
          border-radius: 13px;
          background: #1465e8;
          color: white;
          text-decoration: none;
          font-size: 14px;
          font-weight: 850;
        }

        /* FOOTER */

        .footer {
          background: #071321;
          color: white;
        }

        .footerInner {
          max-width: 1100px;
          min-height: 170px;
          margin: auto;
          padding: 45px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 35px;
        }

        .footerBrand {
          color: #5b9cff;
          font-size: 20px;
          font-weight: 950;
        }

        .footerSub {
          margin-top: 6px;
          color: #65758b;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .footerLinks {
          display: flex;
          gap: 25px;
          flex-wrap: wrap;
        }

        .footerLinks a,
        .footerLinks span {
          color: #a4b0c0;
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
        }

        .copyright {
          color: #59687c;
          font-size: 11px;
        }

        /* MOBILE */

        @media (max-width: 800px) {

          .header {
            width: calc(100% - 28px);
          }

          .headerRight {
            gap: 8px;
          }

          .registerButton,
          .loginButton {
            padding: 9px 11px;
            font-size: 11px;
          }

          .language button {
            padding: 7px;
          }

          .brandName {
            font-size: 20px;
          }

          .brandSub {
            display: none;
          }

          .hero {
            grid-template-columns: 1fr;
            padding-top: 75px;
          }

          .hero h1 {
            letter-spacing: -3px;
          }

          .heroVisual {
            min-height: 390px;
          }

          .featureGrid {
            grid-template-columns:
              repeat(2,1fr);
          }

          .feature:nth-child(2) {
            border-right: 0;
          }

          .feature:nth-child(-n + 2) {
            border-bottom:
              1px solid #dfe5ed;
          }

          .categoryGrid {
            grid-template-columns:
              repeat(2,1fr);
          }

          .contactInner {
            align-items: flex-start;
            flex-direction: column;
          }

          .footerInner {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 540px) {

          .header {
            min-height: 82px;
          }

          .brandMark {
            width: 42px;
            height: 42px;
          }

          .brandName {
            font-size: 17px;
          }

          .nav {
            gap: 5px;
          }

          .registerButton {
            padding: 9px 10px;
          }

          .loginButton {
            display: none;
          }

          .language button {
            font-size: 9px;
          }

          .hero {
            min-height: auto;
          }

          .heroVisual {
            transform: scale(.9);
          }

          .categoryCard {
            min-height: 220px;
            padding: 18px;
          }

          .iconWrap {
            width: 90px;
            height: 90px;
          }

          .categoryIcon {
            font-size: 47px;
          }
        }

      `}</style>
    </main>
  );
}
