"use client";

import { useState } from "react";

type Language = "ka" | "en";
type OpenMenu = "about" | "shop" | "faq" | null;
type OpenFaq = number | null;

const faqItems = {
  ka: [
    {
      q: "როგორ მუშაობს QR RETURN?",
      a: "QR კოდის სკანირების შემდეგ მპოვნელს შეუძლია ნახოს მხოლოდ ის ინფორმაცია, რომლის გაზიარებაც მფლობელს აქვს ნებადართული.",
    },
    {
      q: "სჭირდება მპოვნელს რეგისტრაცია?",
      a: "არა. QR კოდის დასასკანერებლად და მფლობელთან დასაკავშირებლად მპოვნელს ანგარიშის შექმნა არ სჭირდება.",
    },
    {
      q: "როგორ მუშაობს Live Chat?",
      a: "მპოვნელს შეუძლია QR პროფილიდან გახსნას Live Chat და პირდაპირ დაუკავშირდეს მფლობელს პლატფორმის საშუალებით.",
    },
    {
      q: "როგორ მუშაობს ლოკაციის გაზიარება?",
      a: "თუ მფლობელს ფუნქცია ჩართული აქვს, მპოვნელს შეუძლია საკუთარი მიმდინარე მდებარეობა სურვილის შემთხვევაში გააზიაროს.",
    },
    {
      q: "ვინ ხედავს ჩემს პირად ინფორმაციას?",
      a: "მფლობელი თავად აკონტროლებს რომელი საკონტაქტო და პირადი ინფორმაცია გამოჩნდება QR პროფილზე.",
    },
  ],
  en: [
    {
      q: "How does QR RETURN work?",
      a: "After scanning the QR code, the finder can see only the information that the owner has chosen to make visible.",
    },
    {
      q: "Does the finder need an account?",
      a: "No. A finder does not need to register in order to scan the QR code and contact the owner.",
    },
    {
      q: "How does Live Chat work?",
      a: "The finder can open Live Chat from the QR profile and contact the owner directly through the platform.",
    },
    {
      q: "How does location sharing work?",
      a: "If the owner enables the feature, the finder can choose to share their current location.",
    },
    {
      q: "Who can see my personal information?",
      a: "The owner controls exactly which personal and contact information is visible on the QR profile.",
    },
  ],
};

export default function HomeHeader() {
  const [language, setLanguage] = useState<Language>("ka");
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [openFaq, setOpenFaq] = useState<OpenFaq>(null);

  const ka = language === "ka";
  const faqs = faqItems[language];

  function toggleMenu(menu: OpenMenu) {
    setOpenMenu((current) => (current === menu ? null : menu));
    setOpenFaq(null);
  }

  return (
    <header className="header">
      <div className="inner">
        <a href="/" className="brand">
          QR RETURN
        </a>

        <nav className="nav">
          <button
            type="button"
            className={openMenu === "about" ? "navButton active" : "navButton"}
            onClick={() => toggleMenu("about")}
          >
            {ka ? "ჩვენს შესახებ" : "About us"}
            <ChevronIcon />
          </button>

          <button
            type="button"
            className={openMenu === "shop" ? "navButton active" : "navButton"}
            onClick={() => toggleMenu("shop")}
          >
            {ka ? "ონლაინ შეძენა" : "Online purchase"}
            <ChevronIcon />
          </button>

          <button
            type="button"
            className={openMenu === "faq" ? "navButton active" : "navButton"}
            onClick={() => toggleMenu("faq")}
          >
            {ka ? "ხშირად დასმული კითხვები" : "FAQ"}
            <ChevronIcon />
          </button>
        </nav>

        <div className="actions">
          <div className="languages">
            <button
              type="button"
              className={ka ? "selected" : ""}
              onClick={() => setLanguage("ka")}
            >
              GEO
            </button>

            <span />

            <button
              type="button"
              className={!ka ? "selected" : ""}
              onClick={() => setLanguage("en")}
            >
              ENG
            </button>
          </div>

          <a href="/login" className="login">
            {ka ? "შესვლა" : "Sign in"}
          </a>

          <a href="/signup" className="signup">
            {ka ? "ანგარიშის შექმნა" : "Create account"}
          </a>

          <a href="/admin" className="admin">
            Admin Panel
          </a>
        </div>
      </div>

      {openMenu === "about" && (
        <div className="dropdown">
          <div className="aboutGrid">
            <article>
              <span>01</span>
              <h3>{ka ? "დამფუძნებელი" : "Founder"}</h3>
              <p>
                {ka
                  ? "QR RETURN შეიქმნა იმისთვის, რომ დაკარგული ნივთის ან ცხოველის დაბრუნება უფრო სწრაფი, მარტივი და უსაფრთხო გახდეს."
                  : "QR RETURN was created to make the return of lost pets and belongings faster, simpler and safer."}
              </p>
            </article>

            <article>
              <span>02</span>
              <h3>{ka ? "ჩვენი მისია" : "Our mission"}</h3>
              <p>
                {ka
                  ? "ჩვენი მისიაა ერთი QR სკანირებით მპოვნელსა და მფლობელს შორის უსაფრთხო და მარტივი კავშირის შექმნა."
                  : "Our mission is to create a safe and simple connection between finder and owner with a single QR scan."}
              </p>
            </article>

            <article>
              <span>03</span>
              <h3>{ka ? "ჩვენი ხედვა" : "Our vision"}</h3>
              <p>
                {ka
                  ? "ჩვენი ხედვაა QR RETURN გახდეს უნივერსალური სისტემა ნივთების, ცხოველებისა და Emergency პროფილების დასაცავად."
                  : "Our vision is for QR RETURN to become a universal protection system for belongings, pets and Emergency profiles."}
              </p>
            </article>
          </div>
        </div>
      )}

      {openMenu === "shop" && (
        <div className="dropdown">
          <div className="shopContent">
            <div>
              <span className="eyebrow">QR RETURN STORE</span>
              <h2>{ka ? "ონლაინ შეძენა" : "Online purchase"}</h2>
              <p>
                {ka
                  ? "გადადით მაღაზიაში, აირჩიეთ თქვენთვის სასურველი QR პროდუქტი, დიზაინი და რაოდენობა."
                  : "Open the store, choose your QR product, design and quantity."}
              </p>
            </div>

            <a href="/store" className="shopButton">
              {ka ? "მაღაზიის გახსნა" : "Open store"}
              <ArrowIcon />
            </a>
          </div>
        </div>
      )}

      {openMenu === "faq" && (
        <div className="dropdown faqDropdown">
          <div className="faqHeader">
            <span className="eyebrow">FAQ</span>
            <h2>{ka ? "ხშირად დასმული კითხვები" : "Frequently asked questions"}</h2>
          </div>

          <div className="faqList">
            {faqs.map((item, index) => {
              const opened = openFaq === index;

              return (
                <div className="faqItem" key={item.q}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(opened ? null : index)}
                  >
                    <span>{item.q}</span>
                    <strong>{opened ? "−" : "+"}</strong>
                  </button>

                  {opened && <p>{item.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        .header {
          width: 100%;
          position: relative;
          z-index: 1000;
          background: #0d47b5;
          color: #ffffff;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Arial,
            sans-serif;
        }

        .inner {
          width: calc(100% - 56px);
          max-width: 1380px;
          min-height: 86px;
          margin: 0 auto;

          display: flex;
          align-items: center;
          gap: 34px;
        }

        .brand {
          flex: 0 0 auto;
          color: #ffffff;
          text-decoration: none;
          font-size: 22px;
          font-weight: 850;
          letter-spacing: -0.7px;
        }

        .nav {
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .navButton {
          min-height: 42px;
          padding: 0 11px;

          display: inline-flex;
          align-items: center;
          gap: 6px;

          border: 0;
          border-radius: 9px;

          color: rgba(255, 255, 255, 0.82);
          background: transparent;

          font: inherit;
          font-size: 13px;
          font-weight: 650;

          cursor: pointer;
        }

        .navButton:hover,
        .navButton.active {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }

        .navButton :global(svg) {
          width: 12px;
          height: 12px;
        }

        .actions {
          margin-left: auto;

          display: flex;
          align-items: center;
          gap: 8px;
        }

        .languages {
          margin-right: 5px;

          display: flex;
          align-items: center;
          gap: 7px;
        }

        .languages button {
          padding: 4px 1px;

          border: 0;
          background: transparent;

          color: rgba(255, 255, 255, 0.55);

          font: inherit;
          font-size: 12px;
          font-weight: 700;

          cursor: pointer;
        }

        .languages button.selected {
          color: #ffffff;
        }

        .languages > span {
          width: 1px;
          height: 14px;
          background: rgba(255, 255, 255, 0.28);
        }

        .login,
        .signup,
        .admin {
          min-height: 41px;
          padding: 0 13px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border-radius: 9px;

          text-decoration: none;
          font-size: 13px;
          font-weight: 700;

          white-space: nowrap;
        }

        .login {
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.24);
        }

        .signup {
          color: #0d47b5;
          background: #ffffff;
        }

        .admin {
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.42);
          background: rgba(255, 255, 255, 0.06);
        }

        .dropdown {
          position: absolute;
          top: 86px;
          left: 0;

          width: 100%;

          padding: 34px max(28px, calc((100% - 1380px) / 2));

          color: #172033;
          background: #ffffff;

          border-top: 1px solid #e7ebf0;

          box-shadow:
            0 24px 55px
            rgba(8, 31, 76, 0.15);
        }

        .aboutGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .aboutGrid article {
          padding: 22px;

          border: 1px solid #e6ebf1;
          border-radius: 15px;

          background: #f8faff;
        }

        .aboutGrid article > span {
          color: #2563eb;
          font-size: 11px;
          font-weight: 800;
        }

        .aboutGrid h3 {
          margin: 13px 0 0;
          font-size: 18px;
        }

        .aboutGrid p {
          margin: 9px 0 0;

          color: #667085;

          font-size: 14px;
          line-height: 1.65;
        }

        .shopContent {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 40px;
        }

        .shopContent > div {
          max-width: 760px;
        }

        .eyebrow {
          color: #2563eb;

          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.2px;
        }

        .shopContent h2,
        .faqHeader h2 {
          margin: 7px 0 0;

          font-size: 24px;
          letter-spacing: -0.6px;
        }

        .shopContent p {
          margin: 10px 0 0;

          color: #667085;

          font-size: 14px;
          line-height: 1.65;
        }

        .shopButton {
          min-height: 44px;
          padding: 0 16px;

          display: inline-flex;
          align-items: center;
          gap: 8px;

          flex-shrink: 0;

          border-radius: 9px;

          color: #ffffff;
          background: #2563eb;

          text-decoration: none;

          font-size: 13px;
          font-weight: 750;
        }

        .shopButton :global(svg) {
          width: 14px;
          height: 14px;
        }

        .faqDropdown {
          max-height: 520px;
          overflow-y: auto;
        }

        .faqHeader {
          margin-bottom: 20px;
        }

        .faqList {
          display: grid;
          gap: 8px;
        }

        .faqItem {
          border: 1px solid #e5eaf0;
          border-radius: 12px;

          overflow: hidden;

          background: #ffffff;
        }

        .faqItem button {
          width: 100%;
          min-height: 55px;

          padding: 0 16px;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;

          border: 0;

          color: #172033;
          background: #ffffff;

          text-align: left;

          font: inherit;
          font-size: 14px;
          font-weight: 700;

          cursor: pointer;
        }

        .faqItem button:hover {
          background: #f8faff;
        }

        .faqItem strong {
          color: #2563eb;

          font-size: 21px;
          font-weight: 500;
        }

        .faqItem p {
          margin: 0;
          padding: 0 16px 17px;

          color: #667085;

          font-size: 14px;
          line-height: 1.65;
        }

        @media (max-width: 1080px) {
          .navButton {
            padding: 0 7px;
            font-size: 12px;
          }

          .admin {
            display: none;
          }
        }

        @media (max-width: 800px) {
          .inner {
            width: calc(100% - 28px);
            min-height: 74px;
          }

          .brand {
            font-size: 19px;
          }

          .nav,
          .languages,
          .login {
            display: none;
          }

          .signup {
            min-height: 40px;
            padding: 0 11px;
            font-size: 12px;
          }

          .dropdown {
            top: 74px;

            padding:
              24px
              16px;
          }

          .aboutGrid {
            grid-template-columns: 1fr;
          }

          .shopContent {
            align-items: flex-start;
            flex-direction: column;
            gap: 18px;
          }

          .shopButton {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </header>
  );
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}
