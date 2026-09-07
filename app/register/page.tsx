"use client";

import { useEffect, useState } from "react";

const PRODUCTS = [
  { type: "dog", label: "ძაღლი", emoji: "🐶" },
  { type: "cat", label: "კატა", emoji: "🐱" },
  { type: "keys", label: "გასაღები", emoji: "🔑" },
  { type: "wallet", label: "საფულე", emoji: "👛" },
  { type: "bag", label: "ჩანთა", emoji: "👜" },
  { type: "suitcase", label: "ჩემოდანი", emoji: "🧳" },
  { type: "parking", label: "მანქანა / Parking", emoji: "🚘" },
  { type: "emergency", label: "Emergency", emoji: "🩺" },
] as const;

export default function RegisterPage() {
  const [tagQuery, setTagQuery] = useState("");

  useEffect(() => {
    const tagCode = new URLSearchParams(window.location.search).get("tag_code")?.trim().toUpperCase();
    if (tagCode) setTagQuery(`?tag_code=${encodeURIComponent(tagCode)}&test=1`);
  }, []);

  return (
    <main className="page">
      <header className="topbar">
        <a href="/" className="brand">
          <span className="brandMark">QR</span>
          <span className="brandText"><strong>QR RETURN</strong><small>SMART LOST &amp; FOUND</small></span>
        </a>
        <a href="/my-profiles" className="profilesButton">ჩემი პროფილები</a>
      </header>

      <section className="mainCard">
        <div className="intro">
          <span>PRODUCT REGISTRATION</span>
          <h1>აირჩიეთ პროდუქტი</h1>
          <p>აირჩიეთ კატეგორია და დაიწყეთ QR პროფილის შექმნა.</p>
        </div>

        <div className="productsGrid">
          {PRODUCTS.map((product) => {
            const href = product.type === "emergency" ? "/register/emergency-bracelet" : `/register-item/${product.type}${tagQuery}`;
            return (
              <a key={product.type} href={href} className={`productCard ${product.type === "emergency" ? "emergency" : ""}`}>
                <span className="productIcon">{product.emoji}</span>
                <strong>{product.label}</strong>
                <span className="arrow">→</span>
              </a>
            );
          })}
        </div>

        <div className="bottomInfo">
          <span>i</span>
          <p><strong>კატეგორია ფიქსირდება.</strong> პროფილის მონაცემების განახლება ნებისმიერ დროს შეგიძლიათ.</p>
        </div>
      </section>

      <style jsx>{`
        * { box-sizing: border-box; }
        .page { min-height: 100vh; padding: 0 28px 34px; background: #0747c9; font-family: Arial, Helvetica, sans-serif; }
        .topbar { width: 100%; max-width: 1180px; height: 72px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,.2); }
        .brand { display: flex; align-items: center; gap: 10px; color: white; text-decoration: none; }
        .brandMark { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 11px; background: white; color: #0b50ca; font-weight: 900; }
        .brandText { display: flex; flex-direction: column; }
        .brandText strong { font-size: 18px; }
        .brandText small { margin-top: 2px; color: #aecdff; font-size: 9px; font-weight: 800; letter-spacing: 1px; }
        .profilesButton { padding: 11px 18px; border: 1px solid rgba(255,255,255,.28); border-radius: 10px; background: rgba(255,255,255,.1); color: white; font-size: 12px; font-weight: 800; text-decoration: none; }
        .mainCard { width: 100%; max-width: 1180px; margin: 0 auto; padding: 30px 28px 24px; border-radius: 0 0 22px 22px; background: white; box-shadow: 0 24px 55px rgba(0,24,84,.2); }
        .intro { text-align: center; }
        .intro > span { color: #1266e9; font-size: 9px; font-weight: 900; letter-spacing: 1.4px; }
        .intro h1 { margin: 7px 0 0; color: #172b43; font-size: clamp(25px,3vw,34px); line-height: 1.1; }
        .intro p { margin: 8px 0 0; color: #77889b; font-size: 11px; }
        .productsGrid { margin-top: 24px; display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 12px; }
        .productCard { min-height: 112px; padding: 16px; display: grid; grid-template-columns: 48px minmax(0,1fr) 28px; align-items: center; gap: 12px; border: 1px solid #d8e5f6; border-radius: 16px; background: linear-gradient(145deg,#fff,#f5f9ff); color: #203951; text-decoration: none; box-shadow: 0 8px 20px rgba(29,72,128,.06); transition: .18s ease; }
        .productCard:hover { transform: translateY(-2px); border-color: #9fc2f1; box-shadow: 0 12px 24px rgba(29,72,128,.11); }
        .productCard.emergency { border-color: #b8d0f3; background: linear-gradient(145deg,#f7faff,#e8f1ff); }
        .productIcon { width: 48px; height: 48px; display: grid; place-items: center; border-radius: 13px; background: white; font-size: 24px; box-shadow: 0 5px 14px rgba(19,75,157,.08); }
        .productCard strong { font-size: 14px; line-height: 1.3; }
        .arrow { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 50%; background: #1266e9; color: white; font-weight: 900; }
        .bottomInfo { margin-top: 18px; padding: 10px 14px; display: flex; align-items: center; gap: 10px; border-radius: 11px; background: #f2f7ff; color: #61758d; }
        .bottomInfo > span { width: 24px; height: 24px; flex: 0 0 24px; display: grid; place-items: center; border-radius: 50%; background: #1266e9; color: white; font-size: 11px; font-weight: 900; }
        .bottomInfo p { margin: 0; font-size: 10px; line-height: 1.45; }
        .bottomInfo strong { color: #29435f; }
        @media (max-width: 900px) { .productsGrid { grid-template-columns: repeat(2,minmax(0,1fr)); } }
        @media (max-width: 560px) {
          .page { padding: 0 12px 24px; }
          .topbar { height: 64px; }
          .brandText small { display: none; }
          .profilesButton { padding: 9px 11px; font-size: 10px; }
          .mainCard { padding: 25px 14px 18px; }
          .productsGrid { gap: 9px; }
          .productCard { min-height: 92px; padding: 11px; grid-template-columns: 42px minmax(0,1fr) 22px; gap: 8px; }
          .productIcon { width: 42px; height: 42px; font-size: 21px; }
          .productCard strong { font-size: 12px; }
          .arrow { width: 22px; height: 22px; font-size: 11px; }
        }
      `}</style>
    </main>
  );
}
