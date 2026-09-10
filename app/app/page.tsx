"use client";

import Link from "next/link";

const products = [["🐕","ძაღლი"],["🐈","კატა"],["🚘","მანქანა"],["🧳","ჩემოდანი"],["🔑","გასაღები"],["👛","საფულე"],["👜","ჩანთა"],["✚","Emergency"]];

export default function AppHome() {
  return <main className="mobileHome"><div className="wrap">
    <header><Link href="/app" className="brand"><img src="/app-icons/app-icon.svg" alt=""/><span><b>KOMPASI</b><small>დაცული QR კავშირი</small></span></Link><Link className="topLogin" href="/login?source=app">შესვლა</Link></header>

    <section className="hero">
      <div className="eyebrow"><i/> SMART QR PROTECTION</div>
      <h1>აღმოაჩინე მეტი.<br/><span>დაიცავი მნიშვნელოვანი.</span></h1>
      <p>ერთი უსაფრთხო სივრცე თქვენი ნივთების, ცხოველებისა და ახლობლებისთვის.</p>
      <div className="auth"><Link className="signup" href="/signup?source=app">რეგისტრაცია <b>→</b></Link><Link className="login" href="/login?source=app">შესვლა</Link></div>
      <div className="trust"><span>✓ მპოვნელს აპი არ სჭირდება</span><span>✓ 24/7 დაცული კავშირი</span></div>
    </section>

    <section className="card productsCard">
      <div className="sectionHead"><div><small>პროდუქტები</small><h2>რა გსურთ დაიცვათ?</h2></div><Link href="/signup?source=app">ყველა →</Link></div>
      <div className="products">{products.map(([icon,label])=><Link href="/signup?source=app" key={label}><span>{icon}</span><b>{label}</b></Link>)}</div>
    </section>

    <section className="scan">
      <div className="scanIcon"><i/><i/><i/><i/></div>
      <div><small>მპოვნელისთვის</small><h2>იპოვეთ KOMPASI QR?</h2><p>დაასკანირეთ კოდი — რეგისტრაცია საჭირო არ არის.</p></div><b>→</b>
    </section>

    <section className="card stepsCard">
      <div className="sectionHead"><div><small>როგორ მუშაობს</small><h2>მარტივი. სწრაფი. უსაფრთხო.</h2></div></div>
      <div className="steps"><article><i>1</i><b>მიაბით</b><span>QR პროფილს</span></article><em>→</em><article><i>2</i><b>დაასკანირონ</b><span>აპის გარეშე</span></article><em>→</em><article><i>3</i><b>დაგიკავშირდნენ</b><span>უსაფრთხოდ</span></article></div>
    </section>

    <section className="bottom"><div><small>KOMPASI ACCOUNT</small><h2>ყველა პროფილი ერთ სივრცეში</h2><p>მართეთ QR პროფილები, ჩათი და შეტყობინებები.</p></div><Link href="/signup?source=app">ანგარიშის შექმნა</Link></section>
    <footer>© 2026 KOMPASI · აღმოაჩინე მეტი</footer>
  </div><style jsx global>{`
    *{box-sizing:border-box}.mobileHome{min-height:100vh;background:#f3f7fc;color:#122c49;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}.wrap{width:min(760px,100%);margin:auto;padding:0 16px 28px}.wrap>header{height:72px;display:flex;align-items:center;justify-content:space-between}.brand{display:flex;align-items:center;gap:10px;color:#0e2d50;text-decoration:none}.brand img{width:38px;height:38px;border-radius:11px;box-shadow:0 6px 16px #0a408629}.brand b,.brand small{display:block}.brand b{font-size:14px;letter-spacing:1.2px}.brand small{margin-top:2px;color:#668099;font-size:9px;font-weight:700}.topLogin{min-height:38px;padding:0 16px;display:grid;place-items:center;border:1px solid #c9d8e8;border-radius:11px;background:#fff;color:#1559a9;text-decoration:none;font-size:12px;font-weight:850}
    .hero{position:relative;overflow:hidden;padding:31px 25px 22px;border-radius:24px;background:radial-gradient(circle at 100% 0,#3081df80,transparent 35%),linear-gradient(145deg,#062f68,#0758b8 68%,#236ee0);color:#fff;box-shadow:0 18px 38px #042f6c3b}.eyebrow{display:flex;align-items:center;gap:7px;color:#bcdcff;font-size:8px;font-weight:900;letter-spacing:1.1px}.eyebrow i{width:7px;height:7px;border-radius:50%;background:#48e5a1;box-shadow:0 0 0 4px #48e5a124}.hero h1{margin:14px 0 0;font-size:clamp(29px,6vw,43px);line-height:1.09;letter-spacing:-1.1px}.hero h1 span{color:#b9dcff}.hero>p{max-width:490px;margin:13px 0 0;color:#d8eaff;font-size:13px;font-weight:600;line-height:1.5}.auth{margin-top:21px;display:flex;gap:9px}.auth a{min-height:45px;padding:0 18px;display:flex;align-items:center;justify-content:center;border-radius:12px;text-decoration:none;font-size:13px;font-weight:900}.auth .signup{min-width:168px;gap:24px;background:#fff;color:#0755b4;box-shadow:0 9px 22px #001a4633}.auth .login{border:1px solid #ffffff66;background:#ffffff1a;color:#fff}.trust{margin-top:20px;padding-top:14px;display:flex;gap:8px 18px;flex-wrap:wrap;border-top:1px solid #ffffff2e;color:#c7e1fc;font-size:9px;font-weight:750}
    .card{margin-top:13px;padding:20px;border:1px solid #e0e9f3;border-radius:20px;background:#fff;box-shadow:0 9px 26px #0e315812}.sectionHead{display:flex;align-items:end;justify-content:space-between;gap:12px}.sectionHead small,.scan small,.bottom small{color:#667f98;font-size:8px;font-weight:900;letter-spacing:1px}.sectionHead h2,.scan h2,.bottom h2{margin:4px 0 0;font-size:17px}.sectionHead>a{color:#1764c4;text-decoration:none;font-size:10px;font-weight:850}.products{margin-top:15px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.products a{min-height:72px;padding:9px 5px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;border:1px solid #e1eaf4;border-radius:13px;background:#f8fbff;color:#25425f;text-decoration:none}.products span{font-size:22px;line-height:1}.products b{font-size:9px}
    .scan{margin-top:13px;padding:17px 18px;display:flex;align-items:center;gap:14px;border:1px solid #cfe0f4;border-radius:19px;background:linear-gradient(135deg,#edf6ff,#fff);box-shadow:0 9px 26px #0e315812}.scanIcon{position:relative;width:45px;height:45px;flex:0 0 45px;border-radius:13px;background:#0b64ce}.scanIcon i{position:absolute;width:10px;height:10px;border-color:#fff;border-style:solid}.scanIcon i:nth-child(1){left:10px;top:10px;border-width:2px 0 0 2px}.scanIcon i:nth-child(2){right:10px;top:10px;border-width:2px 2px 0 0}.scanIcon i:nth-child(3){left:10px;bottom:10px;border-width:0 0 2px 2px}.scanIcon i:nth-child(4){right:10px;bottom:10px;border-width:0 2px 2px 0}.scan>div:nth-child(2){min-width:0;flex:1}.scan h2{font-size:15px}.scan p{margin:4px 0 0;color:#6b8095;font-size:10px}.scan>b{color:#1764c4}
    .steps{margin-top:17px;display:flex;align-items:center;justify-content:space-between}.steps article{text-align:center}.steps article i{width:25px;height:25px;margin:0 auto 7px;display:grid;place-items:center;border-radius:8px;background:#eaf3ff;color:#0b61c9;font-size:10px;font-style:normal;font-weight:900}.steps b,.steps span{display:block}.steps b{font-size:10px}.steps span{margin-top:3px;color:#778b9e;font-size:8px}.steps em{color:#b4c3d2;font-size:11px;font-style:normal}
    .bottom{margin-top:13px;padding:19px 20px;display:flex;align-items:center;justify-content:space-between;gap:15px;border-radius:20px;background:#102f53;color:#fff}.bottom small{color:#9fc4ec}.bottom h2{font-size:16px}.bottom p{margin:5px 0 0;color:#bcd0e4;font-size:9px}.bottom a{min-height:39px;padding:0 13px;display:grid;place-items:center;flex:0 0 auto;border-radius:10px;background:#fff;color:#0b58b7;text-decoration:none;font-size:10px;font-weight:900}.wrap footer{padding-top:20px;color:#899caf;text-align:center;font-size:8px;font-weight:700}
    @media(max-width:520px){.wrap{padding:0 10px 22px}.wrap>header{height:64px;padding:0 3px}.hero{padding:27px 19px 20px;border-radius:21px}.hero h1{font-size:30px}.auth{display:grid;grid-template-columns:1.35fr 1fr}.auth a{min-width:0!important;padding:0 11px}.card{padding:17px;border-radius:18px}.products{gap:6px}.products a{min-height:64px}.products span{font-size:19px}.products b{font-size:8px}.bottom{align-items:flex-start;flex-direction:column}.bottom a{width:100%}}@media(max-width:365px){.products{grid-template-columns:repeat(2,1fr)}.auth{grid-template-columns:1fr}.hero h1{font-size:27px}}
  `}</style></main>;
}
