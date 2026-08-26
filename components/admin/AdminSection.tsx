"use client";

import type { ReactNode } from "react";
import AdminCard, {
  type AdminCardTone,
} from "./AdminCard";

export type AdminSectionItem = {
  href: string;
  title: string;
  description: string;
  icon?: ReactNode;
  badge?: number | string;
  disabled?: boolean;
  tone?: AdminCardTone;
};

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  items: AdminSectionItem[];
};

export default function AdminSection({
  eyebrow,
  title,
  description,
  items,
}: Props) {
  return (
    <section className="section">
      <div className="heading">
        <div>
          {eyebrow && (
            <span className="eyebrow">
              {eyebrow}
            </span>
          )}

          <h2>{title}</h2>

          {description && (
            <p>{description}</p>
          )}
        </div>

        <span className="count">
          {items.length}
        </span>
      </div>

      <div className="grid">
        {items.map((item) => (
          <AdminCard
            key={`${item.href}-${item.title}`}
            href={item.href}
            title={item.title}
            description={item.description}
            icon={item.icon}
            badge={item.badge}
            disabled={item.disabled}
            tone={item.tone}
          />
        ))}
      </div>

      <style jsx>{`
        .section {
          width: 100%;
        }

        .heading {
          margin-bottom: 22px;

          display: flex;
          align-items: flex-end;
          justify-content: space-between;

          gap: 20px;
        }

        .eyebrow {
          color: #c84a50;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        h2 {
          margin: 7px 0 0;

          color: #27333e;

          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.8px;
        }

        p {
          max-width: 650px;

          margin: 6px 0 0;

          color: #7f8a95;

          font-size: 11px;
          line-height: 1.6;
        }

        .count {
          min-width: 31px;
          height: 31px;

          padding: 0 9px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border: 1px solid #dfe4e8;
          border-radius: 999px;

          color: #73808c;
          background: white;

          font-size: 8px;
          font-weight: 900;
        }

        .grid {
          display: grid;

          grid-template-columns:
            repeat(
              3,
              minmax(0, 1fr)
            );

          gap: 18px;
        }

        @media (max-width: 950px) {
          .grid {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }
        }

        @media (max-width: 620px) {
          .heading {
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
