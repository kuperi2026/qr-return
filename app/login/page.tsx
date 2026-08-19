"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

export default function LoginPage() {
  const [lang, setLang] = useState<Lang>("ka");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const ka = lang === "ka";

  useEffect(() => {
    async function checkSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        window.location.href = "/account";
      }
    }

    void checkSession();
  }, []);

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError(
        ka
          ? "შეიყვანეთ ელფოსტა და პაროლი."
          : "Enter your email and password."
      );
      return;
    }

    setLoading(true);

    try {
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      if (loginError) {
        throw loginError;
      }

      window.location.href = "/account";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "შესვლა ვერ მოხერხდა."
          : "Could not sign in."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    setError("");
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError(
        ka
          ? "პაროლის აღსადგენად ჯერ შეიყვანეთ თქვენი ელფოსტა."
          : "Enter your email first to reset your password."
      );
      return;
    }

    setResetLoading(true);

    try {
      const redirectTo =
        `${window.location.origin}/reset-password`;

      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(
          cleanEmail,
          {
            redirectTo,
          }
        );

      if (resetError) {
        throw resetError;
      }

      setMessage(
        ka
          ? "✓ პაროლის აღდგენის წერილი გამოგზავნილია. შეამოწმეთ Inbox და Spam."
          : "✓ Password recovery email sent. Check your Inbox and Spam folder."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "Recovery email-ის გაგზავნა ვერ მოხერხდა."
          : "Could not send recovery email."
      );
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <main className="page">
      <header className="header">
        <a href="/" className="brand">
          <div className="logo">QR</div>

          <div>
            <strong>QR RETURN</strong>
            <small>MY ACCOUNT</small>
          </div>
        </a>

        <div className="languages">
          <button
            type="button"
            className={ka ? "active" : ""}
            onClick={() => setLang("ka")}
          >
            GEO
          </button>

          <button
            type="button"
            className={!ka ? "active" : ""}
            onClick={() => setLang("en")}
          >
            ENG
          </button>
        </div>
      </header>

      <section className="wrapper">
        <div className="intro">
          <div className="eyebrow">
            {ka
              ? "QR RETURN ანგარიში"
              : "QR RETURN ACCOUNT"}
          </div>

          <h1>
            {ka
              ? "შედით თქვენს ანგარიშში"
              : "Sign in to your account"}
          </h1>

          <p>
            {ka
              ? "ერთი ანგარიშიდან მართეთ თქვენი ყველა ცხოველისა და ნივთის QR პროფილი."
              : "Manage all your pet and item QR profiles from one account."}
          </p>

          <div className="infoBox">
            <div className="infoIcon">✓</div>

            <div>
              <strong>
                {ka
                  ? "ერთი ანგარიში"
                  : "One account"}
              </strong>

              <p>
                {ka
                  ? "შექმენით და მართეთ იმდენი QR პროფილი, რამდენიც გჭირდებათ."
                  : "Create and manage as many QR profiles as you need."}
              </p>
            </div>
          </div>

          <div className="infoBox">
            <div className="infoIcon">💬</div>

            <div>
              <strong>Live Chat</strong>

              <p>
                {ka
                  ? "მიიღეთ მპოვნელის შეტყობინებები პირდაპირ თქვენს Owner Account-ში."
                  : "Receive finder messages directly in your Owner Account."}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <div className="userIcon">👤</div>

            <div>
              <span>QR RETURN</span>

              <h2>
                {ka
                  ? "შესვლა"
                  : "Sign in"}
              </h2>
            </div>
          </div>

          <p className="description">
            {ka
              ? "გამოიყენეთ თქვენი ელფოსტა და პაროლი."
              : "Use your email and password."}
          </p>

          <form onSubmit={handleLogin}>
            <label>
              <span>
                {ka
                  ? "ელფოსტა"
                  : "Email"}{" "}
                *
              </span>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="name@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label>
              <div className="passwordLabel">
                <span>
                  {ka
                    ? "პაროლი"
                    : "Password"}{" "}
                  *
                </span>

                <button
                  type="button"
                  className="forgotButton"
                  onClick={handleForgotPassword}
                  disabled={resetLoading}
                >
                  {resetLoading
                    ? ka
                      ? "იგზავნება..."
                      : "Sending..."
                    : ka
                    ? "დაგავიწყდათ პაროლი?"
                    : "Forgot password?"}
                </button>
              </div>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </label>

            {error && (
              <div className="error">
                <strong>!</strong>
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="success">
                <strong>✓</strong>
                <span>{message}</span>
              </div>
            )}

            <button
              type="submit"
              className="submitButton"
              disabled={loading}
            >
              {loading
                ? ka
                  ? "შესვლა..."
                  : "Signing in..."
                : ka
                ? "შესვლა"
                : "Sign in"}

              {!loading && <span>→</span>}
            </button>
          </form>

          <div className="signup">
            <span>
              {ka
                ? "ჯერ არ გაქვთ ანგარიში?"
                : "Don't have an account?"}
            </span>

            <a href="/account/register">
              {ka
                ? "ანგარიშის შექმნა"
                : "Create account"}{" "}
              →
            </a>
          </div>
        </div>
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
        }

        button,
        input {
          font: inherit;
        }

        .page {
          min-height: 100vh;
          color: #101828;
          font-family: Inter, Arial, sans-serif;
          background:
            radial-gradient(
              circle at 8% 15%,
              rgba(20, 101, 232, 0.1),
              transparent 27%
            ),
            radial-gradient(
              circle at 93% 10%,
              rgba(118, 85, 247, 0.11),
              transparent 28%
            ),
            #f7f9fc;
        }

        .header {
          width: calc(100% - 36px);
          max-width: 1180px;
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
          font-size: 14px;
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
          font-size: 10px;
          font-weight: 900;
          cursor: pointer;
        }

        .languages button.active {
          background: white;
          color: #1465e8;
        }

        .wrapper {
          width: calc(100% - 36px);
          max-width: 1000px;
          min-height: calc(100vh - 86px);
          margin: auto;
          padding: 60px 0;
          display: grid;
          grid-template-columns: 1fr 430px;
          align-items: center;
          gap: 70px;
        }

        .intro {
          max-width: 480px;
        }

        .eyebrow {
          color: #7655f7;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.6px;
        }

        .intro h1 {
          margin: 12px 0 15px;
          font-size: clamp(40px, 5vw, 55px);
          line-height: 1.04;
          letter-spacing: -2px;
        }

        .intro > p {
          margin: 0 0 24px;
          color: #667085;
          font-size: 14px;
          line-height: 1.7;
        }

        .infoBox {
          margin-top: 10px;
          padding: 14px;
          display: flex;
          gap: 11px;
          border: 1px solid #dbe7ff;
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.8);
        }

        .infoIcon {
          width: 36px;
          height: 36px;
          flex: 0 0 36px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #eef4ff;
          color: #1465e8;
          font-weight: 900;
        }

        .infoBox strong {
          font-size: 11px;
        }

        .infoBox p {
          margin: 4px 0 0;
          color: #667085;
          font-size: 9px;
          line-height: 1.5;
        }

        .card {
          padding: 31px;
          border: 1px solid #e4e7ec;
          border-radius: 24px;
          background: white;
          box-shadow: 0 25px 65px rgba(16, 24, 40, 0.1);
        }

        .cardHeader {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .userIcon {
          width: 53px;
          height: 53px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: linear-gradient(
            135deg,
            #eef4ff,
            #f0edff
          );
          font-size: 25px;
        }

        .cardHeader span {
          color: #7655f7;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .cardHeader h2 {
          margin: 4px 0 0;
          font-size: 24px;
        }

        .description {
          margin: 15px 0 21px;
          color: #667085;
          font-size: 11px;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        label > span,
        .passwordLabel > span {
          display: block;
          margin-bottom: 7px;
          color: #475467;
          font-size: 12px;
          font-weight: 800;
        }

        input {
          width: 100%;
          height: 51px;
          padding: 0 13px;
          border: 1px solid #d0d5dd;
          border-radius: 11px;
          background: white;
          outline: none;
        }

        input:focus {
          border-color: #84adff;
          box-shadow: 0 0 0 3px rgba(20, 101, 232, 0.08);
        }

        .passwordLabel {
          margin-bottom: 7px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .passwordLabel > span {
          margin: 0;
        }

        .forgotButton {
          padding: 0;
          border: 0;
          background: transparent;
          color: #1465e8;
          font-size: 9px;
          font-weight: 900;
          cursor: pointer;
        }

        .forgotButton:disabled {
          opacity: 0.6;
          cursor: default;
        }

        .error,
        .success {
          padding: 11px 12px;
          display: flex;
          gap: 8px;
          border-radius: 10px;
          font-size: 10px;
          line-height: 1.5;
        }

        .error {
          border: 1px solid #fecdca;
          background: #fff1f0;
          color: #b42318;
        }

        .success {
          border: 1px solid #abefc6;
          background: #ecfdf3;
          color: #027a48;
        }

        .submitButton {
          width: 100%;
          min-height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 0;
          border-radius: 11px;
          background: linear-gradient(
            135deg,
            #1465e8,
            #7655f7
          );
          color: white;
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
        }

        .submitButton:disabled {
          opacity: 0.6;
          cursor: default;
        }

        .signup {
          margin-top: 21px;
          padding-top: 17px;
          display: flex;
          justify-content: center;
          gap: 7px;
          border-top: 1px solid #eaecf0;
          color: #667085;
          font-size: 9px;
        }

        .signup a {
          color: #1465e8;
          font-weight: 900;
          text-decoration: none;
        }

        @media (max-width: 820px) {
          .wrapper {
            max-width: 600px;
            grid-template-columns: 1fr;
            gap: 35px;
          }
        }

        @media (max-width: 520px) {
          .wrapper {
            padding-top: 38px;
          }

          .intro h1 {
            font-size: 37px;
          }

          .card {
            padding: 23px;
          }

          .passwordLabel {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}
