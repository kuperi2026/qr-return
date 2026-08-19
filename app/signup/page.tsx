"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

async function sha256(value: string) {
  const data = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export default function SignupPage() {
  const [lang, setLang] = useState<Lang>("ka");
  const ka = lang === "ka";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [personalId, setPersonalId] = useState("");
  const [codeWord, setCodeWord] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanPersonalId = personalId.trim();
    const cleanCodeWord = codeWord.trim();

    if (
      !cleanFirstName ||
      !cleanLastName ||
      !cleanEmail ||
      !cleanPhone ||
      !cleanPersonalId ||
      !cleanCodeWord ||
      !password ||
      !confirmPassword
    ) {
      setError(
        ka
          ? "გთხოვთ შეავსოთ ყველა სავალდებულო ველი."
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

    if (cleanCodeWord.length < 4) {
      setError(
        ka
          ? "კოდური სიტყვა უნდა შეიცავდეს მინიმუმ 4 სიმბოლოს."
          : "Code word must contain at least 4 characters."
      );
      return;
    }

    setLoading(true);

    try {
      const personalIdHash = await sha256(
        cleanPersonalId.toLowerCase()
      );

      const codeWordHash = await sha256(
        cleanCodeWord.toLowerCase()
      );

      const { data, error: signupError } =
        await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              first_name: cleanFirstName,
              last_name: cleanLastName,
              phone: cleanPhone,
            },
          },
        });

      if (signupError) {
        throw signupError;
      }

      const user = data.user;

      if (!user) {
        throw new Error(
          ka
            ? "მომხმარებლის შექმნა ვერ მოხერხდა."
            : "Could not create user."
        );
      }

      /*
        თუ Supabase Email Confirmation გამორთულია,
        signUp-ის შემდეგ session ჩვეულებრივ უკვე არსებობს
        და owner_accounts-ში პირდაპირ შეგვიძლია ჩაწერა.

        თუ მომავალში Email Confirmation ჩავრთეთ,
        owner account-ის შექმნას confirmation-ის შემდეგ
        გადავიტანთ server-side flow-ში.
      */

      const { error: ownerError } = await supabase
        .from("owner_accounts")
        .upsert(
          {
            user_id: user.id,

            first_name: cleanFirstName,
            last_name: cleanLastName,

            email: cleanEmail,
            phone: cleanPhone,

            address: null,
            photo: null,

            personal_id_hash: personalIdHash,
            code_word_hash: codeWordHash,

            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id",
          }
        );

      if (ownerError) {
        /*
          Auth user უკვე შეიქმნა, ამიტომ მომხმარებელს
          არ ვეუბნებით უბრალოდ "Signup failed".
          ვაძლევთ ზუსტ შეტყობინებას.
        */
        throw new Error(
          ka
            ? `ანგარიში შეიქმნა, მაგრამ მფლობელის პროფილის შენახვა ვერ მოხერხდა: ${ownerError.message}`
            : `Account was created, but the owner profile could not be saved: ${ownerError.message}`
        );
      }

      setSuccess(
        ka
          ? "ანგარიში წარმატებით შეიქმნა."
          : "Account created successfully."
      );

      /*
        თუ session გვაქვს, პირდაპირ Account-ზე გადავდივართ.
        თუ მომავალში email confirmation ჩაირთვება და session არ იქნება,
        Login გვერდზე გადავიყვანთ.
      */

      if (data.session) {
        window.location.href = "/account";
      } else {
        window.location.href = "/login";
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "რეგისტრაცია ვერ მოხერხდა."
          : "Could not create account."
      );
    } finally {
      setLoading(false);
    }
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

      <section className="container">
        <div className="intro">
          <div className="eyebrow">
            {ka
              ? "QR RETURN ანგარიში"
              : "QR RETURN ACCOUNT"}
          </div>

          <h1>
            {ka
              ? "შექმენით მფლობელის ანგარიში"
              : "Create your Owner Account"}
          </h1>

          <p>
            {ka
              ? "ერთი ანგარიშიდან მართეთ თქვენი ყველა QR პროფილი — ძაღლი, კატა, გასაღები, საფულე, ჩანთა და ჩემოდანი."
              : "Manage all your QR profiles from one account — dog, cat, keys, wallet, bag and suitcase."}
          </p>
        </div>

        <div className="layout">
          <div className="infoPanel">
            <div className="infoCard">
              <div className="number">01</div>

              <div>
                <strong>
                  {ka ? "ერთი Owner Account" : "One Owner Account"}
                </strong>

                <p>
                  {ka
                    ? "ერთ ანგარიშზე შეგიძლიათ შექმნათ რამდენიც გსურთ იმდენი QR პროფილი."
                    : "Create as many QR profiles as you need under one account."}
                </p>
              </div>
            </div>

            <div className="infoCard">
              <div className="number">02</div>

              <div>
                <strong>
                  {ka ? "დაცული მონაცემები" : "Protected information"}
                </strong>

                <p>
                  {ka
                    ? "პირადი ნომერი და კოდური სიტყვა ბაზაში ღია ტექსტით არ ინახება."
                    : "Your personal ID and code word are not stored as readable plain text."}
                </p>
              </div>
            </div>

            <div className="infoCard">
              <div className="number">03</div>

              <div>
                <strong>
                  {ka ? "საიტზე შესვლა" : "Sign in"}
                </strong>

                <p>
                  {ka
                    ? "ანგარიშზე შეხვალთ თქვენი ელფოსტით და პაროლით."
                    : "Sign in using your email and password."}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="cardTitle">
              <span>
                {ka ? "ახალი ანგარიში" : "NEW ACCOUNT"}
              </span>

              <h2>
                {ka ? "რეგისტრაცია" : "Create account"}
              </h2>

              <p>
                {ka
                  ? "შეავსეთ მფლობელის ძირითადი ინფორმაცია."
                  : "Enter the owner's account information."}
              </p>
            </div>

            <form onSubmit={handleSignup}>
              <div className="twoColumns">
                <label>
                  <span>
                    {ka ? "სახელი" : "First name"} *
                  </span>

                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) =>
                      setFirstName(e.target.value)
                    }
                    autoComplete="given-name"
                    required
                  />
                </label>

                <label>
                  <span>
                    {ka ? "გვარი" : "Last name"} *
                  </span>

                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) =>
                      setLastName(e.target.value)
                    }
                    autoComplete="family-name"
                    required
                  />
                </label>
              </div>

              <label>
                <span>{ka ? "ელფოსტა" : "Email"} *</span>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                />

                <small>
                  {ka
                    ? "ეს ელფოსტა გამოიყენება ანგარიშზე შესასვლელად."
                    : "This email will be used to sign in."}
                </small>
              </label>

              <label>
                <span>{ka ? "ტელეფონი" : "Mobile phone"} *</span>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="+1 555 000 0000"
                  autoComplete="tel"
                  required
                />
              </label>

              <div className="securitySection">
                <div className="securityTitle">
                  <div className="securityIcon">🔐</div>

                  <div>
                    <strong>
                      {ka
                        ? "იდენტიფიკაციის ინფორმაცია"
                        : "Identity verification"}
                    </strong>

                    <p>
                      {ka
                        ? "ეს მონაცემები მომავალში შეიძლება გამოყენებულ იქნეს თქვენი ვინაობის დასადასტურებლად."
                        : "These details may later be used to help verify your identity."}
                    </p>
                  </div>
                </div>

                <label>
                  <span>
                    {ka ? "პირადი ნომერი" : "Personal ID"} *
                  </span>

                  <input
                    type="text"
                    value={personalId}
                    onChange={(e) =>
                      setPersonalId(e.target.value)
                    }
                    autoComplete="off"
                    required
                  />

                  <small>
                    {ka
                      ? "ეს ინფორმაცია მპოვნელისთვის არასდროს გამოჩნდება."
                      : "This information is never shown to a finder."}
                  </small>
                </label>

                <label>
                  <span>
                    {ka ? "კოდური სიტყვა" : "Code word"} *
                  </span>

                  <input
                    type="password"
                    value={codeWord}
                    onChange={(e) =>
                      setCodeWord(e.target.value)
                    }
                    autoComplete="off"
                    required
                  />

                  <small>
                    {ka
                      ? "დაიმახსოვრეთ ეს სიტყვა. მომავალში გამოიყენება დამატებითი იდენტიფიკაციისთვის."
                      : "Remember this word. It may be used for additional identity verification."}
                  </small>
                </label>
              </div>

              <div className="twoColumns">
                <label>
                  <span>{ka ? "პაროლი" : "Password"} *</span>

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    autoComplete="new-password"
                    required
                  />
                </label>

                <label>
                  <span>
                    {ka
                      ? "გაიმეორეთ პაროლი"
                      : "Confirm password"}{" "}
                    *
                  </span>

                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    autoComplete="new-password"
                    required
                  />
                </label>
              </div>

              <button
                type="button"
                className="showPassword"
                onClick={() =>
                  setShowPassword((current) => !current)
                }
              >
                {showPassword
                  ? ka
                    ? "🙈 პაროლების დამალვა"
                    : "🙈 Hide passwords"
                  : ka
                  ? "👁 პაროლების ჩვენება"
                  : "👁 Show passwords"}
              </button>

              <div className="passwordNote">
                {ka
                  ? "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს."
                  : "Password must contain at least 8 characters."}
              </div>

              {error && (
                <div className="errorBox">
                  <strong>!</strong>
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="successBox">
                  ✓ {success}
                </div>
              )}

              <button
                type="submit"
                className="submitButton"
                disabled={loading}
              >
                {loading
                  ? ka
                    ? "ანგარიში იქმნება..."
                    : "Creating account..."
                  : ka
                  ? "ანგარიშის შექმნა"
                  : "Create Owner Account"}

                {!loading && <span>→</span>}
              </button>
            </form>

            <div className="loginLink">
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
        </div>
      </section>

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
              circle at 8% 10%,
              rgba(20, 101, 232, 0.08),
              transparent 28%
            ),
            radial-gradient(
              circle at 94% 8%,
              rgba(118, 85, 247, 0.08),
              transparent 28%
            ),
            #f7f9fc;
        }

        .header {
          width: calc(100% - 36px);
          max-width: 1100px;
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
          max-width: 1050px;
          margin: auto;
          padding: 55px 0 90px;
        }

        .intro {
          max-width: 760px;
          margin-bottom: 35px;
        }

        .eyebrow {
          color: #7655f7;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1.6px;
        }

        .intro h1 {
          margin: 9px 0 13px;
          font-size: clamp(40px, 5vw, 54px);
          line-height: 1.05;
          letter-spacing: -2px;
        }

        .intro p {
          margin: 0;
          color: #667085;
          font-size: 15px;
          line-height: 1.7;
        }

        .layout {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 28px;
          align-items: start;
        }

        .infoPanel {
          display: flex;
          flex-direction: column;
          gap: 13px;
          position: sticky;
          top: 20px;
        }

        .infoCard {
          padding: 17px;
          display: flex;
          gap: 12px;
          border: 1px solid #e4e7ec;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.9);
        }

        .number {
          width: 31px;
          height: 31px;
          flex: 0 0 31px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: #eef4ff;
          color: #1465e8;
          font-size: 9px;
          font-weight: 900;
        }

        .infoCard strong {
          font-size: 12px;
        }

        .infoCard p {
          margin: 5px 0 0;
          color: #667085;
          font-size: 10px;
          line-height: 1.55;
        }

        .card {
          padding: 31px;
          border: 1px solid #e4e7ec;
          border-radius: 23px;
          background: white;
          box-shadow: 0 18px 50px rgba(16, 24, 40, 0.07);
        }

        .cardTitle span {
          color: #7655f7;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .cardTitle h2 {
          margin: 5px 0 7px;
          font-size: 27px;
        }

        .cardTitle p {
          margin: 0 0 25px;
          color: #667085;
          font-size: 12px;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 17px;
        }

        .twoColumns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 13px;
        }

        label > span {
          display: block;
          margin-bottom: 7px;
          color: #475467;
          font-size: 13px;
          font-weight: 800;
        }

        label small {
          display: block;
          margin-top: 5px;
          color: #98a2b3;
          font-size: 10px;
          line-height: 1.5;
        }

        input {
          width: 100%;
          height: 50px;
          padding: 0 13px;
          border: 1px solid #d0d5dd;
          border-radius: 10px;
          outline: none;
          background: white;
        }

        input:focus {
          border-color: #84adff;
          box-shadow:
            0 0 0 3px rgba(20, 101, 232, 0.08);
        }

        .securitySection {
          margin: 5px 0;
          padding: 18px;
          border: 1px solid #dbe7ff;
          border-radius: 15px;
          background: #f7faff;
        }

        .securityTitle {
          margin-bottom: 15px;
          display: flex;
          gap: 11px;
          align-items: flex-start;
        }

        .securityIcon {
          width: 36px;
          height: 36px;
          flex: 0 0 36px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: white;
        }

        .securityTitle strong {
          font-size: 12px;
        }

        .securityTitle p {
          margin: 4px 0 0;
          color: #667085;
          font-size: 10px;
          line-height: 1.5;
        }

        .securitySection label {
          display: block;
          margin-top: 14px;
        }

        .showPassword {
          width: fit-content;
          padding: 0;
          border: 0;
          background: transparent;
          color: #1465e8;
          font-size: 11px;
          font-weight: 900;
          cursor: pointer;
        }

        .passwordNote {
          margin-top: -7px;
          color: #98a2b3;
          font-size: 10px;
        }

        .errorBox {
          padding: 12px;
          display: flex;
          gap: 8px;
          align-items: center;
          border: 1px solid #fecdca;
          border-radius: 10px;
          background: #fff1f0;
          color: #b42318;
          font-size: 11px;
        }

        .errorBox strong {
          width: 20px;
          height: 20px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #d92d20;
          color: white;
          font-size: 10px;
        }

        .successBox {
          padding: 12px;
          border: 1px solid #abefc6;
          border-radius: 10px;
          background: #ecfdf3;
          color: #027a48;
          font-size: 11px;
          font-weight: 800;
        }

        .submitButton {
          width: 100%;
          min-height: 52px;
          margin-top: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border: 0;
          border-radius: 11px;
          background: linear-gradient(
            135deg,
            #1465e8,
            #7655f7
          );
          color: white;
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
        }

        .submitButton:disabled {
          opacity: 0.65;
        }

        .loginLink {
          margin-top: 22px;
          padding-top: 18px;
          display: flex;
          justify-content: center;
          gap: 7px;
          border-top: 1px solid #eaecf0;
          color: #667085;
          font-size: 11px;
        }

        .loginLink a {
          color: #1465e8;
          font-weight: 900;
          text-decoration: none;
        }

        @media (max-width: 850px) {
          .layout {
            grid-template-columns: 1fr;
          }

          .infoPanel {
            position: static;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 650px) {
          .infoPanel,
          .twoColumns {
            grid-template-columns: 1fr;
          }

          .card {
            padding: 22px;
          }

          .intro h1 {
            font-size: 37px;
          }
        }
      `}</style>
    </main>
  );
}
