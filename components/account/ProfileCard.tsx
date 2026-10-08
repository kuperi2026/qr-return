"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatProfileDate } from "@/lib/profile-date";
import styles from "./owner-space.module.css";
import InterfaceIcon from "@/app/components/ui/InterfaceIcon";

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
  serviceStartsAt?: string | null;
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
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
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
    if (!item.tagCode || downloading) return;
    setDownloading(true);
    setDownloadError("");
    try {
      const QRCode = (await import("qrcode")).default;
      const cleanTag = item.tagCode.trim().toUpperCase();
      const profileUrl = `https://qr-return.vercel.app/scan/${encodeURIComponent(cleanTag)}`;
      const image = await QRCode.toDataURL(profileUrl, {
        width: 1000, margin: 3, errorCorrectionLevel: "H",
        color: { dark: "#10263f", light: "#ffffff" },
      });
      const link = document.createElement("a");
      link.href = image;
      link.download = `QR-RETURN-${cleanTag}.png`;
      link.click();
    } catch {
      setDownloadError("QR კოდის ჩამოტვირთვა ვერ მოხერხდა. სცადეთ ხელახლა.");
    } finally {
      setDownloading(false);
    }
  }

  async function changeLostMode() {
    if (!onLostChange || changingLost) return;
    setLostError("");
    setChangingLost(true);
    try { await onLostChange(item, !item.lost); }
    catch (error) { setLostError(error instanceof Error ? error.message : "სტატუსის შეცვლა ვერ მოხერხდა."); }
    finally { setChangingLost(false); }
  }

  async function deleteProfile() {
    if (!onDelete || deleting) return;
    if (!window.confirm(`ნამდვილად გსურთ „${item.name || label}“ პროფილის წაშლა? ამ მოქმედების გაუქმება შეუძლებელია.`)) return;
    setDeleteError("");
    setDeleting(true);
    try { await onDelete(item); }
    catch (error) { setDeleteError(error instanceof Error ? error.message : "პროფილის წაშლა ვერ მოხერხდა."); }
    finally { setDeleting(false); }
  }

  return (
    <article className={`${styles.card} ${item.lost ? styles.cardLost : ""}`} aria-labelledby={`profile-${item.id}`}>
      <div className={styles.cardHeader}>
        <div className={styles.avatar}>
          {item.photo ? <img src={item.photo} alt={item.name || label}/> : <InterfaceIcon name="profiles" size={28}/>}
        </div>
        <div className={styles.identity}>
          <span className={styles.type}>{label}</span>
          <h3 id={`profile-${item.id}`}>{item.name || label}</h3>
        </div>
        <span className={`${styles.status} ${item.lost ? styles.statusLost : item.active === false ? styles.statusInactive : ""}`}>
          {item.lost ? "დაკარგულია" : item.active === false ? "არააქტიური" : "აქტიური"}
        </span>
      </div>

      <div className={styles.qrCode}><span>QR კოდი</span><strong>{item.tagCode || "—"}</strong></div>
      <div className={`${styles.lostMode} ${item.lost ? styles.lostModeActive : ""}`}>
        <div><strong>დაკარგვის რეჟიმი</strong><small>{item.lost ? "მპოვნელი ხედავს დაკარგვის სტატუსს" : "ჩართეთ, თუ ნივთი დაიკარგა"}</small></div>
        <button type="button" onClick={changeLostMode} disabled={changingLost || !onLostChange} aria-pressed={!!item.lost} aria-label={`${item.name || label}: დაკარგვის რეჟიმი`}>
          {changingLost ? "ინახება..." : item.lost ? "გამორთვა" : "ჩართვა"}
        </button>
      </div>
      {lostError && <p className={styles.cardError} role="alert">{lostError}</p>}

      <div className={`${styles.service} ${item.serviceStatus === "expired" ? styles.serviceExpired : ""}`}>
        <div>
          <strong>{serviceLabel(item)}</strong>
          <small>{item.serviceStatus === "expired" ? "დასრულდა:" : "ვადა:"} {formatProfileDate(item.serviceExpiresAt || item.trialEndsAt, false)}</small>
        </div>
        <Link href={`/account/subscriptions?profile=${encodeURIComponent(item.id)}`}>პაკეტის არჩევა</Link>
      </div>
      <div className={styles.scanSummary}>
        <div><span>სკანირებები</span><strong>{item.scanCount || 0}</strong></div>
        <div><span>ბოლო სკანირება</span><strong>{formatProfileDate(item.lastScannedAt)}</strong></div>
      </div>
      <div className={styles.cardActions}>
        {item.tagCode && <>
          <Link className={styles.button} href={`/profile/${encodeURIComponent(item.tagCode)}/edit`}>რედაქტირება</Link>
          <button type="button" className={styles.primaryButton} onClick={downloadProfileQR} disabled={downloading}>{downloading ? "მზადდება..." : "QR-ის ჩამოტვირთვა"}</button>
        </>}
      </div>
      {downloadError && <p className={styles.cardError} role="alert">{downloadError}</p>}

      <details className={styles.details}>
        <summary>ისტორია და სხვა მოქმედებები<span className={styles.chevron} aria-hidden="true"/></summary>
        <div className={styles.extraActions}>
          {item.tagCode && <Link href={`/scan/${encodeURIComponent(item.tagCode)}`} target="_blank" rel="noreferrer">პროფილი მპოვნელისთვის</Link>}
          <Link href={`/account/admin?profile=${encodeURIComponent(item.id)}`}>ადმინის დამატება</Link>
          {hasLocation && <a href={mapsUrl} target="_blank" rel="noreferrer">ბოლო მდებარეობა</a>}
        </div>
        {item.serviceStatus === "active" && item.serviceStartsAt && <p className={styles.timezone}>პაკეტი ჩაირთო: {formatProfileDate(item.serviceStartsAt)}</p>}
        <p className={styles.timezone}>პაკეტის ვადა: {formatProfileDate(item.serviceExpiresAt || item.trialEndsAt)} · თბილისის დროით</p>
        <button type="button" className={styles.historyToggle} onClick={toggleScanHistory} aria-expanded={historyOpen} aria-controls={`history-${item.id}`}>
          სკანირების ისტორია <span aria-hidden="true">{historyOpen ? "−" : "+"}</span>
        </button>
        {historyOpen && <div className={styles.history} id={`history-${item.id}`}>
          {historyLoading && <p role="status">ისტორია იტვირთება...</p>}
          {historyError && <p role="alert">{historyError}</p>}
          {!historyLoading && !historyError && scanHistory.length === 0 && <p>სკანირების ისტორია ცარიელია.</p>}
          {!historyLoading && !historyError && scanHistory.map((event) => <div className={styles.historyRow} key={event.id}>
            <div><strong>{formatProfileDate(event.created_at)}</strong><span>{event.location_shared ? "მდებარეობა გაზიარებულია" : "მდებარეობა არ გაზიარებულა"}</span></div>
            {event.latitude !== null && event.longitude !== null && <a href={`https://www.google.com/maps?q=${event.latitude},${event.longitude}`} target="_blank" rel="noreferrer">რუკა</a>}
          </div>)}
        </div>}
        {onDelete && <div className={styles.extraActions}>
          <button type="button" className={styles.delete} disabled={deleting} onClick={deleteProfile}>{deleting ? "იშლება..." : "პროფილის წაშლა"}</button>
        </div>}
        {deleteError && <p className={styles.cardError} role="alert">{deleteError}</p>}
      </details>
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

      emergency:
        "ემერჯენსი სამაჯური",
    };

  return (
    labels[type] ||
    type
  );
}

function serviceLabel(item: ProfileCardItem) {
  if (item.serviceStatus === "active") return "აქტიური პაკეტი";
  if (item.serviceStatus === "expired") return "ვადა დასრულებულია";
  return "უფასო პერიოდი";
}
