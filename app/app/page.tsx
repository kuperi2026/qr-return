"use client";

import Link from "next/link";

const PRODUCTS = [
  ["🐕", "ძაღლი"], ["🐈", "კატა"], ["🚘", "ავტომობილი"], ["🧳", "ჩემოდანი"],
  ["🔑", "გასაღები"], ["👛", "საფულე"], ["👜", "ჩანთა"], ["🆘", "Emergency"],
];

export default function KompasiAppHome() {
  return (
    <main className="appHome">
      <header className="appHeader">
        <Link href="/app" className="appBrand">
          <img src="/app-icons/app-icon.svg" alt="" />
          <span><strong>KOMPASI</strong><small>დაცული QR კავშირი</small></span>
        </Link>
        <Link href="/login?source=app" className="headerLogin">შესვლა</Link>
      </header>

      <section className="heroCard">
        <div className="signal"><span>●</span> SMART RETURN NETWORK</div>
        <h1>მნიშვნელოვანი ყოველთვის<br /><em>თქვენთან ახლოს.</em></h1>
        <p>ერთი ჭკვიანი QR — მყისიერი კავშირი მპოვნელსა და მფლობელს შორის.</p>
        <div className="heroActions">
          <Link href="/signup?source=app" className="primary">ანგარიშის შექმნა <span>→</span></Link>
          <Link href="/login?source=app" className="secondary">უკვე მაქვს ანგარიში</Link>
        </div>
        <div className="trustRow">
          <span>✓ აპის გარეშე სკანირება</span>
          <span>✓ უსაფრთხო Live Chat</span>
          <span>✓ 24/7 კავშირი</span>
        </div>
        <div className="heroGlow one" /><div className="heroGlow two" />
      </section>

      <section className="howCard">
        <div className="sectionTitle"><div><small>როგორ მუშაობს</small><h2>ერთი სკანირება საკმარისია</h2></div><span className="aiBadge">AI READY</span></div>
        <div className="steps">
          <article><span>01</span><div className="stepIcon">⌁</div><strong>QR სკანი</strong><p>მპოვნელი პირდაპირ დაცულ პროფილს ხსნის.</p></article>
          <article><span>02</span><div className="stepIcon">✦</div><strong>AI მიმართულება</strong><p>სისტემა არჩევს სიტუაციის შესაბამის მოქმედებას.</p></article>
          <article><span>03</span><div className="stepIcon">✓</div><strong>უსაფრთხო დაბრუნება</strong><p>ჩათი, ზარი და ლოკაცია ერთ სივრცეშია.</p></article>
        </div>
      </section>

      <section className="productsCard">
        <div className="sectionTitle"><div><small>ერთი ანგარიში</small><h2>ყველა მნიშვნელოვანი პროფილი</h2></div></div>
        <div className="products">
          {PRODUCTS.map(([icon, label]) => <div key={label}><span>{icon}</span><strong>{label}</strong></div>)}
        </div>
      </section>

      <section className="finderCard">
        <div className="finderIcon">⌖</div>
        <div><small>მპოვნელისთვის</small><h2>0 რეგისტრაცია. 0 ბარიერი.</h2><p>QR-ის სკანირებისთანავე იხსნება მხოლოდ მფლობელის მიერ ნებადართული ინფორმაცია.</p></div>
      </section>

      <section className="finalCard">
        <small>FROM SCAN TO SAFE RETURN</small>
        <h2>დაიცავით ის, რაც მნიშვნელოვანია.</h2>
        <Link href="/signup?source=app">დაიწყეთ KOMPASI-თან ერთად →</Link>
      </section>

      <footer>© 2026 KOMPASI · აღმოაჩინე მეტი</footer>

      <style jsx global>{`
        .appHome{min-height:100vh;padding:0 16px 34px;background:radial-gradient(circle at 15% 8%,rgba(74,173,255,.34),transparent 27%),radial-gradient(circle at 92% 35%,rgba(93,75,224,.2),transparent 24%),linear-gradient(165deg,#073f89 0%,#062b65 52%,#041d49 100%);font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;color:#153451}.appHeader{width:min(1040px,100%);min-height:74px;margin:auto;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.18)}.appBrand{display:flex;align-items:center;gap:10px;color:#fff;text-decoration:none}.appBrand img{width:40px;height:40px;border-radius:12px;box-shadow:0 8px 20px rgba(0,20,65,.28)}.appBrand strong,.appBrand small{display:block}.appBrand strong{font-size:15px;letter-spacing:1px}.appBrand small{margin-top:2px;color:#b9d7f5;font-size:9px;font-weight:750}.headerLogin{min-height:38px;padding:0 15px;display:inline-flex;align-items:center;border:1px solid rgba(255,255,255,.38);border-radius:11px;background:rgba(255,255,255,.1);color:#fff;text-decoration:none;font-size:12px;font-weight:850}
        .heroCard,.howCard,.productsCard,.finderCard,.finalCard{width:min(1040px,100%);margin-left:auto;margin-right:auto}.heroCard{position:relative;overflow:hidden;margin-top:24px;padding:54px 42px 38px;border:1px solid rgba(255,255,255,.65);border-radius:28px;background:linear-gradient(135deg,rgba(255,255,255,.99),rgba(230,242,255,.96));box-shadow:0 28px 70px rgba(0,20,60,.36)}.signal{position:relative;z-index:2;color:#506b86;font-size:9px;font-weight:950;letter-spacing:1.2px}.signal span{color:#11a66a}.heroCard h1{position:relative;z-index:2;margin:16px 0 0;color:#102f58;font-size:clamp(34px,6vw,64px);line-height:1.03;letter-spacing:-2px}.heroCard h1 em{color:#0b65dd;font-style:normal}.heroCard>p{position:relative;z-index:2;max-width:590px;margin:18px 0 0;color:#577087;font-size:16px;font-weight:650;line-height:1.55}.heroActions{position:relative;z-index:2;margin-top:25px;display:flex;flex-wrap:wrap;gap:10px}.heroActions a{min-height:48px;padding:0 18px;display:inline-flex;align-items:center;justify-content:center;border-radius:13px;text-decoration:none;font-size:13px;font-weight:900}.heroActions .primary{gap:24px;background:linear-gradient(135deg,#0b70ec,#3855d8);color:#fff;box-shadow:0 11px 25px rgba(31,91,213,.25)}.heroActions .secondary{border:1px solid #c8d9ed;background:#fff;color:#174a83}.trustRow{position:relative;z-index:2;margin-top:29px;padding-top:17px;display:flex;flex-wrap:wrap;gap:10px 22px;border-top:1px solid #d5e2ef;color:#527089;font-size:10px;font-weight:800}.heroGlow{position:absolute;border-radius:50%;filter:blur(2px)}.heroGlow.one{width:310px;height:310px;right:-110px;top:-120px;background:radial-gradient(circle,rgba(56,141,255,.25),transparent 65%)}.heroGlow.two{width:180px;height:180px;right:16%;bottom:-130px;border:35px solid rgba(98,75,224,.08)}
        .howCard,.productsCard{margin-top:14px;padding:23px;border:1px solid rgba(255,255,255,.34);border-radius:22px;background:rgba(255,255,255,.96);box-shadow:0 15px 40px rgba(0,19,57,.2)}.sectionTitle{display:flex;align-items:flex-end;justify-content:space-between;gap:12px}.sectionTitle small,.finderCard small,.finalCard small{color:#6a54dc;font-size:9px;font-weight:950;letter-spacing:1px}.sectionTitle h2,.finderCard h2,.finalCard h2{margin:5px 0 0;color:#173657;font-size:20px}.aiBadge{padding:6px 9px;border-radius:999px;background:#e8f8f0;color:#087b4c;font-size:8px;font-weight:950}.steps{margin-top:17px;display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.steps article{position:relative;min-height:142px;padding:15px;border:1px solid #dbe6f3;border-radius:16px;background:linear-gradient(145deg,#fff,#f3f8ff)}.steps article>span{position:absolute;right:12px;top:11px;color:#b0bfd0;font-size:9px;font-weight:900}.stepIcon{width:35px;height:35px;display:grid;place-items:center;border-radius:10px;background:#e9f2ff;color:#0b62d9;font-size:17px;font-weight:900}.steps strong{display:block;margin-top:12px;font-size:13px}.steps p{margin:5px 0 0;color:#6b7f93;font-size:10px;line-height:1.45}
        .products{margin-top:16px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.products div{min-height:70px;padding:10px;display:flex;align-items:center;gap:9px;border:1px solid #dce7f2;border-radius:14px;background:#f8fbff}.products span{font-size:22px}.products strong{font-size:11px}.finderCard{margin-top:14px;padding:20px 22px;display:flex;align-items:center;gap:16px;border:1px solid rgba(255,255,255,.52);border-radius:20px;background:linear-gradient(135deg,#eaf4ff,#fff);box-shadow:0 15px 40px rgba(0,19,57,.18)}.finderIcon{width:49px;height:49px;display:grid;place-items:center;flex:0 0 49px;border-radius:15px;background:#0b62df;color:#fff;font-size:25px}.finderCard p{margin:6px 0 0;color:#61778d;font-size:12px;line-height:1.5}.finalCard{margin-top:14px;padding:27px;border:1px solid rgba(126,179,255,.35);border-radius:22px;background:linear-gradient(135deg,#0c376d,#0b58b8);color:#fff;text-align:center;box-shadow:0 17px 45px rgba(0,16,50,.27)}.finalCard small{color:#a9ccf6}.finalCard h2{color:#fff}.finalCard a{min-height:44px;margin-top:16px;padding:0 17px;display:inline-flex;align-items:center;border-radius:12px;background:#fff;color:#0b57bc;text-decoration:none;font-size:12px;font-weight:900}.appHome footer{padding-top:22px;color:#8fb2d9;text-align:center;font-size:9px;font-weight:700}
        @media(max-width:620px){.appHome{padding:0 10px 24px}.appHeader{min-height:64px;padding:0 3px}.appBrand img{width:36px;height:36px}.heroCard{margin-top:12px;padding:32px 20px 23px;border-radius:22px}.heroCard h1{font-size:36px;letter-spacing:-1.4px}.heroCard>p{font-size:14px}.heroActions{display:grid}.heroActions a{width:100%;min-height:46px}.trustRow{gap:8px 14px}.howCard,.productsCard{padding:17px;border-radius:18px}.steps{grid-template-columns:1fr}.steps article{min-height:96px;padding:13px 13px 13px 59px}.stepIcon{position:absolute;left:13px;top:14px}.steps strong{margin-top:2px}.products{grid-template-columns:repeat(2,1fr)}.products div{min-height:58px}.finderCard{padding:17px}.finderCard h2{font-size:17px}.finalCard{padding:23px 17px}.sectionTitle h2{font-size:18px}}
      `}</style>
    </main>
  );
}
