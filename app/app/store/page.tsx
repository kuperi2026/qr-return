"use client";

import Link from "next/link";

const products = [
  ["▦", "QR სტიკერები", "მტკიცე და წყალგამძლე", "მალე"],
  ["⌁", "QR ბრელოკები", "გასაღებისა და ჩანთისთვის", "მალე"],
  ["▣", "საფულის ბარათი", "თხელი დამცავი QR ბარათი", "მალე"],
  ["✚", "Emergency ნაკრები", "პირველი და მესამე პირისთვის", "მალე"],
];

export default function AppStorePage() {
  return <main className="storePage"><div className="storeWrap">
    <Link href="/app/products" className="back">← ჰაბი</Link>
    <header><small>KOMPASI STORE</small><h1>პროდუქტების მაღაზია</h1><p>აირჩიეთ ფიზიკური QR პროდუქტი. ფოტოები, ფასები და დაცული გადახდა დაემატება შემდეგ ეტაპზე.</p></header>
    <section className="hero"><span>პრემიუმ დაცვა</span><b>ერთი QR — სწრაფი და უსაფრთხო დაბრუნება</b><p>პროდუქტის მიღების შემდეგ აპში დაარეგისტრირებთ სასურველ პროფილს.</p></section>
    <section className="catalog">{products.map(([icon,name,note,state])=><article key={name}><i>{icon}</i><div><b>{name}</b><small>{note}</small></div><em>{state}</em></article>)}</section>
  </div><style jsx>{`*{box-sizing:border-box}.storePage{min-height:100vh;overflow-x:hidden;background:radial-gradient(circle at 15% 4%,rgba(83,185,255,.48),transparent 28%),radial-gradient(circle at 92% 22%,rgba(104,73,223,.28),transparent 31%),linear-gradient(160deg,#0b579b,#073f78 48%,#052d59);color:#fff;font-family:Inter,Arial,sans-serif}.storeWrap{width:min(480px,calc(100% - 24px));margin:auto;padding:22px 0 100px}.back{display:inline-flex;padding:8px 11px;border:1px solid rgba(255,255,255,.3);border-radius:10px;background:rgba(255,255,255,.12);color:#fff;text-decoration:none;font-size:11px;font-weight:850}header{margin-top:22px}header small{color:#bdddff;font-size:10px;font-weight:950;letter-spacing:1px}h1{margin:6px 0 0;font-size:27px}header p{margin:8px 0 0;color:#d7ecff;font-size:12px;line-height:1.55}.hero{margin-top:18px;padding:20px;border:1px solid rgba(255,255,255,.3);border-radius:20px;background:linear-gradient(135deg,#6b4bd2,#176fe1 55%,#0b9d72);box-shadow:0 16px 35px rgba(1,30,66,.3)}.hero span,.hero b{display:block}.hero span{font-size:9px;font-weight:900;letter-spacing:1px}.hero b{margin-top:8px;font-size:19px;line-height:1.25}.hero p{margin:8px 0 0;color:#e5f4ff;font-size:11px;line-height:1.5}.catalog{margin-top:12px;display:grid;gap:8px}.catalog article{min-height:82px;padding:12px;display:flex;align-items:center;gap:11px;border:1px solid rgba(255,255,255,.82);border-radius:17px;background:linear-gradient(145deg,#fff,#f4f8ff);color:#173652;box-shadow:0 10px 24px rgba(1,30,66,.17)}.catalog i{width:46px;height:46px;display:grid;place-items:center;flex:0 0 46px;border-radius:13px;background:linear-gradient(135deg,#e7f2ff,#efeaff);color:#1763c2;font-size:21px;font-style:normal}.catalog div{min-width:0;flex:1}.catalog b,.catalog small{display:block}.catalog b{font-size:14px}.catalog small{margin-top:4px;color:#71869a;font-size:10px}.catalog em{padding:6px 8px;border-radius:999px;background:#e8f7ef;color:#08784a;font-size:8px;font-style:normal;font-weight:900}`}</style></main>;
}
