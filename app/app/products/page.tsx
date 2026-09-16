"use client";

import Link from "next/link";

const hub = [
  ["＋", "პროფილის რეგისტრაცია", "შექმენით ახალი QR პროფილი", "/login?source=app&next=%2Fapp%2Fadd", "blue"],
  ["✓", "პროფილების მართვა", "ნახვა, რედაქტირება და Lost Mode", "/login?source=app&next=%2Fapp%2Fprofiles", "green"],
  ["▣", "QR პროდუქტები", "სტიკერები, ბრელოკები და სამაჯურები", "/app/store", "rose"],
  ["◇", "მომსახურება და პაკეტები", "Nice • Premium • Amazing", "/account/subscriptions?source=app", "gold"],
];
export default function Products() {
  return (
    <main className="pc">
      <div className="pw">
        <header>
          <small>KOMPASI</small>
          <h1>ჰაბი</h1>
          <Link href="/login?source=app">შესვლა</Link>
        </header>
        <div className="guestNotice">👁&nbsp;&nbsp; სტუმრის რეჟიმი — დაათვალიერეთ თავისუფლად</div>
        <section>
          {hub.map(([icon, name, note, href, color]) => (
            <Link href={href} key={name} className={color}>
              <i>{icon}</i>
              <span>
                <b>{name}</b>
                <small>{note}</small>
              </span>
              <em>›</em>
            </Link>
          ))}
        </section>
      </div>
      <style jsx global>{`
        .pc {
          min-height:100vh;
          overflow-x: hidden;
          background:linear-gradient(90deg,#f0faff,#d6edfc);
          color: #163a52;
          font-family: Inter, Arial, sans-serif;
        }
        .pc, .pc * {
          box-sizing: border-box;
        }
        .pw {
          width:min(390px,100%);
          margin: auto;
          padding:42px 20px 112px;
        }
        .pc header{height:52px;display:flex;align-items:center;justify-content:space-between;background:#fff}
        .pc header small {
          color: #1478d4;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 1px;
        }
        .pc h1{margin:1px 0 0;color:#082b52;font-size:27px;line-height:1}
        .pc header>a{width:90px;height:38px;display:grid;place-items:center;border-radius:12px;background:#086ed9;color:#fff;text-decoration:none;font-size:10px;font-weight:900}
        .guestNotice{height:38px;margin-top:10px;padding:9px 12px;border-radius:12px;background:#e3f2ff;color:#085cad;font-size:10px;font-weight:900}
        .pc section {
          margin-top:10px;
          width: 100%;
          max-width: 100%;
          display: grid;
          grid-template-columns: 1fr;
          gap:10px;
          overflow: hidden;
        }
        .pc section a {
          width: 100%;
          min-width: 0;
          height:76px;min-height:76px;padding:13px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #d9e5f0;
          border:0;border-radius:18px;
          background:#fff;
          color: #173652;
          text-decoration: none;
          box-shadow:0 6px 16px rgba(8,38,71,.08);
        }
        .pc section i {
          width:46px;height:46px;
          display: grid;
          place-items: center;
          flex:0 0 46px;
          border-radius:14px;
          background:#086ed9;color:#fff;font-size:19px;
          font-style: normal;
        }
        .pc section span {
          min-width: 0;
          flex: 1;
        }
        .pc section b,
        .pc section small {
          display: block;
        }
        .pc section b {
          font-size:14px;
        }
        .pc section small {
          margin-top: 5px;
          color: #778b9e;
          font-size:10px;line-height:1.3;
        }
        .pc section em {
          color: #1763c2;
          font-size: 20px;
          font-style: normal;
        }
        .pc section a.green i{background:#0aa369;color:#fff}.pc section a.green em{color:#0aa369}
        .pc section a.rose i{background:#6e4dcc;color:#fff}.pc section a.rose em{color:#6e4dcc}
        .pc section a.gold i{background:#ed801f;color:#fff}.pc section a.gold em{color:#ed801f}
        .pc section a:hover{border-color:#b9d8f8;transform:translateY(-1px);box-shadow:0 14px 30px rgba(4,42,91,.16)}
        @media (max-width: 380px) {
          .pc section {
            grid-template-columns: 1fr;
          }
          .pc section a{height:76px;min-height:76px}
        }
      `}</style>
    </main>
  );
}
