"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
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
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setErrorMessage("");

    if (!firstName.trim()) {
      setErrorMessage("გთხოვთ შეიყვანოთ სახელი.");
      return;
    }

    if (!lastName.trim()) {
      setErrorMessage("გთხოვთ შეიყვანოთ გვარი.");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("გთხოვთ შეიყვანოთ ელფოსტა.");
      return;
    }

    if (!phone.trim()) {
      setErrorMessage("გთხოვთ შეიყვანოთ ტელეფონის ნომერი.");
      return;
    }

    if (!codeWord.trim()) {
      setErrorMessage("გთხოვთ შეიყვანოთ კოდური სიტყვა.");
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

    const supabase = getSupabase();

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
        throw new Error(
          "ანგარიშის შექმნა ვერ მოხერხდა."
        );
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
          console.error(
            "Owner account save:",
            ownerError
          );
        }
      } catch (ownerError) {
        console.error(
          "Owner account save:",
          ownerError
        );
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
      const message =
        error instanceof Error
          ? error.message
          : "ანგარიშის შექმნა ვერ მოხერხდა.";

      const lower = message.toLowerCase();

      if (
        lower.includes("already registered") ||
        lower.includes("already been registered")
      ) {
        setErrorMessage(
          "ამ ელფოსტით ანგარიში უკვე არსებობს."
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
        <div className="decor decor1">QR</div>
        <div className="decor decor2">QR</div>
        <div className="decor decor3">QR</div>

        <header className="header">
          <a href="/" className="brand">
            <span className="brandIcon">QR</span>

            <span>
              <strong>QR RETURN</strong>
              <small>SMART QR CONNECTION</small>
            </span>
          </a>

          <a href="/login" className="loginButton">
            შესვლა
          </a>
        </header>

        <div className="layout">
          <section className="intro">
            <div className="introCard">
              <div className="introIcon">
                <span>QR</span>
              </div>

              <div className="introText">
                <h1>
                  ყველაფერი იწყება
                  <br />
                  თქვენი ანგარიშით.
                </h1>

                <div className="line" />

                <p>
                  რეგისტრაციის შემდეგ შეძლებთ
                  <strong>
                    {" "}
                    ძაღლის, კატის, გასაღების, საფულის,
                    ჩანთისა და ჩემოდნის{" "}
                  </strong>
                  QR პროფილების დამატებას.
                </p>
              </div>
            </div>
          </section>

          <section className="card">
            <div className="cardHeader">
              <span>CREATE ACCOUNT</span>

              <h2>მფლობელის რეგისტრაცია</h2>

              <p>
                შეიყვანეთ თქვენი ძირითადი ინფორმაცია.
              </p>
            </div>

            {errorMessage && (
              <div className="error">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid">
                <div className="field">
                  <label htmlFor="firstName">
                    სახელი <b>*</b>
                  </label>

                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) =>
                      setFirstName(e.target.value)
                    }
                    autoComplete="given-name"
                  />
                </div>

                <div className="field">
                  <label htmlFor="lastName">
                    გვარი <b>*</b>
                  </label>

                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) =>
                      setLastName(e.target.value)
                    }
                    autoComplete="family-name"
                  />
                </div>

                <div className="field">
                  <label htmlFor="email">
                    ელფოსტა <b>*</b>
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    autoComplete="email"
                  />
                </div>

                <div className="field">
                  <label htmlFor="phone">
                    ტელეფონის ნომერი <b>*</b>
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    autoComplete="tel"
                  />
                </div>

                <div className="field full">
                  <label htmlFor="codeWord">
                    კოდური სიტყვა <b>*</b>
                  </label>

                  <input
                    id="codeWord"
                    type="text"
                    value={codeWord}
                    onChange={(e) =>
                      setCodeWord(e.target.value)
                    }
                    autoComplete="off"
                  />

                  <span className="help">
                    გამოიყენება თქვენი ანგარიშის
                    იდენტიფიკაციისთვის.
                  </span>
                </div>

                <div className="field">
                  <label htmlFor="password">
                    პაროლი <b>*</b>
                  </label>

                  <div className="passwordField">
                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (value) => !value
                        )
                      }
                    >
                      {showPassword
                        ? "დამალვა"
                        : "ნახვა"}
                    </button>
                  </div>

                  <span className="help">
                    მინიმუმ 8 სიმბოლო
                  </span>
                </div>

                <div className="field">
                  <label htmlFor="confirmPassword">
                    გაიმეორეთ პაროლი <b>*</b>
                  </label>

                  <div className="passwordField">
                    <input
                      id="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (value) => !value
                        )
                      }
                    >
                      {showConfirmPassword
                        ? "დამალვა"
                        : "ნახვა"}
                    </button>
                  </div>
                </div>
              </div>

              <button
                className="submit"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "ანგარიში იქმნება..."
                  : "ანგარიშის შექმნა →"}
              </button>
            </form>

            <div className="bottom">
              უკვე გაქვთ ანგარიში?
              <a href="/login">შესვლა</a>
            </div>
          </section>
        </div>
      </main>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;

          padding:
            0 26px 36px;

          background:
            radial-gradient(
              circle at 12% 20%,
              rgba(255, 255, 255, 0.08),
              transparent 25%
            ),
            #0647c8;

          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        /* BACKGROUND */

        .decor {
          position: fixed;

          pointer-events: none;
          user-select: none;

          color:
            rgba(255, 255, 255, 0.035);

          font-size: 145px;
          font-weight: 950;
        }

        .decor1 {
          top: 12%;
          left: 3%;

          transform: rotate(-15deg);
        }

        .decor2 {
          top: 15%;
          right: 4%;

          transform: rotate(13deg);
        }

        .decor3 {
          bottom: 2%;
          left: 30%;

          transform: rotate(8deg);
        }

        /* HEADER */

        .header {
          position: relative;
          z-index: 5;

          width: 100%;
          max-width: 1240px;

          height: 72px;

          margin: auto;

          display: flex;

          align-items: center;
          justify-content: space-between;

          border-bottom:
            1px solid
            rgba(255, 255, 255, 0.18);
        }

        .brand {
          display: flex;

          align-items: center;

          gap: 10px;

          text-decoration: none;
        }

        .brandIcon {
          width: 43px;
          height: 43px;

          display: grid;

          place-items: center;

          border-radius: 11px;

          background: white;

          color: #0647c8;

          font-size: 12px;
          font-weight: 950;

          box-shadow:
            0 8px 20px
            rgba(0, 20, 70, 0.15);
        }

        .brand strong,
        .brand small {
          display: block;
        }

        .brand strong {
          color: white;

          font-size: 17px;

          font-weight: 900;
        }

        .brand small {
          margin-top: 2px;

          color:
            rgba(255, 255, 255, 0.67);

          font-size: 9px;

          font-weight: 800;

          letter-spacing: 0.7px;
        }

        .loginButton {
          min-width: 84px;

          height: 40px;

          display: flex;

          align-items: center;

          justify-content: center;

          border:
            1px solid
            rgba(255, 255, 255, 0.35);

          border-radius: 9px;

          color: white;

          font-size: 13px;

          font-weight: 850;

          text-decoration: none;
        }

        /* MAIN */

        .layout {
          position: relative;

          z-index: 2;

          width: 100%;

          max-width: 1180px;

          margin: auto;

          padding-top: 34px;

          display: grid;

          grid-template-columns:
            310px
            740px;

          justify-content: center;

          align-items: center;

          gap: 48px;
        }

        /* LEFT CARD */

        .intro {
          display: flex;

          align-items: center;
        }

        .introCard {
          position: relative;

          width: 100%;

          padding:
            27px 24px;

          overflow: hidden;

          border:
            1px solid
            rgba(255, 255, 255, 0.2);

          border-radius: 19px;

          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.13),
              rgba(255, 255, 255, 0.055)
            );

          box-shadow:
            0 20px 48px
            rgba(0, 25, 85, 0.15);

          backdrop-filter:
            blur(8px);
        }

        .introCard::after {
          content: "";

          position: absolute;

          width: 140px;

          height: 140px;

          top: -85px;

          right: -70px;

          border-radius: 50%;

          background:
            rgba(255, 255, 255, 0.08);
        }

        .introIcon {
          width: 44px;

          height: 44px;

          margin-bottom: 19px;

          display: grid;

          place-items: center;

          border:
            1px solid
            rgba(255, 255, 255, 0.25);

          border-radius: 12px;

          background:
            rgba(255, 255, 255, 0.12);
        }

        .introIcon span {
          color: white;

          font-size: 11px;

          font-weight: 950;
        }

        .introText h1 {
          margin: 0;

          color: #ffffff;

          font-size: 26px;

          font-weight: 900;

          line-height: 1.22;

          letter-spacing: -0.4px;
        }

        .line {
          width: 39px;

          height: 3px;

          margin:
            17px 0 16px;

          border-radius: 999px;

          background:
            rgba(255, 255, 255, 0.9);
        }

        .introText p {
          margin: 0;

          color:
            rgba(255, 255, 255, 0.78);

          font-size: 13px;

          line-height: 1.65;
        }

        .introText p strong {
          color: #ffffff;

          font-weight: 850;
        }

        /* FORM CARD — SMALLER */

        .card {
          width: 100%;

          max-width: 740px;

          padding:
            27px 30px 25px;

          border:
            1px solid
            rgba(255, 255, 255, 0.7);

          border-radius: 19px;

          background: #ffffff;

          box-shadow:
            0 24px 58px
            rgba(0, 25, 80, 0.27);
        }

        .cardHeader > span {
          color: #0647c8;

          font-size: 10px;

          font-weight: 900;

          letter-spacing: 1px;
        }

        .cardHeader h2 {
          margin:
            5px 0 0;

          color: #263e57;

          font-size: 24px;

          line-height: 1.25;
        }

        .cardHeader p {
          margin:
            6px 0 0;

          color: #7a8998;

          font-size: 12px;

          line-height: 1.5;
        }

        /* FORM */

        .grid {
          margin-top: 21px;

          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          column-gap: 18px;

          row-gap: 17px;
        }

        .field {
          min-width: 0;
        }

        .field.full {
          grid-column:
            1 / -1;
        }

        .field label {
          display: block;

          margin:
            0 0 8px 2px;

          color: #42576b;

          font-size: 13px;

          font-weight: 850;

          line-height: 1.3;
        }

        .field label b {
          color: #0647c8;
        }

        /* INPUT HEIGHT STAYS 56PX */

        .field input,
        .passwordField input {
          box-sizing:
            border-box !important;

          display:
            block !important;

          width:
            100% !important;

          height:
            56px !important;

          min-height:
            56px !important;

          max-height:
            56px !important;

          margin:
            0 !important;

          padding:
            0 16px !important;

          border:
            1.5px solid
            #d5e0ea !important;

          border-radius:
            11px !important;

          background:
            #fbfdff !important;

          color:
            #263f59 !important;

          font-family:
            inherit !important;

          font-size:
            15px !important;

          font-weight:
            500 !important;

          line-height:
            normal !important;

          outline:
            none !important;

          appearance: none;

          -webkit-appearance:
            none;

          transition:
            border-color
              0.17s ease,
            box-shadow
              0.17s ease,
            background
              0.17s ease;
        }

        .field input:hover,
        .passwordField input:hover {
          border-color:
            #b9c9d8 !important;

          background:
            #ffffff !important;
        }

        .field input:focus,
        .passwordField input:focus {
          border-color:
            #1266e9 !important;

          background:
            #ffffff !important;

          box-shadow:
            0 0 0 4px
            rgba(
              18,
              102,
              233,
              0.09
            ) !important;
        }

        .help {
          display: block;

          margin:
            6px 0 0 2px;

          color: #8593a0;

          font-size: 10px;

          line-height: 1.4;
        }

        /* PASSWORD */

        .passwordField {
          position: relative;

          width: 100%;
        }

        .passwordField input {
          padding-right:
            85px !important;
        }

        .passwordField button {
          position: absolute;

          top: 50%;

          right: 9px;

          transform:
            translateY(-50%);

          min-width: 62px;

          height: 34px;

          padding:
            0 9px;

          border: 0;

          border-radius: 8px;

          background:
            #edf4ff;

          color: #0647c8;

          font-family: inherit;

          font-size: 10px;

          font-weight: 850;

          cursor: pointer;
        }

        .passwordField button:hover {
          background:
            #e2edff;
        }

        /* ERROR */

        .error {
          margin-top: 15px;

          padding:
            11px 13px;

          border:
            1px solid
            #f0ced2;

          border-radius: 9px;

          background:
            #fff3f4;

          color: #a3424a;

          font-size: 12px;
        }

        /* SUBMIT */

        .submit {
          width: 100%;

          height: 51px;

          margin-top: 21px;

          border: 0;

          border-radius: 10px;

          background: #0647c8;

          color: white;

          font-family: inherit;

          font-size: 13px;

          font-weight: 900;

          cursor: pointer;

          box-shadow:
            0 9px 21px
            rgba(6, 71, 200, 0.19);
        }

        .submit:hover:not(:disabled) {
          background: #0754dc;
        }

        .submit:disabled {
          opacity: 0.65;

          cursor: not-allowed;
        }

        /* BOTTOM */

        .bottom {
          margin-top: 16px;

          padding-top: 15px;

          display: flex;

          justify-content: center;

          gap: 5px;

          border-top:
            1px solid #e7edf3;

          color: #7c8996;

          font-size: 12px;
        }

        .bottom a {
          color: #0647c8;

          font-weight: 850;

          text-decoration: none;
        }

        /* TABLET */

        @media (
          max-width: 900px
        ) {
          .layout {
            max-width: 740px;

            grid-template-columns:
              1fr;

            gap: 24px;
          }

          .introCard {
            max-width: 520px;

            margin: auto;

            text-align: center;
          }

          .introIcon {
            margin-left: auto;

            margin-right: auto;
          }

          .line {
            margin-left: auto;

            margin-right: auto;
          }

          .card {
            margin: auto;
          }
        }

        /* MOBILE */

        @media (
          max-width: 650px
        ) {
          .page {
            padding:
              0 13px 25px;
          }

          .brand small {
            display: none;
          }

          .layout {
            padding-top: 24px;
          }

          .introCard {
            padding:
              23px 19px;
          }

          .introText h1 {
            font-size: 23px;
          }

          .card {
            width: 100%;

            padding:
              23px 18px;

            border-radius: 17px;
          }

          .grid {
            grid-template-columns:
              1fr;

            row-gap: 16px;
          }

          .field.full {
            grid-column: auto;
          }

          .field input,
          .passwordField input {
            height:
              54px !important;

            min-height:
              54px !important;

            max-height:
              54px !important;

            font-size:
              16px !important;
          }

          .bottom {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </>
  );
}
