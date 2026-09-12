"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const steps = [
  { title: "გახსენით პაკეტები", text: "ჰაბიდან შედით „მომსახურება და პაკეტები“ განყოფილებაში." },
  { title: "აირჩიეთ პროფილი", text: "კალენდარში გამოჩნდება მხოლოდ უკვე შექმნილი QR პროფილები." },
  { title: "მონიშნეთ ვადა", text: "თითოეულ პროფილს ცალ-ცალკე შეურჩიეთ 1, 3, 6 ან 12 თვე." },
  { title: "შეამოწმეთ შეჯამება", text: "ბოლოს ნახეთ ვადები, ფასდაკლება და გადასახდელი თანხა ერთ სივრცეში." },
];

export default function GuidesPage() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (active === steps.length - 1) setPlaying(false);
      else setActive((value) => value + 1);
    }, 3600);
    return () => window.clearTimeout(timer);
  }, [active, playing]);

  function restart() {
    setActive(0);
    setPlaying(true);
  }

  return (
    <main className="guide-page">
      <div className="guide-wrap">
        <Link className="back" href="/app/products">← ჰაბში დაბრუნება</Link>
        <header>
          <span className="eyebrow">KOMPASI GUIDE</span>
          <h1>ვიდეო ინსტრუქციები</h1>
          <p>ნახეთ, როგორ მართოთ მომსახურება და პაკეტები მარტივად.</p>
        </header>

        <section className="guide-card">
          <div className="guide-title">
            <span className="play-icon">▶</span>
            <div><small>ვიდეო ინსტრუქცია · 1:00 წთ</small><h2>მომსახურება და პაკეტები</h2></div>
          </div>

          <div className="player" aria-live="polite">
            <div className="phone-top"><i /><b>მომსახურება და პაკეტები</b><span>•••</span></div>
            <div className="scene" key={active}>
              <div className="step-number">{active + 1}</div>
              {active === 0 && <div className="mock hub-mock"><strong>◇</strong><div><b>მომსახურება და პაკეტები</b><small>მართეთ მომსახურების ვადა და პაკეტი</small></div><em>›</em></div>}
              {active === 1 && <div className="mock profile-mock"><span>🐕</span><div><b>ბობი</b><small>ძაღლი · QR 452345</small></div><i>✓</i></div>}
              {active === 2 && <div className="periods"><button>1 თვე<small>3 ₾</small></button><button>3 თვე<small>8 ₾</small></button><button className="chosen">6 თვე<small>15 ₾</small></button><button>1 წელი<small>27 ₾</small></button></div>}
              {active === 3 && <div className="summary"><small>შეკვეთის შეჯამება</small><div><span>ბობი · 6 თვე</span><b>15 ₾</b></div><div><span>რაოდენობრივი ფასდაკლება</span><b className="green">ავტომატურად</b></div><button>გადახდაზე გადასვლა →</button></div>}
            </div>
            <div className="caption"><small>ნაბიჯი {active + 1} / {steps.length}</small><b>{steps[active].title}</b><p>{steps[active].text}</p></div>
            <div className="progress"><i style={{ width: `${((active + 1) / steps.length) * 100}%` }} /></div>
          </div>

          <div className="controls">
            <button onClick={() => setPlaying((value) => !value)}>{playing ? "Ⅱ  პაუზა" : active === steps.length - 1 ? "▶  თავიდან ნახვა" : "▶  გაგრძელება"}</button>
            <button className="restart" onClick={restart}>↻ თავიდან</button>
          </div>
          <div className="chapters">
            {steps.map((step, index) => <button className={index === active ? "active" : ""} onClick={() => { setActive(index); setPlaying(false); }} key={step.title}><i>{index + 1}</i><span>{step.title}</span></button>)}
          </div>
          <Link className="open-packages" href="/account/subscriptions?source=app">მომსახურება და პაკეტების გახსნა →</Link>
        </section>
      </div>
      <style jsx global>{`
        .guide-page,.guide-page *{box-sizing:border-box}.guide-page{min-height:100vh;overflow-x:hidden;background:radial-gradient(circle at 15% 0,rgba(72,174,245,.4),transparent 30%),linear-gradient(180deg,#0a4c8a,#063b72);font-family:Inter,Arial,sans-serif;color:#fff}.guide-wrap{width:min(480px,calc(100% - 24px));margin:auto;padding:20px 0 110px}.back{display:inline-flex;padding:9px 13px;border:1px solid rgba(255,255,255,.25);border-radius:12px;color:#fff;text-decoration:none;font-size:12px;font-weight:800;background:rgba(255,255,255,.1)}.guide-page header{margin:20px 4px 18px}.eyebrow{color:#bdddff;font-size:10px;font-weight:950;letter-spacing:1.2px}.guide-page h1{margin:5px 0 4px;font-size:28px}.guide-page header p{margin:0;color:#d9edff;font-size:13px;line-height:1.5}.guide-card{padding:16px;border-radius:24px;background:#f8fbff;color:#173652;box-shadow:0 22px 50px rgba(0,31,73,.3)}.guide-title{display:flex;align-items:center;gap:11px;margin-bottom:14px}.play-icon{width:44px;height:44px;display:grid;place-items:center;border-radius:14px;background:linear-gradient(135deg,#1d78e6,#684be0);color:#fff}.guide-title small{display:block;color:#7a8da0;font-size:10px;font-weight:800}.guide-title h2{margin:3px 0 0;font-size:17px}.player{overflow:hidden;border-radius:19px;background:#0b396d;box-shadow:0 12px 24px rgba(9,50,96,.22)}.phone-top{height:42px;padding:0 13px;display:flex;align-items:center;gap:8px;background:#fff;color:#31506b;font-size:11px}.phone-top i{width:8px;height:8px;border-radius:50%;background:#20b879}.phone-top b{flex:1}.scene{height:222px;padding:32px 17px 15px;position:relative;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 15%,#2681d0,#0b4b88);animation:sceneIn .35s ease}.step-number{position:absolute;top:13px;left:15px;width:25px;height:25px;display:grid;place-items:center;border-radius:9px;background:rgba(255,255,255,.18);color:#fff;font-size:12px;font-weight:900}.mock{width:100%;display:flex;align-items:center;gap:10px;padding:14px;border-radius:17px;background:#fff;color:#173652;box-shadow:0 12px 30px rgba(0,20,54,.2)}.mock strong,.mock>span{width:42px;height:42px;display:grid;place-items:center;border-radius:12px;background:#eaf4ff;font-size:20px}.mock div{flex:1;min-width:0}.mock b,.mock small{display:block}.mock small{margin-top:4px;color:#7b8fa2;font-size:10px}.mock em{font-style:normal;color:#1975d2;font-size:20px}.profile-mock{border:2px solid #14ad73}.profile-mock i{width:27px;height:27px;display:grid;place-items:center;border-radius:50%;background:#13ae73;color:#fff;font-style:normal}.periods{width:100%;display:grid;grid-template-columns:1fr 1fr;gap:9px}.periods button{padding:15px 4px;border:0;border-radius:14px;background:#fff;color:#536b80;font-weight:800}.periods small{display:block;margin-top:5px;color:#1475d2;font-size:17px}.periods .chosen{outline:3px solid #9df0cf;background:linear-gradient(135deg,#148fe1,#11ad78);color:#fff}.periods .chosen small{color:#fff}.summary{width:100%;padding:14px;border-radius:17px;background:#fff}.summary>small{font-weight:900;color:#704cd5}.summary div{display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid #e6edf5;font-size:11px}.summary .green{color:#0a9c68}.summary button{width:100%;margin-top:12px;padding:11px;border:0;border-radius:11px;background:linear-gradient(135deg,#1a78dc,#6846d6);color:#fff;font-weight:900}.caption{min-height:116px;padding:14px 16px;background:#102f5d;color:#fff}.caption small,.caption b{display:block}.caption small{color:#9fc9f2;font-size:10px;font-weight:800}.caption b{margin-top:3px;font-size:16px}.caption p{margin:5px 0 0;color:#d7e8fa;font-size:11px;line-height:1.5}.progress{height:4px;background:#2b4a73}.progress i{height:100%;display:block;background:linear-gradient(90deg,#3ba6ff,#8b59ed);transition:width .3s}.controls{display:flex;gap:8px;margin:12px 0}.controls button{flex:1;padding:12px;border:0;border-radius:12px;background:#176ed0;color:#fff;font-weight:900}.controls .restart{background:#eaf2fa;color:#315777}.chapters{display:grid;grid-template-columns:1fr 1fr;gap:7px}.chapters button{min-width:0;padding:9px;display:flex;align-items:center;gap:7px;border:1px solid #dfe8f2;border-radius:12px;background:#fff;color:#526b81;text-align:left;font-size:10px;font-weight:800}.chapters button.active{border-color:#277ed8;background:#edf6ff;color:#115da8}.chapters i{width:21px;height:21px;display:grid;place-items:center;flex:0 0 21px;border-radius:7px;background:#e9f2fc;font-style:normal}.open-packages{margin-top:14px;padding:14px;display:block;border-radius:13px;background:#e8f7f0;color:#087d51;text-align:center;text-decoration:none;font-size:12px;font-weight:950}@keyframes sceneIn{from{opacity:.2;transform:translateX(10px)}to{opacity:1;transform:none}}@media(max-width:360px){.guide-card{padding:12px}.scene{height:205px}.chapters{grid-template-columns:1fr}}
      `}</style>
    </main>
  );
}
