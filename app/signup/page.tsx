"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

export default function SignupPage() {
  const [lang, setLang] = useState<Lang>("ka");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [verificationCode, setVerificationCode] = useState("");

  const [step, setStep] = useState<"signup" | "verify">("signup");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const ka = lang === "ka";

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (
      !cleanFirstName ||
      !cleanLastName ||
      !cleanEmail ||
      !cleanPhone
    ) {
      setError(
        ka
          ? "სახელი, გვარი, ელფოსტა და ტელეფონის ნომერი სავალდებულოა."
          : "First name, last name, email and phone number are required."
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
      const { data, error: signupError } =
        await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              first_name: cleanFirstName,
              last_name: cleanLastName,
              full_name: `${cleanFirstName} ${cleanLastName}`,
              phone: cleanPhone,
            },
          },
        });

      if (signupError) {
        setError(signupError.message);
        return;
      }

      if (!data.user) {
        setError(
          ka
            ? "ანგარიშის შექმნა ვერ მოხერხდა."
            : "Could not create your account."
        );
        return;
      }

      /*
        თუ Confirm Email ჩართულია,
        მომხმარებელს ელფოსტაზე მიუვა OTP კოდი.
      */
      if (!data.session) {
        setStep("verify");
        return;
      }

      /*
        თუ email confirmation გამორთულია
      */
      window.location.href = "/my-profiles";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "დაფიქსირდა შეცდომა."
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  async function verifyEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const token = verificationCode.trim();

    if (!token) {
      setError(
        ka
          ? "შეიყვანეთ ელფოსტაზე მიღებული კოდი."
          : "Enter the code sent to your email."
      );
      return;
    }

    setLoading(true);

    try {
      const { data, error: verifyError } =
        await supabase.auth.verifyOtp({
          email: email.trim().toLowerCase(),
          token,
          type: "email",
        });

      if (verifyError) {
        setError(
          ka
            ? "კოდი არასწორია ან ვადა გაუვიდა."
            : "The code is incorrect or has expired."
        );
        return;
      }

      if (!data.session) {
        setError(
          ka
            ? "ელფოსტის დადასტურება ვერ მოხერხდა."
            : "Email verification failed."
        );
        return;
      }

      window.location.href = "/my-profiles";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "დადასტურება ვერ მოხერხდა."
          : "Verification failed."
      );
    } finally {
      setLoading(false);
    }
  }

  if (step === "verify") {
    return (
      <main className="page">
        <header className="header">
          <a href="/" className="brand">
            <div className="logo">QR</div>

            <div>
              <strong>QR RETURN</strong>
              <small>EMAIL VERIFICATION</small>
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

        <section className="verifyWrapper">
          <div className="verifyCard">
            <div className="mailIcon">✉️</div>

            <div className="eyebrow">QR RETURN</div>

            <h1>
              {ka
                ? "შეიყვანეთ ელფოსტაზე მიღებული კოდი"
                : "Enter the code sent to your email"}
            </h1>

            <p>
              {ka
                ? `დადასტურების კოდი გავაგზავნეთ მისამართზე ${email}.`
                : `We sent a verification code to ${email}.`}
            </p>

            <form onSubmit={verifyEmail}>
              <label>
                <span>
                  {ka
                    ? "დადასტურების კოდი"
                    : "Verification code"}
                </span>

                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={verificationCode}
                  onChange={(event) =>
                    setVerificationCode(event.target.value)
                  }
                  placeholder="000000"
                  maxLength={8}
                  className="otpInput"
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
                    ? "მოწმდება..."
                    : "Verifying..."
                  : ka
                  ? "დადასტურება"
                  : "Verify"}
              </button>
            </form>

            <button
              type="button"
              className="backButton"
              onClick={() => {
                setError("");
                setVerificationCode("");
                setStep("signup");
              }}
            >
              ← {ka ? "უკან დაბრუნება" : "Go back"}
            </button>
          </div>
        </section>

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
            <small>CREATE ACCOUNT</small>
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
            {ka ? "შექმენით თქვენი ანგარიში" : "Create your account"}
          </h1>

          <p>
            {ka
              ? "ერთჯერადი რეგისტრაცია. ანგარიშის შექმნის შემდეგ შეძლებთ თქვენი QR პროფილების დამატებას და მართვას."
              : "Register once. After creating your account, you can add and manage your QR profiles."}
          </p>

          <div className="note">
            <span>🔐</span>

            <div>
              <strong>
                {ka
                  ? "უსაფრთხო რეგისტრაცია"
                  : "Secure registration"}
              </strong>

              <p>
                {ka
                  ? "ელფოსტის მისამართს დაადასტურებთ ერთჯერადი კოდით."
                  : "You will verify your email using a one-time code."}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <div className="cardIcon">👤</div>

            <div>
              <span>QR RETURN</span>

              <h2>
                {ka ? "ანგარიშის შექმნა" : "Create Account"}
              </h2>
            </div>
          </div>

          <p className="cardDescription">
            {ka
              ? "შეავსეთ თქვენი ძირითადი საკონტაქტო ინფორმაცია."
              : "Enter your basic contact information."}
          </p>

          <form onSubmit={handleSignup}>
            <div className="nameGrid">
              <label>
                <span>{ka ? "სახელი" : "First name"} *</span>

                <input
                  type="text"
                  value={firstName}
                  onChange={(event) =>
                    setFirstName(event.target.value)
                  }
                  placeholder={ka ? "სახელი" : "First name"}
                  autoComplete="given-name"
                  required
                />
              </label>

              <label>
                <span>{ka ? "გვარი" : "Last name"} *</span>

                <input
                  type="text"
                  value={lastName}
                  onChange={(event) =>
                    setLastName(event.target.value)
                  }
                  placeholder={ka ? "გვარი" : "Last name"}
                  autoComplete="family-name"
                  required
                />
              </label>
            </div>

            <label>
              <span>{ka ? "ელფოსტა" : "Email"} *</span>

              <div className="inputWithIcon">
                <b>✉</b>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label>
              <span>
                {ka ? "ტელეფონის ნომერი" : "Phone number"} *
              </span>

              <div className="inputWithIcon">
                <b>☎</b>

                <input
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="+1 000 000 0000"
                  autoComplete="tel"
                  required
                />
              </div>
            </label>

            <label>
              <span>{ka ? "პაროლი" : "Password"} *</span>

              <div className="inputWithIcon">
                <b>●</b>

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="••••••••"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>

              <small>
                {ka
                  ? "მინიმუმ 8 სიმბოლო"
                  : "At least 8 characters"}
              </small>
            </label>

            <label>
              <span>
                {ka
                  ? "გაიმეორეთ პაროლი"
                  : "Confirm password"}{" "}
                *
              </span>

              <div className="inputWithIcon">
                <b>✓</b>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="••••••••"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>
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
                  ? "იქმნება..."
                  : "Creating..."
                : ka
                ? "ანგარიშის შექმნა"
                : "Create Account"}

              {!loading && <span>→</span>}
            </button>
          </form>

          <div className="login">
            <span>
              {ka
                ? "უკვე გაქვთ ანგარიში?"
                : "Already have an account?"}
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
        margin: auto;
        padding: 70px 0 80px;
        display: grid;
        grid-template-columns: 1fr 470px;
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
        color: #101828;
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

      .note {
        margin-top: 32px;
        padding: 17px;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        border: 1px solid #dbe7ff;
        border-radius: 15px;
        background: rgba(255, 255, 255, 0.75);
      }

      .note > span {
        font-size: 24px;
      }

      .note strong {
        color: #344054;
        font-size: 14px;
      }

      .note p {
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

      .cardIcon {
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

      .cardDescription {
        margin: 17px 0 25px;
        color: #667085;
        font-size: 14px;
        line-height: 1.55;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 17px;
      }

      .nameGrid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 11px;
      }

      label > span {
        display: block;
        margin-bottom: 7px;
        color: #475467;
        font-size: 14px;
        font-weight: 800;
      }

      label > small {
        display: block;
        margin-top: 5px;
        color: #98a2b3;
        font-size: 11px;
      }

      input {
        width: 100%;
        height: 52px;
        padding: 0 14px;
        outline: none;
        border: 1px solid #d0d5dd;
        border-radius: 11px;
        background: #fff;
        color: #344054;
        font-size: 16px;
      }

      input:focus {
        border-color: #84adff;
        box-shadow: 0 0 0 3px rgba(20, 101, 232, 0.08);
      }

      input::placeholder {
        color: #98a2b3;
      }

      .inputWithIcon {
        position: relative;
      }

      .inputWithIcon b {
        width: 43px;
        height: 52px;
        position: absolute;
        left: 0;
        top: 0;
        display: grid;
        place-items: center;
        color: #98a2b3;
        font-size: 13px;
        pointer-events: none;
      }

      .inputWithIcon input {
        padding-left: 42px;
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

      .submitButton > span {
        font-size: 20px;
      }

      .login {
        margin-top: 22px;
        padding-top: 19px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        border-top: 1px solid #eaecf0;
        font-size: 13px;
      }

      .login span {
        color: #667085;
      }

      .login a {
        color: #1465e8;
        font-weight: 900;
        text-decoration: none;
      }

      .error {
        padding: 12px;
        display: flex;
        align-items: flex-start;
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
        flex: 0 0 20px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: #d92d20;
        color: white;
        font-size: 10px;
      }

      .verifyWrapper {
        width: calc(100% - 36px);
        min-height: calc(100vh - 86px);
        margin: auto;
        display: grid;
        place-items: center;
        padding: 40px 0;
      }

      .verifyCard {
        width: 100%;
        max-width: 500px;
        padding: 40px;
        border: 1px solid #e4e7ec;
        border-radius: 24px;
        background: white;
        box-shadow: 0 24px 60px rgba(16, 24, 40, 0.1);
        text-align: center;
      }

      .mailIcon {
        font-size: 45px;
      }

      .verifyCard h1 {
        margin: 12px 0 12px;
        color: #344054;
        font-size: 28px;
        line-height: 1.25;
      }

      .verifyCard > p {
        margin: 0 0 25px;
        color: #667085;
        font-size: 15px;
        line-height: 1.6;
      }

      .verifyCard label {
        text-align: left;
      }

      .otpInput {
        height: 62px;
        text-align: center;
        font-size: 25px;
        font-weight: 900;
        letter-spacing: 8px;
      }

      .backButton {
        margin-top: 18px;
        border: 0;
        background: transparent;
        color: #667085;
        font-size: 13px;
        font-weight: 800;
        cursor: pointer;
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

        .note {
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

        .nameGrid {
          grid-template-columns: 1fr;
        }

        .verifyCard {
          padding: 28px 20px;
        }
      }
    `}</style>
  );
}
