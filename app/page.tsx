"use client";

type Props = {
  language: "ka" | "en";
  onLanguageChange: (language: "ka" | "en") => void;
};

export default function RegistrationHeader({
  language,
  onLanguageChange,
}: Props) {
  const ka = language === "ka";

  return (
    <header className="header">
      <a href="/" className="brand">
        <div className="brandName">
          QR RETURN
        </div>
      </a>

      <div className="headerRight">
        <a href="/register" className="back">
          ← {ka ? "უკან" : "Back"}
        </a>

        <div className="language">
          <button
            type="button"
            className={ka ? "selected" : ""}
            onClick={() => onLanguageChange("ka")}
          >
            GEO
          </button>

          <button
            type="button"
            className={!ka ? "selected" : ""}
            onClick={() => onLanguageChange("en")}
          >
            ENG
          </button>
        </div>
      </div>

      <style jsx>{`
        .header {
          width: 100%;
          max-width: 1100px;
          min-height: 82px;

          margin: 0 auto;
          padding: 0 24px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;
        }

        .brand {
          text-decoration: none;
        }

        .brandName {
          color: #1465e8;

          font-size: 22px;
          font-weight: 900;

          letter-spacing: -0.5px;
        }

        .headerRight {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .back {
          color: #505866;

          text-decoration: none;

          font-size: 14px;
          font-weight: 700;
        }

        .back:hover {
          color: #1465e8;
        }

        .language {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .language button {
          padding: 6px 2px;

          border: 0;
          background: transparent;

          color: #7d8490;

          font-family: inherit;
          font-size: 14px;
          font-weight: 700;

          cursor: pointer;
        }

        .language button.selected {
          color: #1465e8;
          font-weight: 800;
        }

        @media (max-width: 600px) {
          .header {
            min-height: 74px;
            padding: 0 16px;
          }

          .brandName {
            font-size: 19px;
          }

          .headerRight {
            gap: 12px;
          }

          .back,
          .language button {
            font-size: 13px;
          }
        }
      `}</style>
    </header>
  );
}
