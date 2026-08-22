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

      try {
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
      } catch (
        ownerError
      ) {
        console.error(
          ownerError
        );
      }

      if (data.session) {
        window.location.assign(
          "/account"
        );
        return;
      }

      window.location.assign(
        `/login?registered=1&email=${encodeURIComponent(
          email
            .trim()
            .toLowerCase()
        )}`
      );
    } catch (error) {
      console.error(
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
          )
      ) {
        setErrorMessage(
          "ამ ელფოსტით ანგარიში უკვე არსებობს."
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
          className="backgroundPattern"
          aria-hidden="true"
        >
          <span>QR</span>
          <span>QR</span>
          <span>QR</span>
          <span>QR</span>
          <span>QR</span>
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
            className="topButton"
          >
            შესვლა
          </a>
        </header>

        <section className="content">
          <div className="intro">
            <span className="eyebrow">
              QR RETURN ACCOUNT
            </span>

            <h1>
              შექმენით ანგარიში
            </h1>

            <p>
              ერთი ანგარიში —
              ყველა QR პროფილი
              ერთ სივრცეში.
            </p>

            <div className="shortMessage">
              <strong>
                ყველაფერი მნიშვნელოვანი
                უფრო მარტივად სამართავად.
              </strong>

              <span>
                ანგარიშის შექმნის შემდეგ
                შეგიძლიათ დაამატოთ ძაღლი,
                კატა, გასაღები, საფულე,
                ჩანთა ან ჩემოდანი.
              </span>
            </div>

            <div className="miniSlogan">
              ერთი სკანირება შეიძლება
              იყოს პირველი ნაბიჯი
              დაბრუნებამდე.
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
                შეავსეთ თქვენი ძირითადი
                ინფორმაცია.
              </p>
            </div>

            {errorMessage && (
              <div className="errorBox">
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
                    placeholder="სახელი"
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
                    placeholder="გვარი"
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
                  />

                  <small>
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
                  />
                </Field>
              </div>

              <button
                type="submit"
                className="submitButton"
                disabled={loading}
              >
                {loading
                  ? "ანგარიში იქმნება..."
                  : "ანგარიშის შექმნა →"}
              </button>
            </form>

            <div className="bottomLogin">
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
            0 24px 36px;

          background:
            #0647c8;
        }

        .backgroundPattern {
          position: fixed;
          inset: 0;

          pointer-events: none;
        }

        .backgroundPattern span {
          position: absolute;

          color:
            rgba(
              255,
              255,
              255,
              0.045
            );

          font-size: 115px;
          font-weight: 950;
        }

        .backgroundPattern span:nth-child(1) {
          top: 10%;
          left: 3%;
        }

        .backgroundPattern span:nth-child(2) {
          top: 8%;
          right: 5%;
        }

        .backgroundPattern span:nth-child(3) {
          bottom: 7%;
          left: 8%;
        }

        .backgroundPattern span:nth-child(4) {
          bottom: 4%;
          right: 8%;
        }

        .backgroundPattern span:nth-child(5) {
          top: 48%;
          left: 44%;

          font-size: 160px;
        }

        .header {
          position: relative;
          z-index: 2;

          max-width: 1080px;

          min-height: 74px;

          margin: auto;

          display: flex;
          align-items: center;
          justify-content:
            space-between;

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

        .brand strong,
        .brand small {
          display: block;
        }

        .brand strong {
          color: #ffffff;

          font-size: 18px;
        }

        .brand small {
          margin-top: 2px;

          color:
            rgba(
              255,
              255,
              255,
              0.7
            );

          font-size: 10px;
        }

        .topButton {
          padding:
            10px 16px;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.32
            );

          border-radius: 9px;

          color: #ffffff;

          font-size: 14px;
          font-weight: 850;

          text-decoration: none;
        }

        .content {
          position: relative;
          z-index: 2;

          width: 100%;
          max-width: 1080px;

          margin: auto;

          padding-top: 42px;

          display: grid;

          grid-template-columns:
            0.9fr
            minmax(
              500px,
              1fr
            );

          align-items: center;

          gap: 65px;
        }

        .intro {
          color: #ffffff;
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
          margin: 11px 0 0;

          color: #ffffff;

          font-size: 39px;
          line-height: 1.1;
        }

        .intro > p {
          max-width: 430px;

          margin: 12px 0 0;

          color:
            rgba(
              255,
              255,
              255,
              0.84
            );

          font-size: 17px;
          line-height: 1.55;
        }

        .shortMessage {
          max-width: 470px;

          margin-top: 26px;

          padding:
            18px 19px;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.17
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

        .shortMessage strong {
          display: block;

          color: #ffffff;

          font-size: 15px;
        }

        .shortMessage span {
          display: block;

          margin-top: 7px;

          color:
            rgba(
              255,
              255,
              255,
              0.75
            );

          font-size: 13px;
          line-height: 1.55;
        }

        .miniSlogan {
          max-width: 450px;

          margin-top: 18px;

          padding-left: 14px;

          border-left:
            3px solid
            #ffffff;

          color:
            rgba(
              255,
              255,
              255,
              0.87
            );

          font-size: 14px;
          line-height: 1.55;
        }

        .formCard {
          width: 100%;
          max-width: 520px;

          margin-left: auto;

          padding:
            27px 28px;

          border-radius: 20px;

          background:
            #ffffff;

          box-shadow:
            0 25px 65px
            rgba(
              0,
              25,
              80,
              0.3
            );
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
        }

        .formHeader p {
          margin: 6px 0 0;

          color: #74869a;

          font-size: 14px;
        }

        .errorBox {
          margin-top: 15px;

          padding: 12px;

          border-radius: 9px;

          background: #fff0f2;

          color: #a23e49;

          font-size: 13px;
        }

        .grid {
          margin-top: 19px;

          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0,1fr)
            );

          gap: 13px;
        }

        .field.full {
          grid-column:
            1 / -1;
        }

        .field label {
          display: block;

          margin-bottom: 7px;

          color: #344e68;

          font-size: 14px;
          font-weight: 800;
        }

        .field input {
          width: 100%;

          height: 51px;

          padding:
            0 14px;

          border:
            1px solid
            #d4e0eb;

          border-radius: 10px;

          background:
            #ffffff;

          color: #263f59;

          font-family: inherit;

          font-size: 15px;

          outline: none;
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

        .field small {
          display: block;

          margin-top: 6px;

          color: #8594a4;

          font-size: 11px;
        }

        .passwordWrap {
          position: relative;
        }

        .passwordWrap input {
          padding-right:
            68px;
        }

        .passwordWrap button {
          position: absolute;

          top: 50%;
          right: 8px;

          transform:
            translateY(-50%);

          border: 0;

          border-radius: 7px;

          padding:
            7px 8px;

          background:
            #edf4ff;

          color:
            #0647c8;

          font-size: 10px;
          font-weight: 850;

          cursor: pointer;
        }

        .submitButton {
          width: 100%;
          height: 51px;

          margin-top: 18px;

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
        }

        .submitButton:disabled {
          opacity: 0.65;
        }

        .bottomLogin {
          margin-top: 17px;

          padding-top: 16px;

          border-top:
            1px solid
            #e6edf4;

          color:
            #7b8b9c;

          font-size: 13px;

          text-align: center;
        }

        .bottomLogin a {
          margin-left: 5px;

          color:
            #0647c8;

          font-weight: 850;

          text-decoration: none;
        }

        @media (
          max-width: 900px
        ) {
          .content {
            max-width: 620px;

            grid-template-columns:
              1fr;

            gap: 28px;
          }

          .intro {
            text-align: center;
          }

          .intro > p,
          .shortMessage,
          .miniSlogan {
            margin-left: auto;
            margin-right: auto;
          }

          .formCard {
            margin: auto;
          }
        }

        @media (
          max-width: 600px
        ) {
          .page {
            padding:
              0 13px 26px;
          }

          .brand small {
            display: none;
          }

          .content {
            padding-top: 28px;
          }

          .intro h1 {
            font-size: 31px;
          }

          .formCard {
            padding:
              22px 18px;
          }

          .grid {
            grid-template-columns:
              1fr;
          }

          .field.full {
            grid-column: auto;
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
        {required && " *"}
      </label>

      {children}
    </div>
  );
}
