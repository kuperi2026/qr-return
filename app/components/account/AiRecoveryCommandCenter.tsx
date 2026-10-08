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
    <section className={styles.overview} aria-label="პროფილების მიმოხილვა">
      <div className={styles.metric}>
        <span className={styles.metricLabel}>სულ პროფილი</span>
        <strong className={styles.metricValue}>{profiles.length}</strong>
      </div>
      <div className={styles.metric}>
        <span className={styles.metricLabel}>დაკარგულია</span>
        <strong className={`${styles.metricValue} ${activeCases ? styles.alertValue : ""}`}>{activeCases}</strong>
      </div>
      <div className={styles.metric}>
        <span className={styles.metricLabel}>სულ სკანირება</span>
        <strong className={styles.metricValue}>{totalScans}</strong>
      </div>
      <div className={styles.metric}>
        <span className={styles.metricLabel}>ბოლო სკანირება</span>
        <strong className={`${styles.metricValue} ${styles.latestValue}`}>{latest ? latest.name || latest.tagCode || "QR პროფილი" : "ჯერ არ ყოფილა"}</strong>
        {latest && <>
          <time className={styles.metricDate} dateTime={latest.lastScannedAt!}>{formatProfileDate(latest.lastScannedAt)}</time>
          {latest.latitude != null && latest.longitude != null && (
            <a className={styles.mapLink} href={`https://www.google.com/maps?q=${latest.latitude},${latest.longitude}`} target="_blank" rel="noreferrer"><InterfaceIcon name="pin" size={15}/>რუკაზე ნახვა</a>
          )}
        </>}
      </div>
    </section>
  );
}
