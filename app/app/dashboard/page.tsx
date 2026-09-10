"use client";

import Link from "next/link";

const actions = [
  { href: "/my-profiles", icon: "▦", title: "QR პროფილები", text: "ნახვა და მართვა" },
  { href: "/account/chat", icon: "◌", title: "Live Chat", text: "შეტყობინებების ნახვა" },
  { href: "/account/notifications", icon: "♢", title: "სიახლეები", text: "ბოლო აქტივობა" },
  { href: "/account/subscriptions", icon: "◇", title: "მომსახურება", text: "პაკეტები და ვადები" },
];

export default function AppDashboard() {
  return (
    <main className="dash">
      <div className="dashWrap">
        <header><Link href="/app/dashboard" className="dashBrand"><img src="/app-icons/app-icon.svg" alt=""/><span><b>KOMPASI</b><small>დაცული QR კავშირი</small></span></Link><Link href="/account/notifications" className="notify" aria-label="შეტყობინებები">♢</Link></header>
        <section className="welcome">
          <small>მფლობელის სივრცე</small>
          <h1>მოგესალმებით</h1>
          <p>აირჩიეთ სასურველი განყოფილება ქვედა მენიუდან.</p>
        </section>
        <section className="status">
          <div><i/><span><small>სისტემა</small><b>ყველაფერი დაცულია</b></span></div>
          <Link href="/my-profiles">პროფილების ნახვა →</Link>
        </section>
        <div className="sectionTitle"><span>სწრაფი წვდომა</span><small>ინფორმაცია გაიხსნება არჩევის შემდეგ</small></div>
        <section className="actions">{actions.map(item=><Link href={item.href} key={item.title}><i>{item.icon}</i><span><b>{item.title}</b><small>{item.text}</small></span><em>›</em></Link>)}</section>
      </div>
      <style jsx global>{`
        .dash{min-height:100vh;background:linear-gradient(180deg,#edf5ff 0,#f7f9fc 38%,#f7f9fc 100%);color:#153451;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}.dashWrap{width:min(560px,100%);margin:auto;padding:0 14px 95px}.dash header{height:68px;display:flex;align-items:center;justify-content:space-between}.dashBrand{display:flex;align-items:center;gap:9px;color:#153451;text-decoration:none}.dashBrand img{width:36px;height:36px;border-radius:11px}.dashBrand b,.dashBrand small{display:block}.dashBrand b{font-size:13px;letter-spacing:1px}.dashBrand small{margin-top:2px;color:#6c8197;font-size:8px}.notify{width:37px;height:37px;display:grid;place-items:center;border:1px solid #d5e2ef;border-radius:11px;background:#fff;color:#1761bb;text-decoration:none;font-size:19px}.welcome{padding:25px 21px;border-radius:21px;background:linear-gradient(140deg,#07366f,#0a65d2);color:#fff;box-shadow:0 14px 32px #0b4eaa2b}.welcome small{color:#b9d9fa;font-size:8px;font-weight:850;letter-spacing:1px}.welcome h1{margin:7px 0 0;font-size:25px}.welcome p{margin:7px 0 0;color:#d6e9fc;font-size:11px}.status{margin-top:11px;padding:14px 15px;display:flex;align-items:center;justify-content:space-between;gap:12px;border:1px solid #dce7f1;border-radius:16px;background:#fff}.status>div{display:flex;align-items:center;gap:10px}.status i{width:9px;height:9px;border-radius:50%;background:#18bd76;box-shadow:0 0 0 5px #18bd7617}.status small,.status b{display:block}.status small{color:#7a8ea2;font-size:8px}.status b{margin-top:2px;font-size:10px}.status a{color:#1161c2;text-decoration:none;font-size:9px;font-weight:850}.sectionTitle{margin:19px 3px 9px;display:flex;align-items:end;justify-content:space-between}.sectionTitle span{font-size:12px;font-weight:900}.sectionTitle small{color:#8597aa;font-size:7px}.actions{display:grid;gap:7px}.actions a{min-height:63px;padding:10px 13px;display:flex;align-items:center;gap:11px;border:1px solid #dce6f0;border-radius:15px;background:#fff;color:#173652;text-decoration:none;box-shadow:0 6px 17px #173f6d0d}.actions a>i{width:39px;height:39px;display:grid;place-items:center;flex:0 0 39px;border-radius:11px;background:#eaf3ff;color:#0d63c9;font-size:18px;font-style:normal}.actions span{min-width:0;flex:1}.actions b,.actions small{display:block}.actions b{font-size:11px}.actions small{margin-top:4px;color:#778b9e;font-size:8px}.actions em{color:#8da0b3;font-size:20px;font-style:normal}@media(max-width:380px){.sectionTitle small{display:none}}
      `}</style>
    </main>
  );
}
