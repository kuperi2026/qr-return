"use client";

import Link from "next/link";

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
  const latest = [...profiles]
    .filter((profile) => profile.lastScannedAt)
    .sort((a, b) => new Date(b.lastScannedAt || 0).getTime() - new Date(a.lastScannedAt || 0).getTime())[0];

  const activeCases = profiles.filter((profile) => profile.lost).length;
  const totalScans = profiles.reduce((sum, profile) => sum + (profile.scanCount || 0), 0);

  return (
    <section className="recoveryCenter" aria-label="AI Recovery Command Center">
      <div className="recoveryTitle">
        <span className="recoveryOrb">AI</span>
        <div>
          <small>KOMPASI INTELLIGENCE</small>
          <h2>დაბრუნების მართვის ცენტრი</h2>
          <p>სკანირებები, დაკარგვის რეჟიმი და სწრაფი მოქმედებები — ერთ სივრცეში.</p>
        </div>
        <span className="systemReady">● სისტემა მზადაა</span>
      </div>

      <div className="recoveryStats">
        <div><span>აქტიური ძიება</span><strong>{activeCases}</strong></div>
        <div><span>სულ დასკანირდა</span><strong>{totalScans}</strong></div>
        <div className="latestScan">
          <span>ბოლო სკანირება</span>
          <strong>{latest ? latest.name || latest.tagCode || "QR პროფილი" : "ჯერ არ ყოფილა"}</strong>
          {latest?.lastScannedAt && <small>{formatDate(latest.lastScannedAt)}</small>}
        </div>
      </div>

      {latest?.tagCode && (
        <div className="recoveryActions">
          <div>
            <span>უახლესი აქტივობა</span>
            <strong>{latest.lost ? "Lost Mode აქტიურია — სწრაფი რეაგირება რეკომენდებულია." : "QR პროფილი დასკანირდა."}</strong>
          </div>
          <div>
            <Link href="/account/chat">💬 ჩათის გახსნა</Link>
            {latest.latitude != null && latest.longitude != null && (
              <a href={`https://www.google.com/maps?q=${latest.latitude},${latest.longitude}`} target="_blank" rel="noreferrer">📍 რუკაზე ნახვა</a>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .recoveryCenter{width:calc(100% - 48px);max-width:1120px;margin:22px auto 0;padding:20px;border:1px solid rgba(255,255,255,.55);border-radius:20px;background:linear-gradient(135deg,rgba(255,255,255,.98),rgba(231,243,255,.98));box-shadow:0 18px 45px rgba(0,28,73,.2);color:#17324f}
        .recoveryTitle{display:flex;align-items:center;gap:14px}.recoveryTitle>div{flex:1}.recoveryOrb{width:54px;height:54px;display:grid;place-items:center;flex:0 0 54px;border-radius:17px;background:linear-gradient(135deg,#075ee5,#7048e8);color:#fff;font-size:18px;font-weight:950;box-shadow:0 9px 22px rgba(30,91,210,.26)}
        .recoveryTitle small{color:#6950d8;font-size:10px;font-weight:950;letter-spacing:1px}.recoveryTitle h2{margin:4px 0;color:#13375f;font-size:23px}.recoveryTitle p{margin:0;color:#58718a;font-size:14px;font-weight:650}.systemReady{padding:8px 11px;border-radius:999px;background:#e7f8ef;color:#08784b;font-size:11px;font-weight:900}
        .recoveryStats{margin-top:17px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.recoveryStats>div{min-height:86px;padding:14px;border:1px solid #d8e5f4;border-radius:14px;background:#fff}.recoveryStats span{display:block;color:#61778c;font-size:12px;font-weight:800}.recoveryStats strong{display:block;margin-top:6px;color:#0a57c8;font-size:24px}.recoveryStats .latestScan strong{font-size:16px}.recoveryStats small{display:block;margin-top:5px;color:#6c7f92;font-size:11px}
        .recoveryActions{margin-top:11px;padding:14px;display:flex;align-items:center;justify-content:space-between;gap:14px;border-radius:14px;background:#102f61;color:#fff}.recoveryActions span{display:block;color:#a9c9f4;font-size:10px;font-weight:900}.recoveryActions strong{display:block;margin-top:4px;font-size:13px}.recoveryActions>div:last-child{display:flex;gap:8px}.recoveryActions a{min-height:40px;padding:0 12px;display:inline-flex;align-items:center;border-radius:10px;background:#fff;color:#0957c5;text-decoration:none;font-size:12px;font-weight:900}
        @media(max-width:650px){.recoveryCenter{width:calc(100% - 24px);padding:16px}.recoveryTitle{align-items:flex-start;flex-wrap:wrap}.systemReady{margin-left:68px;margin-top:-8px}.recoveryStats{grid-template-columns:1fr 1fr}.latestScan{grid-column:1/-1}.recoveryActions{align-items:stretch;flex-direction:column}.recoveryActions>div:last-child{display:grid;grid-template-columns:1fr 1fr}.recoveryActions a{justify-content:center}}
      `}</style>
    </section>
  );
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("ka-GE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}
