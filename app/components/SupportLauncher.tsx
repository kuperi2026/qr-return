"use client";

type Props = {
  language: "ka" | "en";
};

export default function SupportLauncher({
  language,
}: Props) {
  const ka = language === "ka";

  return (
    <a
      href="/support"
      className="supportLauncher"
      aria-label="QR RETURN Support Live Chat"
    >
      <div className="agent">
        <div className="face">👩‍💻</div>
        <div className="headset">🎧</div>
        <span className="onlineDot" />
      </div>

      <div className="copy">
        <strong>Live Chat</strong>

        <span>
          {ka
            ? "დაგვიკავშირდით"
            : "Chat with us"}
        </span>
      </div>

      <div className="arrow">›</div>

      <style jsx>{`
        .supportLauncher {
          position: fixed;
          z-index: 9999;
          right: 22px;
          top: 55%;
          min-width: 210px;
          padding: 10px 14px 10px 9px;
          display: flex;
          align-items: center;
          gap: 11px;
          border: 1px solid rgba(92, 79, 220, 0.2);
          border-radius: 18px;
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.98),
              rgba(242, 240, 255, 0.98)
            );
          box-shadow:
            0 15px 38px rgba(49, 42, 120, 0.18);
          color: #101828;
          text-decoration: none;
          backdrop-filter: blur(14px);
          transition:
            transform 0.18s ease,
            box-shadow 0.18s ease;
        }

        .supportLauncher:hover {
          transform: translateY(-2px);
          box-shadow:
            0 20px 46px rgba(49, 42, 120, 0.23);
        }

        .agent {
          width: 50px;
          height: 50px;
          flex: 0 0 50px;
          position: relative;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background:
            linear-gradient(
              135deg,
              #dbeafe,
              #ede9fe
            );
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.6);
        }

        .face {
          font-size: 26px;
          line-height: 1;
        }

        .headset {
          position: absolute;
          right: -4px;
          top: -6px;
          font-size: 15px;
        }

        .onlineDot {
          position: absolute;
          right: 2px;
          bottom: 2px;
          width: 11px;
          height: 11px;
          border: 2px solid white;
          border-radius: 50%;
          background: #12b76a;
        }

        .copy {
          flex: 1;
          min-width: 0;
        }

        .copy strong,
        .copy span {
          display: block;
        }

        .copy strong {
          color: #4f46e5;
          font-size: 14px;
          font-weight: 900;
        }

        .copy span {
          margin-top: 3px;
          color: #667085;
          font-size: 10px;
          font-weight: 750;
        }

        .arrow {
          color: #7655f7;
          font-size: 24px;
          font-weight: 700;
        }

        @media (max-width: 700px) {
          .supportLauncher {
            top: auto;
            right: 14px;
            bottom: 82px;
            min-width: 175px;
            padding: 8px 11px 8px 8px;
          }

          .agent {
            width: 43px;
            height: 43px;
            flex-basis: 43px;
          }

          .face {
            font-size: 22px;
          }

          .copy strong {
            font-size: 13px;
          }

          .copy span {
            font-size: 9px;
          }
        }
      `}</style>
    </a>
  );
}
