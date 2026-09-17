"use client";

import Link from "next/link";

const hub = [
  ["＋", "პროფილის რეგისტრაცია", "აირჩიეთ სასურველი პროფილი და დაიწყეთ რეგისტრაცია", "/app/add", "blue"],
  ["▤", "პროფილების მართვა", "შექმნილი პროფილების ნახვა და მართვა", "/app/profiles", "green"],
  ["♧", "სანდო პირი და უფლებები", "არჩეულ პროფილზე უსაფრთხო წვდომის მართვა", "/account/admin?source=app", "violet"],
  ["▣", "QR პროდუქტების შეკვეთა", "აირჩიეთ და ონლაინ შეიძინეთ საჭირო QR პროდუქტი", "/app/store", "rose"],
  ["◇", "მომსახურება და პაკეტები", "გაეცანით მომსახურების პირობებსა და პაკეტებს", "/account/subscriptions?source=app", "gold"],
];
export default function Products() {
  return (
    <main className="pc">
      <div className="pw">
        <header>
          <small><i /> KOMPASI ჰაბი</small>
          <h1>ჰაბი</h1>
          <p>პროფილები, წვდომები და მომსახურება ერთ სივრცეში.</p>
        </header>
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
          min-height: 100vh;
          overflow-x: hidden;
          background:
            radial-gradient(circle at 20% 5%,rgba(83,174,242,.38),transparent 31%),
            linear-gradient(180deg,#0a4c8a 0%,#063b72 100%);
          color: #fff;
          font-family:"Noto Sans Georgian","Sylfaen",Inter,Arial,sans-serif;
        }
        .pc, .pc * {
          box-sizing: border-box;
        }
        .pw {
          width: min(480px, calc(100% - 24px));
          margin: auto;
          padding: 27px 0 104px;
        }
        .pc header small {
          display:flex;
          align-items:center;
          gap:7px;
          color: #a9f0d8;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 1.2px;
        }
        .pc header small i{width:7px;height:7px;border-radius:50%;background:#2bdca3;box-shadow:0 0 0 5px rgba(43,220,163,.12)}
        .pc h1 {
          margin: 11px 0 0;
          max-width: 420px;
          font-size: 31px;
          line-height: 1.18;
        }
        .pc header p {
          margin: 8px 0 0;
          max-width:390px;
          color: #c7dfef;
          font-size: 11px;
          line-height: 1.5;
        }
        .pc section {
          margin-top: 18px;
          width: 100%;
          max-width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
          overflow: visible;
        }
        .pc section a {
          width: 100%;
          min-width: 0;
          height: 132px;
          min-height: 132px;
          padding: 13px;
          display: grid;
          grid-template-columns: 1fr 25px;
          grid-template-rows: 42px 1fr 22px;
          align-items: start;
          gap: 8px;
          border: 1px solid rgba(255,255,255,.72);
          border-radius: 19px;
          color: #fff;
          text-decoration: none;
          box-shadow: 0 14px 30px rgba(1,25,57,.2),inset 0 1px 0 rgba(255,255,255,.8);
        }
        .pc section a:nth-child(5){grid-column:1/3;width:calc(50% - 5px);justify-self:center}
        .pc section i {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          grid-column:1/3;
          border-radius: 13px;
          background: rgba(255,255,255,.17);
          color:#fff;
          box-shadow:inset 0 0 0 1px rgba(255,255,255,.18);
          font-size: 18px;
          font-style: normal;
        }
        .pc section span {
          grid-column:1/3;
          min-width: 0;
          align-self:end;
        }
        .pc section b,
        .pc section small {
          display: block;
        }
        .pc section b {
          font-size: 13px;
          line-height:1.25;
        }
        .pc section small {
          margin-top: 5px;
          color: rgba(255,255,255,.8);
          font-size: 9.5px;
          line-height: 1.45;
          line-height: 1.3;
        }
        .pc section em {
          grid-column:2;
          grid-row:3;
          align-self:end;
          justify-self:end;
          width:22px;
          height:22px;
          display:grid;
          place-items:center;
          border-radius:8px;
          background:rgba(255,255,255,.16);
          color: #fff;
          font-size: 18px;
          font-style: normal;
        }
        .pc section a.blue{background:radial-gradient(circle at 100% 0,rgba(112,217,255,.42),transparent 45%),linear-gradient(145deg,#176bd0,#06468d)}
        .pc section a.green{background:radial-gradient(circle at 100% 0,rgba(118,255,211,.4),transparent 44%),linear-gradient(145deg,#129b79,#05604f)}
        .pc section a.violet{background:radial-gradient(circle at 100% 0,rgba(216,167,255,.38),transparent 44%),linear-gradient(145deg,#7957d8,#44308f)}
        .pc section a.rose{background:radial-gradient(circle at 100% 0,rgba(255,184,203,.42),transparent 44%),linear-gradient(145deg,#d34c78,#8f2851)}
        .pc section a.gold{background:radial-gradient(circle at 100% 0,rgba(255,238,151,.4),transparent 44%),linear-gradient(145deg,#d49325,#8b5812)}
        .pc section a:hover{border-color:#fff;transform:translateY(-2px);box-shadow:0 18px 36px rgba(1,21,49,.3),inset 0 1px 0 rgba(255,255,255,.25)}
        @media (max-width: 380px) {
          .pw{width:min(480px,calc(100% - 20px))}.pc section{gap:7px}.pc section a{height:122px;min-height:122px;padding:10px;border-radius:17px}.pc section i{width:36px;height:36px}.pc section b{font-size:12px}.pc section small{font-size:8.5px;line-height:1.3}
        }
      `}</style>
    </main>
  );
}
