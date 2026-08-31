"use client";

import { QRIcon } from "./HomeIcons";

type ProductKind = "dog" | "cat" | "keys" | "wallet" | "bag" | "suitcase";

const products: Array<{ kind: ProductKind; ka: string; en: string; code: string; kaNote: string; enNote: string }> = [
  { kind: "dog", ka: "ძაღლი", en: "Dog", code: "PET", kaNote: "პროფილი · კონტაქტი", enNote: "Profile · Contact" },
  { kind: "cat", ka: "კატა", en: "Cat", code: "PET", kaNote: "პროფილი · კონტაქტი", enNote: "Profile · Contact" },
  { kind: "keys", ka: "გასაღები", en: "Keys", code: "ITEM", kaNote: "იდენტიფიკაცია · დაბრუნება", enNote: "Identify · Return" },
  { kind: "wallet", ka: "საფულე", en: "Wallet", code: "ITEM", kaNote: "კონტაქტი · დაბრუნება", enNote: "Contact · Return" },
  { kind: "bag", ka: "ჩანთა", en: "Bag", code: "ITEM", kaNote: "იდენტიფიკაცია · დაბრუნება", enNote: "Identify · Return" },
  { kind: "suitcase", ka: "ჩემოდანი", en: "Suitcase", code: "TRAVEL", kaNote: "მოგზაურობა · დაბრუნება", enNote: "Travel · Return" },
];

export default function ProductOrbit({ ka }: { ka: boolean }) {
  return (
    <div className="productShowcase">
      <div className="productGrid">
        <article className="productCard emergencyCard">
          <div className="cardTop"><span>EMERGENCY</span><b>01</b></div>
          <div className="productIcon emergencyIcon"><QRIcon size={30} /></div>
          <strong>{ka ? "სამაჯური" : "Bracelet"}</strong>
          <small>{ka ? "ინფორმაცია · კონტაქტი · 112" : "Information · Contact · 911"}</small>
        </article>
        {products.map((product, index) => (
          <article className="productCard" key={product.kind}>
            <div className="cardTop"><span>{product.code}</span><b>{String(index + 2).padStart(2, "0")}</b></div>
            <div className="productIcon"><ProductGlyph kind={product.kind} /></div>
            <strong>{ka ? product.ka : product.en}</strong>
            <small>{ka ? product.kaNote : product.enNote}</small>
          </article>
        ))}
      </div>
      <style jsx>{`
        .productShowcase{width:100%}.productGrid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:11px}.productCard{min-height:188px;padding:16px 15px;display:flex;flex-direction:column;border:1px solid rgba(255,255,255,.24);border-radius:18px;background:rgba(255,255,255,.09);color:#fff;box-shadow:0 15px 35px rgba(0,28,64,.12);backdrop-filter:blur(10px);transition:transform .2s ease,background .2s ease,border-color .2s ease}.productCard:hover{transform:translateY(-4px);border-color:rgba(255,255,255,.48);background:rgba(255,255,255,.14)}.emergencyCard{border-color:#fff;background:#fff;color:#063B72;box-shadow:0 18px 42px rgba(0,25,58,.22)}.emergencyCard:hover{border-color:#fff;background:#fff}.cardTop{display:flex;justify-content:space-between;align-items:center;color:rgba(255,255,255,.6);font-size:8px;font-weight:900;letter-spacing:1px}.emergencyCard .cardTop{color:#7890A7}.cardTop b{font-size:8px}.productIcon{width:58px;height:58px;margin:auto 0 13px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.88);border-radius:16px;background:#fff;color:#063B72;box-shadow:0 10px 24px rgba(0,25,58,.15)}.productIcon :global(svg){width:30px;height:30px}.emergencyIcon{border-color:#063B72;background:#063B72;color:#fff}.productCard>strong{font-size:16px;line-height:1.25}.productCard>small{margin-top:6px;color:rgba(255,255,255,.68);font-size:7px;font-weight:850;letter-spacing:.35px;line-height:1.4}.emergencyCard>small{color:#6E879E}
        @media(max-width:1100px){.productGrid{grid-template-columns:repeat(4,1fr)}.productCard{min-height:170px}}@media(max-width:620px){.productGrid{grid-template-columns:repeat(2,1fr);gap:9px}.productCard{min-height:158px;padding:14px}.productIcon{width:52px;height:52px;margin-bottom:11px}.productCard>strong{font-size:16px}}
      `}</style>
    </div>
  );
}

function ProductGlyph({ kind }: { kind: ProductKind }) {
  const common = { viewBox: "0 0 32 32", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (kind === "dog") return <svg {...common}><path d="M8 13 5 8l6 2c3-2 7-2 10 0l6-2-3 5v6c0 5-3.6 8-8 8s-8-3-8-8v-6Z"/><circle cx="12" cy="17" r="1" fill="currentColor" stroke="none"/><circle cx="20" cy="17" r="1" fill="currentColor" stroke="none"/><path d="M13 22c2 1.4 4 1.4 6 0M16 19.5v2"/></svg>;
  if (kind === "cat") return <svg {...common}><path d="m8 12 1-7 6 4h2l6-4 1 7v8c0 4-3.6 7-8 7s-8-3-8-7v-8Z"/><circle cx="12.5" cy="17" r="1" fill="currentColor" stroke="none"/><circle cx="19.5" cy="17" r="1" fill="currentColor" stroke="none"/><path d="M16 19v2m-6 0 4-1m8 1-4-1m-5 3c2 1 4 1 6 0"/></svg>;
  if (kind === "keys") return <svg {...common}><circle cx="11" cy="12" r="6"/><circle cx="11" cy="12" r="2"/><path d="m15.5 16.5 10 10m-4-4 2-2m-5 0 2-2"/></svg>;
  if (kind === "wallet") return <svg {...common}><path d="M5 9h20a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V9Z"/><path d="M5 11V8a2 2 0 0 1 2-2h16v5m0 5h4v6h-4a3 3 0 0 1 0-6Z"/><circle cx="23" cy="19" r=".7" fill="currentColor" stroke="none"/></svg>;
  if (kind === "bag") return <svg {...common}><path d="M6 12h20l-1 15H7L6 12Z"/><path d="M11 12V9a5 5 0 0 1 10 0v3"/></svg>;
  return <svg {...common}><rect x="8" y="5" width="16" height="22" rx="3"/><path d="M13 5V3h6v2M12 11h8M12 15h8M12 19h8"/><circle cx="12" cy="28" r="1" fill="currentColor" stroke="none"/><circle cx="20" cy="28" r="1" fill="currentColor" stroke="none"/></svg>;
}
