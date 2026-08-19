"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

const categories = [
  {
    type: "dog",
    icon: "🐶",
    ka: "ძაღლი",
    en: "Dog",
    descKa: "შექმენით ცალკე QR პროფილი თქვენი ძაღლისთვის.",
    descEn: "Create a separate QR profile for your dog.",
  },
  {
    type: "cat",
    icon: "🐱",
    ka: "კატა",
    en: "Cat",
    descKa: "შექმენით ცალკე QR პროფილი თქვენი კატისთვის.",
    descEn: "Create a separate QR profile for your cat.",
  },
  {
    type: "keys",
    icon: "🔑",
    ka: "გასაღები",
    en: "Keys",
    descKa: "დაარეგისტრირეთ თქვენი გასაღებები.",
    descEn: "Register your keys.",
  },
  {
    type: "wallet",
    icon: "👛",
    ka: "საფულე",
    en: "Wallet",
    descKa: "დაარეგისტრირეთ თქვენი საფულე.",
    descEn: "Register your wallet.",
  },
  {
    type: "bag",
    icon: "👜",
    ka: "ჩანთა",
    en: "Bag",
    descKa: "დაარეგისტრირეთ თქვენი ჩანთა.",
    descEn: "Register your bag.",
  },
  {
    type: "suitcase",
    icon: "🧳",
    ka: "ჩემოდანი",
    en: "Suitcase",
    descKa: "დაარეგისტრირეთ თქვენი ჩემოდანი.",
    descEn: "Register your suitcase.",
  },
];

export default function AddProfilePage() {
  const [lang, setLang] = useState<Lang>("ka");
  const [checking, setChecking] = useState(true);

  const ka = lang === "ka";

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setChecking(false);
    }

    checkUser();
  }, []);

  if (checking) {
    return (
      <main className="loadingPage">
        {ka ? "იტვირთება..." : "Loading..."}
      </main>
    );
  }

  return (
    <main className="page">
      <header className="header">
        <a href="/my-profiles" className="brand">
          <div className="logo">QR</div>

          <div>
            <strong>QR RETURN</strong>
            <small>ADD PROFILE</small>
          </div>
        </a>

        <div className="languages">
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
      </header>

      <section className="container">
        <a href="/my-profiles" className="back">
          ← {ka ? "ჩემი პროფილები" : "My profiles"}
        </a>

        <div className="heading">
          <div className="eyebrow">
            {ka ? "ახალი QR პროფილი" : "NEW QR PROFILE"}
          </div>

          <h1>
            {ka
              ? "რისთვის გსურთ პროფილის შექმნა?"
              : "What would you like to register?"}
          </h1>

          <p>
            {ka
              ? "აირჩიეთ პროფილის ტიპი. შექმნის შემდეგ ტიპის შეცვლა შეუძლებელი იქნება, თუმცა ამავე ტიპის პროფილის ყველა მონაცემის რედაქტირება შეგეძლებათ."
              : "Choose a profile type. The type cannot be changed after creation, but all profile details can still be edited."}
          </p>
        </div>

        <div className="grid">
          {categories.map((category) => (
            <a
              key={category.type}
              href={`/register-item/${category.type}`}
              className="category"
            >
              <div className="icon">{category.icon}</div>

              <div className="categoryText">
                <h2>{ka ? category.ka : category.en}</h2>

                <p>
                  {ka ? category.descKa : category.descEn}
                </p>
              </div>

              <span className="arrow">→</span>
            </a>
          ))}
        </div>
      </section>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
        }

        body {
          background: #f7f9fc;
        }

        button {
          font: inherit;
        }

        .loadingPage {
          min-height: 100vh;
          display: grid;
          place-items: center;
          font-family: Inter, Arial, sans-serif;
          color: #667085;
          background: #f7f9fc;
        }

        .page {
          min-height: 100vh;
          color: #101828;
          font-family: Inter, Arial, sans-serif;
          background:
            radial-gradient(
              circle at 8% 15%,
              rgba(20, 101, 232, 0.08),
              transparent 27%
            ),
            radial-gradient(
              circle at 93% 10%,
              rgba(118, 85, 247, 0.09),
              transparent 28%
            ),
            #f7f9fc;
        }

        .header {
          width: calc(100% - 36px);
          max-width: 1180px;
          min-height: 86px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e4e7ec;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .logo {
          width: 50px;
          height: 50px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: linear-gradient(
            135deg,
            #1465e8,
            #7655f7
          );
          color: white;
          font-size: 14px;
          font-weight: 900;
        }

        .brand strong,
        .brand small {
          display: block;
        }

        .brand strong {
          color: #1465e8;
          font-size: 21px;
          font-weight: 900;
        }

        .brand small {
          margin-top: 3px;
          color: #7655f7;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.7px;
        }

        .languages {
          padding: 4px;
          display: flex;
          border-radius: 10px;
          background: #eaecf0;
        }

        .languages button {
          padding: 8px 11px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #667085;
          font-size: 11px;
          font-weight: 900;
          cursor: pointer;
        }

        .languages button.active {
          background: white;
          color: #1465e8;
        }

        .container {
          width: calc(100% - 36px);
          max-width: 1050px;
          margin: auto;
          padding: 50px 0 90px;
        }

        .back {
          display: inline-block;
          color: #667085;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        .heading {
          max-width: 760px;
          margin: 42px 0 38px;
        }

        .eyebrow {
          color: #7655f7;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1.7px;
        }

        .heading h1 {
          margin: 10px 0 14px;
          font-size: clamp(38px, 5vw, 50px);
          line-height: 1.08;
          letter-spacing: -2px;
        }

        .heading p {
          margin: 0;
          color: #667085;
          font-size: 15px;
          line-height: 1.7;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }

        .category {
          min-height: 150px;
          padding: 25px;
          display: flex;
          align-items: center;
          gap: 18px;
          border: 1px solid #e4e7ec;
          border-radius: 20px;
          background: white;
          color: inherit;
          text-decoration: none;
          box-shadow: 0 10px 25px rgba(16, 24, 40, 0.04);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }

        .category:hover {
          transform: translateY(-3px);
          border-color: #b2ccff;
          box-shadow: 0 18px 35px rgba(16, 24, 40, 0.08);
        }

        .icon {
          width: 72px;
          height: 72px;
          flex: 0 0 72px;
          display: grid;
          place-items: center;
          border-radius: 20px;
          background: linear-gradient(
            135deg,
            #eef4ff,
            #f0edff
          );
          font-size: 37px;
        }

        .categoryText {
          flex: 1;
        }

        .category h2 {
          margin: 0 0 7px;
          font-size: 22px;
        }

        .category p {
          margin: 0;
          color: #667085;
          font-size: 13px;
          line-height: 1.55;
        }

        .arrow {
          margin-left: auto;
          color: #1465e8;
          font-size: 24px;
          font-weight: 900;
        }

        @media (max-width: 720px) {
          .grid {
            grid-template-columns: 1fr;
          }

          .heading h1 {
            font-size: 36px;
          }
        }

        @media (max-width: 480px) {
          .category {
            padding: 20px;
          }

          .icon {
            width: 60px;
            height: 60px;
            flex-basis: 60px;
            font-size: 31px;
          }
        }
      `}</style>
    </main>
  );
}
