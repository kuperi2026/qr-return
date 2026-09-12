"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const steps = [
  { title: "თქვენი პროფილების კალენდარი", text: "აქ ავტომატურად ჩანს მხოლოდ უკვე შექმნილი QR პროფილები და მათი რეალური ტარიფები." },
  { title: "ფასზე დაჭერით აირჩიეთ ვადა", text: "თითოეული პროფილის იმავე რიგში მონიშნეთ 1, 3, 6 ან 12 თვე. მეორედ დაჭერა არჩევანს მოხსნის." },
  { title: "სხვადასხვა პროფილი — სხვადასხვა ვადა", text: "მაგალითად, ძაღლს 1 თვე, კატას 3 თვე და Emergency პროფილს 6 თვე ერთ შეკვეთაში შეგიძლიათ მისცეთ." },
  { title: "შეჯამება და შეძენა", text: "შეამოწმეთ ყველა პროფილი, არჩეული ვადა, ფასდაკლება და ჯამი; შემდეგ გაგზავნეთ გააქტიურების მოთხოვნა." },
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
        <Link className="back" href="/account/subscriptions?source=app">← პაკეტებზე დაბრუნება</Link>
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
              {active === 0 && <div className="calendarDemo"><div className="calendarHead"><b>პროფილი</b><span>1 თვე</span><span>3 თვე</span><span>6 თვე</span><span>1 წელი</span></div><div className="productLabel">🐶 ძაღლი</div><div className="calendarRow"><b>ბობი<small>QR 452345</small></b><span>3₾</span><span>8₾</span><span>15₾</span><span>27₾</span></div></div>}
              {active === 1 && <div className="calendarDemo"><div className="calendarHead"><b>პროფილი</b><span>1 თვე</span><span>3 თვე</span><span>6 თვე</span><span>1 წელი</span></div><div className="productLabel">🐶 ძაღლი</div><div className="calendarRow"><b>ბობი<small>QR 452345</small></b><span>3₾</span><span>8₾</span><span className="picked">15₾<i>✓</i></span><span>27₾</span></div></div>}
              {active === 2 && <div className="calendarDemo multi"><div className="calendarHead"><b>პროფილი</b><span>1 თვე</span><span>3 თვე</span><span>6 თვე</span><span>1 წელი</span></div><div className="calendarRow"><b>🐶 ბობი</b><span className="picked">3₾</span><span>8₾</span><span>15₾</span><span>27₾</span></div><div className="calendarRow"><b>🐱 ლუნა</b><span>2₾</span><span className="picked">5₾</span><span>9₾</span><span>16₾</span></div><div className="calendarRow"><b>🆘 SOS</b><span>5₾</span><span>13₾</span><span className="picked">24₾</span><span>43₾</span></div></div>}
              {active === 3 && <div className="summary"><small>თქვენი არჩევანი · 3 პროფილი</small><div><span>🐶 ბობი · 1 თვე</span><b>3 ₾</b></div><div><span>🐱 ლუნა · 3 თვე</span><b>5 ₾</b></div><div><span>🆘 SOS · 6 თვე</span><b>24 ₾</b></div><div><span>ფასდაკლება −5%</span><b className="green">−1.60 ₾</b></div><button>გააქტიურების მოთხოვნა</button></div>}
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
          <Link className="open-packages" href="/account/subscriptions?source=app">კალენდარში არჩევის დაწყება →</Link>
        </section>
      </div>
      <style jsx global>{`
        .guide-page,.guide-page *{box-sizing:border-box}.guide-page{min-height:100vh;overflow-x:hidden;background:radial-gradient(circle at 15% 0,rgba(72,174,245,.4),transparent 30%),linear-gradient(180deg,#0a4c8a,#063b72);font-family:Inter,Arial,sans-serif;color:#fff}.guide-wrap{width:min(480px,calc(100% - 24px));margin:auto;padding:20px 0 110px}.back{display:inline-flex;padding:9px 13px;border:1px solid rgba(255,255,255,.25);border-radius:12px;color:#fff;text-decoration:none;font-size:12px;font-weight:800;background:rgba(255,255,255,.1)}.guide-page header{margin:20px 4px 18px}.eyebrow{color:#bdddff;font-size:10px;font-weight:950;letter-spacing:1.2px}.guide-page h1{margin:5px 0 4px;font-size:28px}.guide-page header p{margin:0;color:#d9edff;font-size:13px;line-height:1.5}.guide-card{padding:16px;border-radius:24px;background:#f8fbff;color:#173652;box-shadow:0 22px 50px rgba(0,31,73,.3)}.guide-title{display:flex;align-items:center;gap:11px;margin-bottom:14px}.play-icon{width:44px;height:44px;display:grid;place-items:center;border-radius:14px;background:linear-gradient(135deg,#1d78e6,#684be0);color:#fff}.guide-title small{display:block;color:#7a8da0;font-size:10px;font-weight:800}.guide-title h2{margin:3px 0 0;font-size:17px}.player{overflow:hidden;border-radius:19px;background:#0b396d;box-shadow:0 12px 24px rgba(9,50,96,.22)}.phone-top{height:42px;padding:0 13px;display:flex;align-items:center;gap:8px;background:#fff;color:#31506b;font-size:11px}.phone-top i{width:8px;height:8px;border-radius:50%;background:#20b879}.phone-top b{flex:1}.scene{height:238px;padding:37px 11px 12px;position:relative;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 15%,#2681d0,#0b4b88);animation:sceneIn .35s ease}.step-number{position:absolute;top:9px;left:11px;width:25px;height:25px;display:grid;place-items:center;border-radius:9px;background:rgba(255,255,255,.18);color:#fff;font-size:12px;font-weight:900}.calendarDemo{width:100%;overflow:hidden;border-radius:13px;background:#f8fbfe;color:#264b68;box-shadow:0 12px 30px rgba(0,20,54,.2)}.calendarHead,.calendarRow{display:grid;grid-template-columns:1.55fr repeat(4,.62fr);align-items:center}.calendarHead{padding:8px 7px;background:#e9f3fb;color:#71889b;font-size:7px}.calendarHead span{text-align:center}.productLabel{padding:7px 8px 3px;color:#147254;font-size:9px;font-weight:950}.calendarRow{min-height:55px;margin:4px;padding:5px;border:1px solid #dbe7f1;border-radius:10px;background:#fff;font-size:9px}.calendarRow>b{padding-left:3px}.calendarRow b small{display:block;margin-top:2px;color:#8293a2;font-size:6px}.calendarRow>span{position:relative;padding:11px 1px;border-radius:8px;color:#0870d8;text-align:center;font-weight:950}.calendarRow .picked{background:#0870d8;color:#fff;box-shadow:0 4px 10px rgba(8,112,216,.25)}.calendarRow .picked i{position:absolute;top:2px;right:3px;font-size:6px;font-style:normal}.calendarDemo.multi .calendarRow{min-height:42px;margin:3px;font-size:8px}.summary{width:100%;padding:11px;border-radius:15px;background:#fff}.summary>small{font-weight:900;color:#704cd5}.summary div{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #e6edf5;font-size:9px}.summary .green{color:#0a9c68}.summary button{width:100%;margin-top:8px;padding:10px;border:0;border-radius:10px;background:#1266e9;color:#fff;font-size:10px;font-weight:900}.caption{min-height:116px;padding:14px 16px;background:#102f5d;color:#fff}.caption small,.caption b{display:block}.caption small{color:#9fc9f2;font-size:10px;font-weight:800}.caption b{margin-top:3px;font-size:16px}.caption p{margin:5px 0 0;color:#d7e8fa;font-size:11px;line-height:1.5}.progress{height:4px;background:#2b4a73}.progress i{height:100%;display:block;background:linear-gradient(90deg,#3ba6ff,#8b59ed);transition:width .3s}.controls{display:flex;gap:8px;margin:12px 0}.controls button{flex:1;padding:12px;border:0;border-radius:12px;background:#176ed0;color:#fff;font-weight:900}.controls .restart{background:#eaf2fa;color:#315777}.chapters{display:grid;grid-template-columns:1fr 1fr;gap:7px}.chapters button{min-width:0;padding:9px;display:flex;align-items:center;gap:7px;border:1px solid #dfe8f2;border-radius:12px;background:#fff;color:#526b81;text-align:left;font-size:10px;font-weight:800}.chapters button.active{border-color:#277ed8;background:#edf6ff;color:#115da8}.chapters i{width:21px;height:21px;display:grid;place-items:center;flex:0 0 21px;border-radius:7px;background:#e9f2fc;font-style:normal}.open-packages{margin-top:14px;padding:14px;display:block;border-radius:13px;background:#e8f7f0;color:#087d51;text-align:center;text-decoration:none;font-size:12px;font-weight:950}@keyframes sceneIn{from{opacity:.2;transform:translateX(10px)}to{opacity:1;transform:none}}@media(max-width:360px){.guide-card{padding:12px}.scene{height:225px}.chapters{grid-template-columns:1fr}}
      `}</style>
    </main>
  );
}
