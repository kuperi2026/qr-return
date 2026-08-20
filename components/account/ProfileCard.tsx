"use client";

import Link from "next/link";

export type ProfileCardItem = {
  id: string;
  tagCode?: string | null;
  type?: string | null;
  petType?: string | null;
  name?: string | null;
  photo?: string | null;
  active?: boolean | null;
  scanCount?: number | null;
  lostMessage?: string | null;
  lostLocation?: string | null;
};

type Props = {
  item: ProfileCardItem;
};

export default function ProfileCard({
  item,
}: Props) {
  const type = getType(item);

  const isReturnCase =
    Boolean(
      item.lostMessage ||
      item.lostLocation
    );

  return (
    <article className="card">
      <div className="visual">
        {item.photo ? (
          <img
            src={item.photo}
            alt={
              item.name ||
              getLabel(type)
            }
          />
        ) : (
          <div className="placeholder">
            {getIcon(type)}
          </div>
        )}

        <span className="tag">
          {item.tagCode ||
            "QR RETURN"}
        </span>
      </div>

      <div className="content">
        <div className="top">
          <div>
            <span className="type">
              {getLabel(type)}
            </span>

            <h3>
              {item.name ||
                getLabel(type)}
            </h3>
          </div>

          <span
            className={
              item.active
                ? "status active"
                : "status"
            }
          >
            {item.active
              ? "ACTIVE"
              : "INACTIVE"}
          </span>
        </div>

        <div className="stats">
          <div>
            <span>
              SCANS
            </span>

            <strong>
              {item.scanCount || 0}
            </strong>
          </div>

          <div>
            <span>
              RETURN CASE
            </span>

            <strong>
              {isReturnCase
                ? "YES"
                : "NO"}
            </strong>
          </div>
        </div>

        <div className="actions">
          <Link
            href={`/edit-profile/${item.id}`}
          >
            Edit
          </Link>

          {item.tagCode && (
            <Link
              href={`/scan/${item.tagCode}`}
              target="_blank"
            >
              Finder View ↗
            </Link>
          )}
        </div>
      </div>

      <style jsx>{`
        .card {
          overflow: hidden;

          border:
            1px solid #e0e5e8;

          border-radius: 15px;

          background: white;
        }

        .visual {
          height: 170px;

          position: relative;

          overflow: hidden;

          background:
            linear-gradient(
              145deg,
              #eef1f3,
              #f8f9f8
            );
        }

        .visual img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .placeholder {
          width: 100%;
          height: 100%;

          display: grid;
          place-items: center;

          font-size: 42px;
        }

        .tag {
          position: absolute;

          right: 10px;
          bottom: 10px;

          padding: 6px 8px;

          border-radius: 999px;

          color: #45515d;

          background:
            rgba(
              255,
              255,
              255,
              0.92
            );

          font-size: 6px;
          font-weight: 900;
        }

        .content {
          padding: 15px;
        }

        .top {
          display: flex;
          align-items: flex-start;
          justify-content:
            space-between;

          gap: 10px;
        }

        .type {
          color: #c84a50;

          font-size: 6px;
          font-weight: 900;
          letter-spacing: 0.8px;
        }

        h3 {
          margin: 5px 0 0;

          color: #303c47;

          font-size: 13px;
        }

        .status {
          padding: 5px 7px;

          border-radius: 999px;

          color: #7f8992;

          background: #f0f2f3;

          font-size: 6px;
          font-weight: 900;
        }

        .status.active {
          color: #276845;
          background: #edf8f2;
        }

        .stats {
          margin-top: 16px;
          padding-top: 13px;

          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 12px;

          border-top:
            1px solid #e8ebed;
        }

        .stats span,
        .stats strong {
          display: block;
        }

        .stats span {
          color: #99a2aa;

          font-size: 6px;
          font-weight: 900;
        }

        .stats strong {
          margin-top: 4px;

          color: #53606c;

          font-size: 8px;
        }

        .actions {
          margin-top: 15px;

          display: flex;
          flex-wrap: wrap;

          gap: 6px;
        }

        .actions :global(a) {
          min-height: 33px;

          padding: 0 10px;

          display: flex;
          align-items: center;

          border:
            1px solid #dfe4e8;

          border-radius: 8px;

          color: #53606c;
          background: white;

          text-decoration: none;

          font-size: 7px;
          font-weight: 850;
        }
      `}</style>
    </article>
  );
}

function getType(
  item: ProfileCardItem
) {
  if (item.type === "pet") {
    return item.petType || "pet";
  }

  return (
    item.type ||
    item.petType ||
    "other"
  );
}

function getLabel(
  type: string
) {
  const labels:
    Record<string, string> = {
      dog: "ძაღლი",
      cat: "კატა",
      pet: "Pet",
      keys: "გასაღები",
      wallet: "საფულე",
      bag: "ჩანთა",
      suitcase: "ჩემოდანი",
      luggage: "ჩემოდანი",
      emergency:
        "Emergency ID",
    };

  return labels[type] || type;
}

function getIcon(
  type: string
) {
  const icons:
    Record<string, string> = {
      dog: "🐕",
      cat: "🐈",
      pet: "🐾",
      keys: "🔑",
      wallet: "👛",
      bag: "🎒",
      suitcase: "🧳",
      luggage: "🧳",
      emergency: "🚑",
    };

  return icons[type] || "🏷️";
}
