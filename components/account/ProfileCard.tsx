"use client";

import Link from "next/link";
import QRCode from "qrcode";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export type ProfileCardItem = {
  id: string;

  tagCode?: string | null;

  type?: string | null;
  petType?: string | null;

  name?: string | null;

  photo?: string | null;

  active?: boolean | null;
  lost?: boolean | null;
  lostAt?: string | null;

  scanCount?: number | null;

  lastScannedAt?: string | null;

  lastScanLatitude?: number | null;
  lastScanLongitude?: number | null;
  lastScanAccuracy?: number | null;
  trialEndsAt?: string | null;
  serviceExpiresAt?: string | null;
  serviceStatus?: string | null;
};

type ScanHistoryEvent = {
  id: number;
  created_at: string;
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  location_shared: boolean | null;
};

type Props = {
  item: ProfileCardItem;
  onLostChange?: (item: ProfileCardItem, nextLost: boolean) => Promise<void>;
  onDelete?: (item: ProfileCardItem) => Promise<void>;
};

export default function ProfileCard({
  item,
  onLostChange,
  onDelete,
}: Props) {
  const [changingLost, setChangingLost] = useState(false);
  const [lostError, setLostError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [scanHistory, setScanHistory] = useState<ScanHistoryEvent[]>([]);
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

  async function toggleScanHistory() {
    const nextOpen = !historyOpen;
    setHistoryOpen(nextOpen);
    if (!nextOpen || historyLoaded || historyLoading) return;

    setHistoryLoading(true);
    setHistoryError("");

    const { data, error } = await supabase
      .from("scan_events")
      .select("id,created_at,latitude,longitude,accuracy,location_shared")
      .eq("item_id", item.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      setHistoryError("სკანირების ისტორიის ჩატვირთვა ვერ მოხერხდა.");
    } else {
      setScanHistory((data || []) as ScanHistoryEvent[]);
      setHistoryLoaded(true);
    }
    setHistoryLoading(false);
  }

  async function downloadProfileQR() {
    if (!item.tagCode) return;

    const cleanTag = item.tagCode.trim().toUpperCase();
    const profileUrl = `https://qr-return.vercel.app/scan/${encodeURIComponent(cleanTag)}`;
    const image = await QRCode.toDataURL(profileUrl, {
      width: 1000,
      margin: 3,
      errorCorrectionLevel: "H",
      color: { dark: "#10263f", light: "#ffffff" },
    });

    const link = document.createElement("a");
    link.href = image;
    link.download = `QR-RETURN-${cleanTag}.png`;
    link.click();
  }

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
            item.lost
              ? "status lost"
              : item.active !== false
                ? "status active"
                : "status"
          }
        >
          {item.lost ? "დაკარგულია" : item.active !== false ? "აქტიური" : "არააქტიური"}
        </span>
      </div>

      <div className="content">
        <div className="titleRow">
          <h3>
            {item.name || label}
          </h3>
        </div>

        <div className={item.lost ? "lostMode isLost" : "lostMode"}>
          <div className="lostModeText">
            <span>{item.lost ? "დაკარგვის რეჟიმი ჩართულია" : "დაკარგვის რეჟიმი"}</span>
            <strong>{item.lost ? "მპოვნელი დაინახავს, რომ პროფილი დაკარგულია." : "დაკარგვის შემთხვევაში ჩართეთ ერთი დაჭერით."}</strong>
          </div>
          <button
            type="button"
            disabled={changingLost}
            onClick={async () => {
              if (!onLostChange || changingLost) return;
              setLostError("");
              setChangingLost(true);
              try { await onLostChange(item, !item.lost); }
              catch (error) { setLostError(error instanceof Error ? error.message : "სტატუსის შეცვლა ვერ მოხერხდა."); }
              finally { setChangingLost(false); }
            }}
          >
            {changingLost ? "ინახება..." : item.lost ? "გამორთვა" : "ჩართვა"}
          </button>
        </div>
        {lostError && <div className="lostError">{lostError}</div>}

        <div className="tagBox">
          <span>
            QR კოდი
          </span>

          <strong>
            {item.tagCode ||
              "—"}
          </strong>
        </div>

        <div className={`serviceBox ${item.serviceStatus || "trial"}`}>
          <div><span>მომსახურება</span><strong>{serviceLabel(item)}</strong></div>
          <div><span>დასრულების თარიღი</span><strong>{formatServiceDate(item.serviceExpiresAt || item.trialEndsAt)}</strong></div>
          <Link href={`/account/subscriptions?profile=${encodeURIComponent(item.id)}`}>პაკეტის არჩევა →</Link>
          <Link href="/account/subscriptions#history">შეძენების ისტორია</Link>
        </div>

        <div className="stats">
          <div className="stat">
            <span>
              სკანირებების რაოდენობა
            </span>

            <strong>
              {item.scanCount
                ? `${item.scanCount}-ჯერ`
                : "0"}
            </strong>
          </div>

          <div className="stat">
            <span>
              ბოლო სკანირების თარიღი
            </span>

            <strong className="date">
              {formatScanDate(
                item.lastScannedAt
              )}
            </strong>
          </div>
        </div>

        <div className="scanHistory">
          <button type="button" onClick={toggleScanHistory}>
            <span>სკანირების ისტორია</span>
            <strong>{historyOpen ? "⌃" : "⌄"}</strong>
          </button>

          {historyOpen && (
            <div className="historyContent">
              {historyLoading && <p>ისტორია იტვირთება...</p>}
              {historyError && <p className="historyError">{historyError}</p>}
              {!historyLoading && !historyError && scanHistory.length <= 1 && (
                <p>წინა სკანირებები ჯერ არ არის.</p>
              )}
              {!historyLoading && !historyError && scanHistory.slice(1).map((event) => (
                <div className="historyRow" key={event.id}>
                  <div>
                    <strong>{formatScanDate(event.created_at)}</strong>
                    <span>{event.location_shared ? "მდებარეობა გაზიარებულია" : "მდებარეობა არ გაზიარებულა"}</span>
                  </div>
                  {event.latitude !== null && event.longitude !== null && (
                    <a href={`https://www.google.com/maps?q=${event.latitude},${event.longitude}`} target="_blank" rel="noreferrer">
                      რუკაზე ნახვა ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
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
            href={`/profile/${encodeURIComponent(item.tagCode || "")}/edit`}
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
              პროფილი მპოვნელისთვის ↗
            </Link>
          )}

          {item.tagCode && (
            <button
              type="button"
              className="qrButton"
              onClick={downloadProfileQR}
            >
              QR კოდის ჩამოტვირთვა ↓
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              className="deleteButton"
              disabled={deleting}
              onClick={async () => {
                if (deleting) return;
                const confirmed = window.confirm(`ნამდვილად გსურთ „${item.name || label}“ პროფილის წაშლა? ამ მოქმედების გაუქმება შეუძლებელია.`);
                if (!confirmed) return;
                setDeleteError("");
                setDeleting(true);
                try { await onDelete(item); }
                catch (error) { setDeleteError(error instanceof Error ? error.message : "პროფილის წაშლა ვერ მოხერხდა."); }
                finally { setDeleting(false); }
              }}
            >
              {deleting ? "იშლება..." : "პროფილის წაშლა"}
            </button>
          )}
        </div>
        {deleteError && <div className="deleteError">{deleteError}</div>}
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

          font-size: 14px;

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

        .status.lost { background:rgba(255,235,235,.97); color:#bd232b; }

        .content {
          padding:
            19px 18px 20px;
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

          font-size: 11px;

          font-weight: 900;

          letter-spacing:
            0.65px;
        }

        h3 {
          margin:
            4px 0 0;

          color:
            #263f59;

          font-size: 25px;

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
          margin-top: 17px;

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
            #075dcc;

          font-size: 14px;

          font-weight: 900;
        }

        .tagBox strong {
          margin-top: 4px;

          color:
            #172f48;

          font-size: 18px;

          font-weight: 850;

          letter-spacing:
            0.25px;

          word-break:
            break-word;
        }

        .stats {
          margin-top: 15px;

          display: grid;

          grid-template-columns: repeat(2,minmax(0,1fr));

          gap: 12px;
        }

        .lostMode{margin-top:12px;margin-bottom:14px;padding:13px;display:flex;align-items:center;gap:10px;border:1px solid #d8e5f2;border-radius:11px;background:#f8fbff}.lostMode.isLost{border-color:#f0b9bd;background:#fff3f3}.lostModeText{min-width:0;flex:1}.lostModeText span,.lostModeText strong{display:block}.lostModeText span{color:#183f63;font-size:14px;font-weight:950}.lostModeText strong{margin-top:4px;color:#4f6478;font-size:12px;line-height:1.35}.lostMode button{min-width:72px;min-height:35px;padding:0 11px;border:0;border-radius:9px;background:#1266e9;color:#fff;font-family:inherit;font-size:11px;font-weight:900;cursor:pointer}.lostMode.isLost button{background:#fff;color:#b4232c;border:1px solid #e8aeb3}.lostMode button:disabled{opacity:.6;cursor:wait}.lostError{margin-top:6px;padding:8px 10px;border-radius:8px;background:#fff0f0;color:#a51d26;font-size:11px;font-weight:800}
        .serviceBox{margin-top:16px;padding:17px;display:grid;grid-template-columns:1fr 1fr;align-items:center;column-gap:15px;row-gap:14px;border:1px solid #cfe0f3;border-radius:11px;background:#eef6ff}.serviceBox>div span,.serviceBox>div strong{display:block}.serviceBox>div span{color:#4f6478;font-size:13px;font-weight:900}.serviceBox>div strong{margin-top:5px;color:#173f64;font-size:15px;line-height:1.3}.serviceBox>a{grid-column:1/-1;padding:13px 16px;border-radius:9px;background:#075dcc;color:#fff;text-align:center;text-decoration:none;font-size:14px;font-weight:900;white-space:nowrap}.serviceBox.active{border-color:#b9e7ce;background:#edfaf3}.serviceBox.expired{border-color:#f0cccc;background:#fff4f4}@media(max-width:430px){.serviceBox{grid-template-columns:1fr 1fr}.serviceBox>a{grid-column:1/-1;text-align:center}.lostMode{align-items:flex-start}.lostMode button{min-width:68px}}

        .stat {
          min-width: 0;

          padding:
            12px 11px;

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
            #4f6478;

          font-size: 13px;

          font-weight: 900;
        }

        .stat strong {
          margin-top: 7px;

          color:
            #344f69;

          font-size: 15px;

          font-weight: 850;
        }

        .stat strong.date {
          font-size: 13px;
          white-space: normal;
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

          font-size: 12px;

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

          font-size: 12px;

          font-weight: 900;
        }

        .scanHistory{margin-top:15px;border:1px solid #d7e3ef;border-radius:10px;background:#fff}.scanHistory>button{width:100%;min-height:44px;padding:0 12px;display:flex;align-items:center;justify-content:space-between;border:0;border-radius:10px;background:#f3f8ff;color:#173f64;font-family:inherit;font-size:14px;font-weight:900;cursor:pointer}.scanHistory>button strong{color:#075dcc;font-size:18px}.historyContent{padding:4px 12px 10px}.historyContent>p{margin:9px 0;color:#60758a;font-size:13px}.historyError{color:#a51d26!important}.historyRow{padding:10px 0;display:flex;align-items:center;justify-content:space-between;gap:10px;border-top:1px solid #e5ebf2}.historyRow strong,.historyRow span{display:block}.historyRow strong{color:#263f59;font-size:13px}.historyRow span{margin-top:3px;color:#60758a;font-size:12px}.historyRow a{color:#075dcc;font-size:12px;font-weight:900;text-decoration:none;white-space:nowrap}

        .actions {
          margin-top: 16px;

          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(
                0,
                1fr
              )
            );

          gap: 11px;
        }

        .actions
        :global(a),
        .actions button {
          min-height: 46px;

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

          font-size: 13px;

          font-weight: 850;
        }

        .actions button{grid-column:1/-1;border:1px solid #b8cce3;background:#eef5ff;color:#0a4c8a;font-family:inherit;cursor:pointer}.actions .deleteButton{border-color:#efc4c7;background:#fff5f5;color:#a51d26}.actions .deleteButton:disabled{opacity:.6;cursor:wait}.deleteError{margin-top:7px;padding:9px 10px;border-radius:8px;background:#fff0f0;color:#a51d26;font-size:12px;font-weight:800}

        .actions
        :global(
          .secondaryButton
        ) {
          border:
            1px solid
            #7aacef;

          background:
            #eaf3ff;

          color:
            #075dcc;
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

      parking:
        "ავტომობილი",
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
      parking: "🚘",
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
    return "—";
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

  return new Intl.DateTimeFormat("ka-GE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function serviceLabel(item: ProfileCardItem) {
  if (item.serviceStatus === "active") return "აქტიური პაკეტი";
  if (item.serviceStatus === "expired") return "ვადა დასრულებულია";
  return "უფასო პერიოდი";
}

function formatServiceDate(value?: string | null) {
  if (!value) return "ჯერ არ არის მითითებული";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("ka-GE", { day:"numeric", month:"long", year:"numeric" }).format(date);
}
