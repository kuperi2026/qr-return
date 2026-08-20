"use client";

import type { ReactNode } from "react";

type Language = "ka" | "en";

type Props = {
  language?: Language;

  emergencyContactTitle?: string;
  emergencyContactText?: string;

  medicalTitle?: string;
  medicalText?: string;

  allergyTitle?: string;
  allergyText?: string;

  privacyTitle?: string;
  privacyText?: string;

  widthPercent?: number;
  borderRadius?: number;
  padding?: number;
  marginTop?: number;
};

export default function EmergencyProfileCard({
  language = "ka",

  emergencyContactTitle,
  emergencyContactText,

  medicalTitle,
  medicalText,

  allergyTitle,
  allergyText,

  privacyTitle,
  privacyText,

  widthPercent = 100,
  borderRadius = 19,
  padding = 17,
  marginTop = 0,
}: Props) {
  const ka = language === "ka";

  const contactTitle =
    emergencyContactTitle ||
    (ka ? "საგანგებო კონტაქტი" : "Emergency Contact");

  const contactText =
    emergencyContactText ||
    (ka ? "თქვენ მიერ არჩეული პირი" : "Your trusted contact");

  const medTitle =
    medicalTitle ||
    (ka ? "სამედიცინო ინფორმაცია" : "Medical Information");

  const medText =
    medicalText ||
    (ka
      ? "მხოლოდ ნებადართული მონაცემები"
      : "Only approved information");

  const allergyLabel =
    allergyTitle ||
    (ka ? "ალერგიები" : "Allergies");

  const allergyDescription =
    allergyText ||
    (ka ? "საჭიროების შემთხვევაში" : "When relevant");

  const privacyLabel =
    privacyTitle ||
    "Privacy Control";

  const privacyDescription =
    privacyText ||
    (ka
      ? "თქვენ აკონტროლებთ მონაცემებს"
      : "You stay in control");

  return (
    <section
      className="profile"
      style={{
        width: `${widthPercent}%`,
        borderRadius: `${borderRadius}px`,
        padding: `${padding}px`,
        marginTop: `${marginTop}px`,
      }}
    >
      <div className="profileHeader">
        <div>
          <span className="eyebrow">
            EMERGENCY PROFILE
          </span>

          <strong>
            {ka
              ? "მხოლოდ საჭირო ინფორმაცია."
              : "Only what matters."}
          </strong>
        </div>

        <div className="status">
          <span className="dot" />
          SOS READY
        </div>
      </div>

      <div className="grid">
        <InfoItem
          icon={<PhoneIcon />}
          title={contactTitle}
          text={contactText}
        />

        <InfoItem
          icon={<HeartIcon />}
          title={medTitle}
          text={medText}
        />

        <InfoItem
          icon={<AlertIcon />}
          title={allergyLabel}
          text={allergyDescription}
        />

        <InfoItem
          icon={<ShieldIcon />}
          title={privacyLabel}
          text={privacyDescription}
        />
      </div>

      <style jsx>{`
        .profile {
          max-width: 100%;

          border: 1px solid #e0e3e6;

          background:
            rgba(255, 255, 255, 0.9);

          box-shadow:
            0 14px 36px
            rgba(31, 40, 53, 0.045);

          backdrop-filter: blur(14px);
        }

        .profileHeader {
          padding-bottom: 12px;

          display: flex;
          align-items: flex-start;
          justify-content: space-between;

          gap: 14px;
        }

        .profileHeader > div:first-child {
          min-width: 0;
        }

        .eyebrow,
        .profileHeader strong {
          display: block;
        }

        .eyebrow {
          color: #c94a50;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.9px;
        }

        .profileHeader strong {
          margin-top: 4px;

          color: #36414d;

          font-size: 12px;
          font-weight: 800;
        }

        .status {
          padding: 6px 8px;

          display: flex;
          align-items: center;

          gap: 5px;

          flex: 0 0 auto;

          border-radius: 999px;

          color: #376b4c;
          background: #edf8f1;

          font-size: 6px;
          font-weight: 900;
          letter-spacing: 0.2px;
        }

        .dot {
          width: 6px;
          height: 6px;

          display: block;

          border-radius: 50%;

          background: #2aa76b;
        }

        .grid {
          display: grid;
          grid-template-columns:
            1fr 1fr;

          border-top:
            1px solid #e7eaed;

          border-left:
            1px solid #e7eaed;
        }

        @media (max-width: 650px) {
          .profileHeader {
            align-items: flex-start;
          }

          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

function InfoItem({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <article className="item">
      <div className="icon">
        {icon}
      </div>

      <div className="copy">
        <strong>{title}</strong>
        <span>{text}</span>
      </div>

      <style jsx>{`
        .item {
          min-height: 66px;
          padding: 11px;

          display: grid;
          grid-template-columns:
            auto minmax(0, 1fr);

          align-items: center;

          gap: 9px;

          border-right:
            1px solid #e7eaed;

          border-bottom:
            1px solid #e7eaed;
        }

        .icon {
          width: 31px;
          height: 31px;

          display: grid;
          place-items: center;

          border-radius: 9px;

          color: #c94a50;
          background: #fff1f1;
        }

        .icon :global(svg) {
          width: 15px;
          height: 15px;
        }

        .copy {
          min-width: 0;
        }

        .copy strong,
        .copy span {
          display: block;
        }

        .copy strong {
          color: #3d4854;

          font-size: 10px;
          font-weight: 800;
          line-height: 1.25;
        }

        .copy span {
          margin-top: 3px;

          color: #87909a;

          font-size: 8px;
          line-height: 1.35;
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
      <path d="M7 3h3l1 4-2 1.5c1.4 3 3.5 5.1 6.5 6.5L17 13l4 1v3c0 2.2-1.8 4-4 4C9.3 21 3 14.7 3 7a4 4 0 0 1 4-4Z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M12 3 2.8 20h18.4z" />
      <path d="M12 9v5M12 17h.01" />
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
