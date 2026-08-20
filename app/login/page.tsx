"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

type Lang = "ka" | "en";

export default function LoginPage() {
  const [lang, setLang] =
    useState<Lang>("ka");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const ka = lang === "ka";

  useEffect(() => {
    async function checkSession() {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (user) {
        window.location.href =
          "/my-profiles";
      }
    }

    void checkSession();
  }, []);

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    if (
      !cleanEmail ||
      !password
    ) {
      setError(
        ka
          ? "შეიყვანეთ ელფოსტა და პაროლი."
          : "Enter your email and password."
      );

      return;
    }

    setLoading(true);

    try {
      const {
        error: loginError,
      } =
        await supabase.auth
          .signInWithPassword({
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

      window.location.href =
        "/my-profiles";
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
    <>
      <div className="languageBar">
        <button
          type="button"
          className={
            ka
              ? "active"
              : ""
          }
          onClick={() =>
            setLang("ka")
          }
        >
          GEO
        </button>

        <button
          type="button"
          className={
            !ka
              ? "active"
              : ""
          }
          onClick={() =>
            setLang("en")
          }
        >
          ENG
        </button>
      </div>

      <AuthShell
        eyebrow={
          ka
            ? "QR RETURN ანგარიში"
            : "QR RETURN ACCOUNT"
        }
        title={
          ka
            ? "შედით თქვენს ანგარიშში"
            : "Sign in to your account"
        }
        description={
          ka
            ? "ერთი ანგარიშიდან მართეთ თქვენი ყველა QR პროფილი."
            : "Manage all of your QR profiles from one account."
        }
      >
        <LoginForm
          email={email}
          password={password}
          loading={loading}
          error={error}
          onEmailChange={
            setEmail
          }
          onPasswordChange={
            setPassword
          }
          onSubmit={
            handleLogin
          }
        />
      </AuthShell>

      <style jsx>{`
        .languageBar {
          position: fixed;

          top: 18px;
          right: 22px;

          z-index: 50;

          display: flex;

          gap: 4px;

          padding: 4px;

          border:
            1px solid #e0e5e8;

          border-radius: 999px;

          background:
            rgba(
              255,
              255,
              255,
              0.92
            );

          backdrop-filter:
            blur(10px);
        }

        .languageBar button {
          min-width: 38px;
          height: 28px;

          padding: 0 8px;

          border: 0;
          border-radius: 999px;

          color: #8b959e;
          background: transparent;

          cursor: pointer;

          font-size: 7px;
          font-weight: 900;
        }

        .languageBar button.active {
          color: white;
          background: #202b37;
        }

        @media (
          max-width: 520px
        ) {
          .languageBar {
            top: 10px;
            right: 10px;
          }
        }
      `}</style>
    </>
  );
}
