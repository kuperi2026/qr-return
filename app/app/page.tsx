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
        <small>KOMPASI · დაცული კავშირი</small>
        <h1 id="entry-title">კეთილი იყოს თქვენი მობრძანება</h1>
        <p>შედით არსებულ ანგარიშში, შექმენით ახალი ან ჯერ თავისუფლად დაათვალიერეთ აპლიკაცია.</p>
        <div className="entryActions">
          <Link className="register" href="/signup?source=app&next=%2Fapp%2Fproducts">რეგისტრაცია</Link>
          <Link className="login" href="/login?source=app&next=%2Fapp%2Fproducts">შესვლა</Link>
          <Link className="browse" href="/app/products"><span>დათვალიერება რეგისტრაციის გარეშე</span><b aria-hidden="true">›</b></Link>
        </div>
      </section>
      <style jsx>{`
        .appEntry{min-height:100vh;padding:24px 14px 104px;display:grid;place-items:center;background:radial-gradient(circle at 15% 5%,rgba(115,205,255,.28),transparent 32%),linear-gradient(180deg,#edf8ff 0%,#fbfeff 75%);font-family:Inter,Arial,sans-serif;color:#163a52}
        .entryCard{width:min(440px,100%);padding:28px 20px 20px;border:1px solid #d9e9f2;border-radius:28px;background:#fff;box-shadow:0 20px 48px rgba(16,59,92,.12);text-align:center}
        .entryMark{width:66px;height:66px;margin:0 auto 15px;display:grid;place-items:center;border-radius:20px;background:linear-gradient(145deg,#103b5c,#1478d4);color:#fff;font-size:28px;font-weight:950;box-shadow:0 13px 28px rgba(20,120,212,.24)}
        small{color:#1478d4;font-size:10px;font-weight:950;letter-spacing:1.2px}h1{margin:8px 0 0;font-size:27px;line-height:1.18;letter-spacing:-.5px}p{margin:10px auto 0;max-width:360px;color:#758b99;font-size:13px;line-height:1.55}
        .entryActions{margin-top:24px;display:grid;grid-template-columns:1fr 1fr;gap:10px}.entryActions a{min-height:54px;padding:0 15px;display:flex;align-items:center;justify-content:center;border-radius:14px;font-size:14px;font-weight:900;text-decoration:none}.register{background:#1478d4;color:#fff;box-shadow:0 10px 22px rgba(20,120,212,.2)}.login{border:1px solid #bdd9ec;background:#eff7fc;color:#103b5c}.entryActions .browse{grid-column:1/-1;justify-content:space-between;border:1px solid #bfe7d8;background:#e5f7f0;color:#167457}.browse b{font-size:25px;line-height:1}
      `}</style>
    </main>
  );
}
