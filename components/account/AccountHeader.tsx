"use client";

import Link from "next/link";

type Props = {
  email?: string;

  notificationCount?: number;

  unreadChatCount?: number;

  onLogout?: () => void;
};

export default function AccountHeader({
  email,
  notificationCount = 0,
  unreadChatCount = 0,
  onLogout,
}: Props) {
  return (
    <header className="header">
      <Link
        href="/"
        className="brand"
      >
        <span className="logo">
          QR
        </span>

        <span className="brandText">
          <strong>
            QR RETURN
          </strong>

          <small>
            ACCOUNT
          </small>
        </span>
      </Link>

      <nav className="right">
        {email && (
          <span className="email">
            {email}
          </span>
        )}

        <Link
          href="/account/notifications"
          className="navButton"
        >
          <span className="icon">
            🔔
          </span>

          <span className="label">
            Notifications
          </span>

          {notificationCount > 0 && (
            <strong className="badge notificationBadge">
              {notificationCount > 99
                ? "99+"
                : notificationCount}
            </strong>
          )}
        </Link>

        <Link
          href="/account/chat"
          className="navButton"
        >
          <span className="icon">
            💬
          </span>

          <span className="label">
            Live Chat
          </span>

          {unreadChatCount > 0 && (
            <strong className="badge chatBadge">
              {unreadChatCount > 99
                ? "99+"
                : unreadChatCount}
            </strong>
          )}
        </Link>

        <Link
          href="/my-profiles"
          className="navButton"
        >
          <span className="icon">
            🏷️
          </span>

          <span className="label">
            My Profiles
          </span>
        </Link>

        <Link
          href="/account"
          className="navButton"
        >
          <span className="icon">
            👤
          </span>

          <span className="label">
            Account
          </span>
        </Link>

        <button
          type="button"
          className="logout"
          onClick={onLogout}
        >
          <span>
            ↗
          </span>

          <span>
            Sign Out
          </span>
        </button>
      </nav>

      <style jsx>{`
        .header {
          width: 100%;

          min-height: 70px;

          padding:
            0 22px;

          display: flex;

          align-items: center;

          justify-content:
            space-between;

          gap: 20px;

          border-bottom:
            1px solid #e1e5e8;

          background:
            rgba(
              255,
              255,
              255,
              0.96
            );

          position: relative;

          z-index: 30;
        }

        .brand {
          display: flex;

          align-items: center;

          gap: 9px;

          flex: 0 0 auto;

          text-decoration: none;
        }

        .logo {
          width: 40px;
          height: 40px;

          display: grid;

          place-items: center;

          border-radius: 11px;

          color: white;

          background:
            linear-gradient(
              135deg,
              #1465e8,
              #7655f7
            );

          font-size: 12px;

          font-weight: 900;
        }

        .brandText strong,
        .brandText small {
          display: block;
        }

        .brandText strong {
          color: #1465e8;

          font-size: 13px;

          font-weight: 900;
        }

        .brandText small {
          margin-top: 2px;

          color: #7655f7;

          font-size: 6px;

          font-weight: 900;

          letter-spacing: 1px;
        }

        .right {
          min-width: 0;

          display: flex;

          align-items: center;

          justify-content:
            flex-end;

          gap: 6px;
        }

        .email {
          max-width: 175px;

          margin-right: 3px;

          overflow: hidden;

          color: #8a959e;

          font-size: 7px;

          text-overflow: ellipsis;

          white-space: nowrap;
        }

        .navButton,
        .logout {
          min-height: 35px;

          padding:
            0 9px;

          display: flex;

          align-items: center;

          justify-content:
            center;

          gap: 5px;

          position: relative;

          border:
            1px solid #dfe4e8;

          border-radius: 8px;

          color: #53606b;

          background: white;

          text-decoration: none;

          font-size: 7px;

          font-weight: 850;
        }

        .navButton:hover,
        .logout:hover {
          border-color: #cbd3da;

          background: #f8fafb;
        }

        .icon {
          font-size: 11px;
        }

        .badge {
          min-width: 18px;
          height: 18px;

          padding:
            0 4px;

          display: grid;

          place-items: center;

          border-radius: 999px;

          color: white;

          font-size: 5px;

          font-weight: 900;
        }

        .notificationBadge {
          background: #c84a50;
        }

        .chatBadge {
          background: #1465e8;
        }

        .logout {
          border-color: #eadadd;

          color: #9d4c51;

          background: #fffafa;

          cursor: pointer;
        }

        @media (
          max-width: 940px
        ) {
          .email {
            display: none;
          }

          .label {
            display: none;
          }

          .navButton,
          .logout {
            min-width: 36px;

            padding:
              0 7px;
          }
        }

        @media (
          max-width: 590px
        ) {
          .header {
            min-height: auto;

            padding:
              11px 12px;

            align-items:
              flex-start;

            flex-direction:
              column;
          }

          .right {
            width: 100%;

            justify-content:
              flex-start;

            flex-wrap: wrap;
          }

          .label {
            display: inline;
          }

          .navButton,
          .logout {
            flex:
              1 1 auto;
          }
        }

        @media (
          max-width: 420px
        ) {
          .brandText small {
            display: none;
          }

          .navButton,
          .logout {
            min-height: 38px;
          }

          .label {
            font-size: 6px;
          }
        }
      `}</style>
    </header>
  );
}
