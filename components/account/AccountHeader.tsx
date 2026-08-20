"use client";

import Link from "next/link";

type Props = {
  email?: string;
  notificationCount?: number;
  onLogout?: () => void;
};

export default function AccountHeader({
  email,
  notificationCount = 0,
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

      <nav className="right">
        {email && (
          <span className="email">
            {email}
          </span>
        )}

        <Link
          href="/account/notifications"
          className="notifications"
        >
          <span className="bell">
            🔔
          </span>

          <span>
            Notifications
          </span>

          {notificationCount > 0 && (
            <strong>
              {notificationCount > 99
                ? "99+"
                : notificationCount}
            </strong>
          )}
        </Link>

        <Link
          href="/my-profiles"
        >
          My Profiles
        </Link>

        <Link
          href="/account"
        >
          Account
        </Link>

        <button
          type="button"
          onClick={onLogout}
        >
          Sign Out
        </button>
      </nav>

      <style jsx>{`
        .header {
          min-height: 68px;

          padding: 0 22px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;

          border-bottom:
            1px solid #e4e7ea;

          background: white;
        }

        .brand {
          flex: 0 0 auto;

          color: #202b37;

          font-size: 14px;
          font-weight: 900;

          text-decoration: none;
        }

        .right {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          gap: 7px;

          min-width: 0;
        }

        .email {
          max-width: 180px;

          overflow: hidden;

          color: #8b959e;

          font-size: 8px;

          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .right :global(a),
        button {
          min-height: 34px;

          padding: 0 10px;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 5px;

          border:
            1px solid #dfe4e8;

          border-radius: 8px;

          color: #53606c;
          background: white;

          text-decoration: none;

          font-size: 7px;
          font-weight: 850;
        }

        .notifications {
          position: relative;
        }

        .notifications strong {
          min-width: 17px;
          height: 17px;

          padding: 0 4px;

          display: grid;
          place-items: center;

          border-radius: 999px;

          color: white;
          background: #c84a50;

          font-size: 5px;
          font-weight: 900;
        }

        .bell {
          font-size: 11px;
        }

        button {
          cursor: pointer;
        }

        @media (max-width: 800px) {
          .email {
            display: none;
          }
        }

        @media (max-width: 620px) {
          .header {
            min-height: auto;

            padding: 12px;

            align-items: flex-start;
            flex-direction: column;
          }

          .right {
            width: 100%;

            justify-content: flex-start;

            flex-wrap: wrap;
          }

          .right :global(a),
          button {
            flex: 1 1 auto;
          }
        }
      `}</style>
    </header>
  );
}
