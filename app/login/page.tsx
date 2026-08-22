"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

function createSupabase() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase კავშირი ვერ მოიძებნა."
    );
  }

  return createClient(url, key);
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] =
    useState(
      searchParams.get("email") || ""
    );

  const [password, setPassword] =
    useState("");

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

  const registered =
    searchParams.get("registered") === "1";

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage(
        "გთხოვთ შეიყვანოთ ელფოსტა."
      );
      return;
    }

    if (!password) {
      setErrorMessage(
        "გთხოვთ შეიყვანოთ პაროლი."
      );
      return;
    }

    setLoading(true);

    try {
      const supabase =
        createSupabase();

      const { error } =
        await supabase.auth
          .signInWithPassword({
            email: cleanEmail,
            password,
          });

      if (error) {
        throw error;
      }

      /*
       * მთავარი ლოგიკა:
       *
       * ახალი რეგისტრაციის შემდეგ URL იქნება:
       * /login?registered=1&next=/register
       *
       * ამიტომ პირდაპირ პროდუქტის არჩევაზე წავა.
       *
       * ჩვეულებრივი Login:
       * /login
       *
       * წავა /account-ზე.
       */

      const requestedNext =
        searchParams.get("next");

      const safeNext =
        requestedNext &&
        requestedNext.startsWith("/") &&
        !requestedNext.startsWith("//")
          ? requestedNext
          : "/account";

      router.replace(safeNext);
      router.refresh();
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "";

      const lower =
        message.toLowerCase();

      if (
        lower.includes(
          "invalid login credentials"
        ) ||
        lower.includes(
          "invalid login"
        )
      ) {
        setErrorMessage(
          "ელფოსტა ან პაროლი არასწორია."
        );
      } else if (
        lower.includes(
          "email not confirmed"
        )
      ) {
        setErrorMessage(
          "გთხოვთ ჯერ დაადასტუროთ ელფოსტა."
        );
      } else {
        setErrorMessage(
          message ||
            "ანგარიშში შესვლა ვერ მოხერხდა."
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
          className="decor decorOne"
          aria-hidden="true"
        >
          QR
        </div>

        <div
          className="decor decorTwo"
          aria-hidden="true"
        >
          QR
        </div>

        <header className="header">
          <a
            href="/"
            className="brand"
          >
            <span className="brandIcon">
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
        </header>

        <section className="center">
          <div className="card">
            <span className="eyebrow">
              QR RETURN ანგარიში
            </span>

            <h1>
              შედით თქვენს ანგარიშში
            </h1>

            <p className="description">
              ერთი ანგარიშიდან მართეთ
              თქვენი ყველა QR პროფილი.
            </p>

            {registered && (
              <div className="successNotice">
                ✓ ანგარიში შექმნილია.
                შედით და გააგრძელეთ
                პროდუქტის არჩევა.
              </div>
            )}

            {errorMessage && (
              <div
                className="error"
                role="alert"
              >
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="field">
                <label htmlFor="email">
                  ელფოსტა
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  autoComplete="email"
                  required
                />
              </div>

              <div className="field">
                <div className="passwordLabel">
                  <label htmlFor="password">
                    პაროლი
                  </label>

                  <a
                    href="/forgot-password"
                    className="forgot"
                  >
                    დაგავიწყდათ პაროლი?
                  </a>
                </div>

                <div className="passwordBox">
                  <input
                    id="password"
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
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="showButton"
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
              </div>

              <button
                type="submit"
                className="submit"
                disabled={loading}
              >
                {loading
                  ? "შესვლა..."
                  : registered
                    ? "შესვლა და გაგრძელება →"
                    : "შესვლა"}
              </button>
            </form>

            <div className="divider">
              <span />
            </div>

            <div className="signup">
              <span>
                არ გაქვთ ანგარიში?
              </span>

              <a href="/signup">
                რეგისტრაცია
              </a>
            </div>
          </div>
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

          padding: 0 20px 30px;

          background:
            radial-gradient(
              circle at 15% 20%,
              rgba(255, 255, 255, 0.08),
              transparent 26%
            ),
            #0647c8;

          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        .decor {
          position: fixed;

          color:
            rgba(255, 255, 255, 0.04);

          font-size: 150px;
          font-weight: 950;

          pointer-events: none;
          user-select: none;
        }

        .decorOne {
          top: 15%;
          left: 6%;
          transform: rotate(-14deg);
        }

        .decorTwo {
          right: 7%;
          bottom: 8%;
          transform: rotate(14deg);
        }

        .header {
          position: relative;
          z-index: 2;

          width: 100%;
          max-width: 1060px;
          height: 68px;

          margin: auto;

          display: flex;
          align-items: center;

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
          width: 41px;
          height: 41px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          background: #ffffff;
          color: #0647c8;

          font-size: 11px;
          font-weight: 950;
        }

        .brandText strong,
        .brandText small {
          display: block;
        }

        .brandText strong {
          color: #ffffff;

          font-size: 17px;
          font-weight: 900;
        }

        .brandText small {
          margin-top: 2px;

          color:
            rgba(255, 255, 255, 0.67);

          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.6px;
        }

        .center {
          position: relative;
          z-index: 2;

          min-height:
            calc(100vh - 90px);

          display: grid;
          place-items: center;

          padding: 20px 0 35px;
        }

        .card {
          width: 100%;
          max-width: 430px;

          padding: 29px 30px 27px;

          border-radius: 18px;

          background: #ffffff;

          box-shadow:
            0 24px 58px
            rgba(0, 24, 78, 0.3);
        }

        .eyebrow {
          display: block;

          margin-bottom: 6px;

          color: #0647c8;

          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.7px;
        }

        h1 {
          margin: 0;

          color: #203a55;

          font-size: 24px;
          font-weight: 900;

          line-height: 1.25;
        }

        .description {
          margin: 8px 0 0;

          color: #78899a;

          font-size: 13px;
          line-height: 1.55;
        }

        .successNotice {
          margin-top: 17px;

          padding: 11px 13px;

          border:
            1px solid #cfe5d8;

          border-radius: 9px;

          background: #f1fbf5;
          color: #24704a;

          font-size: 12px;
          font-weight: 750;
          line-height: 1.45;
        }

        form {
          margin-top: 23px;

          display: grid;
          gap: 18px;
        }

        .field label {
          display: block;

          color: #42576b;

          font-size: 13px;
          font-weight: 850;
        }

        .field > label {
          margin-bottom: 8px;
        }

        .passwordLabel {
          margin-bottom: 8px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 15px;
        }

        .forgot {
          color: #0647c8;

          font-size: 11px;
          font-weight: 800;

          text-decoration: none;
        }

        input {
          display: block;

          width: 100%;
          height: 56px;

          padding: 0 16px;

          border:
            1.5px solid #d5e0ea;

          border-radius: 11px;

          background: #fbfdff;
          color: #263f59;

          font-family: inherit;
          font-size: 15px;

          outline: none;
        }

        input:focus {
          border-color: #1266e9;

          background: #ffffff;

          box-shadow:
            0 0 0 4px
            rgba(18, 102, 233, 0.09);
        }

        .passwordBox {
          position: relative;
        }

        .passwordBox input {
          padding-right: 85px;
        }

        .showButton {
          position: absolute;

          top: 50%;
          right: 9px;

          transform:
            translateY(-50%);

          min-width: 61px;
          height: 34px;

          border: 0;
          border-radius: 8px;

          background: #edf4ff;
          color: #0647c8;

          font-family: inherit;
          font-size: 10px;
          font-weight: 850;

          cursor: pointer;
        }

        .submit {
          width: 100%;
          height: 51px;

          border: 0;
          border-radius: 10px;

          background: #0647c8;
          color: #ffffff;

          font-family: inherit;
          font-size: 13px;
          font-weight: 900;

          cursor: pointer;
        }

        .submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .error {
          margin-top: 16px;

          padding: 10px 12px;

          border:
            1px solid #f0ced2;

          border-radius: 9px;

          background: #fff3f4;
          color: #a3424a;

          font-size: 12px;
          line-height: 1.45;
        }

        .divider {
          margin: 23px 0 18px;
        }

        .divider span {
          display: block;
          height: 1px;

          background: #e7edf3;
        }

        .signup {
          display: flex;
          align-items: center;
          justify-content: center;

          gap: 5px;

          color: #718396;

          font-size: 12px;
        }

        .signup a {
          color: #0647c8;

          font-weight: 900;

          text-decoration: none;
        }

        @media (max-width: 520px) {
          .brandText small {
            display: none;
          }

          .card {
            padding: 25px 19px;
            border-radius: 16px;
          }

          h1 {
            font-size: 23px;
          }

          input {
            height: 54px;
            font-size: 16px;
          }
        }
      `}</style>
    </>
  );
}
