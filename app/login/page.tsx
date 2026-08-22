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

export default function LoginPage() {
  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
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

  async function handleLogin(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");

    if (
      !email.trim() ||
      !password
    ) {
      setErrorMessage(
        "გთხოვთ შეავსოთ ელფოსტა და პაროლი."
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
        error,
      } =
        await supabase.auth
          .signInWithPassword({
            email:
              email
                .trim()
                .toLowerCase(),

            password,
          });

      if (error) {
        throw error;
      }

      window.location.assign(
        "/account"
      );
    } catch (error) {
      console.error(
        error
      );

      setErrorMessage(
        "ელფოსტა ან პაროლი არასწორია."
      );
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
            href="/signup"
            className="topButton"
          >
            რეგისტრაცია
          </a>
        </header>

        <section className="loginArea">
          <section className="loginCard">
            <div className="icon">
              QR
            </div>

            <span className="eyebrow">
              WELCOME BACK
            </span>

            <h1>
              შესვლა
            </h1>

            <p>
              შედით თქვენს QR RETURN
              ანგარიშში და მართეთ თქვენი
              QR პროფილები.
            </p>

            {errorMessage && (
              <div className="errorBox">
                {errorMessage}
              </div>
            )}

            <form
              onSubmit={
                handleLogin
              }
            >
              <label>
                ელფოსტა
              </label>

              <input
                type="email"
                value={email}
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

              <div className="passwordLabel">
                <label>
                  პაროლი
                </label>

                <a href="/reset-password">
                  დაგავიწყდათ პაროლი?
                </a>
              </div>

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
                  placeholder="თქვენი პაროლი"
                  autoComplete="current-password"
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

              <button
                type="submit"
                className="submitButton"
                disabled={loading}
              >
                {loading
                  ? "შესვლა..."
                  : "შესვლა →"}
              </button>
            </form>

            <div className="signup">
              არ გაქვთ ანგარიში?

              <a href="/signup">
                შექმენით ანგარიში
              </a>
            </div>
          </section>

          <p className="slogan">
            ერთი ანგარიში.
            ყველა მნიშვნელოვანი პროფილი
            ერთ სივრცეში.
          </p>
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
            0 20px 30px;

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

          font-size: 120px;
          font-weight: 950;
        }

        .backgroundPattern span:nth-child(1) {
          top: 9%;
          left: 7%;
        }

        .backgroundPattern span:nth-child(2) {
          top: 18%;
          right: 7%;
        }

        .backgroundPattern span:nth-child(3) {
          bottom: 7%;
          left: 10%;
        }

        .backgroundPattern span:nth-child(4) {
          bottom: 9%;
          right: 8%;
        }

        .header {
          position: relative;
          z-index: 2;

          width: 100%;
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
          color:
            #ffffff;

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
            10px 15px;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.32
            );

          border-radius: 9px;

          color:
            #ffffff;

          font-size: 14px;
          font-weight: 850;

          text-decoration: none;
        }

        .loginArea {
          position: relative;
          z-index: 2;

          width: 100%;

          min-height:
            calc(
              100vh -
              104px
            );

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          padding:
            35px 0;
        }

        .loginCard {
          width: 100%;
          max-width: 460px;

          padding:
            31px 32px;

          border-radius: 20px;

          background:
            #ffffff;

          box-shadow:
            0 26px 65px
            rgba(
              0,
              24,
              78,
              0.3
            );
        }

        .icon {
          width: 52px;
          height: 52px;

          margin-bottom: 16px;

          display: grid;
          place-items: center;

          border-radius: 14px;

          background:
            #0647c8;

          color:
            #ffffff;

          font-size: 13px;
          font-weight: 950;
        }

        .eyebrow {
          color:
            #0647c8;

          font-size: 11px;
          font-weight: 900;

          letter-spacing:
            0.8px;
        }

        .loginCard h1 {
          margin:
            5px 0 0;

          color:
            #203a55;

          font-size: 28px;
        }

        .loginCard > p {
          margin:
            7px 0 0;

          color:
            #74869a;

          font-size: 14px;

          line-height: 1.55;
        }

        .errorBox {
          margin-top: 17px;

          padding:
            12px;

          border-radius: 9px;

          background:
            #fff0f2;

          color:
            #a23e49;

          font-size: 13px;
        }

        form {
          margin-top: 21px;
        }

        label {
          display: block;

          margin-bottom: 7px;

          color:
            #344e68;

          font-size: 14px;

          font-weight: 800;
        }

        input {
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

          font-family:
            inherit;

          font-size: 15px;

          outline: none;
        }

        input:focus {
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

        .passwordLabel {
          margin-top: 15px;

          display: flex;
          align-items: center;
          justify-content:
            space-between;

          gap: 10px;
        }

        .passwordLabel label {
          margin: 0;
        }

        .passwordLabel a {
          color:
            #0647c8;

          font-size: 12px;

          font-weight: 800;

          text-decoration: none;
        }

        .passwordWrap {
          position: relative;

          margin-top: 7px;
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

          padding:
            7px 8px;

          border-radius: 7px;

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

          margin-top: 19px;

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

        .signup {
          margin-top: 19px;

          padding-top: 17px;

          border-top:
            1px solid
            #e6edf4;

          color:
            #7b8b9c;

          font-size: 13px;

          text-align: center;
        }

        .signup a {
          margin-left: 5px;

          color:
            #0647c8;

          font-weight: 850;

          text-decoration: none;
        }

        .slogan {
          max-width: 480px;

          margin:
            18px 0 0;

          color:
            rgba(
              255,
              255,
              255,
              0.77
            );

          font-size: 13px;

          text-align: center;
        }

        @media (
          max-width: 520px
        ) {
          .page {
            padding:
              0 13px 24px;
          }

          .brand small {
            display: none;
          }

          .loginCard {
            padding:
              25px 19px;

            border-radius: 17px;
          }

          .loginCard h1 {
            font-size: 25px;
          }
        }
      `}</style>
    </>
  );
}
