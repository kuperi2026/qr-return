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
      <div className="headerInner">
        {/* BRAND */}

        <a
          href="/"
          className="brand"
          aria-label="QR RETURN"
        >
          <span className="brandMark">
            <QRIcon />
          </span>

          <strong className="brandName">
            QR RETURN
          </strong>
        </a>

        {/* ACTIONS */}

        <div className="actions">
          {isAdmin && (
            <a
              href="/admin"
              className="adminButton"
            >
              Admin Panel
            </a>
          )}

          <div
            className="languageSwitcher"
            aria-label="Language"
          >
            <button
              type="button"
              className={
                ka ? "active" : ""
              }
              onClick={() =>
                onLanguageChange?.("ka")
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
                onLanguageChange?.("en")
              }
            >
              ENG
            </button>
          </div>

          {isLoggedIn ? (
            <a
              href="/account"
              className="primaryButton"
            >
              {ka
                ? "ჩემი ანგარიში"
                : "My Account"}

              <ArrowIcon />
            </a>
          ) : (
            <>
              <a
                href="/login"
                className="loginButton"
              >
                {ka
                  ? "შესვლა"
                  : "Sign in"}
              </a>

              <a
                href="/signup"
                className="primaryButton"
              >
                {ka
                  ? "ანგარიშის შექმნა"
                  : "Create account"}

                <ArrowIcon />
              </a>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .header {
          width: 100%;

          position: relative;
          z-index: 100;

          background:
            rgba(
              250,
              252,
              255,
              0.92
            );

          border-bottom:
            1px solid
            rgba(
              40,
              72,
              120,
              0.1
            );

          backdrop-filter:
            blur(18px);
          -webkit-backdrop-filter:
            blur(18px);
        }

        .headerInner {
          width:
            calc(100% - 64px);

          max-width: 1320px;
          min-height: 86px;

          margin: 0 auto;

          display: flex;
          align-items: center;
          justify-content:
            space-between;

          gap: 28px;
        }

        /* BRAND */

        .brand {
          display: inline-flex;
          align-items: center;

          gap: 13px;

          flex-shrink: 0;

          text-decoration: none;
        }

        .brandMark {
          width: 46px;
          height: 46px;

          display: grid;
          place-items: center;

          border-radius: 15px;

          color: white;

          background:
            linear-gradient(
              135deg,
              #3568e8 0%,
              #5967e9 52%,
              #705ce7 100%
            );

          box-shadow:
            0 10px 28px
            rgba(
              72,
              97,
              220,
              0.22
            );
        }

        .brandMark
          :global(svg) {
          width: 22px;
          height: 22px;
        }

        .brandName {
          color: #18233a;

          font-size: 21px;
          font-weight: 800;

          letter-spacing: -0.65px;

          white-space: nowrap;
        }

        /* ACTIONS */

        .actions {
          display: flex;
          align-items: center;

          gap: 9px;
        }

        /* LANGUAGE */

        .languageSwitcher {
          margin-right: 4px;

          padding: 4px;

          display: flex;
          align-items: center;

          gap: 3px;

          border:
            1px solid
            rgba(
              60,
              83,
              126,
              0.11
            );

          border-radius: 12px;

          background:
            rgba(
              237,
              242,
              250,
              0.75
            );
        }

        .languageSwitcher
          button {
          min-width: 49px;
          height: 37px;

          padding: 0 10px;

          border: 0;
          border-radius: 9px;

          color: #778398;
          background: transparent;

          cursor: pointer;

          font-size: 13px;
          font-weight: 750;

          letter-spacing: 0.15px;

          transition:
            color 160ms ease,
            background 160ms ease,
            box-shadow 160ms ease;
        }

        .languageSwitcher
          button.active {
          color: #315fd2;

          background: white;

          box-shadow:
            0 3px 10px
            rgba(
              31,
              48,
              82,
              0.08
            );
        }

        /* LOGIN */

        .loginButton,
        .primaryButton,
        .adminButton {
          min-height: 44px;

          padding: 0 17px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border-radius: 11px;

          text-decoration: none;

          font-size: 14px;
          font-weight: 700;

          transition:
            transform 160ms ease,
            box-shadow 160ms ease,
            border-color 160ms ease;
        }

        .loginButton {
          color: #344157;

          border:
            1px solid
            rgba(
              55,
              75,
              108,
              0.14
            );

          background:
            rgba(
              255,
              255,
              255,
              0.85
            );
        }

        .loginButton:hover {
          border-color:
            rgba(
              63,
              96,
              190,
              0.3
            );

          box-shadow:
            0 7px 20px
            rgba(
              37,
              54,
              90,
              0.07
            );

          transform:
            translateY(-1px);
        }

        /* MAIN CTA */

        .primaryButton {
          gap: 10px;

          color: white;

          border:
            1px solid
            transparent;

          background:
            linear-gradient(
              135deg,
              #3467e8,
              #6264e8
            );

          box-shadow:
            0 9px 24px
            rgba(
              62,
              91,
              218,
              0.2
            );
        }

        .primaryButton:hover {
          transform:
            translateY(-1px);

          box-shadow:
            0 13px 30px
            rgba(
              62,
              91,
              218,
              0.27
            );
        }

        .primaryButton
          :global(svg) {
          width: 15px;
          height: 15px;
        }

        /* ADMIN */

        .adminButton {
          color: #6b55c7;

          border:
            1px solid
            rgba(
              109,
              88,
              202,
              0.15
            );

          background: #f6f3ff;
        }

        /* TABLET */

        @media (
          max-width: 760px
        ) {
          .headerInner {
            width:
              calc(
                100% - 28px
              );

            min-height: 78px;
          }

          .brandName {
            font-size: 19px;
          }

          .brandMark {
            width: 43px;
            height: 43px;
          }

          .adminButton {
            display: none;
          }

          .loginButton,
          .primaryButton {
            padding: 0 13px;

            font-size: 13px;
          }
        }

        /* MOBILE */

        @media (
          max-width: 560px
        ) {
          .headerInner {
            gap: 12px;
          }

          .brand {
            gap: 9px;
          }

          .brandMark {
            width: 40px;
            height: 40px;

            border-radius: 12px;
          }

          .brandName {
            font-size: 17px;
          }

          .languageSwitcher {
            display: none;
          }

          .loginButton {
            display: none;
          }

          .primaryButton {
            min-height: 41px;

            padding: 0 12px;

            font-size: 12px;
          }

          .primaryButton
            :global(svg) {
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
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
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

      <path d="M15 15h2v2h-2z" />
      <path d="M19 15h2v6h-6v-2" />
      <path d="M15 19v2" />
      <path d="M19 19h2" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}
