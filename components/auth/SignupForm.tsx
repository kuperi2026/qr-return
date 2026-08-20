"use client";

import Link from "next/link";

import AuthField from "./AuthField";
import AuthButton from "./AuthButton";

type Props = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;

  loading?: boolean;
  error?: string;

  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;

  onSubmit: (
    event: React.FormEvent<HTMLFormElement>
  ) => void;
};

export default function SignupForm({
  firstName,
  lastName,
  email,
  phone,
  password,
  confirmPassword,

  loading = false,
  error = "",

  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPhoneChange,
  onPasswordChange,
  onConfirmPasswordChange,

  onSubmit,
}: Props) {
  return (
    <form
      className="form"
      onSubmit={onSubmit}
    >
      <div className="nameGrid">
        <AuthField
          label="First name"
          value={firstName}
          required
          autoComplete="given-name"
          placeholder="First name"
          onChange={onFirstNameChange}
        />

        <AuthField
          label="Last name"
          value={lastName}
          required
          autoComplete="family-name"
          placeholder="Last name"
          onChange={onLastNameChange}
        />
      </div>

      <AuthField
        label="Email"
        type="email"
        value={email}
        required
        autoComplete="email"
        placeholder="name@example.com"
        onChange={onEmailChange}
      />

      <AuthField
        label="Phone"
        type="tel"
        value={phone}
        autoComplete="tel"
        placeholder="+1 000 000 0000"
        onChange={onPhoneChange}
      />

      <AuthField
        label="Password"
        type="password"
        value={password}
        required
        autoComplete="new-password"
        placeholder="Create password"
        description="Use at least 8 characters."
        onChange={onPasswordChange}
      />

      <AuthField
        label="Confirm password"
        type="password"
        value={confirmPassword}
        required
        autoComplete="new-password"
        placeholder="Repeat password"
        onChange={onConfirmPasswordChange}
      />

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <p className="terms">
        By creating an account, you agree to
        QR RETURN&apos;s{" "}
        <Link href="/terms">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy">
          Privacy Policy
        </Link>.
      </p>

      <AuthButton
        type="submit"
        loading={loading}
        loadingText="Creating account..."
      >
        Create Account
      </AuthButton>

      <div className="login">
        <span>
          Already have an account?
        </span>

        <Link href="/login">
          Sign in
        </Link>
      </div>

      <style jsx>{`
        .form {
          display: grid;
          gap: 15px;
        }

        .nameGrid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .error {
          padding: 11px 12px;

          border: 1px solid #edd3d5;
          border-radius: 9px;

          color: #9d3f45;
          background: #fff5f5;

          font-size: 8px;
          line-height: 1.5;
        }

        .terms {
          margin: 0;

          color: #89939d;

          font-size: 7px;
          line-height: 1.6;

          text-align: center;
        }

        .terms :global(a) {
          color: #225fc7;
          font-weight: 800;
          text-decoration: none;
        }

        .login {
          padding-top: 13px;

          display: flex;
          justify-content: center;
          gap: 5px;

          border-top:
            1px solid #eceff1;

          color: #89939d;
          font-size: 8px;
        }

        .login :global(a) {
          color: #225fc7;
          font-weight: 850;
          text-decoration: none;
        }

        @media (max-width: 520px) {
          .nameGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </form>
  );
}
