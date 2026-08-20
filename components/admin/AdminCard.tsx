"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  title: string;
  description: string;

  icon?: ReactNode;

  badge?: number | string;

  disabled?: boolean;
};

export default function AdminCard({
  href,
  title,
  description,
  icon,
  badge,
  disabled = false,
}: Props) {
  const content = (
    <>
      <div className="top">
        <div className="icon">
          {icon || "⚙️"}
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
          {disabled
            ? "Coming soon"
            : "Open"}
        </span>

        {!disabled && (
          <span className="arrow">
            →
          </span>
        )}
      </div>

      <style jsx>{`
        .top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .icon {
          width: 43px;
          height: 43px;

          display: grid;
          place-items: center;

          border-radius: 12px;

          color: #26323e;
          background: #f1f4f6;

          font-size: 18px;
        }

        .badge {
          min-width: 26px;
          height: 26px;

          padding: 0 8px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border-radius: 999px;

          color: #9c3f45;
          background: #fff0f1;

          font-size: 8px;
          font-weight: 900;
        }

        .content {
          margin-top: 23px;
        }

        h3 {
          margin: 0;

          color: #28343f;

          font-size: 15px;
          font-weight: 800;
          letter-spacing: -0.35px;
        }

        p {
          min-height: 42px;

          margin: 7px 0 0;

          color: #7b8691;

          font-size: 9px;
          line-height: 1.6;
        }

        .bottom {
          margin-top: 20px;
          padding-top: 13px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border-top:
            1px solid #edf0f2;

          color: #52606d;

          font-size: 8px;
          font-weight: 850;
        }

        .arrow {
          font-size: 14px;
        }
      `}</style>
    </>
  );

  if (disabled) {
    return (
      <div className="card disabled">
        {content}

        <style jsx>{`
          .card {
            min-height: 210px;
            padding: 18px;

            border:
              1px solid #e1e5e8;

            border-radius: 15px;

            background: white;
          }

          .disabled {
            opacity: 0.55;
          }
        `}</style>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="card"
    >
      {content}

      <style jsx>{`
        .card {
          min-height: 210px;
          padding: 18px;

          display: block;

          border:
            1px solid #e1e5e8;

          border-radius: 15px;

          color: inherit;
          background: white;

          text-decoration: none;

          box-shadow:
            0 8px 25px
            rgba(
              32,
              43,
              55,
              0.025
            );

          transition:
            transform 0.17s ease,
            border-color 0.17s ease,
            box-shadow 0.17s ease;
        }

        .card:hover {
          transform:
            translateY(-2px);

          border-color: #ccd4da;

          box-shadow:
            0 14px 32px
            rgba(
              32,
              43,
              55,
              0.055
            );
        }
      `}</style>
    </Link>
  );
}
