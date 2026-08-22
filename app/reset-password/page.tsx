"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@supabase/supabase-js";

function createSupabase() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase გარემოს ცვლადები ვერ მოიძებნა."
    );
  }

  return createClient(url, key);
}

export default function ResetPasswordPage() {
  const [password, setPassword] =
    useState("");

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
    checking,
    setChecking,
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
    success,
    setSuccess,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  useEffect(() => {
    let mounted = true;

    let unsubscribe:
      | (() => void)
      | undefined;

    async function initializeRecovery() {
      try {
        const client =
          createSupabase();

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
                Boolean(
                  session?.user
                )
              ) {
                setRecoveryReady(
                  true
                );

                setChecking(
                  false
                );
              }
            }
          );

        unsubscribe = () =>
          subscription.unsubscribe();

        const params =
          new URLSearchParams(
            window.location.search
          );

        const code =
          params.get("code");

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
              "Recovery exchange:",
              exchangeError
            );
          }
        }

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
          console.error(
            "Session:",
            sessionError
          );
        }

        if (!mounted) {
          return;
        }

        if (session?.user) {
          setRecoveryReady(
            true
          );

          setChecking(
            false
          );

          return;
        }

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
            } catch (error) {
              console.error(
                "Final recovery check:",
                error
              );

              if (mounted) {
                setRecoveryReady(
                  false
                );
              }
            } finally {
              if (mounted) {
                setChecking(
                  false
                );
              }
            }
          },
          1000
        );
      } catch (error) {
        console.error(
          "Recovery init:",
          error
        );

        if (mounted) {
          setRecoveryReady(
            false
          );

          setChecking(
            false
          );

          setErrorMessage(
            error instanceof Error
              ? error.message
              : "პაროლის აღდგენა ვერ მოხერხდა."
          );
        }
      }
    }

    void initializeRecovery();

    return () => {
      mounted = false;

      if (unsubscribe) {
        unsubscribe();
      }
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

    setLoading(true);

    try {
      const client =
        createSupabase();

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
          "აღდგენის ბმული აღარ არის აქტიური. მოითხოვეთ ახალი ბმული."
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
        "Password update:",
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
          className="decor one"
          aria-hidden="true"
        >
          QR
        </div>

        <div
          className="decor two"
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
            {checking ? (
              <div className="loadingView">
                <div className="spinner" />

                <span>
                  მოწმდება...
                </span>
              </div>
            ) : success ? (
              <div className="messageView">
                <div className="successIcon">
                  ✓
                </div>

                <h1>
                  პაროლი შეიცვალა
                </h1>

                <a
                  href="/login"
                  className="mainLink"
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
              <div className="messageView">
                <h1>
                  ბმული აღარ არის აქტიური
                </h1>

                <p>
                  მოითხოვეთ პაროლის
                  აღდგენის ახალი ბმული.
                </p>

                {errorMessage && (
                  <div
                    className="error"
                  >
                    {errorMessage}
                  </div>
                )}

                <a
                  href="/login"
                  className="mainLink"
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
          box-sizing: border-box;
        }

        .page {
          position: relative;

          min-height: 100vh;

          overflow: hidden;

          padding:
            0 18px 25px;

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
        }

        .one {
          top: 15%;
          left: 7%;

          transform:
            rotate(-14deg);
        }

        .two {
          right: 7%;
          bottom: 8%;

          transform:
            rotate(14deg);
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
          width: 41px;

          height: 41px;

          display: grid;

          place-items: center;

          border-radius: 10px;

          background:
            #ffffff;

          color:
            #0647c8;

          font-size: 11px;

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
        }

        .center {
          position: relative;

          z-index: 2;

          min-height:
            calc(
              100vh -
              90px
            );

          display: grid;

          place-items: center;

          padding:
            20px 0 35px;
        }

        .card {
          width: 100%;

          max-width: 430px;

          padding:
            29px 30px 27px;

          border-radius:
            18px;

          background:
            #ffffff;

          box-shadow:
            0 24px 58px
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

          font-size: 24px;

          line-height: 1.25;
        }

        form {
          margin-top: 24px;

          display: grid;

          gap: 18px;
        }

        .field label {
          display: block;

          margin-bottom: 8px;

          color:
            #42576b;

          font-size: 13px;

          font-weight: 850;
        }

        .passwordField {
          position: relative;

          width: 100%;
        }

        input {
          width: 100%;

          height: 56px;

          padding:
            0 85px
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

          font-size: 15px;

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

          min-width: 61px;

          height: 34px;

          border: 0;

          border-radius: 8px;

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
        .mainLink {
          width: 100%;

          min-height:
            51px;

          display: flex;

          align-items: center;

          justify-content:
            center;

          border: 0;

          border-radius:
            10px;

          background:
            #0647c8;

          color:
            #ffffff;

          font-family:
            inherit;

          font-size: 13px;

          font-weight: 900;

          text-decoration: none;

          cursor: pointer;
        }

        .submit:disabled {
          opacity: 0.65;
        }

        .error {
          margin-top: 15px;

          padding:
            10px 12px;

          border:
            1px solid
            #f0ced2;

          border-radius: 9px;

          background:
            #fff3f4;

          color:
            #a3424a;

          font-size: 12px;

          line-height: 1.45;
        }

        .loadingView {
          min-height: 120px;

          display: flex;

          flex-direction:
            column;

          align-items: center;

          justify-content:
            center;

          gap: 12px;

          color:
            #63788d;

          font-size: 13px;
        }

        .spinner {
          width: 29px;

          height: 29px;

          border:
            3px solid
            #dbe7f7;

          border-top-color:
            #0647c8;

          border-radius: 50%;

          animation:
            spin
            0.8s
            linear
            infinite;
        }

        .messageView {
          text-align: center;
        }

        .messageView p {
          margin:
            8px 0 0;

          color:
            #78899a;

          font-size: 13px;

          line-height: 1.5;
        }

        .successIcon {
          width: 47px;

          height: 47px;

          margin:
            0 auto 13px;

          display: grid;

          place-items:
            center;

          border-radius: 50%;

          background:
            #eaf3ff;

          color:
            #0647c8;

          font-size: 19px;

          font-weight: 950;
        }

        .mainLink {
          margin-top: 21px;
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
              16px;
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
