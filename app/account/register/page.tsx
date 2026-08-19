"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

export default function AccountRegisterPage() {
  const [lang, setLang] = useState<Lang>("ka");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const ka = lang === "ka";

  async function handleRegister(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password
    ) {
      setError(
        ka
          ? "გთხოვთ შეავსოთ ყველა სავალდებულო ველი."
          : "Please complete all required fields."
      );

      return;
    }

    if (password.length < 6) {
      setError(
        ka
          ? "პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს."
          : "Password must contain at least 6 characters."
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
        error: signUpError,
      } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (signUpError) {
        throw new Error(
          signUpError.message
        );
      }

      const user = data.user;

      if (!user) {
        throw new Error(
          ka
            ? "ანგარიშის შექმნა ვერ მოხერხდა."
            : "Could not create account."
        );
      }

      const {
        error: ownerError,
      } = await supabase
        .from("owner_accounts")
        .insert({
          user_id: user.id,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          phone:
            phone.trim() || null,
        });

      if (ownerError) {
        throw new Error(
          ownerError.message
        );
      }

      setSuccess(true);

      window.setTimeout(() => {
        window.location.href =
          "/account";
      }, 900);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : String(err);

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <header className="header">
        <a href="/" className="brand">
          <div className="logo">
            QR
          </div>

          <div>
            <strong>
              QR RETURN
            </strong>

            <small>
              CREATE ACCOUNT
            </small>
          </div>
        </a>

        <div className="languages">
          <button
            type="button"
            className={
              ka ? "active" : ""
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
              !ka ? "active" : ""
            }
            onClick={() =>
              setLang("en")
            }
          >
            ENG
          </button>
        </div>
      </header>

      <section className="wrap">
        <div className="intro">
          <div className="eyebrow">
            QR RETURN
          </div>

          <h1>
            {ka
              ? "შექმენით ანგარიში"
              : "Create your account"}
          </h1>

          <p>
            {ka
              ? "ანგარიშის შექმნის შემდეგ შეძლებთ რამდენიმე დამოუკიდებელი QR პროფილის დამატებას და მართვას ერთი ადგილიდან."
              : "After creating your account, you can add and manage multiple independent QR profiles from one place."}
          </p>
        </div>

        <form
          className="form"
          onSubmit={handleRegister}
        >
          <div className="sectionTitle">
            <span>01</span>

            <div>
              <strong>
                {ka
                  ? "პირადი ინფორმაცია"
                  : "Personal information"}
              </strong>

              <small>
                {ka
                  ? "ეს არის თქვენი მთავარი QR RETURN ანგარიში."
                  : "This is your main QR RETURN account."}
              </small>
            </div>
          </div>

          <div className="grid two">
            <Field
              label={
                ka
                  ? "სახელი *"
                  : "First name *"
              }
            >
              <input
                value={firstName}
                onChange={(event) =>
                  setFirstName(
                    event.target.value
                  )
                }
                autoComplete="given-name"
              />
            </Field>

            <Field
              label={
                ka
                  ? "გვარი *"
                  : "Last name *"
              }
            >
              <input
                value={lastName}
                onChange={(event) =>
                  setLastName(
                    event.target.value
                  )
                }
                autoComplete="family-name"
              />
            </Field>
          </div>

          <div className="grid two">
            <Field label="Email *">
              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                autoComplete="email"
              />
            </Field>

            <Field
              label={
                ka
                  ? "ტელეფონი"
                  : "Phone"
              }
            >
              <input
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(
                    event.target.value
                  )
                }
                autoComplete="tel"
              />
            </Field>
          </div>

          <div className="sectionTitle second">
            <span>02</span>

            <div>
              <strong>
                {ka
                  ? "პაროლი"
                  : "Password"}
              </strong>

              <small>
                {ka
                  ? "ამ მონაცემებით შეხვალთ თქვენს ანგარიშში."
                  : "Use these credentials to sign in to your account."}
              </small>
            </div>
          </div>

          <div className="grid two">
            <Field
              label={
                ka
                  ? "პაროლი *"
                  : "Password *"
              }
            >
              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                autoComplete="new-password"
              />
            </Field>

            <Field
              label={
                ka
                  ? "გაიმეორეთ პაროლი *"
                  : "Confirm password *"
              }
            >
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                autoComplete="new-password"
              />
            </Field>
          </div>

          <div className="nextInfo">
            <div className="plus">
              +
            </div>

            <div>
              <strong>
                {ka
                  ? "შემდეგ რას გააკეთებთ?"
                  : "What happens next?"}
              </strong>

              <p>
                {ka
                  ? "ანგარიშის შექმნის შემდეგ აირჩევთ რომელი QR პროფილის დამატება გსურთ — ძაღლი, კატა, ჩემოდანი, ჩანთა, საფულე, გასაღები ან Emergency."
                  : "After creating your account, choose which QR profile to add — Dog, Cat, Suitcase, Bag, Wallet, Keys or Emergency."}
              </p>
            </div>
          </div>

          {error && (
            <div className="error">
              ⚠ {error}
            </div>
          )}

          {success && (
            <div className="success">
              ✓{" "}
              {ka
                ? "ანგარიში წარმატებით შეიქმნა."
                : "Account created successfully."}
            </div>
          )}

          <button
            type="submit"
            className="submit"
            disabled={loading}
          >
            {loading
              ? ka
                ? "იქმნება..."
                : "Creating..."
              : ka
              ? "ანგარიშის შექმნა →"
              : "Create account →"}
          </button>

          <p className="login">
            {ka
              ? "უკვე გაქვთ ანგარიში?"
              : "Already have an account?"}{" "}
            <a href="/login">
              {ka
                ? "შესვლა"
                : "Sign in"}
            </a>
          </p>
        </form>
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
          background: #f5f7fb;
        }

        button,
        input {
          font: inherit;
        }

        .page {
          min-height: 100vh;

          color: #101828;

          font-family:
            Inter,
            Arial,
            sans-serif;

          background:
            radial-gradient(
              circle at 90% 5%,
              rgba(
                118,
                85,
                247,
                0.1
              ),
              transparent 26%
            ),
            #f5f7fb;
        }

        .header {
          width:
            calc(100% - 32px);

          max-width: 1050px;

          min-height: 78px;

          margin: auto;

          display: flex;

          align-items: center;

          justify-content:
            space-between;

          border-bottom:
            1px solid #e4e7ec;
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

          background:
            linear-gradient(
              135deg,
              #1465e8,
              #7655f7
            );

          color: white;

          font-size: 12px;

          font-weight: 900;
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

          letter-spacing: 1.8px;
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

        .wrap {
          width:
            calc(100% - 32px);

          max-width: 820px;

          margin: auto;

          padding: 55px 0 90px;
        }

        .intro {
          max-width: 670px;
        }

        .eyebrow {
          color: #7655f7;

          font-size: 9px;

          font-weight: 900;

          letter-spacing: 2px;
        }

        .intro h1 {
          margin: 10px 0 9px;

          font-size:
            clamp(
              38px,
              6vw,
              56px
            );

          line-height: 1;

          letter-spacing: -2.5px;
        }

        .intro p {
          margin: 0;

          color: #667085;

          font-size: 14px;

          line-height: 1.65;
        }

        .form {
          margin-top: 32px;

          padding: 28px;

          border:
            1px solid #e4e7ec;

          border-radius: 22px;

          background: white;

          box-shadow:
            0 16px 45px
            rgba(
              16,
              24,
              40,
              0.06
            );
        }

        .sectionTitle {
          display: flex;

          align-items: center;

          gap: 11px;

          margin-bottom: 17px;
        }

        .sectionTitle.second {
          margin-top: 30px;
        }

        .sectionTitle > span {
          width: 35px;

          height: 35px;

          flex: 0 0 35px;

          display: grid;

          place-items: center;

          border-radius: 10px;

          background: #eef4ff;

          color: #1465e8;

          font-size: 9px;

          font-weight: 900;
        }

        .sectionTitle strong,
        .sectionTitle small {
          display: block;
        }

        .sectionTitle strong {
          color: #344054;

          font-size: 14px;
        }

        .sectionTitle small {
          margin-top: 3px;

          color: #98a2b3;

          font-size: 9px;
        }

        .grid {
          display: grid;

          gap: 13px;
        }

        .grid.two {
          grid-template-columns:
            repeat(2, 1fr);

          margin-bottom: 13px;
        }

        .field {
          min-width: 0;
        }

        .field label {
          margin-bottom: 6px;

          display: block;

          color: #475467;

          font-size: 10px;

          font-weight: 800;
        }

        .field input {
          width: 100%;

          min-height: 46px;

          padding: 0 12px;

          border:
            1px solid #d0d5dd;

          border-radius: 10px;

          outline: none;

          color: #101828;

          font-size: 13px;
        }

        .field input:focus {
          border-color: #1465e8;

          box-shadow:
            0 0 0 3px
            rgba(
              20,
              101,
              232,
              0.08
            );
        }

        .nextInfo {
          margin-top: 28px;

          padding: 15px;

          display: flex;

          align-items:
            flex-start;

          gap: 12px;

          border:
            1px solid #d9d6fe;

          border-radius: 14px;

          background:
            linear-gradient(
              135deg,
              #f9f8ff,
              #f4f7ff
            );
        }

        .plus {
          width: 37px;

          height: 37px;

          flex: 0 0 37px;

          display: grid;

          place-items: center;

          border-radius: 10px;

          background:
            linear-gradient(
              135deg,
              #1465e8,
              #7655f7
            );

          color: white;

          font-size: 23px;
        }

        .nextInfo strong {
          color: #344054;

          font-size: 11px;
        }

        .nextInfo p {
          margin: 5px 0 0;

          color: #667085;

          font-size: 10px;

          line-height: 1.5;
        }

        .error,
        .success {
          margin-top: 15px;

          padding: 11px;

          border-radius: 10px;

          font-size: 10px;
        }

        .error {
          border:
            1px solid #fecdca;

          background: #fff1f0;

          color: #b42318;
        }

        .success {
          border:
            1px solid #abefc6;

          background: #ecfdf3;

          color: #067647;
        }

        .submit {
          width: 100%;

          min-height: 49px;

          margin-top: 18px;

          border: 0;

          border-radius: 11px;

          background:
            linear-gradient(
              135deg,
              #1465e8,
              #6554e8
            );

          color: white;

          font-size: 12px;

          font-weight: 900;

          cursor: pointer;
        }

        .submit:disabled {
          opacity: 0.55;

          cursor:
            not-allowed;
        }

        .login {
          margin: 15px 0 0;

          color: #98a2b3;

          font-size: 10px;

          text-align: center;
        }

        .login a {
          color: #1465e8;

          font-weight: 900;

          text-decoration: none;
        }

        @media (
          max-width: 650px
        ) {
          .wrap {
            padding-top: 38px;
          }

          .form {
            padding: 20px 16px;
          }

          .grid.two {
            grid-template-columns:
              1fr;
          }
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}
