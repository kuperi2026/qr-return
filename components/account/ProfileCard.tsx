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

  lastScannedAt?: string | null;

  lastScanLatitude?: number | null;
  lastScanLongitude?: number | null;
  lastScanAccuracy?: number | null;
};

type Props = {
  item: ProfileCardItem;
};

export default function ProfileCard({
  item,
}: Props) {
  const type = getType(item);

  const label =
    getLabel(type);

  const hasLocation =
    item.lastScanLatitude !== null &&
    item.lastScanLatitude !== undefined &&
    item.lastScanLongitude !== null &&
    item.lastScanLongitude !== undefined;

  const mapsUrl =
    hasLocation
      ? `https://www.google.com/maps?q=${item.lastScanLatitude},${item.lastScanLongitude}`
      : "";

  return (
    <article className="profileCard">
      <div className="visual">
        {item.photo ? (
          <img
            src={item.photo}
            alt={
              item.name ||
              label
            }
          />
        ) : (
          <div className="placeholder">
            {getIcon(type)}
          </div>
        )}

        <div className="visualOverlay" />

        <span className="typeBadge">
          {label}
        </span>

        <span
          className={
            item.active !== false
              ? "status active"
              : "status"
          }
        >
          {item.active !== false
            ? "ACTIVE"
            : "INACTIVE"}
        </span>
      </div>

      <div className="content">
        <div className="titleRow">
          <div>
            <span className="eyebrow">
              QR RETURN PROFILE
            </span>

            <h3>
              {item.name ||
                label}
            </h3>
          </div>

          <div className="icon">
            {getIcon(type)}
          </div>
        </div>

        <div className="tagBox">
          <span>
            QR / TAG CODE
          </span>

          <strong>
            {item.tagCode ||
              "—"}
          </strong>
        </div>

        <div className="stats">
          <div className="stat">
            <span>
              SCANS
            </span>

            <strong>
              {item.scanCount || 0}
            </strong>
          </div>

          <div className="stat">
            <span>
              LAST SCAN
            </span>

            <strong className="date">
              {formatScanDate(
                item.lastScannedAt
              )}
            </strong>
          </div>
        </div>

        {hasLocation && (
          <a
            className="location"
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
          >
            <span className="locationIcon">
              ⌖
            </span>

            <span>
              ბოლო სკანირების ლოკაცია
            </span>

            <strong>
              ნახვა ↗
            </strong>
          </a>
        )}

        <div className="actions">
          <Link
            className="secondaryButton"
            href={`/edit-profile/${item.id}`}
          >
            რედაქტირება
          </Link>

          {item.tagCode && (
            <Link
              className="primaryButton"
              href={`/scan/${encodeURIComponent(
                item.tagCode
              )}`}
              target="_blank"
            >
              Finder View ↗
            </Link>
          )}
        </div>
      </div>

      <style jsx>{`
        .profileCard {
          overflow: hidden;

          width: 100%;

          border:
            1px solid #dfe7ef;

          border-radius: 16px;

          background:
            #ffffff;

          box-shadow:
            0 12px 30px
            rgba(
              24,
              55,
              90,
              0.07
            );

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }

        .profileCard:hover {
          transform:
            translateY(-2px);

          border-color:
            #cddced;

          box-shadow:
            0 16px 36px
            rgba(
              24,
              55,
              90,
              0.1
            );
        }

        .visual {
          position: relative;

          height: 148px;

          overflow: hidden;

          background:
            linear-gradient(
              135deg,
              #edf4ff,
              #f7faff
            );
        }

        .visual img {
          width: 100%;
          height: 100%;

          display: block;

          object-fit: cover;
        }

        .placeholder {
          width: 100%;
          height: 100%;

          display: grid;

          place-items: center;

          font-size: 48px;

          background:
            linear-gradient(
              135deg,
              #edf4ff,
              #f8fbff
            );
        }

        .visualOverlay {
          position: absolute;

          inset: 0;

          pointer-events: none;

          background:
            linear-gradient(
              to bottom,
              transparent 40%,
              rgba(
                0,
                24,
                70,
                0.1
              )
            );
        }

        .typeBadge,
        .status {
          position: absolute;

          top: 10px;

          min-height: 25px;

          padding:
            0 9px;

          display:
            inline-flex;

          align-items: center;

          border-radius:
            999px;

          backdrop-filter:
            blur(8px);

          font-size: 9px;

          font-weight: 900;
        }

        .typeBadge {
          left: 10px;

          background:
            rgba(
              255,
              255,
              255,
              0.92
            );

          color:
            #284761;
        }

        .status {
          right: 10px;

          background:
            rgba(
              246,
              248,
              250,
              0.94
            );

          color:
            #7e8c99;
        }

        .status.active {
          background:
            rgba(
              235,
              249,
              241,
              0.95
            );

          color:
            #28764e;
        }

        .content {
          padding:
            15px 16px 16px;
        }

        .titleRow {
          display: flex;

          align-items:
            flex-start;

          justify-content:
            space-between;

          gap: 12px;
        }

        .eyebrow {
          display: block;

          color:
            #8494a4;

          font-size: 8px;

          font-weight: 900;

          letter-spacing:
            0.65px;
        }

        h3 {
          margin:
            4px 0 0;

          color:
            #263f59;

          font-size: 18px;

          font-weight: 900;

          line-height: 1.2;
        }

        .icon {
          width: 34px;
          height: 34px;

          flex: 0 0 34px;

          display: grid;

          place-items: center;

          border-radius:
            10px;

          background:
            #f0f5fb;

          font-size: 18px;
        }

        .tagBox {
          margin-top: 13px;

          padding:
            9px 11px;

          border:
            1px solid
            #e2e9f0;

          border-radius:
            9px;

          background:
            #f9fbfd;
        }

        .tagBox span,
        .tagBox strong {
          display: block;
        }

        .tagBox span {
          color:
            #8a98a6;

          font-size: 8px;

          font-weight: 900;
        }

        .tagBox strong {
          margin-top: 3px;

          color:
            #31506b;

          font-size: 11px;

          font-weight: 850;

          letter-spacing:
            0.25px;

          word-break:
            break-word;
        }

        .stats {
          margin-top: 9px;

          display: grid;

          grid-template-columns:
            86px
            minmax(
              0,
              1fr
            );

          gap: 7px;
        }

        .stat {
          min-width: 0;

          padding:
            8px 9px;

          border-radius:
            9px;

          background:
            #f7faff;
        }

        .stat span,
        .stat strong {
          display: block;
        }

        .stat span {
          color:
            #8d9baa;

          font-size: 8px;

          font-weight: 900;
        }

        .stat strong {
          margin-top: 3px;

          color:
            #344f69;

          font-size: 12px;

          font-weight: 850;
        }

        .stat strong.date {
          overflow: hidden;

          font-size: 10px;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;
        }

        .location {
          margin-top: 8px;

          min-height: 37px;

          padding:
            0 10px;

          display: flex;

          align-items: center;

          gap: 7px;

          box-sizing:
            border-box;

          border:
            1px solid
            #d7e5f5;

          border-radius:
            9px;

          background:
            #f3f8ff;

          color:
            #536c85;

          text-decoration:
            none;

          font-size: 9px;

          font-weight: 700;
        }

        .locationIcon {
          width: 21px;
          height: 21px;

          flex:
            0 0 21px;

          display: grid;

          place-items:
            center;

          border-radius:
            50%;

          background:
            #e5efff;

          color:
            #0647c8;

          font-size: 12px;

          font-weight: 900;
        }

        .location strong {
          margin-left:
            auto;

          color:
            #0647c8;

          font-size: 9px;

          font-weight: 900;
        }

        .actions {
          margin-top: 12px;

          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(
                0,
                1fr
              )
            );

          gap: 7px;
        }

        .actions
        :global(a) {
          min-height: 39px;

          padding:
            0 10px;

          display:
            inline-flex;

          align-items:
            center;

          justify-content:
            center;

          box-sizing:
            border-box;

          border-radius:
            9px;

          text-decoration:
            none;

          font-size: 10px;

          font-weight: 850;
        }

        .actions
        :global(
          .secondaryButton
        ) {
          border:
            1px solid
            #d9e3ec;

          background:
            #ffffff;

          color:
            #587086;
        }

        .actions
        :global(
          .primaryButton
        ) {
          border:
            1px solid
            #0647c8;

          background:
            #0647c8;

          color:
            #ffffff;
        }

        @media (
          max-width: 480px
        ) {
          .visual {
            height:
              135px;
          }

          .content {
            padding:
              14px;
          }

          .actions {
            grid-template-columns:
              1fr;
          }
        }
      `}</style>
    </article>
  );
}

function getType(
  item: ProfileCardItem
) {
  if (
    item.type === "pet"
  ) {
    return (
      item.petType ||
      "pet"
    );
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
    Record<
      string,
      string
    > = {
      dog:
        "ძაღლი",

      cat:
        "კატა",

      pet:
        "ცხოველი",

      keys:
        "გასაღები",

      wallet:
        "საფულე",

      bag:
        "ჩანთა",

      suitcase:
        "ჩემოდანი",

      luggage:
        "ჩემოდანი",
    };

  return (
    labels[type] ||
    type
  );
}

function getIcon(
  type: string
) {
  const icons:
    Record<
      string,
      string
    > = {
      dog: "🐶",
      cat: "🐱",
      pet: "🐾",

      keys: "🔑",
      wallet: "👛",
      bag: "👜",
      suitcase: "🧳",
      luggage: "🧳",
    };

  return (
    icons[type] ||
    "🏷️"
  );
}

function formatScanDate(
  value?: string | null
) {
  if (!value) {
    return "ჯერ არა";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleString();
}
