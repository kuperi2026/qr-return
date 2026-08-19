"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type QRProfile = {
  id: number | string;
  tag_code: string | null;
  category: string | null;
  title: string | null;
  pet_name: string | null;
  brand: string | null;
  color: string | null;
  active: boolean | null;
  owner_id: string | null;
  created_at?: string | null;
};

const categories = [
  {
    key: "dog",
    icon: "🐕",
    ka: "ძაღლი",
    en: "Dog",
  },
  {
    key: "cat",
    icon: "🐈",
    ka: "კატა",
    en: "Cat",
  },
  {
    key: "keys",
    icon: "🔑",
    ka: "გასაღები",
    en: "Keys",
  },
  {
    key: "wallet",
    icon: "👛",
    ka: "საფულე",
    en: "Wallet",
  },
  {
    key: "suitcase",
    icon: "🧳",
    ka: "ჩემოდანი",
    en: "Suitcase",
  },
  {
    key: "bag",
    icon: "👜",
    ka: "ჩანთა",
    en: "Bag",
  },
];

function getCategoryIcon(category: string | null) {
  const value = (category || "").toLowerCase();

  if (value.includes("dog")) return "🐕";
  if (value.includes("cat")) return "🐈";
  if (value.includes("key")) return "🔑";
  if (value.includes("wallet")) return "👛";
  if (
    value.includes("suitcase") ||
    value.includes("luggage")
  )
    return "🧳";
  if (value.includes("bag")) return "👜";

  return "🏷️";
}

function getProfileName(profile: QRProfile, ka: boolean) {
  return (
    profile.pet_name ||
    profile.title ||
    profile.brand ||
    (ka ? "QR პროფილი" : "QR Profile")
  );
}

export default function MyProfilesPage() {
  const [lang, setLang] = useState<Lang>("ka");
  const [profiles, setProfiles] = useState<QRProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const ka = lang === "ka";

  useEffect(() => {
    async function loadProfiles() {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setLoggedIn(false);
        setLoading(false);
        return;
      }

      setLoggedIn(true);

      const { data, error: profileError } = await supabase
        .from("qr_profiles")
        .select(
          "id, tag_code, category, title, pet_name, brand, color, active, owner_id, created_at"
        )
        .eq("owner_id", user.id)
        .order("id", { ascending: false });

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }

      setProfiles((data || []) as QRProfile[]);
      setLoading(false);
    }

    void loadProfiles();
  }, []);

  if (loading) {
    return (
      <main className="statePage">
        <div className="loader" />
        <strong>
          {ka
            ? "თქვენი QR პროფილები იტვირთება..."
            : "Loading your QR profiles..."}
        </strong>

        <Styles />
      </main>
    );
  }

  if (!loggedIn) {
    return (
      <main className="statePage">
        <div className="stateLogo">QR</div>

        <h1>
          {ka ? "ჯერ გაიარეთ ავტორიზაცია" : "Please sign in first"}
        </h1>

        <p>
          {ka
            ? "QR პროფილის შექმნამდე მომხმარებელს უნდა ჰქონდეს QR RETURN ანგარიში."
            : "You need a QR RETURN account before creating QR profiles."}
        </p>

        <div className="stateButtons">
          <a href="/login">
            {ka ? "შესვლა" : "Sign in"}
          </a>

          <a href="/register" className="secondary">
            {ka ? "რეგისტრაცია" : "Register"}
          </a>
        </div>

        <Styles />
      </main>
    );
  }

  return (
    <main className="page">
      <header className="header">
        <a href="/" className="brand">
          <div className="brandLogo">QR</div>

          <div>
            <strong>QR RETURN</strong>
            <small>MY QR PROFILES</small>
          </div>
        </a>

        <div className="headerRight">
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
        </div>
      </header>

      <section className="content">
        <div className="hero">
          <div>
            <span className="eyebrow">
              {ka ? "ჩემი ანგარიში" : "MY ACCOUNT"}
            </span>

            <h1>
              {ka ? "ჩემი QR პროფილები" : "My QR Profiles"}
            </h1>

            <p>
              {ka
                ? "მართეთ თქვენი ცხოველები და ნივთები ერთი ანგარიშიდან. თითოეულ პროფილს აქვს საკუთარი QR კოდი."
                : "Manage your pets and belongings from one account. Each profile has its own QR code."}
            </p>
          </div>

          <button
            type="button"
            className="addButton"
            onClick={() => setShowAdd(true)}
          >
            <span>＋</span>
            {ka ? "ახალი QR პროფილი" : "Add QR Profile"}
          </button>
        </div>

        <div className="stats">
          <div>
            <strong>{profiles.length}</strong>
            <span>
              {ka ? "QR პროფილი" : "QR Profiles"}
            </span>
          </div>

          <div>
            <strong>
              {profiles.filter((profile) => profile.active).length}
            </strong>
            <span>
              {ka ? "აქტიური" : "Active"}
            </span>
          </div>
        </div>

        {error && (
          <div className="errorBox">
            ⚠ {error}
          </div>
        )}

        {profiles.length === 0 ? (
          <section className="empty">
            <div className="emptyIcons">
              <span>🐕</span>
              <span>🐈</span>
              <span>🧳</span>
            </div>

            <h2>
              {ka
                ? "ჯერ არცერთი QR პროფილი არ გაქვთ"
                : "You don't have any QR profiles yet"}
            </h2>

            <p>
              {ka
                ? "დაამატეთ თქვენი პირველი ცხოველი ან ნივთი და მიაბით მას საკუთარი QR კოდი."
                : "Add your first pet or item and connect its own QR code."}
            </p>

            <button
              type="button"
              onClick={() => setShowAdd(true)}
            >
              ＋ {ka ? "პირველი პროფილის დამატება" : "Add first profile"}
            </button>
          </section>
        ) : (
          <section className="profileGrid">
            {profiles.map((profile) => (
              <article className="profileCard" key={profile.id}>
                <div className="profileTop">
                  <div className="profileIcon">
                    {getCategoryIcon(profile.category)}
                  </div>

                  <span
                    className={
                      profile.active
                        ? "status active"
                        : "status"
                    }
                  >
                    {profile.active
                      ? ka
                        ? "აქტიური"
                        : "Active"
                      : ka
                      ? "არააქტიური"
                      : "Inactive"}
                  </span>
                </div>

                <h2>{getProfileName(profile, ka)}</h2>

                <p className="category">
                  {profile.category || (ka ? "QR პროფილი" : "QR Profile")}
                </p>

                <div className="codeBox">
                  <span>QR CODE</span>
                  <strong>{profile.tag_code || "—"}</strong>
                </div>

                <div className="cardActions">
                  <a href={`/profile/${profile.id}`}>
                    {ka ? "პროფილის ნახვა" : "View profile"}
                  </a>

                  <a
                    href={`/profile/${profile.id}/edit`}
                    className="edit"
                  >
                    ✎ {ka ? "რედაქტირება" : "Edit"}
                  </a>
                </div>
              </article>
            ))}

            <button
              type="button"
              className="addCard"
              onClick={() => setShowAdd(true)}
            >
              <span>＋</span>
              <strong>
                {ka ? "ახალი QR პროფილი" : "Add QR Profile"}
              </strong>
              <small>
                {ka
                  ? "დაამატეთ სხვა ცხოველი ან ნივთი"
                  : "Add another pet or item"}
              </small>
            </button>
          </section>
        )}
      </section>

      {showAdd && (
        <div
          className="modalBackdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowAdd(false);
            }
          }}
        >
          <section className="modal">
            <div className="modalHeader">
              <div>
                <span>QR RETURN</span>
                <h2>
                  {ka
                    ? "რისი დამატება გსურთ?"
                    : "What would you like to add?"}
                </h2>
              </div>

              <button
                type="button"
                className="closeButton"
                onClick={() => setShowAdd(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <p className="modalText">
              {ka
                ? "აირჩიეთ პროფილის ტიპი. თითოეული ცხოველი ან ნივთი ცალკე რეგისტრირდება და მიიღებს საკუთარ QR კოდს."
                : "Choose a profile type. Every pet or item is registered separately and gets its own QR code."}
            </p>

            <div className="categoryGrid">
              {categories.map((category) => (
                <a
                  key={category.key}
                  href={`/register?type=${category.key}`}
                  className="categoryCard"
                >
                  <span>{category.icon}</span>

                  <strong>
                    {ka ? category.ka : category.en}
                  </strong>

                  <small>＋</small>
                </a>
              ))}
            </div>

            <div className="modalFooter">
              🔐{" "}
              {ka
                ? "ახალი პროფილი თქვენს ანგარიშს ავტომატურად მიებმება."
                : "The new profile will be linked to your account."}
            </div>
          </section>
        </div>
      )}

      <Styles />
    </main>
  );
}

function Styles() {
  return (
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
            circle at 92% 5%,
            rgba(118, 85, 247, 0.09),
            transparent 25%
          ),
          #f7f9fc;
      }

      .header {
        width: calc(100% - 36px);
        max-width: 1180px;
        min-height: 78px;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e4e7ec;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 11px;
        text-decoration: none;
      }

      .brandLogo {
        width: 45px;
        height: 45px;
        display: grid;
        place-items: center;
        border-radius: 13px;
        background: linear-gradient(135deg, #1465e8, #7655f7);
        color: white;
        font-size: 12px;
        font-weight: 900;
        box-shadow: 0 8px 22px rgba(20, 101, 232, 0.2);
      }

      .brand strong,
      .brand small {
        display: block;
      }

      .brand strong {
        color: #1465e8;
        font-size: 18px;
        font-weight: 900;
      }

      .brand small {
        margin-top: 3px;
        color: #7655f7;
        font-size: 8px;
        font-weight: 900;
        letter-spacing: 1.7px;
      }

      .languages {
        padding: 4px;
        display: flex;
        border-radius: 9px;
        background: #eaecf0;
      }

      .languages button {
        padding: 7px 9px;
        border: 0;
        border-radius: 7px;
        background: transparent;
        color: #667085;
        font-size: 9px;
        font-weight: 900;
        cursor: pointer;
      }

      .languages button.active {
        background: white;
        color: #1465e8;
      }

      .content {
        width: calc(100% - 36px);
        max-width: 1080px;
        margin: auto;
        padding: 55px 0 80px;
      }

      .hero {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 30px;
      }

      .hero > div {
        max-width: 680px;
      }

      .eyebrow {
        color: #7655f7;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 1.8px;
        text-transform: uppercase;
      }

      .hero h1 {
        margin: 9px 0 10px;
        font-size: clamp(34px, 5vw, 50px);
        letter-spacing: -2px;
      }

      .hero p {
        margin: 0;
        color: #667085;
        font-size: 14px;
        line-height: 1.65;
      }

      .addButton {
        min-height: 48px;
        padding: 0 18px;
        display: flex;
        align-items: center;
        gap: 8px;
        border: 0;
        border-radius: 12px;
        background: linear-gradient(135deg, #1465e8, #7655f7);
        color: white;
        font-size: 11px;
        font-weight: 900;
        cursor: pointer;
        box-shadow: 0 10px 28px rgba(20, 101, 232, 0.2);
        white-space: nowrap;
      }

      .addButton span {
        font-size: 19px;
      }

      .stats {
        margin-top: 32px;
        display: flex;
        gap: 10px;
      }

      .stats > div {
        min-width: 120px;
        padding: 13px 16px;
        border: 1px solid #e4e7ec;
        border-radius: 13px;
        background: white;
      }

      .stats strong,
      .stats span {
        display: block;
      }

      .stats strong {
        color: #1465e8;
        font-size: 22px;
      }

      .stats span {
        margin-top: 2px;
        color: #667085;
        font-size: 9px;
      }

      .empty {
        margin-top: 28px;
        min-height: 350px;
        padding: 45px 25px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 1px dashed #cfd4dc;
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.72);
        text-align: center;
      }

      .emptyIcons {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .emptyIcons span {
        width: 55px;
        height: 55px;
        margin-left: -8px;
        display: grid;
        place-items: center;
        border: 4px solid #f7f9fc;
        border-radius: 50%;
        background: #eef4ff;
        font-size: 25px;
      }

      .emptyIcons span:first-child {
        margin-left: 0;
      }

      .empty h2 {
        margin: 20px 0 8px;
        color: #344054;
        font-size: 21px;
      }

      .empty p {
        max-width: 500px;
        margin: 0;
        color: #667085;
        font-size: 12px;
        line-height: 1.6;
      }

      .empty button {
        margin-top: 20px;
        min-height: 44px;
        padding: 0 16px;
        border: 0;
        border-radius: 11px;
        background: #1465e8;
        color: white;
        font-size: 10px;
        font-weight: 900;
        cursor: pointer;
      }

      .profileGrid {
        margin-top: 28px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;
      }

      .profileCard,
      .addCard {
        min-height: 270px;
        border: 1px solid #e4e7ec;
        border-radius: 19px;
        background: white;
      }

      .profileCard {
        padding: 20px;
        box-shadow: 0 9px 30px rgba(16, 24, 40, 0.04);
      }

      .profileTop {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
      }

      .profileIcon {
        width: 53px;
        height: 53px;
        display: grid;
        place-items: center;
        border-radius: 15px;
        background: #eef4ff;
        font-size: 27px;
      }

      .status {
        padding: 5px 8px;
        border-radius: 20px;
        background: #f2f4f7;
        color: #667085;
        font-size: 8px;
        font-weight: 800;
      }

      .status.active {
        background: #ecfdf3;
        color: #067647;
      }

      .profileCard h2 {
        margin: 18px 0 4px;
        color: #344054;
        font-size: 20px;
      }

      .category {
        margin: 0;
        color: #98a2b3;
        font-size: 9px;
        text-transform: capitalize;
      }

      .codeBox {
        margin-top: 18px;
        padding: 11px;
        border-radius: 10px;
        background: #f7f9fc;
      }

      .codeBox span,
      .codeBox strong {
        display: block;
      }

      .codeBox span {
        color: #98a2b3;
        font-size: 7px;
        font-weight: 900;
        letter-spacing: 1px;
      }

      .codeBox strong {
        margin-top: 3px;
        overflow: hidden;
        color: #475467;
        font-size: 10px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .cardActions {
        margin-top: 18px;
        display: flex;
        gap: 7px;
      }

      .cardActions a {
        flex: 1;
        min-height: 37px;
        display: grid;
        place-items: center;
        border-radius: 9px;
        background: #1465e8;
        color: white;
        font-size: 8px;
        font-weight: 900;
        text-decoration: none;
      }

      .cardActions a.edit {
        border: 1px solid #d0d5dd;
        background: white;
        color: #475467;
      }

      .addCard {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-style: dashed;
        color: #667085;
        cursor: pointer;
      }

      .addCard > span {
        width: 52px;
        height: 52px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: #eef4ff;
        color: #1465e8;
        font-size: 26px;
      }

      .addCard strong {
        margin-top: 13px;
        color: #344054;
        font-size: 12px;
      }

      .addCard small {
        margin-top: 5px;
        color: #98a2b3;
        font-size: 8px;
      }

      .modalBackdrop {
        position: fixed;
        inset: 0;
        z-index: 9999;
        padding: 20px;
        display: grid;
        place-items: center;
        background: rgba(16, 24, 40, 0.52);
        backdrop-filter: blur(5px);
      }

      .modal {
        width: 100%;
        max-width: 650px;
        max-height: 90vh;
        overflow-y: auto;
        padding: 25px;
        border-radius: 22px;
        background: white;
        box-shadow: 0 30px 80px rgba(16, 24, 40, 0.25);
      }

      .modalHeader {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 20px;
      }

      .modalHeader span {
        color: #7655f7;
        font-size: 8px;
        font-weight: 900;
        letter-spacing: 1.5px;
      }

      .modalHeader h2 {
        margin: 5px 0 0;
        color: #344054;
        font-size: 24px;
      }

      .closeButton {
        width: 36px;
        height: 36px;
        border: 0;
        border-radius: 50%;
        background: #f2f4f7;
        color: #667085;
        font-size: 22px;
        cursor: pointer;
      }

      .modalText {
        max-width: 540px;
        margin: 11px 0 20px;
        color: #667085;
        font-size: 11px;
        line-height: 1.55;
      }

      .categoryGrid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
      }

      .categoryCard {
        min-height: 125px;
        padding: 15px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 1px solid #e4e7ec;
        border-radius: 15px;
        background: #fff;
        color: #344054;
        text-decoration: none;
        transition: 0.18s ease;
      }

      .categoryCard:hover {
        border-color: #b2ccff;
        background: #f5f8ff;
        transform: translateY(-2px);
      }

      .categoryCard > span {
        font-size: 30px;
      }

      .categoryCard strong {
        margin-top: 8px;
        font-size: 11px;
      }

      .categoryCard small {
        position: absolute;
        top: 9px;
        right: 10px;
        color: #1465e8;
        font-size: 15px;
      }

      .modalFooter {
        margin-top: 17px;
        padding: 10px;
        border-radius: 9px;
        background: #f7f9fc;
        color: #667085;
        font-size: 8px;
        text-align: center;
      }

      .errorBox {
        margin-top: 20px;
        padding: 11px;
        border: 1px solid #fecdca;
        border-radius: 10px;
        background: #fff1f0;
        color: #b42318;
        font-size: 9px;
      }

      .statePage {
        min-height: 100vh;
        padding: 25px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #f7f9fc;
        color: #344054;
        font-family: Inter, Arial, sans-serif;
        text-align: center;
      }

      .stateLogo {
        width: 58px;
        height: 58px;
        display: grid;
        place-items: center;
        border-radius: 17px;
        background: linear-gradient(135deg, #1465e8, #7655f7);
        color: white;
        font-size: 14px;
        font-weight: 900;
      }

      .statePage h1 {
        margin: 18px 0 7px;
        font-size: 25px;
      }

      .statePage p {
        max-width: 450px;
        margin: 0;
        color: #667085;
        font-size: 12px;
        line-height: 1.6;
      }

      .stateButtons {
        margin-top: 20px;
        display: flex;
        gap: 8px;
      }

      .stateButtons a {
        padding: 11px 17px;
        border-radius: 10px;
        background: #1465e8;
        color: white;
        font-size: 10px;
        font-weight: 900;
        text-decoration: none;
      }

      .stateButtons a.secondary {
        border: 1px solid #d0d5dd;
        background: white;
        color: #475467;
      }

      .loader {
        width: 36px;
        height: 36px;
        margin-bottom: 12px;
        border: 3px solid #e4e7ec;
        border-top-color: #1465e8;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 850px) {
        .profileGrid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 650px) {
        .content {
          padding-top: 35px;
        }

        .hero {
          align-items: stretch;
          flex-direction: column;
        }

        .addButton {
          justify-content: center;
        }

        .profileGrid {
          grid-template-columns: 1fr;
        }

        .categoryGrid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `}</style>
  );
}
