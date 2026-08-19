"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

export default function LoginPage() {
  const [lang, setLang] = useState<Lang>("ka");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  const ka = lang === "ka";

  useEffect(() => {
    checkExistingSession();
  }, []);

  async function routeUser() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return false;
    }

    // 1. ჯერ ვამოწმებთ — ეს მომხმარებელი Owner არის თუ არა.
    const { data: ownerData, error: ownerError } = await supabase
      .from("owner_accounts")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (ownerError) {
      throw ownerError;
    }

    if (ownerData) {
      window.location.href = "/account";
      return true;
    }

    // 2. თუ Owner არ არის, ვცდილობთ Admin access-ის claim-ს.
    const { data: adminData, error: adminError } = await supabase.rpc(
      "claim_admin_access"
    );

    if (adminError) {
      throw adminError;
    }

    if (adminData && adminData.length > 0) {
      window.location.href = "/admin-dashboard";
      return true;
    }

    // 3. თუ არც Owner არის და არც Admin assignment აქვს.
    setError(
      ka
        ? "ამ ანგარიშთან Owner ან Admin პროფილი დაკავშირებული არ არის."
        : "No Owner or Admin profile is connected to this account."
    );

    return false;
  }

  async function checkExistingSession() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setChecking(false);
        return;
      }

      await routeUser();
    } catch (err) {
      console.error(err);
      setChecking(false);
    }
  }

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
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      if (loginError) {
        throw loginError;
      }

      if (!data.user) {
        throw new Error(
          ka
            ? "ანგარიშზე შესვლა ვერ მოხერხდა."
            : "Could not sign in."
        );
      }

      await routeUser();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "";

      if (
        message.toLowerCase().includes("invalid login") ||
        message.toLowerCase().includes("invalid credentials")
      ) {
        setError(
          ka
            ? "ელფოსტა ან პაროლი არასწორია."
            : "Incorrect email or password."
        );
      } else {
        setError(
          message ||
            (ka
              ? "ანგარიშზე შესვლა ვერ მოხერხდა."
              : "Could not sign in.")
        );
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setError("");
    setChecking(false);
  }

  if (checking) {
    return (
      <main className="statePage">
        <div className="stateLogo">QR</div>
        <strong>QR RETURN</strong>

        <p>
          {ka
            ? "ანგარიშის ტიპი მოწმდება..."
            : "Checking account type..."}
        </p>

        <button type="button" onClick={handleLogout}>
          {ka ? "სხვა ანგარიშით შესვლა" : "Use another account"}
        </button>

        <style jsx>{`
          .statePage {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #f7f9fc;
            font-family: Inter, Arial, sans-serif;
            color: #667085;
          }

          .stateLogo {
            width: 55px;
            height: 55px;
            display: grid;
            place-items: center;
            margin-bottom: 12px;
            border-radius: 15px;
            background: linear-gradient(135deg, #1465e8, #7655f7);
            color: white;
            font-weight: 900;
          }

          strong {
            color: #1465e8;
            font-size: 21px;
          }

          p {
            font-size: 12px;
          }

          button {
            margin-top: 10px;
            padding: 10px 14px;
            border: 1px solid #d0d5dd;
            border-radius: 9px;
            background: white;
            color: #475467;
            font-size: 11px;
            font-weight: 800;
            cursor: pointer;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="header">
        <a href="/" className="brand">
          <div className="logo">QR</div>

          <div>
            <strong>QR RETURN</strong>
            <small>OWNER & ADMIN ACCESS</small>
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

      <section className="container">
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
              ? "ერთი უსაფრთხო შესვლა Owner-ისა და დამატებული Admin-ისთვის."
              : "One secure sign-in for Owners and authorized Admins."}
          </p>

          <div className="roleCard">
            <div className="roleIcon">👤</div>

            <div>
              <strong>{ka ? "Owner" : "Owner"}</strong>

              <p>
                {ka
                  ? "მართავს საკუთარ პროფილს, QR პროფილებს, Admin-ს და ყველა პარამეტრს."
                  : "Manages the Owner profile, QR profiles, Admin and all settings."}
              </p>
            </div>
          </div>

          <div className="roleCard">
            <div className="roleIcon">👥</div>

            <div>
              <strong>Admin</strong>

              <p>
                {ka
                  ? "ხედავს და მართავს მხოლოდ იმას, რისი უფლებაც Owner-მა მისცა."
                  : "Can only access features specifically authorized by the Owner."}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <div className="loginIcon">🔐</div>

            <div>
              <span>QR RETURN</span>
              <h2>{ka ? "შესვლა" : "Sign in"}</h2>
            </div>
          </div>

          <p className="description">
            {ka
              ? "შეიყვანეთ რეგისტრირებული ელფოსტა და პაროლი."
              : "Enter your registered email and password."}
          </p>

          <form onSubmit={handleLogin}>
            <label>
              <span>{ka ? "ელფოსტა" : "Email"} *</span>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label>
              <span>{ka ? "პაროლი" : "Password"} *</span>

              <div className="passwordField">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="passwordToggle"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </label>

            <div className="forgotRow">
              <span />

              <button
                type="button"
                className="forgotButton"
                onClick={() =>
                  setError(
                    ka
                      ? "პაროლის აღდგენის სისტემა შემდეგ ეტაპზე გააქტიურდება."
                      : "Password recovery will be activated later."
                  )
                }
              >
                {ka
                  ? "დაგავიწყდათ პაროლი?"
                  : "Forgot password?"}
              </button>
            </div>

            {error && (
              <div className="errorBox">
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
                  ? "მოწმდება..."
                  : "Checking..."
                : ka
                ? "შესვლა"
                : "Sign in"}

              {!loading && <span>→</span>}
            </button>
          </form>

          <div className="signupBox">
            <span>
              {ka
                ? "ჯერ არ გაქვთ QR RETURN ანგარიში?"
                : "Don't have a QR RETURN account?"}
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
          color: #101828;
          font-family: Inter, Arial, sans-serif;
        }

        input,
        button {
          font: inherit;
        }

        .page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 8% 15%,
              rgba(20, 101, 232, 0.09),
              transparent 27%
            ),
            radial-gradient(
              circle at 93% 10%,
              rgba(118, 85, 247, 0.1),
              transparent 28%
            ),
            #f7f9fc;
        }

        .header {
          width: calc(100% - 36px);
          max-width: 1100px;
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
          font-size: 11px;
          font-weight: 900;
          cursor: pointer;
        }

        .languages button.active {
          background: white;
          color: #1465e8;
        }

        .container {
          width: calc(100% - 36px);
          max-width: 1000px;
          min-height: calc(100vh - 86px);
          margin: auto;
          padding: 65px 0;
          display: grid;
          grid-template-columns: 1fr 445px;
          align-items: center;
          gap: 70px;
        }

        .intro {
          max-width: 480px;
        }

        .eyebrow {
          color: #7655f7;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1.6px;
        }

        .intro h1 {
          margin: 12px 0 15px;
          font-size: clamp(42px, 5vw, 57px);
          line-height: 1.04;
          letter-spacing: -2.4px;
        }

        .intro > p {
          margin: 0 0 28px;
          color: #667085;
          font-size: 15px;
          line-height: 1.7;
        }

        .roleCard {
          margin-top: 11px;
          padding: 15px;
          display: flex;
          gap: 12px;
          border: 1px solid #e4e7ec;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.75);
        }

        .roleIcon {
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #eef4ff;
        }

        .roleCard strong {
          font-size: 12px;
        }

        .roleCard p {
          margin: 4px 0 0;
          color: #667085;
          font-size: 10px;
          line-height: 1.5;
        }

        .card {
          padding: 32px;
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

        .loginIcon {
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: linear-gradient(135deg, #eef4ff, #f0edff);
          font-size: 26px;
        }

        .cardHeader span {
          color: #7655f7;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .cardHeader h2 {
          margin: 4px 0 0;
          font-size: 25px;
        }

        .description {
          margin: 17px 0 24px;
          color: #667085;
          font-size: 12px;
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
          font-size: 13px;
          font-weight: 800;
        }

        input {
          width: 100%;
          height: 52px;
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

        .passwordField {
          position: relative;
        }

        .passwordField input {
          padding-right: 50px;
        }

        .passwordToggle {
          position: absolute;
          top: 0;
          right: 4px;
          width: 44px;
          height: 52px;
          border: 0;
          background: transparent;
          cursor: pointer;
        }

        .forgotRow {
          margin-top: -6px;
          display: flex;
          justify-content: flex-end;
        }

        .forgotButton {
          padding: 0;
          border: 0;
          background: transparent;
          color: #1465e8;
          font-size: 10px;
          font-weight: 900;
          cursor: pointer;
        }

        .errorBox {
          padding: 12px;
          display: flex;
          gap: 8px;
          align-items: center;
          border: 1px solid #fecdca;
          border-radius: 10px;
          background: #fff1f0;
          color: #b42318;
          font-size: 11px;
        }

        .errorBox strong {
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
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border: 0;
          border-radius: 11px;
          background: linear-gradient(135deg, #1465e8, #7655f7);
          color: white;
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
        }

        .submitButton:disabled {
          opacity: 0.65;
        }

        .signupBox {
          margin-top: 22px;
          padding-top: 18px;
          display: flex;
          justify-content: center;
          gap: 7px;
          border-top: 1px solid #eaecf0;
          color: #667085;
          font-size: 10px;
        }

        .signupBox a {
          color: #1465e8;
          font-weight: 900;
          text-decoration: none;
        }

        @media (max-width: 850px) {
          .container {
            max-width: 600px;
            grid-template-columns: 1fr;
            gap: 35px;
          }
        }

        @media (max-width: 550px) {
          .container {
            padding-top: 40px;
          }

          .intro h1 {
            font-size: 38px;
          }

          .card {
            padding: 23px;
          }
        }
      `}</style>
    </main>
  );
}
