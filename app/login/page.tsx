"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

export default function LoginPage() {
  const [lang, setLang] = useState<Lang>("ka");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const ka = lang === "ka";

  useEffect(() => {
    async function checkSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        window.location.href = "/my-profiles";
      }
    }

    checkSession();
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

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
        setError(
          ka
            ? "ელფოსტა ან პაროლი არასწორია."
            : "Incorrect email or password."
        );
        return;
      }

      window.location.href = "/my-profiles";
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
            {ka ? "QR RETURN ანგარიში" : "QR RETURN ACCOUNT"}
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
              <strong>{ka ? "ერთი ანგარიში" : "One account"}</strong>
              <p>
                {ka
                  ? "შექმენით იმდენი ცალკე პროფილი, რამდენიც გსურთ."
                  : "Create as many separate profiles as you need."}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <div className="userIcon">👤</div>

            <div>
              <span>QR RETURN</span>
              <h2>{ka ? "შესვლა" : "Sign in"}</h2>
            </div>
          </div>

          <p className="description">
            {ka
              ? "გამოიყენეთ თქვენი ელფოსტა და პაროლი."
              : "Use your email and password."}
          </p>

          <form onSubmit={handleLogin}>
            <label>
              <span>{ka ? "ელფოსტა" : "Email"} *</span>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label>
              <span>{ka ? "პაროლი" : "Password"} *</span>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
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

            <a href="/signup">
              {ka ? "ანგარიშის შექმნა" : "Create account"} →
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
          background: linear-gradient(135deg, #1465e8, #7655f7);
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
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.7px;
        }

        .languages {
          padding: 4px;
          display: flex;
          border-radius: 10px;
          background: #eaecf0;
        }

        .languages button {
          padding: 8px 11px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #667085;
          font-size: 11px;
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
          padding: 70px 0;
          display: grid;
          grid-template-columns: 1fr 450px;
          align-items: center;
          gap: 75px;
        }

        .intro {
          max-width: 470px;
        }

        .eyebrow {
          color: #7655f7;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 1.7px;
        }

        .intro h1 {
          margin: 13px 0 17px;
          font-size: clamp(42px, 5vw, 58px);
          line-height: 1.05;
          letter-spacing: -2.5px;
        }

        .intro > p {
          margin: 0;
          color: #667085;
          font-size: 17px;
          line-height: 1.7;
        }

        .infoBox {
          margin-top: 32px;
          padding: 17px;
          display: flex;
          gap: 13px;
          align-items: flex-start;
          border: 1px solid #dbe7ff;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.75);
        }

        .infoIcon {
          width: 32px;
          height: 32px;
          flex: 0 0 32px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #eef4ff;
          color: #1465e8;
          font-weight: 900;
        }

        .infoBox strong {
          color: #344054;
          font-size: 14px;
        }

        .infoBox p {
          margin: 5px 0 0;
          color: #667085;
          font-size: 13px;
          line-height: 1.5;
        }

        .card {
          padding: 32px;
          border: 1px solid #e4e7ec;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.97);
          box-shadow: 0 25px 65px rgba(16, 24, 40, 0.1);
        }

        .cardHeader {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .userIcon {
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: linear-gradient(135deg, #eef4ff, #f0edff);
          font-size: 27px;
        }

        .cardHeader span {
          color: #7655f7;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .cardHeader h2 {
          margin: 4px 0 0;
          color: #344054;
          font-size: 25px;
        }

        .description {
          margin: 17px 0 25px;
          color: #667085;
          font-size: 14px;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 17px;
        }

        label > span {
          display: block;
          margin-bottom: 7px;
          color: #475467;
          font-size: 14px;
          font-weight: 800;
        }

        input {
          width: 100%;
          height: 52px;
          padding: 0 14px;
          outline: none;
          border: 1px solid #d0d5dd;
          border-radius: 11px;
          background: white;
          color: #344054;
          font-size: 16px;
        }

        input:focus {
          border-color: #84adff;
          box-shadow: 0 0 0 3px rgba(20, 101, 232, 0.08);
        }

        .error {
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 9px;
          border: 1px solid #fecdca;
          border-radius: 10px;
          background: #fff1f0;
          color: #b42318;
          font-size: 13px;
        }

        .error strong {
          width: 20px;
          height: 20px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #d92d20;
          color: white;
          font-size: 10px;
        }

        .submitButton {
          width: 100%;
          min-height: 53px;
          margin-top: 4px;
          padding: 0 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 0;
          border-radius: 11px;
          background: linear-gradient(135deg, #1465e8, #7655f7);
          color: white;
          font-size: 15px;
          font-weight: 900;
          cursor: pointer;
        }

        .submitButton:disabled {
          opacity: 0.65;
        }

        .signup {
          margin-top: 22px;
          padding-top: 19px;
          display: flex;
          justify-content: center;
          gap: 7px;
          border-top: 1px solid #eaecf0;
          font-size: 13px;
        }

        .signup span {
          color: #667085;
        }

        .signup a {
          color: #1465e8;
          font-weight: 900;
          text-decoration: none;
        }

        @media (max-width: 850px) {
          .wrapper {
            max-width: 600px;
            grid-template-columns: 1fr;
            gap: 35px;
          }

          .intro {
            max-width: none;
            text-align: center;
          }

          .infoBox {
            text-align: left;
          }
        }

        @media (max-width: 550px) {
          .wrapper {
            padding-top: 40px;
          }

          .intro h1 {
            font-size: 40px;
          }

          .card {
            padding: 23px;
          }
        }
      `}</style>
    </main>
  );
}
