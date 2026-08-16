"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Lang = "ka" | "en";

const categories = [
  { id: "dog", ka: "ძაღლი", en: "Dog", symbol: "01" },
  { id: "cat", ka: "კატა", en: "Cat", symbol: "02" },
  { id: "keys", ka: "გასაღები", en: "Keys", symbol: "03" },
  { id: "wallet", ka: "საფულე", en: "Wallet", symbol: "04" },
  { id: "suitcase", ka: "ჩემოდანი", en: "Luggage", symbol: "05" },
  { id: "bag", ka: "ჩანთა", en: "Bag", symbol: "06" },
];

export default function HomePage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("ka");

  const ka = lang === "ka";

  function register(type: string) {
    router.push(`/register/details?type=${type}&lang=${lang}`);
  }

  return (
    <main className="page">
      {/* NAV */}
      <header className="nav">
        <button className="brand" onClick={() => router.push("/")}>
          <span className="brandIcon">
            <span />
            <span />
            <span />
            <span />
          </span>

          <span className="brandWords">
            <strong>QR RETURN</strong>
            <small>SMART LOST & FOUND</small>
          </span>
        </button>

        <nav className="navActions">
          <a href="#contact">
            {ka ? "კონტაქტი" : "Contact"}
          </a>

          <button
            className="language"
            onClick={() => setLang(ka ? "en" : "ka")}
          >
            {ka ? "EN" : "ქარ"}
          </button>

          <button
            className="signin"
            onClick={() => router.push("/login")}
          >
            {ka ? "შესვლა" : "Sign in"}
          </button>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="heroCopy">
          <div className="label">
            <span />
            QR RETURN
          </div>

          <h1>
            {ka ? (
              <>
                დაბრუნების
                <br />
                <em>ჭკვიანი გზა.</em>
              </>
            ) : (
              <>
                A smarter way
                <br />
                <em>back to you.</em>
              </>
            )}
          </h1>

          <p>
            {ka
              ? "QR ტეგი შენი ცხოველისა და მნიშვნელოვანი ნივთებისთვის. ერთი სკანირება საკმარისია, რომ მპოვნელმა შენთან დაკავშირება შეძლოს."
              : "A QR tag for pets and the things that matter. One scan gives the finder a simple way to reach you."}
          </p>

          <div className="heroMeta">
            <span>
              <b>01</b>
              {ka ? " აპი არ სჭირდება" : " No app needed"}
            </span>

            <span>
              <b>02</b>
              {ka ? " პირადი კონტაქტი" : " Private contact"}
            </span>

            <span>
              <b>03</b>
              {ka ? " ერთი სკანირება" : " One scan"}
            </span>
          </div>
        </div>

        {/* ABSTRACT PRODUCT VISUAL */}
        <div className="visual">
          <div className="orb orbOne" />
          <div className="orb orbTwo" />

          <div className="phone">
            <div className="phoneTop">
              <span className="miniLogo">
                <i />
                <i />
                <i />
                <i />
              </span>

              <b>QR RETURN</b>
            </div>

            <div className="scanSuccess">
              <div className="check">✓</div>

              <small>QR TAG</small>

              <strong>
                {ka ? "ტეგი ნაპოვნია" : "Tag found"}
              </strong>

              <p>
                {ka
                  ? "მფლობელთან დაკავშირება შესაძლებელია."
                  : "You can now contact the owner."}
              </p>
            </div>

            <div className="finderActions">
              <div>
                <span>⌁</span>
                {ka ? "კონტაქტი" : "Contact"}
              </div>

              <div>
                <span>⌖</span>
                {ka ? "ლოკაცია" : "Location"}
              </div>
            </div>
          </div>

          <div className="floatingTag">
            <div className="qrPattern">
              {Array.from({ length: 16 }).map((_, i) => (
                <span key={i} />
              ))}
            </div>

            <small>QR RETURN</small>
          </div>
        </div>
      </section>

      {/* REGISTRATION SELECTOR */}
      <section className="selectorSection">
        <div className="selectorIntro">
          <span>QR PROTECTION</span>

          <h2>
            {ka
              ? "მიაბი QR ტეგი სასურველ ცხოველს ან ნივთს და დაიბრუნე მარტივად."
              : "Attach a QR tag to your pet or item and make its return simple."}
          </h2>

          <p>
            {ka
              ? "აირჩიე კატეგორია და პირდაპირ დაიწყე რეგისტრაცია."
              : "Select a category to begin registration."}
          </p>
        </div>

        <div className="categorySelector">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => register(category.id)}
            >
              <span className="categoryNumber">
                {category.symbol}
              </span>

              <strong>
                {ka ? category.ka : category.en}
              </strong>

              <span className="categoryArrow">↗</span>
            </button>
          ))}
        </div>
      </section>

      {/* FINDER EXPERIENCE */}
      <section className="finderSection">
        <div className="finderCopy">
          <span className="sectionLabel">
            FINDER EXPERIENCE
          </span>

          <h2>
            {ka
              ? "მპოვნელს აჩვენე მხოლოდ ის, რაც საჭიროა."
              : "Show the finder only what matters."}
          </h2>

          <p>
            {ka
              ? "შენ აკონტროლებ როგორ დაგიკავშირდებიან. ტელეფონი, Live Chat, ლოკაციის გაზიარება და მპოვნელისთვის დამატებითი ინსტრუქცია — ერთ პროფილში."
              : "You control how a finder reaches you. Phone, Live Chat, location sharing and return instructions live in one profile."}
          </p>
        </div>

        <div className="featureList">
          <div>
            <span>01</span>
            <strong>Live Chat</strong>
          </div>

          <div>
            <span>02</span>
            <strong>
              {ka ? "ლოკაციის გაზიარება" : "Location sharing"}
            </strong>
          </div>

          <div>
            <span>03</span>
            <strong>
              {ka ? "მპოვნელის ჯილდო" : "Finder reward"}
            </strong>
          </div>

          <div>
            <span>04</span>
            <strong>
              {ka ? "პირადი მონაცემების კონტროლი" : "Privacy control"}
            </strong>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact">
        <div>
          <span>QR RETURN SUPPORT</span>

          <h2>
            {ka
              ? "დახმარება გჭირდება?"
              : "Need help?"}
          </h2>

          <p>
            {ka
              ? "QR ტეგის რეგისტრაცია, პროფილის მართვა ან დაბრუნების პროცესი — დაგვიკავშირდი."
              : "Questions about registration, your profile or the return process? Contact us."}
          </p>
        </div>

        <a href="mailto:support@qrreturn.com">
          {ka ? "ჩვენთან კონტაქტი" : "Contact us"}
          <span>↗</span>
        </a>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footerBrand">
          <strong>QR RETURN</strong>
          <span>SMART LOST & FOUND</span>
        </div>

        <div className="footerLinks">
          <a href="#contact">
            {ka ? "კონტაქტი" : "Contact"}
          </a>

          <a href="/privacy">
            {ka ? "კონფიდენციალურობა" : "Privacy"}
          </a>

          <a href="/terms">
            {ka ? "წესები" : "Terms"}
          </a>

          <button onClick={() => setLang(ka ? "en" : "ka")}>
            {ka ? "English" : "ქართული"}
          </button>
        </div>

        <small>© 2026 QR RETURN</small>
      </footer>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          overflow: hidden;
          background: #f8fafc;
          color: #07111f;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        button,
        a {
          font: inherit;
        }

        .nav {
          max-width: 1320px;
          height: 92px;
          margin: auto;
          padding: 0 34px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand {
          padding: 0;
          border: 0;
          background: none;
          display: flex;
          align-items: center;
          gap: 13px;
          cursor: pointer;
          text-align: left;
        }

        .brandIcon {
          width: 46px;
          height: 46px;
          padding: 10px;
          border-radius: 13px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
          background: #1261e8;
          box-shadow: 0 12px 30px rgba(18, 97, 232, 0.22);
        }

        .brandIcon span {
          border: 2px solid white;
          border-radius: 2px;
        }

        .brandWords {
          display: flex;
          flex-direction: column;
        }

        .brandWords strong {
          color: #1261e8;
          font-size: 24px;
          line-height: 1;
          letter-spacing: -1px;
        }

        .brandWords small {
          margin-top: 5px;
          color: #7b8799;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 2.5px;
        }

        .navActions {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .navActions a {
          margin-right: 9px;
          color: #475569;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
        }

        .language {
          padding: 10px 13px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: white;
          color: #1261e8;
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
        }

        .signin {
          padding: 11px 17px;
          border: 0;
          border-radius: 10px;
          background: #07111f;
          color: white;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
        }

        .hero {
          max-width: 1320px;
          min-height: 690px;
          margin: auto;
          padding: 70px 34px 110px;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 70px;
          align-items: center;
        }

        .label {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #1261e8;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 2.5px;
        }

        .label span {
          width: 27px;
          height: 2px;
          background: #1261e8;
        }

        .hero h1 {
          margin: 24px 0 0;
          font-size: clamp(57px, 7vw, 96px);
          line-height: 0.92;
          letter-spacing: -6px;
          font-weight: 850;
        }

        .hero h1 em {
          color: #1261e8;
          font-style: normal;
        }

        .heroCopy > p {
          max-width: 610px;
          margin: 33px 0 0;
          color: #64748b;
          font-size: 17px;
          line-height: 1.75;
        }

        .heroMeta {
          margin-top: 38px;
          display: flex;
          gap: 25px;
          flex-wrap: wrap;
        }

        .heroMeta span {
          color: #718096;
          font-size: 11px;
          font-weight: 700;
        }

        .heroMeta b {
          margin-right: 5px;
          color: #1261e8;
        }

        .visual {
          height: 520px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(1px);
        }

        .orbOne {
          width: 390px;
          height: 390px;
          background: #e7f0ff;
        }

        .orbTwo {
          width: 230px;
          height: 230px;
          top: 25px;
          right: 20px;
          background: #dbeafe;
          opacity: 0.7;
        }

        .phone {
          position: relative;
          z-index: 2;
          width: 280px;
          height: 500px;
          padding: 18px;
          border: 8px solid #07111f;
          border-radius: 42px;
          background: white;
          box-shadow: 0 45px 90px rgba(15, 35, 65, 0.22);
          transform: rotate(3deg);
        }

        .phoneTop {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #1261e8;
          font-size: 10px;
        }

        .miniLogo {
          width: 25px;
          height: 25px;
          padding: 5px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          border-radius: 7px;
          background: #1261e8;
        }

        .miniLogo i {
          border: 1px solid white;
        }

        .scanSuccess {
          margin-top: 60px;
          text-align: center;
        }

        .check {
          width: 65px;
          height: 65px;
          margin: auto;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #eaf2ff;
          color: #1261e8;
          font-size: 28px;
          font-weight: 900;
        }

        .scanSuccess small {
          display: block;
          margin-top: 25px;
          color: #1261e8;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .scanSuccess strong {
          display: block;
          margin-top: 8px;
          font-size: 23px;
        }

        .scanSuccess p {
          margin: 9px auto;
          max-width: 190px;
          color: #8490a1;
          font-size: 11px;
          line-height: 1.5;
        }

        .finderActions {
          margin-top: 40px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .finderActions div {
          padding: 14px 7px;
          border-radius: 12px;
          background: #f4f7fb;
          text-align: center;
          color: #334155;
          font-size: 10px;
          font-weight: 800;
        }

        .finderActions span {
          display: block;
          margin-bottom: 4px;
          color: #1261e8;
          font-size: 18px;
        }

        .floatingTag {
          position: absolute;
          z-index: 3;
          right: 2%;
          bottom: 65px;
          width: 125px;
          padding: 17px;
          border-radius: 19px;
          background: #07111f;
          box-shadow: 0 25px 50px rgba(7, 17, 31, 0.3);
          transform: rotate(-7deg);
        }

        .qrPattern {
          aspect-ratio: 1;
          padding: 8px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 4px;
          border-radius: 8px;
          background: white;
        }

        .qrPattern span {
          background: #07111f;
        }

        .qrPattern span:nth-child(3n) {
          background: #1261e8;
        }

        .floatingTag small {
          display: block;
          margin-top: 9px;
          color: white;
          text-align: center;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .selectorSection {
          padding: 105px 34px 115px;
          background: #07111f;
          color: white;
        }

        .selectorIntro {
          max-width: 1180px;
          margin: auto;
        }

        .selectorIntro > span,
        .sectionLabel,
        .contact > div > span {
          color: #69a1ff;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 2.5px;
        }

        .selectorIntro h2 {
          max-width: 850px;
          margin: 18px 0 0;
          font-size: clamp(35px, 5vw, 57px);
          line-height: 1.1;
          letter-spacing: -2.8px;
        }

        .selectorIntro p {
          margin: 18px 0 0;
          color: #8fa1ba;
          font-size: 14px;
        }

        .categorySelector {
          max-width: 1180px;
          margin: 55px auto 0;
          border-top: 1px solid #26364c;
        }

        .categorySelector button {
          width: 100%;
          min-height: 82px;
          padding: 0 8px;
          border: 0;
          border-bottom: 1px solid #26364c;
          background: transparent;
          color: white;
          display: grid;
          grid-template-columns: 80px 1fr 50px;
          align-items: center;
          text-align: left;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .categorySelector button:hover {
          padding-left: 20px;
          background: #0c1c31;
        }

        .categoryNumber {
          color: #56708f;
          font-size: 10px;
          font-weight: 900;
        }

        .categorySelector strong {
          font-size: 20px;
          font-weight: 750;
        }

        .categoryArrow {
          color: #69a1ff;
          font-size: 21px;
        }

        .finderSection {
          max-width: 1180px;
          margin: auto;
          padding: 120px 34px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 100px;
        }

        .sectionLabel {
          color: #1261e8;
        }

        .finderCopy h2 {
          max-width: 550px;
          margin: 18px 0 0;
          font-size: clamp(37px, 5vw, 58px);
          line-height: 1.05;
          letter-spacing: -3px;
        }

        .finderCopy p {
          max-width: 540px;
          margin: 27px 0 0;
          color: #64748b;
          line-height: 1.75;
        }

        .featureList {
          border-top: 1px solid #dfe5ec;
        }

        .featureList div {
          min-height: 80px;
          display: grid;
          grid-template-columns: 65px 1fr;
          align-items: center;
          border-bottom: 1px solid #dfe5ec;
        }

        .featureList span {
          color: #1261e8;
          font-size: 10px;
          font-weight: 900;
        }

        .featureList strong {
          font-size: 16px;
        }

        .contact {
          max-width: 1180px;
          margin: 0 auto 100px;
          padding: 55px 60px;
          border-radius: 26px;
          background: #1261e8;
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .contact > div > span {
          color: #bed5ff;
        }

        .contact h2 {
          margin: 12px 0 0;
          font-size: 35px;
        }

        .contact p {
          max-width: 600px;
          margin: 10px 0 0;
          color: #dce9ff;
          font-size: 13px;
          line-height: 1.6;
        }

        .contact > a {
          flex-shrink: 0;
          padding: 15px 20px;
          border-radius: 11px;
          background: white;
          color: #1261e8;
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
        }

        .contact > a span {
          margin-left: 15px;
        }

        footer {
          max-width: 1180px;
          margin: auto;
          padding: 50px 34px 65px;
          border-top: 1px solid #e2e8f0;
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 50px;
          align-items: center;
        }

        .footerBrand {
          display: flex;
          flex-direction: column;
        }

        .footerBrand strong {
          color: #1261e8;
          font-size: 19px;
        }

        .footerBrand span {
          margin-top: 4px;
          color: #94a3b8;
          font-size: 8px;
          letter-spacing: 2px;
        }

        .footerLinks {
          display: flex;
          gap: 22px;
        }

        .footerLinks a,
        .footerLinks button {
          padding: 0;
          border: 0;
          background: none;
          color: #64748b;
          text-decoration: none;
          font-size: 11px;
          cursor: pointer;
        }

        footer small {
          color: #94a3b8;
          font-size: 10px;
        }

        @media (max-width: 850px) {
          .navActions > a {
            display: none;
          }

          .hero {
            grid-template-columns: 1fr;
            padding-top: 60px;
          }

          .hero h1 {
            letter-spacing: -4px;
          }

          .visual {
            height: 480px;
          }

          .finderSection {
            grid-template-columns: 1fr;
            gap: 55px;
          }

          .contact {
            margin-left: 20px;
            margin-right: 20px;
            padding: 40px 30px;
            flex-direction: column;
            align-items: flex-start;
          }

          footer {
            grid-template-columns: 1fr;
            gap: 25px;
          }
        }

        @media (max-width: 560px) {
          .nav {
            height: 80px;
            padding: 0 16px;
          }

          .brandWords strong {
            font-size: 19px;
          }

          .brandWords small {
            display: none;
          }

          .brandIcon {
            width: 40px;
            height: 40px;
          }

          .signin {
            padding: 10px 12px;
          }

          .hero {
            padding: 60px 20px 80px;
          }

          .hero h1 {
            font-size: 55px;
            letter-spacing: -3.5px;
          }

          .heroMeta {
            flex-direction: column;
            gap: 9px;
          }

          .visual {
            height: 450px;
          }

          .phone {
            width: 245px;
            height: 445px;
          }

          .floatingTag {
            right: 0;
            width: 105px;
          }

          .selectorSection {
            padding: 80px 20px;
          }

          .categorySelector button {
            grid-template-columns: 50px 1fr 35px;
          }

          .finderSection {
            padding: 90px 20px;
          }

          .footerLinks {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </main>
  );
}
