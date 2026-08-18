"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const [error, setError] = useState("");

  /*
    თუ Admin უკვე შესულია,
    პირდაპირ Support Inbox-ზე გადავიყვანოთ.
  */
  useEffect(() => {
    let active = true;

    async function checkExistingSession() {
      try {
        const {
          data: userData,
        } = await supabase.auth.getUser();

        const user = userData.user;

        if (!user) {
          if (active) {
            setChecking(false);
          }

          return;
        }

        const {
          data: adminData,
          error: adminError,
        } = await supabase
          .from("admin_users")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (
          !adminError &&
          adminData
        ) {
          router.replace(
            "/admin/support"
          );

          return;
        }

        if (active) {
          setChecking(false);
        }
      } catch {
        if (active) {
          setChecking(false);
        }
      }
    }

    void checkExistingSession();

    return () => {
      active = false;
    };
  }, [router]);

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) {
      return;
    }

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail) {
      setError(
        "გთხოვთ, შეიყვანოთ Admin ელფოსტა."
      );

      return;
    }

    if (!password) {
      setError(
        "გთხოვთ, შეიყვანოთ პაროლი."
      );

      return;
    }

    setLoading(true);
    setError("");

    try {
      /*
        1. Supabase Login
      */

      const {
        data,
        error: signInError,
      } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      if (signInError) {
        throw new Error(
          signInError.message
        );
      }

      const user =
        data.user;

      if (!user) {
        throw new Error(
          "მომხმარებელი ვერ მოიძებნა."
        );
      }

      /*
        2. ვამოწმებთ ნამდვილად Admin არის თუ არა.
      */

      const {
        data: adminData,
        error: adminError,
      } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (adminError) {
        await supabase.auth.signOut();

        throw new Error(
          adminError.message
        );
      }

      if (!adminData) {
        /*
          თუ ჩვეულებრივი user ცდილობს
          Admin-ში შესვლას, მაშინვე გამოვაგდოთ.
        */

        await supabase.auth.signOut();

        throw new Error(
          "ამ ანგარიშს Admin წვდომა არ აქვს."
        );
      }

      /*
        3. წარმატებულია.
      */

      router.replace(
        "/admin/support"
      );

      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Login ვერ მოხერხდა.";

      if (
        message
          .toLowerCase()
          .includes(
            "invalid login credentials"
          )
      ) {
        setError(
          "ელფოსტა ან პაროლი არასწორია."
        );
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <main className="page">
        <div className="loadingCard">
          <div className="spinner" />

          <strong>
            QR RETURN
          </strong>

          <span>
            Admin მოწმდება...
          </span>
        </div>

        <Styles />
      </main>
    );
  }

  return (
    <main className="page">
      <section className="loginCard">
        <div className="logoArea">
          <div className="logo">
            QR
          </div>

          <div className="brand">
            <strong>
              QR RETURN
            </strong>

            <span>
              ADMIN
            </span>
          </div>
        </div>

        <div className="title">
          <div className="adminIcon">
            👩‍💻
          </div>

          <h1>
            Admin Login
          </h1>

          <p>
            შედით QR RETURN Support
            Inbox-ში
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="form"
        >
          <label>
            <span>
              Admin Email
            </span>

            <input
              type="email"
              value={email}
              autoComplete="email"
              placeholder="admin@example.com"
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
            />
          </label>

          <label>
            <span>
              Password
            </span>

            <input
              type="password"
              value={password}
              autoComplete="current-password"
              placeholder="••••••••"
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
            />
          </label>

          {error && (
            <div className="error">
              <div>
                ⚠️
              </div>

              <span>
                {error}
              </span>
            </div>
          )}

          <button
            type="submit"
            className="loginButton"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="smallSpinner" />

                შესვლა...
              </>
            ) : (
              <>
                შესვლა

                <span>
                  →
                </span>
              </>
            )}
          </button>
        </form>

        <div className="security">
          <span>
            🔒
          </span>

          <div>
            <strong>
              დაცული Admin სივრცე
            </strong>

            <p>
              მხოლოდ ავტორიზებული
              QR RETURN ადმინისტრატორისთვის
            </p>
          </div>
        </div>

        <a
          href="/"
          className="back"
        >
          ← მთავარ გვერდზე დაბრუნება
        </a>
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
        font-family:
          Inter,
          Arial,
          sans-serif;
      }

      button,
      input {
        font: inherit;
      }

      .page {
        min-height: 100vh;

        padding: 30px 18px;

        display: flex;
        align-items: center;
        justify-content: center;

        background:
          radial-gradient(
            circle at 20% 20%,
            rgba(
              59,
              130,
              246,
              0.12
            ),
            transparent 35%
          ),
          radial-gradient(
            circle at 80% 80%,
            rgba(
              124,
              58,
              237,
              0.12
            ),
            transparent 35%
          ),
          #f8faff;

        color: #101828;
      }

      .loginCard {
        width: 100%;
        max-width: 420px;

        padding: 28px;

        border:
          1px solid #e4e7ec;

        border-radius: 22px;

        background:
          rgba(
            255,
            255,
            255,
            0.97
          );

        box-shadow:
          0 24px 70px
          rgba(
            31,
            42,
            90,
            0.13
          );
      }

      .logoArea {
        display: flex;
        align-items: center;

        gap: 10px;
      }

      .logo {
        width: 46px;
        height: 46px;

        display: grid;
        place-items: center;

        border-radius: 13px;

        background:
          linear-gradient(
            135deg,
            #1465e8,
            #7047eb
          );

        color: white;

        font-size: 12px;
        font-weight: 900;

        box-shadow:
          0 8px 20px
          rgba(
            20,
            101,
            232,
            0.22
          );
      }

      .brand strong,
      .brand span {
        display: block;
      }

      .brand strong {
        color: #1465e8;

        font-size: 17px;
        font-weight: 900;
      }

      .brand span {
        margin-top: 2px;

        color: #667085;

        font-size: 8px;
        font-weight: 900;

        letter-spacing: 2px;
      }

      .title {
        margin-top: 30px;

        text-align: center;
      }

      .adminIcon {
        width: 62px;
        height: 62px;

        margin: 0 auto 12px;

        display: grid;
        place-items: center;

        border-radius: 18px;

        background:
          linear-gradient(
            135deg,
            #eaf2ff,
            #f1ebff
          );

        font-size: 31px;
      }

      .title h1 {
        margin: 0;

        color: #101828;

        font-size: 24px;
        font-weight: 900;
      }

      .title p {
        margin: 7px 0 0;

        color: #667085;

        font-size: 12px;
      }

      .form {
        margin-top: 27px;

        display: flex;
        flex-direction: column;

        gap: 17px;
      }

      .form label {
        display: block;
      }

      .form label > span {
        margin-bottom: 7px;

        display: block;

        color: #344054;

        font-size: 12px;
        font-weight: 800;
      }

      .form input {
        width: 100%;
        height: 48px;

        padding: 0 13px;

        border:
          1px solid #d0d5dd;

        border-radius: 10px;

        outline: none;

        background: white;

        color: #101828;

        font-size: 13px;

        transition:
          border-color 0.15s ease,
          box-shadow 0.15s ease;
      }

      .form input:focus {
        border-color: #1465e8;

        box-shadow:
          0 0 0 3px
          rgba(
            20,
            101,
            232,
            0.1
          );
      }

      .form input::placeholder {
        color: #98a2b3;
      }

      .error {
        padding: 11px;

        display: flex;
        align-items: flex-start;

        gap: 8px;

        border:
          1px solid #fecdca;

        border-radius: 9px;

        background: #fff1f0;

        color: #b42318;

        font-size: 11px;

        line-height: 1.4;
      }

      .loginButton {
        width: 100%;
        height: 48px;

        padding: 0 16px;

        display: flex;
        align-items: center;
        justify-content: center;

        gap: 9px;

        border: 0;

        border-radius: 11px;

        background:
          linear-gradient(
            135deg,
            #1465e8,
            #6047df
          );

        color: white;

        font-size: 13px;
        font-weight: 900;

        cursor: pointer;

        box-shadow:
          0 10px 25px
          rgba(
            20,
            101,
            232,
            0.2
          );

        transition:
          transform 0.15s ease,
          opacity 0.15s ease;
      }

      .loginButton:hover:not(
          :disabled
        ) {
        transform:
          translateY(-1px);
      }

      .loginButton:disabled {
        opacity: 0.6;

        cursor:
          not-allowed;
      }

      .smallSpinner {
        width: 16px;
        height: 16px;

        border:
          2px solid
          rgba(
            255,
            255,
            255,
            0.35
          );

        border-top-color:
          white;

        border-radius: 50%;

        animation:
          spin 0.7s
          linear infinite;
      }

      .security {
        margin-top: 20px;

        padding: 12px;

        display: flex;
        align-items: center;

        gap: 10px;

        border-radius: 10px;

        background: #f8fafc;
      }

      .security > span {
        font-size: 20px;
      }

      .security strong {
        display: block;

        color: #344054;

        font-size: 10px;
      }

      .security p {
        margin: 3px 0 0;

        color: #98a2b3;

        font-size: 9px;
      }

      .back {
        margin-top: 20px;

        display: block;

        color: #667085;

        font-size: 10px;
        font-weight: 700;

        text-align: center;
        text-decoration: none;
      }

      .back:hover {
        color: #1465e8;
      }

      .loadingCard {
        display: flex;
        flex-direction: column;

        align-items: center;

        gap: 7px;

        color: #667085;
      }

      .loadingCard strong {
        color: #1465e8;

        font-size: 17px;
      }

      .loadingCard span {
        font-size: 11px;
      }

      .spinner {
        width: 35px;
        height: 35px;

        margin-bottom: 8px;

        border:
          3px solid #e4e7ec;

        border-top-color:
          #1465e8;

        border-radius: 50%;

        animation:
          spin 0.8s
          linear infinite;
      }

      @keyframes spin {
        to {
          transform:
            rotate(360deg);
        }
      }

      @media (
        max-width: 500px
      ) {
        .page {
          padding: 18px 12px;
        }

        .loginCard {
          padding: 23px 18px;

          border-radius: 18px;
        }
      }
    `}</style>
  );
}
