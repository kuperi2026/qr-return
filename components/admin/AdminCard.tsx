"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export type AdminCardTone =
  | "blue"
  | "cyan"
  | "violet"
  | "emerald"
  | "amber"
  | "rose";

type Props = {
  href: string;
  title: string;
  description: string;
  icon?: ReactNode;
  badge?: number | string;
  disabled?: boolean;
  tone?: AdminCardTone;
};

export default function AdminCard({
  href,
  title,
  description,
  icon,
  badge,
  disabled = false,
  tone = "blue",
}: Props) {
  const content = (
    <>
      <div className="accent" />

      <div className="top">
        <div className="iconWrap" aria-hidden="true">
          <span className="icon">
            {icon || "⚙️"}
          </span>
        </div>

        {badge !== undefined && (
          <span className="badge">
            {badge}
          </span>
        )}
      </div>

      <div className="content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <div className="bottom">
        <span>
          {disabled ? "Coming soon" : "მართვა"}
        </span>

        {!disabled && (
          <span className="arrow" aria-hidden="true">
            →
          </span>
        )}
      </div>

      <style jsx>{`
        .accent {
          position: absolute;
          inset: 0 auto auto 0;
          width: 100%;
          height: 4px;
          background: var(--gradient);
          opacity: 0.92;
        }

        .top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
        }

        .iconWrap {
          width: 82px;
          height: 82px;
          display: grid;
          place-items: center;
          border: 1px solid var(--soft-border);
          border-radius: 22px;
          background: #ffffff;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.9),
            0 10px 24px var(--shadow);
        }

        .icon {
          display: block;
          font-size: 42px;
          line-height: 1;
          filter: saturate(1.08);
          transform: translateY(-1px);
        }

        .badge {
          min-width: 30px;
          height: 30px;
          padding: 0 9px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--soft-border);
          border-radius: 999px;
          color: #0b56c5;
          background: #ffffff;
          font-size: 10px;
          font-weight: 900;
        }

        .content {
          margin-top: 25px;
        }

        h3 {
          margin: 0;
          color: #ffffff;
          font-size: 19px;
          font-weight: 850;
          letter-spacing: -0.45px;
        }

        p {
          min-height: 48px;
          margin: 9px 0 0;
          color: rgba(255, 255, 255, 0.82);
          font-size: 12px;
          line-height: 1.62;
        }

        .bottom {
          margin-top: 22px;
          padding-top: 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          font-size: 10px;
          font-weight: 900;
        }

        .arrow {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          color: #1266e9;
          background: #ffffff;
          font-size: 16px;
          transition: transform 0.2s ease;
        }
      `}</style>
    </>
  );

  const className = `adminCard ${tone} ${disabled ? "disabled" : ""}`;

  if (disabled) {
    return (
      <div className={className}>
        {content}
        <CardStyles />
      </div>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
      <CardStyles />
    </Link>
  );
}

function CardStyles() {
  return (
    <style jsx>{`
      .adminCard {
        --accent: #1266e9;
        --soft: #edf4ff;
        --soft-border: #d8e7ff;
        --shadow: rgba(18, 102, 233, 0.11);
        --gradient: linear-gradient(135deg, #1266e9, #4f8fff);

        position: relative;
        min-height: 285px;
        padding: 25px;
        display: block;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.16);
        border-radius: 23px;
        color: #ffffff;
        background:
          radial-gradient(circle at 100% 0, rgba(255, 255, 255, 0.2), transparent 40%),
          var(--gradient);
        text-decoration: none;
        box-shadow:
          0 18px 45px rgba(31, 55, 88, 0.075),
          0 2px 8px rgba(31, 55, 88, 0.035);
        transition:
          transform 0.22s ease,
          border-color 0.22s ease,
          box-shadow 0.22s ease;
      }

      .adminCard.cyan {
        --accent: #087ea4;
        --soft: #e9faff;
        --soft-border: #cceff8;
        --shadow: rgba(8, 126, 164, 0.11);
        --gradient: linear-gradient(135deg, #087ea4, #20b8d8);
      }

      .adminCard.violet {
        --accent: #6d4bd1;
        --soft: #f3efff;
        --soft-border: #e2d8ff;
        --shadow: rgba(109, 75, 209, 0.11);
        --gradient: linear-gradient(135deg, #6d4bd1, #9b78f2);
      }

      .adminCard.emerald {
        --accent: #087f5b;
        --soft: #ebfaf4;
        --soft-border: #d0f0e4;
        --shadow: rgba(8, 127, 91, 0.11);
        --gradient: linear-gradient(135deg, #087f5b, #2fbd8b);
      }

      .adminCard.amber {
        --accent: #a65f00;
        --soft: #fff7e7;
        --soft-border: #ffe7b4;
        --shadow: rgba(166, 95, 0, 0.11);
        --gradient: linear-gradient(135deg, #e28a0d, #f2b84b);
      }

      .adminCard.rose {
        --accent: #c33f62;
        --soft: #fff0f4;
        --soft-border: #ffd6e1;
        --shadow: rgba(195, 63, 98, 0.11);
        --gradient: linear-gradient(135deg, #c33f62, #ec718f);
      }

      .adminCard:hover {
        transform: translateY(-6px);
        border-color: rgba(255, 255, 255, 0.42);
        box-shadow:
          0 25px 58px rgba(31, 55, 88, 0.14),
          0 8px 20px var(--shadow);
      }

      .adminCard:hover .arrow {
        transform: translateX(3px);
      }

      .disabled {
        opacity: 0.56;
      }

      @media (prefers-reduced-motion: reduce) {
        .adminCard {
          transition: none;
        }
      }
    `}</style>
  );
}
