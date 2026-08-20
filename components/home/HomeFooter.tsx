"use client";

type Props = {
  language?: "ka" | "en";
};

export default function HomeFooter({
  language = "ka",
}: Props) {
  const ka = language === "ka";

  return (
    <footer className="footer">
      <div className="footerInner">
        <div className="brand">
          <div className="logo">
            <QRIcon />
          </div>

          <div>
            <strong>QR RETURN</strong>
            <span>SMART LOST & FOUND</span>
          </div>
        </div>

        <nav className="links">
          <a href="#video">
            {ka ? "როგორ მუშაობს" : "How it works"}
          </a>

          <a href="#emergency">
            Emergency ID
          </a>

          <a href="#privacy">
            {ka ? "კონფიდენციალურობა" : "Privacy"}
          </a>

          <a href="#terms">
            {ka ? "პირობები" : "Terms"}
          </a>

          <a href="#contact">
            {ka ? "კონტაქტი" : "Contact"}
          </a>
        </nav>

        <div className="copyright">
          © 2026 QR RETURN
        </div>
      </div>

      <style jsx>{`
        .footer {
          width: 100%;
          color: white;
          background: #111820;
        }

        .footerInner {
          width: calc(100% - 56px);
          max-width: 1180px;
          min-height: 125px;
          margin: 0 auto;
          padding: 32px 0;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo {
          width: 35px;
          height: 35px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          color: white;
          background: #c94a50;
        }

        .brand strong,
        .brand span {
          display: block;
        }

        .brand strong {
          font-size: 12px;
          font-weight: 850;
        }

        .brand span {
          margin-top: 3px;

          color: #707a87;

          font-size: 5px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .links {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .links a {
          color: #87909b;

          font-size: 8px;
          text-decoration: none;

          transition: color 0.18s ease;
        }

        .links a:hover {
          color: white;
        }

        .copyright {
          color: #5e6874;
          font-size: 7px;
        }

        @media (max-width: 850px) {
          .footerInner {
            align-items: flex-start;
            flex-direction: column;
          }

          .links {
            flex-wrap: wrap;
          }
        }

        @media (max-width: 650px) {
          .footerInner {
            width: calc(100% - 28px);
          }
        }
      `}</style>
    </footer>
  );
}

function QRIcon() {
  return (
    <svg
      width="18"
      height="18"
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
