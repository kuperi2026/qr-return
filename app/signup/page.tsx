"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

import AuthShell from "@/components/auth/AuthShell";
import SignupForm from "@/components/auth/SignupForm";

type Lang = "ka" | "en";

export default function SignupPage() {
  const [lang, setLang] =
    useState<Lang>("ka");

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
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
          "/account";
      }
    }

    void checkSession();
  }, []);

  async function handleSignup(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    const cleanFirstName =
      firstName.trim();

    const cleanLastName =
      lastName.trim();

    const cleanPhone =
      phone.trim();

    if (
      !cleanFirstName ||
      !cleanLastName ||
      !cleanEmail ||
      !password ||
      !confirmPassword
    ) {
      setError(
        ka
          ? "შეავსეთ ყველა აუცილებელი ველი."
          : "Please complete all required fields."
      );

      return;
    }

    if (password.length < 8) {
      setError(
        ka
          ? "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს."
          : "Password must contain at least 8 characters."
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

    setLoading(true);

    try {
      const {
        data,
        error: signupError,
      } =
        await supabase.auth.signUp({
          email: cleanEmail,
          password,

          options: {
            data: {
              first_name:
                cleanFirstName,

              last_name:
                cleanLastName,

              full_name:
                `${cleanFirstName} ${cleanLastName}`,

              phone:
                cleanPhone || null,
            },

            emailRedirectTo:
              typeof window !==
              "undefined"
                ? `${window.location.origin}/login`
                : undefined,
          },
        });

      if (signupError) {
        setError(
          signupError.message
        );

        return;
      }

      /*
        თუ email confirmation გამორთულია,
        მომხმარებელი პირდაპირ Owner Account-ზე გადავა.

        Account გვერდი თვითონ შეამოწმებს,
        შექმნილია თუ არა Owner Profile.
      */

      if (data.session) {
        window.location.href =
          "/account";

        return;
      }

      /*
        თუ email confirmation ჩართულია,
        მომხმარებელმა ჯერ Email უნდა დაადასტუროს.
      */

      setSuccess(
        ka
          ? "ანგარიში შეიქმნა. შეამოწმეთ თქვენი Email ანგარიშის დასადასტურებლად."
          : "Your account was created. Check your email to confirm your account."
      );
    } catch (err) {
      console.error(
        "Signup error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "ანგარიშის შექმნა ვერ მოხერხდა."
          : "Could not create the account."
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
            ? "შექმენით ანგარიში"
            : "Create your account"
        }
        description={
          ka
            ? "ერთი ანგარიშიდან მართეთ თქვენი QR პროფილები, პროდუქტები და დაბრუნების პროცესები."
            : "Manage your QR profiles, products, and return activity from one account."
        }
      >
        <SignupForm
          firstName={firstName}
          lastName={lastName}
          email={email}
          phone={phone}
          password={password}
          confirmPassword={
            confirmPassword
          }

          loading={loading}
          error={error}

          onFirstNameChange={
            setFirstName
          }

          onLastNameChange={
            setLastName
          }

          onEmailChange={
            setEmail
          }

          onPhoneChange={
            setPhone
          }

          onPasswordChange={
            setPassword
          }

          onConfirmPasswordChange={
            setConfirmPassword
          }

          onSubmit={
            handleSignup
          }
        />

        {success && (
          <div className="success">
            {success}
          </div>
        )}
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

          border: 1px solid #e0e5e8;
          border-radius: 999px;

          background:
            rgba(255, 255, 255, 0.92);

          backdrop-filter: blur(10px);
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

        .success {
          margin-top: 16px;
          padding: 12px;

          border: 1px solid #cfe6d8;
          border-radius: 9px;

          color: #326449;
          background: #f2faf5;

          font-size: 8px;
          line-height: 1.55;
        }

        @media (max-width: 520px) {
          .languageBar {
            top: 10px;
            right: 10px;
          }
        }
      `}</style>
    </>
  );
}
