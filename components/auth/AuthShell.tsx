"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;

  children: ReactNode;

  footerText?: string;
  footerHref?: string;
  footerLinkText?: string;
};

export default function AuthShell({
  eyebrow = "QR RETURN",
  title,
  description,
  children,
  footerText,
  footerHref,
  footerLinkText,
}: Props) {
  return (
    <main className="page">
      <div className="shell">
        <Link
          href="/"
          className="brand"
        >
          <div className="logo">
            <QRIcon />
          </div>

          <div>
            <strong>
              QR RETURN
            </strong>

            <span>
              SMART QR CONNECTION
            </span>
          </div>
        </Link>

        <section className="card">
          <div className="heading">
            <span className="eyebrow">
              {eyebrow}
            </span>

            <h1>{title}</h1>

            {description && (
              <p>
                {description}
              </p>
            )}
          </div>

          <div className="content">
            {children}
          </div>

          {footerText &&
            footerHref &&
            footerLinkText && (
              <div className="footer">
                <span>
                  {footerText}
                </span>

                <Link href={footerHref}>
                  {footerLinkText}
                </Link>
              </div>
            )}
        </section>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;

          padding: 50px 20px;

          display: grid;
          place-items: center;

          background:
            radial-gradient(
              circle at 85% 10%,
              rgba(65, 97, 130, 0.08),
              transparent 28%
            ),
            #f5f7f8;
        }

        .shell {
          width: 100%;
          max-width: 470px;
        }

        .brand {
          display: inline-flex;
          align-items: center;

          gap: 10px;

          color: #202b37;

          text-decoration: none;
        }

        .logo {
          width: 40px;
          height: 40px;

          display: grid;
          place-items: center;

          border-radius: 11px;

          color: white;
          background: #202b37;
        }

        .logo :global(svg) {
          width: 20px;
          height: 20px;
        }

        .brand strong,
        .brand span {
          display: block;
        }

        .brand strong {
          font-size: 14px;
          font-weight: 850;
        }

        .brand span {
          margin-top: 3px;

          color: #98a1aa;

          font-size: 5px;
          font-weight: 900;
          letter-spacing: 1.2px;
        }

        .card {
          margin-top: 26px;
          padding: 28px;

          border:
            1px solid #e0e5e8;

          border-radius: 18px;

          background: white;

          box-shadow:
            0 18px 45px
            rgba(
              32,
              43,
              55,
              0.05
            );
        }

        .eyebrow {
          color: #c84a50;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.3px;
        }

        h1 {
          margin: 7px 0 0;

          color: #202b37;

          font-size: 32px;
          font-weight: 760;
          letter-spacing: -1.3px;
        }

        .heading p {
          margin: 9px 0 0;

          color: #7a8690;

          font-size: 9px;
          line-height: 1.65;
        }

        .content {
          margin-top: 24px;
        }

        .footer {
          margin-top: 22px;
          padding-top: 16px;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 5px;

          border-top:
            1px solid #eceff1;

          color: #89939d;

          font-size: 8px;
        }

        .footer :global(a) {
          color: #225fc7;

          font-weight: 850;

          text-decoration: none;
        }

        @media (max-width: 520px) {
          .page {
            padding: 25px 14px;
          }

          .card {
            padding: 21px;
          }
        }
      `}</style>
    </main>
  );
}

function QRIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
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
