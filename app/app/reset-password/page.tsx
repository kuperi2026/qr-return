"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

export default function ResetPasswordPage() {
  const [lang, setLang] = useState<Lang>("ka");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [checkingSession, setCheckingSession] = useState(true);
  const [recoveryReady, setRecoveryReady] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const ka = lang === "ka";

  useEffect(() => {
    let mounted = true;

    async function initializeRecovery() {
      setCheckingSession(true);
      setError("");

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session && mounted) {
          setRecoveryReady(true);
        }

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, currentSession) => {
          if (!mounted) return;

          if (event === "PASSWORD_RECOVERY") {
            setRecoveryReady(true);
            setError("");
          }

          if (currentSession) {
            setRecoveryReady(true);
          }
        });

        setCheckingSession(false);

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        if (!mounted) return;

        setCheckingSession(false);

        setError(
          err instanceof Error
            ? err.message
            : ka
            ? "პაროლის აღდგენის ბმულის შემოწმება ვერ მოხერხდა."
            : "Could not verify the password recovery link."
        );
      }
    }

    const cleanupPromise = initializeRecovery();

    return () => {
      mounted = false;

      void cleanupPromise.then((cleanup) => {
        if (typeof cleanup === "function") {
          cleanup();
        }
      });
    };
  }, [ka]);

  function validatePassword() {
    if (!password || !confirmPassword) {
      return ka
        ? "შეავსეთ ორივე პაროლის ველი."
        : "Enter the new password in both fields.";
    }

    if (password.length < 8) {
      return ka
        ? "პაროლი მინიმუმ 8 სიმბოლო უნდა იყოს."
        : "Password must be at least 8 characters.";
    }

    if (password !== confirmPassword) {
      return ka
        ? "პაროლები ერთმანეთს არ ემთხვევა."
        : "Passwords do not match.";
    }

    return "";
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validatePassword();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error(
          ka
            ? "პაროლის აღდგენის სესია ვერ მოიძებნა. გახსენით ახალი Reset Password ბმული ელფოსტიდან."
            : "Password recovery session was not found. Open a new Reset Password link from your email."
        );
      }

      const { error: updateError } =
        await supabase.auth.updateUser({
          password,
        });

      if (updateError) {
        throw updateError;
      }

      setSuccess(
        ka
          ? "პაროლი წარმატებით შეიცვალა. ახლა შეგიძლიათ ახალი პაროლით შეხვიდეთ ანგარიშში."
          : "Your password was changed successfully. You can now sign in with your new password."
      );

      setPassword("");
      setConfirmPassword("");

      window.setTimeout(async () => {
        await supabase.auth.signOut();

        window.location.href = "/login";
      }, 1800);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "პაროლის შეცვლა ვერ მოხერხდა."
          : "Could not update the password."
      );
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <main className="statePage">
        <div className="logo">QR</div>

        <strong>QR RETURN</strong>

        <p>
          {ka
            ? "პაროლის აღდგენის ბმული მოწმდება..."
            : "Checking password recovery link..."}
        </p>

        <Styles />
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
            <small>ACCOUNT SECURITY</small>
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
            {ka ? "ანგარიშის უსაფრთხოება" : "ACCOUNT SECURITY"}
          </div>

          <h1>
            {ka
              ? "შექმენით ახალი პაროლი"
              : "Create a new password"}
          </h1>

          <p>
            {ka
              ? "ახალი პაროლი გამოიყენეთ QR RETURN ანგარიშში შესასვლელად."
              : "Use your new password to sign in to your QR RETURN account."}
          </p>

          <div className="securityCard">
            <span>🔒</span>

            <div>
              <strong>
                {ka ? "დაცული პაროლის შეცვლა" : "Secure password reset"}
              </strong>

              <p>
                {ka
                  ? "პაროლის შეცვლა შესაძლებელია მხოლოდ მოქმედი recovery link-ით."
                  : "Your password can only be changed through a valid recovery link."}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <div className="lockIcon">🔐</div>

            <div>
              <span>QR RETURN</span>

              <h2>
                {ka ? "ახალი პაროლი" : "New password"}
              </h2>
            </div>
          </div>

          {!recoveryReady && !success && (
            <div className="warningBox">
              <strong>!</strong>

              <div>
                <b>
                  {ka
                    ? "Recovery session ვერ მოიძებნა"
                    : "Recovery session not found"}
                </b>

                <p>
                  {ka
                    ? "გახსენით პაროლის აღდგენის ახალი ბმული იმ ელფოსტიდან, რომელიც Supabase-მა გამოგიგზავნათ."
                    : "Open a fresh password recovery link from the email sent by Supabase."}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label>
              <span>
                {ka ? "ახალი პაროლი" : "New password"} *
              </span>

              <div className="passwordField">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="••••••••"
                  minLength={8}
                  autoComplete="new-password"
                  disabled={!recoveryReady || loading}
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

              <small>
                {ka
                  ? "მინიმუმ 8 სიმბოლო."
                  : "At least 8 characters."}
              </small>
            </label>

            <label>
              <span>
                {ka
                  ? "გაიმეორეთ ახალი პაროლი"
                  : "Confirm new password"}{" "}
                *
              </span>

              <div className="passwordField">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="••••••••"
                  minLength={8}
                  autoComplete="new-password"
                  disabled={!recoveryReady || loading}
                  required
                />

                <button
                  type="button"
                  className="passwordToggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      (current) => !current
                    )
                  }
                >
                  {showConfirmPassword ? "🙈" : "👁"}
                </button>
              </div>
            </label>

            {error && (
              <div className="errorBox">
                <strong>!</strong>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="successBox">
                <strong>✓</strong>
                <span>{success}</span>
              </div>
            )}

            <button
              type="submit"
              className="submitButton"
              disabled={
                loading ||
                !recoveryReady ||
                Boolean(success)
              }
            >
              {loading
                ? ka
                  ? "იცვლება..."
                  : "Updating..."
                : ka
                ? "პაროლის შეცვლა"
                : "Update password"}

              {!loading && !success && <span>→</span>}
            </button>
          </form>

          <div className="loginBox">
            <span>
              {ka
                ? "გახსოვთ პაროლი?"
                : "Remember your password?"}
            </span>

            <a href="/login">
              {ka ? "შესვლა" : "Sign in"} →
            </a>
          </div>
        </div>
      </section>

      <Styles />
    </main>
  );
}

function Styles() {
  return (
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

      .statePage {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #f7f9fc;
        color: #667085;
      }

      .statePage .logo {
        margin-bottom: 12px;
      }

      .statePage > strong {
        color: #1465e8;
        font-size: 21px;
      }

      .statePage p {
        font-size: 11px;
      }

      .header {
        width: calc(100% - 36px);
        max-width: 1050px;
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
        max-width: 950px;
        min-height: calc(100vh - 86px);
        margin: auto;
        padding: 65px 0;
        display: grid;
        grid-template-columns: 1fr 430px;
        align-items: center;
        gap: 70px;
      }

      .intro {
        max-width: 460px;
      }

      .eyebrow {
        color: #7655f7;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 1.5px;
      }

      .intro h1 {
        margin: 11px 0 15px;
        font-size: clamp(40px, 5vw, 55px);
        line-height: 1.04;
        letter-spacing: -2px;
      }

      .intro > p {
        margin: 0;
        color: #667085;
        font-size: 14px;
        line-height: 1.7;
      }

      .securityCard {
        margin-top: 26px;
        padding: 15px;
        display: flex;
        gap: 11px;
        border: 1px solid #dbe7ff;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.75);
      }

      .securityCard > span {
        font-size: 23px;
      }

      .securityCard strong {
        font-size: 11px;
      }

      .securityCard p {
        margin: 4px 0 0;
        color: #667085;
        font-size: 9px;
        line-height: 1.5;
      }

      .card {
        padding: 31px;
        border: 1px solid #e4e7ec;
        border-radius: 23px;
        background: white;
        box-shadow: 0 25px 65px rgba(16, 24, 40, 0.1);
      }

      .cardHeader {
        display: flex;
        align-items: center;
        gap: 13px;
        margin-bottom: 23px;
      }

      .lockIcon {
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
        font-size: 8px;
        font-weight: 900;
        letter-spacing: 1.5px;
      }

      .cardHeader h2 {
        margin: 4px 0 0;
        font-size: 23px;
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
        font-size: 12px;
        font-weight: 800;
      }

      label > small {
        display: block;
        margin-top: 5px;
        color: #98a2b3;
        font-size: 9px;
      }

      .passwordField {
        position: relative;
      }

      input {
        width: 100%;
        height: 51px;
        padding: 0 50px 0 13px;
        border: 1px solid #d0d5dd;
        border-radius: 11px;
        background: white;
        outline: none;
      }

      input:focus {
        border-color: #84adff;
        box-shadow: 0 0 0 3px rgba(20, 101, 232, 0.08);
      }

      input:disabled {
        background: #f2f4f7;
      }

      .passwordToggle {
        position: absolute;
        top: 0;
        right: 4px;
        width: 44px;
        height: 51px;
        border: 0;
        background: transparent;
        cursor: pointer;
      }

      .warningBox,
      .errorBox,
      .successBox {
        padding: 12px;
        display: flex;
        align-items: flex-start;
        gap: 9px;
        border-radius: 10px;
        font-size: 10px;
      }

      .warningBox {
        margin-bottom: 18px;
        border: 1px solid #fedf89;
        background: #fffaeb;
        color: #93370d;
      }

      .warningBox > strong,
      .errorBox > strong,
      .successBox > strong {
        width: 21px;
        height: 21px;
        flex: 0 0 21px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        color: white;
      }

      .warningBox > strong {
        background: #f79009;
      }

      .warningBox b {
        display: block;
        font-size: 10px;
      }

      .warningBox p {
        margin: 4px 0 0;
        font-size: 9px;
        line-height: 1.5;
      }

      .errorBox {
        border: 1px solid #fecdca;
        background: #fff1f0;
        color: #b42318;
      }

      .errorBox > strong {
        background: #d92d20;
      }

      .successBox {
        border: 1px solid #abefc6;
        background: #ecfdf3;
        color: #027a48;
      }

      .successBox > strong {
        background: #12b76a;
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
        opacity: 0.55;
        cursor: default;
      }

      .loginBox {
        margin-top: 21px;
        padding-top: 17px;
        display: flex;
        justify-content: center;
        gap: 7px;
        border-top: 1px solid #eaecf0;
        color: #667085;
        font-size: 10px;
      }

      .loginBox a {
        color: #1465e8;
        font-weight: 900;
        text-decoration: none;
      }

      @media (max-width: 820px) {
        .container {
          max-width: 580px;
          grid-template-columns: 1fr;
          gap: 35px;
        }
      }

      @media (max-width: 520px) {
        .container {
          padding-top: 40px;
        }

        .intro h1 {
          font-size: 37px;
        }

        .card {
          padding: 22px;
        }
      }
    `}</style>
  );
}
