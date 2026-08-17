"use client";

import { useState } from "react";

type Language = "ka" | "en";

const features = [
  { number: "01", ka: "Live Chat", en: "Live Chat" },
  { number: "02", ka: "ლოკაციის გაზიარება", en: "Location Sharing" },
  { number: "03", ka: "მპოვნელის ჯილდო", en: "Finder Reward" },
  { number: "04", ka: "პირადი მონაცემების კონტროლი", en: "Privacy Control" },
];

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("ka");
  const ka = language === "ka";

  return (
    <main className="page">
      <header className="header">
        <a href="/" className="brand">
          <div className="brandMark">QR</div>

          <div>
            <div className="brandName">QR RETURN</div>
            <div className="brandSub">SMART LOST & FOUND</div>
          </div>
        </a>

        <div className="headerRight">
          <nav className="nav">
            <a href="/register" className="registerButton">
              {ka ? "რეგისტრაცია" : "Register"}
            </a>

            <a href="/login" className="loginButton">
              {ka ? "შესვლა" : "Sign in"}
            </a>
          </nav>

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

      <section className="hero">
        <div className="heroContent">
          <div className="heroBrand">QR RETURN</div>

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

          <a href="/register" className="heroButton">
            {ka ? "დაიწყე რეგისტრაცია" : "Start registration"} →
          </a>
        </div>

        <div className="heroVisual">
          <div className="phone">
            <div className="phoneScreen">
              <div className="miniLogo">QR</div>

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
                        [1, 2, 4, 6, 7, 9, 12, 14, 15, 17, 19, 20, 22, 25, 27, 28, 31, 33, 34].includes(i)
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

      <section className="information">
        <div className="infoInner">
          <div className="infoLabel">QR RETURN</div>

          <h2>
            {ka ? "როგორ მუშაობს QR RETURN" : "How QR RETURN works"}
          </h2>

          <div className="infoText">
            {ka ? (
              <>
                <p className="lead">
                  <strong>
                    მიამაგრეთ QR კოდი თქვენს ცხოველს ან ნივთს და გაუმარტივეთ მპოვნელს თქვენთან დაკავშირება.
                  </strong>
                </p>

                <p>
                  მპოვნელი ასკანერებს QR კოდს და{" "}
                  <strong>ყოველგვარი აპლიკაციის ჩამოტვირთვის გარეშე</strong>{" "}
                  გიკავშირდებათ —{" "}
                  <strong>
                    Live Chat-ის საშუალებით ან რეგისტრაციისას თქვენ მიერ მითითებულ ნომერზე.
                  </strong>
                </p>

                <p>
                  მას ასევე შეუძლია{" "}
                  <strong>გაგიზიაროთ ნივთის ან ცხოველის მდებარეობა</strong>{" "}
                  პირდაპირ QR RETURN-ის საშუალებით.
                </p>

                <p>
                  <strong>
                    დაკავშირების მეთოდს თავად ირჩევთ. უსაფრთხოება და გამჭვირვალობა ჩვენი პრიორიტეტია.
                  </strong>
                </p>

                <p className="lastLine">
                  <strong>
                    შეიძინეთ QR კოდი და დაკარგულთან დამშვიდობება აღარ მოგიწევთ.
                  </strong>
                </p>
              </>
            ) : (
              <>
                <p className="lead">
                  <strong>
                    Attach a QR code to your pet or item and make it easier for a finder to contact you.
                  </strong>
                </p>

                <p>
                  The finder scans the QR code and can contact you{" "}
                  <strong>without downloading an app</strong> — through{" "}
                  <strong>Live Chat or the phone number you provide during registration.</strong>
                </p>

                <p>
                  The finder can also{" "}
                  <strong>share the location of your pet or item</strong>{" "}
                  directly through QR RETURN.
                </p>

                <p>
                  <strong>
                    You choose how you want to be contacted. Safety and transparency are our priority.
                  </strong>
                </p>

                <p className="lastLine">
                  <strong>
                    Get your QR code and give what matters to you a way back home.
                  </strong>
                </p>
              </>
            )}
          </div>

          <div className="featureGrid">
            {features.map((feature) => (
              <div className="feature" key={feature.number}>
                <div className="featureNumber">{feature.number}</div>
                <div className="featureName">
                  {ka ? feature.ka : feature.en}
                </div>
              </div>
            ))}
          </div>

          <div className="bottomCta">
            <a href="/register">
              {ka ? "რეგისტრაცია" : "Register"} →
            </a>
          </div>
        </div>
      </section>

      <section id="contact" className="contact">
        <div className="contactInner">
          <div>
            <div className="sectionLabel">QR RETURN</div>

            <h2>{ka ? "დაგვიკავშირდით" : "Contact us"}</h2>

            <p>
              {ka
                ? "კითხვა გაქვთ QR კოდის, რეგისტრაციის ან ჩვენი სერვისის შესახებ? დაგვიკავშირდით."
                : "Questions about QR codes, registration or our service? Contact us."}
            </p>
          </div>

          <a href="mailto:hello@qrreturn.com" className="contactButton">
            {ka ? "მოგვწერეთ" : "Email us"} →
          </a>
        </div>
      </section>

      <footer className="footer">
        <div className="footerInner">
          <div>
            <div className="footerBrand">QR RETURN</div>
            <div className="footerSub">SMART LOST & FOUND</div>
          </div>

          <div className="footerLinks">
            <a href="#contact">{ka ? "კონტაქტი" : "Contact"}</a>
            <span>{ka ? "კონფიდენციალურობა" : "Privacy"}</span>
            <span>{ka ? "წესები და პირობები" : "Terms & Conditions"}</span>
          </div>

          <div className="copyright">© 2026 QR RETURN</div>
        </div>
      </footer>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          background: #ffffff;
          color: #091426;
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
        }

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
          box-shadow: 0 9px 24px rgba(20,101,232,.22);
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

        .headerRight,
        .nav,
        .language {
          display: flex;
          align-items: center;
        }

        .headerRight {
          gap: 18px;
        }

        .nav {
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
        }

        .loginButton {
          color: #1d2939;
          border: 1px solid #e2e7ee;
          background: white;
        }

        .language {
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
          box-shadow: 0 2px 8px rgba(20,40,70,.08);
        }

        .hero {
          max-width: 1240px;
          min-height: 570px;
          margin: auto;
          padding: 85px 24px;
          display: grid;
          grid-template-columns: 1.2fr .8fr;
          align-items: center;
          gap: 50px;
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
          font-size: clamp(50px,6.5vw,82px);
          line-height: 1.01;
          letter-spacing: -4.5px;
          font-weight: 900;
        }

        .hero h1 span {
          color: #1465e8;
        }

        .heroButton {
          display: inline-block;
          margin-top: 34px;
          text-decoration: none;
          background: #1465e8;
          color: white;
          padding: 15px 22px;
          border-radius: 13px;
          font-size: 14px;
          font-weight: 900;
        }

        .heroVisual {
          position: relative;
          min-height: 390px;
          display: grid;
          place-items: center;
        }

        .phone {
          width: 210px;
          height: 390px;
          padding: 10px;
          border-radius: 36px;
          background: #081426;
          box-shadow: 0 35px 80px rgba(15,55,110,.22);
          transform: rotate(5deg);
        }

        .phoneScreen {
          width: 100%;
          height: 100%;
          border-radius: 27px;
          background: linear-gradient(160deg,#f9fbff,#eaf3ff);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .miniLogo {
          margin-bottom: 28px;
          color: #1465e8;
          font-size: 20px;
          font-weight: 950;
        }

        .scanBox {
          width: 130px;
          height: 130px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .qrPattern {
          width: 90px;
          height: 90px;
          display: grid;
          grid-template-columns: repeat(6,1fr);
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
          right: 25px;
          bottom: 45px;
          width: 80px;
          height: 80px;
          border-radius: 22px;
          background: #1465e8;
          display: grid;
          place-items: center;
          transform: rotate(-9deg);
        }

        .tinyQR {
          width: 42px;
          height: 42px;
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

        .information {
          background: #f7f9fc;
          padding: 95px 24px;
        }

        .infoInner {
          max-width: 1050px;
          margin: auto;
        }

        .information h2 {
          margin: 15px 0 40px;
          font-size: clamp(36px,5vw,58px);
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

        .featureGrid {
          margin-top: 55px;
          display: grid;
          grid-template-columns: repeat(4,1fr);
          border-top: 1px solid #dfe5ed;
          border-bottom: 1px solid #dfe5ed;
        }

        .feature {
          min-height: 120px;
          padding: 28px 20px;
          border-right: 1px solid #dfe5ed;
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

        .bottomCta {
          margin-top: 38px;
        }

        .bottomCta a {
          display: inline-block;
          text-decoration: none;
          background: #1465e8;
          color: white;
          padding: 14px 22px;
          border-radius: 12px;
          font-weight: 900;
        }

        .contact {
          padding: 80px 24px;
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

        .footer {
          background: #071321;
          color: white;
        }

        .footerInner {
          max-width: 1100px;
          min-height: 150px;
          margin: auto;
          padding: 40px 24px;
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

        @media (max-width: 800px) {
          .header {
            width: calc(100% - 28px);
          }

          .brandSub {
            display: none;
          }

          .hero {
            grid-template-columns: 1fr;
          }

          .featureGrid {
            grid-template-columns: repeat(2,1fr);
          }

          .contactInner,
          .footerInner {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </main>
  );
}
