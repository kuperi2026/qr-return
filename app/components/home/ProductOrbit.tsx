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
      <article className="emergencyCard">
        <div className="emergencyIcon"><QRIcon size={34} /></div>
        <div>
          <span>EMERGENCY</span>
          <strong>{ka ? "სამაჯური" : "Bracelet"}</strong>
          <small>{ka ? "სამედიცინო ინფორმაცია · კონტაქტი · 112" : "Medical information · Contact · 911"}</small>
        </div>
        <b>01</b>
      </article>

      <div className="productGrid">
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
        .productShowcase{width:100%}.emergencyCard{min-height:138px;padding:22px 24px;display:grid;grid-template-columns:72px 1fr auto;align-items:center;gap:18px;border-radius:22px;background:#fff;color:#063B72;box-shadow:0 20px 50px rgba(0,25,58,.18)}.emergencyIcon{width:66px;height:66px;display:grid;place-items:center;border-radius:17px;background:#063B72;color:#fff}.emergencyCard span,.emergencyCard strong,.emergencyCard small{display:block}.emergencyCard span{color:#6e88a1;font-size:8px;font-weight:900;letter-spacing:1.5px}.emergencyCard strong{margin-top:7px;font-size:23px}.emergencyCard small{margin-top:5px;color:#58728b;font-size:10px;font-weight:750}.emergencyCard>b{color:#d2deea;font-size:27px}.productGrid{margin-top:12px;display:grid;grid-template-columns:repeat(6,1fr);gap:10px}.productCard{min-height:174px;padding:15px 14px;display:flex;flex-direction:column;border:1px solid rgba(255,255,255,.3);border-radius:18px;background:rgba(255,255,255,.1);color:#fff;backdrop-filter:blur(8px)}.cardTop{display:flex;justify-content:space-between;align-items:center;color:rgba(255,255,255,.57);font-size:7px;font-weight:900;letter-spacing:1px}.cardTop b{font-size:8px}.emoji{margin:auto 0 9px;width:52px;height:52px;display:grid;place-items:center;border-radius:15px;background:#fff;font-size:26px;box-shadow:0 10px 20px rgba(0,24,55,.12)}.productCard>strong{font-size:14px}.productCard>small{margin-top:4px;color:rgba(255,255,255,.55);font-size:6px;font-weight:900;letter-spacing:1.1px}
        @media(max-width:1000px){.productGrid{grid-template-columns:repeat(3,1fr)}.productCard{min-height:155px}}
        @media(max-width:600px){.emergencyCard{min-height:120px;padding:18px;grid-template-columns:58px 1fr;gap:14px}.emergencyIcon{width:54px;height:54px}.emergencyCard strong{font-size:19px}.emergencyCard>b{display:none}.emergencyCard small{font-size:8px;line-height:1.5}.productGrid{grid-template-columns:repeat(2,1fr);gap:8px}.productCard{min-height:145px}.emoji{width:48px;height:48px;font-size:23px}.productCard>strong{font-size:15px}}
      `}</style>
    </div>
  );
}
