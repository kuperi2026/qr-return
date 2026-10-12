"use client";

import InterfaceIcon from "@/app/components/ui/InterfaceIcon";
import { formatProfileDate } from "@/lib/profile-date";
import styles from "@/components/account/owner-space.module.css";

type RecoveryProfile = {
  id: string;
  tagCode: string | null;
  name: string | null;
  type: string | null;
  scanCount: number | null;
  lastScannedAt: string | null;
  latitude: number | null;
  longitude: number | null;
  lost: boolean | null;
};

export default function AiRecoveryCommandCenter({ profiles }: { profiles: RecoveryProfile[] }) {
  const latest = profiles.reduce<RecoveryProfile | undefined>((current, profile) => {
    const timestamp = new Date(profile.lastScannedAt || "").getTime();
    if (!Number.isFinite(timestamp)) return current;
    return !current || timestamp > new Date(current.lastScannedAt!).getTime() ? profile : current;
  }, undefined);
  const activeCases = profiles.filter((profile) => profile.lost).length;
  const totalScans = profiles.reduce((sum, profile) => sum + (profile.scanCount || 0), 0);

  return (
    <section className={styles.recoveryPanel} aria-label="დაბრუნების მართვის ცენტრი">
      <div className={styles.quickOverview}>
        <div className={styles.quickMetric}>
          <strong className={styles.metricValue}>{profiles.length}</strong>
          <span className={styles.metricLabel}>სულ პროფილი</span>
        </div>
        <div className={styles.quickMetric}>
          <strong className={`${styles.metricValue} ${activeCases ? styles.alertValue : ""}`}>{activeCases}</strong>
          <span className={styles.metricLabel}>დაკარგულია</span>
        </div>
        <div className={styles.quickMetric}>
          <strong className={styles.metricValue}>{totalScans}</strong>
          <span className={styles.metricLabel}>სულ სკანირება</span>
        </div>
      </div>
      <details className={styles.recoveryDetails}>
        <summary className={styles.recoveryToggle}>
          <span>ბოლო სკანირება: <strong>{latest ? latest.name || latest.tagCode || "QR პროფილი" : "ჯერ არ ყოფილა"}</strong></span>
          <span className={styles.detailPrompt}>დეტალები<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
        </summary>
        <div className={styles.recoveryBody}>
          <header className={styles.recoveryHeader}>
            <div><span className={styles.intelligenceLabel}>AI · KOMPASI INTELLIGENCE</span><h2>დაბრუნების მართვის ცენტრი</h2></div>
            <span className={styles.systemReady}><InterfaceIcon name="check" size={15}/>სისტემა მზადაა</span>
          </header>
          {latest && <div className={styles.latestScanDetails}>
            <time className={styles.metricDate} dateTime={latest.lastScannedAt!}>{formatProfileDate(latest.lastScannedAt)}</time>
            {latest.latitude != null && latest.longitude != null && (
              <a className={styles.mapLink} href={`https://www.google.com/maps?q=${latest.latitude},${latest.longitude}`} target="_blank" rel="noreferrer"><InterfaceIcon name="pin" size={15}/>რუკაზე ნახვა</a>
            )}
          </div>}
          <div className={styles.activityStrip}>
            <span>უახლესი აქტივობა</span>
            <strong>{latest ? `${latest.name || latest.tagCode || "QR პროფილი"} — ${latest.lost ? "დაკარგვის რეჟიმი ჩართულია; პროფილი დასკანირდა." : "QR პროფილი დასკანირდა."}` : "სკანირება ჯერ არ დაფიქსირებულა."}</strong>
          </div>
        </div>
      </details>
    </section>
  );
}
