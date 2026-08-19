"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

async function sha256(value: string) {
  const data = new TextEncoder().encode(value);

  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    data
  );

  return Array.from(
    new Uint8Array(hashBuffer)
  )
    .map((byte) =>
      byte.toString(16).padStart(2, "0")
    )
    .join("");
}

export default function SecurityPage() {
  const [lang, setLang] =
    useState<Lang>("ka");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [personalId, setPersonalId] =
    useState("");

  const [confirmPersonalId, setConfirmPersonalId] =
    useState("");

  const [codeWord, setCodeWord] =
    useState("");

  const [confirmCodeWord, setConfirmCodeWord] =
    useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const ka = lang === "ka";

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        window.location.href =
          "/login";

        return;
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateSecurity(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanPersonalId =
      personalId.trim();

    const cleanConfirmPersonalId =
      confirmPersonalId.trim();

    const cleanCodeWord =
      codeWord.trim();

    const cleanConfirmCodeWord =
      confirmCodeWord.trim();

    if (
      !cleanPersonalId &&
      !cleanCodeWord
    ) {
      setError(
        ka
          ? "შეიყვანეთ პირადი ნომერი ან ახალი კოდური სიტყვა."
          : "Enter a personal ID or a new code word."
      );

      return;
    }

    if (cleanPersonalId) {
      if (
        cleanPersonalId !==
        cleanConfirmPersonalId
      ) {
        setError(
          ka
            ? "პირადი ნომრები ერთმანეთს არ ემთხვევა."
            : "Personal ID values do not match."
        );

        return;
      }
    }

    if (cleanCodeWord) {
      if (
        cleanCodeWord.length < 4
      ) {
        setError(
          ka
            ? "კოდური სიტყვა უნდა შეიცავდეს მინიმუმ 4 სიმბოლოს."
            : "Code word must contain at least 4 characters."
        );

        return;
      }

      if (
        cleanCodeWord !==
        cleanConfirmCodeWord
      ) {
        setError(
          ka
            ? "კოდური სიტყვები ერთმანეთს არ ემთხვევა."
            : "Code words do not match."
        );

        return;
      }
    }

    setSaving(true);

    try {
      const {
        data: { user },
        error: userError,
      } =
        await supabase.auth.getUser();

      if (
        userError ||
        !user
      ) {
        window.location.href =
          "/login";

        return;
      }

      const updates: Record<
        string,
        unknown
      > = {
        updated_at:
          new Date().toISOString(),
      };

      if (cleanPersonalId) {
        updates.personal_id_hash =
          await sha256(
            cleanPersonalId.toLowerCase()
          );
      }

      if (cleanCodeWord) {
        updates.code_word_hash =
          await sha256(
            cleanCodeWord.toLowerCase()
          );
      }

      const {
        error: updateError,
      } =
        await supabase
          .from("owner_accounts")
          .update(updates)
          .eq(
            "user_id",
            user.id
          );

      if (updateError) {
        throw updateError;
      }

      setPersonalId("");
      setConfirmPersonalId("");
      setCodeWord("");
      setConfirmCodeWord("");

      setSuccess(
        ka
          ? "უსაფრთხოების ინფორმაცია წარმატებით განახლდა."
          : "Security information updated successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "უსაფრთხოების ინფორმაციის განახლება ვერ მოხერხდა."
          : "Could not update security information."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="statePage">
        {ka
          ? "იტვირთება..."
          : "Loading..."}
      </main>
    );
  }

  return (
    <main className="page">
      <header className="header">
        <a
          href="/account"
          className="brand"
        >
          <div className="logo">
            QR
          </div>

          <div>
            <strong>
              QR RETURN
            </strong>

            <small>
              ACCOUNT SECURITY
            </small>
          </div>
        </a>

        <div className="languages">
          <button
            type="button"
            className={
              ka
                ? "active"
                : ""
            }
            onClick={() =>
              setLang("ka")
            }
          >
            GEO
          </button>

          <button
            type="button"
            className={
              !ka
                ? "active"
                : ""
            }
            onClick={() =>
              setLang("en")
            }
          >
            ENG
          </button>
        </div>
      </header>

      <section className="container">
        <a
          href="/account"
          className="back"
        >
          ←{" "}
          {ka
            ? "მფლობელის პროფილი"
            : "Owner profile"}
        </a>

        <div className="heading">
          <div className="securityIcon">
            🔐
          </div>

          <div>
            <div className="eyebrow">
              {ka
                ? "ანგარიშის უსაფრთხოება"
                : "ACCOUNT SECURITY"}
            </div>

            <h1>
              {ka
                ? "იდენტიფიკაციის მონაცემები"
                : "Identity verification"}
            </h1>

            <p>
              {ka
                ? "პირადი ნომერი და კოდური სიტყვა მპოვნელისთვის არასდროს გამოჩნდება და გამოიყენება მხოლოდ ანგარიშის იდენტიფიკაციისთვის."
                : "Your personal ID and code word are never shown to finders and are used only for account identity verification."}
            </p>
          </div>
        </div>

        <div className="importantNotice">
          <span>
            🛡️
          </span>

          <div>
            <strong>
              {ka
                ? "დაცული ინფორმაცია"
                : "Protected information"}
            </strong>

            <p>
              {ka
                ? "არსებული პირადი ნომერი და კოდური სიტყვა აქ არ ჩანს. შეგიძლიათ მხოლოდ ახალი მნიშვნელობით ჩაანაცვლოთ."
                : "Your existing personal ID and code word are not displayed here. You can only replace them with new values."}
            </p>
          </div>
        </div>

        <form
          onSubmit={
            updateSecurity
          }
        >
          <section className="card">
            <div className="sectionTitle">
              <span>
                01
              </span>

              <div>
                <h2>
                  {ka
                    ? "პირადი ნომრის შეცვლა"
                    : "Update Personal ID"}
                </h2>

                <p>
                  {ka
                    ? "თუ პირადი ნომრის შეცვლა არ გსურთ, ეს ველები ცარიელი დატოვეთ."
                    : "Leave these fields empty if you do not want to change your personal ID."}
                </p>
              </div>
            </div>

            <label>
              <span>
                {ka
                  ? "ახალი პირადი ნომერი"
                  : "New personal ID"}
              </span>

              <input
                type="password"
                value={
                  personalId
                }
                onChange={(
                  e
                ) =>
                  setPersonalId(
                    e.target
                      .value
                  )
                }
                autoComplete="off"
              />
            </label>

            <label>
              <span>
                {ka
                  ? "გაიმეორეთ პირადი ნომერი"
                  : "Confirm personal ID"}
              </span>

              <input
                type="password"
                value={
                  confirmPersonalId
                }
                onChange={(
                  e
                ) =>
                  setConfirmPersonalId(
                    e.target
                      .value
                  )
                }
                autoComplete="off"
              />
            </label>
          </section>

          <section className="card">
            <div className="sectionTitle">
              <span>
                02
              </span>

              <div>
                <h2>
                  {ka
                    ? "კოდური სიტყვის შეცვლა"
                    : "Update Code Word"}
                </h2>

                <p>
                  {ka
                    ? "აირჩიეთ ისეთი სიტყვა, რომელიც თქვენთვის ადვილი დასამახსოვრებელია, მაგრამ სხვებისთვის რთული გამოსაცნობი."
                    : "Choose something memorable to you but difficult for others to guess."}
                </p>
              </div>
            </div>

            <label>
              <span>
                {ka
                  ? "ახალი კოდური სიტყვა"
                  : "New code word"}
              </span>

              <input
                type="password"
                value={
                  codeWord
                }
                onChange={(
                  e
                ) =>
                  setCodeWord(
                    e.target
                      .value
                  )
                }
                autoComplete="off"
              />
            </label>

            <label>
              <span>
                {ka
                  ? "გაიმეორეთ კოდური სიტყვა"
                  : "Confirm code word"}
              </span>

              <input
                type="password"
                value={
                  confirmCodeWord
                }
                onChange={(
                  e
                ) =>
                  setConfirmCodeWord(
                    e.target
                      .value
                  )
                }
                autoComplete="off"
              />
            </label>
          </section>

          <section className="card lockedCard">
            <div className="sectionTitle">
              <span>
                03
              </span>

              <div>
                <h2>
                  {ka
                    ? "პაროლის აღდგენა"
                    : "Password recovery"}
                </h2>

                <p>
                  {ka
                    ? "Email verification/reset ფუნქციას შემდეგ ეტაპზე ჩავრთავთ. მანამდე პაროლის ავტომატური შეცვლა კოდური სიტყვით არ იმუშავებს."
                    : "Email verification/reset will be enabled later. Automatic password reset using only the code word is intentionally disabled for now."}
                </p>
              </div>
            </div>

            <div className="comingSoon">
              🔒{" "}
              {ka
                ? "Email Reset — მოგვიანებით გააქტიურდება"
                : "Email Reset — coming later"}
            </div>
          </section>

          {error && (
            <div className="errorBox">
              {error}
            </div>
          )}

          {success && (
            <div className="successBox">
              ✓ {success}
            </div>
          )}

          <div className="actions">
            <a href="/account">
              {ka
                ? "გაუქმება"
                : "Cancel"}
            </a>

            <button
              type="submit"
              disabled={
                saving
              }
            >
              {saving
                ? ka
                  ? "ინახება..."
                  : "Saving..."
                : ka
                ? "უსაფრთხოების მონაცემების შენახვა"
                : "Save security information"}
            </button>
          </div>
        </form>
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
          color: #101828;
          font-family: Inter, Arial, sans-serif;
        }

        input,
        button {
          font: inherit;
        }

        .page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 8% 10%,
              rgba(20, 101, 232, 0.07),
              transparent 28%
            ),
            radial-gradient(
              circle at 94% 8%,
              rgba(118, 85, 247, 0.07),
              transparent 28%
            ),
            #f7f9fc;
        }

        .statePage {
          min-height: 100vh;
          display: grid;
          place-items: center;
          color: #667085;
        }

        .header {
          width: calc(100% - 36px);
          max-width: 950px;
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
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.6px;
        }

        .languages {
          padding: 4px;
          display: flex;
          border-radius: 10px;
          background: #eaecf0;
        }

        .languages button {
          padding: 8px 10px;
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
          max-width: 800px;
          margin: auto;
          padding: 50px 0 90px;
        }

        .back {
          color: #667085;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        .heading {
          margin: 36px 0 25px;
          display: flex;
          align-items: center;
          gap: 17px;
        }

        .securityIcon {
          width: 70px;
          height: 70px;
          flex: 0 0 70px;
          display: grid;
          place-items: center;
          border-radius: 19px;
          background: linear-gradient(
            135deg,
            #eef4ff,
            #f0edff
          );
          font-size: 33px;
        }

        .eyebrow {
          color: #7655f7;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .heading h1 {
          margin: 6px 0;
          font-size: 34px;
        }

        .heading p {
          margin: 0;
          color: #667085;
          font-size: 12px;
          line-height: 1.6;
        }

        .importantNotice {
          margin-bottom: 20px;
          padding: 16px;
          display: flex;
          align-items: flex-start;
          gap: 11px;
          border: 1px solid #dbe7ff;
          border-radius: 14px;
          background: #f5f9ff;
        }

        .importantNotice strong {
          font-size: 12px;
        }

        .importantNotice p {
          margin: 4px 0 0;
          color: #667085;
          font-size: 10px;
          line-height: 1.55;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .card {
          padding: 27px;
          border: 1px solid #e4e7ec;
          border-radius: 20px;
          background: white;
        }

        .lockedCard {
          background: #fafbfc;
        }

        .sectionTitle {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .sectionTitle > span {
          width: 31px;
          height: 31px;
          flex: 0 0 31px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: #eef4ff;
          color: #1465e8;
          font-size: 9px;
          font-weight: 900;
        }

        .sectionTitle h2 {
          margin: 0;
          font-size: 20px;
        }

        .sectionTitle p {
          margin: 5px 0 0;
          color: #667085;
          font-size: 10px;
          line-height: 1.5;
        }

        label {
          display: block;
          margin-top: 18px;
        }

        label > span {
          display: block;
          margin-bottom: 7px;
          color: #475467;
          font-size: 12px;
          font-weight: 800;
        }

        input {
          width: 100%;
          height: 50px;
          padding: 0 13px;
          border: 1px solid #d0d5dd;
          border-radius: 10px;
          background: white;
          outline: none;
        }

        input:focus {
          border-color: #84adff;
          box-shadow:
            0 0 0 3px rgba(20, 101, 232, 0.08);
        }

        .comingSoon {
          margin-top: 18px;
          padding: 13px;
          border-radius: 10px;
          background: #f2f4f7;
          color: #667085;
          font-size: 11px;
          font-weight: 800;
        }

        .errorBox,
        .successBox {
          padding: 13px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 800;
        }

        .errorBox {
          border: 1px solid #fecdca;
          background: #fff1f0;
          color: #b42318;
        }

        .successBox {
          border: 1px solid #abefc6;
          background: #ecfdf3;
          color: #027a48;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .actions a,
        .actions button {
          min-height: 48px;
          padding: 0 17px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 900;
          text-decoration: none;
        }

        .actions a {
          color: #667085;
        }

        .actions button {
          border: 0;
          background: linear-gradient(
            135deg,
            #1465e8,
            #7655f7
          );
          color: white;
          cursor: pointer;
        }

        .actions button:disabled {
          opacity: 0.65;
        }

        @media (max-width: 600px) {
          .heading {
            align-items: flex-start;
          }

          .heading h1 {
            font-size: 28px;
          }

          .card {
            padding: 21px;
          }
        }
      `}</style>
    </main>
  );
}
