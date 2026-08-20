"use client";

import Link from "next/link";

import AuthField from "./AuthField";
import AuthButton from "./AuthButton";

type Props = {
  email: string;
  password: string;

  loading?: boolean;
  error?: string;

  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;

  onSubmit: (
    event: React.FormEvent<HTMLFormElement>
  ) => void;
};

export default function LoginForm({
  email,
  password,

  loading = false,
  error = "",

  onEmailChange,
  onPasswordChange,

  onSubmit,
}: Props) {
  return (
    <form
      className="form"
      onSubmit={onSubmit}
    >
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
        label="Password"
        type="password"
        value={password}
        required
        autoComplete="current-password"
        placeholder="••••••••"
        onChange={onPasswordChange}
      />

      <div className="forgot">
        <Link href="/reset-password">
          Forgot password?
        </Link>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <AuthButton
        type="submit"
        loading={loading}
        loadingText="Signing in..."
      >
        Sign In
      </AuthButton>

      <div className="signup">
        <span>
          Don&apos;t have an account?
        </span>

        <Link href="/signup">
          Create account
        </Link>
      </div>

      <style jsx>{`
        .form {
          display: grid;
          gap: 15px;
        }

        .forgot {
          margin-top: -4px;
          text-align: right;
        }

        .forgot :global(a) {
          color: #225fc7;

          font-size: 8px;
          font-weight: 800;

          text-decoration: none;
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

        .signup {
          padding-top: 13px;

          display: flex;
          justify-content: center;

          gap: 5px;

          border-top:
            1px solid #eceff1;

          color: #89939d;

          font-size: 8px;
        }

        .signup :global(a) {
          color: #225fc7;

          font-weight: 850;

          text-decoration: none;
        }
      `}</style>
    </form>
  );
}
