"use client";

import { QRIcon } from "./HomeIcons";

const products = [
  { emoji: "🐶", ka: "ძაღლი", en: "Dog", code: "PET" },
  { emoji: "🐱", ka: "კატა", en: "Cat", code: "PET" },
  { emoji: "🔑", ka: "გასაღები", en: "Keys", code: "ITEM" },
  { emoji: "👛", ka: "საფულე", en: "Wallet", code: "ITEM" },
  { emoji: "👜", ka: "ჩანთა", en: "Bag", code: "ITEM" },
  { emoji: "🧳", ka: "ჩემოდანი", en: "Suitcase", code: "TRAVEL" },
];

export default function ProductOrbit({ ka }: { ka: boolean }) {
  return (
    <div className="productShowcase">
      <div className="productGrid">
        <article className="emergencyCard">
          <div className="cardTop"><span>EMERGENCY</span><b>01</b></div>
          <div className="emergencyIcon"><QRIcon size={28} /></div>
          <strong>{ka ? "სამაჯური" : "Bracelet"}</strong>
          <small>{ka ? "ინფორმაცია · კონტაქტი · 112" : "Information · Contact · 911"}</small>
        </article>
        {products.map((product, index) => (
          <article className="productCard" key={product.en}>
            <div className="cardTop"><span>{product.code}</span><b>{String(index + 2).padStart(2, "0")}</b></div>
            <div className="emoji" aria-hidden="true">{product.emoji}</div>
            <strong>{ka ? product.ka : product.en}</strong>
            <small>QR PROFILE</small>
          </article>
        ))}
      </div>

      <style jsx>{`
        .productShowcase{width:100%}.productGrid{display:grid;grid-template-columns:repeat(7,1fr);gap:10px}.productCard,.emergencyCard{min-height:174px;padding:15px 14px;display:flex;flex-direction:column;border-radius:18px}.productCard{border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.1);color:#fff;backdrop-filter:blur(8px)}.emergencyCard{background:#fff;color:#063B72;box-shadow:0 18px 42px rgba(0,25,58,.18)}.cardTop{display:flex;justify-content:space-between;align-items:center;color:rgba(255,255,255,.57);font-size:7px;font-weight:900;letter-spacing:1px}.emergencyCard .cardTop{color:#7890a7}.cardTop b{font-size:8px}.emoji,.emergencyIcon{margin:auto 0 9px;width:52px;height:52px;display:grid;place-items:center;border-radius:15px;box-shadow:0 10px 20px rgba(0,24,55,.12)}.emoji{background:#fff;font-size:26px}.emergencyIcon{background:#063B72;color:#fff}.productCard>strong,.emergencyCard>strong{font-size:14px}.productCard>small,.emergencyCard>small{margin-top:4px;font-size:6px;font-weight:900;letter-spacing:.8px}.productCard>small{color:rgba(255,255,255,.55)}.emergencyCard>small{color:#6e879e;line-height:1.45}
        @media(max-width:1100px){.productGrid{grid-template-columns:repeat(4,1fr)}.productCard,.emergencyCard{min-height:155px}}
        @media(max-width:600px){.productGrid{grid-template-columns:repeat(2,1fr);gap:8px}.productCard,.emergencyCard{min-height:145px}.emoji,.emergencyIcon{width:48px;height:48px}.emoji{font-size:23px}.productCard>strong,.emergencyCard>strong{font-size:15px}}
      `}</style>
    </div>
  );
}
