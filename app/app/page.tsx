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
        <div className="entryMark" aria-hidden="true">⌁</div>
        <small>KOMPASI</small>
        <h1 id="entry-title">კეთილი იყოს თქვენი მობრძანება</h1>
        <p>შედით არსებულ ანგარიშში, შექმენით ახალი ან ჯერ თავისუფლად დაათვალიერეთ აპლიკაცია.</p>
        <div className="entryActions">
          <Link className="register" href="/signup?source=app&next=%2Fapp%2Fproducts">რეგისტრაცია</Link>
          <Link className="login" href="/login?source=app&next=%2Fapp%2Fproducts">შესვლა</Link>
          <Link className="browse" href="/app/products"><span>დათვალიერება რეგისტრაციის გარეშე</span><b aria-hidden="true">›</b></Link>
        </div>
      </section>
      <style jsx>{`
        .appEntry{min-height:100vh;padding:24px 12px 104px;display:grid;place-items:center;background:radial-gradient(circle at 18% 8%,rgba(91,186,255,.42),transparent 30%),linear-gradient(160deg,#0a5ca8 0%,#073f78 56%,#052d59 100%);font-family:Inter,Arial,sans-serif;color:#fff}
        .entryCard{width:min(440px,100%);padding:28px 20px 20px;border:1px solid rgba(255,255,255,.34);border-radius:24px;background:rgba(5,49,94,.42);box-shadow:0 22px 52px rgba(0,20,52,.3),inset 0 1px 0 rgba(255,255,255,.2);backdrop-filter:blur(14px);text-align:center}
        .entryMark{width:66px;height:66px;margin:0 auto 15px;display:grid;place-items:center;border-radius:20px;background:#fff;color:#0870d8;font-size:38px;font-weight:950;box-shadow:0 13px 28px rgba(0,22,58,.26)}
        small{color:#bdddff;font-size:11px;font-weight:950;letter-spacing:1.5px}h1{margin:8px 0 0;font-size:27px;line-height:1.18;letter-spacing:-.5px}p{margin:10px auto 0;max-width:360px;color:#d9ecff;font-size:13px;line-height:1.55}
        .entryActions{margin-top:24px;display:grid;grid-template-columns:1fr 1fr;gap:10px}.entryActions a{min-height:54px;padding:0 15px;display:flex;align-items:center;justify-content:center;border-radius:14px;font-size:14px;font-weight:900;text-decoration:none}.register{background:#fff;color:#075dcc;box-shadow:0 10px 22px rgba(0,25,65,.2)}.login{border:1px solid rgba(255,255,255,.58);background:rgba(255,255,255,.12);color:#fff}.entryActions .browse{grid-column:1/-1;justify-content:space-between;border:1px solid rgba(158,234,208,.65);background:linear-gradient(120deg,rgba(10,151,104,.88),rgba(11,116,229,.82));color:#fff}.browse b{font-size:25px;line-height:1}
      `}</style>
    </main>
  );
}
