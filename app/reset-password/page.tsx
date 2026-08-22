"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@supabase/supabase-js";

function getSupabase() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key);
}

export default function ResetPasswordPage() {
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
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    checkingSession,
    setCheckingSession,
  ] = useState(true);

  const [
    recoveryReady,
    setRecoveryReady,
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
    success,
    setSuccess,
  ] = useState(false);

  useEffect(() => {
    let mounted = true;

    const client = getSupabase();

    if (!client) {
      setErrorMessage(
        "Supabase კავშირი ვერ მოიძებნა."
      );

      setCheckingSession(false);

      return;
    }

    const {
      data: {
        subscription,
      },
    } =
      client.auth.onAuthStateChange(
        (
          event,
          session
        ) => {
          if (!mounted) {
            return;
          }

          if (
            event ===
              "PASSWORD_RECOVERY" ||
            session?.user
          ) {
            setRecoveryReady(
              true
            );

            setCheckingSession(
              false
            );
          }
        }
      );

    async function prepareRecovery() {
      try {
        const params =
          new URLSearchParams(
            window.location.search
          );

        const code =
          params.get("code");

        /*
         * Supabase PKCE recovery flow
         */
        if (code) {
          const {
            error:
              exchangeError,
          } =
            await client.auth
              .exchangeCodeForSession(
                code
              );

          if (exchangeError) {
            console.error(
              "Recovery code exchange:",
              exchangeError
            );
          }
        }

        /*
         * Check current session
         */
        const {
          data: {
            session,
          },
        } =
          await client.auth
            .getSession();

        if (!mounted) {
          return;
        }

        if (
          session?.user
        ) {
          setRecoveryReady(
            true
          );

          setCheckingSession(
            false
          );

          return;
        }

        /*
         * Give Supabase a moment
         * to process recovery URL.
         */
        window.setTimeout(
          async () => {
            if (!mounted) {
              return;
            }

            try {
              const {
                data: {
                  session:
                    finalSession,
                },
              } =
                await client.auth
                  .getSession();

              if (!mounted) {
                return;
              }

              setRecoveryReady(
                Boolean(
                  finalSession?.user
                )
              );
            } catch (
              sessionError
            ) {
              console.error(
                "Final session check:",
                sessionError
              );

              if (mounted) {
                setRecoveryReady(
                  false
                );
              }
            } finally {
              if (mounted) {
                setCheckingSession(
                  false
                );
              }
            }
          },
          900
        );
      } catch (error) {
        console.error(
          "Recovery preparation:",
          error
        );

        if (mounted) {
          setRecoveryReady(
            false
          );

          setCheckingSession(
            false
          );
        }
      }
    }

    void prepareRecovery();

    return () => {
      mounted = false;

      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");

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

    const client =
      getSupabase();

    if (!client) {
      setErrorMessage(
        "Supabase კავშირი ვერ მოიძებნა."
      );

      return;
    }

    setLoading(true);

    try {
      const {
        data: {
          session,
        },
        error:
          sessionError,
      } =
        await client.auth
          .getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (!session?.user) {
        throw new Error(
          "პაროლის აღდგენის ბმული აღარ არის აქტიური. გთხოვთ მოითხოვოთ ახალი ბმული."
        );
      }

      const {
        error,
      } =
        await client.auth
          .updateUser({
            password,
          });

      if (error) {
        throw error;
      }

      setSuccess(true);

      await client.auth
        .signOut();
    } catch (error) {
      console.error(
        "Password reset:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "პაროლის შეცვლა ვერ მოხერხდა."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <main className="page">
        <div
          className="decor decor1"
          aria-hidden="true"
        >
          QR
        </div>

        <div
          className="decor decor2"
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
          <section className="card">
            {checkingSession ? (
              <div className="status">
                <div className="loader" />

                <strong>
                  ბმული მოწმდება...
                </strong>
              </div>
            ) : success ? (
              <div className="successView">
                <div className="successIcon">
                  ✓
                </div>

                <h1>
                  პაროლი შეიცვალა
                </h1>

                <a
                  href="/login"
                  className="primaryLink"
                >
                  შესვლა →
                </a>
              </div>
            ) : recoveryReady ? (
              <>
                <h1>
                  ახალი პაროლი
                </h1>

                {errorMessage && (
                  <div
                    className="error"
                    role="alert"
                  >
                    {errorMessage}
                  </div>
                )}

                <form
                  onSubmit={
                    handleSubmit
                  }
                >
                  <div className="field">
                    <label htmlFor="password">
                      ახალი პაროლი
                    </label>

                    <div className="passwordField">
                      <input
                        id="password"
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
                        autoComplete="new-password"
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
                  </div>

                  <div className="field">
                    <label htmlFor="confirmPassword">
                      გაიმეორეთ პაროლი
                    </label>

                    <div className="passwordField">
                      <input
                        id="confirmPassword"
                        type={
                          showConfirmPassword
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
                        autoComplete="new-password"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (
                              current
                            ) =>
                              !current
                          )
                        }
                      >
                        {showConfirmPassword
                          ? "დამალვა"
                          : "ნახვა"}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="submit"
                    disabled={
                      loading
                    }
                  >
                    {loading
                      ? "იცვლება..."
                      : "პაროლის შეცვლა"}
                  </button>
                </form>
              </>
            ) : (
              <div className="expiredView">
                <h1>
                  ბმული აღარ არის აქტიური
                </h1>

                <p>
                  მოითხოვეთ პაროლის
                  აღდგენის ახალი ბმული.
                </p>

                <a
                  href="/login"
                  className="primaryLink"
                >
                  Login-ზე დაბრუნება
                </a>
              </div>
            )}
          </section>
        </section>
      </main>

      <style jsx>{`
        * {
          box-sizing:
            border-box;
        }

        .page {
          position: relative;

          min-height: 100vh;

          overflow: hidden;

          padding:
            0 18px 30px;

          background:
            #0647c8;

          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        .decor {
          position: fixed;

          color:
            rgba(
              255,
              255,
              255,
              0.04
            );

          font-size: 150px;

          font-weight: 950;

          pointer-events: none;

          user-select: none;
        }

        .decor1 {
          top: 14%;
          left: 6%;

          transform:
            rotate(-14deg);
        }

        .decor2 {
          right: 7%;
          bottom: 8%;

          transform:
            rotate(14deg);
        }

        .header {
          position: relative;

          z-index: 2;

          width: 100%;

          max-width: 1080px;

          height: 70px;

          margin: auto;

          display: flex;

          align-items: center;

          border-bottom:
            1px solid
            rgba(
              255,
              255,
              255,
              0.18
            );
        }

        .brand {
          display: flex;

          align-items: center;

          gap: 10px;

          text-decoration: none;
        }

        .brandIcon {
          width: 42px;

          height: 42px;

          display: grid;

          place-items: center;

          border-radius: 11px;

          background:
            #ffffff;

          color:
            #0647c8;

          font-size: 12px;

          font-weight: 950;
        }

        .brand strong,
        .brand small {
          display: block;
        }

        .brand strong {
          color:
            #ffffff;

          font-size: 17px;
        }

        .brand small {
          margin-top: 2px;

          color:
            rgba(
              255,
              255,
              255,
              0.67
            );

          font-size: 9px;

          font-weight: 800;
        }

        .center {
          position: relative;

          z-index: 2;

          min-height:
            calc(
              100vh -
              100px
            );

          display: grid;

          place-items: center;

          padding:
            25px 0 45px;
        }

        .card {
          width: 100%;

          max-width: 440px;

          padding:
            30px 30px 27px;

          border-radius:
            19px;

          background:
            #ffffff;

          box-shadow:
            0 24px 60px
            rgba(
              0,
              24,
              78,
              0.3
            );
        }

        h1 {
          margin: 0;

          color:
            #203a55;

          font-size: 25px;

          line-height: 1.25;
        }

        form {
          margin-top: 25px;

          display: grid;

          gap: 19px;
        }

        .field label {
          display: block;

          margin-bottom:
            8px;

          color:
            #42576b;

          font-size: 13px;

          font-weight: 850;
        }

        .passwordField {
          position:
            relative;

          width: 100%;
        }

        input {
          width: 100%;

          height: 56px;

          padding:
            0 86px
            0 16px;

          border:
            1.5px solid
            #d5e0ea;

          border-radius:
            11px;

          background:
            #fbfdff;

          color:
            #263f59;

          font-family:
            inherit;

          font-size:
            15px;

          outline: none;
        }

        input:focus {
          border-color:
            #1266e9;

          background:
            #ffffff;

          box-shadow:
            0 0 0 4px
            rgba(
              18,
              102,
              233,
              0.09
            );
        }

        .passwordField button {
          position: absolute;

          top: 50%;

          right: 9px;

          transform:
            translateY(-50%);

          min-width: 62px;

          height: 34px;

          padding:
            0 9px;

          border: 0;

          border-radius:
            8px;

          background:
            #edf4ff;

          color:
            #0647c8;

          font-family:
            inherit;

          font-size: 10px;

          font-weight: 850;

          cursor: pointer;
        }

        .submit,
        .primaryLink {
          width: 100%;

          min-height:
            52px;

          display: flex;

          align-items: center;

          justify-content:
            center;

          border: 0;

          border-radius:
            11px;

          background:
            #0647c8;

          color:
            #ffffff;

          font-family:
            inherit;

          font-size: 14px;

          font-weight: 900;

          text-decoration:
            none;

          cursor: pointer;
        }

        .submit:disabled {
          opacity: 0.65;

          cursor:
            not-allowed;
        }

        .error {
          margin-top: 17px;

          padding:
            11px 13px;

          border:
            1px solid
            #efcdd2;

          border-radius:
            9px;

          background:
            #fff3f4;

          color:
            #a3424a;

          font-size: 12px;

          line-height: 1.45;
        }

        .status {
          min-height:
            130px;

          display: flex;

          flex-direction:
            column;

          align-items:
            center;

          justify-content:
            center;

          gap: 13px;

          color:
            #52677b;
        }

        .loader {
          width: 30px;

          height: 30px;

          border:
            3px solid
            #dce8f8;

          border-top-color:
            #0647c8;

          border-radius: 50%;

          animation:
            spin
            0.8s
            linear
            infinite;
        }

        .successView,
        .expiredView {
          text-align: center;
        }

        .successIcon {
          width: 48px;

          height: 48px;

          margin:
            0 auto 14px;

          display: grid;

          place-items: center;

          border-radius: 50%;

          background:
            #eaf3ff;

          color:
            #0647c8;

          font-size: 20px;

          font-weight: 950;
        }

        .expiredView p {
          margin:
            9px 0 0;

          color:
            #78899a;

          font-size: 13px;

          line-height: 1.5;
        }

        .primaryLink {
          margin-top: 22px;
        }

        @keyframes spin {
          to {
            transform:
              rotate(360deg);
          }
        }

        @media (
          max-width: 520px
        ) {
          .brand small {
            display: none;
          }

          .card {
            padding:
              25px 19px;

            border-radius:
              17px;
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
