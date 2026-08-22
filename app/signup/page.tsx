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

      if (error) {
        throw error;
      }

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
        {/* BACKGROUND */}

        <div className="backgroundPattern" aria-hidden="true">
          <span className="qr qr1">QR</span>
          <span className="qr qr2">QR</span>
          <span className="qr qr3">QR</span>
          <span className="qr qr4">QR</span>
        </div>

        {/* HEADER */}

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

        {/* MAIN */}

        <section className="content">
          {/* LEFT */}

          <div className="intro">
            <span className="eyebrow">
              QR RETURN ACCOUNT
            </span>

            <h1>შექმენით ანგარიში</h1>

            <p className="introLead">
              ერთი ანგარიში — თქვენი ყველა QR პროფილი ერთ
              სივრცეში.
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

            <div className="slogan">
              ერთი სკანირება შეიძლება იყოს პირველი ნაბიჯი
              დაბრუნებამდე.
            </div>
          </div>

          {/* FORM */}

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
              <div className="grid">
                {/* FIRST NAME */}

                <Field label="სახელი" required>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(event) =>
                      setFirstName(event.target.value)
                    }
                    autoComplete="given-name"
                  />
                </Field>

                {/* LAST NAME */}

                <Field label="გვარი" required>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(event) =>
                      setLastName(event.target.value)
                    }
                    autoComplete="family-name"
                  />
                </Field>

                {/* EMAIL */}

                <Field label="ელფოსტა" required>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    autoComplete="email"
                  />
                </Field>

                {/* PHONE */}

                <Field label="ტელეფონის ნომერი" required>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) =>
                      setPhone(event.target.value)
                    }
                    autoComplete="tel"
                  />
                </Field>

                {/* CODE WORD */}

                <Field label="კოდური სიტყვა" required>
                  <input
                    type="text"
                    value={codeWord}
                    onChange={(event) =>
                      setCodeWord(event.target.value)
                    }
                    autoComplete="off"
                  />

                  <small className="fieldHelp">
                    გამოიყენება ანგარიშის იდენტიფიკაციისთვის.
                  </small>
                </Field>

                {/* PASSWORD */}

                <Field label="პაროლი" required>
                  <div className="passwordWrap">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
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

                {/* CONFIRM PASSWORD */}

                <Field label="გაიმეორეთ პაროლი" required>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
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
                {loading ? (
                  "ანგარიში იქმნება..."
                ) : (
                  <>
                    ანგარიშის შექმნა
                    <span>→</span>
                  </>
                )}
              </button>
            </form>

            <div className="bottomLogin">
              <span>უკვე გაქვთ ანგარიში?</span>

              <a href="/login">
                შესვლა
              </a>
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

          padding: 0 32px 50px;

          overflow: hidden;

          background: #0647c8;

          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        /* =========================
           BACKGROUND
        ========================= */

        .backgroundPattern {
          position: fixed;

          inset: 0;

          overflow: hidden;

          pointer-events: none;
        }

        .qr {
          position: absolute;

          color: rgba(255, 255, 255, 0.045);

          font-size: 130px;

          font-weight: 950;

          user-select: none;
        }

        .qr1 {
          top: 10%;
          left: 3%;

          transform: rotate(-14deg);
        }

        .qr2 {
          top: 13%;
          right: 4%;

          transform: rotate(13deg);
        }

        .qr3 {
          bottom: 4%;
          left: 7%;

          transform: rotate(10deg);
        }

        .qr4 {
          bottom: 4%;
          right: 6%;

          transform: rotate(-12deg);
        }

        /* =========================
           HEADER
        ========================= */

        .header {
          position: relative;

          z-index: 2;

          width: 100%;

          max-width: 1500px;

          min-height: 78px;

          margin: 0 auto;

          display: flex;

          align-items: center;

          justify-content: space-between;

          border-bottom:
            1px solid rgba(255, 255, 255, 0.2);
        }

        .brand {
          display: flex;

          align-items: center;

          gap: 11px;

          text-decoration: none;
        }

        .brandMark {
          width: 46px;

          height: 46px;

          display: grid;

          place-items: center;

          border-radius: 12px;

          background: #ffffff;

          color: #0647c8;

          font-size: 13px;

          font-weight: 950;

          box-shadow:
            0 8px 22px rgba(0, 25, 80, 0.16);
        }

        .brandText strong,
        .brandText small {
          display: block;
        }

        .brandText strong {
          color: #ffffff;

          font-size: 19px;

          font-weight: 900;
        }

        .brandText small {
          margin-top: 2px;

          color: rgba(255, 255, 255, 0.7);

          font-size: 10px;

          font-weight: 700;

          letter-spacing: 0.6px;
        }

        .loginTop {
          min-height: 44px;

          padding: 0 20px;

          display: inline-flex;

          align-items: center;

          justify-content: center;

          border:
            1px solid rgba(255, 255, 255, 0.38);

          border-radius: 11px;

          color: #ffffff;

          font-size: 14px;

          font-weight: 850;

          text-decoration: none;

          transition:
            background 0.18s ease;
        }

        .loginTop:hover {
          background:
            rgba(255, 255, 255, 0.1);
        }

        /* =========================
           MAIN LAYOUT
        ========================= */

        .content {
          position: relative;

          z-index: 2;

          width: 100%;

          max-width: 1500px;

          margin: 0 auto;

          padding-top: 48px;

          display: grid;

          grid-template-columns:
            minmax(300px, 0.42fr)
            minmax(850px, 1.58fr);

          align-items: start;

          gap: 70px;
        }

        /* =========================
           LEFT SIDE
        ========================= */

        .intro {
          padding-top: 30px;

          color: #ffffff;
        }

        .eyebrow {
          color:
            rgba(255, 255, 255, 0.72);

          font-size: 12px;

          font-weight: 900;

          letter-spacing: 1px;
        }

        .intro h1 {
          margin: 12px 0 0;

          color: #ffffff;

          font-size: 40px;

          line-height: 1.12;

          letter-spacing: -0.7px;
        }

        .introLead {
          max-width: 410px;

          margin: 16px 0 0;

          color:
            rgba(255, 255, 255, 0.87);

          font-size: 18px;

          line-height: 1.6;
        }

        .infoBox {
          max-width: 420px;

          margin-top: 30px;

          padding: 21px;

          border:
            1px solid rgba(255, 255, 255, 0.18);

          border-radius: 15px;

          background:
            rgba(255, 255, 255, 0.075);
        }

        .infoBox strong {
          display: block;

          color: #ffffff;

          font-size: 16px;

          line-height: 1.45;
        }

        .infoBox p {
          margin: 9px 0 0;

          color:
            rgba(255, 255, 255, 0.76);

          font-size: 14px;

          line-height: 1.6;
        }

        .slogan {
          max-width: 420px;

          margin-top: 22px;

          padding-left: 16px;

          border-left:
            3px solid #ffffff;

          color:
            rgba(255, 255, 255, 0.9);

          font-size: 15px;

          line-height: 1.6;
        }

        /* =========================
           LARGE FORM CARD
        ========================= */

        .formCard {
          width: 100%;

          max-width: 1000px;

          margin-left: auto;

          padding:
            40px 50px 36px;

          border:
            1px solid rgba(255, 255, 255, 0.8);

          border-radius: 25px;

          background: #ffffff;

          box-shadow:
            0 30px 80px rgba(0, 25, 80, 0.3),
            0 4px 15px rgba(0, 25, 80, 0.08);
        }

        /* =========================
           FORM HEADER
        ========================= */

        .formHeader > span {
          color: #0647c8;

          font-size: 12px;

          font-weight: 900;

          letter-spacing: 0.9px;
        }

        .formHeader h2 {
          margin: 7px 0 0;

          color: #203a55;

          font-size: 29px;

          font-weight: 850;

          line-height: 1.25;
        }

        .formHeader p {
          margin: 9px 0 0;

          color: #74869a;

          font-size: 15px;

          line-height: 1.55;
        }

        /* =========================
           ERROR
        ========================= */

        .errorBox {
          margin-top: 21px;

          padding: 14px 16px;

          border:
            1px solid #f0cdd2;

          border-radius: 11px;

          background: #fff2f4;

          color: #a23e49;

          font-size: 14px;

          line-height: 1.5;
        }

        /* =========================
           FORM

           IMPORTANT:
           ONE COLUMN = FULL WIDTH
        ========================= */

        .grid {
          width: 100%;

          margin-top: 31px;

          display: grid;

          grid-template-columns: 1fr;

          gap: 23px;
        }

        .field {
          width: 100%;

          min-width: 0;
        }

        /* =========================
           LABEL
        ========================= */

        .field label {
          display: block;

          margin:
            0 0 11px 2px;

          color: #2f4963;

          font-size: 15px;

          font-weight: 850;

          line-height: 1.35;
        }

        .required {
          margin-left: 2px;

          color: #0647c8;
        }

        /* =========================
           EXTRA WIDE INPUTS
        ========================= */

        .field input {
          display: block;

          width: 100%;

          min-width: 100%;

          height: 60px;

          padding:
            0 20px;

          border:
            1.5px solid #d6e1ec;

          border-radius: 13px;

          background: #ffffff;

          color: #203a55;

          font-family: inherit;

          font-size: 16px;

          font-weight: 500;

          outline: none;

          transition:
            border-color 0.18s ease,
            box-shadow 0.18s ease,
            background 0.18s ease;
        }

        .field input:hover {
          border-color: #b8cadb;
        }

        .field input:focus {
          border-color: #1266e9;

          background: #ffffff;

          box-shadow:
            0 0 0 4px
            rgba(18, 102, 233, 0.1);
        }

        .fieldHelp {
          display: block;

          margin:
            9px 0 0 2px;

          color: #7d8fa1;

          font-size: 13px;

          line-height: 1.5;
        }

        /* =========================
           PASSWORD
        ========================= */

        .passwordWrap {
          position: relative;

          width: 100%;
        }

        .passwordWrap input {
          width: 100%;

          padding-right: 105px;
        }

        .passwordWrap button {
          position: absolute;

          top: 50%;

          right: 11px;

          transform:
            translateY(-50%);

          min-width: 74px;

          height: 39px;

          padding: 0 13px;

          border: 0;

          border-radius: 9px;

          background: #edf4ff;

          color: #0647c8;

          font-family: inherit;

          font-size: 12px;

          font-weight: 850;

          cursor: pointer;

          transition:
            background 0.18s ease;
        }

        .passwordWrap button:hover {
          background: #e1ecff;
        }

        /* =========================
           SUBMIT BUTTON
        ========================= */

        .submitButton {
          width: 100%;

          height: 60px;

          margin-top: 31px;

          padding: 0 22px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 11px;

          border: 0;

          border-radius: 13px;

          background: #0647c8;

          color: #ffffff;

          font-family: inherit;

          font-size: 16px;

          font-weight: 900;

          cursor: pointer;

          box-shadow:
            0 12px 27px rgba(6, 71, 200, 0.22);

          transition:
            background 0.18s ease,
            transform 0.18s ease,
            box-shadow 0.18s ease;
        }

        .submitButton:hover:not(:disabled) {
          background: #0754df;

          transform:
            translateY(-1px);

          box-shadow:
            0 16px 32px rgba(6, 71, 200, 0.27);
        }

        .submitButton span {
          font-size: 20px;
        }

        .submitButton:disabled {
          opacity: 0.65;

          cursor: not-allowed;
        }

        /* =========================
           BOTTOM LOGIN
        ========================= */

        .bottomLogin {
          margin-top: 25px;

          padding-top: 22px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 7px;

          border-top:
            1px solid #e5edf5;

          color: #7b8b9c;

          font-size: 14px;
        }

        .bottomLogin a {
          color: #0647c8;

          font-weight: 850;

          text-decoration: none;
        }

        /* =========================
           TABLET
        ========================= */

        @media (max-width: 1150px) {
          .content {
            max-width: 950px;

            grid-template-columns: 1fr;

            gap: 35px;
          }

          .intro {
            padding-top: 0;

            text-align: center;
          }

          .introLead,
          .infoBox,
          .slogan {
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

        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 700px) {
          .page {
            padding:
              0 14px 30px;
          }

          .header {
            min-height: 70px;
          }

          .brandText small {
            display: none;
          }

          .brandText strong {
            font-size: 17px;
          }

          .content {
            padding-top: 30px;
          }

          .intro h1 {
            font-size: 32px;
          }

          .introLead {
            font-size: 16px;
          }

          .formCard {
            width: 100%;

            padding:
              28px 20px 26px;

            border-radius: 20px;
          }

          .formHeader h2 {
            font-size: 25px;
          }

          .grid {
            margin-top: 26px;

            gap: 20px;
          }

          .field label {
            margin-bottom: 9px;

            font-size: 14px;
          }

          .field input {
            width: 100%;

            height: 58px;

            padding: 0 16px;

            border-radius: 12px;

            font-size: 16px;
          }

          .passwordWrap input {
            padding-right: 95px;
          }

          .submitButton {
            height: 58px;

            margin-top: 26px;
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
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="field">
      <label>
        {label}

        {required && (
          <span className="required">
            {" "}*
          </span>
        )}
      </label>

      {children}
    </div>
  );
}
