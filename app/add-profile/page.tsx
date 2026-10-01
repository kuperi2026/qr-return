"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type Category = {
  type: "dog" | "cat" | "keys" | "wallet" | "bag" | "suitcase";
  icon: string;
  ka: string;
  en: string;
  kaDescription: string;
  enDescription: string;
};

const categories: Category[] = [
  {
    type: "dog",
    icon: "🐶",
    ka: "ძაღლი",
    en: "Dog",
    kaDescription: "დაარეგისტრირეთ ძაღლისთვის შეძენილი QR კოდი.",
    enDescription: "Register a QR code purchased for your dog.",
  },
  {
    type: "cat",
    icon: "🐱",
    ka: "კატა",
    en: "Cat",
    kaDescription: "დაარეგისტრირეთ კატისთვის შეძენილი QR კოდი.",
    enDescription: "Register a QR code purchased for your cat.",
  },
  {
    type: "keys",
    icon: "🔑",
    ka: "გასაღები",
    en: "Keys",
    kaDescription: "დაარეგისტრირეთ გასაღებისთვის შეძენილი QR კოდი.",
    enDescription: "Register a QR code purchased for your keys.",
  },
  {
    type: "wallet",
    icon: "👛",
    ka: "საფულე",
    en: "Wallet",
    kaDescription: "დაარეგისტრირეთ საფულისთვის შეძენილი QR კოდი.",
    enDescription: "Register a QR code purchased for your wallet.",
  },
  {
    type: "bag",
    icon: "👜",
    ka: "ჩანთა",
    en: "Bag",
    kaDescription: "დაარეგისტრირეთ ჩანთისთვის შეძენილი QR კოდი.",
    enDescription: "Register a QR code purchased for your bag.",
  },
  {
    type: "suitcase",
    icon: "🧳",
    ka: "ჩემოდანი",
    en: "Suitcase",
    kaDescription: "დაარეგისტრირეთ ჩემოდნისთვის შეძენილი QR კოდი.",
    enDescription: "Register a QR code purchased for your suitcase.",
  },
];

export default function AddProfilePage() {
  const [lang, setLang] = useState<Lang>("ka");
  const [loading, setLoading] = useState(true);

  const ka = lang === "ka";

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      window.location.href = "/login";
      return;
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <main className="statePage">
        {ka ? "იტვირთება..." : "Loading..."}
      </main>
    );
  }

  return (
    <main className="page">
      <header className="header">
        <a href="/account" className="brand">
          <div className="logo">QR</div>

          <div>
            <strong>QR RETURN</strong>
            <small>ADD QR PROFILE</small>
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
        <a href="/account" className="back">
          ← {ka ? "მფლობელის პროფილი" : "Owner profile"}
        </a>

        <div className="heading">
          <div className="eyebrow">
            {ka ? "ახალი QR პროფილი" : "NEW QR PROFILE"}
          </div>

          <h1>
            {ka
              ? "აირჩიეთ შესაბამისი ნივთი ან ცხოველი"
              : "Choose the item or pet"}
          </h1>

          <p>
            {ka
              ? "აირჩიეთ, რომელ ნივთს ან ცხოველს უკავშირებთ QR RETURN კოდს. თითოეულ QR კოდს თავისი ცალკე პროფილი ექნება."
              : "Choose the item or pet you want to connect to your QR RETURN code. Each QR code has its own separate profile."}
          </p>
        </div>

        <div className="importantNote">
          <div className="noteIcon">🔒</div>

          <div>
            <strong>
              {ka
                ? "პროფილის ტიპი შექმნის შემდეგ აღარ იცვლება"
                : "Profile type is locked after creation"}
            </strong>

            <p>
              {ka
                ? "მაგალითად, ძაღლის QR პროფილს კატად ვერ გადააკეთებთ, თუმცა იგივე ძაღლის პროფილში ყველა მონაცემის რედაქტირება შეგეძლებათ."
                : "For example, a dog QR profile cannot later become a cat profile, but all dog profile details can still be edited."}
            </p>
          </div>
        </div>

        <div className="grid">
          {categories.map((category) => (
            <a
              key={category.type}
              href={`/register-item/${category.type}`}
              className="categoryCard"
            >
              <div className="icon">{category.icon}</div>

              <div className="categoryContent">
                <div className="categoryNumber">
                  QR RETURN
                </div>

                <h2>
                  {ka ? category.ka : category.en}
                </h2>

                <p>
                  {ka
                    ? category.kaDescription
                    : category.enDescription}
                </p>
              </div>

              <div className="arrow">→</div>
            </a>
          ))}
        </div>

        <div className="bottomInfo">
          <div>
            <strong>
              {ka ? "ერთი ანგარიში" : "One account"}
            </strong>

            <p>
              {ka
                ? "ერთ Owner Account-ზე შეგიძლიათ დაამატოთ რამდენიც გსურთ იმდენი ცალკე QR პროფილი."
                : "You can add as many separate QR profiles as you need under one Owner Account."}
            </p>
          </div>

          <a href="/account">
            {ka ? "ჩემი QR პროფილები" : "My QR profiles"} →
          </a>
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

        .page {
          min-height: 100vh;
          color: #101828;
          font-family: Inter, Arial, sans-serif;
          background:
            radial-gradient(
              circle at 8% 10%,
              rgba(20, 101, 232, 0.08),
              transparent 28%
            ),
            radial-gradient(
              circle at 94% 8%,
              rgba(118, 85, 247, 0.08),
              transparent 28%
            ),
            #f7f9fc;
        }

        .statePage {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 30px;
          background: #f7f9fc;
          color: #667085;
          font-family: Inter, Arial, sans-serif;
        }

        .header {
          width: calc(100% - 36px);
          max-width: 1050px;
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

        .languages .active {
          background: white;
          color: #1465e8;
        }

        .container {
          width: calc(100% - 36px);
          max-width: 980px;
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
          margin: 38px 0 25px;
        }

        .eyebrow {
          color: #7655f7;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1.6px;
        }

        .heading h1 {
          margin: 9px 0 12px;
          font-size: clamp(39px, 5vw, 52px);
          line-height: 1.06;
          letter-spacing: -2px;
        }

        .heading p {
          margin: 0;
          color: #667085;
          font-size: 15px;
          line-height: 1.7;
        }

        .importantNote {
          margin-bottom: 28px;
          padding: 17px;
          display: flex;
          gap: 13px;
          align-items: flex-start;
          border: 1px solid #dbe7ff;
          border-radius: 15px;
          background: #f5f9ff;
        }

        .noteIcon {
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: white;
        }

        .importantNote strong {
          color: #344054;
          font-size: 13px;
        }

        .importantNote p {
          margin: 5px 0 0;
          color: #667085;
          font-size: 12px;
          line-height: 1.55;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }

        .categoryCard {
          min-height: 155px;
          padding: 23px;
          display: flex;
          align-items: center;
          gap: 18px;
          border: 1px solid #e4e7ec;
          border-radius: 20px;
          background: white;
          color: inherit;
          text-decoration: none;
          box-shadow: 0 10px 28px rgba(16, 24, 40, 0.04);
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .categoryCard:hover {
          transform: translateY(-3px);
          border-color: #b2ccff;
          box-shadow: 0 18px 38px rgba(16, 24, 40, 0.08);
        }

        .icon {
          width: 76px;
          height: 76px;
          flex: 0 0 76px;
          display: grid;
          place-items: center;
          border-radius: 20px;
          background: linear-gradient(
            135deg,
            #eef4ff,
            #f0edff
          );
          font-size: 39px;
        }

        .categoryContent {
          flex: 1;
        }

        .categoryNumber {
          color: #7655f7;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.3px;
        }

        .categoryContent h2 {
          margin: 5px 0 7px;
          font-size: 22px;
        }

        .categoryContent p {
          margin: 0;
          color: #667085;
          font-size: 12px;
          line-height: 1.55;
        }

        .arrow {
          color: #1465e8;
          font-size: 23px;
          font-weight: 900;
        }

        .bottomInfo {
          margin-top: 28px;
          padding: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border: 1px solid #e4e7ec;
          border-radius: 16px;
          background: white;
        }

        .bottomInfo strong {
          font-size: 13px;
        }

        .bottomInfo p {
          margin: 4px 0 0;
          color: #667085;
          font-size: 11px;
          line-height: 1.5;
        }

        .bottomInfo a {
          flex: 0 0 auto;
          color: #1465e8;
          font-size: 12px;
          font-weight: 900;
          text-decoration: none;
        }

        @media (max-width: 720px) {
          .grid {
            grid-template-columns: 1fr;
          }

          .heading h1 {
            font-size: 36px;
          }
        }

        @media (max-width: 520px) {
          .categoryCard {
            padding: 19px;
          }

          .icon {
            width: 62px;
            height: 62px;
            flex-basis: 62px;
            font-size: 31px;
          }

          .bottomInfo {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}
