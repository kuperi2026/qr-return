"use client";

import {
  FormEvent,
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

  return createClient(
    url,
    key
  );
}

export default function SignupPage() {
  const [
    firstName,
    setFirstName,
  ] = useState("");

  const [
    lastName,
    setLastName,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    phone,
    setPhone,
  ] = useState("");

  const [
    codeWord,
    setCodeWord,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
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

    if (
      password.length < 8
    ) {
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
      /*
        1. OWNER ACCOUNT
      */

      const {
        data,
        error,
      } =
        await supabase.auth.signUp({
          email:
            email
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
        owner_accounts-ში ვინახავთ
        უკვე ცნობილ ძირითად ველებს.

        code_word უსაფრთხოდ ინახება
        auth metadata-ში, ამიტომ
        owner_accounts-ში დამატებითი
        column საჭირო არ არის.
      */

      try {
        const {
          error:
            ownerError,
        } =
          await supabase
            .from(
              "owner_accounts"
            )
            .upsert(
              {
                id:
                  data.user.id,

                first_name:
                  firstName.trim(),

                last_name:
                  lastName.trim(),

                phone:
                  phone.trim(),

                email:
                  email
                    .trim()
                    .toLowerCase(),
              },
              {
                onConflict:
                  "id",
              }
            );

        if (ownerError) {
          console.error(
            "Owner account save:",
            ownerError
          );
        }
      } catch (
        ownerSaveError
      ) {
        console.error(
          "Owner account save:",
          ownerSaveError
        );
      }

      /*
        თუ Supabase-ში Email Confirmation
        გამორთულია, session აქვე გვექნება.
      */

      if (data.session) {
        window.location.assign(
          "/account"
        );
        return;
      }

      /*
        თუ Email Confirmation ჩართულია,
        მომხმარებელმა ჯერ email უნდა
        დაადასტუროს.
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

      if (
        message
          .toLowerCase()
          .includes(
            "already registered"
          ) ||
        message
          .toLowerCase()
          .includes(
            "already been registered"
          )
      ) {
        setErrorMessage(
          "ამ ელფოსტით ანგარიში უკვე არსებობს. გთხოვთ შეხვიდეთ ანგარიშში."
        );
      } else {
        setErrorMessage(
          message
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <main className="page">
        <div
          className="pattern"
          aria-hidden="true"
        >
          <span className="shape s1">
            QR
          </span>

          <span className="shape s2">
            QR
          </span>

          <span className="shape s3">
            QR
          </span>

          <span className="shape s4">
            QR
          </span>

          <span className="shape s5">
            QR
          </span>
        </div>

        <header className="header">
          <a
            href="/"
            className="brand"
          >
            <span className="brandMark">
              QR
            </span>

            <span>
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

        <section className="content">
          <div className="intro">
            <span className="introTag">
              QR RETURN ACCOUNT
            </span>

            <h1>
              შექმენით თქვენი
              <br />
              QR RETURN ანგარიში
            </h1>

            <p className="introText">
              ერთი ანგარიში. ყველაფერი,
              რაც მნიშვნელოვანია —
              ერთ სივრცეში.
            </p>

            <div className="promise">
              <span>
                ✓
              </span>

              <p>
                ანგარიშის შექმნის შემდეგ
                შეგიძლიათ დაამატოთ და
                მართოთ თქვენი QR პროფილები.
              </p>
            </div>

            <div className="promise">
              <span>
                ✓
              </span>

              <p>
                ძაღლი, კატა, გასაღები,
                საფულე, ჩანთა და ჩემოდანი —
                ყველა ერთ ანგარიშში.
              </p>
            </div>

            <div className="promise">
              <span>
                ✓
              </span>

              <p>
                თქვენ აკონტროლებთ, რას
                დაინახავს QR კოდის მპოვნელი.
              </p>
            </div>

            <div className="quote">
              <strong>
                ერთი სკანირება შეიძლება
                იყოს პირველი ნაბიჯი
                დაბრუნებამდე.
              </strong>
            </div>
          </div>

          <section className="formCard">
            <div className="formHeader">
              <span>
                CREATE ACCOUNT
              </span>

              <h2>
                მფლობელის რეგისტრაცია
              </h2>

              <p>
                შეავსეთ ინფორმაცია თქვენი
                პირადი QR RETURN ანგარიშის
                შესაქმნელად.
              </p>
            </div>

            {errorMessage && (
              <div
                className="errorBox"
                role="alert"
              >
                <span>
                  !
                </span>

                <p>
                  {errorMessage}
                </p>
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
                    value={
                      firstName
                    }
                    onChange={(
                      event
                    ) =>
                      setFirstName(
                        event.target
                          .value
                      )
                    }
                    placeholder="თქვენი სახელი"
                    autoComplete="given-name"
                  />
                </Field>

                <Field
                  label="გვარი"
                  required
                >
                  <input
                    type="text"
                    value={
                      lastName
                    }
                    onChange={(
                      event
                    ) =>
                      setLastName(
                        event.target
                          .value
                      )
                    }
                    placeholder="თქვენი გვარი"
                    autoComplete="family-name"
                  />
                </Field>

                <Field
                  label="ელფოსტა"
                  required
                >
                  <input
                    type="email"
                    value={
                      email
                    }
                    onChange={(
                      event
                    ) =>
                      setEmail(
                        event.target
                          .value
                      )
                    }
                    placeholder="name@example.com"
                    autoComplete="email"
                  />
                </Field>

                <Field
                  label="ტელეფონის ნომერი"
                  required
                >
                  <input
                    type="tel"
                    value={
                      phone
                    }
                    onChange={(
                      event
                    ) =>
                      setPhone(
                        event.target
                          .value
                      )
                    }
                    placeholder="+1 ..."
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
                    value={
                      codeWord
                    }
                    onChange={(
                      event
                    ) =>
                      setCodeWord(
                        event.target
                          .value
                      )
                    }
                    placeholder="თქვენთვის დასამახსოვრებელი სიტყვა"
                    autoComplete="off"
                  />

                  <small className="fieldHelp">
                    შესაძლოა დაგჭირდეთ
                    ანგარიშის იდენტიფიკაციისა
                    და მხარდაჭერის დროს.
                  </small>
                </Field>

                <Field
                  label="პაროლი"
                  required
                >
                  <div className="passwordField">
                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        password
                      }
                      onChange={(
                        event
                      ) =>
                        setPassword(
                          event.target
                            .value
                        )
                      }
                      placeholder="მინ. 8 სიმბოლო"
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (
                            current
                          ) =>
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
                    onChange={(
                      event
                    ) =>
                      setConfirmPassword(
                        event.target
                          .value
                      )
                    }
                    placeholder="გაიმეორეთ პაროლი"
                    autoComplete="new-password"
                  />
                </Field>
              </div>

              <div className="privacy">
                <span>
                  🔒
                </span>

                <p>
                  თქვენი ანგარიშის მონაცემები
                  საჯაროდ არ გამოჩნდება.
                  თითოეული QR პროფილისთვის
                  თავად განსაზღვრავთ ხილულ
                  ინფორმაციას.
                </p>
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

            <div className="loginBottom">
              უკვე გაქვთ ანგარიში?

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
            0 28px 42px;

          background:
            #0647c8;

          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        .pattern {
          position: fixed;

          inset: 0;

          overflow: hidden;

          pointer-events: none;
        }

        .shape {
          position: absolute;

          color:
            rgba(
              255,
              255,
              255,
              0.05
            );

          font-size: 110px;
          font-weight: 950;

          transform:
            rotate(-18deg);
        }

        .s1 {
          top: 8%;
          left: 4%;
        }

        .s2 {
          top: 18%;
          right: 4%;

          transform:
            rotate(18deg);
        }

        .s3 {
          bottom: 8%;
          left: 9%;

          transform:
            rotate(12deg);
        }

        .s4 {
          bottom: -2%;
          right: 10%;

          transform:
            rotate(-10deg);
        }

        .s5 {
          top: 54%;
          left: 45%;

          font-size: 160px;

          opacity: 0.4;
        }

        .header {
          position: relative;

          z-index: 2;

          width: 100%;

          max-width: 1120px;

          min-height: 78px;

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
          width: 45px;

          height: 45px;

          display: grid;

          place-items: center;

          border-radius: 12px;

          background:
            #ffffff;

          color:
            #0647c8;

          font-size: 13px;

          font-weight: 950;

          box-shadow:
            0 9px 24px
            rgba(
              0,
              20,
              70,
              0.16
            );
        }

        .brand strong,
        .brand small {
          display: block;
        }

        .brand strong {
          color:
            #ffffff;

          font-size: 18px;

          font-weight: 950;
        }

        .brand small {
          margin-top: 2px;

          color:
            rgba(
              255,
              255,
              255,
              0.68
            );

          font-size: 10px;

          font-weight: 700;

          letter-spacing:
            0.65px;
        }

        .loginTop {
          min-height: 43px;

          padding:
            0 17px;

          display: inline-flex;

          align-items: center;

          justify-content:
            center;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.35
            );

          border-radius: 10px;

          color:
            #ffffff;

          font-size: 14px;

          font-weight: 850;

          text-decoration: none;
        }

        .content {
          position: relative;

          z-index: 2;

          width: 100%;

          max-width: 1120px;

          margin: 0 auto;

          padding-top: 48px;

          display: grid;

          grid-template-columns:
            minmax(
              0,
              0.9fr
            )
            minmax(
              520px,
              1.1fr
            );

          align-items: center;

          gap: 70px;
        }

        .intro {
          color:
            #ffffff;
        }

        .introTag {
          display: inline-flex;

          padding:
            7px 11px;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.26
            );

          border-radius:
            999px;

          background:
            rgba(
              255,
              255,
              255,
              0.08
            );

          font-size: 11px;

          font-weight: 900;

          letter-spacing:
            0.9px;
        }

        .intro h1 {
          margin:
            18px 0 0;

          color:
            #ffffff;

          font-size:
            clamp(
              38px,
              4vw,
              53px
            );

          line-height: 1.08;

          letter-spacing:
            -1.2px;
        }

        .introText {
          max-width: 500px;

          margin:
            16px 0 27px;

          color:
            rgba(
              255,
              255,
              255,
              0.82
            );

          font-size: 17px;

          line-height: 1.6;
        }

        .promise {
          max-width: 510px;

          margin-top: 13px;

          display: flex;

          align-items:
            flex-start;

          gap: 10px;
        }

        .promise > span {
          width: 25px;

          height: 25px;

          flex:
            0 0 25px;

          display: grid;

          place-items:
            center;

          border-radius:
            50%;

          background:
            #ffffff;

          color:
            #0647c8;

          font-size: 11px;

          font-weight: 950;
        }

        .promise p {
          margin: 1px 0 0;

          color:
            rgba(
              255,
              255,
              255,
              0.85
            );

          font-size: 14px;

          line-height: 1.5;
        }

        .quote {
          max-width: 480px;

          margin-top: 27px;

          padding:
            16px 18px;

          border-left:
            3px solid
            #ffffff;

          background:
            rgba(
              255,
              255,
              255,
              0.06
            );

          color:
            #ffffff;

          font-size: 14px;

          line-height: 1.55;
        }

        .formCard {
          padding:
            29px 31px;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.85
            );

          border-radius: 22px;

          background:
            #ffffff;

          box-shadow:
            0 28px 70px
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
          margin: 6px 0 0;

          color:
            #203a55;

          font-size: 27px;

          line-height: 1.2;
        }

        .formHeader p {
          margin: 6px 0 0;

          color:
            #738499;

          font-size: 14px;

          line-height: 1.5;
        }

        .errorBox {
          margin-top: 17px;

          padding:
            12px 13px;

          display: flex;

          align-items:
            flex-start;

          gap: 9px;

          border:
            1px solid
            #efc7cc;

          border-radius: 10px;

          background:
            #fff4f5;

          color:
            #a33d48;
        }

        .errorBox > span {
          width: 24px;

          height: 24px;

          flex:
            0 0 24px;

          display: grid;

          place-items:
            center;

          border-radius:
            50%;

          background:
            #f6dce0;

          font-size: 11px;

          font-weight: 900;
        }

        .errorBox p {
          margin: 2px 0 0;

          font-size: 13px;

          line-height: 1.45;
        }

        .grid {
          margin-top: 20px;

          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(
                0,
                1fr
              )
            );

          gap: 13px;
        }

        .field.full {
          grid-column:
            1 / -1;
        }

        .field label {
          display: block;

          margin-bottom: 6px;

          color:
            #344e68;

          font-size: 13px;

          font-weight: 800;
        }

        .required {
          color:
            #0647c8;
        }

        .field input {
          width: 100%;

          min-height: 46px;

          padding:
            0 12px;

          border:
            1px solid
            #d4e0eb;

          border-radius: 10px;

          background:
            #ffffff;

          color:
            #263f59;

          font-family:
            inherit;

          font-size: 14px;

          outline: none;

          transition:
            border-color
              0.18s ease,
            box-shadow
              0.18s ease;
        }

        .field input::placeholder {
          color:
            #a0adba;
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

          margin-top: 5px;

          color:
            #8795a5;

          font-size: 11px;

          line-height: 1.4;
        }

        .passwordField {
          position: relative;
        }

        .passwordField input {
          padding-right:
            67px;
        }

        .passwordField button {
          position: absolute;

          top: 50%;

          right: 7px;

          transform:
            translateY(-50%);

          min-height: 31px;

          padding:
            0 8px;

          border: 0;

          border-radius: 7px;

          background:
            #eef4fd;

          color:
            #0647c8;

          font-size: 10px;

          font-weight: 850;

          cursor: pointer;
        }

        .privacy {
          margin-top: 17px;

          padding:
            12px 13px;

          display: flex;

          align-items:
            flex-start;

          gap: 9px;

          border-radius: 10px;

          background:
            #f5f8fc;
        }

        .privacy > span {
          font-size: 17px;
        }

        .privacy p {
          margin: 0;

          color:
            #718397;

          font-size: 12px;

          line-height: 1.5;
        }

        .submitButton {
          width: 100%;

          min-height: 50px;

          margin-top: 18px;

          padding:
            0 18px;

          display: flex;

          align-items: center;

          justify-content:
            center;

          gap: 10px;

          border: 0;

          border-radius: 10px;

          background:
            #0647c8;

          color:
            #ffffff;

          font-family:
            inherit;

          font-size: 15px;

          font-weight: 900;

          cursor: pointer;

          box-shadow:
            0 10px 22px
            rgba(
              6,
              71,
              200,
              0.19
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

        .loginBottom {
          margin-top: 18px;

          padding-top: 17px;

          border-top:
            1px solid
            #e6edf4;

          color:
            #7b8b9c;

          font-size: 13px;

          text-align: center;
        }

        .loginBottom a {
          margin-left: 5px;

          color:
            #0647c8;

          font-weight: 850;

          text-decoration: none;
        }

        @media (
          max-width: 950px
        ) {
          .content {
            max-width: 680px;

            grid-template-columns:
              1fr;

            gap: 30px;
          }

          .intro {
            text-align: center;
          }

          .introText,
          .promise,
          .quote {
            margin-left: auto;

            margin-right: auto;
          }

          .promise {
            text-align: left;
          }
        }

        @media (
          max-width: 620px
        ) {
          .page {
            padding:
              0 14px 28px;
          }

          .header {
            min-height: 68px;
          }

          .brand small {
            display: none;
          }

          .brand strong {
            font-size: 16px;
          }

          .intro {
            padding-top: 8px;
          }

          .content {
            padding-top: 30px;
          }

          .intro h1 {
            font-size: 34px;
          }

          .introText {
            font-size: 15px;
          }

          .formCard {
            padding:
              23px 18px;

            border-radius: 17px;
          }

          .formHeader h2 {
            font-size: 23px;
          }

          .grid {
            grid-template-columns:
              1fr;
          }

          .field.full {
            grid-column:
              auto;
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

  children:
    React.ReactNode;
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
