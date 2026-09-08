"use client";

type Props = {
  language?: "ka" | "en";
  scale?: number;
  x?: number;
  y?: number;
};

export default function PhonePreview({
  language = "ka",
  scale = 100,
  x = 0,
  y = 0,
}: Props) {
  const ka = language === "ka";

  return (
    <div
      className="phone"
      style={{
        transform: `
          translate(
            calc(-50% + ${x}px),
            calc(-50% + ${y}px)
          )
          scale(${scale / 100})
        `,
      }}
    >
      <div className="notch" />

      <div className="screen">
        <div className="header">
          <div className="logo">
            <QRIcon />
          </div>

          <div>
            <span>QR RETURN</span>

            <strong>
              {ka
                ? "მპოვნელის გვერდი"
                : "Finder Access"}
            </strong>
          </div>
        </div>

        <div className="status">
          <div className="success">
            <CheckIcon />
          </div>

          <span>SCAN COMPLETE</span>
        </div>

        <div className="content">
          <strong>
            {ka
              ? "დაუკავშირდი მფლობელს"
              : "Contact the owner"}
          </strong>

          <p>
            {ka
              ? "აირჩიე შენთვის მოსახერხებელი მეთოდი."
              : "Choose the contact method that works for you."}
          </p>
        </div>

        <div className="actions">
          <button
            type="button"
            className="primary"
          >
            <ChatIcon />
            <span>Live Chat</span>
          </button>

          <button type="button">
            <LocationIcon />

            <span>
              {ka ? "ლოკაცია" : "Location"}
            </span>
          </button>
        </div>

        <div className="privacy">
          <ShieldIcon />

          <span>
            {ka
              ? "პირადი მონაცემები დაცულია"
              : "Private information protected"}
          </span>
        </div>
      </div>

      <style jsx>{`
        .phone {
          width: 175px;
          height: 350px;

          padding: 7px;

          position: absolute;
          z-index: 5;

          top: 50%;
          left: 50%;

          border-radius: 29px;

          background:
            linear-gradient(
              145deg,
              #171e26,
              #070b10
            );

          box-shadow:
            0 32px 70px
            rgba(24, 33, 44, 0.2);

          transform-origin: center;
        }

        .notch {
          width: 46px;
          height: 9px;

          position: absolute;

          top: 10px;
          left: 50%;

          z-index: 4;

          border-radius: 99px;

          background: #05080c;

          transform: translateX(-50%);
        }

        .screen {
          height: 100%;

          padding: 27px 13px 13px;

          border-radius: 23px;

          background:
            linear-gradient(
              180deg,
              #ffffff,
              #f6f8fa
            );
        }

        .header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .logo {
          width: 30px;
          height: 30px;

          display: grid;
          place-items: center;

          border-radius: 9px;

          color: white;
          background: #202b37;
        }

        .logo :global(svg) {
          width: 15px;
        }

        .header span,
        .header strong {
          display: block;
        }

        .header span {
          color: #c94a50;

          font-size: 6px;
          font-weight: 900;
          letter-spacing: 0.7px;
        }

        .header strong {
          margin-top: 2px;

          color: #4a5562;

          font-size: 8px;
          font-weight: 800;
        }

        .status {
          margin-top: 32px;

          text-align: center;
        }

        .success {
          width: 62px;
          height: 62px;

          margin: auto;

          display: grid;
          place-items: center;

          border-radius: 50%;

          color: #2b9663;
          background: #edf8f2;
        }

        .success :global(svg) {
          width: 27px;
        }

        .status > span {
          display: block;

          margin-top: 9px;

          color: #83909c;

          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .content {
          margin-top: 15px;

          text-align: center;
        }

        .content strong {
          display: block;

          color: #27323d;

          font-size: 14px;
          font-weight: 800;

          line-height: 1.3;
        }

        .content p {
          margin: 6px 0 0;

          color: #7d8793;

          font-size: 8px;
          line-height: 1.5;
        }

        .actions {
          margin-top: 18px;

          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 6px;
        }

        .actions button {
          min-height: 47px;

          padding: 7px;

          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;

          border:
            1px solid #e0e4e7;

          border-radius: 10px;

          color: #56616d;
          background: white;

          font-size: 7px;
          font-weight: 800;
        }

        .actions button.primary {
          color: white;

          border-color: #202b37;

          background: #202b37;
        }

        .actions button :global(svg) {
          width: 13px;
          height: 13px;
        }

        .privacy {
          margin-top: 11px;
          padding-top: 9px;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 6px;

          border-top:
            1px solid #e5e8ea;

          color: #838d98;

          font-size: 6px;
        }

        .privacy :global(svg) {
          width: 11px;
          height: 11px;

          color: #c94a50;
        }

        @media (max-width: 650px) {
          .phone {
            width: 155px;
            height: 320px;
          }

          .status {
            margin-top: 23px;
          }
        }
      `}</style>
    </div>
  );
}

function QRIcon() {
  return (
    <svg
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

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 12 4 4 8-8" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M4 5.5h16v11H9l-5 4z" />
      <path d="M8 10h8M8 13h5" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
      <circle
        cx="12"
        cy="10"
        r="2.2"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M12 2.5 19 6v5.3c0 4.7-2.4 7.8-7 10.2-4.6-2.4-7-5.5-7-10.2V6z" />
      <path d="m8.8 12 2.1 2.1 4.5-4.5" />
    </svg>
  );
}
