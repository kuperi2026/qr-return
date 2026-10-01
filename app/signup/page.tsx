"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY;

  if (!url || !key) {
    throw new Error("Supabase კავშირი ვერ მოიძებნა.");
  }

  return createClient(url, key);
}

function getSafeNextPath() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("next");

  if (
    requested?.startsWith("/") &&
    !requested.startsWith("//")
  ) {
    return requested;
  }

  return params.get("source") === "app" ? "/app/profiles" : "/register";
}

export default function SignupPage() {
  const [lang, setLang] = useState<"ka" | "en">("ka");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [codeWord, setCodeWord] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [appMode, setAppMode] = useState(false);

  useEffect(() => {
    const isApp = new URLSearchParams(window.location.search).get("source") === "app";
    setAppMode(isApp);
    if (isApp) window.localStorage.setItem("kompasi-app-mode", "1");
    const saved = window.localStorage.getItem("kompasi-language");
    if (saved === "ka" || saved === "en") setLang(saved);
  }, []);

  const ka = lang === "ka";
  const chooseLanguage = (next: "ka" | "en") => {
    setLang(next);
    window.localStorage.setItem("kompasi-language", next);
  };

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setErrorMessage("");

    if (!firstName.trim()) {
      setErrorMessage(ka ? "გთხოვთ შეიყვანოთ სახელი." : "Please enter your first name.");
      return;
    }

    if (!lastName.trim()) {
      setErrorMessage(ka ? "გთხოვთ შეიყვანოთ გვარი." : "Please enter your last name.");
      return;
    }

    if (!email.trim()) {
      setErrorMessage(ka ? "გთხოვთ შეიყვანოთ ელფოსტა." : "Please enter your email.");
      return;
    }

    if (!phone.trim()) {
      setErrorMessage(ka ? "გთხოვთ შეიყვანოთ ტელეფონის ნომერი." : "Please enter your phone number.");
      return;
    }

    if (!codeWord.trim()) {
      setErrorMessage(ka ? "გთხოვთ შეიყვანოთ კოდური სიტყვა." : "Please enter a security word.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage(
        ka ? "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს." : "Password must contain at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(
        ka ? "პაროლები ერთმანეთს არ ემთხვევა." : "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    try {
      const supabase = getSupabase();

      const cleanEmail =
        email.trim().toLowerCase();

      const { data, error } =
        await supabase.auth.signUp({
          email: cleanEmail,
          password,

          options: {
            data: {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              phone: phone.trim(),
              code_word: codeWord.trim(),
              language: lang,
            },
          },
        });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error(
          ka ? "ანგარიშის შექმნა ვერ მოხერხდა." : "We could not create your account."
        );
      }

      /*
       * OWNER ACCOUNT
       */

      try {
        const { error: ownerError } =
          await supabase
            .from("owner_accounts")
            .upsert(
              {
                id: data.user.id,
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                email: cleanEmail,
                phone: phone.trim(),
              },
              {
                onConflict: "id",
              }
            );

        if (ownerError) {
          console.error(
            "Owner save:",
            ownerError
          );
        }
      } catch (ownerError) {
        console.error(
          "Owner save:",
          ownerError
        );
      }

      /*
       * მთავარი ცვლილება:
       *
       * თუ მომხმარებელი უკვე შესულია,
       * პირდაპირ 6 პროდუქტის არჩევაზე გადავა.
       */

      if (data.session) {
        window.location.assign(getSafeNextPath());
        return;
      }

      /*
       * თუ Supabase Email Confirmation ჩართულია,
       * ჯერ Login-ზე გადავა.
       *
       * registered=1 პარამეტრით შეგვიძლია
       * Login-ზე შესაბამისი შეტყობინება ვაჩვენოთ.
       */

      window.location.assign(
        `/login?registered=1&email=${encodeURIComponent(
          cleanEmail
        )}&next=${encodeURIComponent(getSafeNextPath())}${appMode ? "&source=app" : ""}`
      );
    } catch (error) {
      console.error(
        "Signup error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : ka ? "ანგარიშის შექმნა ვერ მოხერხდა." : "We could not create your account.";

      const lower =
        message.toLowerCase();

      if (
        lower.includes(
          "already registered"
        ) ||
        lower.includes(
          "already been registered"
        )
      ) {
        setErrorMessage(
          ka ? "ამ ელფოსტით ანგარიში უკვე არსებობს." : "An account with this email already exists."
        );
      } else {
        setErrorMessage(message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <main className={`page ${appMode ? "appAuth" : ""}`}>
        <div className="decor decor1">
          QR
        </div>

        <div className="decor decor2">
          QR
        </div>

        <div className="decor decor3">
          QR
        </div>

        <header className="header">
          <a href={appMode ? "/app" : "/"} className="brand">
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

          <a
            href={appMode ? "/login?source=app" : "/login"}
            className="loginButton"
          >
            {ka ? "შესვლა" : "Sign in"}
          </a>
        </header>

        <div className="layout">
          {/* LEFT MESSAGE */}

          <section className="intro">
            <div className="introCard">
              <div className="introIcon">
                QR
              </div>

              <h1>
                {ka ? "ყველაფერი იწყება" : "Everything starts"}
                <br />
                {ka ? "თქვენი ანგარიშით." : "with your account."}
              </h1>

              <div className="line" />

              <p>
                {ka ? "რეგისტრაციის შემდეგ შეძლებთ " : "After registration, you can add QR profiles for "}
                <strong>
                  {ka ? "ძაღლის, კატის, გასაღების, საფულის, ჩანთისა და ჩემოდნის" : "dogs, cats, keys, wallets, bags and suitcases"}
                </strong>{" "}
                {ka ? "QR პროფილების დამატებას." : "."}
              </p>
            </div>
          </section>

          {/* FORM */}

          <section className="card">
            <div className="signupLanguages"><button type="button" className={ka ? "active" : ""} onClick={() => chooseLanguage("ka")}>ქართული</button><button type="button" className={!ka ? "active" : ""} onClick={() => chooseLanguage("en")}>English</button></div>
            <div className="cardHeader">
              <span>
                CREATE ACCOUNT
              </span>

              <h2>
                {ka ? "მფლობელის რეგისტრაცია" : "Owner registration"}
              </h2>

              <p>
                {ka ? "შეიყვანეთ თქვენი ძირითადი ინფორმაცია." : "Enter your basic information."}
              </p>
            </div>

            {errorMessage && (
              <div
                className="error"
                role="alert"
              >
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid">
                <div className="field">
                  <label htmlFor="firstName">
                    {ka ? "სახელი" : "First name"} <b>*</b>
                  </label>

                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) =>
                      setFirstName(
                        e.target.value
                      )
                    }
                    autoComplete="given-name"
                  />
                </div>

                <div className="field">
                  <label htmlFor="lastName">
                    {ka ? "გვარი" : "Last name"} <b>*</b>
                  </label>

                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) =>
                      setLastName(
                        e.target.value
                      )
                    }
                    autoComplete="family-name"
                  />
                </div>

                <div className="field">
                  <label htmlFor="email">
                    {ka ? "ელფოსტა" : "Email"} <b>*</b>
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    autoComplete="email"
                  />
                </div>

                <div className="field">
                  <label htmlFor="phone">
                    {ka ? "ტელეფონის ნომერი" : "Phone number"} <b>*</b>
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) =>
                      setPhone(
                        e.target.value
                      )
                    }
                    autoComplete="tel"
                  />
                </div>

                <div className="field full">
                  <label htmlFor="codeWord">
                    {ka ? "კოდური სიტყვა" : "Security word"} <b>*</b>
                  </label>

                  <input
                    id="codeWord"
                    type="text"
                    value={codeWord}
                    onChange={(e) =>
                      setCodeWord(
                        e.target.value
                      )
                    }
                    autoComplete="off"
                  />

                  <span className="help">
                    {ka ? "გამოიყენება თქვენი ანგარიშის იდენტიფიკაციისთვის." : "Used to verify your account."}
                  </span>
                </div>

                <div className="field">
                  <label htmlFor="password">
                    {ka ? "პაროლი" : "Password"} <b>*</b>
                  </label>

                  <div className="passwordField">
                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (value) => !value
                        )
                      }
                    >
                      {showPassword
                        ? (ka ? "დამალვა" : "Hide")
                        : (ka ? "ნახვა" : "Show")}
                    </button>
                  </div>

                  <span className="help">
                    {ka ? "მინიმუმ 8 სიმბოლო" : "At least 8 characters"}
                  </span>
                </div>

                <div className="field">
                  <label htmlFor="confirmPassword">
                    {ka ? "გაიმეორეთ პაროლი" : "Confirm password"} <b>*</b>
                  </label>

                  <div className="passwordField">
                    <input
                      id="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (value) => !value
                        )
                      }
                    >
                      {showConfirmPassword
                        ? (ka ? "დამალვა" : "Hide")
                        : (ka ? "ნახვა" : "Show")}
                    </button>
                  </div>
                </div>
              </div>

              <button
                className="submit"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? (ka ? "ანგარიში იქმნება..." : "Creating account...")
                  : (ka ? "ანგარიშის შექმნა →" : "Create account →")}
              </button>
            </form>

            <div className="bottom">
              {ka ? "უკვე გაქვთ ანგარიში?" : "Already have an account?"}

              <a href={appMode ? "/login?source=app" : "/login"}>
                {ka ? "შესვლა" : "Sign in"}
              </a>
            </div>
          </section>
        </div>
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
            0 24px 30px;

          background: #0A4C8A;

          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        /* BACKGROUND */

        .decor {
          position: fixed;

          pointer-events: none;
          user-select: none;

          color:
            rgba(255, 255, 255, 0.035);

          font-size: 140px;
          font-weight: 950;
        }

        .decor1 {
          top: 12%;
          left: 3%;

          transform: rotate(-15deg);
        }

        .decor2 {
          top: 15%;
          right: 4%;

          transform: rotate(13deg);
        }

        .decor3 {
          bottom: 2%;
          left: 30%;

          transform: rotate(8deg);
        }

        /* HEADER */

        .header {
          position: relative;
          z-index: 5;

          width: 100%;
          max-width: 1120px;
          height: 68px;

          margin: auto;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border-bottom:
            1px solid
            rgba(255, 255, 255, 0.18);
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

          background: #ffffff;
          color: #063B72;

          font-size: 12px;
          font-weight: 950;
        }

        .brand strong,
        .brand small {
          display: block;
        }

        .brand strong {
          color: #ffffff;

          font-size: 17px;
          font-weight: 900;
        }

        .brand small {
          margin-top: 2px;

          color:
            rgba(255, 255, 255, 0.67);

          font-size: 9px;
          font-weight: 800;

          letter-spacing: 0.7px;
        }

        .loginButton {
          min-width: 82px;
          height: 39px;

          display: flex;
          align-items: center;
          justify-content: center;

          border:
            1px solid
            rgba(255, 255, 255, 0.35);

          border-radius: 9px;

          color: #ffffff;

          font-size: 13px;
          font-weight: 850;

          text-decoration: none;
        }

        /* LAYOUT */

        .layout {
          position: relative;
          z-index: 2;

          width: 100%;
          max-width: 1080px;

          margin: 0 auto;

          padding-top: 18px;

          display: grid;

          grid-template-columns:
            290px
            680px;

          justify-content: center;
          align-items: center;

          gap: 42px;
        }

        /* LEFT */

        .introCard {
          position: relative;

          width: 100%;

          padding: 23px 21px;

          overflow: hidden;

          border:
            1px solid
            rgba(255, 255, 255, 0.2);

          border-radius: 17px;

          background: rgba(255, 255, 255, 0.1);

          box-shadow:
            0 18px 42px
            rgba(0, 25, 85, 0.14);
        }

        .introIcon {
          width: 42px;
          height: 42px;

          margin-bottom: 17px;

          display: grid;
          place-items: center;

          border:
            1px solid
            rgba(255, 255, 255, 0.25);

          border-radius: 11px;

          background:
            rgba(255, 255, 255, 0.12);

          color: #ffffff;

          font-size: 11px;
          font-weight: 950;
        }

        .introCard h1 {
          margin: 0;

          color: #ffffff;

          font-size: 24px;
          font-weight: 900;

          line-height: 1.22;
          letter-spacing: -0.4px;
        }

        .line {
          width: 36px;
          height: 3px;

          margin: 15px 0;

          border-radius: 999px;

          background:
            rgba(255, 255, 255, 0.9);
        }

        .introCard p {
          margin: 0;

          color:
            rgba(255, 255, 255, 0.78);

          font-size: 13px;
          line-height: 1.62;
        }

        .introCard p strong {
          color: #ffffff;
          font-weight: 850;
        }

        /* CARD */

        .card {
          width: 100%;
          max-width: 680px;

          padding:
            22px 25px 20px;

          border:
            1px solid
            rgba(255, 255, 255, 0.7);

          border-radius: 17px;

          background: #ffffff;

          box-shadow:
            0 20px 48px
            rgba(0, 25, 80, 0.24);
        }

        .signupLanguages{margin:0 0 12px auto;padding:3px;width:max-content;display:flex;border:1px solid #d7e4ee;border-radius:11px;background:#eef5fa}.signupLanguages button{height:30px;padding:0 10px;border:0;border-radius:8px;background:transparent;color:#72879a;font:inherit;font-size:9px;font-weight:900;cursor:pointer}.signupLanguages button.active{background:#0a65b5;color:#fff;box-shadow:0 5px 12px rgba(10,101,181,.2)}

        .cardHeader > span {
          color: #063B72;

          font-size: 10px;
          font-weight: 900;

          letter-spacing: 1px;
        }

        .cardHeader h2 {
          margin: 4px 0 0;

          color: #263e57;

          font-size: 23px;
          line-height: 1.25;
        }

        .cardHeader p {
          margin: 5px 0 0;

          color: #4f6478;

          font-size: 15px;
          font-weight: 600;
          line-height: 1.5;
        }

        /* FORM */

        .grid {
          margin-top: 18px;

          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          column-gap: 17px;
          row-gap: 14px;
        }

        .field {
          min-width: 0;
        }

        .field.full {
          grid-column:
            1 / -1;
        }

        .field label {
          display: block;

          margin:
            0 0 7px 2px;

          color: #42576b;

          font-size: 13px;
          font-weight: 850;
        }

        .field label b {
          color: #063B72;
        }

        /*
         * INPUT SIZE REMAINS 56PX
         */

        .field input,
        .passwordField input {
          display: block !important;

          width: 100% !important;

          height: 56px !important;
          min-height: 56px !important;
          max-height: 56px !important;

          margin: 0 !important;

          padding:
            0 16px !important;

          border:
            1.5px solid
            #d5e0ea !important;

          border-radius:
            11px !important;

          background:
            #fbfdff !important;

          color:
            #263f59 !important;

          font-family:
            inherit !important;

          font-size:
            15px !important;

          outline:
            none !important;

          box-sizing:
            border-box !important;
        }

        .field input:focus,
        .passwordField input:focus {
          border-color:
            #063B72 !important;

          background:
            #ffffff !important;

          box-shadow:
            0 0 0 4px
            rgba(
              6,
              59,
              114,
              0.09
            ) !important;
        }

        .help {
          display: block;

          margin:
            5px 0 0 2px;

          color: #4f6478;

          font-size: 13px;
          font-weight: 600;
          line-height: 1.4;
        }

        /* PASSWORD */

        .passwordField {
          position: relative;

          width: 100%;
        }

        .passwordField input {
          padding-right:
            83px !important;
        }

        .passwordField button {
          position: absolute;

          top: 50%;
          right: 8px;

          transform:
            translateY(-50%);

          min-width: 61px;
          height: 34px;

          padding: 0 8px;

          border: 0;
          border-radius: 8px;

          background: #edf4ff;
          color: #063B72;

          font-family: inherit;

          font-size: 10px;
          font-weight: 850;

          cursor: pointer;
        }

        /* ERROR */

        .error {
          margin-top: 13px;

          padding:
            10px 12px;

          border:
            1px solid
            #f0ced2;

          border-radius: 9px;

          background: #fff3f4;
          color: #a3424a;

          font-size: 12px;
        }

        /* SUBMIT */

        .submit {
          width: 100%;
          height: 49px;

          margin-top: 18px;

          border: 0;
          border-radius: 10px;

          background: #063B72;
          color: #ffffff;

          font-family: inherit;

          font-size: 13px;
          font-weight: 900;

          cursor: pointer;
        }

        .submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        /* BOTTOM */

        .bottom {
          margin-top: 13px;

          padding-top: 13px;

          display: flex;
          justify-content: center;

          gap: 5px;

          border-top:
            1px solid #e7edf3;

          color: #7c8996;

          font-size: 12px;
        }

        .bottom a {
          color: #063B72;

          font-weight: 850;
          text-decoration: none;
        }

        .page.appAuth {
          padding: 0 12px 30px;
          overflow-x: hidden;
          background:
            radial-gradient(circle at 18% 3%, rgba(83, 185, 255, .45), transparent 29%),
            linear-gradient(165deg, #0b579b 0%, #073f78 50%, #052d59 100%);
        }

        .appAuth .decor { display: none; }
        .appAuth .header { width: min(480px, 100%); height: 56px; }
        .appAuth .brandIcon { width: 38px; height: 38px; border-radius: 12px; }
        .appAuth .brand strong { font-size: 15px; }
        .appAuth .loginButton { min-width: 72px; height: 37px; border-radius: 11px; font-size: 11px; }
        .appAuth .layout { width: min(480px, 100%); padding-top: 8px; display: block; }
        .appAuth .intro { display: none; }
        .appAuth .card { width: 100%; max-width: 480px; padding: 15px 14px 13px; border: 1px solid rgba(255,255,255,.82); border-radius: 18px; box-shadow: 0 18px 42px rgba(1,24,58,.28); }
        .appAuth .cardHeader { margin-bottom: 8px; text-align: center; }
        .appAuth .cardHeader span, .appAuth .cardHeader p { display: none; }
        .appAuth .cardHeader h2 { font-size: 19px; }
        .appAuth .grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 9px 10px; }
        .appAuth .field.full { grid-column: auto; }
        .appAuth .field label { margin-bottom: 4px; font-size: 11px; }
        .appAuth .field input, .appAuth .passwordField input { height: 44px !important; min-height: 44px !important; max-height: 44px !important; padding:0 11px!important; border-radius: 10px; font-size: 14px !important; }
        .appAuth .help { margin-top: 3px; font-size: 10px; }
        .appAuth .submit { height: 45px; margin-top: 11px; border-radius: 11px; background: linear-gradient(120deg,#0b74e5,#13a66b); box-shadow: 0 9px 20px rgba(4,70,117,.24); }
        .appAuth .bottom { margin-top:9px;padding-top:9px;font-size: 11px; }

        /* MOBILE */

        @media (max-width: 850px) {
          .layout {
            max-width: 680px;

            grid-template-columns:
              1fr;

            gap: 20px;
          }

          .introCard {
            max-width: 480px;

            margin: auto;
          }

          .card {
            margin: auto;
          }
        }

        @media (max-width: 650px) {
          .page {
            padding:
              0 13px 24px;
          }

          .brand small {
            display: none;
          }

          .layout {
            padding-top: 18px;
          }

          .card {
            padding:
              21px 18px;

            border-radius: 16px;
          }

          .grid {
            grid-template-columns:
              1fr;

            row-gap: 15px;
          }

          .field.full {
            grid-column: auto;
          }

          .field input,
          .passwordField input {
            height:
              54px !important;

            min-height:
              54px !important;

            max-height:
              54px !important;

            font-size:
              16px !important;
          }

          .bottom {
            flex-wrap: wrap;
          }
          .page.appAuth .layout{padding-top:7px}
          .page.appAuth .card{padding:13px 11px}
          .page.appAuth .grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
          .page.appAuth .field input,.page.appAuth .passwordField input{height:43px!important;min-height:43px!important;max-height:43px!important;font-size:14px!important}
        }
      `}</style>
    </>
  );
}
