"use client";

type Props = {
  language?: "ka" | "en";
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  onLanguageChange?: (language: "ka" | "en") => void;
};

export default function HomeHeader({
  language = "ka",
  isLoggedIn = false,
  isAdmin = false,
  onLanguageChange,
}: Props) {
  const ka = language === "ka";

  return (
    <header className="qr-header">
      <div className="qr-header-inner">

        {/* LOGO */}
        <a href="/" className="brand">
          <div className="logoMark">
            <QRIcon />
          </div>

          <div className="brandText">
            <strong>QR RETURN</strong>
            <span>SMART LOST & FOUND</span>
          </div>
        </a>

        {/* RIGHT SIDE */}
        <div className="actions">

          {isAdmin && (
            <a href="/admin" className="adminButton">
              Admin
            </a>
          )}

          {isLoggedIn ? (
            <a href="/account" className="accountButton">
              {ka ? "ჩემი ანგარიში" : "My Account"}
            </a>
          ) : (
            <>
              <a href="/account/register" className="accountButton">
                {ka ? "ანგარიშის შექმნა" : "Create Account"}
              </a>

              <a href="/login" className="loginButton">
                {ka ? "შესვლა" : "Sign In"}
              </a>
            </>
          )}

          {/* LANGUAGE */}
          <div className="languageSwitcher">
            <button
              type="button"
              className={language === "ka" ? "active" : ""}
              onClick={() => onLanguageChange?.("ka")}
            >
              GEO
            </button>

            <button
              type="button"
              className={language === "en" ? "active" : ""}
              onClick={() => onLanguageChange?.("en")}
            >
              ENG
            </button>
          </div>

        </div>
      </div>

      <style jsx>{`
        .qr-header {
          width: 100%;
          background: #f8f8f5;
        }

        .qr-header-inner {
          width: calc(100% - 56px);
          max-width: 1280px;
          min-height: 78px;
          margin: 0 auto;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border-bottom: 1px solid rgba(20, 28, 38, 0.075);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;

          color: #202b37;
          text-decoration: none;
        }

        .logoMark {
          width: 39px;
          height: 39px;

          display: grid;
          place-items: center;

          border-radius: 11px;
          background: #202b37;
          color: white;
        }

        .brandText {
          display: flex;
          flex-direction: column;
        }

        .brandText strong {
          font-size: 17px;
          font-weight: 800;
          letter-spacing: -0.4px;
        }

        .brandText span {
          margin-top: 3px;

          color: #929aa3;

          font-size: 6px;
          font-weight: 850;
          letter-spacing: 1.7px;
        }

        .actions {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .actions a {
          min-height: 38px;
          padding: 0 13px;

          display: flex;
          align-items: center;

          border: 1px solid #dce0e4;
          border-radius: 10px;

          color: #53606d;
          background: transparent;

          text-decoration: none;

          font-size: 10px;
          font-weight: 800;
        }

        .accountButton {
          color: white !important;
          background: #202b37 !important;
          border-color: #202b37 !important;
        }

        .adminButton {
          color: #9d4044 !important;
          background: #fff8f8 !important;
          border-color: #ecd8da !important;
        }

        .languageSwitcher {
          display: flex;
          gap: 4px;

          margin-left: 7px;
        }

        .languageSwitcher button {
          padding: 6px 4px;

          border: 0;
          background: transparent;

          color: #999;

          cursor: pointer;

          font-size: 8px;
          font-weight: 900;
        }

        .languageSwitcher button.active {
          color: #c84a50;
        }

        @media (max-width: 650px) {
          .qr-header-inner {
            width: calc(100% - 20px);
          }

          .brandText span {
            display: none;
          }

          .actions a {
            padding: 0 8px;
            font-size: 8px;
          }

          .languageSwitcher {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}

function QRIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="15" width="6" height="6" rx="1" />

      <path d="M14 14h3v3h3v4h-6z" />
    </svg>
  );
}
