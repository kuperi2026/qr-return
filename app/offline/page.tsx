"use client";

import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="offlinePage">
      <section>
        <span className="compass">✦</span>
        <small>KOMPASI</small>
        <h1>ინტერნეტთან კავშირი შეწყდა</h1>
        <p>თქვენი პირადი მონაცემები უსაფრთხოების მიზნით ოფლაინ რეჟიმში არ ინახება. კავშირის აღდგენის შემდეგ განაახლეთ გვერდი.</p>
        <Link href="/my-profiles">ხელახლა ცდა</Link>
      </section>
      <style jsx>{`
        .offlinePage{min-height:100vh;padding:24px;display:grid;place-items:center;background:radial-gradient(circle at 25% 15%,rgba(91,180,255,.45),transparent 32%),linear-gradient(145deg,#0756ae,#052b68);font-family:Arial,sans-serif}.offlinePage section{width:min(460px,100%);padding:34px 26px;border:1px solid rgba(255,255,255,.72);border-radius:28px;background:rgba(255,255,255,.96);box-shadow:0 28px 70px rgba(0,20,60,.38);text-align:center;color:#17324f}.compass{width:70px;height:70px;margin:0 auto 15px;display:grid;place-items:center;border-radius:22px;background:linear-gradient(135deg,#0b71ed,#5b4ee4);color:#fff;font-size:37px;box-shadow:0 12px 28px rgba(32,93,214,.3)}small{color:#6950d8;font-size:11px;font-weight:950;letter-spacing:1.5px}h1{margin:9px 0 0;font-size:25px}p{margin:12px 0 0;color:#60758b;font-size:14px;line-height:1.6}a{min-height:46px;margin-top:20px;padding:0 18px;display:inline-flex;align-items:center;border-radius:13px;background:#0b62df;color:#fff;text-decoration:none;font-size:14px;font-weight:900}
      `}</style>
    </main>
  );
}
