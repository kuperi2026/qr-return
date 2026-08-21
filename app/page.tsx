"use client";

type Props = {
  language?: "ka" | "en";
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  onLanguageChange?: (
    language: "ka" | "en"
  ) => void;
};

export default function HomeHeader({
  language = "ka",
  isLoggedIn = false,
  isAdmin = false,
  onLanguageChange,
}: Props) {
  const ka = language === "ka";

  return (
    <header className="header">
      <div className="inner">
        <a href="/" className="brand">
          <div className="logo">
            <QRIcon />
          </div>

          <div className="brandText">
            <strong>QR RETURN</strong>
            <span>
              SMART LOST &amp; FOUND
            </span>
          </div>
        </a>

        <nav className="navigation">
          <a href="#how">
            {ka
              ? "როგორ მუშაობს"
              : "How it works"}
          </a>

          <a href="#founder">
            {ka
              ? "ჩვენ შესახებ"
              : "About"}
          </a>

          <a href="#faq">
            FAQ
          </a>

          <a href="/store">
            {ka
              ? "პროდუქტები"
              : "Products"}
          </a>
        </nav>

        <div className="actions">
          {isAdmin && (
            <a
              href="/admin"
              className="adminButton"
            >
              Admin
            </a>
          )}

          {isLoggedIn ? (
            <a
              href="/account"
              className="primaryButton"
            >
              {ka
                ? "ჩემი ანგარიში"
                : "My Account"}
            </a>
          ) : (
            <>
              <a
                href="/signup"
                className="primaryButton"
              >
                {ka
                  ? "რეგისტრაცია"
                  : "Register"}
              </a>

              <a
                href="/login"
                className="loginButton"
              >
                {ka
                  ? "შესვლა"
                  : "Sign In"}
              </a>
            </>
          )}

          <div className="language">
            <button
              type="button"
              className={
                language === "ka"
                  ? "active"
                  : ""
              }
              onClick={() =>
                onLanguageChange?.("ka")
              }
            >
              GEO
            </button>

            <span />

            <button
              type="button"
              className={
                language === "en"
                  ? "active"
                  : ""
              }
              onClick={() =>
                onLanguageChange?.("en")
              }
            >
              ENG
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .header {
          width: 100%;
          position: relative;
          z-index: 50;
          background:
            rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(18px);
          border-bottom:
            1px solid #e8edf3;
        }

        .inner {
          width:
            calc(100% - 56px);
          max-width: 1280px;
          min-height: 82px;
          margin: 0 auto;

          display: grid;
          grid-template-columns:
            auto 1fr auto;
          align-items: center;
          gap: 32px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
          color: inherit;
          text-decoration: none;
        }

        .logo {
          width: 42px;
          height: 42px;

          display: grid;
          place-items: center;

          border-radius: 12px;

          color: white;
          background:
            linear-gradient(
              135deg,
              #1266e9,
              #7255f5
            );

          box-shadow:
            0 10px 28px
            rgba(
              18,
              102,
              233,
              0.2
            );
        }

        .brandText strong,
        .brandText span {
          display: block;
        }

        .brandText strong {
          color: #15243a;
          font-size: 17px;
          font-weight: 900;
          letter-spacing: -0.5px;
        }

        .brandText span {
          margin-top: 3px;
          color: #8d98a5;
          font-size: 7px;
          font-weight: 850;
          letter-spacing: 1.6px;
        }

        .navigation {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 28px;
        }

        .navigation a {
          color: #637184;
          text-decoration: none;
          font-size: 14px;
          font-weight: 650;
          transition: color 0.2s ease;
        }

        .navigation a:hover {
          color: #1266e9;
        }

        .actions,
        .language {
          display: flex;
          align-items: center;
        }

        .actions {
          gap: 7px;
        }

        .primaryButton,
        .loginButton,
        .adminButton {
          min-height: 40px;
          padding: 0 15px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border-radius: 10px;
          text-decoration: none;

          font-size: 13px;
          font-weight: 800;
        }

        .primaryButton {
          color: white;
          background:
            linear-gradient(
              135deg,
              #1266e9,
              #315fe7
            );
        }

        .loginButton {
          color: #1266e9;
          border:
            1px solid #cdddf8;
          background: #eef5ff;
        }

        .adminButton {
          color: #8d4147;
          border:
            1px solid #ecdadd;
          background: #fff8f8;
        }

        .language {
          margin-left: 4px;
          gap: 6px;
        }

        .language span {
          width: 1px;
          height: 13px;
          background: #d8dde3;
        }

        .language button {
          padding: 5px 2px;
          border: 0;
          color: #9aa3ad;
          background: transparent;
          cursor: pointer;
          font-size: 9px;
          font-weight: 900;
        }

        .language button.active {
          color: #1266e9;
        }

        @media (
          max-width: 950px
        ) {
          .navigation {
            display: none;
          }
        }

        @media (
          max-width: 650px
        ) {
          .inner {
            width:
              calc(100% - 24px);
            min-height: 72px;
          }

          .brandText span,
          .language,
          .adminButton {
            display: none;
          }

          .primaryButton,
          .loginButton {
            min-height: 37px;
            padding: 0 10px;
            font-size: 11px;
          }
        }
      `}</style>
    </header>
  );
}

function QRIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect
        x="3"
        y="3"
        width="6"
        height="6"
        rx="1"
      />
      <rect
        x="15"
        y="3"
        width="6"
        height="6"
        rx="1"
      />
      <rect
        x="3"
        y="15"
        width="6"
        height="6"
        rx="1"
      />
      <path d="M14 14h3v3h3v4h-6z" />
    </svg>
  );
}
