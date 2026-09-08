"use client";

import type { ReactNode } from "react";

type Language = "ka" | "en";

type StepItem = {
  number: string;
  title: string;
  text: string;
  icon: ReactNode;
};

type Props = {
  language?: Language;

  title?: string;

  step1Title?: string;
  step1Text?: string;

  step2Title?: string;
  step2Text?: string;

  step3Title?: string;
  step3Text?: string;

  step4Title?: string;
  step4Text?: string;

  background?: string;

  paddingTop?: number;
  paddingBottom?: number;

  titleSize?: number;
  itemTitleSize?: number;
  itemTextSize?: number;

  gap?: number;
};

export default function StepsSection({
  language = "ka",

  title,

  step1Title,
  step1Text,

  step2Title,
  step2Text,

  step3Title,
  step3Text,

  step4Title,
  step4Text,

  background = "#f1f2ef",

  paddingTop = 90,
  paddingBottom = 90,

  titleSize = 43,
  itemTitleSize = 13,
  itemTextSize = 10,

  gap = 20,
}: Props) {
  const ka = language === "ka";

  const items: StepItem[] = [
    {
      number: "01",

      title:
        step1Title ||
        (ka ? "იპოვეს" : "Found"),

      text:
        step1Text ||
        (ka
          ? "მპოვნელი ხედავს QR RETURN კოდს."
          : "The finder sees the QR RETURN code."),

      icon: <SearchIcon />,
    },

    {
      number: "02",

      title:
        step2Title ||
        (ka ? "დაასკანერეს" : "Scanned"),

      text:
        step2Text ||
        (ka
          ? "აპის ჩამოტვირთვა საჭირო არ არის."
          : "No app download is required."),

      icon: <ScanIcon />,
    },

    {
      number: "03",

      title:
        step3Title ||
        (ka ? "დაგიკავშირდნენ" : "Connected"),

      text:
        step3Text ||
        (ka
          ? "Live Chat, ზარი ან თქვენ მიერ არჩეული მეთოდი."
          : "Live Chat, call, or another contact method."),

      icon: <ChatIcon />,
    },

    {
      number: "04",

      title:
        step4Title ||
        (ka ? "დაბრუნდა" : "Returned"),

      text:
        step4Text ||
        (ka
          ? "მპოვნელთან კავშირის შემდეგ დაბრუნება მარტივდება."
          : "Once connected, getting it back becomes easier."),

      icon: <ReturnIcon />,
    },
  ];

  return (
    <section
      className="stepsSection"
      style={{
        background,
        paddingTop,
        paddingBottom,
      }}
    >
      <div className="shell">
        <div className="heading">
          <span className="eyebrow">
            FIND → SCAN → CONNECT → RETURN
          </span>

          <h2
            style={{
              fontSize: `${titleSize}px`,
            }}
          >
            {title ||
              (ka
                ? "დაბრუნების გზა ოთხ ნაბიჯში."
                : "A clear return path in four steps.")}
          </h2>
        </div>

        <div
          className="steps"
          style={{
            gap: `${gap}px`,
          }}
        >
          {items.map((item, index) => (
            <StepCard
              key={item.number}
              item={item}
              titleSize={itemTitleSize}
              textSize={itemTextSize}
              showLine={index !== items.length - 1}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .stepsSection {
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

        .eyebrow {
          color: #c84a50;

          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        h2 {
          margin: 11px 0 0;

          color: #18222c;

          line-height: 1.07;
          letter-spacing: -2px;

          font-weight: 670;
        }

        .steps {
          margin-top: 44px;

          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          align-items: stretch;
        }

        @media (max-width: 900px) {
          .steps {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 650px) {
          .shell {
            width: calc(100% - 28px);
          }

          .steps {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

function StepCard({
  item,
  titleSize,
  textSize,
  showLine,
}: {
  item: StepItem;
  titleSize: number;
  textSize: number;
  showLine: boolean;
}) {
  return (
    <article className="step">
      <div className="top">
        <span className="number">
          {item.number}
        </span>

        <div className="icon">
          {item.icon}
        </div>
      </div>

      <strong
        style={{
          fontSize: `${titleSize}px`,
        }}
      >
        {item.title}
      </strong>

      <p
        style={{
          fontSize: `${textSize}px`,
        }}
      >
        {item.text}
      </p>

      {showLine && (
        <span className="line" />
      )}

      <style jsx>{`
        .step {
          min-height: 180px;

          padding: 18px 18px 16px;

          position: relative;

          border-top:
            1px solid #d8dde1;
        }

        .top {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 12px;
        }

        .number {
          color: #a9b0b8;

          font-size: 8px;
          font-weight: 900;
        }

        .icon {
          width: 46px;
          height: 46px;

          display: grid;
          place-items: center;

          border: 1px solid #dce1e5;
          border-radius: 13px;

          color: #27323d;
          background: white;
        }

        .icon :global(svg) {
          width: 18px;
          height: 18px;
        }

        strong {
          display: block;

          margin-top: 24px;

          color: #2c3743;

          font-weight: 800;
        }

        p {
          margin: 8px 0 0;

          color: #727c87;

          line-height: 1.65;
        }

        .line {
          width: 1px;

          position: absolute;

          top: 18px;
          right: -10px;
          bottom: 18px;

          background: #e0e4e7;
        }

        @media (max-width: 900px) {
          .line {
            display: none;
          }
        }
      `}</style>
    </article>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle
        cx="10.5"
        cy="10.5"
        r="6"
      />

      <path d="m15 15 5 5" />
    </svg>
  );
}

function ScanIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M4 8V5a1 1 0 0 1 1-1h3" />

      <path d="M16 4h3a1 1 0 0 1 1 1v3" />

      <path d="M20 16v3a1 1 0 0 1-1 1h-3" />

      <path d="M8 20H5a1 1 0 0 1-1-1v-3" />

      <path d="M7 12h10" />
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

function ReturnIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M9 7 4 12l5 5" />

      <path d="M5 12h9a5 5 0 0 1 5 5v2" />
    </svg>
  );
}
