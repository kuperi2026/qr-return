"use client";

import Link from "next/link";

type Props = {
  email?: string;
  onLogout?: () => void;
};

export default function AccountHeader({
  email,
  onLogout,
}: Props) {
  return (
    <header className="header">
      <Link
        href="/"
        className="brand"
      >
        QR RETURN
      </Link>

      <div className="right">
        {email && (
          <span>
            {email}
          </span>
        )}

        <Link href="/account">
          Account
        </Link>

        <button
          type="button"
          onClick={onLogout}
        >
          Sign Out
        </button>
      </div>

      <style jsx>{`
        .header {
          min-height: 68px;

          padding: 0 22px;

          display: flex;
          align-items: center;
          justify-content:
            space-between;

          gap: 20px;

          border-bottom:
            1px solid #e4e7ea;

          background: white;
        }

        .brand {
          color: #202b37;

          font-size: 14px;
          font-weight: 900;

          text-decoration: none;
        }

        .right {
          display: flex;
          align-items: center;

          gap: 9px;
        }

        .right > span {
          color: #8b959e;

          font-size: 8px;
        }

        .right :global(a),
        button {
          min-height: 34px;

          padding: 0 10px;

          display: flex;
          align-items: center;

          border:
            1px solid #dfe4e8;

          border-radius: 8px;

          color: #53606c;
          background: white;

          text-decoration: none;

          font-size: 7px;
          font-weight: 850;
        }

        button {
          cursor: pointer;
        }

        @media(max-width:600px) {
          .right > span {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
