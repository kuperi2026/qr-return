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

  const [checking, setChecking] = useState(true);
  const [ready, setReady] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const ka = lang === "ka";

  useEffect(() => {
    let mounted = true;

    async function prepareRecoverySession() {
      setChecking(true);
      setError("");

      try {
        /*
          Supabase recovery email may return:
          1. an already established recovery session
          2. ?code=... PKCE flow
          3. URL hash tokens

          We handle all common cases here.
        */

        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        if (code) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            throw exchangeError;
          }

          // Clean recovery code from browser URL after successful exchange.
          window.history.replaceState(
            {},
            document.title,
            "/reset-password"
          );
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!mounted) {
          return;
        }

        if (session) {
          setReady(true);
          setChecking(false);
          return;
        }

        /*
          Some Supabase recovery links restore the session
          shortly after the page loads. Listen briefly for it.
        */

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, currentSession) => {
          if (!mounted) {
            return;
          }

          if (
            event === "PASSWORD_RECOVERY" ||
            event === "SIGNED_IN"
          ) {
            if (currentSession) {
              setReady(true);
              setChecking(false);
              setError("");
            }
          }
        });

        window.setTimeout(async () => {
          if (!mounted) {
            return;
          }

          const {
            data: { session: delayedSession },
          } = await supabase.auth.getSession();

          if (delayedSession) {
            setReady(true);
            setChecking(false);
          } else {
            setChecking(false);

            setError(
              ka
                ? "პაროლის აღდგენის ბმული არასწორია ან ვადა გაუვიდა. გამოაგზავნეთ ახალი recovery email."
                : "The password recovery link is invalid or has expired. Please request a new recovery email."
            );
          }
        }, 1800);

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        if (!mounted) {
          return;
        }

        setChecking(false);

        setError(
          err instanceof Error
            ? err.message
            : ka
            ? "Recovery session-ის გახსნა ვერ მოხერხდა."
            : "Could not open the recovery session."
        );
      }
    }

    const cleanupPromise = prepareRecoverySession();

    return () => {
      mounted = false;

      void cleanupPromise;
    };
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError(
        ka
          ? "შეავსეთ ორივე პაროლის ველი."
          : "Enter the password in both fields."
      );
      return;
    }

    if (password.length < 8) {
      setError(
        ka
          ? "პაროლი მინიმუმ 8 სიმბოლო უნდა იყოს."
          : "Password must be at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        ka
          ? "პაროლები ერთმანეთს არ ემთხვევა."
          : "Passwords do not match."
      );
      return;
    }

    setSaving(true);

    try {
      const { error: updateError } =
        await supabase.auth.updateUser({
          password,
        });

      if (updateError) {
        throw updateError;
      }

      setSuccess(
        ka
          ? "✓ პაროლი წარმატებით შეიცვალა. ახლა შეგიძლიათ ანგარიშში შეხვიდეთ."
          : "✓ Password changed successfully. You can now sign in."
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
          : "Could not change password."
      );
    } finally {
      setSaving(false);
    }
  }

  if (checking) {
    return (
      <main className="statePage">
        <div className="logo">QR</div>

        <strong>QR RETURN</strong>

        <p>
          {ka
            ? "Recovery ბმული მოწმდება..."
            : "Checking recovery link..."}
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
            <small>PASSWORD RECOVERY</small>
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
            {ka ? "ანგარიშის აღდგენა" : "ACCOUNT RECOVERY"}
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
                {ka ? "უსაფრთხო აღდგენა" : "Secure recovery"}
              </strong>

              <p>
                {ka
                  ? "პაროლის შეცვლა შესაძლებელია მხოლოდ მოქმედი Supabase recovery session-ით."
                  : "Your password can only be changed through a valid Supabase recovery session."}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <div className="resetIcon">🔑</div>

            <div>
              <span>QR RETURN</span>
              <h2>
                {ka ? "ახალი პაროლი" : "New password"}
              </h2>
            </div>
          </div>

          {!ready ? (
            <div className="invalidState">
              <div className="invalidIcon">⚠</div>

              <h3>
                {ka
                  ? "Recovery ბმული არ არის აქტიური"
                  : "Recovery link is not active"}
              </h3>

              <p>
                {error ||
                  (ka
                    ? "გამოაგზავნეთ ახალი password recovery email Supabase-იდან."
                    : "Request a new password recovery email from Supabase.")}
              </p>

              <a href="/login">
                ← {ka ? "Login-ზე დაბრუნება" : "Back to Login"}
              </a>
            </div>
          ) : (
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
                    autoComplete="new-password"
                    placeholder="••••••••"
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

                <small className="hint">
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
                    autoComplete="new-password"
                    placeholder="••••••••"
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
                  ⚠ {error}
                </div>
              )}

              {success && (
                <div className="successBox">
                  {success}
                </div>
              )}

              <button
                type="submit"
                className="submitButton"
                disabled={saving}
              >
                {saving
                  ? ka
                    ? "ინახება..."
                    : "Saving..."
                  : ka
                  ? "პაროლის შეცვლა"
                  : "Change password"}

                {!saving && <span>→</span>}
              </button>
            </form>
          )}

          <div className="loginLink">
            <span>
              {ka ? "გახსოვთ პაროლი?" : "Remember your password?"}
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
        padding: 30px;
        color: #667085;
        text-align: center;
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
        max-width: 970px;
        min-height: calc(100vh - 86px);
        margin: auto;
        padding: 60px 0;
        display: grid;
        grid-template-columns: 1fr 430px;
        align-items: center;
        gap: 70px;
      }

      .intro {
        max-width: 470px;
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
        letter-spacing: -2.3px;
      }

      .intro > p {
        margin: 0 0 25px;
        color: #667085;
        font-size: 14px;
        line-height: 1.7;
      }

      .securityCard {
        padding: 15px;
        display: flex;
        gap: 12px;
        border: 1px solid #dbe7ff;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.78);
      }

      .securityCard > span {
        width: 38px;
        height: 38px;
        flex: 0 0 38px;
        display: grid;
        place-items: center;
        border-radius: 10px;
        background: #eef4ff;
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
        border-radius: 24px;
        background: white;
        box-shadow: 0 25px 65px rgba(16, 24, 40, 0.1);
      }

      .cardHeader {
        display: flex;
        align-items: center;
        gap: 13px;
        margin-bottom: 23px;
      }

      .resetIcon {
        width: 53px;
        height: 53px;
        display: grid;
        place-items: center;
        border-radius: 15px;
        background: linear-gradient(135deg, #eef4ff, #f0edff);
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

      form {
        display: flex;
        flex-direction: column;
        gap: 18px;
      }

      label > span {
        display: block;
        margin-bottom: 7px;
        color: #475467;
        font-size: 12px;
        font-weight: 800;
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

      .hint {
        display: block;
        margin-top: 6px;
        color: #98a2b3;
        font-size: 9px;
      }

      .errorBox,
      .successBox {
        padding: 11px 12px;
        border-radius: 10px;
        font-size: 10px;
        line-height: 1.5;
      }

      .errorBox {
        border: 1px solid #fecdca;
        background: #fff1f0;
        color: #b42318;
      }

      .successBox {
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
      }

      .loginLink {
        margin-top: 21px;
        padding-top: 17px;
        display: flex;
        justify-content: center;
        gap: 7px;
        border-top: 1px solid #eaecf0;
        color: #667085;
        font-size: 9px;
      }

      .loginLink a {
        color: #1465e8;
        font-weight: 900;
        text-decoration: none;
      }

      .invalidState {
        padding: 15px 0 5px;
        text-align: center;
      }

      .invalidIcon {
        width: 52px;
        height: 52px;
        margin: auto;
        display: grid;
        place-items: center;
        border-radius: 14px;
        background: #fff1f0;
        font-size: 23px;
      }

      .invalidState h3 {
        margin: 13px 0 6px;
      }

      .invalidState p {
        margin: 0;
        color: #667085;
        font-size: 10px;
        line-height: 1.6;
      }

      .invalidState a {
        margin-top: 15px;
        display: inline-flex;
        color: #1465e8;
        font-size: 10px;
        font-weight: 900;
        text-decoration: none;
      }

      @media (max-width: 820px) {
        .container {
          max-width: 600px;
          grid-template-columns: 1fr;
          gap: 35px;
        }
      }

      @media (max-width: 520px) {
        .container {
          padding-top: 38px;
        }

        .intro h1 {
          font-size: 37px;
        }

        .card {
          padding: 23px;
        }
      }
    `}</style>
  );
}
