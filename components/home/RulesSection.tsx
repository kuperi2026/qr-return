"use client";

import type { ReactNode } from "react";

type Props = {
  language?: "ka" | "en";
  background?: string;
  paddingTop?: number;
  paddingBottom?: number;
  titleSize?: number;
};

export default function RulesSection({
  language = "ka",
  background = "#ffffff",
  paddingTop = 82,
  paddingBottom = 82,
  titleSize = 38,
}: Props) {
  const ka = language === "ka";

  const items = [
    {
      number: "01",
      label: "NO APP",
      title: ka
        ? "მპოვნელს აპი არ სჭირდება."
        : "No app required.",
      text: ka
        ? "QR კოდის დასკანერება პირდაპირ ხსნის შესაბამის პროფილს."
        : "Scanning the QR code opens the relevant profile directly.",
      icon: <PhoneIcon />,
    },
    {
      number: "02",
      label: "PRIVACY CONTROL",
      title: ka
        ? "თქვენ წყვეტთ, რა გამოჩნდება."
        : "You control what is visible.",
      text: ka
        ? "საკონტაქტო და სხვა ინფორმაცია გამოჩნდება მხოლოდ თქვენი პარამეტრების შესაბამისად."
        : "Contact and profile information is displayed according to your settings.",
      icon: <ShieldIcon />,
    },
    {
      number: "03",
      label: "ONE ACCOUNT",
      title: ka
        ? "რამდენიმე QR — ერთი ანგარიში."
        : "Multiple QR profiles. One account.",
      text: ka
        ? "ერთ ანგარიშში შეგიძლიათ მართოთ სხვადასხვა ნივთისა და ცხოველის QR პროფილები."
        : "Manage QR profiles for multiple belongings and pets from one account.",
      icon: <AccountIcon />,
    },
  ];

  return (
    <section
      id="rules"
      className="section"
      style={{
        background,
        paddingTop,
        paddingBottom,
      }}
    >
      <div className="shell">
        <div className="heading">
          <span>BUILT TO BE SIMPLE</span>

          <h2 style={{ fontSize: titleSize }}>
            {ka
              ? "მარტივი მპოვნელისთვის. კონტროლირებადი თქვენთვის."
              : "Simple for the finder. Controlled by you."}
          </h2>
        </div>

        <div className="grid">
          {items.map((item) => (
            <RuleCard
              key={item.number}
              {...item}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .section {
          width: 100%;
        }

        .shell {
          width: calc(100% - 56px);
          max-width: 1180px;
          margin: 0 auto;
        }

        .heading {
          max-width: 720px;
        }

        .heading > span {
          color: #c84a50;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        h2 {
          margin: 10px 0 0;
          color: #1f2a35;
          font-weight: 680;
          line-height: 1.08;
          letter-spacing: -1.7px;
        }

        .grid {
          margin-top: 40px;

          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          border-top: 1px solid #dfe3e6;
          border-bottom: 1px solid #dfe3e6;
        }

        @media (max-width: 800px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 650px) {
          .shell {
            width: calc(100% - 28px);
          }
        }
      `}</style>
    </section>
  );
}

function RuleCard({
  number,
  label,
  title,
  text,
  icon,
}: {
  number: string;
  label: string;
  title: string;
  text: string;
  icon: ReactNode;
}) {
  return (
    <article className="card">
      <div className="top">
        <span className="number">
          {number}
        </span>

        <div className="icon">
          {icon}
        </div>
      </div>

      <span className="label">
        {label}
      </span>

      <strong>{title}</strong>

      <p>{text}</p>

      <style jsx>{`
        .card {
          min-height: 225px;
          padding: 23px 25px;

          border-right:
            1px solid #e1e5e8;
        }

        .card:last-child {
          border-right: 0;
        }

        .top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .number {
          color: #a5adb6;
          font-size: 7px;
          font-weight: 900;
        }

        .icon {
          width: 38px;
          height: 38px;

          display: grid;
          place-items: center;

          border-radius: 11px;

          color: #c84a50;
          background: #faf0f0;
        }

        .icon :global(svg) {
          width: 17px;
          height: 17px;
        }

        .label {
          display: block;

          margin-top: 31px;

          color: #a0a8b0;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        strong {
          display: block;

          margin-top: 7px;

          color: #303b47;
          font-size: 13px;
          font-weight: 800;
          line-height: 1.35;
        }

        p {
          max-width: 280px;

          margin: 8px 0 0;

          color: #78828c;
          font-size: 9px;
          line-height: 1.65;
        }

        @media (max-width: 800px) {
          .card {
            min-height: auto;

            border-right: 0;
            border-bottom:
              1px solid #e1e5e8;
          }

          .card:last-child {
            border-bottom: 0;
          }
        }
      `}</style>
    </article>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <rect
        x="7"
        y="2.5"
        width="10"
        height="19"
        rx="2"
      />
      <path d="M10 18.5h4" />
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

function AccountIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle
        cx="12"
        cy="8"
        r="3.5"
      />
      <path d="M5 20c.7-4 3.1-6 7-6s6.3 2 7 6" />
    </svg>
  );
}
