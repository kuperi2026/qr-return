"use client";

import {
  FormEvent,
  ReactNode,
  useState,
} from "react";

import {
  createClient,
} from "@supabase/supabase-js";

function createSupabaseClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key);
}

export default function SignupPage() {
  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [codeWord, setCodeWord] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");

    if (!firstName.trim()) {
      setErrorMessage(
        "გთხოვთ მიუთითოთ სახელი."
      );
      return;
    }

    if (!lastName.trim()) {
      setErrorMessage(
        "გთხოვთ მიუთითოთ გვარი."
      );
      return;
    }

    if (!email.trim()) {
      setErrorMessage(
        "გთხოვთ მიუთითოთ ელფოსტა."
      );
      return;
    }

    if (!phone.trim()) {
      setErrorMessage(
        "გთხოვთ მიუთითოთ ტელეფონის ნომერი."
      );
      return;
    }

    if (!codeWord.trim()) {
      setErrorMessage(
        "გთხოვთ მიუთითოთ კოდური სიტყვა."
      );
      return;
    }

    if (password.length < 8) {
      setErrorMessage(
        "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს."
      );
      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setErrorMessage(
        "პაროლები ერთმანეთს არ ემთხვევა."
      );
      return;
    }

    const supabase =
      createSupabaseClient();

    if (!supabase) {
      setErrorMessage(
        "Supabase კავშირი ვერ მოიძებნა."
      );
      return;
    }

    setLoading(true);

    try {
      const {
        data,
        error,
      } =
        await supabase.auth.signUp({
          email: email
            .trim()
            .toLowerCase(),

          password,

          options: {
            data: {
              first_name:
                firstName.trim(),

              last_name:
                lastName.trim(),

              phone:
                phone.trim(),

              code_word:
                codeWord.trim(),
            },
          },
        });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error(
          "ანგარიშის შექმნა ვერ მოხერხდა."
        );
      }

      /*
       * ძირითადი Owner მონაცემები.
       * code_word ინახება Auth metadata-ში.
       */
      try {
        const {
          error: ownerError,
        } = await supabase
          .from("owner_accounts")
          .upsert(
            {
              id: data.user.id,

              first_name:
                firstName.trim(),

              last_name:
                lastName.trim(),

              email: email
                .trim()
                .toLowerCase(),

              phone:
                phone.trim(),
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

      /*
       * თუ Email Confirmation გამორთულია,
       * მომხმარებელი უკვე შესულია.
       */
      if (data.session) {
        window.location.assign(
          "/account"
        );
        return;
      }

      /*
       * თუ Email Confirmation ჩართულია,
       * გადავიყვანოთ Login-ზე.
       */
      window.location.assign(
        `/login?registered=1&email=${encodeURIComponent(
          email
            .trim()
            .toLowerCase()
        )}`
      );
    } catch (error) {
      console.error(
        "Signup error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "ანგარიშის შექმნა ვერ მოხერხდა.";

      const lowerMessage =
        message.toLowerCase();

      if (
        lowerMessage.includes(
          "already registered"
        ) ||
        lowerMessage.includes(
          "already been registered"
        )
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

        <div
          className="backgroundPattern"
          aria-hidden="true"
        >
          <span className="qr qr1">
            QR
          </span>

          <span className="qr qr2">
            QR
          </span>

          <span className="qr qr3">
            QR
          </span>

          <span className="qr qr4">
            QR
          </span>
        </div>

        {/* HEADER */}

        <header className="header">
          <a
            href="/"
            className="brand"
          >
            <span className="brandMark">
              QR
            </span>

            <span className="brandText">
              <strong>
                QR RETURN
              </strong>

              <small>
                SMART QR CONNECTION
              </small>
            </span>
          </a>

          <a
            href="/login"
            className="loginTop"
          >
            შესვლა
          </a>
        </header>

        {/* CONTENT */}

        <section className="content">
          {/* LEFT */}

          <div className="intro">
            <span className="eyebrow">
              QR RETURN ACCOUNT
            </span>

            <h1>
              შექმენით ანგარიში
            </h1>

            <p className="introLead">
              ერთი ანგარიში — თქვენი
              ყველა QR პროფილი ერთ
              სივრცეში.
            </p>

            <div className="infoBox">
              <strong>
                მარტივად მართეთ ის,
                რაც თქვენთვის
                მნიშვნელოვანია.
              </strong>

              <p>
                ანგარიშის შექმნის შემდეგ
                შეგიძლიათ დაამატოთ და
                მართოთ თქვენი QR
                პროფილები ერთი პირადი
                სივრციდან.
              </p>
            </div>

            <p className="slogan">
              ერთი სკანირება შეიძლება
              იყოს პირველი ნაბიჯი
              დაბრუნებამდე.
            </p>
          </div>

          {/* FORM */}

          <section className="formCard">
            <div className="formHeader">
              <span>
                CREATE ACCOUNT
              </span>

              <h2>
                მფლობელის რეგისტრაცია
              </h2>

              <p>
                შეავსეთ თქვენი ძირითადი
                ინფორმაცია.
              </p>
            </div>

            {errorMessage && (
              <div
                className="errorBox"
                role="alert"
              >
                {errorMessage}
              </div>
            )}

            <form
              onSubmit={
                handleSubmit
              }
            >
              <div className="grid">
                <Field
                  label="სახელი"
                  required
                >
                  <input
                    type="text"
                    value={firstName}
                    onChange={(event) =>
                      setFirstName(
                        event.target.value
                      )
                    }
                    autoComplete="given-name"
                  />
                </Field>

                <Field
                  label="გვარი"
                  required
                >
                  <input
                    type="text"
                    value={lastName}
                    onChange={(event) =>
                      setLastName(
                        event.target.value
                      )
                    }
                    autoComplete="family-name"
                  />
                </Field>

                <Field
                  label="ელფოსტა"
                  required
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    autoComplete="email"
                  />
                </Field>

                <Field
                  label="ტელეფონის ნომერი"
                  required
                >
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) =>
                      setPhone(
                        event.target.value
                      )
                    }
                    autoComplete="tel"
                  />
                </Field>

                <Field
                  label="კოდური სიტყვა"
                  required
                  full
                >
                  <input
                    type="text"
                    value={codeWord}
                    onChange={(event) =>
                      setCodeWord(
                        event.target.value
                      )
                    }
                    autoComplete="off"
                  />

                  <small className="fieldHelp">
                    გამოიყენება ანგარიშის
                    იდენტიფიკაციისთვის.
                  </small>
                </Field>

                <Field
                  label="პაროლი"
                  required
                >
                  <div className="passwordWrap">
                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value
                        )
                      }
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) =>
                            !current
                        )
                      }
                    >
                      {showPassword
                        ? "დამალვა"
                        : "ნახვა"}
                    </button>
                  </div>
                </Field>

                <Field
                  label="გაიმეორეთ პაროლი"
                  required
                >
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      confirmPassword
                    }
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
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

                    <span>
                      →
                    </span>
                  </>
                )}
              </button>
            </form>

            <div className="bottomLogin">
              <span>
                უკვე გაქვთ ანგარიში?
              </span>

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

          overflow: hidden;

          padding:
            0 24px 34px;

          background:
            #0647c8;

          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        /* BACKGROUND */

        .backgroundPattern {
          position: fixed;

          inset: 0;

          pointer-events: none;

          overflow: hidden;
        }

        .qr {
          position: absolute;

          color:
            rgba(
              255,
              255,
              255,
              0.045
            );

          font-size: 120px;

          font-weight: 950;

          user-select: none;
        }

        .qr1 {
          top: 11%;
          left: 4%;

          transform:
            rotate(-14deg);
        }

        .qr2 {
          top: 14%;
          right: 5%;

          transform:
            rotate(13deg);
        }

        .qr3 {
          bottom: 6%;
          left: 8%;

          transform:
            rotate(10deg);
        }

        .qr4 {
          bottom: 4%;
          right: 7%;

          transform:
            rotate(-12deg);
        }

        /* HEADER */

        .header {
          position: relative;

          z-index: 2;

          width: 100%;

          max-width: 1060px;

          min-height: 74px;

          margin: 0 auto;

          display: flex;

          align-items: center;

          justify-content:
            space-between;

          gap: 20px;

          border-bottom:
            1px solid
            rgba(
              255,
              255,
              255,
              0.2
            );
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

          background:
            #ffffff;

          color:
            #0647c8;

          font-size: 13px;

          font-weight: 950;
        }

        .brandText strong,
        .brandText small {
          display: block;
        }

        .brandText strong {
          color:
            #ffffff;

          font-size: 18px;

          font-weight: 900;
        }

        .brandText small {
          margin-top: 2px;

          color:
            rgba(
              255,
              255,
              255,
              0.7
            );

          font-size: 10px;

          font-weight: 700;

          letter-spacing:
            0.55px;
        }

        .loginTop {
          min-height: 42px;

          padding:
            0 17px;

          display: inline-flex;

          align-items: center;

          justify-content: center;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.35
            );

          border-radius: 9px;

          color:
            #ffffff;

          font-size: 14px;

          font-weight: 800;

          text-decoration: none;
        }

        /* CONTENT */

        .content {
          position: relative;

          z-index: 2;

          width: 100%;

          max-width: 1060px;

          margin: 0 auto;

          padding-top: 43px;

          display: grid;

          grid-template-columns:
            minmax(
              0,
              0.9fr
            )
            minmax(
              500px,
              1fr
            );

          align-items: center;

          gap: 66px;
        }

        /* LEFT */

        .intro {
          color:
            #ffffff;
        }

        .eyebrow {
          color:
            rgba(
              255,
              255,
              255,
              0.72
            );

          font-size: 11px;

          font-weight: 900;

          letter-spacing: 1px;
        }

        .intro h1 {
          margin:
            10px 0 0;

          color:
            #ffffff;

          font-size: 38px;

          line-height: 1.12;

          letter-spacing:
            -0.6px;
        }

        .introLead {
          max-width: 430px;

          margin:
            13px 0 0;

          color:
            rgba(
              255,
              255,
              255,
              0.85
            );

          font-size: 17px;

          line-height: 1.55;
        }

        .infoBox {
          max-width: 455px;

          margin-top: 27px;

          padding:
            18px 19px;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.18
            );

          border-radius: 14px;

          background:
            rgba(
              255,
              255,
              255,
              0.07
            );
        }

        .infoBox strong {
          display: block;

          color:
            #ffffff;

          font-size: 15px;

          line-height: 1.4;
        }

        .infoBox p {
          margin:
            7px 0 0;

          color:
            rgba(
              255,
              255,
              255,
              0.76
            );

          font-size: 13px;

          line-height: 1.55;
        }

        .slogan {
          max-width: 430px;

          margin:
            19px 0 0;

          padding-left: 14px;

          border-left:
            3px solid
            #ffffff;

          color:
            rgba(
              255,
              255,
              255,
              0.88
            );

          font-size: 14px;

          line-height: 1.55;
        }

        /* CARD */

        .formCard {
          width: 100%;

          max-width: 500px;

          margin-left: auto;

          padding:
            28px 29px;

          border-radius: 20px;

          background:
            #ffffff;

          box-shadow:
            0 25px 65px
            rgba(
              0,
              24,
              78,
              0.3
            );
        }

        .formHeader > span {
          color:
            #0647c8;

          font-size: 11px;

          font-weight: 900;

          letter-spacing:
            0.8px;
        }

        .formHeader h2 {
          margin:
            5px 0 0;

          color:
            #203a55;

          font-size: 25px;

          line-height: 1.2;
        }

        .formHeader p {
          margin:
            6px 0 0;

          color:
            #74869a;

          font-size: 14px;

          line-height: 1.5;
        }

        /* ERROR */

        .errorBox {
          margin-top: 16px;

          padding:
            12px 13px;

          border:
            1px solid
            #f0cdd2;

          border-radius: 9px;

          background:
            #fff2f4;

          color:
            #a23e49;

          font-size: 13px;

          line-height: 1.45;
        }

        /* FORM */

        .grid {
          margin-top: 22px;

          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(
                0,
                1fr
              )
            );

          gap:
            17px 15px;
        }

        .field.full {
          grid-column:
            1 / -1;
        }

        .field label {
          display: block;

          margin-bottom: 7px;

          color:
            #344e68;

          font-size: 14px;

          font-weight: 800;
        }

        .required {
          color:
            #0647c8;
        }

        /*
         * იგივე ზომა და სტილი,
         * რაც Login გვერდზე.
         */

        .field input {
          width: 100%;

          height: 52px;

          padding:
            0 14px;

          border:
            1px solid
            #d4e0eb;

          border-radius: 10px;

          background:
            #ffffff;

          color:
            #263f59;

          font-family: inherit;

          font-size: 15px;

          outline: none;

          transition:
            border-color
              0.18s ease,
            box-shadow
              0.18s ease;
        }

        .field input:focus {
          border-color:
            #0647c8;

          box-shadow:
            0 0 0 3px
            rgba(
              6,
              71,
              200,
              0.08
            );
        }

        .fieldHelp {
          display: block;

          margin-top: 6px;

          color:
            #8594a4;

          font-size: 11px;

          line-height: 1.4;
        }

        /* PASSWORD */

        .passwordWrap {
          position: relative;
        }

        .passwordWrap input {
          padding-right:
            70px;
        }

        .passwordWrap button {
          position: absolute;

          top: 50%;

          right: 8px;

          transform:
            translateY(-50%);

          min-height: 32px;

          padding:
            0 9px;

          border: 0;

          border-radius: 7px;

          background:
            #edf4ff;

          color:
            #0647c8;

          font-family: inherit;

          font-size: 10px;

          font-weight: 850;

          cursor: pointer;
        }

        /* SUBMIT */

        .submitButton {
          width: 100%;

          height: 52px;

          margin-top: 21px;

          padding:
            0 18px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 9px;

          border: 0;

          border-radius: 10px;

          background:
            #0647c8;

          color:
            #ffffff;

          font-family: inherit;

          font-size: 15px;

          font-weight: 900;

          cursor: pointer;

          box-shadow:
            0 9px 20px
            rgba(
              6,
              71,
              200,
              0.17
            );
        }

        .submitButton span {
          font-size: 18px;
        }

        .submitButton:disabled {
          opacity: 0.65;

          cursor:
            not-allowed;
        }

        /* LOGIN LINK */

        .bottomLogin {
          margin-top: 18px;

          padding-top: 17px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 5px;

          border-top:
            1px solid
            #e6edf4;

          color:
            #7b8b9c;

          font-size: 13px;
        }

        .bottomLogin a {
          color:
            #0647c8;

          font-weight: 850;

          text-decoration: none;
        }

        /* TABLET */

        @media (
          max-width: 900px
        ) {
          .content {
            max-width: 620px;

            grid-template-columns:
              1fr;

            gap: 29px;
          }

          .intro {
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
            margin:
              0 auto;
          }
        }

        /* MOBILE */

        @media (
          max-width: 600px
        ) {
          .page {
            padding:
              0 13px 27px;
          }

          .header {
            min-height: 68px;
          }

          .brandText small {
            display: none;
          }

          .brandText strong {
            font-size: 16px;
          }

          .content {
            padding-top: 29px;
          }

          .intro h1 {
            font-size: 31px;
          }

          .introLead {
            font-size: 15px;
          }

          .formCard {
            max-width: 100%;

            padding:
              23px 19px;

            border-radius: 17px;
          }

          .formHeader h2 {
            font-size: 23px;
          }

          .grid {
            grid-template-columns:
              1fr;

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
    <div
      className={
        full
          ? "field full"
          : "field"
      }
    >
      <label>
        {label}

        {required && (
          <span className="required">
            {" "}
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}
