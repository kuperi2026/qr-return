"use client";

import type { ReactNode } from "react";

type Language = "ka" | "en";

type Props = {
  language?: Language;

  title?: string;

  feature1Title?: string;
  feature1Text?: string;

  feature2Title?: string;
  feature2Text?: string;

  feature3Title?: string;
  feature3Text?: string;

  feature4Title?: string;
  feature4Text?: string;

  background?: string;

  paddingTop?: number;
  paddingBottom?: number;

  titleSize?: number;
  itemTitleSize?: number;
  itemTextSize?: number;
};

export default function FeaturesSection({
  language = "ka",

  title,

  feature1Title,
  feature1Text,

  feature2Title,
  feature2Text,

  feature3Title,
  feature3Text,

  feature4Title,
  feature4Text,

  background = "#202b37",

  paddingTop = 88,
  paddingBottom = 88,

  titleSize = 42,
  itemTitleSize = 13,
  itemTextSize = 9,
}: Props) {
  const ka = language === "ka";

  const items = [
    {
      number: "01",

      title:
        feature1Title ||
        "Live Chat",

      text:
        feature1Text ||
        (ka
          ? "მპოვნელთან პირდაპირი კავშირი პირადი ნომრის გამოჩენის გარეშე."
          : "Connect directly without displaying your private phone number."),

      icon: <ChatIcon />,
    },

    {
      number: "02",

      title:
        feature2Title ||
        (ka
          ? "ლოკაციის გაზიარება"
          : "Location Sharing"),

      text:
        feature2Text ||
        (ka
          ? "მპოვნელმა შეიძლება ლოკაცია ერთი ღილაკით გაგიზიაროთ."
          : "The finder can share their location with one tap."),

      icon: <LocationIcon />,
    },

    {
      number: "03",

      title:
        feature3Title ||
        (ka
          ? "მპოვნელის ჯილდო"
          : "Finder Reward"),

      text:
        feature3Text ||
        (ka
          ? "სურვილის შემთხვევაში შესთავაზეთ ჯილდო."
          : "Optionally offer a reward for a safe return."),

      icon: <RewardIcon />,
    },

    {
      number: "04",

      title:
        feature4Title ||
        "Privacy Control",

      text:
        feature4Text ||
        (ka
          ? "თქვენ წყვეტთ რა ინფორმაცია გამოჩნდება."
          : "You decide exactly what information is visible."),

      icon: <ShieldIcon />,
    },
  ];

  return (
    <section
      className="featuresSection"
      style={{
        background,
        paddingTop,
        paddingBottom,
      }}
    >
      <div className="shell">
        <div className="heading">
          <span className="eyebrow">
            CONNECTION & CONTROL
          </span>

          <h2
            style={{
              fontSize: `${titleSize}px`,
            }}
          >
            {title ||
              (ka
                ? "რაც საჭიროა — ზედმეტი სირთულის გარეშე."
                : "What you need — without unnecessary complexity.")}
          </h2>
        </div>

        <div className="features">
          {items.map((item) => (
            <FeatureCard
              key={item.number}
              number={item.number}
              icon={item.icon}
              title={item.title}
              text={item.text}
              titleSize={itemTitleSize}
              textSize={itemTextSize}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .featuresSection {
          width: 100%;
          color: white;
        }

        .shell {
          width: calc(100% - 56px);
          max-width: 1180px;
          margin: 0 auto;
        }

        .heading {
          max-width: 760px;
        }

        .eyebrow {
          color: #df8c90;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.6px;
        }

        h2 {
          margin: 10px 0 0;

          color: white;

          line-height: 1.07;
          letter-spacing: -1.9px;

          font-weight: 650;
        }

        .features {
          margin-top: 40px;

          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          border-top:
            1px solid
            rgba(
              255,
              255,
              255,
              0.1
            );

          border-bottom:
            1px solid
            rgba(
              255,
              255,
              255,
              0.1
            );
        }

        @media (max-width: 900px) {
          .features {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 650px) {
          .shell {
            width: calc(100% - 28px);
          }

          .features {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

function FeatureCard({
  number,
  icon,
  title,
  text,
  titleSize,
  textSize,
}: {
  number: string;
  icon: ReactNode;
  title: string;
  text: string;
  titleSize: number;
  textSize: number;
}) {
  return (
    <article className="feature">
      <div className="top">
        <span className="number">
          {number}
        </span>

        <div className="icon">
          {icon}
        </div>
      </div>

      <strong
        style={{
          fontSize: `${titleSize}px`,
        }}
      >
        {title}
      </strong>

      <p
        style={{
          fontSize: `${textSize}px`,
        }}
      >
        {text}
      </p>

      <style jsx>{`
        .feature {
          min-height: 190px;

          padding: 21px 19px;

          border-right:
            1px solid
            rgba(
              255,
              255,
              255,
              0.1
            );
        }

        .feature:last-child {
          border-right: 0;
        }

        .top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .number {
          color: #697481;

          font-size: 7px;
          font-weight: 900;
        }

        .icon {
          width: 35px;
          height: 35px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          color: #df8c90;

          background:
            rgba(
              255,
              255,
              255,
              0.06
            );
        }

        .icon :global(svg) {
          width: 15px;
          height: 15px;
        }

        strong {
          display: block;

          margin-top: 31px;

          color: white;

          font-weight: 800;
        }

        p {
          margin: 8px 0 0;

          color: #98a1ac;

          line-height: 1.65;
        }

        @media (max-width: 900px) {
          .feature {
            border-right: 0;

            border-bottom:
              1px solid
              rgba(
                255,
                255,
                255,
                0.1
              );
          }
        }
      `}</style>
    </article>
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

function RewardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M6 9h12v11H6z" />
      <path d="M4 6h16v3H4z" />
      <path d="M12 6v14" />
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
