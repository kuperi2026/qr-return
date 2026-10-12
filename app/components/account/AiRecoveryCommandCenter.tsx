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
    <section className={styles.sidebarRecovery} aria-label="დაბრუნების მართვის ცენტრი">
      <dl className={styles.sidebarStats}>
        <div>
          <dt>სულ პროფილი</dt>
          <dd>{profiles.length}</dd>
        </div>
        <div>
          <dt>დაკარგულია</dt>
          <dd className={activeCases ? styles.sidebarAlert : undefined}>{activeCases}</dd>
        </div>
        <div>
          <dt>სულ სკანირება</dt>
          <dd>{totalScans}</dd>
        </div>
      </dl>
      <div className={styles.sidebarLatest}>
        <span>ბოლო სკანირება</span>
        <strong>{latest ? latest.name || latest.tagCode || "QR პროფილი" : "ჯერ არ ყოფილა"}</strong>
        {latest && <>
          <time dateTime={latest.lastScannedAt!}>{formatProfileDate(latest.lastScannedAt)}</time>
          {latest.latitude != null && latest.longitude != null && (
            <a href={`https://www.google.com/maps?q=${latest.latitude},${latest.longitude}`} target="_blank" rel="noreferrer"><InterfaceIcon name="pin" size={15}/>რუკაზე ნახვა</a>
          )}
        </>}
      </div>
      <details className={styles.sidebarActivity}>
        <summary>
          <span>აქტივობის დეტალები</span><InterfaceIcon name="chevronDown" size={15}/>
        </summary>
        <div className={styles.sidebarActivityBody}>
          <span className={styles.sidebarIntelligence}>AI · KOMPASI INTELLIGENCE</span>
          <h2>დაბრუნების მართვის ცენტრი</h2>
          <span className={styles.sidebarReady}><InterfaceIcon name="check" size={15}/>სისტემა მზადაა</span>
          <p>{latest ? `${latest.name || latest.tagCode || "QR პროფილი"} — ${latest.lost ? "დაკარგვის რეჟიმი ჩართულია; პროფილი დასკანირდა." : "QR პროფილი დასკანირდა."}` : "სკანირება ჯერ არ დაფიქსირებულა."}</p>
        </div>
      </details>
    </section>
  );
}
