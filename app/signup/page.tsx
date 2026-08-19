"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [lang, setLang] = useState<"ka" | "en">("ka");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] =
    useState(false);

  const ka = lang === "ka";

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess(false);
    setNeedsEmailConfirmation(false);

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanFirstName || !cleanLastName || !cleanEmail) {
      setError(
        ka
          ? "გთხოვთ შეავსოთ სახელი, გვარი და ელფოსტა."
          : "Please enter your first name, last name and email."
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
      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/my-profiles`
          : undefined;

      const { data, error: signupError } =
        await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              first_name: cleanFirstName,
              last_name: cleanLastName,
              full_name: `${cleanFirstName} ${cleanLastName}`,
              phone: cleanPhone || null,
            },
            emailRedirectTo: redirectUrl,
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
            : "We could not create your account."
        );
        return;
      }

      setSuccess(true);

      /*
        თუ Supabase-ში Email Confirmation ჩართულია,
        user შეიქმნება, მაგრამ session ჯერ არ გვექნება.
      */
      if (!data.session) {
        setNeedsEmailConfirmation(true);
        return;
      }

      /*
        თუ session უკვე არსებობს,
        მომხმარებელი პირდაპირ გადავა My QR Profiles-ზე.
      */
      window.location.href = "/my-profiles";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "დაფიქსირდა შეცდომა. სცადეთ თავიდან."
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (success && needsEmailConfirmation) {
    return (
      <main className="statePage">
        <div className="successIcon">✓</div>

        <div className="miniBrand">QR RETURN</div>

        <h1>
          {ka
            ? "შეამოწმეთ თქვენი ელფოსტა"
            : "Check your email"}
        </h1>

        <p>
          {ka
            ? `ანგარიში შეიქმნა. დამადასტურებელი ბმული გამოგზავნილია ${email.trim()} მისამართზე.`
            : `Your account was created. We sent a confirmation link to ${email.trim()}.`}
        </p>

        <p className="smallText">
          {ka
            ? "ელფოსტის დადასტურების შემდეგ შეძლებთ თქვენს ანგარიშში შესვლას და QR პროფილების დამატებას."
            : "After confirming your email, you can sign in and start adding QR profiles."}
        </p>

        <a href="/login" className="primaryLink">
          {ka ? "შესვლის გვერდზე გადასვლა" : "Go to Sign In"}
        </a>

        <a href="/" className="homeLink">
          {ka ? "← მთავარ გვერდზე" : "← Back to home"}
        </a>

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
        <div className="info">
          <div className="eyebrow">
            {ka ? "თქვენი QR RETURN ანგარიში" : "YOUR QR RETURN ACCOUNT"}
          </div>

          <h1>
            {ka ? (
              <>
                შექმენით ანგარიში.
                <br />
                <span>დაიცავით რაც მნიშვნელოვანია.</span>
              </>
            ) : (
              <>
                Create your account.
                <br />
                <span>Protect what matters.</span>
              </>
            )}
          </h1>

          <p className="intro">
            {ka
              ? "ერთი ანგარიში გაძლევთ საშუალებას მართოთ ყველა თქვენი QR პროფილი ერთ ადგილას."
              : "One account lets you manage all your QR profiles in one place."}
          </p>

          <div className="features">
            <div className="feature">
              <div>🐕</div>
              <span>
                {ka
                  ? "დაამატეთ ძაღლი ან კატა"
                  : "Add your dog or cat"}
              </span>
            </div>

            <div className="feature">
              <div>🧳</div>
              <span>
                {ka
                  ? "დაამატეთ თქვენი ნივთები"
                  : "Add your belongings"}
              </span>
            </div>

            <div className="feature">
              <div>🏷️</div>
              <span>
                {ka
                  ? "თითოეულს საკუთარი QR პროფილი"
                  : "A separate QR profile for each"}
              </span>
            </div>

            <div className="feature">
              <div>🔐</div>
              <span>
                {ka
                  ? "მართეთ ყველაფერი ერთი ანგარიშიდან"
                  : "Manage everything from one account"}
              </span>
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
              ? "ჯერ შექმენით თქვენი პირადი ანგარიში. შემდეგ შეძლებთ ნებისმიერი QR პროფილის დამატებას."
              : "Create your personal account first. Then you can add any QR profile you need."}
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
                {ka
                  ? "ტელეფონის ნომერი"
                  : "Phone number"}
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
                />
              </div>

              <small>
                {ka
                  ? "არასავალდებულო"
                  : "Optional"}
              </small>
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
              {loading ? (
                <>
                  <span className="buttonLoader" />
                  {ka ? "იქმნება..." : "Creating..."}
                </>
              ) : (
                <>
                  {ka ? "ანგარიშის შექმნა" : "Create Account"}
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          <div className="security">
            <span>🔒</span>

            <p>
              {ka
                ? "თქვენი პაროლი უსაფრთხოდ მუშავდება და QR RETURN-ს მისი ნახვა არ შეუძლია."
                : "Your password is securely handled and cannot be viewed by QR RETURN."}
            </p>
          </div>

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

      <footer>
        <strong>QR RETURN</strong>

        <span>
          {ka
            ? "ერთი ანგარიში • ყველა თქვენი QR პროფილი"
            : "One account • All your QR profiles"}
        </span>
      </footer>

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
            rgba(20, 101, 232, 0.09),
            transparent 25%
          ),
          radial-gradient(
            circle at 93% 10%,
            rgba(118, 85, 247, 0.11),
            transparent 27%
          ),
          #f7f9fc;
      }

      .header {
        width: calc(100% - 36px);
        max-width: 1180px;
        min-height: 78px;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e4e7ec;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 11px;
        text-decoration: none;
      }

      .logo {
        width: 45px;
        height: 45px;
        display: grid;
        place-items: center;
        border-radius: 13px;
        background: linear-gradient(135deg, #1465e8, #7655f7);
        color: white;
        font-size: 12px;
        font-weight: 900;
        box-shadow: 0 8px 24px rgba(20, 101, 232, 0.2);
      }

      .brand strong,
      .brand small {
        display: block;
      }

      .brand strong {
        color: #1465e8;
        font-size: 18px;
        font-weight: 900;
      }

      .brand small {
        margin-top: 3px;
        color: #7655f7;
        font-size: 8px;
        font-weight: 900;
        letter-spacing: 1.7px;
      }

      .languages {
        padding: 4px;
        display: flex;
        border-radius: 9px;
        background: #eaecf0;
      }

      .languages button {
        padding: 7px 9px;
        border: 0;
        border-radius: 7px;
        background: transparent;
        color: #667085;
        font-size: 9px;
        font-weight: 900;
        cursor: pointer;
      }

      .languages button.active {
        background: white;
        color: #1465e8;
      }

      .wrapper {
        width: calc(100% - 36px);
        max-width: 1050px;
        margin: auto;
        padding: 60px 0 70px;
        display: grid;
        grid-template-columns: 1fr 460px;
        align-items: center;
        gap: 75px;
      }

      .info {
        max-width: 520px;
      }

      .eyebrow {
        color: #7655f7;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 1.8px;
        text-transform: uppercase;
      }

      .info h1 {
        margin: 12px 0 15px;
        color: #101828;
        font-size: clamp(37px, 5vw, 56px);
        line-height: 1.04;
        letter-spacing: -2.7px;
      }

      .info h1 span {
        color: #1465e8;
      }

      .intro {
        max-width: 470px;
        margin: 0;
        color: #667085;
        font-size: 14px;
        line-height: 1.7;
      }

      .features {
        margin-top: 35px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      .feature {
        min-height: 75px;
        padding: 13px;
        display: flex;
        align-items: center;
        gap: 11px;
        border: 1px solid #e4e7ec;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.72);
      }

      .feature div {
        width: 42px;
        height: 42px;
        flex: 0 0 42px;
        display: grid;
        place-items: center;
        border-radius: 11px;
        background: #eef4ff;
        font-size: 21px;
      }

      .feature span {
        color: #475467;
        font-size: 10px;
        font-weight: 800;
        line-height: 1.4;
      }

      .card {
        padding: 29px;
        border: 1px solid #e4e7ec;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.96);
        box-shadow: 0 25px 65px rgba(16, 24, 40, 0.1);
      }

      .cardHeader {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .cardIcon {
        width: 50px;
        height: 50px;
        display: grid;
        place-items: center;
        border-radius: 14px;
        background: linear-gradient(135deg, #eef4ff, #f0edff);
        font-size: 23px;
      }

      .cardHeader span {
        color: #7655f7;
        font-size: 7px;
        font-weight: 900;
        letter-spacing: 1.5px;
      }

      .cardHeader h2 {
        margin: 3px 0 0;
        color: #344054;
        font-size: 22px;
      }

      .cardDescription {
        margin: 15px 0 22px;
        color: #667085;
        font-size: 10px;
        line-height: 1.55;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .nameGrid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      label > span {
        display: block;
        margin-bottom: 6px;
        color: #475467;
        font-size: 9px;
        font-weight: 800;
      }

      label > small {
        display: block;
        margin-top: 4px;
        color: #98a2b3;
        font-size: 7px;
      }

      input {
        width: 100%;
        height: 45px;
        padding: 0 13px;
        outline: none;
        border: 1px solid #d0d5dd;
        border-radius: 10px;
        background: #fff;
        color: #344054;
        font-size: 11px;
        transition: 0.15s ease;
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
        width: 40px;
        height: 45px;
        position: absolute;
        left: 0;
        top: 0;
        display: grid;
        place-items: center;
        color: #98a2b3;
        font-size: 10px;
        pointer-events: none;
      }

      .inputWithIcon input {
        padding-left: 38px;
      }

      .submitButton {
        width: 100%;
        min-height: 48px;
        margin-top: 3px;
        padding: 0 17px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 9px;
        border: 0;
        border-radius: 11px;
        background: linear-gradient(135deg, #1465e8, #7655f7);
        color: white;
        font-size: 10px;
        font-weight: 900;
        cursor: pointer;
        box-shadow: 0 10px 25px rgba(20, 101, 232, 0.2);
      }

      .submitButton:disabled {
        opacity: 0.65;
        cursor: wait;
      }

      .submitButton > span:last-child {
        font-size: 16px;
      }

      .buttonLoader {
        width: 15px;
        height: 15px;
        border: 2px solid rgba(255, 255, 255, 0.4);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
      }

      .error {
        padding: 10px;
        display: flex;
        align-items: flex-start;
        gap: 8px;
        border: 1px solid #fecdca;
        border-radius: 9px;
        background: #fff1f0;
        color: #b42318;
        font-size: 9px;
        line-height: 1.45;
      }

      .error strong {
        width: 18px;
        height: 18px;
        flex: 0 0 18px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: #d92d20;
        color: white;
        font-size: 8px;
      }

      .security {
        margin-top: 17px;
        padding: 10px;
        display: flex;
        align-items: flex-start;
        gap: 8px;
        border-radius: 9px;
        background: #f7f9fc;
      }

      .security p {
        margin: 0;
        color: #667085;
        font-size: 7.5px;
        line-height: 1.5;
      }

      .login {
        margin-top: 19px;
        padding-top: 17px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        border-top: 1px solid #eaecf0;
        font-size: 9px;
      }

      .login span {
        color: #667085;
      }

      .login a {
        color: #1465e8;
        font-weight: 900;
        text-decoration: none;
      }

      footer {
        width: calc(100% - 36px);
        max-width: 1050px;
        margin: auto;
        padding: 22px 0 35px;
        display: flex;
        justify-content: space-between;
        border-top: 1px solid #e4e7ec;
      }

      footer strong {
        color: #1465e8;
        font-size: 10px;
      }

      footer span {
        color: #98a2b3;
        font-size: 8px;
      }

      .statePage {
        min-height: 100vh;
        padding: 25px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background:
          radial-gradient(
            circle at 50% 10%,
            rgba(20, 101, 232, 0.1),
            transparent 30%
          ),
          #f7f9fc;
        color: #344054;
        font-family: Inter, Arial, sans-serif;
        text-align: center;
      }

      .successIcon {
        width: 65px;
        height: 65px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: #ecfdf3;
        color: #079455;
        font-size: 29px;
        font-weight: 900;
      }

      .miniBrand {
        margin-top: 18px;
        color: #7655f7;
        font-size: 8px;
        font-weight: 900;
        letter-spacing: 1.8px;
      }

      .statePage h1 {
        margin: 8px 0 10px;
        font-size: 27px;
      }

      .statePage p {
        max-width: 500px;
        margin: 0;
        color: #667085;
        font-size: 11px;
        line-height: 1.6;
      }

      .statePage .smallText {
        max-width: 450px;
        margin-top: 9px;
        color: #98a2b3;
        font-size: 9px;
      }

      .primaryLink {
        margin-top: 22px;
        padding: 12px 18px;
        border-radius: 10px;
        background: #1465e8;
        color: white;
        font-size: 9px;
        font-weight: 900;
        text-decoration: none;
      }

      .homeLink {
        margin-top: 13px;
        color: #667085;
        font-size: 8px;
        font-weight: 800;
        text-decoration: none;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 850px) {
        .wrapper {
          max-width: 620px;
          grid-template-columns: 1fr;
          gap: 35px;
        }

        .info {
          max-width: none;
          text-align: center;
        }

        .intro {
          margin-left: auto;
          margin-right: auto;
        }
      }

      @media (max-width: 550px) {
        .wrapper {
          padding-top: 35px;
        }

        .info h1 {
          font-size: 38px;
        }

        .features {
          grid-template-columns: 1fr;
        }

        .card {
          padding: 21px;
        }

        .nameGrid {
          grid-template-columns: 1fr;
        }

        footer {
          align-items: center;
          flex-direction: column;
          gap: 7px;
        }
      }
    `}</style>
  );
}
