"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function AppHome() {
  useEffect(() => {
    window.localStorage.setItem("kompasi-app-mode", "1");
  }, []);

  return (
    <main className="appEntry">
      <section className="entryCard" aria-labelledby="entry-title">
        <div className="entryMark" aria-hidden="true">K</div>
        <small>KOMPASI</small>
        <h1 id="entry-title">დაკარგული ნივთები<br />უსაფრთხოდ ბრუნდება.</h1>
        <p>ერთი QR კოდი — მშვიდი კავშირი მპოვნელთან და სრული კონტროლი თქვენს ხელში.</p>
        <div className="entryActions">
          <Link className="register" href="/signup?source=app&next=%2Fapp%2Fproducts">რეგისტრაცია</Link>
          <Link className="login" href="/login?source=app&next=%2Fapp%2Fproducts">შესვლა</Link>
          <Link className="browse" href="/app/products">დათვალიერება რეგისტრაციის გარეშე</Link>
        </div>
        <p className="entryNote">დათვალიერება თავისუფალია • რეგისტრაცია საჭიროა მხოლოდ მოქმედებისთვის</p>
      </section>
      <style jsx>{`
        .appEntry{min-height:100vh;padding:70px 32px 30px;display:block;background:linear-gradient(96.6deg,#0861b8 0%,#05294f 100%);font-family:"Noto Sans Georgian",Inter,Arial,sans-serif;color:#fff}
        .entryCard{width:min(326px,100%);min-height:744px;margin:0 auto;padding:0;border:0;background:transparent;box-shadow:none;text-align:center}
        .entryMark{width:72px;height:72px;margin:0 auto 12px;display:grid;place-items:center;border-radius:22px;background:#fff;color:#086ed9;font-size:30px;font-weight:950;box-shadow:none}
        small{display:block;height:20px;color:#b8dbff;font-size:11px;font-weight:900;letter-spacing:1.65px}h1{margin:12px 0 0;font-size:29px;line-height:1.18;letter-spacing:0}p{margin:12px auto 0;width:min(318px,100%);color:#d6ebff;font-size:13px;line-height:1.55}
        .entryActions{margin-top:70px;display:grid;grid-template-columns:1fr;gap:12px}.entryActions a{width:100%;height:56px;padding:0 18px;display:flex;align-items:center;justify-content:center;border-radius:16px;font-size:15px;font-weight:900;text-decoration:none;box-shadow:0 8px 18px rgba(3,20,46,.12)}.register{background:#fff;color:#085ebd}.login{border:0;background:#0aa369;color:#fff}.entryActions .browse{border:1px solid #5cabe8;background:#0f3d6b;color:#e0f2ff}.entryNote{margin-top:12px;color:#abcfed;font-size:10px;line-height:1.45}
      `}</style>
    </main>
  );
}
