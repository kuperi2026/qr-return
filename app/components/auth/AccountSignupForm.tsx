"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const initialForm: FormState = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function AccountSignupForm() {
  const [form, setForm] = useState<FormState>(initialForm);

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  function updateField(
    field: keyof FormState,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const phone = form.phone.trim();
    const email = form.email
      .trim()
      .toLowerCase();

    if (
      !firstName ||
      !lastName ||
      !phone ||
      !email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setErrorMessage(
        "გთხოვთ შეავსოთ ყველა სავალდებულო ველი."
      );

      return;
    }

    if (
      !email.includes("@") ||
      !email.includes(".")
    ) {
      setErrorMessage(
        "გთხოვთ მიუთითოთ სწორი ელფოსტა."
      );

      return;
    }

    const phoneDigits =
      phone.replace(/\D/g, "");

    if (phoneDigits.length < 7) {
      setErrorMessage(
        "გთხოვთ მიუთითოთ სწორი ტელეფონის ნომერი."
      );

      return;
    }

    if (form.password.length < 8) {
      setErrorMessage(
        "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს."
      );

      return;
    }

    if (
      form.password !==
      form.confirmPassword
    ) {
      setErrorMessage(
        "პაროლები ერთმანეთს არ ემთხვევა."
      );

      return;
    }

    try {
      setLoading(true);

      const {
        data,
        error,
      } = await supabase.auth.signUp({
        email,
        password: form.password,

        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone,
          },

          emailRedirectTo:
            `${window.location.origin}/login`,
        },
      });

      if (error) {
        const message =
          error.message.toLowerCase();

        if (
          message.includes(
            "already registered"
          ) ||
          message.includes(
            "already exists"
          ) ||
          message.includes(
            "user already registered"
          )
        ) {
          setErrorMessage(
            "ამ ელფოსტით ანგარიში უკვე არსებობს. გამოიყენეთ შესვლის გვერდი."
          );
        } else {
          setErrorMessage(
            error.message
          );
        }

        return;
      }

      if (!data.user) {
        setErrorMessage(
          "ანგარიშის შექმნა ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან."
        );

        return;
      }

      setSuccessMessage(
        "ანგარიში წარმატებით შეიქმნა. შეამოწმეთ ელფოსტა ანგარიშის დასადასტურებლად."
      );

      setForm(initialForm);
    } catch {
      setErrorMessage(
        "დაფიქსირდა ტექნიკური შეცდომა. გთხოვთ სცადოთ თავიდან."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form
        className="signupForm"
        onSubmit={handleSubmit}
      >
        <div className="nameGrid">

          <Field
            label="სახელი"
            required
          >
            <input
              type="text"
              autoComplete="given-name"
              placeholder="თქვენი სახელი"
              value={form.firstName}
              onChange={(event) =>
                updateField(
                  "firstName",
                  event.target.value
                )
              }
            />
          </Field>

          <Field
            label="გვარი"
            required
          >
            <input
              type="text"
              autoComplete="family-name"
              placeholder="თქვენი გვარი"
              value={form.lastName}
              onChange={(event) =>
                updateField(
                  "lastName",
                  event.target.value
                )
              }
            />
          </Field>

        </div>

        <Field
          label="ტელეფონის ნომერი"
          required
          hint="ეს ნომერი გამოყენებული იქნება თქვენს QR პროფილებთან დასაკავშირებლად."
        >
          <input
            type="tel"
            autoComplete="tel"
            placeholder="+1 555 000 0000"
            value={form.phone}
            onChange={(event) =>
              updateField(
                "phone",
                event.target.value
              )
            }
          />
        </Field>

        <Field
          label="ელფოსტა"
          required
          hint="ერთი ელფოსტით შესაძლებელია მხოლოდ ერთი QR RETURN ანგარიშის შექმნა."
        >
          <input
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={form.email}
            onChange={(event) =>
              updateField(
                "email",
                event.target.value
              )
            }
          />
        </Field>

        <div className="passwordGrid">

          <Field
            label="პაროლი"
            required
          >
            <input
              type="password"
              autoComplete="new-password"
              placeholder="მინიმუმ 8 სიმბოლო"
              value={form.password}
              onChange={(event) =>
                updateField(
                  "password",
                  event.target.value
                )
              }
            />
          </Field>

          <Field
            label="გაიმეორეთ პაროლი"
            required
          >
            <input
              type="password"
              autoComplete="new-password"
              placeholder="გაიმეორეთ პაროლი"
              value={
                form.confirmPassword
              }
              onChange={(event) =>
                updateField(
                  "confirmPassword",
                  event.target.value
                )
              }
            />
          </Field>

        </div>

        {errorMessage && (
          <div
            className="message error"
            role="alert"
          >
            <div className="messageIcon">
              !
            </div>

            <p>{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div
            className="message success"
            role="status"
          >
            <div className="messageIcon">
              ✓
            </div>

            <p>{successMessage}</p>
          </div>
        )}

        <button
          className="submitButton"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "ანგარიში იქმნება..."
            : "ანგარიშის შექმნა"}

          {!loading && (
            <span>→</span>
          )}
        </button>

        <div className="loginLink">
          <span>
            უკვე გაქვთ ანგარიში?
          </span>

          <a href="/login">
            შესვლა
          </a>
        </div>

        <p className="requiredNote">
          <span>*</span>
          სავალდებულო ველი
        </p>

      </form>

      <style jsx>{`
        .signupForm {
          width: 100%;
        }

        .nameGrid,
        .passwordGrid {
          display: grid;
          grid-template-columns:
            1fr 1fr;

          gap: 14px;
        }

        .nameGrid {
          margin-bottom: 17px;
        }

        .passwordGrid {
          margin-top: 17px;
        }

        .signupForm :global(input) {
          width: 100%;
          min-height: 52px;

          padding: 0 15px;

          border:
            1px solid #d7e1ec;

          border-radius: 11px;

          outline: none;

          background: #ffffff;

          color: #172b43;

          font-family: inherit;
          font-size: 13px;

          transition:
            border-color .2s ease,
            box-shadow .2s ease,
            background .2s ease;
        }

        .signupForm
          :global(input::placeholder) {
          color: #a8b2bf;
        }

        .signupForm
          :global(input:hover) {
          border-color: #bfcddd;
        }

        .signupForm
          :global(input:focus) {
          border-color: #1266e9;

          box-shadow:
            0 0 0 4px
            rgba(18,102,233,.09);

          background: #ffffff;
        }

        .message {
          margin-top: 18px;

          padding: 13px 14px;

          display: flex;
          align-items: flex-start;

          gap: 9px;

          border-radius: 11px;
        }

        .messageIcon {
          width: 23px;
          height: 23px;

          flex: 0 0 23px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          font-size: 10px;
          font-weight: 950;
        }

        .message p {
          margin: 2px 0 0;

          font-size: 10px;
          line-height: 1.55;
        }

        .error {
          border:
            1px solid #f1c5c9;

          background: #fff6f7;

          color: #a33943;
        }

        .error .messageIcon {
          background: #fde3e5;
          color: #c33e49;
        }

        .success {
          border:
            1px solid #bfe0ce;

          background: #f5fbf7;

          color: #347055;
        }

        .success .messageIcon {
          background: #dff3e7;
          color: #347055;
        }

        .submitButton {
          width: 100%;
          min-height: 54px;

          margin-top: 22px;

          padding: 0 18px;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 10px;

          border: 0;
          border-radius: 11px;

          background: #1266e9;

          color: #ffffff;

          font-family: inherit;
          font-size: 12px;
          font-weight: 850;

          cursor: pointer;

          box-shadow:
            0 13px 25px
            rgba(18,102,233,.18);

          transition:
            transform .15s ease,
            background .15s ease,
            box-shadow .15s ease;
        }

        .submitButton:hover:not(
          :disabled
        ) {
          background: #0d5dd9;

          box-shadow:
            0 16px 28px
            rgba(18,102,233,.24);

          transform:
            translateY(-1px);
        }

        .submitButton:disabled {
          opacity: .65;
          cursor: wait;
        }

        .submitButton span {
          font-size: 16px;
          line-height: 1;
        }

        .loginLink {
          margin-top: 19px;

          display: flex;
          justify-content: center;
          align-items: center;

          gap: 6px;

          color: #8290a0;

          font-size: 10px;
        }

        .loginLink a {
          color: #1266e9;

          font-weight: 850;

          text-decoration: none;
        }

        .requiredNote {
          margin: 22px 0 0;

          text-align: center;

          color: #9aa6b4;

          font-size: 8px;
        }

        .requiredNote span {
          color: #1266e9;
        }

        @media (
          max-width: 600px
        ) {
          .nameGrid,
          .passwordGrid {
            grid-template-columns: 1fr;

            gap: 17px;
          }

          .signupForm
            :global(input) {
            min-height: 50px;

            font-size: 16px;
          }
        }
      `}</style>
    </>
  );
}

function Field({
  label,
  required = false,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="field">
      <label>
        {label}

        {required && (
          <span>*</span>
        )}
      </label>

      {children}

      {hint && (
        <small>{hint}</small>
      )}

      <style jsx>{`
        .field + .field {
          margin-top: 17px;
        }

        label {
          display: block;

          margin-bottom: 7px;

          color: #334961;

          font-size: 10px;
          font-weight: 850;
        }

        label span {
          margin-left: 3px;

          color: #1266e9;
        }

        small {
          display: block;

          margin-top: 6px;

          color: #929eac;

          font-size: 8px;
          line-height: 1.45;
        }
      `}</style>
    </div>
  );
}
