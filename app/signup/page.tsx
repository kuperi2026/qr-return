"use client";

import { FormEvent, ReactNode, useState } from "react";
import { createClient } from "@supabase/supabase-js";

function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY;

  if (!url || !key) return null;

  return createClient(url, key);
}

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [codeWord, setCodeWord] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!firstName.trim()) {
      setErrorMessage("გთხოვთ მიუთითოთ სახელი.");
      return;
    }

    if (!lastName.trim()) {
      setErrorMessage("გთხოვთ მიუთითოთ გვარი.");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("გთხოვთ მიუთითოთ ელფოსტა.");
      return;
    }

    if (!phone.trim()) {
      setErrorMessage("გთხოვთ მიუთითოთ ტელეფონის ნომერი.");
      return;
    }

    if (!codeWord.trim()) {
      setErrorMessage("გთხოვთ მიუთითოთ კოდური სიტყვა.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage(
        "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("პაროლები ერთმანეთს არ ემთხვევა.");
      return;
    }

    const supabase = createSupabaseClient();

    if (!supabase) {
      setErrorMessage("Supabase კავშირი ვერ მოიძებნა.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,

        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: phone.trim(),
            code_word: codeWord.trim(),
          },
        },
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error("ანგარიშის შექმნა ვერ მოხერხდა.");
      }

      try {
        const { error: ownerError } = await supabase
          .from("owner_accounts")
          .upsert(
            {
              id: data.user.id,
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              email: email.trim().toLowerCase(),
              phone: phone.trim(),
            },
            {
              onConflict: "id",
            }
          );

        if (ownerError) {
          console.error("Owner account save:", ownerError);
        }
      } catch (ownerError) {
        console.error("Owner account save:", ownerError);
      }

      if (data.session) {
        window.location.assign("/account");
        return;
      }

      window.location.assign(
        `/login?registered=1&email=${encodeURIComponent(
          email.trim().toLowerCase()
        )}`
      );
    } catch (error) {
      console.error("Signup error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "ანგარიშის შექმნა ვერ მოხერხდა.";

      const lowerMessage = message.toLowerCase();

      if (
        lowerMessage.includes("already registered") ||
        lowerMessage.includes("already been registered")
      ) {
        setErrorMessage(
          "ამ ელფოსტით ანგარიში უკვე არსებობს. გთხოვთ შეხვიდეთ ანგარიშში."
        );
      } else {
        setErrorMessage(message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <main className="page">
        <div className="backgroundPattern" aria-hidden="true">
          <span className="qr qr1">QR</span>
          <span className="qr qr2">QR</span>
          <span className="qr qr3">QR</span>
          <span className="qr qr4">QR</span>
        </div>

        <header className="header">
          <a href="/" className="brand">
            <span className="brandMark">QR</span>

            <span className="brandText">
              <strong>QR RETURN</strong>
              <small>SMART QR CONNECTION</small>
            </span>
          </a>

          <a href="/login" className="loginTop">
            შესვლა
          </a>
        </header>

        <section className="content">
          <div className="intro">
            <span className="eyebrow">
              QR RETURN ACCOUNT
            </span>

            <h1>შექმენით ანგარიში</h1>

            <p className="introLead">
              ერთი ანგარიში — თქვენი ყველა QR პროფილი ერთ სივრცეში.
            </p>

            <div className="infoBox">
              <strong>
                მარტივად მართეთ ის, რაც თქვენთვის მნიშვნელოვანია.
              </strong>

              <p>
                ანგარიშის შექმნის შემდეგ დაამატეთ და მართეთ
                თქვენი QR პროფილები ერთი პირადი სივრციდან.
              </p>
            </div>

            <p className="slogan">
              ერთი სკანირება შეიძლება იყოს პირველი ნაბიჯი დაბრუნებამდე.
            </p>
          </div>

          <section className="formCard">
            <div className="formHeader">
              <span>CREATE ACCOUNT</span>

              <h2>მფლობელის რეგისტრაცია</h2>

              <p>
                შეავსეთ თქვენი ძირითადი ინფორმაცია ანგარიშის
                შესაქმნელად.
              </p>
            </div>

            {errorMessage && (
              <div className="errorBox" role="alert">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="formGrid">
                <Field label="სახელი" required>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoComplete="given-name"
                  />
                </Field>

                <Field label="გვარი" required>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    autoComplete="family-name"
                  />
                </Field>

                <Field label="ელფოსტა" required>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </Field>

                <Field label="ტელეფონის ნომერი" required>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                  />
                </Field>

                <Field label="კოდური სიტყვა" required full>
                  <input
                    type="text"
                    value={codeWord}
                    onChange={(e) => setCodeWord(e.target.value)}
                    autoComplete="off"
                  />

                  <small className="fieldHelp">
                    გამოიყენება ანგარიშის იდენტიფიკაციისთვის.
                  </small>
                </Field>

                <Field label="პაროლი" required>
                  <div className="passwordWrap">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((current) => !current)
                      }
                    >
                      {showPassword ? "დამალვა" : "ნახვა"}
                    </button>
                  </div>
                </Field>

                <Field label="გაიმეორეთ პაროლი" required>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    autoComplete="new-password"
                  />
                </Field>
              </div>

              <button
                type="submit"
                className="submitButton"
                disabled={loading}
              >
                {loading ? "ანგარიში იქმნება..." : "ანგარიშის შექმნა →"}
              </button>
            </form>

            <div className="bottomLogin">
              <span>უკვე გაქვთ ანგარიში?</span>
              <a href="/login">შესვლა</a>
            </div>
          </section>
        </section>
      </main>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          padding: 0 26px 40px;
          background: #0647c8;
          font-family: Arial, Helvetica, sans-serif;
        }

        .backgroundPattern {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .qr {
          position: absolute;
          color: rgba(255, 255, 255, 0.045);
          font-size: 125px;
          font-weight: 950;
          user-select: none;
        }

        .qr1 {
          top: 10%;
          left: 4%;
          transform: rotate(-14deg);
        }

        .qr2 {
          top: 14%;
          right: 5%;
          transform: rotate(13deg);
        }

        .qr3 {
          bottom: 6%;
          left: 8%;
          transform: rotate(10deg);
        }

        .qr4 {
          bottom: 4%;
          right: 7%;
          transform: rotate(-12deg);
        }

        /* HEADER */

        .header {
          position: relative;
          z-index: 2;

          width: 100%;
          max-width: 1320px;
          min-height: 74px;

          margin: 0 auto;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .brandMark {
          width: 43px;
          height: 43px;

          display: grid;
          place-items: center;

          border-radius: 11px;

          background: #ffffff;
          color: #0647c8;

          font-size: 13px;
          font-weight: 950;
        }

        .brandText strong,
        .brandText small {
          display: block;
        }

        .brandText strong {
          color: #ffffff;
          font-size: 18px;
          font-weight: 900;
        }

        .brandText small {
          margin-top: 2px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.55px;
        }

        .loginTop {
          min-height: 42px;
          padding: 0 18px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border: 1px solid rgba(255, 255, 255, 0.35);
          border-radius: 9px;

          color: #ffffff;
          font-size: 14px;
          font-weight: 800;
          text-decoration: none;
        }

        /* LAYOUT */

        .content {
          position: relative;
          z-index: 2;

          width: 100%;
          max-width: 1320px;

          margin: 0 auto;
          padding-top: 42px;

          display: grid;
          grid-template-columns: 340px minmax(0, 1fr);

          align-items: center;
          gap: 52px;
        }

        /* LEFT */

        .intro {
          color: #ffffff;
        }

        .eyebrow {
          color: rgba(255, 255, 255, 0.72);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .intro h1 {
          margin: 10px 0 0;

          color: #ffffff;

          font-size: 37px;
          line-height: 1.12;
          letter-spacing: -0.6px;
        }

        .introLead {
          margin: 14px 0 0;

          color: rgba(255, 255, 255, 0.85);

          font-size: 17px;
          line-height: 1.55;
        }

        .infoBox {
          margin-top: 26px;
          padding: 18px 19px;

          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 14px;

          background: rgba(255, 255, 255, 0.07);
        }

        .infoBox strong {
          display: block;

          color: #ffffff;

          font-size: 15px;
          line-height: 1.4;
        }

        .infoBox p {
          margin: 7px 0 0;

          color: rgba(255, 255, 255, 0.76);

          font-size: 13px;
          line-height: 1.55;
        }

        .slogan {
          margin: 19px 0 0;
          padding-left: 14px;

          border-left: 3px solid #ffffff;

          color: rgba(255, 255, 255, 0.88);

          font-size: 14px;
          line-height: 1.55;
        }

        /* REGISTRATION CARD */

        .formCard {
          width: 100%;
          max-width: 880px;

          margin-left: auto;

          padding: 31px 34px 28px;

          border-radius: 20px;

          background: #ffffff;

          box-shadow:
            0 25px 65px rgba(0, 24, 78, 0.3);
        }

        .formHeader > span {
          color: #0647c8;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.8px;
        }

        .formHeader h2 {
          margin: 5px 0 0;

          color: #203a55;

          font-size: 25px;
          line-height: 1.2;
        }

        .formHeader p {
          margin: 6px 0 0;

          color: #74869a;

          font-size: 14px;
          line-height: 1.5;
        }

        .errorBox {
          margin-top: 16px;
          padding: 12px 13px;

          border: 1px solid #f0cdd2;
          border-radius: 9px;

          background: #fff2f4;
          color: #a23e49;

          font-size: 13px;
        }

        /*
          EXACT SAME FIELD FORMAT
          AS OUR PRODUCT/DOG REGISTRATION FORM
        */

        .formGrid {
          margin-top: 22px;

          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 12px 18px;
        }

        .field {
          min-width: 0;
        }

        .field.full {
          grid-column: 1 / -1;
        }

        .field label {
          display: block;

          margin-bottom: 6px;

          color: #344e68;

          font-size: 13px;
          font-weight: 800;
        }

        .required {
          color: #0647c8;
        }

        .field input {
          width: 100%;

          min-height: 44px;

          padding: 0 12px;

          border: 1px solid #d5e0eb;
          border-radius: 9px;

          background: #ffffff;
          color: #263f59;

          font-family: inherit;
          font-size: 14px;

          outline: none;
        }

        .field input:focus {
          border-color: #0647c8;

          box-shadow:
            0 0 0 3px rgba(6, 71, 200, 0.08);
        }

        .fieldHelp {
          display: block;

          margin-top: 6px;

          color: #75869a;

          font-size: 12px;
          line-height: 1.45;
        }

        /* PASSWORD */

        .passwordWrap {
          position: relative;
          width: 100%;
        }

        .passwordWrap input {
          width: 100%;
          padding-right: 72px;
        }

        .passwordWrap button {
          position: absolute;

          top: 50%;
          right: 6px;

          transform: translateY(-50%);

          height: 32px;
          padding: 0 10px;

          border: 0;
          border-radius: 7px;

          background: #eef5ff;
          color: #0647c8;

          font-family: inherit;
          font-size: 11px;
          font-weight: 800;

          cursor: pointer;
        }

        /* SUBMIT */

        .submitButton {
          width: 100%;
          min-height: 48px;

          margin-top: 20px;

          border: 0;
          border-radius: 10px;

          background: #0647c8;
          color: #ffffff;

          font-family: inherit;
          font-size: 14px;
          font-weight: 900;

          cursor: pointer;

          box-shadow:
            0 9px 20px rgba(6, 71, 200, 0.17);
        }

        .submitButton:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        /* BOTTOM */

        .bottomLogin {
          margin-top: 17px;
          padding-top: 16px;

          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;

          border-top: 1px solid #e6edf4;

          color: #7b8b9c;

          font-size: 13px;
        }

        .bottomLogin a {
          color: #0647c8;
          font-weight: 850;
          text-decoration: none;
        }

        /* TABLET */

        @media (max-width: 1000px) {
          .content {
            max-width: 850px;

            grid-template-columns: 1fr;

            gap: 28px;
          }

          .intro {
            text-align: center;
          }

          .infoBox,
          .slogan {
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
          }

          .slogan {
            text-align: left;
          }

          .formCard {
            margin: 0 auto;
          }
        }

        /* MOBILE */

        @media (max-width: 600px) {
          .page {
            padding: 0 13px 28px;
          }

          .brandText small {
            display: none;
          }

          .content {
            padding-top: 28px;
          }

          .intro h1 {
            font-size: 30px;
          }

          .formCard {
            padding: 20px;
          }

          .formGrid {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .field.full {
            grid-column: auto;
          }

          .bottomLogin {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </>
  );
}

function Field({
  label,
  required = false,
  full = false,
  children,
}: {
  label: string;
  required?: boolean;
  full?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={full ? "field full" : "field"}>
      <label>
        {label}
        {required && <span className="required"> *</span>}
      </label>

      {children}
    </div>
  );
}
