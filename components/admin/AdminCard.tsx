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
        .top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
        }

        .iconWrap {
          width: 92px;
          height: 92px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.28);
          border-radius: 24px;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.12);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15);
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
          border: 1px solid rgba(255, 255, 255, 0.28);
          border-radius: 999px;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.12);
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
          display: flex;
          align-items: center;
          justify-content: space-between;
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
          color: #ffffff;
          background: rgba(255, 255, 255, 0.14);
          font-size: 16px;
          transition: transform 0.2s ease;
        }
        :global(.adminIcon) {
          width: 54px;
          height: 54px;
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
        background: #0b52d6;
        text-decoration: none;
        box-shadow:
          0 18px 45px rgba(31, 55, 88, 0.075),
          0 2px 8px rgba(31, 55, 88, 0.035);
        transition:
          transform 0.22s ease,
          border-color 0.22s ease,
          box-shadow 0.22s ease;
      }

      .adminCard:hover {
        transform: translateY(-6px);
        border-color: rgba(255, 255, 255, 0.42);
        box-shadow:
          0 25px 58px rgba(31, 55, 88, 0.14),
          0 8px 20px rgba(0, 29, 103, 0.24);
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
