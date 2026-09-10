"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { createClient } from "@supabase/supabase-js";

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
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [rememberMe, setRememberMe] =
    useState(true);

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

  const [
    registered,
    setRegistered,
  ] = useState(false);

  const [
    nextPath,
    setNextPath,
  ] = useState("/account");

  /*
   * აქ ვკითხულობთ URL პარამეტრებს
   * useSearchParams-ის გარეშე.
   *
   * მაგალითად:
   *
   * /login?registered=1&email=test@test.com&next=/register
   */

  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const registeredValue =
      params.get("registered");

    const emailValue =
      params.get("email");

    const requestedNext =
      params.get("next");
    const appSource =
      params.get("source") === "app";

    setRegistered(
      registeredValue === "1"
    );

    const rememberedEmail =
      window.localStorage.getItem(
        "qr-return-remembered-email"
      );

    if (emailValue) {
      setEmail(
        emailValue
      );
    } else if (rememberedEmail) {
      setEmail(rememberedEmail);
    }

    if (appSource) {
      window.localStorage.setItem("kompasi-app-mode", "1");
      setNextPath("/app/dashboard");
    } else if (
      requestedNext &&
      requestedNext.startsWith("/") &&
      !requestedNext.startsWith("//")
    ) {
      setNextPath(
        requestedNext
      );
    } else {
      setNextPath(
        "/account"
      );
    }
  }, []);

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

      const {
        error,
      } =
        await supabase.auth
          .signInWithPassword({
            email: cleanEmail,
            password,
          });

      if (error) {
        throw error;
      }

      if (rememberMe) {
        window.localStorage.setItem(
          "qr-return-remembered-email",
          cleanEmail
        );
      } else {
        window.localStorage.removeItem(
          "qr-return-remembered-email"
        );
      }

      /*
       * ახალი რეგისტრაცია:
       *
       * /login?...&next=/register
       *
       * => პირდაპირ 6 პროდუქტის არჩევაზე
       *
       * ჩვეულებრივი login:
       *
       * => /account
       */

      window.location.replace(
        nextPath
      );
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

            <span className="brandMessage">
              ერთი ანგარიშიდან მართეთ თქვენი ყველა QR პროფილი.
            </span>
          </a>
        </header>

        <section className="center">
          <div className="card">
             <h1>
              შედით თქვენს ანგარიშში
            </h1>

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
                  ელ-ფოსტა
                </label>

                <input
                  id="email"
                  name="email"
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
                    name="password"
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

              <label className="rememberRow">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(event.target.checked)
                  }
                />
                <span>
                  პაროლის დამახსოვრება
                </span>
              </label>

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

