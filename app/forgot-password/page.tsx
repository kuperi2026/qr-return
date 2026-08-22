"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@supabase/supabase-js";

function createSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY;

  if (!url || !key) {
    throw new Error("Supabase კავშირი ვერ მოიძებნა.");
  }

  return createClient(url, key);
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage("შეიყვანეთ ელფოსტა.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createSupabase();

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          cleanEmail,
          {
            redirectTo:
              `${window.location.origin}/reset-password`,
          }
        );

      if (error) {
        throw error;
      }

      setSent(true);
    } catch (error) {
      console.error(
        "Password recovery error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "აღდგენის ბმულის გაგზავნა ვერ მოხერხდა."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <main className="page">
        <div className="decor decor1">
          QR
        </div>

        <div className="decor decor2">
          QR
        </div>

        <header className="header">
          <a href="/" className="brand">
            <span className="brandIcon">
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
        </header>

        <section className="center">
          <div className="card">
            {!sent ? (
              <>
                <span className="eyebrow">
                  PASSWORD RECOVERY
                </span>

                <h1>
                  პაროლის აღდგენა
                </h1>

                <p className="description">
                  შეიყვანეთ თქვენს ანგარიშზე
                  რეგისტრირებული ელფოსტა.
                </p>

                {errorMessage && (
                  <div
                    className="error"
                    role="alert"
                  >
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
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

                  <button
                    type="submit"
                    className="submit"
                    disabled={loading}
                  >
                    {loading
                      ? "იგზავნება..."
                      : "აღდგენის ბმულის გაგზავნა"}
                  </button>
                </form>

                <a
                  href="/login"
                  className="back"
                >
                  ← შესვლაზე დაბრუნება
                </a>
              </>
            ) : (
              <div className="success">
                <div className="successIcon">
                  ✓
                </div>

                <h1>
                  ბმული გამოგზავნილია
                </h1>

                <p>
                  შეამოწმეთ ელფოსტა და
                  გახსენით პაროლის აღდგენის
                  ბმული.
                </p>

                <button
                  type="button"
                  className="again"
                  onClick={() => {
                    setSent(false);
                    setErrorMessage("");
                  }}
                >
                  ხელახლა გაგზავნა
                </button>

                <a
                  href="/login"
                  className="loginLink"
                >
                  შესვლაზე დაბრუნება
                </a>
              </div>
            )}
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

        .decor1 {
          top: 15%;
          left: 6%;

          transform: rotate(-14deg);
        }

        .decor2 {
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

        .brand strong,
        .brand small {
          display: block;
        }

        .brand strong {
          color: #ffffff;

          font-size: 17px;
          font-weight: 900;
        }

        .brand small {
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

          letter-spacing: 1px;
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

        form {
          margin-top: 23px;
        }

        .field label {
          display: block;

          margin-bottom: 8px;

          color: #42576b;

          font-size: 13px;
          font-weight: 850;
        }

        .field input {
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

        .field input:focus {
          border-color: #1266e9;

          background: #ffffff;

          box-shadow:
            0 0 0 4px
            rgba(18, 102, 233, 0.09);
        }

        .submit {
          width: 100%;
          height: 51px;

          margin-top: 20px;

          border: 0;
          border-radius: 10px;

          background: #0647c8;
          color: #ffffff;

          font-family: inherit;
          font-size: 13px;
          font-weight: 900;

          cursor: pointer;
        }

        .submit:hover:not(:disabled) {
          background: #0754dc;
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

        .back {
          display: block;

          margin-top: 18px;

          color: #64788c;

          font-size: 12px;
          font-weight: 750;

          text-align: center;
          text-decoration: none;
        }

        .back:hover {
          color: #0647c8;
        }

        .success {
          text-align: center;
        }

        .successIcon {
          width: 48px;
          height: 48px;

          margin: 0 auto 14px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #eaf3ff;
          color: #0647c8;

          font-size: 20px;
          font-weight: 950;
        }

        .success p {
          margin: 9px 0 0;

          color: #78899a;

          font-size: 13px;
          line-height: 1.55;
        }

        .again,
        .loginLink {
          width: 100%;
          height: 51px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 10px;

          font-family: inherit;
          font-size: 13px;
          font-weight: 900;

          cursor: pointer;
        }

        .again {
          margin-top: 22px;

          border: 0;

          background: #0647c8;
          color: #ffffff;
        }

        .loginLink {
          margin-top: 10px;

          border:
            1px solid #dce5ee;

          background: #ffffff;
          color: #42576b;

          text-decoration: none;
        }

        @media (max-width: 520px) {
          .brand small {
            display: none;
          }

          .card {
            padding: 25px 19px;
            border-radius: 16px;
          }

          h1 {
            font-size: 23px;
          }

          .field input {
            height: 54px;
            font-size: 16px;
          }
        }
      `}</style>
    </>
  );
}
